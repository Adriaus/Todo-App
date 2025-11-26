import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, Users, CheckSquare } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  const isManagerOrAdmin = user.role === 'manager' || user.role === 'admin';

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link to="/" className="text-xl font-bold text-blue-600">
              TaskManager
            </Link>
            
            <div className="flex space-x-4">
              <Link
                to="/"
                className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition"
              >
                <CheckSquare size={20} />
                <span>Aufgaben</span>
              </Link>
              
              {isManagerOrAdmin && (
                <Link
                  to="/teams"
                  className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition"
                >
                  <Users size={20} />
                  <span>Teams</span>
                </Link>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-sm">
              <p className="text-gray-700 font-medium">{user.full_name || user.username}</p>
              <p className="text-gray-500 text-xs capitalize">{user.role}</p>
            </div>
            
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:text-red-600 transition"
            >
              <LogOut size={20} />
              <span>Abmelden</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};