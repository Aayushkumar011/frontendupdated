import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { API_BASE_URL } from "../config";
import { useTheme } from '../context/ThemeContext'; // <--- Import useTheme hook

// Import Lucide Icons
import {
    Send,
    CheckCircle,
    XCircle,
    Zap,
    UploadCloud,
    ArrowLeft,
    LinkIcon,
    FileUp,
} from 'lucide-react';

const SubmitPitch = () => {
    const navigate = useNavigate();
    const { isDarkMode } = useTheme(); // <--- Use the useTheme hook to get theme state

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        industry: "",
        domain: "",
        founder: "",
        stage: "",
        website: "",
        videoUrl: "",
    });

    const [videoFile, setVideoFile] = useState(null);
    const [uploadMethod, setUploadMethod] = useState('url');

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);
    const [isFormVisible, setIsFormVisible] = useState(false);

    const handleChange = (e) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
        setError("");
        setSuccess("");
    };

    const handleFileChange = (e) => {
        setVideoFile(e.target.files[0]);
        setError("");
        setSuccess("");
    };

    const resetForm = () => {
        setFormData({
            name: "",
            description: "",
            industry: "",
            domain: "",
            founder: "",
            stage: "",
            website: "",
            videoUrl: "",
        });
        setVideoFile(null);
        setUploadMethod('url');
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
            setError("You must be logged in to submit a pitch.");
            setLoading(false);
            return;
        }

        try {
            let res;
            let headers = {};
            let body;

            if (uploadMethod === 'file' && videoFile) {
                const data = new FormData();
                for (const key in formData) {
                    data.append(key, formData[key]);
                }
                data.append('video', videoFile);
                body = data;
                headers = { Authorization: `Bearer ${token}` };

            } else {
                headers = {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                };
                body = JSON.stringify(formData);
            }

            res = await fetch(`${API_BASE_URL}/api/startups`, {
                method: "POST",
                headers: headers,
                body: body,
            });

            const data = await res.json();

            if (res.ok) {
                setSuccess("Pitch submitted successfully! Redirecting...");
                resetForm();
                setIsFormVisible(false);
                setTimeout(() => navigate("/startups"), 1500);
            } else {
                setError(data.message || (data.errors && data.errors.map(err => err.message).join(", ")) || "Failed to submit pitch. Please check your inputs.");
            }
        } catch (err) {
            console.error("Error submitting pitch:", err);
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
     

            <motion.div
                // Removed bg-white/80 and dark:bg-gray-800 for full transparency
                className="max-w-2xl w-full mx-auto p-8 rounded-2xl shadow-xl border border-white/30 dark:border-gray-700/50 bg-white/80 and dark:bg-gray-800 for full transparency"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                >
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white flex items-center">
                        <Zap className="h-8 w-8 text-blue-600 dark:text-blue-400 mr-3" />
                        Submit Your Groundbreaking Pitch
                    </h2>
                    {isFormVisible && (
                        <motion.button
                            onClick={() => { resetForm(); setIsFormVisible(false); }}
                            className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 flex items-center text-sm font-medium transition-colors"
                            whileHover={{ x: -3 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <ArrowLeft className="h-4 w-4 mr-1" />
                            Back to Startups
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
                            Ready to showcase your startup? Click the button below to start your pitch submission!
                        </p>
                        <motion.button
                            onClick={() => setIsFormVisible(true)}
                            className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-8 rounded-lg font-semibold text-xl flex items-center justify-center mx-auto transition-colors duration-200 shadow-md hover:shadow-lg"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <UploadCloud className="mr-3 h-6 w-6" />
                            Upload New Pitch
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
                                {/* Startup Name (Existing) */}
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Startup Name</label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        placeholder="e.g., InnovateTech Solutions"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                    />
                                </div>

                                {/* Description (Existing) */}
                                <div>
                                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                                    <textarea
                                        id="description"
                                        name="description"
                                        placeholder="Briefly describe your startup, its mission, and what problem it solves."
                                        value={formData.description}
                                        onChange={handleChange}
                                        required
                                        className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                        rows={5}
                                    />
                                </div>

                                {/* Industry (Existing) */}
                                <div>
                                    <label htmlFor="industry" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Industry</label>
                                    <input
                                        type="text"
                                        id="industry"
                                        name="industry"
                                        placeholder="e.g., FinTech, HealthTech, SaaS, AI"
                                        value={formData.industry}
                                        onChange={handleChange}
                                        required
                                        className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                    />
                                </div>

                                {/* NEW FIELD: Domain */}
                                <div>
                                    <label htmlFor="domain" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Domain</label>
                                    <input
                                        type="text"
                                        id="domain"
                                        name="domain"
                                        placeholder="e.g., Software, E-commerce, Healthcare"
                                        value={formData.domain}
                                        onChange={handleChange}
                                        required
                                        className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                    />
                                </div>

                                {/* Founder Name(s) (Existing) */}
                                <div>
                                    <label htmlFor="founder" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Founder Name(s)</label>
                                    <input
                                        type="text"
                                        id="founder"
                                        name="founder"
                                        placeholder="e.g., Jane Doe, John Smith"
                                        value={formData.founder}
                                        onChange={handleChange}
                                        required
                                        className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                    />
                                </div>

                                {/* NEW FIELD: Startup Stage (Dropdown) */}
                                <div>
                                    <label htmlFor="stage" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Startup Stage</label>
                                    <select
                                        id="stage"
                                        name="stage"
                                        value={formData.stage}
                                        onChange={handleChange}
                                        required
                                        className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                    >
                                        <option value="">Select Stage</option>
                                        <option value="idea">Idea</option>
                                        <option value="MVP">MVP</option>
                                        <option value="revenue">MVP with Revenue</option>
                                    </select>
                                </div>

                                {/* Website URL (Existing) */}
                                <div>
                                    <label htmlFor="website" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Website URL (Optional)</label>
                                    <input
                                        type="url"
                                        id="website"
                                        name="website"
                                        placeholder="https://www.yourstartup.com"
                                        value={formData.website}
                                        onChange={handleChange}
                                        className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                    />
                                </div>

                                {/* Video Upload Options (Existing) */}
                                <div className="mt-4 p-4 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700">
                                    <h3 className="text-md font-semibold text-gray-800 dark:text-white mb-3">Upload Video Pitch</h3>
                                    <div className="flex space-x-4 mb-4">
                                        <button
                                            type="button"
                                            onClick={() => { setUploadMethod('url'); setVideoFile(null); }}
                                            className={`flex-1 flex items-center justify-center py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                                                uploadMethod === 'url'
                                                    ? 'bg-blue-600 text-white shadow-md'
                                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500'
                                            }`}
                                        >
                                            <LinkIcon className="h-4 w-4 mr-2" /> From URL
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => { setUploadMethod('file'); setFormData(prev => ({ ...prev, videoUrl: "" })); }}
                                            className={`flex-1 flex items-center justify-center py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                                                uploadMethod === 'file'
                                                    ? 'bg-blue-600 text-white shadow-md'
                                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500'
                                            }`}
                                        >
                                            <FileUp className="h-4 w-4 mr-2" /> Direct Upload
                                        </button>
                                    </div>

                                    {uploadMethod === 'url' ? (
                                        <div>
                                            <label htmlFor="videoUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Video Pitch URL</label>
                                            <input
                                                type="url"
                                                id="videoUrl"
                                                name="videoUrl"
                                                placeholder="e.g., https://www.youtube.com/watch?v=yourvideo"
                                                value={formData.videoUrl}
                                                onChange={handleChange}
                                                className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                            />
                                        </div>
                                    ) : (
                                        <div>
                                            <label htmlFor="videoFile" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Select Video File</label>
                                            <input
                                                type="file"
                                                id="videoFile"
                                                name="videoFile"
                                                accept="video/*"
                                                onChange={handleFileChange}
                                                className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-blue-900 dark:file:text-blue-300 dark:hover:file:bg-blue-800"
                                            />
                                            {videoFile && (
                                                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Selected file: {videoFile.name}</p>
                                            )}
                                        </div>
                                    )}
                                </div>

                                <motion.button
                                    type="submit"
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold text-lg flex items-center justify-center transition-colors duration-200"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    disabled={loading || (uploadMethod === 'file' && !videoFile)}
                                >
                                    {loading ? (
                                        <svg className="animate-spin h-5 w-5 text-white mr-3" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                    ) : (
                                        <Send className="mr-3 h-5 w-5" />
                                    )}
                                    {loading ? "Uploading..." : "Upload Pitch"}
                                </motion.button>
                            </motion.form>
                        )}
                    </AnimatePresence>
                )}
            </motion.div>
        
    );
};

export default SubmitPitch;