import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { API_BASE_URL } from '../config';

// Import necessary Lucide icons for messages
import {
  CheckCircle,
  XCircle,
} from 'lucide-react';

// --- IMPORT YOUR ASSET ICONS ---
import emailIcon from '../assets/email.gif';

import Navbar from '../components/Navbar';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setMessage('');

    try {
      const res = await axios.post(`${API_BASE_URL}/api/users/forgot-password`, { email });
      setMessage(res.data.message || "Password reset link sent to your email!");
    } catch (err) {
      console.error('Forgot password error:', err.response || err);
      setError(err.response?.data?.message || 'Failed to send reset link. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-center items-center overflow-hidden">
      {/* Background Gradient & Animated Shapes - Using theme variables */}
      <div className="absolute inset-0 bg-theme-gradient-start z-0">
        <div className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-theme-blob-1 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-theme-blob-2 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/3 h-1/3 bg-theme-blob-3 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <Navbar className="absolute top-0 w-full z-10" />

      <div className="flex justify-center items-center px-4 py-16 w-full z-10">
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          // Using theme variables for form background and border
          className="relative w-full max-w-md bg-theme-card-bg/90 backdrop-blur-md p-10 rounded-3xl shadow-2xl border border-theme-border/50 transform transition-all duration-300 hover:shadow-3xl"
        >
          {/* Form Header */}
          <div className="mb-8 text-center">
            {/* Using theme variable for heading text */}
            <h2 className="text-4xl font-extrabold text-theme-heading-primary mb-2 tracking-tight">
              Forgot Password?
            </h2>
            {/* Using theme variable for secondary text */}
            <p className="text-lg text-theme-text-secondary">
              Enter your email to receive a password reset link.
            </p>
          </div>

          {/* --- Error Message --- */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              // Keeping hardcoded colors for error/success as they are typically universal
              className="flex items-center justify-center bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 py-3 px-5 rounded-lg mb-6 text-sm font-medium border border-red-200 dark:border-red-700"
            >
              <XCircle className="h-4 w-4 mr-2" />
              {error}
            </motion.div>
          )}

          {/* --- Success Message --- */}
          {message && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              // Keeping hardcoded colors for error/success as they are typically universal
              className="flex items-center justify-center bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 py-3 px-5 rounded-lg mb-6 text-sm font-medium border border-green-200 dark:border-green-700"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              {message}
            </motion.div>
          )}

          <div className="space-y-6">
            {/* Email Input Field with Custom Icon - Using theme variables */}
            <div className="relative flex items-center border border-theme-input-border rounded-xl px-5 py-3 shadow-sm focus-within:ring-3 focus-within:ring-blue-500/50 focus-within:border-theme-input-border-hover transition-all duration-300 group hover:border-theme-input-border-hover">
              <img src={emailIcon} alt="Email icon" className="h-6 w-6 mr-3 opacity-80" />
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                // Using theme variables for input text and placeholder
                className="w-full bg-transparent outline-none text-theme-text placeholder-theme-input-placeholder text-lg flex-grow"
                aria-label="Email address"
                autoComplete="email"
              />
            </div>

            {/* 🟦 Button - Using theme variables */}
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              // Using theme variables for button background, hover, and text
              className="w-full bg-theme-button-primary-bg hover:bg-theme-button-primary-hover text-theme-button-primary-text font-extrabold py-3 rounded-xl transition duration-300 flex items-center justify-center disabled:opacity-60 disabled:cursor-not-allowed text-lg shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-blue-500/50"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-6 w-6 mr-3 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sending Link...
                </>
              ) : (
                'Send Reset Link'
              )}
            </motion.button>
          </div>

          {/* "Remembered your password?" link - Using theme variables */}
          <p className="mt-8 text-base text-center text-theme-text-secondary">
            Remembered your password?{' '}
            <Link to="/login" className="text-theme-link hover:text-theme-link-hover font-bold hover:underline transition duration-200">
              Login here
            </Link>
          </p>
        </motion.form>
      </div>
    </div>
  );
};

export default ForgotPassword;