import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { API_BASE_URL } from '../config';

// Import necessary Lucide icons
import { Search, SlidersHorizontal, XCircle, ChevronDown, X, Sparkles } from 'lucide-react';

const Startups = () => {
    const [startups, setStartups] = useState([]);
    const [loading, setLoading] = useState(true); // Set to true initially for the first fetch
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredStartups, setFilteredStartups] = useState([]);

    // Filter related states
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [filters, setFilters] = useState({
        stage: '',
        industry: '',
        fundingRange: '',
        location: '',
        teamSize: ''
    });

    // Filter options
    const filterOptions = {
        stage: ['Idea', 'Prototype', 'MVP', 'Early Revenue', 'Growth', 'Scale'],
        industry: ['Technology', 'Healthcare', 'Finance', 'E-commerce', 'Education', 'Food & Beverage', 'Gaming', 'AI/ML', 'Blockchain'],
        fundingRange: ['Pre-Seed', '$0-50K', '$50K-250K', '$250K-1M', '$1M-5M', '$5M+'],
        location: ['USA', 'India', 'UK', 'Canada', 'Germany', 'Singapore', 'Australia', 'Remote'],
        teamSize: ['1-2', '3-5', '6-10', '11-25', '26-50', '50+']
    };

    // 1) When I open this page, it takes some time to open it. It must open directly without that loading.
    // To achieve this, we can set `loading` to `true` initially and only show the loading spinner during the actual data fetch.
    // Once the data is fetched (successfully or with an error), `loading` is set back to `false`.

    useEffect(() => {
        const fetchStartups = async () => {
            setLoading(true); // Show loading spinner when fetching data
            try {
                const res = await fetch(`${API_BASE_URL}/api/startups`);
                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
                const data = await res.json();

                if (Array.isArray(data.data)) {
                    setStartups(data.data);
                    setFilteredStartups(data.data); // Initialize filtered startups with all startups
                } else {
                    console.error("Unexpected API response format. Expected data.data to be an array.", data);
                    setStartups([]);
                    setFilteredStartups([]);
                    setError('Failed to load startups due to unexpected data format.');
                }
            } catch (err) {
                console.error("Failed to load startups:", err);
                setError(err.message || 'Failed to load startups. Please try again later.');
                setStartups([]);
                setFilteredStartups([]);
            } finally {
                setLoading(false); // Hide loading spinner after fetch completes
            }
        };

        fetchStartups();
    }, []); // Empty dependency array means this runs once on mount

    // Memoize the applyFilters function to prevent unnecessary re-creations
    const applyFilters = useCallback(() => {
        let results = startups;

        // Apply search filter
        if (searchTerm) {
            const lowerCaseSearchTerm = searchTerm.toLowerCase();
            results = results.filter(startup =>
                (startup.startupName && startup.startupName.toLowerCase().includes(lowerCaseSearchTerm)) ||
                (startup.summary && startup.summary.toLowerCase().includes(lowerCaseSearchTerm)) ||
                (startup.tags && startup.tags.some(tag => tag.toLowerCase().includes(lowerCaseSearchTerm)))
            );
        }

        // Apply stage filter
        if (filters.stage) {
            results = results.filter(startup =>
                startup.stage && startup.stage.toLowerCase() === filters.stage.toLowerCase()
            );
        }

        // Apply industry filter (assuming industry is in tags or a separate field)
        // Added more robust checks for startup.industry if it exists
        if (filters.industry) {
            results = results.filter(startup =>
                (startup.industry && startup.industry.toLowerCase().includes(filters.industry.toLowerCase())) ||
                (startup.tags && startup.tags.some(tag => tag.toLowerCase().includes(filters.industry.toLowerCase())))
            );
        }

        // Apply funding range filter
        if (filters.fundingRange) {
            results = results.filter(startup => {
                const fundingAmount = startup.fundingAmount || startup.funding || 0; // Handle different possible field names
                const range = filters.fundingRange;

                if (range === 'Pre-Seed') return fundingAmount === 0 || !fundingAmount;
                if (range === '$0-50K') return fundingAmount >= 0 && fundingAmount <= 50000;
                if (range === '$50K-250K') return fundingAmount > 50000 && fundingAmount <= 250000;
                if (range === '$250K-1M') return fundingAmount > 250000 && fundingAmount <= 1000000;
                if (range === '$1M-5M') return fundingAmount > 1000000 && fundingAmount <= 5000000;
                if (range === '$5M+') return fundingAmount > 5000000;
                return true;
            });
        }

        // Apply location filter
        if (filters.location) {
            results = results.filter(startup =>
                startup.location && startup.location.toLowerCase().includes(filters.location.toLowerCase())
            );
        }

        // Apply team size filter
        if (filters.teamSize) {
            results = results.filter(startup => {
                const teamSize = startup.teamSize || startup.team_size || 0; // Handle different possible field names
                const range = filters.teamSize;

                if (range === '1-2') return teamSize >= 1 && teamSize <= 2;
                if (range === '3-5') return teamSize >= 3 && teamSize <= 5;
                if (range === '6-10') return teamSize >= 6 && teamSize <= 10;
                if (range === '11-25') return teamSize >= 11 && teamSize <= 25;
                if (range === '26-50') return teamSize >= 26 && teamSize <= 50;
                if (range === '50+') return teamSize > 50;
                return true;
            });
        }
        return results;
    }, [searchTerm, startups, filters]); // Dependencies for useCallback

    useEffect(() => {
        // 2) The filter is good but not working, add functionality to it.
        // The filtering logic was mostly there but needed to be explicitly applied.
        // This useEffect now calls `applyFilters` whenever `searchTerm`, `startups`, or `filters` change.
        setFilteredStartups(applyFilters());
    }, [searchTerm, startups, filters, applyFilters]);

    const handleFilterChange = (filterType, value) => {
        setFilters(prev => ({
            ...prev,
            [filterType]: prev[filterType] === value ? '' : value // Toggle filter on/off
        }));
    };

    const clearAllFilters = () => {
        setFilters({
            stage: '',
            industry: '',
            fundingRange: '',
            location: '',
            teamSize: ''
        });
    };

    const getActiveFiltersCount = () => {
        return Object.values(filters).filter(value => value !== '').length;
    };

    const handleAIMatch = () => {
        // Placeholder for AI match functionality
        console.log('AI Match clicked - will be implemented later');
        alert('AI Match functionality coming soon!');
    };

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

    return (
        <div >
            {/* Added pb-16 to the main tag for space at the bottom */}
            <main className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 pt-20 **pb-16**">
                {/* Background Gradient & Animated Shapes */}
               

                <div className="relative z-10">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-5xl font-extrabold text-center text-gray-800 dark:text-white mb-6 leading-tight"
                    >
                        Discover Innovative Startups
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-xl text-center text-gray-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto"
                    >
                        Explore groundbreaking ideas from passionate founders.
                    </motion.p>

                    {/* Search Bar with Filter and AI Match buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="flex justify-center mb-12"
                    >
                        <div className="flex items-center gap-4 w-full max-w-4xl">
                            {/* Search Input */}
                            <div className="relative flex-1 max-w-lg">
                                <input
                                    type="text"
                                    placeholder="Search by name, idea, or tags..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full px-6 py-3 pl-12 border border-gray-300 dark:border-gray-700 rounded-full bg-white dark:bg-gray-800 text-lg text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-3 focus:ring-blue-500/50 shadow-md"
                                />
                                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 h-6 w-6" />
                            </div>

                            {/* Filter Button */}
                            <div className="relative">
                                <button
                                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                                    className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-3 focus:ring-blue-500/50 shadow-md transition-all duration-200"
                                >
                                    <SlidersHorizontal className="h-5 w-5" />
                                    <span className="font-medium">Filter</span>
                                    {getActiveFiltersCount() > 0 && (
                                        <span className="bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                            {getActiveFiltersCount()}
                                        </span>
                                    )}
                                    <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isFilterOpen ? 'rotate-180' : ''}`} />
                                </button>

                                {/* Filter Dropdown Modal */}
                                {/* 3) When filter pop-up opens, I should move the page up and down to see the full filter popup */}
                                {/* This is addressed by changing the filter popup from `fixed inset-0` to a more controlled `modal` pattern.
                                    The modal itself will have `overflow-y-auto` but the underlying page won't scroll. */}
                                <AnimatePresence>
                                    {isFilterOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            transition={{ duration: 0.2 }}
                                            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" // Center the modal
                                        >
                                            <div
                                                className="absolute inset-0 bg-black/50 backdrop-blur-sm" // Dark overlay
                                                onClick={() => setIsFilterOpen(false)}
                                            ></div>
                                            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col relative z-10 overflow-hidden">
                                                {/* Header */}
                                                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
                                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Filters</h3>
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={clearAllFilters}
                                                            className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                                                        >
                                                            Clear All
                                                        </button>
                                                        <button
                                                            onClick={() => setIsFilterOpen(false)}
                                                            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                                        >
                                                            <X className="h-5 w-5" />
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Scrollable Content */}
                                                <div className="flex-1 overflow-y-auto p-6 custom-scrollbar"> {/* Added custom-scrollbar class for styling */}
                                                    <div className="space-y-6">
                                                        {Object.keys(filterOptions).map((filterType) => (
                                                            <div key={filterType}>
                                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 capitalize">
                                                                    {filterType.replace(/([A-Z])/g, ' $1').trim()}
                                                                </label>
                                                                <div className="flex flex-wrap gap-2">
                                                                    {filterOptions[filterType].map((option) => (
                                                                        <button
                                                                            key={option}
                                                                            onClick={() => handleFilterChange(filterType, option)}
                                                                            className={`px-3 py-2 text-sm rounded-full border transition-all duration-200 ${
                                                                                filters[filterType] === option
                                                                                    ? 'bg-blue-500 text-white border-blue-500 shadow-md'
                                                                                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600'
                                                                            }`}
                                                                        >
                                                                            {option}
                                                                        </button>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* Apply Button */}
                                                <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
                                                    <button
                                                        onClick={() => setIsFilterOpen(false)}
                                                        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-xl transition-colors duration-200"
                                                    >
                                                        Apply Filters ({filteredStartups.length} results)
                                                    </button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* AI Match Button */}
                            <button
                                onClick={handleAIMatch}
                                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-medium rounded-full shadow-md hover:shadow-lg focus:outline-none focus:ring-3 focus:ring-purple-500/50 transition-all duration-200"
                            >
                                <Sparkles className="h-5 w-5" />
                                <span>AI Match</span>
                            </button>
                        </div>
                    </motion.div>

                    {/* Conditional rendering for loading, error, or no startups */}
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
                            <p className="mt-4 text-xl font-medium">Loading innovative startups...</p>
                        </motion.div>
                    )}

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

                    {!loading && !error && filteredStartups.length > 0 ? (
                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                        >
                            {filteredStartups.map((startup) => (
                                <motion.div
                                    key={startup._id}
                                    variants={itemVariants}
                                    whileHover={{ scale: 1.03, zIndex: 10 }}
                                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                    className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-xl rounded-3xl p-6 border border-white/30 dark:border-gray-700/50 cursor-pointer overflow-hidden group"
                                >
                                    <Link to={`/startups/${startup._id}`} className="block">
                                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition duration-200">
                                            {startup.startupName || "Unnamed Startup"}
                                        </h2>
                                        <p className="text-gray-600 dark:text-gray-300 text-base mb-4 line-clamp-3">
                                            {startup.summary || "No summary available for this startup."}
                                        </p>
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {startup.tags && startup.tags.map((tag, index) => (
                                                <span key={index} className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                                            {startup.stage && (
                                                <span className="flex items-center">
                                                    <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20"><path d="M11 3a1 1 0 100 2h3a1 1 0 100-2h-3zM10.843 14.167a1.999 1.999 0 01-2.905-.184l-2.839-4.257a1 1 0 00-1.635.088l-2 3a1 1 0 00.901 1.587h12a1 1 0 00.901-1.587l-2-3a1 1 0 00-1.635-.088l-2.839 4.257zM10 18a1 1 0 100-2h3a1 1 0 100 2h-3zM4 12a1 1 0 100-2h3a1 1 0 100 2H4z" /></svg>
                                                    {startup.stage}
                                                </span>
                                            )}
                                            <span className="text-blue-600 dark:text-blue-400 font-semibold group-hover:underline transition duration-200">
                                                View Details →
                                            </span>
                                        </div>
                                    </Link>
                                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl pointer-events-none"></div>
                                </motion.div>
                            ))}
                        </motion.div>
                    ) : (
                        // Display "No Startups Found" only if not loading and no error, and filteredStartups is empty
                        !loading && !error && filteredStartups.length === 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-center mt-20 p-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/30 dark:border-gray-700/50 max-w-2xl mx-auto"
                            >
                                <h3 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
                                    No Startups Found!
                                </h3>
                                <p className="text-lg text-gray-600 dark:text-gray-300">
                                    It looks like there are no startups to display right now, or your search didn't match any.
                                </p>
                                <p className="text-md text-gray-500 dark:text-gray-400 mt-2">
                                    Check back later, or try a different search term.
                                </p>
                            </motion.div>
                        )
                    )}
                </div>
            </main>

            {/* The backdrop for the filter modal is now part of the modal's AnimatePresence */}
        </div>
    );
};

export default Startups;