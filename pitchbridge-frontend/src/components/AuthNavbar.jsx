import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Sun, Moon, Bell, MessageSquare } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

const AuthNavbar = ({ toggleSidebar, navbarHeight }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth(); // Keeping logout here, as it was in the last full version

  return (
    <nav
      className={`
        bg-white/80 dark:bg-gray-900/80 backdrop-blur-md
        text-gray-800 dark:text-white shadow-md
        transition duration-300
        h-${navbarHeight} flex items-center justify-between px-4 sm:px-6 lg:px-8
        w-full
      `}
    >
      {/* Mobile-only: Sidebar Toggle Button */}
      <div className="flex items-center md:hidden">
        <button
          onClick={toggleSidebar}
          className="text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md p-1"
          aria-label="Toggle sidebar"
        >
          <Menu size={28} />
        </button>
      </div>

      {/* Desktop: Branding or main links - Dashboard text removed */}
      <div className="hidden md:flex flex-1 justify-start items-center">
        <span className="text-2xl font-bold text-gray-900 dark:text-white">
          {/* Dashboard text removed as requested. You can add a logo or different branding here if needed. */}
        </span>
      </div>

      {/* Right-side: User-related actions, notifications, theme toggle */}
      <div className="flex items-center space-x-4">
        {/* Notifications */}
        <Link
          to="/notifications"
          className="text-gray-700 dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-300 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          aria-label="Notifications"
        >
          <Bell size={20} />
        </Link>

        {/* Messages Link */}
        <Link
          to="/messages"
          className="flex items-center text-lg font-medium text-gray-700 dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-300 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          aria-label="Messages"
        >
          <MessageSquare size={20} className="mr-2" />
          {/* Message text intentionally omitted */}
        </Link>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Toggle dark mode"
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>
    </nav>
  );
};

export default AuthNavbar;
