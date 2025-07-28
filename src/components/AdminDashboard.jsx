// src/components/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import {
  Users,
  Settings,
  BarChart2,
  ShieldCheck,
  Mail,
  HelpCircle,
  FileText, // For Content Management
  AlertTriangle, // For Reported Issues
  Clock, // For Recent Activity timestamps
  UserCheck, // For Active Users
  UserPlus, // For New Registrations
  PieChart, // For a new chart type
  Activity // For general activity
} from 'lucide-react';
import { Link } from 'react-router-dom';

// Import Chart.js components and register them
import { Line, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

// Register Chart.js components once
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Mock data for admin dashboard (replace with actual API calls in a real application)
const mockAdminStats = {
  totalUsers: 1540,
  activeUsersToday: 780,
  pendingVerifications: 45,
  reportedIssues: 12,
  newRegistrationsThisWeek: 75,
  totalInvestmentsManaged: 1230, // For overall platform oversight
};

const mockSystemHealthData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
  datasets: [
    {
      label: 'New User Registrations',
      data: [30, 45, 60, 50, 70, 90, 75],
      borderColor: 'rgb(75, 192, 192)',
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      tension: 0.4, // Make the line curve
      fill: true,
    },
  ],
};

const mockUserRoleDistribution = {
  labels: ['Investors', 'Founders', 'Admins', 'Pending'],
  datasets: [
    {
      data: [60, 30, 5, 5], // Percentage distribution
      backgroundColor: ['#22C55E', '#3B82F6', '#EF4444', '#F59E0B'], // green, blue, red, yellow
      hoverOffset: 4,
    },
  ],
};

const mockRecentActivity = [
  { id: 1, icon: <UserCheck size={18} className="text-green-500" />, type: 'User Verified', description: 'John Doe\'s account verified.', time: '2 hours ago' },
  { id: 2, icon: <FileText size={18} className="text-blue-500" />, type: 'Content Update', description: 'New blog post "Market Trends 2024" published.', time: '5 hours ago' },
  { id: 3, icon: <AlertTriangle size={18} className="text-red-500" />, type: 'Issue Reported', description: 'Performance issue on dashboard page.', time: '1 day ago' },
  { id: 4, icon: <Settings size={18} className="text-gray-500" />, type: 'System Config', description: 'Email notification settings updated.', time: '2 days ago' },
  { id: 5, icon: <UserPlus size={18} className="text-purple-500" />, type: 'New Registration', description: 'New founder account created: "InnovateCo".', time: '3 days ago' },
];

const mockIssues = [
  { id: 'ISS001', summary: 'Login button not working', reporter: 'User_456', status: 'Open', date: '2025-07-20' },
  { id: 'ISS002', summary: 'Investment data mismatch', reporter: 'Founder_ABC', status: 'In Progress', date: '2025-07-18' },
  { id: 'ISS003', summary: 'Profile picture upload failed', reporter: 'User_789', status: 'Closed', date: '2025-07-15' },
  // Adding 4 more data entries
  { id: 'ISS004', summary: 'Missing resource link in FAQ', reporter: 'Admin_Helper', status: 'Open', date: '2025-07-22' },
  { id: 'ISS005', summary: 'Payout request stuck', reporter: 'Investor_XYZ', status: 'In Progress', date: '2025-07-21' },
  { id: 'ISS006', summary: 'Incorrect user role assigned', reporter: 'User_101', status: 'Open', date: '2025-07-19' },
  { id: 'ISS007', summary: 'Dashboard slow loading', reporter: 'Founder_LMN', status: 'Open', date: '2025-07-17' },
];


const AdminDashboard = () => {
  // State for rotating graphs
  const [currentGraphIndex, setCurrentGraphIndex] = useState(0);
  // State to simulate dark mode (add this for actual toggling)
  const [darkMode, setDarkMode] = useState(false); // You can connect this to a theme context or button later

  // Determine text color for Chart.js based on dark mode
  const chartTextColor = darkMode ? 'rgb(255, 255, 255)' : 'rgb(31, 41, 55)'; // white or gray-800
  const chartGridColor = darkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(209, 213, 219, 0.2)';

  const adminGraphs = [
    {
      component: Line, // Use actual Chart.js Line component
      data: mockSystemHealthData,
      options: {
        responsive: true,
        maintainAspectRatio: false, // Allows chart to fill container
        plugins: {
          legend: {
            position: 'top',
            labels: {
                color: chartTextColor // Dynamic color
            }
          },
          title: {
            display: true,
            text: 'New User Registrations Over Time',
            color: chartTextColor // Dynamic color
          },
        },
        scales: {
            x: {
                ticks: {
                    color: chartTextColor // Dynamic color
                },
                grid: {
                    color: chartGridColor // Dynamic grid lines
                }
            },
            y: {
                ticks: {
                    color: chartTextColor // Dynamic color
                },
                grid: {
                    color: chartGridColor // Dynamic grid lines
                }
            }
        }
      },
      title: 'New User Registrations',
      description: 'Track the growth of your user base over time.',
    },
    {
      component: Pie, // Use actual Chart.js Pie component
      data: mockUserRoleDistribution,
      options: {
        responsive: true,
        maintainAspectRatio: false, // Allows chart to fill container
        plugins: {
          legend: {
            position: 'right',
            labels: {
                color: chartTextColor // Dynamic color
            }
          },
          title: {
            display: true,
            text: 'User Role Distribution',
            color: chartTextColor // Dynamic color
          },
        },
      },
      title: 'User Role Distribution',
      description: 'Understand the breakdown of users by their assigned roles.',
    },
  ];

  // Auto-rotate graphs every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentGraphIndex((prevIndex) => (prevIndex + 1) % adminGraphs.length);
    }, 4000); // Change graph every 4 seconds as requested
    return () => clearInterval(interval);
  }, [adminGraphs.length]);

  const CurrentAdminGraphComponent = adminGraphs[currentGraphIndex].component;
  const currentAdminGraphData = adminGraphs[currentGraphIndex].data;
  const currentAdminGraphOptions = adminGraphs[currentGraphIndex].options;


  return (
    <div className={`${darkMode ? 'dark bg-gray-900 text-white' : 'bg-dark:bg-[#323C4D] text-gray-900'} min-h-screen p-8 transition-colors duration-300 ease-in-out`}>
      

      <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-6 border-b-4 pb-4 border-red-600 dark:border-red-400 flex items-center">
        <ShieldCheck className="mr-4 text-red-600 dark:text-red-400" size={36} />
        Admin Control Panel
      </h2>
      <p className="text-xl text-gray-700 dark:text-white mb-10 leading-relaxed">
        Your comprehensive overview for platform management and operational insights.
      </p>

      {/* Admin Key Stats Grid - Changed from Link to div and removed 'block cursor-pointer' related styles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {/* Stat Card: Total Users */}
        {/* Changed from <Link to="/admin/users" ...> to <div ...> */}
        <div className="bg-gradient-to-r from-red-500 to-rose-600 dark:from-red-700 dark:to-rose-800 p-5 rounded-xl shadow-lg text-white transform transition-transform duration-300 ease-in-out">
          <div className="flex items-center justify-between mb-2">
            <Users size={24} className="text-white/80" />
            <span className="text-sm font-semibold">Total Users</span>
          </div>
          <p className="text-3xl font-bold">{mockAdminStats.totalUsers.toLocaleString()}</p>
          <p className="text-sm text-white/80">+{mockAdminStats.newRegistrationsThisWeek} this week</p>
        </div>

        {/* Stat Card: Active Users Today */}
        {/* Changed from <Link to="/admin/activity-log" ...> to <div ...> */}
        <div className="bg-gradient-to-r from-green-500 to-teal-600 dark:from-green-700 dark:to-teal-800 p-5 rounded-xl shadow-lg text-white transform transition-transform duration-300 ease-in-out">
          <div className="flex items-center justify-between mb-2">
            <UserCheck size={24} className="text-white/80" />
            <span className="text-sm font-semibold">Active Users Today</span>
          </div>
          <p className="text-3xl font-bold">{mockAdminStats.activeUsersToday.toLocaleString()}</p>
          <p className="text-sm text-white/80">Currently Online: 80</p>
        </div>

        {/* Stat Card: Pending Verifications */}
        {/* Changed from <Link to="/admin/verifications" ...> to <div ...> */}
        <div className="bg-gradient-to-r from-yellow-500 to-orange-600 dark:from-yellow-700 dark:to-orange-800 p-5 rounded-xl shadow-lg text-white transform transition-transform duration-300 ease-in-out">
          <div className="flex items-center justify-between mb-2">
            <AlertTriangle size={24} className="text-white/80" />
            <span className="text-sm font-semibold">Pending Verifications</span>
          </div>
          <p className="text-3xl font-bold">{mockAdminStats.pendingVerifications}</p>
          <p className="text-sm text-white/80">+{mockAdminStats.reportedIssues} Reported Issues</p>
        </div>

        {/* Stat Card: Total Investments Managed (Platform-wide) */}
        {/* Changed from <Link to="/admin/investments" ...> to <div ...> */}
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 dark:from-blue-700 dark:to-indigo-800 p-5 rounded-xl shadow-lg text-white transform transition-transform duration-300 ease-in-out">
          <div className="flex items-center justify-between mb-2">
            <BarChart2 size={24} className="text-white/80" />
            <span className="text-sm font-semibold">Investments Managed</span>
          </div>
          <p className="text-3xl font-bold">{mockAdminStats.totalInvestmentsManaged.toLocaleString()}</p>
          <p className="text-sm text-white/80">Avg. Deal Size: $50K</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Area - Col 1 & 2 */}
        <div className="lg:col-span-2 space-y-8">
          {/* Section: Platform Performance & Analytics (Dynamic Graphs) */}
          <div className="bg-white dark:bg-gray-700 p-7 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-5 flex items-center">
              <BarChart2 className="mr-3 text-red-600 dark:text-red-400" size={26} />
              Platform Performance & Analytics
            </h3>
            <p className="text-gray-700 dark:text-white mb-6">
              Dive into key metrics and visualize platform health and user trends.
            </p>
            {/* Inner chart background remains for contrast, but adjusted for dark theme */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-5 h-80 flex items-center justify-center text-gray-500 dark:text-gray-400 border border-gray-300 dark:border-gray-600 relative">
              <div className="w-full h-full transition-opacity duration-700 ease-in-out opacity-100">
                <CurrentAdminGraphComponent
                  key={currentGraphIndex} // Crucial: forces component remount on index change
                  data={currentAdminGraphData}
                  options={currentAdminGraphOptions}
                />
              </div>

              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {adminGraphs.map((_, index) => (
                  <span
                    key={`admin-dot-${index}`}
                    className={`block w-3 h-3 rounded-full cursor-pointer ${
                      currentGraphIndex === index ? 'bg-red-600 dark:bg-red-400' : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                    onClick={() => setCurrentGraphIndex(index)} // Allow manual navigation
                  ></span>
                ))}
              </div>
            </div>
            <Link
              to="/admin/analytics"
              className="mt-6 w-full px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 shadow-md flex items-center justify-center text-center"
            >
              <BarChart2 className="mr-2" size={20} />
              Explore Detailed Analytics
            </Link>
          </div>

          {/* Section: Latest Reported Issues (Table) */}
          <div className="bg-white dark:bg-gray-700 p-7 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-5 flex items-center">
              <AlertTriangle className="mr-3 text-orange-600 dark:text-orange-400" size={26} />
              Latest Reported Issues
            </h3>
            <p className="text-gray-700 dark:text-white mb-6">
              Quick overview of recent issues reported by users.
            </p>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-[#1B1F2A]"> {/* Table header background to match card */}
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider">
                      Issue ID
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider">
                      Summary
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider">
                      Reported By
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-[#1F2836] divide-y divide-gray-200 dark:divide-gray-700">
                  {mockIssues.map((issue) => ( // Use mockIssues here
                    <tr key={issue.id} className="hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-150">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{issue.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-white">{issue.summary}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-white">{issue.reporter}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          issue.status === 'Open' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' :
                          issue.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' :
                          'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                        }`}>
                          {issue.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-white">{issue.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Link
              to="/admin/issues"
              className="mt-6 w-full px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors duration-200 shadow-md flex items-center justify-center text-center"
            >
              <AlertTriangle className="mr-2" size={20} />
              View All Issues
            </Link>
          </div>
        </div>

        {/* Sidebar Content Area - Col 3 */}
        <div className="lg:col-span-1 space-y-8">
          {/* Section: Admin Quick Actions */}
          <div className="bg-white dark:bg-gray-700 p-7 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-5 flex items-center">
              <Activity className="mr-3 text-blue-600 dark:text-blue-400" size={26} />
              Admin Quick Actions
            </h3>
            <div className="space-y-4">
              <Link
                to="/admin/users/create"
                className="flex items-center px-4 py-3 bg-blue-50 hover:bg-blue-200 dark:bg-[#1F2836] rounded-lg shadow-sm dark:hover:bg-gray-600 transition-colors duration-200 text-gray-800 dark:text-white font-medium"
              >
                <UserPlus className="mr-3 text-blue-600 dark:text-blue-400" size={20} />
                <span>Add New User</span>
              </Link>

              <Link
                to="/admin/content/manage"
                className="flex items-center px-4 py-3 bg-green-50 hover:bg-green-200 dark:bg-[#1F2836] rounded-lg shadow-sm dark:hover:bg-gray-600 transition-colors duration-200 text-gray-800 dark:text-white font-medium"
              >
                <FileText className="mr-3 text-green-600 dark:text-green-400" size={20} />
                <span>Manage Content</span>
              </Link>

              {/* Corrected: 'to' prop for System Settings & wrapped text */}
              <Link
                to="/settings"
                className="flex items-center px-4 py-3 bg-purple-50 hover:bg-purple-200 dark:bg-[#1F2836] rounded-lg shadow-sm dark:hover:bg-gray-600 transition-colors duration-200 text-gray-800 dark:text-white font-medium"
              >
                <Settings className="mr-3 text-purple-600 dark:text-purple-400" size={20} />
                <span>System Settings</span>
              </Link>

              {/* Corrected: Wrapped text for Send Broadcast */}
              <Link
                to="/admin/broadcast"
                className="flex items-center px-4 py-3 bg-red-50 hover:bg-red-200 dark:bg-[#1F2836] rounded-lg shadow-sm dark:hover:bg-gray-600 transition-colors duration-200 text-gray-800 dark:text-white font-medium"
              >
                <Mail className="mr-3 text-red-600 dark:text-red-400" size={20} />
                <span>Send Broadcast</span>
              </Link>

              {/* Corrected: 'to' prop for Help & FAQ Button & wrapped text */}
              <Link
                to="/faq"
                className="flex items-center px-4 py-3 bg-yellow-50 hover:bg-yellow-200 dark:bg-[#1F2836] rounded-lg shadow-sm dark:hover:bg-gray-600 transition-colors duration-200 text-gray-800 dark:text-white font-medium"
              >
                <HelpCircle className="mr-3 text-yellow-600 dark:text-yellow-400" size={20} />
                <span>Help & FAQ</span>
              </Link>
            </div>
          </div>

          {/* Section: Recent Admin Activity */}
          <div className="bg-white dark:bg-gray-700 p-7 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-5 flex items-center">
              <Clock className="mr-3 text-lime-600 dark:text-lime-400" size={26} />
              Recent Admin Activity
            </h3>
            <ul className="space-y-4">
              {mockRecentActivity.map((activity) => (
                <li key={activity.id} className="flex items-start bg-gray-50 hover:bg-gray-200 dark:bg-[#1F2836] p-4 rounded-lg shadow-sm dark:hover:bg-gray-600"> {/* Added hover for dark mode */}
                  <div className="flex-shrink-0 mr-4 mt-1">
                    {activity.icon}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 dark:text-white">{activity.type}</p>
                    <p className="text-sm text-gray-700 dark:text-white">{activity.description}</p>
                    <p className="text-xs text-gray-500 dark:text-white mt-1">{activity.time}</p>
                  </div>
                </li>
              ))}
            </ul>
            <Link
              to="/admin/activity-log"
              className="mt-6 w-full px-6 py-3 bg-lime-600 text-white rounded-lg hover:bg-lime-700 transition-colors duration-200 shadow-md flex items-center justify-center text-center"
            >
              <Activity className="mr-2" size={20} />
              View All Admin Logs
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;