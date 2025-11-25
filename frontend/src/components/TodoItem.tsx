// src/components/TodoItem.tsx
import React from 'react';
import { Todo } from '../types/todo';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: number, completed: boolean) => void;
  onDelete: (id: number) => void;
}

export const TodoItem: React.FC<TodoItemProps> = ({ todo, onToggle, onDelete }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition duration-200">
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => onToggle(todo.id, todo.completed)}
          className="mt-1 h-5 w-5 text-blue-500 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
        />
        <div className="flex-1">
          <h3 className={`text-lg font-medium ${
            todo.completed ? 'line-through text-gray-400' : 'text-gray-800'
          }`}>
            {todo.title}
          </h3>
          {todo.description && (
            <p className={`text-sm mt-1 ${
              todo.completed ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {todo.description}
            </p>
          )}
        </div>
        <button
          onClick={() => onDelete(todo.id)}
          className="text-red-500 hover:text-red-700 font-medium px-3 py-1 rounded hover:bg-red-50 transition duration-200"
        >
          Löschen
        </button>
      </div>
    </div>
  );
};