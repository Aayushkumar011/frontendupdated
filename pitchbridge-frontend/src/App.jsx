// src/App.jsx - FINAL FINAL FINAL CORRECTED & VERIFIED for "SIDEBAR PUSHES NAV"
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

// Import your Navbar components
import GuestNavbar from './components/GuestNavbar';
import AuthNavbar from './components/AuthNavbar';
// REMOVED: import DashboardHomeNavbar from './components/DashboardHomeNavbar'; // This is removed for layout consistency
import Sidebar from './components/Sidebar';
import FullPageSpinner from './components/FullPageSpinner';

// Import all your page components
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Startups from './pages/Startups';
import StartupDetail from './pages/StartupDetail';
import SubmitPitch from './pages/SubmitPitch';
import Notifications from './pages/Notifications';
import RateStartup from './pages/RateStartup';
import CreateStartup from './pages/CreateStartup';
import AdminUsers from './pages/admin/Users';
import AdminActivity from './pages/admin/Activity';
import InvestorDeck from './pages/InvestorDeck';
import Messages from './pages/Messages';
import Profile from './pages/Profile';
import FAQ from './pages/FAQ'; // This FAQ page will now be authenticated
import Contact from './pages/Contact';
import Logout from './pages/Logout';
import DashboardInstructions from './pages/dashboard/DashboardInstructions';
import DashboardHome from './pages/dashboard/DashboardHome'; // This will now be part of AuthenticatedLayout
import FounderDashboard from './pages/dashboard/FounderDashboard';
import InvestorDashboard from './pages/dashboard/InvestorDashboard';
import ExploreInvestors from './pages/ExploreInvestors';
import AddStartup from './pages/AddStartup';
import Settings from './pages/Settings';
import ChangePassword from './pages/settings/ChangePassword';
import ChangeEmail from './pages/settings/ChangeEmail';
import ChangeUsername from './pages/settings/ChangeUsername';
import UpdateProfilePicture from './pages/settings/UpdateProfilePicture';
import NotificationSettings from './pages/settings/NotificationSettings';
import PrivacySettings from './pages/settings/PrivacySettings';
import DeleteAccount from './pages/settings/DeleteAccount';


// Constants for layout dimensions (adjust these as needed)
const SIDEBAR_WIDTH_DESKTOP = '64'; // w-64 = 16rem = 256px
const NAVBAR_HEIGHT = '16'; // h-16 = 4rem = 64px

/**
 * Layout for authenticated users, includes Sidebar and AuthNavbar.
 */
const AuthenticatedLayout = ({ toggleSidebar, isSidebarOpen, sidebarWidthDesktop, navbarHeight }) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    // Show a full page spinner while authentication status is being determined
    if (loading) {
        return <FullPageSpinner />;
    }

    // Redirect unauthenticated users to login page
    if (!user) {
        console.log(`AuthenticatedLayout: User not found, redirecting to /login from ${location.pathname}`);
        return <Navigate to="/login" state={{ from: location.pathname }} replace />;
    }

    return (
        <div className="flex min-h-screen bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white overflow-hidden">
            {/* Sidebar component - fixed on desktop, overlay on mobile */}
            <Sidebar
                isOpen={isSidebarOpen}
                toggleSidebar={toggleSidebar}
                sidebarWidthDesktop={sidebarWidthDesktop}
                navbarHeight={navbarHeight}
            />

            {/* Main content area, including AuthNavbar */}
            {/* This div handles the pushing of content away from the fixed sidebar on desktop */}
            <div
                className={`
                    flex-1 flex flex-col min-h-screen
                    transition-all duration-300
                    // Desktop: Margin-left creates space for the sidebar
                    md:ml-[16rem]
                    // Mobile: No margin-left, as sidebar is overlay (managed by Sidebar component itself)
                `}
            >
                {/* AuthNavbar - now a child of the main content area, so it's pushed by the sidebar */}
                <AuthNavbar
                    toggleSidebar={toggleSidebar}
                    navbarHeight={navbarHeight}
                />

                {/* Page content */}
                {/* The padding-top ensures content starts below the AuthNavbar */}
                <main className={`flex-1 p-6 overflow-y-auto pt-${navbarHeight}`}>
                    <Outlet /> {/* Renders the specific page component */}
                </main>
            </div>

            {/* Mobile-only overlay background when sidebar is open */}
            {isSidebarOpen && window.innerWidth < 768 && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
                    onClick={toggleSidebar}
                ></div>
            )}
        </div>
    );
};

/**
 * Layout for public (guest) users, includes GuestNavbar.
 */
const PublicLayout = () => {
    const { user } = useAuth();
    const location = useLocation();

    // Redirect authenticated users from typical public entry points (login, register, forgot-password) to dashboard
    if (user && (location.pathname === '/login' || location.pathname === '/register' || location.pathname === '/forgot-password')) {
        return <Navigate to="/dashboard" replace />;
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <GuestNavbar />
            {/* Use padding-top to ensure content starts below the fixed GuestNavbar */}
            <main className="pt-16">
                <Outlet /> {/* Renders the specific public page component */}
            </main>
        </div>
    );
};

/**
 * Main AppContent component to handle routing logic and layouts.
 */
const AppContent = () => {
    const { user, loading } = useAuth();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Default to true for desktop

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) { // Tailwind's 'md' breakpoint
                setIsSidebarOpen(true); // Ensure sidebar is always open on desktop
            } else {
                setIsSidebarOpen(false); // Default to closed on mobile
            }
        };

        window.addEventListener('resize', handleResize);
        handleResize(); // Set initial state
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const toggleSidebar = () => {
        // Only allow toggling on mobile. On desktop, it's always open by design.
        if (window.innerWidth < 768) {
            setIsSidebarOpen(!isSidebarOpen);
        }
    };

    if (loading) {
        return <FullPageSpinner />;
    }

    return (
        <Routes>
            {/* Public routes wrapped by PublicLayout */}
            {/* The root path "/" should also use PublicLayout if not logged in */}
            <Route element={<PublicLayout />}>
                <Route
                    path="/"
                    element={user ? <Navigate to="/dashboard" replace /> : <Home />}
                    
                />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                
                {/* REMOVED: <Route path="/faq" element={<FAQ />} />  FAQ is now under AuthenticatedLayout */}
                
              
            </Route>

            {/* Authenticated/Protected routes wrapped by AuthenticatedLayout */}
            <Route
                element={
                    <AuthenticatedLayout
                        toggleSidebar={toggleSidebar}
                        isSidebarOpen={isSidebarOpen}
                        sidebarWidthDesktop={SIDEBAR_WIDTH_DESKTOP}
                        navbarHeight={NAVBAR_HEIGHT}
                    />
                }
            >
                {/* Moved FAQ here, so it's now a protected route */}
                <Route path="/faq" element={<FAQ />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/logout" element={<Logout />} />
              
                <Route path="/investors" element={<ExploreInvestors />} /> {/* Public Explore Investors if any */}
                {/* <Route path="/startups" element={<ExploreStartups />} /> Public Explore Investors if any */}

                {/* Dashboards based on user role or general dashboard */}
                <Route path="/dashboard" element={<DashboardInstructions />} />
                <Route path="/dashboard-home" element={<DashboardHome />} /> {/* Consolidated Dashboard Home */}
                <Route path="/dashboard/founder" element={user?.role === 'founder' ? <FounderDashboard /> : <Navigate to="/dashboard" replace />} />
                <Route path="/dashboard/investor" element={user?.role === 'investor' ? <InvestorDashboard /> : <Navigate to="/dashboard" replace />} />

                {/* Main application features */}
                <Route path="/startups" element={<Startups />} />
                <Route path="/startups/:id" element={<StartupDetail />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/messages" element={<Messages />} />
                <Route path="/notifications" element={<Notifications />} />

                {/* Founder-specific routes */}
                <Route path="/submit-pitch" element={user?.role === 'founder' ? <SubmitPitch /> : <Navigate to="/dashboard" replace />} />
                <Route path="/create-startup" element={user?.role === 'founder' ? <CreateStartup /> : <Navigate to="/dashboard" replace />} />
                <Route path="/add-startup" element={user?.role === 'founder' ? <AddStartup /> : <Navigate to="/dashboard" replace />} />

                {/* Investor-specific routes */}
                <Route path="/investor-deck" element={user?.role === 'investor' ? <InvestorDeck /> : <Navigate to="/dashboard" replace />} />
                <Route path="/rate-startups" element={user?.role === 'investor' ? <RateStartup /> : <Navigate to="/dashboard" replace />} />

                {/* Settings routes */}
                <Route path="/settings" element={<Settings />} />
                <Route path="/settings/username" element={<ChangeUsername />} />
                <Route path="/settings/email" element={<ChangeEmail />} />
                <Route path="/settings/password" element={<ChangePassword />} />
                <Route path="/settings/profile-picture" element={<UpdateProfilePicture />} />
                <Route path="/settings/notifications" element={<NotificationSettings />} />
                <Route path="/settings/privacy" element={<PrivacySettings />} />
                <Route path="/settings/delete" element={<DeleteAccount />} />

                {/* Admin-specific routes */}
                <Route path="/admin/users" element={user?.role === 'admin' ? <AdminUsers /> : <Navigate to="/dashboard" replace />} />
                <Route path="/admin/activity" element={user?.role === 'admin' ? <AdminActivity /> : <Navigate to="/dashboard" replace />} />

                {/* Fallback for protected routes - ensures user is logged in before showing 404 */}
                <Route path="*" element={<div className="text-center text-xl font-bold mt-10">Protected Route: 404 Not Found or Unauthorized Access</div>} />
            </Route>

            {/* Catch-all for any other routes not matched by PublicLayout or AuthenticatedLayout */}
            <Route path="/home-dashboard" element={<DashboardHome />} />
            <Route path="*" element={<div className="text-center text-xl font-bold mt-10">404 Not Found</div>} />
        </Routes>
    );
};

/**
 * Root App component, providing AuthProvider and ThemeProvider context.
 */
const App = () => (
    <Router>
        <AuthProvider>
            <ThemeProvider>
                <AppContent />
            </ThemeProvider>
        </AuthProvider>
    </Router>
);

export default App;