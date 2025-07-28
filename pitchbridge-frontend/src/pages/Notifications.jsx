import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "../config";
import {
    Bell, Info, CheckCircle2, AlertTriangle, XCircle, Loader2, Mail, Users, Star,
    Trash2, CheckCheck, Sparkles // Keep Sparkles icon from Lucide
} from 'lucide-react';
import { motion } from 'framer-motion';

// Remove SPARKLE_STAR_IMAGE constant as we are only using Lucide Sparkles icon
// const SPARKLE_STAR_IMAGE = "/images/sparkle-star.png"; // REMOVE THIS LINE

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isMarkingAll, setIsMarkingAll] = useState(false);
    const [dismissingId, setDismissingId] = useState(null);

    // Dynamic CSS injection for animations and custom styles
    useEffect(() => {
        const style = document.createElement('style');
        style.id = 'notifications-page-animations';

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

            @keyframes slideOut {
                from { opacity: 1; transform: translateX(0); height: auto; padding: 1rem; margin-bottom: 1rem; }
                to { opacity: 0; transform: translateX(100%); height: 0; padding: 0; margin-bottom: 0; }
            }
            .animate-slide-out {
                animation: slideOut 0.5s ease-out forwards;
            }

            /* Removed bounce-slow from here as we want it static above heading */
        `;

        if (!document.getElementById('notifications-page-animations')) {
            document.head.appendChild(style);
        }

        return () => {
            const existingStyle = document.getElementById('notifications-page-animations');
            if (existingStyle) {
                document.head.removeChild(existingStyle);
            }
        };
    }, []);

    const getNotificationIcon = (type = 'info') => {
        switch (type.toLowerCase()) {
            case 'success':
                return <CheckCircle2 size={20} className="text-emerald-500 dark:text-emerald-400" />;
            case 'warning':
                return <AlertTriangle size={20} className="text-amber-500 dark:text-amber-400" />;
            case 'error':
                return <XCircle size={20} className="text-rose-500 dark:text-rose-400" />;
            case 'message':
                return <Mail size={20} className="text-sky-500 dark:text-sky-400" />;
            case 'new_user':
                return <Users size={20} className="text-purple-500 dark:text-purple-400" />;
            case 'feature_update':
                return <Star size={20} className="text-yellow-500 dark:text-yellow-400" />;
            case 'info':
            default:
                return <Info size={20} className="text-blue-500 dark:text-blue-400" />;
        }
    };

    const getCardClasses = (isRead, isDismissing) => {
        let baseClasses = "rounded-lg flex items-start space-x-4 border relative overflow-hidden ";
        if (isDismissing) {
            baseClasses += "animate-slide-out";
        } else if (isRead) {
            baseClasses += "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 opacity-80";
        } else {
            baseClasses += "bg-white dark:bg-gray-700 border-blue-200 dark:border-blue-600 shadow-lg hover:shadow-xl hover:scale-[1.01] transition-all duration-200 animate-fade-in";
        }
        return baseClasses;
    };

    useEffect(() => {
        const fetchNotifications = async () => {
            setLoading(true);
            setError(null);
            const token = localStorage.getItem("token");
            try {
                const res = await fetch(`${API_BASE_URL}/api/notifications`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                });

                if (!res.ok) {
                    const errorData = await res.json();
                    throw new Error(errorData.message || 'Failed to fetch notifications');
                }

                const data = await res.json();
                const processedNotifications = (data.data || []).map(note => ({
                    ...note,
                    uniqueId: note.id || note._id || `${note.timestamp}-${Math.random()}`
                }));
                setNotifications(processedNotifications);
            } catch (err) {
                console.error("Failed to fetch notifications:", err);
                setError(err.message || "Failed to load notifications.");
            } finally {
                setLoading(false);
            }
        };

        fetchNotifications();
    }, []);

    const handleMarkAsRead = async (id) => {
        setNotifications(prevNotifications =>
            prevNotifications.map(note =>
                note.uniqueId === id ? { ...note, read: true } : note
            )
        );

        const token = localStorage.getItem("token");
        try {
            await fetch(`${API_BASE_URL}/api/notifications/${id}/read`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
            });
        } catch (err) {
            console.error("Failed to mark notification as read:", err);
            setNotifications(prevNotifications =>
                prevNotifications.map(note =>
                    note.uniqueId === id ? { ...note, read: false } : note
                )
            );
        }
    };

    const handleMarkAllAsRead = async () => {
        setIsMarkingAll(true);
        const unreadNotificationIds = notifications
            .filter(note => !note.read)
            .map(note => note.uniqueId);

        setNotifications(prevNotifications =>
            prevNotifications.map(note => ({ ...note, read: true }))
        );

        const token = localStorage.getItem("token");
        try {
            await fetch(`${API_BASE_URL}/api/notifications/mark-all-read`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ ids: unreadNotificationIds })
            });
        } catch (err) {
            console.error("Failed to mark all notifications as read:", err);
            // Revert state if API call fails
            fetchNotifications(); // Re-fetch to ensure accurate state
        } finally {
            setIsMarkingAll(false);
        }
    };

    const handleDismissNotification = async (id) => {
        setDismissingId(id);

        setTimeout(async () => {
            setNotifications(prevNotifications =>
                prevNotifications.filter(note => note.uniqueId !== id)
            );

            const token = localStorage.getItem("token");
            try {
                await fetch(`${API_BASE_URL}/api/notifications/${id}`, {
                    method: 'DELETE',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                });
            } catch (err) {
                console.error("Failed to dismiss notification:", err);
            } finally {
                setDismissingId(null);
            }
        }, 500);
    };

    const unreadCount = notifications.filter(note => !note.read).length;
    const isInboxClean = notifications.length === 0 && !loading && !error;

    return (
        <section className="min-h-screen pt-20 sm:pt-24 pb-12 px-4 sm:px-8 lg:px-12 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white relative overflow-hidden">
            {/* Background Blobs for consistency */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-yellow-300 dark:bg-yellow-600 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob pointer-events-none"></div>
            <div className="absolute bottom-1/4 right-0 w-80 h-80 bg-orange-300 dark:bg-orange-600 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000 pointer-events-none"></div>
            <div className="absolute top-1/2 left-1/4 w-72 h-72 bg-lime-300 dark:bg-lime-600 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000 pointer-events-none"></div>

            <div className="relative z-10 max-w-4xl mx-auto bg-white dark:bg-gray-850 rounded-2xl shadow-2xl p-6 sm:p-8 border border-gray-200 dark:border-gray-700 animate-fade-in">
                <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0 sm:space-x-4 mb-8">
                    {/* Centered Heading Group with Sparkles */}
                    <div className="relative flex flex-col items-center flex-grow text-center">
                        {/* Sparkles ICON positioned ABOVE the heading - Only show when inbox is clean */}
                        {isInboxClean && (
                             <motion.div
                                 initial={{ opacity: 0, y: -20 }}
                                 animate={{ opacity: 1, y: 0 }}
                                 transition={{ duration: 0.5 }}
                                 className="mb-4" // Margin bottom to create space between sparkles and heading
                            >
                                <Sparkles className="mx-auto w-16 h-16 text-yellow-400 dark:text-yellow-300" strokeWidth={1.5} />
                            </motion.div>
                        )}

                        {/* Heading and Bell icon */}
                        <div className="relative z-10 flex items-center justify-center space-x-4">
                            <div className="p-3 inline-flex items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-700 dark:text-blue-200 shadow-lg">
                                <Bell size={32} />
                            </div>
                            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">Your Notifications</h1>
                        </div>
                    </div>
                    {notifications.length > 0 && (
                        <button
                            onClick={handleMarkAllAsRead}
                            disabled={isMarkingAll || unreadCount === 0}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ease-in-out
                                ${unreadCount === 0
                                    ? 'bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400 cursor-not-allowed'
                                    : 'bg-blue-500 hover:bg-blue-600 text-white shadow-md hover:shadow-lg dark:bg-blue-600 dark:hover:bg-blue-700'
                                }`}
                            aria-live="polite"
                            aria-label="Mark all notifications as read"
                        >
                            {isMarkingAll ? (
                                <>
                                    <Loader2 className="animate-spin" size={18} /> Marking All...
                                </>
                            ) : (
                                <>
                                    <CheckCheck size={18} /> Mark All as Read ({unreadCount})
                                </>
                            )}
                        </button>
                    )}
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-16 text-gray-500 dark:text-gray-400">
                        <Loader2 className="animate-spin mb-6 text-blue-500" size={64} />
                        <p className="text-xl font-medium">Summoning your messages from the ether...</p>
                        <p className="text-sm mt-2">This might take a moment, depending on your signal strength.</p>
                    </div>
                ) : error ? (
                    <div className="bg-rose-100 dark:bg-rose-900/40 border border-rose-200 dark:border-rose-700 text-rose-800 dark:text-rose-300 p-6 rounded-lg flex flex-col sm:flex-row items-center gap-4 animate-fade-in text-center sm:text-left">
                        <XCircle size={32} className="flex-shrink-0" />
                        <div>
                            <h3 className="font-bold text-xl mb-1">Oh no! Something went wrong.</h3>
                            <p className="text-base">{error} Please try refreshing the page.</p>
                        </div>
                    </div>
                ) : notifications.length === 0 ? (
                    <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 animate-fade-in">
                        {/* REMOVED: The motion.div containing the Sparkles icon for "Inbox is Sparkling Clean!" */}
                        <p className="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-3">Your Inbox is Sparkling Clean!</p>
                        <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
                            No new notifications to show right now.
                            Enjoy the peace, or go make some waves!
                        </p>
                    </div>
                ) : (
                    <ul className="space-y-4">
                        {notifications.map((note) => (
                            <li
                                key={note.uniqueId}
                                className={`p-4 ${getCardClasses(note.read, dismissingId === note.uniqueId)}`}
                                aria-live="polite"
                                role="status"
                                style={dismissingId === note.uniqueId ? { overflow: 'hidden' } : {}}
                            >
                                <div className="flex items-center justify-between w-full">
                                    <div className="flex items-start space-x-4 flex-grow">
                                        <div className="flex-shrink-0 mt-1">
                                            {getNotificationIcon(note.type)}
                                        </div>
                                        <div className="flex-grow">
                                            <p className={`font-semibold text-lg mb-0.5 ${note.read ? 'text-gray-600 dark:text-gray-400' : 'text-gray-900 dark:text-white'}`}>
                                                {note.title || "New Update"}
                                            </p>
                                            <p className={`text-base ${note.read ? 'text-gray-500 dark:text-gray-400' : 'text-gray-700 dark:text-gray-300'}`}>
                                                {note.message}
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                                                {note.timestamp
                                                    ? new Date(note.timestamp).toLocaleString(undefined, {
                                                        year: 'numeric', month: 'short', day: 'numeric',
                                                        hour: '2-digit', minute: '2-digit'
                                                    })
                                                    : "Time unavailable"}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex-shrink-0 flex items-center space-x-2 ml-4">
                                        {!note.read && (
                                            <button
                                                onClick={() => handleMarkAsRead(note.uniqueId)}
                                                className="px-3 py-1.5 text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors duration-200 flex items-center gap-1"
                                                aria-label={`Mark "${note.title || 'this notification'}" as read`}
                                            >
                                                <CheckCheck size={16} /> Read
                                            </button>
                                        )}
                                        <button
                                            onClick={() => handleDismissNotification(note.uniqueId)}
                                            className="p-1.5 rounded-full text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-gray-100 dark:hover:bg-700 transition-colors duration-200"
                                            aria-label={`Dismiss "${note.title || 'this notification'}"`}
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </section>
    );
};

export default Notifications;