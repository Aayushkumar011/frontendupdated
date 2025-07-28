import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { API_BASE_URL } from '../config';

// Import necessary Lucide icons for messages/select dropdown (if still desired)
// Or replace these with your own success/error icons if you have them in assets
import {
  CheckCircle,
  XCircle,
  ChevronDown // For select dropdown icon
} from 'lucide-react';

import Navbar from '../components/Navbar';

// --- IMPORT YOUR ASSET ICONS ---
// You'll need to import each icon you want to use.
// Adjust the paths based on where Register.jsx is relative to your assets folder.
// Assuming 'Register.jsx' is in 'src/pages' and 'assets' is in 'src/assets':
import userIcon from '../assets/user.gif';
import emailIcon from '../assets/email.gif';
import lockIcon from '../assets/lock.gif';
import ideaIcon from '../assets/idea.gif'; // For startup idea
import teamIcon from '../assets/team.gif'; // For team size
import goalIcon from '../assets/goal.gif'; // For startup stage (using goal.gif as an example)
import coinIcon from '../assets/coin.gif'; // For investment budget
import briefCaseIcon from '../assets/company.gif'; // For interests (using company.gif as an example)
import buildingIcon from '../assets/company.gif'; // For company name (using company.gif)

// If you have specific icons for success/error messages, import them too:
// import successIcon from '../assets/verified.gif';
// import errorIcon from '../assets/cross.gif'; // Assuming you have an X icon

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'founder',
    termsAccepted: false,
    // Founder fields
    idea: '',
    teamSize: '',
    stage: '',
    // Investor fields
    budget: '',
    interests: '',
    companyName: '',
  });

  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
    setError('');
    setSuccessMessage('');
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccessMessage('');

    if (formData.password !== formData.confirmPassword) {
      setIsLoading(false);
      return setError("Passwords do not match. Please re-enter.");
    }
    if (!formData.termsAccepted) {
      setIsLoading(false);
      return setError("You must agree to the Terms & Conditions to register.");
    }

    try {
      const payload = { ...formData };
      delete payload.confirmPassword;
      delete payload.termsAccepted;

      if (payload.role === 'founder') {
        delete payload.budget;
        delete payload.interests;
        delete payload.companyName;
      } else if (payload.role === 'investor') {
        delete payload.idea;
        delete payload.teamSize;
        delete payload.stage;
      } else if (payload.role === 'admin') {
        delete payload.idea;
        delete payload.teamSize;
        delete payload.stage;
        delete payload.budget;
        delete payload.interests;
        delete payload.companyName;
      }

      await axios.post(`${API_BASE_URL}/api/users`, payload);
      setSuccessMessage("Registration successful! Redirecting to login...");
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (err) {
      console.error('Registration error:', err.response || err);
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // --- MAPPED ICONS ---
  // Modify the 'icon' property to use an <img> tag with your imported assets.
  // Add appropriate classes for sizing and styling.
  const commonFields = [
    { name: 'name', type: 'text', placeholder: 'Full Name', icon: <img src={userIcon} alt="User icon" className="h-6 w-6 mr-3 opacity-80" />, autoComplete: "name" },
    { name: 'email', type: 'email', placeholder: 'Email Address', icon: <img src={emailIcon} alt="Email icon" className="h-6 w-6 mr-3 opacity-80" />, autoComplete: "email" },
    { name: 'password', type: 'password', placeholder: 'Password', icon: <img src={lockIcon} alt="Lock icon" className="h-6 w-6 mr-3 opacity-80" />, autoComplete: "new-password" },
    { name: 'confirmPassword', type: 'password', placeholder: 'Confirm Password', icon: <img src={lockIcon} alt="Confirm password icon" className="h-6 w-6 mr-3 opacity-80" />, autoComplete: "new-password" },
  ];

  const founderFields = [
    { name: 'idea', type: 'text', placeholder: 'Your Startup Idea (e.g., AI-powered learning platform)', icon: <img src={ideaIcon} alt="Idea icon" className="h-6 w-6 mr-3 opacity-80" /> },
    { name: 'teamSize', type: 'number', placeholder: 'Team Size (e.g., 5)', icon: <img src={teamIcon} alt="Team size icon" className="h-6 w-6 mr-3 opacity-80" /> },
    { name: 'stage', type: 'text', placeholder: 'Startup Stage (e.g., MVP, Seed, Growth)', icon: <img src={goalIcon} alt="Stage icon" className="h-6 w-6 mr-3 opacity-80" /> }, // Using goal.gif
  ];

  const investorFields = [
    { name: 'budget', type: 'text', placeholder: 'Investment Budget (e.g., $100K - $1M)', icon: <img src={coinIcon} alt="Budget icon" className="h-6 w-6 mr-3 opacity-80" /> },
    { name: 'interests', type: 'text', placeholder: 'Investment Interests (e.g., Tech, Health, Fintech)', icon: <img src={briefCaseIcon} alt="Interests icon" className="h-6 w-6 mr-3 opacity-80" /> }, // Using company.gif
    { name: 'companyName', type: 'text', placeholder: 'Your Company Name', icon: <img src={buildingIcon} alt="Company icon" className="h-6 w-6 mr-3 opacity-80" /> }, // Using company.gif
  ];

  const dynamicFields =
    formData.role === 'founder'
      ? founderFields
      : formData.role === 'investor'
        ? investorFields
        : [];

  return (
    <div className="relative min-h-screen flex flex-col justify-center items-center overflow-hidden">
      {/* Background Gradient & Animated Shapes */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 dark:from-gray-950 dark:via-purple-950 dark:to-blue-950 z-0">
        <div className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-blue-300 dark:bg-blue-800 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-pink-300 dark:bg-purple-800 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/3 h-1/3 bg-purple-300 dark:bg-pink-800 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <Navbar className="absolute top-0 w-full z-10" />

      <div className="flex justify-center items-center px-4 py-16 w-full z-10">
        <motion.form
          onSubmit={handleRegister}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="relative w-full max-w-xl bg-white/90 dark:bg-gray-900/90 backdrop-blur-md p-10 rounded-3xl shadow-2xl border border-white/30 dark:border-gray-700/50 transform transition-all duration-300 hover:shadow-3xl"
        >
          {/* Form Header */}
          <div className="mb-8 text-center">
            <h2 className="text-4xl font-extrabold text-gray-800 dark:text-white mb-2 tracking-tight">
              Join Our Community
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Create your account to get started.
            </p>
          </div>

          {/* --- Error/Success Messages --- */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-center bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 py-3 px-5 rounded-lg mb-6 text-sm font-medium border border-red-200 dark:border-red-700"
            >
              <XCircle className="h-4 w-4 mr-2" /> {/* Still using Lucide XCircle for now */}
              {error}
            </motion.div>
          )}

          {successMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-center bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 py-3 px-5 rounded-lg mb-6 text-sm font-medium border border-green-200 dark:border-green-700"
            >
              <CheckCircle className="h-4 w-4 mr-2" /> {/* Still using Lucide CheckCircle for now */}
              {successMessage}
            </motion.div>
          )}

          <div className="space-y-6">
            {/* Role selection with custom styling */}
            <div className="relative group">
              <label htmlFor="role-select" className="sr-only">Select your role</label>
              <select
                id="role-select"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="block w-full px-5 py-3 border border-gray-300 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-3 focus:ring-blue-500/50 dark:bg-gray-800 dark:text-white appearance-none pr-12 transition-all duration-300 text-lg shadow-sm group-hover:border-blue-400 dark:group-hover:border-blue-600"
                aria-label="Select your role"
              >
                <option value="founder">🚀 Founder (Building a startup)</option>
                <option value="investor">💰 Investor (Looking for opportunities)</option>
                <option value="admin">🛡️ Admin (Platform Administrator)</option>
              </select>
              <ChevronDown className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4 text-gray-500 dark:text-gray-400 h-full w-6" />
            </div>

            {/* Common + Dynamic Form Fields */}
            {[...commonFields, ...dynamicFields].map(({ name, type, placeholder, icon, autoComplete }) => (
              <div key={name} className="relative flex items-center border border-gray-300 dark:border-gray-700 rounded-xl px-5 py-3 shadow-sm focus-within:ring-3 focus-within:ring-blue-500/50 focus-within:border-blue-500 dark:focus-within:border-blue-500 transition-all duration-300 group hover:border-blue-400 dark:hover:border-blue-600">
                {/* Render the custom icon (img tag) */}
                {icon}
                <input
                  type={type}
                  name={name}
                  placeholder={placeholder}
                  value={formData[name]}
                  onChange={handleChange}
                  required
                  className="w-full bg-transparent outline-none text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-lg flex-grow"
                  aria-label={placeholder}
                  autoComplete={autoComplete || "off"}
                />
              </div>
            ))}

            {/* ✅ Terms */}
            <label className="flex items-center text-base text-gray-700 dark:text-gray-300 space-x-3 cursor-pointer select-none">
              <input
                type="checkbox"
                name="termsAccepted"
                checked={formData.termsAccepted}
                onChange={handleChange}
                className="accent-blue-600 h-5 w-5 rounded-md border-gray-400 dark:border-gray-600 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
                aria-required="true"
              />
              <span className="leading-tight">
                I agree to the{' '}
                <a
                  href="/terms"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-semibold underline transition duration-200"
                >
                  Terms & Conditions
                </a>{' '}
                and <a
                  href="/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-semibold underline transition duration-200"
                >
                  Privacy Policy
                </a>.
              </span>
            </label>

            {/* 🟦 Button */}
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
                  Registering...
                </>
              ) : (
                'Create Your Account'
              )}
            </motion.button>
          </div>

          <p className="mt-8 text-base text-center text-gray-600 dark:text-gray-400">
            Already have an account?{' '}
            <a href="/login" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-bold hover:underline transition duration-200">
              Login here
            </a>
          </p>
        </motion.form>
      </div>
    </div>
  );
};

export default Register;