// src/pages/dashboard/DashboardInstructions.jsx
import React from 'react';
import { useAuth } from '../../context/AuthContext'; // CORRECTED: Go up two levels to src/context

// Import the specific dashboard components with CORRECTED relative paths
// Assuming FounderDashboard, InvestorDashboard, AdminDashboard are in src/components/
import FounderDashboard from '../../components/FounderDashboard'; // CORRECTED: Go up two levels to src/components
import InvestorDashboard from '../../components/InvestorDashboard'; // CORRECTED: Go up two levels to src/components
import AdminDashboard from '../../components/AdminDashboard';     // CORRECTED: Go up two levels to src/components

const DashboardInstructions = () => { // Renamed component to match file name for clarity
  const { user, loading } = useAuth(); // Get the current user and loading state from your auth context

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center h-full text-gray-500 dark:text-gray-400">
        <p>Loading user data...</p>
      </div>
    );
  }

  if (!user) {
    // This case should ideally be caught by AuthenticatedLayout/PrivateRoute,
    // but it's good to have a fallback.
    return (
      <div className="flex flex-1 items-center justify-center h-full text-gray-500 dark:text-gray-400">
        <p>Please log in to view the dashboard.</p>
      </div>
    );
  }

  // Render dashboard based on user role
  switch (user.role) {
    case 'founder':
      return <FounderDashboard />;
    case 'investor':
      return <InvestorDashboard />;
    case 'admin':
      return <AdminDashboard />;
    default:
      // Fallback for roles that don't have a specific dashboard
      return (
        <div className="flex flex-1 flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400">
          <h1 className="text-3xl font-bold mb-4">Access Denied</h1>
          <p className="text-lg text-center">Your role ({user.role}) does not have a designated dashboard view.</p>
          <p className="text-sm mt-2">Please contact support if you believe this is an error.</p>
        </div>
      );
  }
};

export default DashboardInstructions; // Export with the correct name