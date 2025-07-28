import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Loader2, LogOut as LogOutIcon, CheckCircle, XCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Logout = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [message, setMessage] = useState('Are you sure you want to log out?');
  const [messageType, setMessageType] = useState('prompt'); // 'prompt', 'info', 'success', 'error'
  const [isLoading, setIsLoading] = useState(false); // Initially not loading, waiting for user input
  // showConfirmation is implicitly handled by messageType === 'prompt'

  // Apply animations (remains the same)
  useEffect(() => {
    const style = document.createElement('style');
    style.id = 'logout-animations';
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
    if (!document.getElementById('logout-animations')) {
      document.head.appendChild(style);
    }
    return () => {
      const existingStyle = document.getElementById('logout-animations');
      if (existingStyle) {
        document.head.removeChild(existingStyle);
      }
    };
  }, []); // This useEffect only runs once for animations

  const handleLogout = async () => {
    setIsLoading(true);
    setMessage('Logging you out...');
    setMessageType('info'); // Change message type from prompt to info/loading state

    try {
      localStorage.removeItem('token');
      // Optional: await axios.post(`${API_BASE_URL}/auth/logout`);

      setMessage('You have been successfully logged out!');
      setMessageType('success');
    } catch (error) {
      localStorage.removeItem('token'); // Ensure token is cleared even if backend call fails
      setMessage('Logout failed on server, but you are logged out from this device.');
      setMessageType('error');
      console.error('Logout error:', error);
    } finally {
      setIsLoading(false);
      // Redirect to login page after a short delay
      setTimeout(() => {
        navigate('/login');
      }, 2000); // Redirect after 2 seconds
    }
  };

  const handleCancel = () => {
    navigate(-1); // Go back to the previous page
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gray-100 dark:bg-gray-900 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-red-300 dark:bg-red-600 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
      <div className="absolute bottom-1/4 right-0 w-80 h-80 bg-orange-300 dark:bg-orange-600 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute top-1/2 left-1/4 w-72 h-72 bg-yellow-300 dark:bg-yellow-600 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>

      <div className="relative z-10 w-full max-w-sm bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8 md:p-10 animate-fade-in border border-red-200 dark:border-red-700 text-center">
        <div className="mb-6">
          <div className="p-4 inline-flex items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-800 dark:text-red-300 shadow-lg mb-4">
            <LogOutIcon size={36} />
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">Logout</h2>
          <p className="text-gray-600 dark:text-gray-400 text-md">
            {messageType === 'prompt' ? "Confirm your action." : "Securing your session."}
          </p>
        </div>

        {/* Dynamic Message Box based on state */}
        <div className={`mt-6 p-4 rounded-lg flex flex-col items-center gap-3 justify-center
          ${messageType === 'success'
            ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300 border border-green-200 dark:border-green-700'
            : messageType === 'error'
              ? 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300 border border-red-200 dark:border-red-700'
              : 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 border border-blue-200 dark:border-blue-700'
          }`}
          role="status"
        >
          {isLoading ? (
            <Loader2 className="animate-spin" size={24} />
          ) : messageType === 'success' ? (
            <CheckCircle size={24} />
          ) : messageType === 'error' ? (
            <XCircle size={24} />
          ) : ( // Default icon for 'prompt' or initial state
            <LogOutIcon size={24} />
          )}
          <p className="text-lg font-medium">{message}</p>
        </div>

        {/* Confirmation Buttons (only shown for 'prompt' state) */}
        {messageType === 'prompt' && (
          <div className="mt-8 flex gap-4 justify-center">
            <button
              onClick={handleLogout}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold text-white
                         bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800
                         transition-all duration-300 ease-in-out transform hover:scale-[1.005]"
            >
              <LogOutIcon size={20} /> Yes, Log Out
            </button>
            <button
              onClick={handleCancel}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold text-gray-800 dark:text-white
                         bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600
                         transition-all duration-300 ease-in-out transform hover:scale-[1.005]"
            >
              Cancel
            </button>
          </div>
        )}

        {/* Redirecting message (only shown after logout process initiated and successful) */}
        {!isLoading && messageType === 'success' && (
          <p className="mt-4 text-gray-600 dark:text-gray-400 text-sm">
            Redirecting to login...
          </p>
        )}

        {/* Manual login link (only appears after actual logout is complete or error) */}
        {!isLoading && (messageType === 'success' || messageType === 'error') && (
          <Link
            to="/login"
            className="mt-6 inline-flex items-center justify-center gap-1 text-blue-600 dark:text-blue-400 hover:underline transition-colors duration-200"
          >
            Click here to login manually
          </Link>
        )}
      </div>
    </div>
  );
};

export default Logout;