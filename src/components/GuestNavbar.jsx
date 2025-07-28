// src/components/GuestNavbar.jsx - UPDATED TO USE CUSTOM THEME CLASSES
import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom'; // Keep NavLink for other active states
import { Menu, X, Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext'; // Import useTheme

const GuestNavbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const { theme, toggleTheme } = useTheme(); // Get theme and toggleTheme from context

    const toggleMenu = () => setMenuOpen(!menuOpen);

    // Define a class for the navigational links, including active state
    // Use text-theme-text for default, and a specific theme color for active/hover
    const navLinkClass = (isActive) =>
        `text-lg font-medium transition-colors duration-200
        ${isActive
            ? 'text-blue-600 dark:text-blue-400' // Keep these specific for active state if they don't map to a generic theme var
            : 'text-theme-text-secondary hover:text-blue-500 dark:hover:text-blue-300' // Use secondary text for default, specific blue for hover
        }`;

    // Define a class for mobile links
    const mobileLinkClass = ({ isActive }) =>
        `block px-4 py-2 rounded-md text-base font-medium transition-colors duration-200
        ${isActive
            ? 'bg-theme-card-hover-bg-light text-blue-600 dark:text-blue-400' // Use a theme-aware background for active
            : 'text-theme-text hover:bg-theme-card-hover-bg-light' // Use theme-text for default mobile links
        }`;


    return (
        <nav className="fixed top-0 w-full z-50 bg-theme-nav-bg text-theme-text shadow-md transition backdrop-blur-md duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
                {/* Branding */}
                {/* Adjust branding text color to use a theme variable if desired, e.g., text-theme-heading-primary */}
                <Link to="/" className="text-2xl font-bold text-blue-600 dark:text-white">
                    PitchBridge
                </Link>

                {/* Desktop Links */}
                <div className="hidden md:flex space-x-6 items-center">
                    <NavLink
                        to="/"
                        className={({ isActive }) => navLinkClass(isActive)}
                    >
                        Home
                    </NavLink>

                    <NavLink
                        to="/explore"
                        className={({ isActive }) => navLinkClass(isActive)}
                    >
                        Explore
                    </NavLink>

                    <NavLink
                        to="/login"
                        // Using explicit classes for buttons or mapping to button theme vars
                        className="px-4 py-2 rounded-md text-white bg-theme-button-primary-bg hover:bg-theme-button-primary-hover"
                    >
                        Login
                    </NavLink>
                    <NavLink
                        to="/register"
                        // Using explicit classes for buttons or mapping to button theme vars
                        className="px-4 py-2 rounded-md border border-theme-button-secondary-border text-theme-button-secondary-text hover:bg-theme-button-secondary-hover-alt"
                    >
                        Register
                    </NavLink>

                    {/* Theme Toggle Button */}
                    <button
                        onClick={toggleTheme}
                        // Use theme-aware colors for the button background/text
                        className="ml-2 p-1 rounded-full bg-theme-button-secondary-bg text-theme-text-secondary hover:bg-theme-card-hover-bg-light transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        aria-label="Toggle dark mode"
                    >
                        {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                    </button>
                </div>

                {/* Mobile Menu Toggle and Dark Mode Button */}
                <div className="md:hidden flex items-center space-x-3">
                    <button
                        onClick={toggleTheme}
                        // Use theme-aware colors for the button background/text
                        className="p-1 rounded-full text-theme-text hover:bg-theme-card-hover-bg-light transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        aria-label="Toggle dark mode"
                    >
                        {theme === 'dark' ? <Sun size={22} /> : <Moon size={22} />}
                    </button>
                    <button
                        onClick={toggleMenu}
                        className="text-theme-text focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md p-1"
                        aria-label={menuOpen ? "Close menu" : "Open menu"}
                    >
                        {menuOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>
                </div>
            </div>

            {/* Mobile Links */}
            {menuOpen && (
                <div className="md:hidden bg-theme-section-bg px-4 pt-2 pb-4 space-y-2 border-t border-theme-border">
                    <NavLink to="/" onClick={toggleMenu} className={mobileLinkClass}>Home</NavLink>
                    <NavLink to="/explore" onClick={toggleMenu} className={mobileLinkClass}>Explore</NavLink>
                    <NavLink to="/login" onClick={toggleMenu} className={mobileLinkClass}>Login</NavLink>
                    <NavLink to="/register" onClick={toggleMenu} className={mobileLinkClass}>Register</NavLink>
                </div>
            )}
        </nav>
    );
};

export default GuestNavbar;