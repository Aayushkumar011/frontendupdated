import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion'; // Import AnimatePresence for modal animations
import { API_BASE_URL } from "../config";

// Lucide icons for a polished look
import {
  Search,
  XCircle,
  User,
  Mail,
  MapPin,
  Briefcase,
  Filter,
  RefreshCcw,
  X,
  ChevronDown,
  Sparkles, // Added Sparkles for AI Match
} from 'lucide-react';

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

  // Dummy data for filter options - these would typically come from your backend
  const dummyFilterOptions = {
    stages: ['Seed', 'Series A', 'Series B', 'Series C', 'Growth', 'Public'],
    industries: ['SaaS', 'FinTech', 'HealthTech', 'AI/ML', 'E-commerce', 'Biotech', 'Clean Energy', 'EdTech', 'Consumer Goods'],
    dealSizes: ['< $500K', '$500K - $1M', '$1M - $5M', '$5M - $20M', '> $20M'],
    regions: ['North America', 'Europe', 'Asia', 'South America', 'Africa', 'Oceania'],
    roles: ['Angel Investor', 'Venture Capitalist', 'Private Equity', 'Corporate VC', 'Family Office'],
  };


  useEffect(() => {
    const fetchInvestors = async () => {
      setLoading(true); // Set loading to true before fetching
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
          const stages = dummyFilterOptions.stages;
          const industries = dummyFilterOptions.industries;
          const dealSizes = dummyFilterOptions.dealSizes;

          fetchedInvestors = fetchedInvestors.map(inv => ({
            ...inv,
            // Assign a random dummy value if the field doesn't exist
            investmentStage: inv.investmentStage || stages[Math.floor(Math.random() * stages.length)],
            industry: inv.industry || industries[Math.floor(Math.random() * industries.length)],
            preferredDealSize: inv.preferredDealSize || dealSizes[Math.floor(Math.random() * dealSizes.length)],
            // Add dummy location and role if they don't exist for demo
            location: inv.location || dummyFilterOptions.regions[Math.floor(Math.random() * dummyFilterOptions.regions.length)],
            role: inv.role || dummyFilterOptions.roles[Math.floor(Math.random() * dummyFilterOptions.roles.length)],
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
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchInvestors();
  }, []); // Empty dependency array means this runs once on mount

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

          {/* Search Bar & Filter/AI Match Buttons */}
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
            
            {/* Updated Filter Button */}
            <button
              onClick={() => setShowFilterModal(true)}
              className="px-6 py-3 bg-gray-700 dark:bg-gray-800 text-gray-200 dark:text-gray-300 rounded-full font-medium hover:bg-gray-600 dark:hover:bg-gray-700 transition duration-200 flex items-center justify-center shadow-md w-full sm:w-auto border border-gray-600 dark:border-gray-700"
            >
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="4" y1="6" x2="4" y2="6"></line>
                <line x1="4" y1="10" x2="4" y2="20"></line>
                <line x1="12" y1="6" x2="12" y2="20"></line>
                <line x1="20" y1="6" x2="20" y2="10"></line>
                <line x1="20" y1="14" x2="20" y2="20"></line>
                <circle cx="4" cy="8" r="2"></circle>
                <circle cx="12" cy="4" r="2"></circle>
                <circle cx="20" cy="12" r="2"></circle>
              </svg>
              Filter
              <ChevronDown className="ml-2 h-4 w-4" />
            </button>

            {/* Updated AI Match Button */}
            <button
              onClick={() => alert("AI Match functionality coming soon!")} // Placeholder for AI Match logic
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full font-medium hover:from-purple-700 hover:to-blue-700 transition duration-200 flex items-center justify-center shadow-md w-full sm:w-auto"
            >
              <Sparkles className="mr-2 h-5 w-5" /> AI Match
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

                  {/* Updated Profile Action Buttons - Now Vertical */}
                  <div className="flex flex-col mt-4 space-y-3">
                    <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition duration-200 text-sm">
                      View Profile
                    </button>
                    <button className="w-full bg-gray-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-gray-600 transition duration-200 text-sm">
                      Message
                    </button>
                    <button className="w-full border border-blue-500 text-blue-600 dark:text-blue-400 px-4 py-2 rounded-lg font-semibold hover:bg-blue-50 dark:hover:bg-gray-700 transition duration-200 text-sm">
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
                className="text-center mt-20 p-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/30 dark:border-700/50 max-w-2xl mx-auto"
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

      {/* Updated Filter Modal */}
      <AnimatePresence>
        {showFilterModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 dark:bg-black/80 z-50 flex items-start justify-center pt-20 p-4"
            onClick={() => setShowFilterModal(false)} // Close modal when clicking outside
          >
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-white dark:bg-gray-900 rounded-lg shadow-2xl p-6 md:p-8 w-full max-w-md max-h-[80vh] overflow-y-auto relative"
              onClick={(e) => e.stopPropagation()} // Prevent modal from closing when clicking inside
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center">
                  Filters
                </h2>
                <div className="flex items-center gap-3">
                  <button
                    onClick={clearFilters}
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 text-sm font-medium"
                  >
                    Clear All
                  </button>
                  <button
                    onClick={() => setShowFilterModal(false)}
                    className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>
              </div>

              <div className="space-y-6">
                {/* Stage Section */}
                <div>
                  <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-3">Stage</h3>
                  <div className="flex flex-wrap gap-2">
                    {dummyFilterOptions.stages.map((stage) => (
                      <button
                        key={stage}
                        onClick={() => setSelectedStage(selectedStage === stage ? '' : stage)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                          selectedStage === stage
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                      >
                        {stage}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Industry Section */}
                <div>
                  <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-3">Industry</h3>
                  <div className="flex flex-wrap gap-2">
                    {dummyFilterOptions.industries.map((industry) => (
                      <button
                        key={industry}
                        onClick={() => setSelectedIndustry(selectedIndustry === industry ? '' : industry)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                          selectedIndustry === industry
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                      >
                        {industry}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Funding Range Section */}
                <div>
                  <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-3">Funding Range</h3>
                  <div className="flex flex-wrap gap-2">
                    {dummyFilterOptions.dealSizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedDealSize(selectedDealSize === size ? '' : size)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                          selectedDealSize === size
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Region Section */}
                <div>
                  <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-3">Region</h3>
                  <div className="flex flex-wrap gap-2">
                    {dummyFilterOptions.regions.map((region) => (
                      <button
                        key={region}
                        onClick={() => setSelectedRegion(selectedRegion === region ? '' : region)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                          selectedRegion === region
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                      >
                        {region}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Role Section */}
                <div>
                  <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-3">Role</h3>
                  <div className="flex flex-wrap gap-2">
                    {dummyFilterOptions.roles.map((role) => (
                      <button
                        key={role}
                        onClick={() => setSelectedRole(selectedRole === role ? '' : role)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                          selectedRole === role
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                      >
                        {role}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <button
                  onClick={() => setShowFilterModal(false)}
                  className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition duration-200"
                >
                  Apply Filters ({filteredInvestors.length} results)
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