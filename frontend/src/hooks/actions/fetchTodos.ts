// src/hooks/actions/fetchTodos.ts
import { todoApi } from '../../api/todoApi';
import { Todo } from '../../types/todo';

export const fetchTodos = async (
  setTodos: (todos: Todo[]) => void,
  setError: (msg: string) => void,
  setLoading: (state: boolean) => void
) => {
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
