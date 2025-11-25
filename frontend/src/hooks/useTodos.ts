// src/hooks/useTodos.ts
import { useState, useEffect } from 'react';
import { Todo } from '../types/todo';

import { fetchTodos } from './actions/fetchTodos';
import { createTodo } from './actions/createTodo';
import { toggleTodo } from './actions/toggleTodo';
import { deleteTodo } from './actions/deleteTodo';

export const useTodos = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    fetchTodos(setTodos, setError, setLoading);
  }, []);

  return {
    todos,
    loading,
    error,
    createTodo: (title: string, desc: string) =>
      createTodo(title, desc, todos, setTodos, setError),
    toggleTodo: (id: number, completed: boolean) =>
      toggleTodo(id, completed, todos, setTodos, setError),
    deleteTodo: (id: number) =>
      deleteTodo(id, todos, setTodos, setError),
    refetch: () => fetchTodos(setTodos, setError, setLoading),
  };
};
