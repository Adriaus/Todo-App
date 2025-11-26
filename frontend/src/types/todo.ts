// src/types/todo.ts
export interface User {
  id: number;
  email: string;
  username: string;
  full_name: string | null;
  role: 'admin' | 'manager' | 'user';
  is_active: boolean;
  created_at: string;
}

export interface Todo {
  id: number;
  title: string;
  description: string | null;
  completed: boolean;
  priority: string;
  due_date: string | null;
  created_at: string;
  updated_at: string;
  creator_id: number;
  assignee_id: number | null;
  team_id: number | null;
  creator: User;
  assignee: User | null;
}

export interface CreateTodoRequest {
  title: string;
  description: string | null;
  priority?: string;
  due_date?: string | null;
  assignee_id?: number | null;
  team_id?: number | null;
}

export interface UpdateTodoRequest {
  completed?: boolean;
  title?: string;
  description?: string | null;
  priority?: string;
  due_date?: string | null;
  assignee_id?: number | null;
}

export interface Team {
  id: number;
  name: string;
  description: string | null;
  created_at: string;
  created_by: number;
}