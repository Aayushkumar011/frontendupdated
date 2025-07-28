// src/components/DashboardHomeNavbar.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext'; // Assuming you have a ThemeContext now
import { Sun, Moon, LogOut, Settings } from 'lucide-react'; // Import icons

const DashboardHomeNavbar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const getDashboardNavLinkPath = () => {
    if (!user) {
      return '/login';
    }
    return '/dashboard';
  };

  const handleLogoutClick = () => {
    logout();
    navigate('/');
  };

  return (
    // FIX 1: Changed 'bg-theme-bg-navbar' to 'bg-theme-nav-bg'
    // FIX 2: Added 'border-b border-theme-border' for the bottom border
    <nav className="fixed top-0 left-0 w-full bg-theme-nav-bg backdrop-blur-md bg-opacity-90 z-50 shadow-md border-b border-theme-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <div className="flex-shrink-0">
            {/* FIX 3: Changed 'text-theme-text' to 'text-theme-heading-primary' for logo text */}
            <Link to="/home-dashboard" className="text-2xl font-bold text-theme-heading-primary flex items-center">
              <div className="relative group mr-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 via-purple-600 to-blue-700 rounded-xl shadow-lg flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-white/20"></div>
                  <div className="relative z-10 flex flex-col items-center">
                    <div className="w-5 h-0.5 bg-white rounded-full mb-0.5 transform -rotate-12"></div>
                    <div className="w-3 h-0.5 bg-white/80 rounded-full"></div>
                  </div>
                </div>
              </div>
              PitchBridge
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="flex-grow flex justify-center">
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                to={getDashboardNavLinkPath()}
                // FIX 4: Changed 'text-theme-text' to 'text-theme-text' (it was correct here)
                // FIX 5: Ensure hover color aligns with theme if possible, or keep specific for brand
                className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-theme-text hover:border-blue-500 hover:text-blue-500 transition-colors duration-200"
              >
                Dashboard
              </Link>
              <Link
                to="/profile"
                className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-theme-text hover:border-blue-500 hover:text-blue-500 transition-colors duration-200"
              >
                Profile
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-theme-text hover:border-blue-500 hover:text-blue-500 transition-colors duration-200"
              >
                Contact
              </Link>
            </div>
          </div>

          {/* Right-aligned Icons */}
          <div className="flex items-center space-x-4">
            {/* Settings Icon */}
            {/* FIX 6: Changed 'text-theme-text' to 'text-theme-text-secondary' for icons (common to be secondary color) */}
            <Link to="/settings" className="p-2 text-theme-text-secondary hover:text-blue-500 transition-colors duration-200">
              <Settings className="w-5 h-5" />
            </Link>

            {/* Dark/Light Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 text-theme-text-secondary hover:text-blue-500 transition-colors duration-200 focus:outline-none"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Logout/Sign In Button logic */}
            {user ? (
              <button
                onClick={handleLogoutClick}
                className="p-2 text-theme-text-secondary hover:text-red-500 transition-colors duration-200 focus:outline-none"
              >
                <LogOut className="w-5 h-5" />
              </button>
            ) : (
              // FIX 7: Use theme variables for the Sign In button
              <Link to="/login" className="bg-theme-button-primary-bg hover:bg-theme-button-primary-hover text-white font-semibold py-2 px-4 rounded-full transition duration-300 shadow-md">
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default DashboardHomeNavbar;