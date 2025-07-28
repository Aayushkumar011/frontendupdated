// src/pages/Login.jsx - CORRECTED
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { API_BASE_URL } from '../config';
import { useAuth } from '../context/AuthContext';

import { XCircle } from 'lucide-react';
import emailIcon from '../assets/email.gif';
import lockIcon from '../assets/lock.gif';

import AuthNavbar from '../components/AuthNavbar';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await axios.post(`${API_BASE_URL}/api/users/login`, { email, password });

      console.log('Login API Response:', res.data); // This will now correctly show the response you shared!

      // --- CRUCIAL CHANGE START ---
      const token = res.data.token; // The token is directly on res.data
      
      // The user data (name, email, role, _id) is ALSO directly on res.data,
      // but we want to exclude the 'token' field when storing the 'user' object.
      // We can use object destructuring to separate 'token' and collect the rest into 'userData'.
      const { token: _, ...userData } = res.data; // Assign token to a throwaway variable '_', collect rest into userData
      // --- CRUCIAL CHANGE END ---

      if (!token || !userData) { // This check should now pass if token and other user data exist
          throw new Error("Invalid response from server: token or user data missing.");
      }

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData)); // Store the user object without the token

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
    <div className="relative min-h-screen flex flex-col justify-center items-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 dark:from-gray-950 dark:via-purple-950 dark:to-blue-950 z-0">
        <div className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-blue-300 dark:bg-blue-800 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-pink-300 dark:bg-purple-800 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/3 h-1/3 bg-purple-300 dark:bg-pink-800 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <AuthNavbar className="absolute top-0 w-full z-10" />

      <div className="flex justify-center items-center px-4 py-16 w-full z-10">
        <motion.form
          onSubmit={handleLogin}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="relative w-full max-w-md bg-white/90 dark:bg-gray-900/90 backdrop-blur-md p-10 rounded-3xl shadow-2xl border border-white/30 dark:border-gray-700/50 transform transition-all duration-300 hover:shadow-3xl"
        >
          <div className="mb-8 text-center">
            <h2 className="text-4xl font-extrabold text-gray-800 dark:text-white mb-2 tracking-tight">Welcome Back</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">Log in to your account.</p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-center bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 py-3 px-5 rounded-lg mb-6 text-sm font-medium border border-red-200 dark:border-red-700"
            >
              <XCircle className="h-4 w-4 mr-2" />
              {error}
            </motion.div>
          )}

          <div className="space-y-6">
            <div className="relative flex items-center border border-gray-300 dark:border-gray-700 rounded-xl px-5 py-3 shadow-sm focus-within:ring-3 focus-within:ring-blue-500/50 focus-within:border-blue-500 dark:focus-within:border-blue-500 transition-all duration-300 group hover:border-blue-400 dark:hover:border-blue-600">
              <img src={emailIcon} alt="Email icon" className="h-6 w-6 mr-3 opacity-80" />
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-transparent outline-none text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-lg flex-grow"
                aria-label="Email address"
                autoComplete="email"
              />
            </div>

            <div className="relative flex items-center border border-gray-300 dark:border-gray-700 rounded-xl px-5 py-3 shadow-sm focus-within:ring-3 focus-within:ring-blue-500/50 focus-within:border-blue-500 dark:focus-within:border-blue-500 transition-all duration-300 group hover:border-blue-400 dark:hover:border-blue-600">
              <img src={lockIcon} alt="Password icon" className="h-6 w-6 mr-3 opacity-80" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-transparent outline-none text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-lg flex-grow"
                aria-label="Password"
                autoComplete="current-password"
              />
            </div>

            <div className="text-right">
                <Link to="/forgot-password" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium text-sm hover:underline transition duration-200">
                    Forgot password?
                </Link>
            </div>

            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-3 rounded-xl transition duration-300 flex items-center justify-center disabled:opacity-60 disabled:cursor-not-allowed text-lg shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-blue-500/50"
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

          <p className="mt-8 text-base text-center text-gray-600 dark:text-gray-400">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-bold hover:underline transition duration-200">
              Register here
            </Link>
          </p>
        </motion.form>
      </div>
    </div>
  );
};

export default Login;