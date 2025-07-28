// src/layouts/GuestLayout.jsx
import React from 'react';
import GuestNavbar from '../components/GuestNavbar'; // Import your GuestNavbar

const GuestLayout = ({ children }) => {
  // Define navbar height if you need to push content below it
  const navbarHeightPx = 64; // Assuming GuestNavbar has a height of h-16 (16 * 4px = 64px)

  return (
    <div className="flex flex-col min-h-screen">
      {/* Guest Navbar - fixed at the top for public pages */}
      <GuestNavbar />

      {/* Main content area for guest pages */}
      {/* Use padding-top to ensure content starts below the fixed navbar */}
      <main
        className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200"
        style={{ paddingTop: `${navbarHeightPx}px` }} // Push content down by navbar height
      >
        <div className="p-4 sm:p-6 lg:p-8">
          {children} {/* This is where your public page content will be rendered */}
        </div>
      </main>

      {/* Optional: You can add a GuestFooter here if needed */}
      {/* <GuestFooter /> */}
    </div>
  );
};

export default GuestLayout;