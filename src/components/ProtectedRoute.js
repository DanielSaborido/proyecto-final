import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ element, allowedRoles }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" />;
  }
  const userType = token.charAt(0) === 'C' ? 'customer' : 'user';
  if (!allowedRoles.includes(userType)) {
    return <Navigate to="/" />;
  }
  return element;
};

export default ProtectedRoute;
