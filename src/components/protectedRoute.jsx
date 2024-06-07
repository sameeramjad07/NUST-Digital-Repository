import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token); // Update isAuthenticated based on token existence
  }, []);

  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
