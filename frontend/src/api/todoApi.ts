// src/api/todoApi.ts
import { apiClient } from './authApi';
import { Todo, CreateTodoRequest, UpdateTodoRequest } from '../types/todo';

export const todoApi = {
  async getAll(): Promise<Todo[]> {
    const response = await apiClient.get('/api/todos');
    return response.data;
  },

  async create(data: CreateTodoRequest): Promise<Todo> {
    const response = await apiClient.post('/api/todos', data);
    return response.data;
  },

  async update(id: number, data: UpdateTodoRequest): Promise<Todo> {
    const response = await apiClient.put(`/api/todos/${id}`, data);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await apiClient.delete(`/api/todos/${id}`);
  }
};