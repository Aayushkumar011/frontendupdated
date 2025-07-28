import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../config';
import { Trash2, Loader2, CheckCircle, XCircle, ChevronLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const DeleteAccount = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState(null);
    const [messageType, setMessageType] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        const style = document.createElement('style');
        style.id = 'delete-account-animations';
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

        if (!document.getElementById('delete-account-animations')) {
            document.head.appendChild(style);
        }

        return () => {
            const existingStyle = document.getElementById('delete-account-animations');
            if (existingStyle) {
                document.head.removeChild(existingStyle);
            }
        };
    }, []);

    const validateForm = () => {
        const newErrors = {};
        if (!password) {
            newErrors.password = 'Password is required.';
        }
        if (!confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password.';
        } else if (password !== confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match.';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(null);
        setMessageType('');
        setErrors({});

        if (!validateForm()) {
            return;
        }

        setIsLoading(true);
        const token = localStorage.getItem('token');

        try {
            const res = await axios.delete(
                `${API_BASE_URL}/settings/delete-account`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    data: { password } // Send password in request body for DELETE
                }
            );
            setMessage(res.data.message || 'Account deleted successfully. Redirecting...');
            setMessageType('success');
            localStorage.removeItem('token'); // Clear token on successful deletion
            localStorage.removeItem('user');  // Clear user data
            setTimeout(() => navigate('/login'), 3000); // Redirect to login after 3 seconds
        } catch (err) {
            const errorMsg = err.response?.data?.message || 'Error deleting account. Please try again.';
            setMessage(errorMsg);
            setMessageType('error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-gray-100 dark:bg-gray-900 relative overflow-hidden">
            {/* Background blobs updated to match ChangeUsername.jsx */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-yellow-300 dark:bg-yellow-600 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
            <div className="absolute bottom-1/4 right-0 w-80 h-80 bg-orange-300 dark:bg-orange-600 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
            <div className="absolute top-1/2 left-1/4 w-72 h-72 bg-lime-300 dark:bg-lime-600 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>

            <div className="relative z-10 w-full max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8 md:p-10 animate-fade-in border border-gray-200 dark:border-gray-700">
                <div className="text-center mb-8">
                    <div className="p-4 inline-flex items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-800 dark:text-red-300 shadow-lg mb-4">
                        <Trash2 size={36} />
                    </div>
                    <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">Delete Account</h2>
                    <p className="text-gray-600 dark:text-gray-400 text-md">
                        This action is irreversible. Please confirm to proceed.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Enter Password to Confirm
                        </label>
                        <input
                            id="password"
                            type="password"
                            placeholder="Your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent
                                         bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white
                                         ${errors.password ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}
                                        `}
                            aria-invalid={errors.password ? "true" : "false"}
                            aria-describedby={errors.password ? "password-error" : undefined}
                            disabled={isLoading}
                        />
                        {errors.password && (
                            <p id="password-error" className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.password}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Confirm Password
                        </label>
                        <input
                            id="confirm-password"
                            type="password"
                            placeholder="Confirm your password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent
                                         bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white
                                         ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}
                                        `}
                            aria-invalid={errors.confirmPassword ? "true" : "false"}
                            aria-describedby={errors.confirmPassword ? "confirm-password-error" : undefined}
                            disabled={isLoading}
                        />
                        {errors.confirmPassword && (
                            <p id="confirm-password-error" className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.confirmPassword}</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold text-white
                                    transition-all duration-300 ease-in-out
                                    ${isLoading
                                        ? 'bg-red-400 dark:bg-red-600 cursor-not-allowed'
                                        : 'bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800'
                                    }
                                    transform hover:scale-[1.005]
                                    `}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="animate-spin" size={20} /> Deleting...
                            </>
                        ) : (
                            <>
                                Delete My Account <Trash2 size={18} />
                            </>
                        )}
                    </button>
                </form>

                {message && (
                    <p className={`mt-6 p-4 rounded-lg flex items-center gap-3 justify-center
                        ${messageType === 'success'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300 border border-green-200 dark:border-green-700'
                            : 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300 border border-red-200 dark:border-red-700'
                        }`}
                        role="alert"
                    >
                        {messageType === 'success' ? <CheckCircle size={20} /> : <XCircle size={20} />}
                        <span className="text-sm font-medium">{message}</span>
                    </p>
                )}

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

export default DeleteAccount;