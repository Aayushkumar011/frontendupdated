// src/pages/Profile.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from "../context/AuthContext"; // Adjust path as needed, assuming context is in src/context
import { useNavigate } from 'react-router-dom';
import {
    Mail, User, Briefcase, Edit, Save, X, Lock, Settings, ChevronRight, Shield,
    Phone, MapPin, MessageSquare, Loader2, Image, Sparkles, Trash2
} from 'lucide-react';

const Profile = () => {
    const { user, updateUserProfile } = useAuth();
    const navigate = useNavigate();

    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [bio, setBio] = useState(user?.bio || '');
    const [phone, setPhone] = useState(user?.phone || '');
    const [location, setLocation] = useState(user?.location || '');
    const [profileImage, setProfileImage] = useState(user?.profileImageUrl || null);
    const [statusMessage, setStatusMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const fileInputRef = useRef(null);

    // useEffect for injecting global CSS animations for blobs
    useEffect(() => {
        const style = document.createElement('style');
        style.id = 'profile-page-animations'; // Unique ID for this page's animations
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
        `;

        // Only append if not already present to avoid duplicates
        if (!document.getElementById('profile-page-animations')) {
            document.head.appendChild(style);
        }

        // Cleanup function to remove the style tag when component unmounts
        return () => {
            const existingStyle = document.getElementById('profile-page-animations');
            if (existingStyle) {
                document.head.removeChild(existingStyle);
            }
        };
    }, []);

    useEffect(() => {
        if (user) {
            setName(user.name || '');
            setEmail(user.email || '');
            setBio(user.bio || '');
            setPhone(user.phone || '');
            setLocation(user.location || '');
            setProfileImage(user.profileImageUrl || null);
        }
    }, [user]);

    const handleSave = async () => {
        setStatusMessage('');
        setIsLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            await updateUserProfile({
                name,
                email,
                bio,
                phone,
                location,
                profileImageUrl: profileImage
            });
            setStatusMessage('Profile updated successfully!');
            setIsEditing(false);
        } catch (error) {
            console.error("Failed to update profile:", error);
            setStatusMessage('Failed to update profile. Please try again.');
        } finally {
            setIsLoading(false);
            setTimeout(() => setStatusMessage(''), 3000);
        }
    };

    const handleCancel = () => {
        setName(user?.name || '');
        setEmail(user?.email || '');
        setBio(user?.bio || '');
        setPhone(user?.phone || '');
        setLocation(user?.location || '');
        setProfileImage(user?.profileImageUrl || null);
        setIsEditing(false);
        setStatusMessage('');
    };

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfileImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handlePhotoChangeClick = () => {
        fileInputRef.current.click();
    };

    const handleRemovePhoto = () => {
        setProfileImage(null); // Set profile image to null to remove it
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-blue-100 dark:bg-gray-900 relative overflow-hidden">
            {/* Background blobs - Copied from settings pages */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-purple-300 dark:bg-purple-600 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
            <div className="absolute bottom-1/4 right-0 w-80 h-80 bg-pink-300 dark:bg-pink-600 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
            <div className="absolute top-1/2 left-1/4 w-72 h-72 bg-blue-300 dark:bg-blue-600 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>

            <div className="relative z-10 w-full max-w-4xl mx-auto bg-white/70 dark:bg-gray-800/70 backdrop-blur-md rounded-xl shadow-2xl p-8 md:p-12 border border-gray-200 dark:border-gray-700 animate-fade-in">
                {/* Profile Header & Avatar Section */}
                <div className="text-center mb-12">
                    {/* Added Sparkles Icon */}
                    <div className="mb-4">
                        <Sparkles className="mx-auto w-16 h-16 text-yellow-400 dark:text-yellow-300" strokeWidth={1.5} />
                    </div>

                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-center gap-6">
                        {/* Profile Avatar with dynamic image or initials */}
                        <div className="relative w-28 h-28 md:w-32 md:h-32">
                            {profileImage ? (
                                <img
                                    src={profileImage}
                                    alt="Profile Avatar"
                                    className="w-full h-full rounded-full object-cover border-4 border-white shadow-lg"
                                />
                            ) : (
                                <div className="w-full h-full rounded-full bg-white/20 border-4 border-white flex items-center justify-center text-5xl font-bold text-white shadow-lg">
                                    <span className="sr-only">User Avatar: </span>
                                    {user?.name ? user.name.charAt(0).toUpperCase() : '?'}
                                </div>
                            )}
                            {/* Generic Profile Icon Overlay (acting as a "logo") - ONLY SHOW IF NO profileImage */}
                            {!profileImage && (
                                <div
                                    className="absolute bottom-0 right-0 w-12 h-12 md:w-14 md:h-14 rounded-full border-4 border-white bg-white flex items-center justify-center p-2 text-blue-500 shadow-md"
                                    aria-hidden="true" // Indicate it's decorative
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="currentColor"
                                        className="w-full h-full"
                                    >
                                        <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695H4.188a.75.75 0 01-.437-.695z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            )}
                        </div>
                        <div className="text-center md:text-left">
                            <h1 className="text-4xl font-extrabold mb-2 leading-tight text-gray-900 dark:text-white">
                                Hello, {user?.name || 'User'}!
                            </h1>
                            <p className="text-gray-600 dark:text-gray-300 text-lg">
                                Manage your personal information and public profile.
                            </p>
                        </div>
                    </div>
                    {/* Hidden file input */}
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageChange}
                        className="hidden"
                        accept="image/*"
                        aria-label="Upload new profile photo"
                    />
                    {/* Buttons to trigger file input and remove photo */}
                    <div className="flex justify-center gap-4 mt-6">
                        <button
                            onClick={handlePhotoChangeClick}
                            className="bg-blue-600 text-white px-5 py-2 rounded-full font-semibold text-sm shadow-md hover:bg-blue-700 transition flex items-center gap-2"
                            aria-label="Change Profile Photo"
                        >
                            <Image className="w-4 h-4" aria-hidden="true" /> Change Photo
                        </button>
                        {profileImage && ( // Only show remove button if there's a profile image
                            <button
                                onClick={handleRemovePhoto}
                                className="bg-red-500 text-white px-5 py-2 rounded-full font-semibold text-sm shadow-md hover:bg-red-600 transition flex items-center gap-2"
                                aria-label="Remove Profile Photo"
                            >
                                <Trash2 className="w-4 h-4" aria-hidden="true" /> Remove Photo
                            </button>
                        )}
                    </div>
                </div>

                {/* Status Message */}
                {statusMessage && (
                    <div
                        className={`flex items-center gap-2 mb-4 p-3 rounded-md text-sm ${
                            statusMessage.includes('successfully')
                                ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300'
                                : 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300'
                        }`}
                        role="status"
                        aria-live="polite"
                    >
                        {statusMessage.includes('successfully') ? (
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        ) : (
                            <X className="w-5 h-5" aria-hidden="true" />
                        )}
                        {statusMessage}
                    </div>
                )}

                {/* Basic & Contact Information Section */}
                <div className="bg-white dark:bg-gray-700 rounded-lg shadow-xl p-6 md:p-8 border border-gray-200 dark:border-gray-600">
                    <div className="flex justify-between items-center mb-6 border-b border-gray-200 dark:border-gray-600 pb-4">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Your Details</h2>
                        {!isEditing ? (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 font-semibold transition dark:text-blue-400 dark:hover:text-blue-300"
                                aria-label="Edit Profile"
                            >
                                <Edit className="w-5 h-5" aria-hidden="true" />
                                <span>Edit Profile</span>
                            </button>
                        ) : (
                            <div className="flex space-x-3">
                                <button
                                    onClick={handleCancel}
                                    className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 font-semibold transition px-3 py-2 rounded-md dark:text-gray-300 dark:hover:text-gray-100"
                                    aria-label="Cancel Profile Edit"
                                    disabled={isLoading}
                                >
                                    <X className="w-5 h-5" aria-hidden="true" />
                                    <span>Cancel</span>
                                </button>
                                <button
                                    onClick={handleSave}
                                    className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed dark:bg-blue-700 dark:hover:bg-blue-800"
                                    aria-label="Save Profile Changes"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
                                    ) : (
                                        <Save className="w-5 h-5" aria-hidden="true" />
                                    )}
                                    <span>{isLoading ? 'Saving...' : 'Save'}</span>
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
                        {/* Full Name */}
                        <div className="space-y-1">
                            <label htmlFor="fullName" className="text-gray-600 dark:text-gray-300 text-sm font-medium flex items-center gap-2">
                                <User className="w-4 h-4" aria-hidden="true" /> Full Name
                            </label>
                            {isEditing ? (
                                <input
                                    id="fullName"
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full p-3 rounded-md bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 dark:text-white text-lg"
                                    placeholder="Your Name"
                                    aria-invalid={!name ? 'true' : 'false'}
                                />
                            ) : (
                                <p className="text-gray-900 dark:text-white text-lg font-medium">{user?.name || 'Not Set'}</p>
                            )}
                        </div>

                        {/* Email Address */}
                        <div className="space-y-1">
                            <label htmlFor="emailAddress" className="text-gray-600 dark:text-gray-300 text-sm font-medium flex items-center gap-2">
                                <Mail className="w-4 h-4" aria-hidden="true" /> Email Address
                            </label>
                            {isEditing ? (
                                <input
                                    id="emailAddress"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full p-3 rounded-md bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 dark:text-white text-lg"
                                    placeholder="your.email@example.com"
                                    aria-invalid={!email || !email.includes('@') ? 'true' : 'false'}
                                />
                            ) : (
                                <p className="text-gray-900 dark:text-white text-lg font-medium">{user?.email || 'Not Set'}</p>
                            )}
                        </div>

                        {/* Phone Number */}
                        <div className="space-y-1">
                            <label htmlFor="phoneNumber" className="text-gray-600 dark:text-gray-300 text-sm font-medium flex items-center gap-2">
                                <Phone className="w-4 h-4" aria-hidden="true" /> Phone Number
                            </label>
                            {isEditing ? (
                                <input
                                    id="phoneNumber"
                                    type="tel"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="w-full p-3 rounded-md bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 dark:text-white text-lg"
                                    placeholder="e.g., +1 (555) 123-4567"
                                />
                            ) : (
                                <p className="text-gray-900 dark:text-white text-lg font-medium">{user?.phone || 'Not Set'}</p>
                            )}
                        </div>

                        {/* Location */}
                        <div className="space-y-1">
                            <label htmlFor="location" className="text-gray-600 dark:text-gray-300 text-sm font-medium flex items-center gap-2">
                                <MapPin className="w-4 h-4" aria-hidden="true" /> Location
                            </label>
                            {isEditing ? (
                                <input
                                    id="location"
                                    type="text"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    className="w-full p-3 rounded-md bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 dark:text-white text-lg"
                                    placeholder="e.g., New York, USA"
                                />
                            ) : (
                                <p className="text-gray-900 dark:text-white text-lg font-medium">{user?.location || 'Not Set'}</p>
                            )}
                        </div>

                        {/* Role (Static Display) */}
                        <div className="space-y-1">
                            <label className="text-gray-600 dark:text-gray-300 text-sm font-medium flex items-center gap-2">
                                <Briefcase className="w-4 h-4" aria-hidden="true" /> Your Role
                            </label>
                            <p className="text-gray-900 dark:text-white text-lg font-medium capitalize">{user?.role || 'Not Set'}</p>
                        </div>

                        {/* Joined On (Static Display) */}
                        <div className="space-y-1">
                            <label className="text-gray-600 dark:text-gray-300 text-sm font-medium flex items-center gap-2">
                                <Briefcase className="w-4 h-4" aria-hidden="true" /> Joined On
                            </label>
                            <p className="text-gray-900 dark:text-white text-lg font-medium">
                                {user?.joinedDate ? new Date(user.joinedDate).toLocaleDateString() : 'N/A'}
                            </p>
                        </div>

                        {/* Bio (Full width) */}
                        <div className="space-y-1 md:col-span-2">
                            <label htmlFor="bio" className="text-gray-600 dark:text-gray-300 text-sm font-medium flex items-center gap-2">
                                <MessageSquare className="w-4 h-4" aria-hidden="true" /> Bio / About Me
                            </label>
                            {isEditing ? (
                                <textarea
                                    id="bio"
                                    value={bio}
                                    onChange={(e) => setBio(e.target.value)}
                                    rows="4"
                                    className="w-full p-3 rounded-md bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 dark:text-white text-lg resize-y"
                                    placeholder="Tell us a little about yourself..."
                                ></textarea>
                            ) : (
                                <p className="text-gray-900 dark:text-white text-lg font-medium whitespace-pre-wrap">{user?.bio || 'Not Set'}</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Account Management Section */}
                <div className="bg-white dark:bg-gray-700 rounded-lg shadow-xl p-6 md:p-8 border border-gray-200 dark:border-gray-600 mt-8">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 border-b border-gray-200 dark:border-gray-600 pb-4">
                        Account Management
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                        For advanced settings like changing your password, managing notifications, or other account actions, please visit the dedicated settings page.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <button
                            onClick={() => navigate('/settings')}
                            className="flex items-center gap-3 bg-blue-600 text-white px-6 py-2 rounded-md font-semibold hover:bg-blue-700 transition dark:bg-blue-700 dark:hover:bg-blue-800"
                            aria-label="Go to Settings page"
                        >
                            <Settings className="w-5 h-5" aria-hidden="true" /> Go to Settings
                        </button>
                        <button
                            onClick={() => navigate('/settings/delete')}
                            className="flex items-center gap-3 bg-red-600 text-white px-6 py-2 rounded-md font-semibold hover:bg-red-700 transition dark:bg-red-700 dark:hover:bg-red-800"
                            aria-label="Delete Account"
                        >
                            <X className="w-5 h-5" aria-hidden="true" /> Delete Account
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;