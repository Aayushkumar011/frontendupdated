// src/context/ThemeContext.jsx - FINAL REPLACEMENT (Corrected for data-theme attribute AND Tailwind 'dark' class)

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
    // State to hold the current theme.
    // Initialize from localStorage, fallback to system preference, then 'light'.
    const [theme, setTheme] = useState(() => {
        try {
            const storedTheme = localStorage.getItem('theme');
            if (storedTheme) {
                return storedTheme;
            }
            // Check system preference
            if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                return 'dark';
            }
            return 'light';
        } catch (error) {
            console.error("Failed to read theme from localStorage or system preference:", error);
            return 'light'; // Default to light if there's an issue
        }
    });

    // Effect to apply the 'data-theme' attribute and 'dark' class to the html element, and save preference
    useEffect(() => {
        const root = document.documentElement; // This refers to the <html> tag

        // Always set the data-theme attribute based on the current theme state
        root.setAttribute('data-theme', theme);

        // Manage the 'dark' class for Tailwind CSS's darkMode: 'class'
        if (theme === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }

        // Save the current theme preference to localStorage
        try {
            localStorage.setItem('theme', theme);
        } catch (error) {
            console.error("Failed to save theme to localStorage:", error);
        }
    }, [theme]); // Rerun this effect whenever the 'theme' state changes

    // Function to toggle the theme between 'light' and 'dark'
    const toggleTheme = () => {
        setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
    };

    // Memoize the context value to prevent unnecessary re-renders
    const contextValue = useMemo(() => ({
        theme,
        toggleTheme,
    }), [theme]);

    return (
        <ThemeContext.Provider value={contextValue}>
            {children}
        </ThemeContext.Provider>
    );
};

// Custom hook to easily consume the theme context
export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === null) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};