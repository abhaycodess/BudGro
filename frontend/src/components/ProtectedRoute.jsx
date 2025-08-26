import React from 'react';
import { Navigate } from 'react-router-dom';

// Checks localStorage for a login flag
export default function ProtectedRoute({ children }) {
  const isLoggedIn = localStorage.getItem('budgro_logged_in') === 'true';
  return isLoggedIn ? children : <Navigate to="/login" replace />;
}
