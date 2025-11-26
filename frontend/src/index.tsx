// index.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import AppRouter from './Router';  // Importiere die neue Router-Datei (siehe unten)
import { AuthProvider } from './context/AuthContext';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <AuthProvider>
      <AppRouter />  
    </AuthProvider>
  </React.StrictMode>
);