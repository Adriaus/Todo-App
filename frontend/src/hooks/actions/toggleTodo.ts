// src/hooks/actions/toggleTodo.ts
import { todoApi } from '../../api/todoApi';
import { Todo } from '../../types/todo';

export const toggleTodo = async (
  id: number,
  completed: boolean,
  todos: Todo[],
  setTodos: (todos: Todo[]) => void,
  setError: (msg: string) => void
) => {
  try {
    const updatedTodo = await todoApi.update(id, { completed: !completed });

    setTodos(todos.map(todo => (todo.id === id ? updatedTodo : todo)));
    setError('');
  } catch (err) {
    setError('Fehler beim Aktualisieren des Todos');
    console.error(err);
  }
};
