import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Effect to load user and token from localStorage on initial component mount
    useEffect(() => {
        const loadUserFromLocalStorage = () => {
            try {
                const storedToken = localStorage.getItem('token');
                const storedUser = localStorage.getItem('user');

                if (storedToken && storedUser) {
                    const parsedUser = JSON.parse(storedUser);
                    setUser(parsedUser);
                    console.log("AuthContext: User loaded from localStorage:", parsedUser);
                } else {
                    // If either token or user is missing, clear both to ensure a clean state
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    setUser(null);
                    console.log("AuthContext: No valid session found in localStorage or partial data. Cleared.");
                }
            } catch (error) {
                console.error("AuthContext: Failed to load user from localStorage, clearing data:", error);
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        loadUserFromLocalStorage();
    }, []); // Empty dependency array means this runs only once on mount

    // Effect to persist user to localStorage whenever `user` state changes
    useEffect(() => {
        if (user) {
            localStorage.setItem('user', JSON.stringify(user));
            console.log("AuthContext: User state persisted to localStorage:", user);
        } else {
            localStorage.removeItem('user');
            console.log("AuthContext: User state cleared from localStorage.");
        }
    }, [user]); // Re-run when 'user' state changes

    // Logout function - only manages authentication state, no navigation
    const logout = useCallback(() => {
        console.log("AuthContext: Logging out user and clearing state.");
        setUser(null); // This triggers the useEffect above to clear 'user' from localStorage
        localStorage.removeItem('token'); // Explicitly remove token here
    }, []);

    // Function to update user profile data in state and localStorage
    // This will be called from components like Profile.jsx
    const updateUserProfile = useCallback((updates) => {
        setUser(prevUser => {
            const newUser = { ...prevUser, ...updates };
            // The useEffect for user will handle saving to localStorage
            return newUser;
        });
        console.log("AuthContext: User profile updated in state with:", updates);
    }, []);


    // Memoize the context value to prevent unnecessary re-renders of consumers
    const authContextValue = useMemo(() => ({
        user,
        setUser, // Keep setUser if you need it for external updates (e.g., during login)
        logout,
        updateUserProfile, // Add the new update function
        loading
    }), [user, loading, logout, updateUserProfile]);

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