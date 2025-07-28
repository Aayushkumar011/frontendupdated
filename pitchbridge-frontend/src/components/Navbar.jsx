// src/components/Navbar.jsx - This is the correct version for your logged-in user view
import React from 'react';
import { Link } from 'react-router-dom';
// Import necessary Lucide icons
import { MessageSquare, Bell, Sun, Moon, Menu } from 'lucide-react'; 
// Import the useTheme hook from your ThemeContext
// Ensure this path is correct based on your project structure
// If ThemeContext is in 'src/context/ThemeContext.jsx', then '../context/ThemeContext' is correct.
import { useTheme } from '../context/ThemeContext';

// Accept toggleSidebar as a prop (and ideally isSidebarOpen too, though not strictly used in its rendering here)
const Navbar = ({ toggleSidebar }) => { // Removed isSidebarOpen from props if not directly needed for icon change here
  // Use the useTheme hook to get the current theme and the toggle function
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="fixed top-0 w-full z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md text-gray-800 dark:text-white shadow-sm transition duration-300 h-16 flex items-center px-6">
      <div className="flex items-center">
        {/* Sidebar Toggle Button (visible on md screens down) */}
        {/* This button calls the toggleSidebar function passed from parent (Startups.jsx) */}
        <button
          onClick={toggleSidebar} 
          className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200 mr-4 md:hidden focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Toggle sidebar"
        >
          <Menu size={24} /> {/* Menu icon for sidebar toggle */}
        </button>

        {/* Minimal branding for logged-in view */}
        <Link to="/home-dashboard" className="text-2xl font-bold text-blue-600 dark:text-white">
          PitchBridge
        </Link>
      </div>

      {/* Right section: Action Buttons (Messages, Notifications, Theme Toggle) */}
      <div className="flex-1 flex justify-end items-center space-x-4">
        {/* Messages Button */}
        <button
          onClick={() => {
            console.log('Messages button clicked!');
            // TODO: Add navigation to messages page or open a chat modal
          }}
          className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Messages"
        >
          <MessageSquare size={24} />
        </button>

        {/* Notifications Button */}
        <button
          onClick={() => {
            console.log('Notifications button clicked!');
            // TODO: Add navigation to notifications page or open a dropdown
          }}
          className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Notifications"
        >
          <Bell size={24} />
        </button>

        {/* Themes Toggle Button */}
        <button
          onClick={toggleTheme} 
          className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun size={24} /> : <Moon size={24} />}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;