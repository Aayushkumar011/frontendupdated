// import React from 'react';
// import DashboardLayout from '../layouts/DashboardLayout';

// const InvestorDashboard = () => {
//   return (
//     <DashboardLayout>
//       <h2 className="text-3xl font-bold mb-4">Welcome to Your Dashboard</h2>
//       <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
//         What would you like to do today?
//       </p>
//       <ul className="list-disc list-inside space-y-2 text-gray-800 dark:text-gray-200">
//         <li>Upload or update your Pitch Deck</li>
//         <li>Explore potential Startups</li>
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

// export default InvestorDashboard;

import React from 'react';
import DashboardLayout from '../layouts/DashboardLayout';

const InvestorDashboard = () => {
  return (
    <DashboardLayout>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold mb-4 text-blue-600 dark:text-blue-400">Welcome to Your Dashboard</h2>
        <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
          What would you like to do today?
        </p>
        <ul className="space-y-3 text-gray-800 dark:text-gray-200 list-disc list-inside">
          <li>📤 Upload or update your Investor Deck</li>
          <li>🔍 Explore high-potential Startups</li>
          <li>💬 Check your Messages and respond</li>
          <li>👤 Review and update your Profile</li>
          <li>⚙️ Adjust your Settings</li>
        </ul>
        <p className="mt-6 text-md text-blue-600 font-medium dark:text-blue-400">
          Use the navigation menu on the left to begin. Let’s invest in the future! 🚀
        </p>
      </div>
    </DashboardLayout>
  );
};

export default InvestorDashboard;




