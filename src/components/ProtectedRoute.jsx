// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import FullPageSpinner from './FullPageSpinner'; // We'll create this in Step 3

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, loading } = useAuth(); // Get user and loading state from AuthContext

  // 1. While authentication status is being determined, show a spinner.
  if (loading) {
    return <FullPageSpinner />;
  }

  // 2. If not loading, but no user is found, redirect to the login page.
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 3. If a user is found, but their role doesn't match the allowed roles for this route.
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // You can redirect to an unauthorized page or dashboard
    return <Navigate to="/unauthorized" replace />; // Make sure you have an /unauthorized route
  }

  // 4. If user is logged in and has the correct role, render the child routes.
  return <Outlet />; // Outlet renders the nested components (e.g., Dashboard, Profile)
};

export default ProtectedRoute;