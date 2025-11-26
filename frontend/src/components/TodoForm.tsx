// src/components/TodoForm.tsx
import React, { useState, FormEvent, ChangeEvent, useEffect } from 'react';
import { userApi } from '../api/authApi';
import { User } from '../types/todo';
import { useAuth } from '../context/AuthContext';

interface TodoFormProps {
  onSubmit: (title: string, description: string, assigneeId?: number, priority?: string) => Promise<void>;
}

export const TodoForm: React.FC<TodoFormProps> = ({ onSubmit }) => {
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [assigneeId, setAssigneeId] = useState<string>('');
  const [priority, setPriority] = useState<string>('medium');
  const [users, setUsers] = useState<User[]>([]);
  const { user } = useAuth();

  const isManagerOrAdmin = user?.role === 'manager' || user?.role === 'admin';

  useEffect(() => {
    if (isManagerOrAdmin) {
      fetchUsers();
    }
  }, [isManagerOrAdmin]);

  const fetchUsers = async () => {
    try {
      const userData = await userApi.getUsers();
      setUsers(userData);
    } catch (err) {
      console.error('Failed to fetch users:', err);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      await onSubmit(
        title, 
        description, 
        assigneeId ? parseInt(assigneeId) : undefined,
        priority
      );
      setTitle('');
      setDescription('');
      setAssigneeId('');
      setPriority('medium');
    } catch (err) {
      // Error wird im Hook behandelt
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Neue Aufgabe</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-medium mb-2">
            Titel *
          </label>
          <input
            type="text"
            placeholder="Titel..."
            value={title}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-medium mb-2">
            Beschreibung
          </label>
          <textarea
            placeholder="Beschreibung (optional)..."
            value={description}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Priorität
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="low">Niedrig</option>
              <option value="medium">Mittel</option>
              <option value="high">Hoch</option>
            </select>
          </div>

          {isManagerOrAdmin && (
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Zuweisen an
              </label>
              <select
                value={assigneeId}
                onChange={(e) => setAssigneeId(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Niemand</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.full_name || u.username}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-200 font-medium"
        >
          Aufgabe erstellen
        </button>
      </form>
    </div>
  );
};