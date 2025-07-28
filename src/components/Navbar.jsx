// src/components/Navbar.jsx - UPDATED TO USE CUSTOM THEME CLASSES
import React from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, Bell, Sun, Moon, Menu } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Navbar = ({ toggleSidebar }) => {
    const { theme, toggleTheme } = useTheme();

    return (
        <nav className="fixed top-0 w-full z-40 bg-theme-nav-bg backdrop-blur-md bg-opacity-90 text-theme-text shadow-sm transition duration-300 h-16 flex items-center px-6">
            <div className="flex items-center">
                {/* Sidebar Toggle Button (visible on md screens down) */}
                <button
                    onClick={toggleSidebar}
                    // Use theme-aware colors for button and hover
                    className="p-2 rounded-full text-theme-text-secondary hover:bg-theme-card-hover-bg-light transition-colors duration-200 mr-4 md:hidden focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-label="Toggle sidebar"
                >
                    <Menu size={24} />
                </button>

                {/* Minimal branding for logged-in view */}
                {/* Changed to text-theme-heading-primary for consistency with other navbars */}
                <Link to="/home-dashboard" className="text-2xl font-bold text-theme-heading-primary">
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
                    // Use theme-aware colors for button and hover
                    className="p-2 rounded-full text-theme-text-secondary hover:bg-theme-card-hover-bg-light transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    // Use theme-aware colors for button and hover
                    className="p-2 rounded-full text-theme-text-secondary hover:bg-theme-card-hover-bg-light transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-label="Notifications"
                >
                    <Bell size={24} />
                </button>

                {/* Themes Toggle Button */}
                <button
                    onClick={toggleTheme}
                    // Use theme-aware colors for button and hover
                    className="p-2 rounded-full text-theme-text-secondary hover:bg-theme-card-hover-bg-light transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-label="Toggle theme"
                >
                    {theme === 'dark' ? <Sun size={24} /> : <Moon size={24} />}
                </button>
            </div>
        </nav>
    );
};

export default Navbar;