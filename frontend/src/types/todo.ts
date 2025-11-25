// src/types/todo.ts
export interface Todo {
  id: number;
  title: string;
  description: string | null;
  completed: boolean;
}

export interface CreateTodoRequest {
  title: string;
  description: string | null;
}

export interface UpdateTodoRequest {
  completed?: boolean;
  title?: string;
  description?: string | null;
}