// src/pages/Profile.jsx
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useAuth } from "../context/AuthContext";
import { useNavigate } from 'react-router-dom';
import {
    Mail, User, Briefcase, Edit, Save, X, Settings, MapPin,
    MessageSquare, Loader2, Image, Sparkles, Trash2
} from 'lucide-react';
import { API_BASE_URL } from '../config';
import { useTheme } from "../context/ThemeContext";

const Profile = () => {
    const { user, updateUserProfile } = useAuth();
    const navigate = useNavigate();
    const { theme } = useTheme(); // Now only used for dynamic class logic, not explicit color variables

    // State variables
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');
    const role = user?.role;
    const [bio, setBio] = useState(user?.bio || '');
    const [linkedin, setlinkedin] = useState(user?.linkedin || '');
    const [location, setLocation] = useState(user?.location || '');
    const [profileImage, setProfileImage] = useState(user?.profilePic || '');
    const [statusMessage, setStatusMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isLoading1, setIsLoading1] = useState(false);
    const [isLoading2, setIsLoading2] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const fileInputRef = useRef(null);
    const [Dates, setDate] = useState('');

    // **Removed customPink and lighterPink JS variables here.**
    // They are now managed via Tailwind classes in tailwind.config.js

    // The primary container for the profile content, which will be the lighter shade in light mode
    const profileContentContainerClasses = `
        relative z-10 w-full max-w-4xl mx-auto rounded-xl shadow-2xl p-8 md:p-12
        border border-white/10 dark:border-white/10 animate-fade-in
        ${theme === 'light' ? 'bg-lighter-pink' : 'bg-gray-700'}
    `;

    // The account management section's background will also use the lighter color
    const accountManagementClasses = `
        rounded-lg shadow-xl p-6 md:p-8 border border-gray-200 dark:border-gray-600 mt-8
        ${theme === 'light' ? 'bg-lighter-pink' : 'bg-gray-700'}
    `;

    // Inject CSS for background animations (keep this, as it's not directly color related)
    useEffect(() => {
        const style = document.createElement('style');
        style.id = 'profile-page-animations';
        style.innerHTML = `
      @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      .animate-fade-in { animation: fadeIn 0.5s ease-out forwards; }
      @keyframes blob { 0% { transform: translate(0px, 0px) scale(1); } 33% { transform: translate(30px, -50px) scale(1.1); } 66% { transform: translate(-20px, 20px) scale(0.9); } 100% { transform: translate(0px, 0px) scale(1); } }
      .animate-blob { animation: blob 7s infinite cubic-bezier(0.68, -0.55, 0.27, 1.55); }
      .animation-delay-2000 { animation-delay: 2s; }
      .animation-delay-4000 { animation-delay: 4s; }
    `;
        if (!document.getElementById('profile-page-animations')) {
            document.head.appendChild(style);
        }
        return () => {
            const existingStyle = document.getElementById('profile-page-animations');
            if (existingStyle) document.head.removeChild(existingStyle);
        };
    }, []);

    // ... (rest of your useEffects and handler functions remain the same) ...

    useEffect(() => {
        if (user) {
            setName(user.name || '');
            setEmail(user.email || '');
            setBio(user.bio || '');
            setLocation(user.location || '');
            setlinkedin(user.linkedin || '');
            setProfileImage(user.profilePic || '');
            setDate(user.createdAt);
        }
    }, [user]);

    useEffect(() => {
        let isMounted = true;

        const fetchProfile = async () => {
            try {
                if (isMounted) {
                    setIsFetching(true);
                }

                const token = localStorage.getItem('token');
                const userString = localStorage.getItem('user');

                if (!userString || !token) {
                    if (isMounted) {
                        setProfileImage('');
                        setIsFetching(false);
                    }
                    return;
                }

                let userObj;
                try {
                    userObj = JSON.parse(userString);
                } catch {
                    if (isMounted) {
                        setProfileImage('');
                        setIsFetching(false);
                    }
                    return;
                }

                const id = userObj._id;
                const response = await axios.get(`${API_BASE_URL}/api/users/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (isMounted) {
                    const fetchedUserData = response.data;
                    setProfileImage(fetchedUserData.profilePic || '');
                    setDate(fetchedUserData.createdAt);
                    setName(fetchedUserData.name || '');
                    setEmail(fetchedUserData.email || '');
                    setBio(fetchedUserData.bio || '');
                    setlinkedin(fetchedUserData.linkedin || '');
                    setLocation(fetchedUserData.location || '');

                    updateUserProfile(fetchedUserData);
                    setIsFetching(false);
                }
            } catch (err) {
                if (isMounted) {
                    setStatusMessage(
                        err.response?.data?.message || 'Could not fetch current profile data.'
                    );
                    setProfileImage('');
                    setIsFetching(false);
                }
            }
        };

        fetchProfile();

        return () => {
            isMounted = false;
        };
    }, [updateUserProfile]);


    const handleSave = async () => {
        setStatusMessage('');
        setIsLoading(true);
        try {
            const updatedData = {
                name,
                email,
                bio,
                linkedin,
                location,
            };

            const token = localStorage.getItem('token');
            if (!token || !user?._id) {
                throw new Error('User not authenticated or ID not found');
            }

            const response = await axios.put(
                `${API_BASE_URL}/api/users/${user._id}`,
                updatedData,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            updateUserProfile(response.data);
            setStatusMessage('Profile updated successfully!');
            setIsEditing(false);
        } catch (error) {
            console.error("Error saving profile:", error);
            setStatusMessage(error.response?.data?.message || 'Failed to update profile. Please try again.');
        } finally {
            setIsLoading(false);
            setTimeout(() => setStatusMessage(''), 3000);
        }
    };

    const CLOUD_NAME = "ddz1j7qtz";
    const UPLOAD_PRESET = "profilePhoto";

    const handleImageChange = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        if (file.size > 2 * 1024 * 1024) {
            setStatusMessage("File too large. Please choose an image under 2MB.");
            return;
        }

        setIsLoading1(true);
        setStatusMessage("Uploading picture...");

        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', UPLOAD_PRESET);

            const res = await fetch(
                `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
                { method: 'POST', body: formData }
            );
            const data = await res.json();

            if (!data.secure_url) {
                throw new Error(data.error?.message || "Cloudinary upload failed");
            }

            setProfileImage(data.secure_url);
            await updateProfilePicture(data.secure_url);
            setStatusMessage("Profile picture updated successfully!");

        } catch (err) {
            console.error("Error during image upload:", err);
            setStatusMessage(`Error uploading image: ${err.message || 'Please try again.'}`);
        } finally {
            setIsLoading1(false);
            setTimeout(() => setStatusMessage(''), 3000);
        }
    };

    const updateProfilePicture = async (imageUrl) => {
        const token = localStorage.getItem('token');
        if (!token || !user?._id) {
            setStatusMessage('User not authenticated or ID not found.');
            return;
        }

        try {
            const response = await axios.put(
                `${API_BASE_URL}/api/users/${user._id}`,
                { profilePic: imageUrl },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            updateUserProfile({ profilePic: imageUrl });
            setStatusMessage("Profile picture updated successfully!");
        } catch (error) {
            console.error("Error updating profile picture on backend:", error);
            setStatusMessage('Failed to update profile picture on server.');
        } finally {
            // No need to set isLoading1 to false here, it's done in handleImageChange's finally block
        }
    };

    const handlePhotoChangeClick = () => fileInputRef.current.click();

    const handleRemovePhoto = async () => {
        setIsLoading2(true);
        setStatusMessage('');
        const token = localStorage.getItem('token');

        if (!token || !user?._id) {
            setStatusMessage('User not authenticated or ID not found.');
            setIsLoading2(false);
            return;
        }

        try {
            await axios.put(
                `${API_BASE_URL}/api/users/${user._id}`,
                { profilePic: '' },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setProfileImage('');
            updateUserProfile({ profilePic: '' });
            setStatusMessage('Profile photo removed.');
        } catch (err) {
            console.error("Error removing photo:", err);
            setStatusMessage('Failed to remove photo. Please try again.');
        } finally {
            setIsLoading2(false);
            setTimeout(() => setStatusMessage(''), 3000);
        }
    };

    const handleCancel = () => {
        setName(user?.name || '');
        setEmail(user?.email || '');
        setBio(user?.bio || '');
        setlinkedin(user?.linkedin || '');
        setLocation(user?.location || '');
        setIsEditing(false);
        setStatusMessage('');
    };

    if (isFetching) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p className="text-lg text-blue-500">Loading your profile...</p>
                <Loader2 className="animate-spin w-8 h-8 text-blue-600 ml-2" />
            </div>
        );
    }

    return (
        <div className={profileContentContainerClasses}> {/* Main profile content container */}
            {/* Profile Header & Avatar */}
            <div className="text-center mb-12">
                <div className="mb-4">
                    <Sparkles className="mx-auto w-16 h-16 text-yellow-400 dark:text-yellow-300" strokeWidth={1.5} />
                </div>
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-center gap-6">
                    <div className="relative w-28 h-28 md:w-32 md:h-32">
                        {isFetching ? (
                            <div className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center">
                                <Loader2 className="w-8 h-8 animate-spin" />
                            </div>
                        ) : profileImage ? (
                            <img
                                src={profileImage}
                                alt="Profile Avatar"
                                className="w-full h-full rounded-full object-cover border-4 border-white shadow-lg"
                                onError={e => { e.target.src = 'https://via.placeholder.com/150?text=No+Image'; }}
                            />
                        ) : (
                            <div className="w-full h-full rounded-full bg-white/20 border-4 border-white flex items-center justify-center text-5xl font-bold text-white shadow-lg">
                                <span className="sr-only">User Avatar: </span>
                                {name.charAt(0).toUpperCase()}
                            </div>
                        )}
                    </div>
                    <div className="text-center md:text-left">
                        <h1 className="text-4xl font-extrabold mb-2 leading-tight text-gray-900 dark:text-white">
                            Hello, {name || 'User'}!
                        </h1>
                        <p className="text-gray-600 dark:text-gray-300 text-lg">
                            Manage your personal information and public profile.
                        </p>
                    </div>
                </div>
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    className="hidden"
                    accept="image/*"
                    aria-label="Upload new profile photo"
                />
                <div className="flex justify-center gap-4 mt-6">
                    <button
                        onClick={handlePhotoChangeClick}
                        className="bg-blue-600 text-white px-5 py-2 rounded-full font-semibold text-sm shadow-md hover:bg-blue-700 transition flex items-center gap-2"
                        aria-label="Change Profile Photo"
                        disabled={isLoading1}
                    >
                        {isLoading1 ? (
                            <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
                        ) : (
                            <Image className="w-4 h-4" aria-hidden="true" />
                        )}
                        <span>{isLoading1 ? 'Changing Photo...' : 'Change Photo'}</span>
                    </button>
                    {profileImage && (
                        <button
                            onClick={handleRemovePhoto}
                            disabled={isLoading2}
                            className="bg-red-500 text-white px-5 py-2 rounded-full font-semibold text-sm shadow-md hover:bg-red-600 transition flex items-center gap-2"
                            aria-label="Remove Profile Photo"
                        >
                            {isLoading2 ? (
                                <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
                            ) : (
                                <Trash2 className="w-4 h-4" aria-hidden="true" />
                            )}
                            <span>{isLoading2 ? 'Removing Photo...' : 'Remove Photo'}</span>
                        </button>
                    )}
                </div>
            </div>

            {statusMessage && (
                <div
                    className={`flex items-center gap-2 mb-4 p-3 rounded-md text-sm ${statusMessage.includes('successfully')
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300'
                        : 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300'
                        }`}
                    role="status"
                    aria-live="polite"
                >
                    {statusMessage.includes('successfully')
                        ? <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        : <X className="w-5 h-5" aria-hidden="true" />}
                    {statusMessage}
                </div>
            )}

            {/* Basic & Contact Information Section */}
            {/* Removed the inline border/padding, and rely on the outer container for general styling */}
            <div className={`flex justify-between items-center mb-6 pb-4`}>
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
                        <p className="text-gray-900 dark:text-white text-lg font-medium">{name || 'Not Set'}</p>
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
                        <p className="text-gray-900 dark:text-white text-lg font-medium">{email || 'Not Set'}</p>
                    )}
                </div>

                {/* linkedin */}
                <div className="space-y-1">
                    <label htmlFor="linkedin" className="text-gray-600 dark:text-gray-300 text-sm font-medium flex items-center gap-2">
                        <svg viewBox="0 0 24 24" fill="currentColor" width="4" height="4" aria-hidden="true" className="w-4 h-4 text-blue-700">
                            <path d="M20.447 20.452H17.21v-5.569c0-1.328-.027-3.037-1.849-3.037-1.853 0-2.135 1.445-2.135
    2.939v5.667H9.036V9h3.104v1.561h.044c.433-.82 1.494-1.685 3.074-1.685
    3.29 0 3.895 2.164 3.895 4.981v6.595zM5.337 7.433a1.81
    1.81 0 1 1 0-3.619 1.81 1.81 0 0 1 0 3.619zm1.789
    13.019H3.549V9h3.577v11.452z" />
                        </svg> linkedin
                    </label>
                    {isEditing ? (
                        <input
                            id="linkedin"
                            type="text"
                            value={linkedin}
                            onChange={(e) => setlinkedin(e.target.value)}
                            className="w-full p-3 rounded-md bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 dark:text-white text-lg"
                            placeholder=""
                        />
                    ) : (
                        <p className="text-gray-900 dark:text-white text-lg font-medium">{linkedin || 'Not Set'}</p>
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
                        <p className="text-gray-900 dark:text-white text-lg font-medium">{location || 'Not Set'}</p>
                    )}
                </div>

                {/* Role (Static Display) */}
                <div className="space-y-1">
                    <label className="text-gray-600 dark:text-gray-300 text-sm font-medium flex items-center gap-2">
                        <Briefcase className="w-4 h-4" aria-hidden="true" /> Your Role
                    </label>
                    <p className="text-gray-900 dark:text-white text-lg font-medium capitalize">{role || 'Not Set'}</p>
                </div>

                {/* Joined On (Static Display) */}
                <div className="space-y-1">
                    <label className="text-gray-600 dark:text-gray-300 text-sm font-medium flex items-center gap-2">
                        <Briefcase className="w-4 h-4" aria-hidden="true" /> Joined On
                    </label>
                    <p className="text-gray-900 dark:text-white text-lg font-medium">
                        {Dates ? new Date(Dates).toLocaleDateString() : 'N/A'}
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
                        <p className="text-gray-900 dark:text-white text-lg font-medium whitespace-pre-wrap">{bio || 'Not Set'}</p>
                    )}
                </div>
            </div>

            {/* Account Management Section */}
            <div className={accountManagementClasses}>
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
    );
};

export default Profile;