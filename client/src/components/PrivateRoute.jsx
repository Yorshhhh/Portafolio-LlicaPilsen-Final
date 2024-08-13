// PrivateRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Ajusta la ruta según tu estructura

const PrivateRoute = ({ children }) => {
  const { user } = useAuth();

  // Si el usuario no está autenticado, redirige al login
  if (!user) {
    return <Navigate to="/login" />;
  }

  return user ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
