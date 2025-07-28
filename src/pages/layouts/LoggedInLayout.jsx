// src/layouts/LoggedInLayout.jsx - COMPLETE CODE

import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import AuthNavbar from '../components/AuthNavbar';

/**
 * LoggedInLayout Component
 * This component provides the overall layout structure for authenticated users.
 * It includes a fixed sidebar, a fixed top navigation bar, and a main content area.
 * It manages the responsiveness of the sidebar for mobile views.
 *
 * @param {object} props - Component props
 * @param {React.ReactNode} props.children - The content to be rendered within the main layout area.
 */
const LoggedInLayout = ({ children }) => {
  // Define consistent dimensions in pixels for calculations.
  // These values should match the fixed widths/heights set in Sidebar.jsx and AuthNavbar.jsx.
  const sidebarWidthPx = 256; // Corresponds to Tailwind's w-64 (64 * 4px/rem)
  const navbarHeightPx = 80;  // Corresponds to Tailwind's h-20 (20 * 4px/rem)

  // State to control the visibility of the mobile sidebar.
  // It is 'false' by default, meaning the mobile sidebar is hidden.
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  /**
   * Toggles the state of the mobile sidebar (open/closed).
   */
  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  /**
   * Effect hook to handle window resizing.
   * If the screen resizes to desktop size (md breakpoint and up) while the mobile sidebar is open,
   * it automatically closes the mobile sidebar for a seamless transition.
   */
  useEffect(() => {
    const handleResize = () => {
      // Check if window width is greater than or equal to the 'md' breakpoint (768px)
      // AND if the mobile sidebar is currently open.
      if (window.innerWidth >= 768 && isMobileSidebarOpen) {
        setIsMobileSidebarOpen(false); // Close the mobile sidebar
      }
    };

    // Add event listener for window resize
    window.addEventListener('resize', handleResize);

    // Cleanup function: remove the event listener when the component unmounts
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobileSidebarOpen]); // Dependency array: run effect when isMobileSidebarOpen changes

  return (
    // Outer container for the entire page layout.
    // Uses flexbox to arrange the Sidebar and the Main content area side-by-side.
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900"> {/* Added a default background */}
      {/* Sidebar Component */}
      {/* It receives 'isOpen' and 'toggleSidebar' props for mobile responsiveness. */}
      {/* The Sidebar component itself manages its own width styling (w-64) and fixed positioning. */}
      <Sidebar
        isOpen={isMobileSidebarOpen}
        toggleSidebar={toggleMobileSidebar}
      />

      {/* Main content area. */}
      {/* This div takes the remaining width ('flex-1') and is arranged as a column. */}
      {/* 'relative' and 'overflow-hidden' are important for containing absolute children and managing overflows. */}
      <div
        className="flex-1 flex flex-col relative overflow-hidden"
        // On desktop, this style pushes the entire main content area to the right.
        // This creates space for the fixed sidebar and ensures content starts next to it.
        // It's applied universally, but the AuthNavbar within it handles its own mobile positioning.
        style={{ marginLeft: `${sidebarWidthPx}px` }}
      >
        {/* Authentication Navbar Component */}
        {/* It receives props for mobile sidebar toggling, the sidebar's pixel width,
            and the current state of the mobile sidebar to adjust its own positioning. */}
        <AuthNavbar
          toggleSidebar={toggleMobileSidebar}
          sidebarWidthPx={sidebarWidthPx} // Passed for Navbar's internal width calculations
          isSidebarOpen={isMobileSidebarOpen} // Passed for Navbar's mobile positioning logic
        />

        {/* Background Gradient & Animated Shapes for the main content area. */}
        {/* This div is absolutely positioned to fill its parent ('flex-1 flex flex-col'). */}
        {/* 'paddingTop' ensures the gradient effect starts below the fixed Navbar. */}
        <div
          className="absolute inset-0 z-0 bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 dark:from-gray-950 dark:via-purple-950 dark:to-blue-950 opacity-60"
          style={{ paddingTop: `${navbarHeightPx}px` }} // Starts the gradient below the fixed navbar
        >
          {/* Animated "blob" shapes for visual flair */}
          <div className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-blue-300 dark:bg-blue-800 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
          <div className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-pink-300 dark:bg-purple-800 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/3 h-1/3 bg-purple-300 dark:bg-pink-800 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
        </div>

        {/* Main content area for specific page components (e.g., Dashboard, Profile). */}
        {/* 'relative z-10' ensures it is above the background gradient. */}
        {/* 'flex-grow overflow-y-auto' allows the content to scroll independently if it overflows vertically. */}
        {/* 'paddingTop' ensures the actual page content starts below the fixed navbar, preventing overlap. */}
        <main
          className="relative z-10 flex-grow overflow-y-auto bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200"
          style={{ paddingTop: `${navbarHeightPx}px` }} // Use pixel value for consistent top padding
        >
          {/* Inner div to apply consistent page-level padding to the children. */}
          <div className="p-4 sm:p-6 lg:p-8">
            {children} {/* Renders the actual page content passed as children prop */}
          </div>
        </main>
      </div>
    </div>
  );
};

export default LoggedInLayout;