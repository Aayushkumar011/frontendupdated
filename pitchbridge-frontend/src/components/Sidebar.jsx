// src/components/Sidebar.jsx - COMPLETE CODE

import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Assuming AuthContext is correctly implemented
import {
    LogOut,
    Home as HomeIcon,
    LayoutDashboard,
    User,
    Settings,
    Info,
    Mail,
    Award,       // Startup icon
    DollarSign,  // Investors icon
    Rocket,      // Explore Startups icon (for Investors)
    Briefcase,   // My Investments icon (for Investors), or Investments (for Admin)
} from 'lucide-react'; // Ensure lucide-react is installed

/**
 * Sidebar Component
 * Renders a fixed sidebar with dynamic navigation links based on user role.
 * Handles mobile slide-in/out and integrates with AuthContext for user data and logout.
 *
 * @param {object} props - Component props
 * @param {boolean} props.isOpen - Controls the visibility of the sidebar on mobile.
 * @param {function} props.toggleSidebar - Function to toggle the mobile sidebar's open/close state.
 */
const Sidebar = ({ isOpen, toggleSidebar }) => {
    const { user } = useAuth(); // Destructure user, assuming it includes profileImageUrl
    const navigate = useNavigate();
    const location = useLocation();

    /**
     * Handles the logout button click.
     * Navigates to the /logout page, which will then handle the logout process.
     */
    const handleLogoutClick = () => {
        navigate('/logout');
        if (window.innerWidth < 768) toggleSidebar();
    };

    // Define navigation items for each specific user role.
    const founderNavItems = [
        { name: 'Home', icon: HomeIcon, path: '/home-dashboard' }, // Adjusted path for DashboardHome
        { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
        { name: 'Startup', icon: Award, path: '/startup-actions' },
        { name: 'Explore Investors', icon: DollarSign, path: '/investors' },
        { name: 'Profile', icon: User, path: '/profile' },
        { name: 'Settings', icon: Settings, path: '/settings' },
        { name: 'Help', icon: Info, path: '/faq' },
        { name: 'Contact Us', icon: Mail, path: '/contact' },
    ];

    const investorNavItems = [
        { name: 'Home', icon: HomeIcon, path: '/home-dashboard' }, // Adjusted path for DashboardHome
        { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
        { name: 'My Investments', icon: Briefcase, path: '/my-investments' },
        { name: 'Explore Startups', icon: Rocket, path: '/startups' },
        { name: 'Profile', icon: User, path: '/profile' },
        { name: 'Settings', icon: Settings, path: '/settings' },
        { name: 'Help', icon: Info, path: '/faq' },
        { name: 'Contact Us', icon: Mail, path: '/contact' },
    ];

    const adminNavItems = [
        { name: 'Home', icon: HomeIcon, path: '/home-dashboard' }, // Adjusted path for DashboardHome
        { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
        { name: 'Startups', icon: Award, path: '/admin/startups' },
        { name: 'Investments', icon: Briefcase, path: '/admin/investments' },
        { name: 'Explore Startups', icon: Rocket, path: '/startups' },
        { name: 'Explore Investors', icon: DollarSign, path: '/investors' },
        { name: 'Profile', icon: User, path: '/profile' },
        { name: 'Settings', icon: Settings, path: '/settings' },
        { name: 'Help', icon: Info, path: '/faq' },
        { name: 'Contact Us', icon: Mail, path: '/contact' },
    ];

    let currentNavItems = [];
    if (user) {
        switch (user.role) {
            case 'founder':
                currentNavItems = founderNavItems;
                break;
            case 'investor':
                currentNavItems = investorNavItems;
                break;
            case 'admin':
                currentNavItems = adminNavItems;
                break;
            default:
                currentNavItems = [];
        }
    }

    // Handles redirection to the profile page when user info area is clicked
    const handleUserInfoClick = () => {
        navigate('/profile');
        if (window.innerWidth < 768) toggleSidebar();
    };

    return (
        <>
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/30 z-30 md:hidden"
                    onClick={toggleSidebar}
                />
            )}

            <aside
                className={`
                    fixed inset-y-0 left-0
                    z-40
                    text-white
                    flex flex-col
                    transition-transform duration-300 ease-in-out
                    w-64
                    h-screen
                    bg-purple-800 dark:bg-gray-800 shadow-lg
                    ${isOpen ? 'translate-x-0' : '-translate-x-full'}
                    md:translate-x-0
                `}
                style={{
                    background: 'linear-gradient(180deg, #4F46E5 0%, #6366F1 100%)',
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
                }}
            >
                {/* Top Branding Section: "PitchBridge" text and logo */}
                <div className="flex items-center justify-center h-16 mt-2 mb-6">
                    <Link
                        to="/home-dashboard" // Redirects PitchBridge logo to DashboardHome
                        className="text-3xl font-extrabold text-white tracking-wide hover:scale-105 transition-transform duration-200"
                        onClick={() => { if (window.innerWidth < 768) toggleSidebar(); }}
                    >
                        PitchBridge
                    </Link>
                </div>

                {/* User Info Section: Displays user's name/email and role */}
                {user && (
                    <div
                        className="mb-6 mx-4 p-4 rounded-2xl bg-white/15 backdrop-blur-sm border border-white/20 shadow-lg cursor-pointer hover:bg-white/20 transition-colors duration-200"
                        onClick={handleUserInfoClick} // Redirects to profile page
                        role="button"
                        tabIndex="0"
                        aria-label={`View profile for ${user.name || user.email}`}
                    >
                        <div className="flex flex-col items-center text-center">
                            <div className="relative mb-3">
                                {/* Conditional rendering for profile image or placeholder */}
                                {user.profileImageUrl ? (
                                    <img
                                        src={user.profileImageUrl}
                                        alt="User Profile"
                                        className="w-14 h-14 rounded-full object-cover border-2 border-white/40 shadow-md"
                                    />
                                ) : (
                                    <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center border-2 border-white/40 shadow-md">
                                        <User size={24} className="text-white" /> {/* User icon as a placeholder avatar */}
                                    </div>
                                )}
                            </div>
                            <p className="text-lg font-semibold text-white/95 mb-1 truncate max-w-full">
                                {user.name || user.email}
                            </p>
                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/20 text-white/90 border border-white/30 capitalize">
                                {user.role}
                            </span>
                        </div>
                    </div>
                )}

                {/* Navigation Links Section */}
                <nav
                    className="flex-1 px-4 overflow-y-auto"
                    style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.3) transparent' }}
                >
                    <div className="space-y-1">
                        {currentNavItems.map((item) => {
                            const isActive = location.pathname === item.path;

                            return (
                                <Link
                                    key={item.name}
                                    to={item.path}
                                    onClick={() => { if (window.innerWidth < 768) toggleSidebar(); }}
                                    className={`
                                        flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 text-base font-medium group
                                        ${isActive
                                            ? 'bg-white/25 text-white shadow-lg border border-white/30'
                                            : 'text-white/90 hover:text-white hover:bg-white/15 hover:shadow-md'
                                        }
                                    `}
                                >
                                    <div className={`
                                        flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200
                                        ${isActive ? 'bg-white/20' : 'group-hover:bg-white/10'}
                                    `}>
                                        <item.icon size={18} className="flex-shrink-0" />
                                    </div>
                                    <span>{item.name}</span>
                                </Link>
                            );
                        })}
                    </div>
                </nav>

                {/* Logout Button Section */}
                {/* Logout Button Section */}
                <div className="p-4">
                    <button
                        onClick={handleLogoutClick} // Use the new handler
                        className="
                            w-full flex items-center gap-4 px-4 py-3 rounded-xl
                            text-red-100 hover:text-white
                            bg-red-600/20 hover:bg-red-600/30
                            border border-red-400/30 hover:border-red-400/50
                            transition-all duration-200 text-base font-medium
                            shadow-md hover:shadow-lg
                        "
                    >
                        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-red-500/20">
                            <LogOut size={18} className="flex-shrink-0" />
                        </div>
                        <span>Logout</span>
                    </button>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;