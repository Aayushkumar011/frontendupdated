import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
  LogOut,
  Home as HomeIcon,
  LayoutDashboard,
  User,
  Settings,
  Info,
  Mail,
  Award,
  DollarSign,
  Rocket,
  Briefcase
} from 'lucide-react';

const Sidebar = ({ isOpen, toggleSidebar, sidebarWidthMd = '64' }) => {
  const { user, logout } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const NAVBAR_HEIGHT_PX = 64;

  const handleLogoutClick = () => {
    logout();
    navigate('/login');
    if (window.innerWidth < 768) toggleSidebar();
  };

  const founderNavItems = [
    { name: 'Home', icon: HomeIcon, path: '/home-dashboard' },
    { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { name: 'My Startup', icon: Award, path: '/submit-pitch' },
    { name: 'Explore Investors', icon: DollarSign, path: '/investors' },
    { name: 'Profile', icon: User, path: '/profile' },
    { name: 'Settings', icon: Settings, path: '/settings' },
    { name: 'Help', icon: Info, path: '/faq' },
    { name: 'Contact Us', icon: Mail, path: '/contact' },
  ];

  const investorNavItems = [
    { name: 'Home', icon: HomeIcon, path: '/home-dashboard' },
    { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { name: 'My Investments', icon: Briefcase, path: '/my-investments' },
    { name: 'Explore Startups', icon: Rocket, path: '/startups' },
    { name: 'Profile', icon: User, path: '/profile' },
    { name: 'Settings', icon: Settings, path: '/settings' },
    { name: 'Help', icon: Info, path: '/faq' },
    { name: 'Contact Us', icon: Mail, path: '/contact' },
  ];

  const adminNavItems = [
    { name: 'Home', icon: HomeIcon, path: '/home-dashboard' },
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
    if (user.role === 'founder') currentNavItems = founderNavItems;
    else if (user.role === 'investor') currentNavItems = investorNavItems;
    else if (user.role === 'admin') currentNavItems = adminNavItems;
  }

  const handleUserInfoClick = () => {
    navigate('/profile');
    if (window.innerWidth < 768) toggleSidebar();
  };

  return (
    <>
      {isOpen && window.innerWidth < 768 && (
        <div className="fixed inset-0 bg-black/30 z-[998] md:hidden" onClick={toggleSidebar} />
      )}

      <aside
  className={`
    fixed top-0 left-0 z-[999] flex flex-col
    transition-transform duration-300 ease-in-out
    ${isOpen ? 'translate-x-0' : '-translate-x-full'}
    md:translate-x-0
    w-${sidebarWidthMd}
    md:w-${sidebarWidthMd}
    shadow-lg
    ${theme === 'light'
      ? 'bg-gradient-to-b from-[var(--gradient-sidebar-start-light)] to-[var(--gradient-sidebar-end-light)]'
      : 'bg-gradient-to-b from-[var(--gradient-sidebar-start-dark)] to-[var(--gradient-sidebar-end-dark)]'
    }
  `}
  style={{ height: '100vh' }}
>
  {/* Top fixed: Logo + user info */}
  <div className="shrink-0 px-4 pt-8">
    <div className="flex items-center justify-center pb-6">
      <Link
        to="/home-dashboard"
        className="text-white text-3xl font-extrabold tracking-wide hover:scale-105 transition-transform duration-200"
        onClick={() => { if (window.innerWidth < 768) toggleSidebar(); }}
      >
        PitchBridge
      </Link>
    </div>

    {user && (
      <div
        className={`mb-4 p-4 rounded-2xl shadow-lg cursor-pointer border ${
          theme === 'light'
            ? 'bg-white/20 border-white/30'
            : 'bg-white/10 border-white/15'
        }`}
        onClick={handleUserInfoClick}
      >
        <div className="flex flex-col items-center text-center">
          <div className="relative mb-3">
            {user.profilePic ? (
              <img
                src={user.profilePic}
                alt="User Profile"
                className="w-14 h-14 rounded-full object-cover border-2 border-white/40 shadow-md"
              />
            ) : (
              <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center border-2 border-white/40 shadow-md">
                <User size={24} className="text-white" />
              </div>
            )}
          </div>
          <p className="text-lg font-semibold mb-1 truncate max-w-full text-white">
            {user.name || user.email}
          </p>
          <span className="px-3 py-1 rounded-full text-xs font-medium capitalize bg-white/10 border border-white/20 text-white">
            {user.role}
          </span>
        </div>
      </div>
    )}
  </div>

  {/* Scrollable nav section */}
  <div className="flex-1 overflow-y-auto px-4 pb-4 mt-2">
    <nav>
      <div className="space-y-1">
        {currentNavItems.map(item => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.name}
              to={item.path}
              onClick={() => { if (window.innerWidth < 768) toggleSidebar(); }}
              className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 text-base font-medium group
                ${isActive
                  ? 'bg-white/20 text-white shadow-lg border border-white/30'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
            >
              <div className={`flex items-center justify-center w-8 h-8 rounded-lg ${isActive ? 'bg-white/20' : 'group-hover:bg-white/10'}`}>
                <item.icon size={18} className="text-white" />
              </div>
              <span>{item.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  </div>

  {/* Bottom fixed logout */}
  {user && (
    <div className="shrink-0 px-4 py-4">
      <button
        onClick={handleLogoutClick}
        className="w-full flex items-center gap-4 px-4 py-3 rounded-xl shadow-md hover:shadow-lg text-white bg-white/20 hover:bg-white/30 border border-white/30"
      >
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/20">
          <LogOut size={18} className="text-white" />
        </div>
        <span>Logout</span>
      </button>
    </div>
  )}
</aside>

    </>
  );
};

export default Sidebar;

