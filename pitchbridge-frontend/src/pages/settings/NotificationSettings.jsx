import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../config';
import {
    Bell, Loader2, CheckCircle, XCircle, ChevronLeft,
    UserCheck, Sparkles, MessageSquare, Megaphone, Lock, Mail, Phone
} from 'lucide-react'; // Added Mail, Phone icons for toggles
import { Link } from 'react-router-dom';

const NotificationSettings = () => {
    const [preferences, setPreferences] = useState({
        accountActivity: { email: false, sms: false },
        featureUpdates: { email: false, sms: false },
        newMessages: { email: false, sms: false },
        promotional: { email: false, sms: false },
        securityAlerts: { email: true, sms: true } // Often default to true for security
    });

    const [message, setMessage] = useState(null);
    const [messageType, setMessageType] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);

    // Dynamic CSS injection for animations and custom styles
    useEffect(() => {
        const style = document.createElement('style');
        style.id = 'notification-settings-animations';

        // Enhanced toggle switch styles with better focus and accessibility
        style.innerHTML = `
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
            }
            .animate-fade-in {
                animation: fadeIn 0.5s ease-out forwards;
            }

            @keyframes blob {
                0% { transform: translate(0px, 0px) scale(1); }
                33% { transform: translate(30px, -50px) scale(1.1); }
                66% { transform: translate(-20px, 20px) scale(0.9); }
                100% { transform: translate(0px, 0px) scale(1); }
            }
            .animate-blob {
                animation: blob 7s infinite cubic-bezier(0.68, -0.55, 0.27, 1.55);
            }
            .animation-delay-2000 {
                animation-delay: 2s;
            }
            .animation-delay-4000 {
                animation-delay: 4s;
            }

            /* Custom Toggle Switch Styles */
            .toggle-switch {
                position: relative;
                display: inline-block;
                width: 58px; /* Slightly wider */
                height: 32px; /* Slightly taller */
            }

            .toggle-switch input {
                opacity: 0;
                width: 0;
                height: 0;
            }

            .slider {
                position: absolute;
                cursor: pointer;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background-color: #e0e0e0; /* Lighter gray for off state */
                transition: .4s;
                border-radius: 32px; /* Matches height for full rounding */
                border: 1px solid #d1d5db; /* Subtle border for definition */
            }

            .dark .slider {
                background-color: #4B5563; /* Darker gray for off state in dark mode */
                border-color: #374151; /* Darker border */
            }

            .slider:before {
                position: absolute;
                content: "";
                height: 24px; /* Slightly smaller than slider height */
                width: 24px; /* Slightly smaller than slider height */
                left: 3px; /* Adjusted for new dimensions */
                bottom: 3px; /* Adjusted for new dimensions */
                background-color: white;
                transition: .4s;
                border-radius: 50%;
                box-shadow: 0 2px 5px rgba(0,0,0,0.2), 0 0 0 1px rgba(0,0,0,0.05); /* Enhanced shadow */
            }

            input:checked + .slider {
                background-color: #2563EB; /* Stronger blue-600 for on state */
                border-color: #2563EB; /* Match border to background */
            }

            .dark input:checked + .slider {
                background-color: #3B82F6; /* blue-500 for on state in dark mode */
                border-color: #3B82F6;
            }

            input:focus-visible + .slider { /* Use focus-visible for better accessibility */
                box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.5); /* Blue glow focus ring */
                outline: none; /* Remove default outline */
            }

            input:checked + .slider:before {
                transform: translateX(26px); /* Adjusted for new dimensions */
            }
        `;

        if (!document.getElementById('notification-settings-animations')) {
            document.head.appendChild(style);
        }

        return () => {
            const existingStyle = document.getElementById('notification-settings-animations');
            if (existingStyle) {
                document.head.removeChild(existingStyle);
            }
        };
    }, []);

    // Fetch initial preferences on component mount
    useEffect(() => {
        const fetchPreferences = async () => {
            setIsFetching(true);
            const token = localStorage.getItem('token');
            try {
                const res = await axios.get(`${API_BASE_URL}/settings/notifications`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const fetchedPrefs = res.data.preferences || res.data || {};

                setPreferences(prev => ({
                    ...prev,
                    ...fetchedPrefs
                }));

            } catch (err) {
                setMessage(err.response?.data?.message || 'Error fetching preferences.');
                setMessageType('error');
            } finally {
                setIsFetching(false);
            }
        };
        fetchPreferences();
    }, []);

    const handleToggleChange = (category, type) => {
        setPreferences(prev => ({
            ...prev,
            [category]: {
                ...prev[category],
                [type]: !prev[category][type]
            }
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(null);
        setMessageType('');
        setIsLoading(true);
        const token = localStorage.getItem('token');

        try {
            const res = await axios.put(
                `${API_BASE_URL}/settings/notifications`,
                { preferences },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                }
            );
            setMessage(res.data.message || 'Preferences saved successfully!');
            setMessageType('success');
        } catch (err) {
            setMessage(err.response?.data?.message || 'Error updating preferences.');
            setMessageType('error');
        } finally {
            setIsLoading(false);
        }
    };

    // Helper component for a single notification type toggle block
    const NotificationToggleBlock = ({ id, icon: Icon, title, description, emailChecked, smsChecked, onEmailChange, onSmsChange, disabled }) => (
        <div className="p-5 bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700
                        hover:shadow-lg hover:border-blue-200 dark:hover:border-blue-700 transition-all duration-200 ease-in-out">
            <div className="flex items-start mb-4">
                <Icon size={28} className="text-blue-600 dark:text-blue-400 mr-4 mt-0.5 flex-shrink-0" />
                <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-1">{title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{description}</p>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-x-6 gap-y-3 border-t border-gray-200 dark:border-gray-700 pt-4 mt-2">
                {/* Email Toggle */}
                <div className="flex items-center justify-between">
                    <label htmlFor={`${id}-email`} className="flex items-center text-base text-gray-700 dark:text-gray-300 cursor-pointer select-none">
                        <Mail size={18} className="mr-2 text-gray-500 dark:text-gray-400" /> Email
                    </label>
                    <label className="toggle-switch">
                        <input
                            id={`${id}-email`}
                            type="checkbox"
                            checked={emailChecked}
                            onChange={onEmailChange}
                            disabled={disabled}
                        />
                        <span className="slider"></span>
                    </label>
                </div>
                {/* SMS Toggle */}
                <div className="flex items-center justify-between">
                    <label htmlFor={`${id}-sms`} className="flex items-center text-base text-gray-700 dark:text-gray-300 cursor-pointer select-none">
                        <Phone size={18} className="mr-2 text-gray-500 dark:text-gray-400" /> SMS
                    </label>
                    <label className="toggle-switch">
                        <input
                            id={`${id}-sms`}
                            type="checkbox"
                            checked={smsChecked}
                            onChange={onSmsChange}
                            disabled={disabled}
                        />
                        <span className="slider"></span>
                    </label>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 bg-gray-100 dark:bg-gray-900 relative overflow-hidden">
            {/* Background Blobs - Copied from ChangeUsername and adjusted for NotificationSettings */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-yellow-300 dark:bg-yellow-600 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
            <div className="absolute bottom-1/4 right-0 w-80 h-80 bg-orange-300 dark:bg-orange-600 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
            <div className="absolute top-1/2 left-1/4 w-72 h-72 bg-lime-300 dark:bg-lime-600 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>

            {/* Centered Card/Content Container */}
            <div className="relative z-10 w-full max-w-xl bg-white dark:bg-gray-850 rounded-3xl shadow-2xl p-8 sm:p-10 md:p-12 animate-fade-in border border-gray-200 dark:border-gray-700 transform hover:scale-[1.005] transition-transform duration-300 ease-out">
                {/* Back to Settings Link */}
                <Link
                    to="/settings"
                    className="absolute top-8 left-8 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-300 transition-colors duration-200 flex items-center gap-1 group text-sm font-medium"
                    aria-label="Back to Settings"
                >
                    <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                    Back to Settings
                </Link>

                <div className="text-center mb-10 mt-8 sm:mt-0">
                    <div className="p-4 inline-flex items-center justify-center rounded-full bg-yellow-100 text-yellow-600 dark:bg-yellow-800 dark:text-yellow-300 shadow-xl mb-5 transform hover:scale-110 transition-transform duration-300">
                        <Bell size={48} /> {/* Larger icon */}
                    </div>
                    <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white leading-tight mb-3">Notification Preferences</h2>
                    <p className="text-gray-700 dark:text-gray-300 text-base sm:text-lg max-w-prose mx-auto">
                        Tailor how you receive important updates and personalized alerts to fit your needs.
                    </p>
                </div>

                {isFetching ? (
                    <div className="flex flex-col items-center justify-center h-64 text-gray-500 dark:text-gray-400">
                        <Loader2 className="animate-spin mb-5" size={48} />
                        <p className="text-xl font-medium">Loading your preferences...</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Security Alerts */}
                        <NotificationToggleBlock
                            id="security-alerts"
                            icon={Lock}
                            title="Security Alerts"
                            description="Crucial notifications about your account security (e.g., login attempts, password changes)."
                            emailChecked={preferences.securityAlerts.email}
                            smsChecked={preferences.securityAlerts.sms}
                            onEmailChange={() => handleToggleChange('securityAlerts', 'email')}
                            onSmsChange={() => handleToggleChange('securityAlerts', 'sms')}
                            disabled={isLoading}
                        />

                        {/* Account Activity Notifications */}
                        <NotificationToggleBlock
                            id="account-activity"
                            icon={UserCheck}
                            title="Account Activity"
                            description="Get notified about profile updates, important account changes, and data exports."
                            emailChecked={preferences.accountActivity.email}
                            smsChecked={preferences.accountActivity.sms}
                            onEmailChange={() => handleToggleChange('accountActivity', 'email')}
                            onSmsChange={() => handleToggleChange('accountActivity', 'sms')}
                            disabled={isLoading}
                        />

                        {/* New Messages/Interactions */}
                        <NotificationToggleBlock
                            id="new-messages"
                            icon={MessageSquare}
                            title="New Messages & Interactions"
                            description="Receive alerts for new messages, comments, mentions, or direct interactions."
                            emailChecked={preferences.newMessages.email}
                            smsChecked={preferences.newMessages.sms}
                            onEmailChange={() => handleToggleChange('newMessages', 'email')}
                            onSmsChange={() => handleToggleChange('newMessages', 'sms')}
                            disabled={isLoading}
                        />

                        {/* Feature Updates & Announcements */}
                        <NotificationToggleBlock
                            id="feature-updates"
                            icon={Sparkles}
                            title="Product Updates & Announcements"
                            description="Stay informed about new features, improvements, and important platform news."
                            emailChecked={preferences.featureUpdates.email}
                            smsChecked={preferences.featureUpdates.sms}
                            onEmailChange={() => handleToggleChange('featureUpdates', 'email')}
                            onSmsChange={() => handleToggleChange('featureUpdates', 'sms')}
                            disabled={isLoading}
                        />

                        {/* Promotional & Marketing */}
                        <NotificationToggleBlock
                            id="promotional"
                            icon={Megaphone}
                            title="Promotional & Offers"
                            description="Occasional emails or SMS about special offers, tips, and relevant content."
                            emailChecked={preferences.promotional.email}
                            smsChecked={preferences.promotional.sms}
                            onEmailChange={() => handleToggleChange('promotional', 'email')}
                            onSmsChange={() => handleToggleChange('promotional', 'sms')}
                            disabled={isLoading}
                        />

                        <button
                            type="submit"
                            className={`w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-bold text-white text-xl
                                transition-all duration-300 ease-in-out transform shadow-lg
                                ${isLoading
                                    ? 'bg-blue-400 dark:bg-blue-600 cursor-not-allowed animate-pulse'
                                    : 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 hover:scale-[1.02] active:scale-[0.98]'
                                }
                            `}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="animate-spin" size={24} /> Saving Preferences...
                                </>
                            ) : (
                                <>
                                    Save Preferences <Bell size={22} />
                                </>
                            )}
                        </button>
                    </form>
                )}

                {message && (
                    <div
                        className={`mt-8 p-5 rounded-xl flex items-center gap-4 justify-center text-center animate-fade-in
                            ${messageType === 'success'
                                ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300 border border-green-200 dark:border-green-700 shadow-md'
                                : 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300 border border-red-200 dark:border-red-700 shadow-md'
                            }`}
                        role="alert"
                    >
                        {messageType === 'success' ? <CheckCircle size={24} /> : <XCircle size={24} />}
                        <p className="text-lg font-medium">{message}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NotificationSettings;