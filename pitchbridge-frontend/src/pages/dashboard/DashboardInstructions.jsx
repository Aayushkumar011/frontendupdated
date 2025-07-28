// src/pages/dashboard/DashboardInstructions.jsx
import React from 'react';
import { Link } from 'react-router-dom'; // Import Link for internal navigation

const DashboardInstructions = () => {
  return (
    <div className="bg-theme-bg text-theme-text min-h-full">
      {/*
        No Navbar or Sidebar rendering here.
        The top Navbar is handled by App.jsx's AppContent.
        The Sidebar is handled by App.jsx's AuthenticatedLayout.
      */}
      <h1 className="text-3xl font-bold text-theme-heading-primary mb-6">Welcome to Your Dashboard!</h1>
      <p className="text-theme-text-secondary mb-4">
        To get started, please follow these instructions:
      </p>
      <div className="bg-theme-card-bg p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-theme-text mb-4">Quick Start Guide</h2>
        <ol className="list-decimal list-inside space-y-2 text-theme-text">
          <li>Complete your <Link to="/profile" className="text-blue-500 hover:underline">profile</Link>.</li>
          <li>Submit your first <Link to="/submit-pitch" className="text-blue-500 hover:underline">pitch</Link>.</li>
          <li>Explore available <Link to="/investors" className="text-blue-500 hover:underline">investors</Link>.</li>
          <li>Review the <Link to="/faq" className="text-blue-500 hover:underline">FAQ section</Link> for common questions.</li>
          <li>Adjust your <Link to="/settings" className="text-blue-500 hover:underline">settings</Link> to personalize your experience.</li>
          {/* Add more specific instructions relevant to your application */}
          <li>Remember to check your <Link to="/notifications" className="text-blue-500 hover:underline">notifications</Link> regularly!</li>
        </ol>
      </div>
      {/* You can add a small welcome image or illustration here if desired */}
      {/* <div className="mt-8 text-center">
        <img src="/path/to/welcome-illustration.svg" alt="Welcome" className="mx-auto h-48" />
      </div> */}
    </div>
  );
};

export default DashboardInstructions;