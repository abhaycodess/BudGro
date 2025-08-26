import React from 'react';
import { Navigate } from 'react-router-dom';

// Checks localStorage for a JWT token
export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem('budgro_token');
  return token ? children : <Navigate to="/login" replace />;
}
