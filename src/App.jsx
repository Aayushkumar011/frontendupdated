import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

// Import your Navbar components
import GuestNavbar from './components/GuestNavbar';
import FullPageSpinner from './components/FullPageSpinner';
// Import the AuthLayout from its actual location
import AuthLayout from './pages/layouts/AuthLayout';
// Import the new ScrollToTop component
import ScrollToTop from './components/ScrollToTop'; // <--- NEW IMPORT

// Import all your page components
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ExploreOpportunities from './pages/ExploreOpportunities';
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
import FAQ from './pages/FAQ';
import Contact from './pages/Contact';
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
import ManageTeamPage from './pages/ManageTeamPage.jsx';
import FounderDashboard from './components/FounderDashboard.jsx';

// Dashboard components
import DashboardInstructions from './pages/dashboard/DashboardInstructions';
import DashboardHome from './pages/dashboard/DashboardHome';

/**
 * This component acts purely as a "Protected Route Wrapper" that checks authentication status.
 * It will then render AuthLayout, which provides the actual visual layout (with sidebar).
 */
const AuthenticatedRouteWrapper = () => {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return <FullPageSpinner />;
    }

    if (!user) {
        console.log(`AuthenticatedRouteWrapper: User not found, redirecting to /login from ${location.pathname}`);
        return <Navigate to="/login" state={{ from: location.pathname }} replace />;
    }

    console.log('--- App.jsx Debugging User Role in AuthenticatedRouteWrapper ---');
    console.log('Current user object:', user);
    console.log('User role from AuthContext:', user?.role);
    console.log('Current Path (in AuthenticatedRouteWrapper):', location.pathname);
    console.log('--- End App.jsx Debugging ---');

    return (
        <AuthLayout>
            <Outlet /> {/* Renders the specific page component for the matched nested route */}
        </AuthLayout>
    );
};

/**
 * Layout for public (guest) users, includes GuestNavbar.
 * Handles initial redirection for authenticated users.
 */
const PublicLayout = () => {
    const { user } = useAuth();
    const location = useLocation();

    // REDIRECTION LOGIC FOR AUTHENTICATED USERS AWAY FROM PUBLIC ROUTES
    if (user && (location.pathname === '/login' || location.pathname === '/register' || location.pathname === '/forgot-password' || location.pathname === '/explore' || location.pathname === '/')) {
        console.log(`PublicLayout: User authenticated, redirecting from ${location.pathname} to dashboard based on role`);
        if (user.role === 'founder') {
            return <Navigate to="/founder-dashboard" replace />;
        }
        return <Navigate to="/dashboard" replace />;
    }

    return (
        <div className="min-h-screen">
            {/* NOTE: You will also need to make GuestNavbar fixed and add padding-top to this main. */}
            {/* Ensure GuestNavbar.jsx also has 'fixed top-0 left-0 w-full z-50' */}
            <GuestNavbar />
            <main className="pt-16"> {/* Assuming GuestNavbar is also h-16, adjust as needed */}
                <Outlet />
            </main>
        </div>
    );
};

/**
 * Main AppContent component to handle routing logic and layouts.
 */
const AppContent = () => {
    const { user, loading } = useAuth();

    const [teamMembers, setTeamMembers] = useState([
        { id: 1, name: 'Alice Johnson', role: 'CEO', email: 'alice@example.com', avatar: 'https://randomuser.me/api/portraits/women/7.jpg' },
        { id: 2, name: 'Bob Williams', role: 'CTO', email: 'bob@example.com', avatar: 'https://randomuser.me/api/portraits/men/8.jpg' },
        { id: 3, name: 'Charlie Davis', role: 'CFO', email: 'charlie@example.com', avatar: 'https://randomuser.me/api/portraits/men/9.jpg' },
        { id: 4, name: 'Diana Prince', role: 'CMO', email: 'diana@example.com', avatar: 'https://randomuser.me/api/portraits/women/10.jpg' },
    ]);

    const handleAddOrEditMember = (newMemberData, memberIdToUpdate = null) => {
        if (memberIdToUpdate) {
            setTeamMembers(teamMembers.map(member =>
                member.id === memberIdToUpdate ? { ...member, ...newMemberData } : member
            ));
        } else {
            const newId = teamMembers.length > 0 ? Math.max(...teamMembers.map(m => m.id)) + 1 : 1;
            setTeamMembers([...teamMembers, { id: newId, ...newMemberData }]);
        }
    };

    const handleDeleteMember = (id) => {
        setTeamMembers(teamMembers.filter(member => member.id !== id));
    };

    if (loading) {
        return <FullPageSpinner />;
    }

    return (
        <Routes>
            {/* Public routes wrapped by PublicLayout */}
            <Route element={<PublicLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/explore" element={<ExploreOpportunities />} />
            </Route>

            {/* DashboardHome - This is the special full-screen route for ALL authenticated users */}
            <Route
                path="/home-dashboard"
                element={user ? <DashboardHome /> : <Navigate to="/login" replace />}
            />

            {/* Authenticated/Protected routes wrapped by the AuthenticatedRouteWrapper (these will have sidebar) */}
            <Route element={<AuthenticatedRouteWrapper />}>
                {/* Default dashboard for investor/admin, or a general dashboard with sidebar */}
                <Route path="/dashboard" element={<DashboardInstructions />} />

                {/* Founder-specific dashboard with sidebar */}
                <Route path="/founder-dashboard" element={user?.role === 'founder' ? <FounderDashboard teamMembers={teamMembers} /> : <Navigate to="/dashboard" replace />} />

                {/* Main application features */}
                <Route
                    path="/manage-team"
                    element={user?.role === 'founder' ?
                        <ManageTeamPage
                            teamMembers={teamMembers}
                            onAddOrEditMember={handleAddOrEditMember}
                            onDeleteMember={handleDeleteMember}
                        /> : <Navigate to="/dashboard" replace />}
                />
                <Route path="/startups" element={<Startups />} />
                <Route path="/startups/:id" element={<StartupDetail />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/messages/:userId?" element={<Messages />} />
                <Route path="/notifications" element={<Notifications />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/investors" element={<ExploreInvestors />} />

                {/* Founder-specific routes - ensure these are accessible only by 'founder' role */}
                <Route path="/submit-pitch" element={user?.role === 'founder' ? <SubmitPitch /> : <Navigate to="/dashboard" replace />} />
                <Route path="/create-startup" element={user?.role === 'founder' ? <CreateStartup /> : <Navigate to="/dashboard" replace />} />
                <Route path="/add-startup" element={user?.role === 'founder' ? <AddStartup /> : <Navigate to="/dashboard" replace />} />

                {/* Investor-specific routes - ensure these are accessible only by 'investor' role */}
                <Route path="/investor-deck" element={user?.role === 'investor' ? <InvestorDeck /> : <Navigate to="/dashboard" replace />} />
                <Route path="/rate-startups" element={user?.role === 'investor' ? <RateStartup /> : <Navigate to="/dashboard" replace />} />
                <Route path="/my-investments" element={user?.role === 'investor' ? <InvestorDeck /> : <Navigate to="/dashboard" replace />} />

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
                <Route path="/admin/startups" element={user?.role === 'admin' ? <SubmitPitch /> : <Navigate to="/dashboard" replace />} />
                <Route path="/admin/investments" element={user?.role === 'admin' ? <InvestorDeck /> : <Navigate to="/dashboard" replace />} />

                {/* Fallback for protected routes */}
                <Route path="*" element={<div className="text-center text-xl font-bold mt-10 text-theme-heading-primary">Protected Route: 404 Not Found or Unauthorized Access</div>} />
            </Route>

            {/* Catch-all for any other routes not matched */}
            <Route path="*" element={<div className="text-center text-xl font-bold mt-10 text-theme-heading-primary">404 Not Found</div>} />
        </Routes>
    );
};

/**
 * Root App component, providing AuthProvider and ThemeProvider context.
 */
const App = () => (
    <Router>
        {/* Place ScrollToTop directly inside Router */}
        <ScrollToTop /> {/* <--- NEW COMPONENT USAGE */}
        <AuthProvider>
            <ThemeProvider>
                <div className="relative min-h-screen flex flex-col overflow-hidden bg-theme-bg">
                    {/* Background Gradient & Animated Shapes - Now CENTRALIZED */}
                    <div className="absolute inset-0 bg-theme-gradient-start z-0">
                        <div className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-theme-blob-1 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
                        <div className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-theme-blob-2 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/3 h-1/3 bg-theme-blob-3 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
                    </div>

                    {/* Content Wrapper - ensures pages are on top of blobs */}
                    <div className="relative z-10 flex-grow flex flex-col">
                        <AppContent />
                    </div>
                </div>
            </ThemeProvider>
        </AuthProvider>
    </Router>
);

export default App;