// import React from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { LogOut, Home, Settings, MessageCircle, Bell } from 'lucide-react';

// const DashboardLayout = ({ children }) => {
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     localStorage.removeItem('token');
//     navigate('/login');
//   };

//   return (
//     <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white">
//       {/* Sidebar */}
//       <aside className="w-64 bg-white dark:bg-gray-800 shadow-lg p-5">
//         <h1 className="text-2xl font-bold mb-6">PitchBridge</h1>
//         <nav className="space-y-4">
//           <Link to="/dashboard" className="flex items-center gap-2 hover:text-blue-500">
//             <Home size={20} />
//             Dashboard
//           </Link>
//           <Link to="/dashboard/messages" className="flex items-center gap-2 hover:text-blue-500">
//             <MessageCircle size={20} />
//             Messages
//           </Link>
//           <Link to="/dashboard/notifications" className="flex items-center gap-2 hover:text-blue-500">
//             <Bell size={20} />
//             Notifications
//           </Link>
//           <Link to="/dashboard/settings" className="flex items-center gap-2 hover:text-blue-500">
//             <Settings size={20} />
//             Settings
//           </Link>
//           <button
//             onClick={handleLogout}
//             className="flex items-center gap-2 text-red-600 hover:text-red-800 mt-4"
//           >
//             <LogOut size={20} />
//             Logout
//           </button>
//         </nav>
//       </aside>

//       {/* Main content */}
//       <main className="flex-1 p-6 overflow-y-auto bg-gray-50 dark:bg-gray-900">
//         {children}
//       </main>
//     </div>
//   );
// };

// export default DashboardLayout;


import React from 'react';
import Sidebar from "../../components/Sidebar"; // ✅ Adjust the path if needed

const DashboardLayout = ({ children, role }) => {
  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white">
      {/* Sidebar with role-based links */}
      <div className="w-64 bg-white dark:bg-gray-800 shadow-md">
        <Sidebar role={role} />
      </div>

      {/* Main content area */}
      <main className="flex-1 p-6 overflow-y-auto bg-gray-50 dark:bg-gray-900">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;


