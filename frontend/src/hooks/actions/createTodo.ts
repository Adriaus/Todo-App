// src/hooks/actions/createTodo.ts
import { todoApi } from '../../api/todoApi';
import { Todo } from '../../types/todo';

export const createTodo = async (
  title: string,
  description: string,
  assigneeId: number | undefined,
  priority: string | undefined,
  todos: Todo[],
  setTodos: (todos: Todo[]) => void,
  setError: (msg: string) => void
) => {
  try {
    const newTodo = await todoApi.create({
      title: title.trim(),
      description: description.trim() || null,
      priority: priority || 'medium',
      assignee_id: assigneeId
    });

    setTodos([...todos, newTodo]);
    setError('');
  } catch (err) {
    setError('Fehler beim Erstellen des Todos');
    console.error(err);
    throw err;
  }
};