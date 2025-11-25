// src/hooks/actions/deleteTodo.ts
import { todoApi } from '../../api/todoApi';
import { Todo } from '../../types/todo';

export const deleteTodo = async (
  id: number,
  todos: Todo[],
  setTodos: (todos: Todo[]) => void,
  setError: (msg: string) => void
) => {
  try {
    await todoApi.delete(id);
    setTodos(todos.filter(todo => todo.id !== id));
    setError('');
  } catch (err) {
    setError('Fehler beim Löschen des Todos');
    console.error(err);
  }
};
