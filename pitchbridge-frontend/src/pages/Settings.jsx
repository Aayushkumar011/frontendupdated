import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  User, Mail, Lock, Image, Bell, Shield, Trash2,
  ChevronRight, Sparkles, Sliders
} from 'lucide-react';

const Settings = () => {
  useEffect(() => {
    // CSS for animations (Fade-in and Blob)
    const style = document.createElement('style');
    style.id = 'settings-animations'; // Give it an ID to prevent duplicates if component re-mounts

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

      /* Optional: Body background pattern for extra flair (might override your App.jsx background) */
      /*
      body.settings-page-active {
        background-image: radial-gradient(#e0e0e0 1px, transparent 1px), radial-gradient(#e0e0e0 1px, transparent 1px);
        background-size: 20px 20px;
        background-position: 0 0, 10px 10px;
        background-color: #f8f8f8;
      }
      .dark body.settings-page-active {
        background-image: radial-gradient(#4a4a4a 1px, transparent 1px), radial-gradient(#4a4a4a 1px, transparent 1px);
        background-color: #1a1a1a;
      }
      */
    `;

    // Only append if it doesn't already exist (e.g., component unmounted/remounted)
    if (!document.getElementById('settings-animations')) {
      document.head.appendChild(style);
    }

    // Add class to body for specific background if desired
    // document.body.classList.add('settings-page-active');

    // Cleanup: Remove the style tag and body class when component unmounts
    return () => {
      const existingStyle = document.getElementById('settings-animations');
      if (existingStyle) {
        document.head.removeChild(existingStyle);
      }
      // document.body.classList.remove('settings-page-active');
    };
  }, []); // Empty dependency array means this runs once on mount and cleans up on unmount

  // Define your settings options with paths, icons, descriptions, and colors
  const settingsOptions = [
    {
      name: 'Change Username', path: '/settings/username', icon: User,
      description: 'Update your display name and unique identifier.',
      color: 'blue'
    },
    {
      name: 'Change Email', path: '/settings/email', icon: Mail,
      description: 'Modify the email address associated with your account.',
      color: 'purple'
    },
    {
      name: 'Change Password', path: '/settings/password', icon: Lock,
      description: 'Secure your account by updating your password regularly.',
      color: 'green'
    },
    {
      name: 'Update Profile Picture', path: '/settings/profile-picture', icon: Image,
      description: 'Personalize your profile with a new avatar.',
      color: 'yellow'
    },
    {
      name: 'Notification Preferences', path: '/settings/notifications', icon: Bell,
      description: 'Control how and when you receive important alerts.',
      color: 'teal'
    },
    {
      name: 'Privacy Settings', path: '/settings/privacy', icon: Shield,
      description: 'Manage your data visibility and sharing options.',
      color: 'indigo'
    },
    {
      name: 'Advanced Settings', path: '/settings/advanced', icon: Sliders,
      description: 'Explore more advanced configuration options.',
      color: 'gray'
    },
    {
      name: 'Delete Account', path: '/settings/delete', icon: Trash2,
      description: 'Permanently remove your account and all associated data.',
      danger: true, color: 'red'
    },
  ];

  // Helper function to get color classes based on the chosen color scheme
  const getColorClasses = (color, type = 'bg') => {
    const colors = {
      blue: { bg: 'bg-blue-100 dark:bg-blue-900/40', text: 'text-blue-600 dark:text-blue-300', border: 'border-blue-200 dark:border-blue-700' },
      purple: { bg: 'bg-purple-100 dark:bg-purple-900/40', text: 'text-purple-600 dark:text-purple-300', border: 'border-purple-200 dark:border-purple-700' },
      green: { bg: 'bg-green-100 dark:bg-green-900/40', text: 'text-green-600 dark:text-green-300', border: 'border-green-200 dark:border-green-700' },
      yellow: { bg: 'bg-yellow-100 dark:bg-yellow-900/40', text: 'text-yellow-600 dark:text-yellow-300', border: 'border-yellow-200 dark:border-yellow-700' },
      teal: { bg: 'bg-teal-100 dark:bg-teal-900/40', text: 'text-teal-600 dark:text-teal-300', border: 'border-teal-200 dark:border-teal-700' },
      indigo: { bg: 'bg-indigo-100 dark:bg-indigo-900/40', text: 'text-indigo-600 dark:text-indigo-300', border: 'border-indigo-200 dark:border-indigo-700' },
      gray: { bg: 'bg-gray-100 dark:bg-gray-700', text: 'text-gray-600 dark:text-gray-300', border: 'border-gray-200 dark:border-gray-600' },
      red: { bg: 'bg-red-100 dark:bg-red-900/40', text: 'text-red-600 dark:text-red-300', border: 'border-red-200 dark:border-red-700' },
    };
    return colors[color] ? colors[color][type] : '';
  };


  return (
    // Main container with a richer, more dynamic background
    <div className="p-6 md:p-10 lg:p-12 min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white relative overflow-hidden">
      {/* Optional: Add some subtle background blobs/shapes for flair */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-blue-300 dark:bg-blue-600 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
      <div className="absolute bottom-1/4 right-0 w-80 h-80 bg-purple-300 dark:bg-purple-600 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute top-1/2 left-1/4 w-72 h-72 bg-green-300 dark:bg-green-600 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>

      {/* Content wrapper to ensure it's above the background elements */}
      <div className="relative z-10 animate-fade-in">
        {/* Hero Header Section */}
        <div className="text-center mb-16">
          <Sparkles size={48} className="text-yellow-500 dark:text-yellow-400 mx-auto mb-4 drop-shadow-lg" />
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white mb-4 tracking-tight leading-tight">
            Your Personal Hub
          </h1>
          <p className="text-lg sm:text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
            Tailor your experience, manage your profile, and ensure your account is secure.
          </p>
        </div>

        {/* Settings Options Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {settingsOptions.map((option) => (
            <Link
              key={option.name}
              to={option.path}
              className={`
                group flex items-center justify-between p-6 rounded-2xl
                transition-all duration-300 ease-in-out
                transform hover:-translate-y-2 hover:shadow-2xl
                relative overflow-hidden
                ${option.danger
                  ? 'bg-red-50 dark:bg-red-900/20'
                  : 'bg-white dark:bg-gray-800'
                }
                shadow-xl
                border ${getColorClasses(option.color, 'border')}
              `}
              // Dynamic background for the card on hover (can be adjusted for dark mode)
              style={{
                // This style property applies the *base* background and then the overlay will change on hover
                background: option.danger
                  ? `linear-gradient(to right, ${getColorClasses('red', 'bg').replace('bg-','')}, transparent)`
                  : `linear-gradient(to right, ${getColorClasses(option.color, 'bg').replace('bg-','')}, transparent)`,
              }}
            >
              {/* Card background overlay on hover for subtle color change */}
              <div className={`
                absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl
                ${option.danger
                  ? 'bg-red-500/10 dark:bg-red-500/10'
                  : `${getColorClasses(option.color, 'text').replace('text-','')}/10 dark:${getColorClasses(option.color, 'text').replace('text-','')}/10`
                }
                pointer-events-none
              `}></div>

              <div className="flex items-center space-x-5 relative z-10">
                {/* Icon Container with dynamic background */}
                <div
                  className={`
                    p-4 rounded-xl flex items-center justify-center
                    ${getColorClasses(option.color, 'bg')}
                    ${getColorClasses(option.color, 'text')}
                    shadow-md
                    group-hover:scale-105 transition-transform duration-300
                  `}
                >
                  <option.icon size={26} strokeWidth={2} />
                </div>
                {/* Text Content */}
                <div>
                  <h2 className={`font-bold text-xl mb-1 ${option.danger ? 'text-red-700 dark:text-red-200' : 'text-gray-900 dark:text-white'}`}>
                    {option.name}
                  </h2>
                  <p className={`text-md ${option.danger ? 'text-red-500 dark:text-red-400' : 'text-gray-600 dark:text-gray-400'}`}>
                    {option.description}
                  </p>
                </div>
              </div>
              {/* Right Arrow Icon */}
              <ChevronRight size={26} className={`
                ${option.danger ? 'text-red-400' : 'text-gray-400'}
                group-hover:translate-x-1 transition-transform duration-300 relative z-10
              `} />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Settings;