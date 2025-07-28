import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../config';
import { Shield, Loader2, CheckCircle, XCircle, ChevronLeft } from 'lucide-react'; // Changed ArrowLeft to ChevronLeft for consistency with other pages
import { Link } from 'react-router-dom'; // Import Link

const PrivacySettings = () => {
  const [showProfile, setShowProfile] = useState(false);
  const [allowMessages, setAllowMessages] = useState(false);
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    const style = document.createElement('style');
    style.id = 'privacy-settings-animations';
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

      /* Custom Checkbox Styles (reused) */
      .custom-checkbox {
        appearance: none;
        -webkit-appearance: none;
        -moz-appearance: none;
        width: 1.5rem;
        height: 1.5rem;
        border: 2px solid #D1D5DB;
        border-radius: 0.375rem;
        cursor: pointer;
        outline: none;
        transition: all 0.2s ease-in-out;
        display: inline-block;
        vertical-align: middle;
        position: relative;
        flex-shrink: 0;
      }

      .custom-checkbox:checked {
        border-color: #3B82F6;
        background-color: #3B82F6;
      }

      .custom-checkbox:focus {
        ring: 2px solid #60A5FA;
        border-color: transparent;
      }

      .custom-checkbox:checked::after {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        width: 0.6rem;
        height: 1.2rem;
        border: solid white;
        border-width: 0 3px 3px 0;
        transform: translate(-50%, -50%) rotate(45deg);
        -webkit-transform: translate(-50%, -50%) rotate(45deg);
        -ms-transform: translate(-50%, -50%) rotate(45deg);
      }

      .dark .custom-checkbox {
        border-color: #4B5563;
        background-color: #374151;
      }

      .dark .custom-checkbox:checked {
        border-color: #2563EB;
        background-color: #2563EB;
      }
    `;
    if (!document.getElementById('privacy-settings-animations')) {
      document.head.appendChild(style);
    }
    return () => {
      const existingStyle = document.getElementById('privacy-settings-animations');
      if (existingStyle) {
        document.head.removeChild(existingStyle);
      }
    };
  }, []);

  useEffect(() => {
    const fetchSettings = async () => {
      setIsFetching(true);
      const token = localStorage.getItem('token');
      try {
        const res = await axios.get(`${API_BASE_URL}/settings/privacy`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const { showProfile: initialShowProfile, allowMessages: initialAllowMessages } = res.data.privacy || { showProfile: false, allowMessages: false };
        setShowProfile(initialShowProfile);
        setAllowMessages(initialAllowMessages);
      } catch (err) {
        setMessage(err.response?.data?.message || 'Error fetching privacy settings.');
        setMessageType('error');
      } finally {
        setIsFetching(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setMessageType('');
    setIsLoading(true);
    const token = localStorage.getItem('token');

    try {
      const res = await axios.put(
        `${API_BASE_URL}/settings/privacy`,
        { privacy: { showProfile, allowMessages } },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage(res.data.message || 'Privacy settings saved successfully!');
      setMessageType('success');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Error updating privacy settings.');
      setMessageType('error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gray-100 dark:bg-gray-900 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-64 h-64 bg-indigo-300 dark:bg-indigo-600 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
      <div className="absolute bottom-1/4 right-0 w-80 h-80 bg-purple-300 dark:bg-purple-600 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute top-1/2 left-1/4 w-72 h-72 bg-blue-300 dark:bg-blue-600 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>

      <div className="relative z-10 w-full max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8 md:p-10 animate-fade-in border border-indigo-200 dark:border-indigo-700">
        <div className="text-center mb-8">
          <div className="p-4 inline-flex items-center justify-center rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-800 dark:text-indigo-300 shadow-lg mb-4">
            <Shield size={36} />
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">Privacy Settings</h2>
          <p className="text-gray-600 dark:text-gray-400 text-md">
            Control your data visibility and how you interact with others.
          </p>
        </div>

        {isFetching ? (
          <div className="flex flex-col items-center justify-center h-48 text-gray-500 dark:text-gray-400">
            <Loader2 className="animate-spin mb-3" size={32} />
            <p>Loading privacy settings...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex items-center space-x-3">
              <input
                id="show-profile"
                type="checkbox"
                checked={showProfile}
                onChange={() => setShowProfile(!showProfile)}
                className="custom-checkbox"
                disabled={isLoading}
              />
              <label htmlFor="show-profile" className="text-lg text-gray-800 dark:text-gray-200 cursor-pointer select-none">
                Show My Profile Publicly
              </label>
            </div>

            <div className="flex items-center space-x-3">
              <input
                id="allow-messages"
                type="checkbox"
                checked={allowMessages}
                onChange={() => setAllowMessages(!allowMessages)}
                className="custom-checkbox"
                disabled={isLoading}
              />
              <label htmlFor="allow-messages" className="text-lg text-gray-800 dark:text-gray-200 cursor-pointer select-none">
                Allow Direct Messages
              </label>
            </div>

            <button
              type="submit"
              className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold text-white
                          transition-all duration-300 ease-in-out
                          ${isLoading
                              ? 'bg-blue-400 dark:bg-blue-600 cursor-not-allowed'
                              : 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800'
                          }
                          transform hover:scale-[1.005]
                         `}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" size={20} /> Saving...
                </>
              ) : (
                <>
                  Save Privacy Settings <Shield size={18} />
                </>
              )}
            </button>
          </form>
        )}

        {message && (
          <div className={`mt-6 p-4 rounded-lg flex items-center gap-3 justify-center
            ${messageType === 'success'
              ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300 border border-green-200 dark:border-green-700'
              : 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300 border border-red-200 dark:border-red-700'
            }`}
            role="alert"
          >
            {messageType === 'success' ? <CheckCircle size={20} /> : <XCircle size={20} />}
            <p className="text-sm font-medium">{message}</p>
          </div>
        )}

        {/* Consistent "Back to Settings" Link placement and styling */}
        <Link
          to="/settings"
          className="mt-6 text-center text-blue-600 dark:text-blue-400 hover:underline flex items-center justify-center gap-1"
        >
          <ChevronLeft size={16} /> Back to Settings
        </Link>
      </div>
    </div>
  );
};

export default PrivacySettings;