import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion'; // Import AnimatePresence for modal animations
import { API_BASE_URL } from "../config";

// Lucide icons for a polished look
import { Search, XCircle, User, Mail, MapPin, Briefcase, Filter, RefreshCcw, X, ChevronDown } from 'lucide-react';

const ExploreInvestors = () => {
  const [investors, setInvestors] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter states
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [availableRegions, setAvailableRegions] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState(''); // Changed to single select
  const [availableRoles, setAvailableRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState(''); // Changed to single select

  // New filter states for demonstration
  const [availableStages, setAvailableStages] = useState([]);
  const [selectedStage, setSelectedStage] = useState('');
  const [availableIndustries, setAvailableIndustries] = useState([]);
  const [selectedIndustry, setSelectedIndustry] = useState('');
  const [availableDealSizes, setAvailableDealSizes] = useState([]);
  const [selectedDealSize, setSelectedDealSize] = useState('');

  useEffect(() => {
    const fetchInvestors = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('Token not found. Please log in.');
          setError('Authentication token not found. Please log in.');
          setLoading(false);
          return;
        }

        const response = await axios.get(
          `${API_BASE_URL}/api/investors`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log('API response for investors:', response.data);

        if (response.data && Array.isArray(response.data.data)) {
          let fetchedInvestors = response.data.data;

          // --- START: ADDING DUMMY DATA FOR DEMO PURPOSES ---
          // In a real application, these fields (investmentStage, industry, preferredDealSize)
          // would come directly from your backend API response for each investor.
          const stages = ['Seed', 'Series A', 'Series B', 'Series C', 'Growth', 'Public'];
          const industries = ['SaaS', 'FinTech', 'HealthTech', 'AI/ML', 'E-commerce', 'Biotech', 'Clean Energy', 'EdTech', 'Consumer Goods'];
          const dealSizes = ['< $500K', '$500K - $1M', '$1M - $5M', '$5M - $20M', '> $20M'];

          fetchedInvestors = fetchedInvestors.map(inv => ({
            ...inv,
            // Assign a random dummy value if the field doesn't exist
            investmentStage: inv.investmentStage || stages[Math.floor(Math.random() * stages.length)],
            industry: inv.industry || industries[Math.floor(Math.random() * industries.length)],
            preferredDealSize: inv.preferredDealSize || dealSizes[Math.floor(Math.random() * dealSizes.length)],
          }));
          // --- END: ADDING DUMMY DATA FOR DEMO PURPOSES ---

          setInvestors(fetchedInvestors);

          // Extract unique values for filter options from the (potentially augmented) data
          const uniqueRegions = [...new Set(fetchedInvestors.map(inv => inv.location).filter(Boolean))].sort();
          const uniqueRoles = [...new Set(fetchedInvestors.map(inv => inv.role).filter(Boolean))].sort();
          const uniqueStages = [...new Set(fetchedInvestors.map(inv => inv.investmentStage).filter(Boolean))].sort();
          const uniqueIndustries = [...new Set(fetchedInvestors.map(inv => inv.industry).filter(Boolean))].sort();
          const uniqueDealSizes = [...new Set(fetchedInvestors.map(inv => inv.preferredDealSize).filter(Boolean))].sort();

          setAvailableRegions(['', ...uniqueRegions]); // Add empty option for "All"
          setAvailableRoles(['', ...uniqueRoles]);
          setAvailableStages(['', ...uniqueStages]);
          setAvailableIndustries(['', ...uniqueIndustries]);
          setAvailableDealSizes(['', ...uniqueDealSizes]);

        } else if (Array.isArray(response.data)) {
          // Fallback if data is directly an array (less common for API responses)
          let fetchedInvestors = response.data;
          // Apply dummy data augmentation here too if necessary
          setInvestors(fetchedInvestors);
          // Extract unique filters from this format as well
          const uniqueRegions = [...new Set(fetchedInvestors.map(inv => inv.location).filter(Boolean))].sort();
          const uniqueRoles = [...new Set(fetchedInvestors.map(inv => inv.role).filter(Boolean))].sort();
          setAvailableRegions(['', ...uniqueRegions]);
          setAvailableRoles(['', ...uniqueRoles]);
        } else {
          console.error('Invalid investor data format:', response.data);
          setError('Failed to load investor data due to unexpected format.');
        }
      } catch (err) {
        console.error('Error fetching investors:', err);
        if (err.response) {
          setError(`Error: ${err.response.status} - ${err.response.data.message || 'Server error'}`);
        } else if (err.request) {
          setError('Error: No response from server. Check your network connection.');
        } else {
          setError('Error: An unexpected error occurred while fetching investors.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchInvestors();
  }, []);

  // Handlers for filter dropdown changes
  const handleRegionChange = (e) => setSelectedRegion(e.target.value);
  const handleRoleChange = (e) => setSelectedRole(e.target.value);
  const handleStageChange = (e) => setSelectedStage(e.target.value);
  const handleIndustryChange = (e) => setSelectedIndustry(e.target.value);
  const handleDealSizeChange = (e) => setSelectedDealSize(e.target.value);

  // Clear all filters and search query
  const clearFilters = () => {
    setSearchQuery('');
    setSelectedRegion('');
    setSelectedRole('');
    setSelectedStage('');
    setSelectedIndustry('');
    setSelectedDealSize('');
    // Optionally, close the modal after clearing
    // setShowFilterModal(false);
  };

  // Combine search and filter logic
  const filteredInvestors = investors.filter((inv) => {
    const lowerCaseSearchQuery = searchQuery.toLowerCase();

    const matchesSearch =
      inv.name?.toLowerCase().includes(lowerCaseSearchQuery) ||
      inv.email?.toLowerCase().includes(lowerCaseSearchQuery) ||
      inv.location?.toLowerCase().includes(lowerCaseSearchQuery) ||
      inv.role?.toLowerCase().includes(lowerCaseSearchQuery) ||
      inv.investmentStage?.toLowerCase().includes(lowerCaseSearchQuery) || // Search new fields
      inv.industry?.toLowerCase().includes(lowerCaseSearchQuery) ||
      inv.preferredDealSize?.toLowerCase().includes(lowerCaseSearchQuery);


    const matchesRegion = selectedRegion === '' || inv.location === selectedRegion;
    const matchesRole = selectedRole === '' || inv.role === selectedRole;
    const matchesStage = selectedStage === '' || inv.investmentStage === selectedStage;
    const matchesIndustry = selectedIndustry === '' || inv.industry === selectedIndustry;
    const matchesDealSize = selectedDealSize === '' || inv.preferredDealSize === selectedDealSize;

    return matchesSearch && matchesRegion && matchesRole && matchesStage && matchesIndustry && matchesDealSize;
  });

  // Framer Motion variants for staggered list animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 50 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, scale: 0.9, y: 50, transition: { duration: 0.2 } }
  };

  return (
    <div className="relative min-h-screen flex"> {/* Changed to flex for sidebar layout */}
      {/* Background Gradient & Animated Shapes */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 dark:from-gray-950 dark:via-purple-950 dark:to-blue-950 z-0">
        <div className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-blue-300 dark:bg-blue-800 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-pink-300 dark:bg-purple-800 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/3 h-1/3 bg-purple-300 dark:bg-pink-800 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      {/* Dashboard-like Sidebar (Placeholder - you'd integrate your actual dashboard sidebar here) */}
      {/* For a true dashboard layout, this part would likely be in a parent layout component */}
      <aside className="relative z-20 w-64 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-xl border-r border-white/30 dark:border-gray-700/50 flex-shrink-0
                      hidden md:flex flex-col py-8 px-4 overflow-y-auto">
        <div className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">
          Investify Pro
        </div>
        <nav className="flex-1 space-y-2">
          {/* Example Nav Links - replace with your actual sidebar links */}
          <Link to="/dashboard" className="flex items-center p-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-gray-700 hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-200">
            <span className="mr-3">📊</span> Dashboard
          </Link>
          <Link to="/startups" className="flex items-center p-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-gray-700 hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-200">
            <span className="mr-3">🚀</span> Explore Startups
          </Link>
          <Link to="/investors" className="flex items-center p-3 rounded-lg text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-gray-700/50 font-semibold">
            <span className="mr-3">💰</span> Explore Investors
          </Link>
          <Link to="/profile" className="flex items-center p-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-gray-700 hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-200">
            <span className="mr-3">👤</span> My Profile
          </Link>
          {/* More links */}
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 px-4 sm:px-6 lg:px-8 py-8 md:py-12 overflow-y-auto">
        <div className="max-w-7xl mx-auto"> {/* Max width for the content inside main */}
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-5xl font-extrabold text-center text-gray-800 dark:text-white mb-6 leading-tight"
          >
            Connect with Key Investors
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-xl text-center text-gray-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto"
          >
            Discover and engage with a curated list of investors looking for the next big idea.
          </motion.p>

          {/* Search Bar & Filter Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-12"
          >
            <div className="relative w-full max-w-lg sm:max-w-md flex-1">
              <input
                type="text"
                placeholder="Search investors by name, email, location, or role..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-6 py-3 pl-12 border border-gray-300 dark:border-gray-700 rounded-full bg-white dark:bg-gray-800 text-lg text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-3 focus:ring-blue-500/50 shadow-md"
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 h-6 w-6" />
            </div>
            <button
              onClick={() => setShowFilterModal(true)}
              className="px-6 py-3 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition duration-200 flex items-center justify-center shadow-md w-full sm:w-auto"
            >
              <Filter className="mr-2 h-5 w-5" /> Filter Options
            </button>
          </motion.div>

          {/* Loading State */}
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center min-h-[40vh] text-blue-600 dark:text-blue-400"
            >
              <svg className="animate-spin h-12 w-12 text-current" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="mt-4 text-xl font-medium">Fetching potential investors...</p>
            </motion.div>
          )}

          {/* Error State */}
          {error && !loading && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-center bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 py-4 px-6 rounded-lg mb-6 text-lg font-medium border border-red-200 dark:border-red-700 max-w-xl mx-auto"
            >
              <XCircle className="h-5 w-5 mr-3" />
              <p>{error}</p>
            </motion.div>
          )}

          {/* Investor Cards Display */}
          {!loading && !error && filteredInvestors.length > 0 ? (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            >
              {filteredInvestors.map((investor) => (
                <motion.div
                  key={investor._id}
                  variants={itemVariants}
                  whileHover={{ scale: 1.03, zIndex: 10 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-xl rounded-3xl p-6 border border-white/30 dark:border-gray-700/50 cursor-pointer overflow-hidden group"
                >
                  <Link to={`/investors/${investor._id}`} className="block">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition duration-200">
                      <User className="inline-block mr-2 h-6 w-6 text-blue-500 dark:text-blue-400" />
                      {investor.name || "Unnamed Investor"}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 text-base mb-4 line-clamp-2">
                      <Mail className="inline-block mr-2 h-4 w-4 text-gray-500 dark:text-gray-400" />
                      {investor.email || "No email available."}
                    </p>
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-4 space-y-1">
                      <p className="flex items-center">
                        <MapPin className="mr-2 h-4 w-4" />
                        <strong>Region:</strong> {investor.location || 'N/A'}
                      </p>
                      <p className="flex items-center">
                        <Briefcase className="mr-2 h-4 w-4" />
                        <strong>Role:</strong> {investor.role || 'N/A'}
                      </p>
                      {/* Displaying new dummy filter fields */}
                      <p className="flex items-center">
                        <span className="mr-2 text-blue-500">📈</span>
                        <strong>Stage:</strong> {investor.investmentStage || 'N/A'}
                      </p>
                      <p className="flex items-center">
                        <span className="mr-2 text-green-500">🏭</span>
                        <strong>Industry:</strong> {investor.industry || 'N/A'}
                      </p>
                      <p className="flex items-center">
                        <span className="mr-2 text-purple-500">💸</span>
                        <strong>Deal Size:</strong> {investor.preferredDealSize || 'N/A'}
                      </p>
                    </div>
                  </Link>

                  <div className="flex mt-4 space-x-2">
                    <button className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition duration-200 text-sm">
                      View Profile
                    </button>
                    <button className="flex-1 bg-gray-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-gray-600 transition duration-200 text-sm">
                      Message
                    </button>
                    <button className="flex-1 border border-blue-500 text-blue-600 dark:text-blue-400 px-4 py-2 rounded-lg font-semibold hover:bg-blue-50 dark:hover:bg-gray-700 transition duration-200 text-sm">
                      Pitch Idea
                    </button>
                  </div>

                  {/* Overlay for hover effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl pointer-events-none"></div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            // No Investors Found Message
            !loading && !error && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mt-20 p-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/30 dark:border-gray-700/50 max-w-2xl mx-auto"
              >
                <h3 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
                  No Investors Found!
                </h3>
                <p className="text-lg text-gray-600 dark:text-gray-300">
                  It looks like there are no investors to display right now, or your filters didn't match any.
                </p>
                <p className="text-md text-gray-500 dark:text-gray-400 mt-2">
                  Try adjusting your search or clearing the filters.
                </p>
              </motion.div>
            )
          )}
        </div>
      </main>

      {/* Filter Modal */}
      <AnimatePresence>
        {showFilterModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 dark:bg-black/80 z-50 flex items-center justify-center p-4"
            onClick={() => setShowFilterModal(false)} // Close modal when clicking outside
          >
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-white dark:bg-gray-900 rounded-lg shadow-2xl p-6 md:p-8 w-full max-w-md max-h-[90vh] overflow-y-auto relative"
              onClick={(e) => e.stopPropagation()} // Prevent modal from closing when clicking inside
            >
              <button
                onClick={() => setShowFilterModal(false)}
                className="absolute top-4 right-4 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
              >
                <X size={24} />
              </button>

              <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6 flex items-center">
                <Filter className="mr-3 h-8 w-8 text-blue-600 dark:text-blue-400" />
                Filter Investors
              </h2>

              <div className="space-y-6">
                {/* Region Dropdown */}
                <div>
                  <label htmlFor="regionFilter" className="block text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">Region</label>
                  <div className="relative">
                    <select
                      id="regionFilter"
                      value={selectedRegion}
                      onChange={handleRegionChange}
                      className="block w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                    >
                      <option value="">All Regions</option>
                      {availableRegions.map((region) => (
                        <option key={region} value={region}>{region}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none" />
                  </div>
                </div>

                {/* Role Dropdown */}
                <div>
                  <label htmlFor="roleFilter" className="block text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">Role</label>
                  <div className="relative">
                    <select
                      id="roleFilter"
                      value={selectedRole}
                      onChange={handleRoleChange}
                      className="block w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                    >
                      <option value="">All Roles</option>
                      {availableRoles.map((role) => (
                        <option key={role} value={role}>{role}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none" />
                  </div>
                </div>

                {/* Investment Stage Dropdown (Dummy Data) */}
                <div>
                  <label htmlFor="stageFilter" className="block text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">Investment Stage</label>
                  <div className="relative">
                    <select
                      id="stageFilter"
                      value={selectedStage}
                      onChange={handleStageChange}
                      className="block w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                    >
                      <option value="">All Stages</option>
                      {availableStages.map((stage) => (
                        <option key={stage} value={stage}>{stage}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none" />
                  </div>
                </div>

                {/* Industry Focus Dropdown (Dummy Data) */}
                <div>
                  <label htmlFor="industryFilter" className="block text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">Industry Focus</label>
                  <div className="relative">
                    <select
                      id="industryFilter"
                      value={selectedIndustry}
                      onChange={handleIndustryChange}
                      className="block w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                    >
                      <option value="">All Industries</option>
                      {availableIndustries.map((industry) => (
                        <option key={industry} value={industry}>{industry}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none" />
                  </div>
                </div>

                {/* Preferred Deal Size Dropdown (Dummy Data) */}
                <div>
                  <label htmlFor="dealSizeFilter" className="block text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">Preferred Deal Size</label>
                  <div className="relative">
                    <select
                      id="dealSizeFilter"
                      value={selectedDealSize}
                      onChange={handleDealSizeChange}
                      className="block w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                    >
                      <option value="">Any Size</option>
                      {availableDealSizes.map((size) => (
                        <option key={size} value={size}>{size}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none" />
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-end space-x-4">
                <button
                  onClick={clearFilters}
                  className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition duration-200 flex items-center"
                >
                  <RefreshCcw className="mr-2 h-5 w-5" /> Clear All
                </button>
                <button
                  onClick={() => setShowFilterModal(false)}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition duration-200 flex items-center"
                >
                  Apply Filters
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ExploreInvestors;