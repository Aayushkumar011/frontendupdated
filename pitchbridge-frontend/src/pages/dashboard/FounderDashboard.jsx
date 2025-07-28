// import React from 'react';
// import DashboardLayout from '../layouts/DashboardLayout';

// const FounderDashboard = () => {
//   return (
//     <DashboardLayout>
//       <h2 className="text-3xl font-bold mb-4">Welcome to Your Dashboard</h2>
//       <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
//         What would you like to do today?
//       </p>
//       <ul className="list-disc list-inside space-y-2 text-gray-800 dark:text-gray-200">
//         <li>Upload or update your Pitch Deck</li>
//         <li>Explore potential Investors</li>
//         <li>Check your Messages and respond</li>
//         <li>Review and update your Profile</li>
//         <li>Adjust your Settings</li>
//       </ul>
//       <p className="mt-6 text-md text-blue-600 font-medium dark:text-blue-400">
//         Use the navigation menu on the left to begin. Let’s build something great together! 🚀
//       </p>
//     </DashboardLayout>
//   );
// };

// export default FounderDashboard;

import React from 'react';
import DashboardLayout from '../layouts/DashboardLayout';

const FounderDashboard = () => {
  return (
    <DashboardLayout>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold mb-4 text-blue-600 dark:text-blue-400">Welcome to Your Dashboard</h2>
        <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
          What would you like to do today?
        </p>
        <ul className="space-y-3 text-gray-800 dark:text-gray-200 list-disc list-inside">
          <li>📤 Upload or update your Pitch Deck</li>
          <li>🔍 Explore potential Investors</li>
          <li>💬 Check your Messages and respond</li>
          <li>👤 Review and update your Profile</li>
          <li>⚙️ Adjust your Settings</li>
        </ul>
        <p className="mt-6 text-md text-blue-600 font-medium dark:text-blue-400">
          Use the navigation menu on the left to begin. Let’s build something great together! 🚀
        </p>
      </div>
    </DashboardLayout>
  );
};

export default FounderDashboard;



