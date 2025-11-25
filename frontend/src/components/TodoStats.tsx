// src/components/TodoStats.tsx
import React from 'react';
import { Todo } from '../types/todo';

interface TodoStatsProps {
  todos: Todo[];
}

export const TodoStats: React.FC<TodoStatsProps> = ({ todos }) => {
  if (todos.length === 0) return null;

  const completedCount = todos.filter(t => t.completed).length;
  const totalCount = todos.length;

  return (
    <div className="mt-6 text-center text-gray-600">
      <p>
        {completedCount} von {totalCount} erledigt
      </p>
    </div>
  );
};