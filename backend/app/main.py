from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
from datetime import timedelta

from app.database import engine, get_db
from app.models import Base, User, Todo, Team, TeamMember, UserRole
from app.schemas import (
    UserCreate, UserResponse, LoginRequest, Token,
    TodoCreate, TodoUpdate, TodoResponse,
    TeamCreate, TeamResponse, TeamMemberResponse
)
from app.auth import (
    get_password_hash, authenticate_user, create_access_token,
    get_current_active_user, require_role, ACCESS_TOKEN_EXPIRE_MINUTES
)

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Todo App API")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============ AUTH ROUTES ============

@app.post("/api/auth/register", response_model=UserResponse)
def register(user: UserCreate, db: Session = Depends(get_db)):
    # Check if user exists
    if db.query(User).filter(User.email == user.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")
    if db.query(User).filter(User.username == user.username).first():
        raise HTTPException(status_code=400, detail="Username already taken")
    
    # Create user
    db_user = User(
        email=user.email,
        username=user.username,
        full_name=user.full_name,
        hashed_password=get_password_hash(user.password),
        role=UserRole.USER
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@app.post("/api/auth/login", response_model=Token)
def login(login_data: LoginRequest, db: Session = Depends(get_db)):
    user = authenticate_user(db, login_data.username, login_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": str(user.id)}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/api/auth/me", response_model=UserResponse)
async def get_me(current_user: User = Depends(get_current_active_user)):
    return current_user

# ============ USER ROUTES ============

@app.get("/api/users", response_model=List[UserResponse])
async def get_users(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    return db.query(User).all()

@app.get("/api/users/{user_id}", response_model=UserResponse)
async def get_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

# ============ TEAM ROUTES ============

@app.post("/api/teams", response_model=TeamResponse)
async def create_team(
    team: TeamCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role([UserRole.ADMIN, UserRole.MANAGER]))
):
    db_team = Team(**team.dict(), created_by=current_user.id)
    db.add(db_team)
    db.commit()
    db.refresh(db_team)
    
    # Add creator as team leader
    team_member = TeamMember(team_id=db_team.id, user_id=current_user.id, role="leader")
    db.add(team_member)
    db.commit()
    
    return db_team

@app.get("/api/teams", response_model=List[TeamResponse])
async def get_teams(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    return db.query(Team).all()

@app.post("/api/teams/{team_id}/members/{user_id}")
async def add_team_member(
    team_id: int,
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role([UserRole.ADMIN, UserRole.MANAGER]))
):
    # Check if team exists
    team = db.query(Team).filter(Team.id == team_id).first()
    if not team:
        raise HTTPException(status_code=404, detail="Team not found")
    
    # Check if user exists
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Check if already member
    existing = db.query(TeamMember).filter(
        TeamMember.team_id == team_id,
        TeamMember.user_id == user_id
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="User already in team")
    
    member = TeamMember(team_id=team_id, user_id=user_id, role="member")
    db.add(member)
    db.commit()
    return {"message": "User added to team"}

# ============ TODO ROUTES ============

@app.get("/api/todos", response_model=List[TodoResponse])
async def get_todos(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    # Users see their own todos + assigned todos
    todos = db.query(Todo).filter(
        (Todo.creator_id == current_user.id) | (Todo.assignee_id == current_user.id)
    ).all()
    return todos

@app.post("/api/todos", response_model=TodoResponse)
async def create_todo(
    todo: TodoCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    db_todo = Todo(**todo.dict(), creator_id=current_user.id)
    db.add(db_todo)
    db.commit()
    db.refresh(db_todo)
    return db_todo

@app.put("/api/todos/{todo_id}", response_model=TodoResponse)
async def update_todo(
    todo_id: int,
    todo_update: TodoUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    db_todo = db.query(Todo).filter(Todo.id == todo_id).first()
    if not db_todo:
        raise HTTPException(status_code=404, detail="Todo not found")
    
    # Check permissions
    if db_todo.creator_id != current_user.id and db_todo.assignee_id != current_user.id:
        if current_user.role not in [UserRole.ADMIN, UserRole.MANAGER]:
            raise HTTPException(status_code=403, detail="Not authorized")
    
    for key, value in todo_update.dict(exclude_unset=True).items():
        setattr(db_todo, key, value)
    
    db.commit()
    db.refresh(db_todo)
    return db_todo

@app.delete("/api/todos/{todo_id}")
async def delete_todo(
    todo_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    db_todo = db.query(Todo).filter(Todo.id == todo_id).first()
    if not db_todo:
        raise HTTPException(status_code=404, detail="Todo not found")
    
    # Only creator or admin can delete
    if db_todo.creator_id != current_user.id and current_user.role != UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    db.delete(db_todo)
    db.commit()
    return {"message": "Todo deleted"}

@app.get("/")
def root():
    return {"message": "Todo App API with Authentication"}