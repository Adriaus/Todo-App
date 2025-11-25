// src/api/todoApi.ts
import axios from 'axios';
import { Todo, CreateTodoRequest, UpdateTodoRequest } from '../types/todo';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export const todoApi = {
  async getAll(): Promise<Todo[]> {
    const response = await axios.get<Todo[]>(`${API_URL}/todos`);
    return response.data;
  },

  async create(data: CreateTodoRequest): Promise<Todo> {
    const response = await axios.post<Todo>(`${API_URL}/todos`, data);
    return response.data;
  },

  async update(id: number, data: UpdateTodoRequest): Promise<Todo> {
    const response = await axios.put<Todo>(`${API_URL}/todos/${id}`, data);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await axios.delete(`${API_URL}/todos/${id}`);
  }
};