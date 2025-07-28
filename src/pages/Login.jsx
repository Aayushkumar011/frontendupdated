// src/pages/Login.jsx - THEMED
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { API_BASE_URL } from '../config';
import { useAuth } from '../context/AuthContext';
// No need to import useTheme directly if only using theme-aware Tailwind classes

import { XCircle } from 'lucide-react';
import emailIcon from '../assets/email.gif';
import lockIcon from '../assets/lock.gif';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { setUser } = useAuth();
    // const { theme } = useTheme(); // No longer directly needed here, as classes handle it

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const res = await axios.post(`${API_BASE_URL}/api/users/login`, { email, password });

            console.log('Login API Response:', res.data);

            const token = res.data.token;
            const { token: _, ...userData } = res.data;

            if (!token || !userData) {
                throw new Error("Invalid response from server: token or user data missing.");
            }

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(userData));

            setUser(userData);

            console.log('Login successful, navigating to /dashboard');
            navigate('/dashboard');
        } catch (err) {
            console.error('Login error:', err.response?.data || err);
            setError(err.response?.data?.message || 'Invalid email or password. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        // Re-added the main container and background elements
        <div className="relative min-h-screen flex flex-col justify-center items-center overflow-hidden">
            {/* Background Gradient & Animated Shapes - Using theme variables */}
            {/* This ensures the background matches Register and ForgotPassword */}
            <div className="absolute inset-0 bg-theme-gradient-start z-0">
                <div className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-theme-blob-1 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
                <div className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-theme-blob-2 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/3 h-1/3 bg-theme-blob-3 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
            </div>

            {/* Content Wrapper */}
            <div className="flex justify-center items-center px-4 py-16 w-full z-10">
                <motion.form
                
                    onSubmit={handleLogin}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                    // Using theme variables for form background and border
                    className="relative w-full max-w-md bg-theme-card-bg/90 backdrop-blur-md p-10 rounded-3xl shadow-2xl border border-theme-border/50 transform transition-all duration-300 hover:shadow-3xl"
                >
                    <div className="mb-8 text-center">
                        <h2 className="text-4xl font-extrabold text-theme-heading-primary mb-2 tracking-tight">Welcome Back</h2>
                        <p className="text-lg text-theme-text-secondary">Log in to your account.</p>
                    </div>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            // Keeping hardcoded colors for error/success as they are typically universal
                            className="flex items-center justify-center bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 py-3 px-5 rounded-lg mb-6 text-sm font-medium border border-red-200 dark:border-700"
                        >
                            <XCircle className="h-4 w-4 mr-2" />
                            {error}
                        </motion.div>
                    )}

                    <div className="space-y-6">
    {/* Email Input Field */}
    <div className="relative flex items-center border border-theme-input-border rounded-xl px-5 py-3 shadow-sm focus-within:ring-3 focus-within:ring-blue-500/50 focus-within:border-theme-input-border-hover transition-all duration-300 group hover:border-theme-input-border-hover bg-transparent">
        <img src={emailIcon} alt="Email icon" className="h-6 w-6 mr-3 opacity-80 " />
        <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full bg-transparent outline-none text-theme-text placeholder-theme-input-placeholder text-lg flex-grow autofill-transparent" // Keep this class
            aria-label="Email address"
            autoComplete="email"
        />
    </div>

    {/* Password Input Field */}
    <div className="relative flex items-center border border-theme-input-border rounded-xl px-5 py-3 shadow-sm focus-within:ring-3 focus-within:ring-blue-500/50 focus-within:border-theme-input-border-hover transition-all duration-300 group hover:border-theme-input-border-hover bg-transparent">
        <img src={lockIcon} alt="Password icon" className="h-6 w-6 mr-3 opacity-80" />
        <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full bg-transparent outline-none text-theme-text placeholder-theme-input-placeholder text-lg flex-grow autofill-transparent" // Keep this class
            aria-label="Password"
            autoComplete="current-password"
        />
    </div>

    <div className="text-right">
        {/* Changed class to explicitly define black for light and white for dark */}
        <Link 
            to="/forgot-password" 
            className="text-black dark:text-white hover:text-gray-700 dark:hover:text-gray-300 font-medium text-sm hover:underline transition duration-200"
        >
            Forgot password?
        </Link>
    </div>

    <motion.button
        type="submit"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full bg-theme-button-primary-bg hover:bg-theme-button-primary-hover text-theme-button-primary-text font-extrabold py-3 rounded-xl transition duration-300 flex items-center justify-center disabled:opacity-60 disabled:cursor-not-allowed text-lg shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-blue-500/50"
        disabled={isLoading}
    >
        {isLoading ? (
            <>
                <svg className="animate-spin h-6 w-6 mr-3 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Logging in...
            </>
        ) : (
            'Login'
        )}
    </motion.button>
</div>

                    <p className="mt-8 text-base text-center text-theme-text-secondary">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-theme-link hover:text-theme-link-hover font-bold hover:underline transition duration-200">
                            Register here
                        </Link>
                    </p>
                </motion.form>
            </div>
        </div>
    );
};

export default Login;