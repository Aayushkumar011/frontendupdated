// src/context/AuthContext.js - CORRECTED
import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Stores the authenticated user object
  const [loading, setLoading] = useState(true); // Indicates if initial auth check is in progress

  // Effect to load user from localStorage on initial component mount
  useEffect(() => {
    const loadUserFromLocalStorage = () => {
      try {
        const storedToken = localStorage.getItem('token'); // Check for token
        const storedUser = localStorage.getItem('user'); // Check for user data

        if (storedToken && storedUser) {
          // Both token and user data must be present for a valid session
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          console.log("AuthContext: User loaded from localStorage:", parsedUser); // Debugging
        } else {
          // Clear any incomplete or invalid data if one is missing
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setUser(null);
          console.log("AuthContext: No valid session found in localStorage."); // Debugging
        }
      } catch (error) {
        console.error("AuthContext: Failed to load user from localStorage:", error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
      } finally {
        setLoading(false); // Authentication check is complete
      }
    };

    loadUserFromLocalStorage();
  }, []); // Runs only once on mount

  // Effect to persist user to localStorage whenever `user` state changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
      console.log("AuthContext: User state persisted to localStorage:", user); // Debugging
    } else {
      // User is null (logged out or no session)
      localStorage.removeItem('user');
      localStorage.removeItem('token'); // Ensure token is also removed
      console.log("AuthContext: User state cleared from localStorage."); // Debugging
    }
  }, [user]); // Runs whenever the `user` state object changes

  // Logout function
  const logout = () => {
    setUser(null); // This will trigger the useEffect above to clear localStorage
    // No explicit localStorage.removeItem here, as useEffect handles it
  };

  // Memoize the context value for performance optimization
  const authContextValue = useMemo(() => ({
    user,
    setUser, // Expose setUser for components like Login to update user data
    logout,
    loading // Expose loading state
  }), [user, setUser, logout, loading]);

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};