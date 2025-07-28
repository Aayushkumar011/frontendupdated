import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { API_BASE_URL } from "../config";

// Import Lucide Icons
import {
    DollarSign, // Changed from Zap for investor theme
    CheckCircle,
    XCircle,
    ArrowLeft,
    Mail, // For contact email
    Briefcase, // For areas of interest/portfolio
    User, // For investor name
} from 'lucide-react';

const SubmitInvestment = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        investorName: "",
        contactEmail: "",
        companyName: "", // Optional: if investor represents a firm
        investmentAmount: "", // e.g., "Seed", "Series A", or a numerical range
        areasOfInterest: "", // e.g., "FinTech, AI, SaaS"
        notes: "", // Any additional notes or message
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);
    const [isFormVisible, setIsFormVisible] = useState(false); // Controls initial prompt vs form

    const handleChange = (e) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
        setError("");
        setSuccess("");
    };

    // Function to reset the form fields and state
    const resetForm = () => {
        setFormData({
            investorName: "",
            contactEmail: "",
            companyName: "",
            investmentAmount: "",
            areasOfInterest: "",
            notes: "",
        });
        setError("");
        setSuccess("");
        setLoading(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");

        const token = localStorage.getItem("token");
        if (!token) {
            setError("You must be logged in to submit investment interest.");
            setLoading(false);
            return;
        }

        try {
            const headers = {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            };
            const body = JSON.stringify(formData);

            const res = await fetch(`${API_BASE_URL}/api/investments`, { // Changed endpoint to /api/investments
                method: "POST",
                headers: headers,
                body: body,
            });

            const data = await res.json();

            if (res.ok) {
                setSuccess("Investment interest submitted successfully! Redirecting...");
                resetForm(); // Reset form after successful submission
                setIsFormVisible(false); // Hide the form to show the initial prompt
                setTimeout(() => navigate("/investments"), 1500); // Navigate to investments page (assuming one exists)
            } else {
                setError(data.message || (data.errors && data.errors.map(err => err.message).join(", ")) || "Failed to submit investment interest. Please check your inputs.");
            }
        } catch (err) {
            console.error("Error submitting investment interest:", err);
            setError("Network error or server is unreachable. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const formVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
        exit: { opacity: 0, y: 50, transition: { duration: 0.3, ease: "easeIn" } },
    };

    const messageVariants = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 300, damping: 20 } },
        exit: { opacity: 0, scale: 0.8, transition: { duration: 0.2 } },
    };

    return (
        <div>
            <motion.div
                className="max-w-2xl w-full mx-auto bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl border border-white/30 dark:border-gray-700/50"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white flex items-center">
                        <DollarSign className="h-8 w-8 text-green-600 dark:text-green-400 mr-3" /> {/* Changed icon and color */}
                        Submit Your Investment Interest
                    </h2>
                    {isFormVisible && (
                        <motion.button
                            onClick={() => { resetForm(); setIsFormVisible(false); }}
                            className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 flex items-center text-sm font-medium transition-colors"
                            whileHover={{ x: -3 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <ArrowLeft className="h-4 w-4 mr-1" />
                            Back to Investments
                        </motion.button>
                    )}
                </div>

                {/* Message Area */}
                <AnimatePresence>
                    {error && (
                        <motion.div
                            className="mb-6 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 p-4 rounded-lg flex items-center"
                            variants={messageVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            key="error-message"
                        >
                            <XCircle className="h-5 w-5 mr-3 flex-shrink-0" />
                            <p className="text-sm md:text-base font-medium">{error}</p>
                        </motion.div>
                    )}
                    {success && (
                        <motion.div
                            className="mb-6 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 p-4 rounded-lg flex items-center"
                            variants={messageVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            key="success-message"
                        >
                            <CheckCircle className="h-5 w-5 mr-3 flex-shrink-0" />
                            <p className="text-sm md:text-base font-medium">{success}</p>
                        </motion.div>
                    )}
                </AnimatePresence>

                {!isFormVisible ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                        className="text-center py-10"
                    >
                        <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
                            Ready to express your interest in groundbreaking startups? Click the button below to submit your investment profile!
                        </p>
                        <motion.button
                            onClick={() => setIsFormVisible(true)}
                            className="bg-green-600 hover:bg-green-700 text-white py-3 px-8 rounded-lg font-semibold text-xl flex items-center justify-center mx-auto transition-colors duration-200 shadow-md hover:shadow-lg"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <DollarSign className="mr-3 h-6 w-6" /> {/* Changed icon and color */}
                            Submit Investment Profile
                        </motion.button>
                    </motion.div>
                ) : (
                    <AnimatePresence>
                        {isFormVisible && (
                            <motion.form
                                onSubmit={handleSubmit}
                                className="grid gap-6"
                                variants={formVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                            >
                                {/* Investor Name */}
                                <div>
                                    <label htmlFor="investorName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Your Name</label>
                                    <input
                                        type="text"
                                        id="investorName"
                                        name="investorName"
                                        placeholder="e.g., Alex Johnson"
                                        value={formData.investorName}
                                        onChange={handleChange}
                                        required
                                        className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                    />
                                </div>

                                {/* Contact Email */}
                                <div>
                                    <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Contact Email</label>
                                    <input
                                        type="email"
                                        id="contactEmail"
                                        name="contactEmail"
                                        placeholder="e.g., investor@example.com"
                                        value={formData.contactEmail}
                                        onChange={handleChange}
                                        required
                                        className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                    />
                                </div>

                                {/* Company Name (Optional) */}
                                <div>
                                    <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Company Name (Optional)</label>
                                    <input
                                        type="text"
                                        id="companyName"
                                        name="companyName"
                                        placeholder="e.g., Venture Capital Group"
                                        value={formData.companyName}
                                        onChange={handleChange}
                                        className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                    />
                                </div>

                                {/* Investment Amount/Stage */}
                                <div>
                                    <label htmlFor="investmentAmount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Preferred Investment Amount/Stage</label>
                                    <select
                                        id="investmentAmount"
                                        name="investmentAmount"
                                        value={formData.investmentAmount}
                                        onChange={handleChange}
                                        required
                                        className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                    >
                                        <option value="">Select an option</option>
                                        <option value="Pre-Seed">Pre-Seed (up to $100K)</option>
                                        <option value="Seed">Seed ($100K - $1M)</option>
                                        <option value="Series A">Series A ($1M - $5M)</option>
                                        <option value="Series B+">Series B+ (over $5M)</option>
                                        <option value="Flexible">Flexible / Open to discussion</option>
                                    </select>
                                </div>

                                {/* Areas of Interest */}
                                <div>
                                    <label htmlFor="areasOfInterest" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Areas of Interest (e.g., FinTech, AI, SaaS)</label>
                                    <input
                                        type="text"
                                        id="areasOfInterest"
                                        name="areasOfInterest"
                                        placeholder="e.g., AI, Renewable Energy, Healthcare Tech"
                                        value={formData.areasOfInterest}
                                        onChange={handleChange}
                                        required
                                        className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                    />
                                </div>

                                {/* Additional Notes */}
                                <div>
                                    <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Additional Notes (Optional)</label>
                                    <textarea
                                        id="notes"
                                        name="notes"
                                        placeholder="Any specific startups you're looking for, or a message to the platform administrators."
                                        value={formData.notes}
                                        onChange={handleChange}
                                        rows={4}
                                        className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                    />
                                </div>

                                <motion.button
                                    type="submit"
                                    className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold text-lg flex items-center justify-center transition-colors duration-200"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <svg className="animate-spin h-5 w-5 text-white mr-3" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                    ) : (
                                        <DollarSign className="mr-3 h-5 w-5" />
                                    )}
                                    {loading ? "Submitting..." : "Submit Interest"}
                                </motion.button>
                            </motion.form>
                        )}
                    </AnimatePresence>
                )}
            </motion.div>
        </div>
    );
};

export default SubmitInvestment;
