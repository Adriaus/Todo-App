// src/Router.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './components/ProtectedRoute';  // Passe den Pfad an (z.B. wenn in components/)
import App from './App';  // Deine Haupt-Todo-Seite
import { LoginPage } from './pages/LoginPage';  // Importiere deine LoginPage (passe Pfad an, z.B. './pages/LoginPage')
import { RegisterPage } from './pages/RegisterPage';  // Importiere deine RegisterPage (passe Pfad an)

// Füge weitere Pages hinzu, falls du welche hast, z.B. eine TeamsPage

const AppRouter: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Öffentliche Routes – kein Login nötig */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Geschützte Routes – redirect zu /login, wenn nicht authenticated */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <App />
            </ProtectedRoute>
          }
        />

        {/* Beispiel für eine Route, die nur für Manager/Admin zugänglich ist */}
        {/* <Route
          path="/teams"
          element={
            <ProtectedRoute requiredRole="manager">
              <TeamsPage />
            </ProtectedRoute>
          }
        /> */}

        {/* Fallback: Redirect zu Login oder einer 404-Seite */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;