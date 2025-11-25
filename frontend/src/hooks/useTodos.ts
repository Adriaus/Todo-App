// src/hooks/useTodos.ts
import { useState, useEffect } from 'react';
import { Todo } from '../types/todo';
import { todoApi } from '../api/todoApi';

export const useTodos = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      setLoading(true);
      const data = await todoApi.getAll();
      setTodos(data);
      setError('');
    } catch (err) {
      setError('Fehler beim Laden der Todos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const createTodo = async (title: string, description: string) => {
    try {
      const newTodo = await todoApi.create({
        title: title.trim(),
        description: description.trim() || null
      });
      setTodos([...todos, newTodo]);
      setError('');
    } catch (err) {
      setError('Fehler beim Erstellen des Todos');
      console.error(err);
      throw err;
    }
  };

  const toggleTodo = async (id: number, completed: boolean) => {
    try {
      const updatedTodo = await todoApi.update(id, { completed: !completed });
      setTodos(todos.map(todo => todo.id === id ? updatedTodo : todo));
      setError('');
    } catch (err) {
      setError('Fehler beim Aktualisieren des Todos');
      console.error(err);
    }
  };

  const deleteTodo = async (id: number) => {
    try {
      await todoApi.delete(id);
      setTodos(todos.filter(todo => todo.id !== id));
      setError('');
    } catch (err) {
      setError('Fehler beim Löschen des Todos');
      console.error(err);
    }
  };

  return {
    todos,
    loading,
    error,
    createTodo,
    toggleTodo,
    deleteTodo,
    refetch: fetchTodos
  };
};