// src/layouts/AuthLayout.jsx

import React, { useState } from 'react';

import AuthNavbar from '../components/AuthNavbar'; // Ensure this is your logged-in navbar
import Sidebar from '../components/Sidebar'; // Ensure this is your sidebar component

const AuthLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Or false, depending on default state

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          isSidebarOpen ? 'ml-64 md:ml-64' : 'ml-0 md:ml-20'
        }`}
      >
        <AuthNavbar toggleSidebar={toggleSidebar} />
        <main className="flex-1 p-6 mt-16 overflow-y-auto"> {/* mt-16 for navbar height */}
          {children}
        </main>
      </div>
    </div>
  );
};

export default AuthLayout;
