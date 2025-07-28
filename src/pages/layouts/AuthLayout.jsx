// src/pages/layouts/AuthLayout.jsx - UPDATED FOR NAVBAR/SIDEBAR LAYOUT

import React, { useState, useEffect } from 'react';
import AuthNavbar from '../../components/AuthNavbar';
import Sidebar from '../../components/Sidebar';
import { Outlet } from 'react-router-dom';

const AuthLayout = () => {
    // Determine initial sidebar state based on screen width
    const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 768);

    // Define the navbar height and corresponding padding
    const NAVBAR_HEIGHT_CLASS = 'h-16'; // e.g., 'h-16' for 64px
    const NAVBAR_HEIGHT_PT = 'pt-16';   // e.g., 'pt-16' for 64px

    // Define sidebar width for desktop (md screen size and above)
    const SIDEBAR_WIDTH_MD_CLASS = 'md:w-64'; // e.g., 'w-64' for 256px
    const SIDEBAR_MARGIN_MD_CLASS = 'md:ml-64'; // e.g., 'ml-64' for 256px
    const SIDEBAR_WIDTH_MD_CLOSED_CLASS = 'md:w-20'; // e.g., 'w-20' for 80px when collapsed
    const SIDEBAR_MARGIN_MD_CLOSED_CLASS = 'md:ml-20'; // e.g., 'ml-20' for 80px when collapsed


    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) {
                // On desktop, sidebar is always open (or collapsed to minimal width)
                // You might have a separate state for collapsed vs full open on desktop
                // For simplicity, we'll assume it's "open" to its full desktop width here.
                setIsSidebarOpen(true);
            } else {
                // On mobile, sidebar starts closed
                setIsSidebarOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        handleResize(); // Call once on mount to set initial state
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const toggleSidebar = () => {
        // Only allow toggling on smaller screens where it's an overlay
        if (window.innerWidth < 768) {
            setIsSidebarOpen(!isSidebarOpen);
        }
        // On desktop, if you have a collapse/expand feature, it would be handled differently
        // e.g., setIsSidebarCollapsed(!isSidebarCollapsed);
    };

    return (
        // Root container for the entire authenticated layout
        // `relative` is important for `z-index` to work correctly with `fixed` children if needed
        // `overflow-hidden` is good for preventing scrollbars from desktop sidebar transition
        <div className="flex min-h-screen bg-theme-bg text-theme-text transition-colors duration-300 relative overflow-hidden">

            {/* AuthNavbar: Fixed at the top, spans full width, higher z-index than content but lower than overlay sidebar */}
            {/* The AuthNavbar component itself must have `fixed top-0 left-0 w-full z-50` */}
            <AuthNavbar toggleSidebar={toggleSidebar} navbarHeight={NAVBAR_HEIGHT_CLASS.replace('h-', '')} />

            {/* Sidebar: Its positioning needs careful handling */}
            {/* On mobile (<md), it will be an overlay with a higher z-index than the navbar */}
            {/* On desktop (>=md), it will be a fixed-width sidebar, pushing content */}
            <Sidebar
                isOpen={isSidebarOpen}
                toggleSidebar={toggleSidebar}
                // Pass constants to Sidebar for consistent styling
                sidebarWidthMd={SIDEBAR_WIDTH_MD_CLASS.replace('md:w-', '')} // e.g., '64'
                sidebarWidthMdClosed={SIDEBAR_WIDTH_MD_CLOSED_CLASS.replace('md:w-', '')} // e.g., '20'
            />

            {/* Main Content Area */}
            <div
                className={`
                    flex-1 flex flex-col // Flex column to stack navbar and content within this area
                    transition-all duration-300 // Smooth transition for sidebar open/close
                    ${isSidebarOpen ? SIDEBAR_MARGIN_MD_CLASS : SIDEBAR_MARGIN_MD_CLOSED_CLASS} // Desktop margin-left
                    ${NAVBAR_HEIGHT_PT} // Padding-top to account for the fixed navbar
                    overflow-y-auto // Allows content to scroll within this main area
                    z-10 // Ensures content is above the background blobs but below fixed navbar/sidebar
                    h-screen // Make this div take full screen height, crucial for scroll positioning
                    relative // Required for inner absolute positioning if any, like your content
                `}
            >
                {/*
                    The `AuthNavbar` is now 'fixed' and sits on top of everything.
                    The `Sidebar` is also 'fixed' and sits on the left.

                    The `main` content needs to start below the navbar AND to the right of the sidebar.
                    We achieved 'below the navbar' with `pt-16` on this div.
                    We achieved 'right of the sidebar' with `md:ml-64` (or `md:ml-20`) on this div.
                */}
                <main className="flex-1 p-6 relative z-0"> {/* flex-1 ensures it takes remaining height */}
                    <Outlet /> {/* Renders the actual page content */}
                </main>
            </div>
        </div>
    );
};

export default AuthLayout;