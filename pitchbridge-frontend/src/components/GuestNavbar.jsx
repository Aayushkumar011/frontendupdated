// src/components/GuestNavbar.jsx
import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom'; // Keep NavLink for other active states
import { Menu, X, Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext'; // Import useTheme

const GuestNavbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme(); // Get theme and toggleTheme from context

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const linkClass = (isMobile) =>
    `block px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md text-base font-medium transition-colors duration-200`;

  // Define a class for the non-navigational 'Explore' item
  const nonNavigationalClass = `text-lg font-medium text-gray-700 dark:text-gray-200 cursor-not-allowed opacity-70`;


  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md text-gray-800 dark:text-white shadow-md transition duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
        {/* Branding */}
        <Link to="/" className="text-2xl font-bold text-blue-600 dark:text-white">
          PitchBridge
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex space-x-6 items-center">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `text-lg font-medium transition-colors duration-200 ${
                isActive ? 'text-blue-600 dark:text-blue-400' : 'hover:text-blue-500 dark:hover:text-blue-300'
              }`
            }
          >
            Home
          </NavLink>
          {/* EXPLORE: Changed from NavLink to span (or button) and removed 'to' prop */}
          <span className={nonNavigationalClass}>
            Explore {/* No redirection */}
          </span>
          <NavLink
            to="/login"
            className={({ isActive }) =>
              `text-lg font-medium transition-colors duration-200 ${
                isActive ? 'text-blue-600 dark:text-blue-400' : 'hover:text-blue-500 dark:hover:text-blue-300'
              }`
            }
          >
            Login
          </NavLink>
          <NavLink
            to="/register"
            className={({ isActive }) =>
              `text-lg font-medium transition-colors duration-200 ${
                isActive ? 'text-blue-600 dark:text-blue-400' : 'hover:text-blue-500 dark:hover:text-blue-300'
              }`
            }
          >
            Register
          </NavLink>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="ml-2 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Toggle dark mode"
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>

        {/* Mobile Menu Toggle and Dark Mode Button */}
        <div className="md:hidden flex items-center space-x-3">
          <button
            onClick={toggleTheme}
            className="p-1 rounded-full text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Toggle dark mode"
          >
            {theme === 'dark' ? <Sun size={22} /> : <Moon size={22} />}
          </button>
          <button
            onClick={toggleMenu}
            className="text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md p-1"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            {menuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Links */}
      {menuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 px-4 pt-2 pb-4 space-y-2 border-t border-gray-200 dark:border-gray-700">
          <Link to="/" onClick={toggleMenu} className={linkClass(true)}>Home</Link>
          {/* EXPLORE MOBILE: Changed from Link to span (or button) and removed 'to' prop */}
          <span className={linkClass(true) + " cursor-not-allowed opacity-70"} onClick={(e) => e.preventDefault()}>
            Explore {/* No redirection */}
          </span>
          <Link to="/login" onClick={toggleMenu} className={linkClass(true)}>Login</Link>
          <Link to="/register" onClick={toggleMenu} className={linkClass(true)}>Register</Link>
        </div>
      )}
    </nav>
  );
};

export default GuestNavbar;