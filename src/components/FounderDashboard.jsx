import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    Briefcase,
    TrendingUp,
    Users,
    PlusCircle,
    DollarSign,
    Target,
    Bell,
    MessageSquare,
    ClipboardCheck,
    Star,
    Eye,
    CalendarDays,
    ArrowUpRight,
    Settings,
} from 'lucide-react';

import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

const FounderDashboard = ({ teamMembers }) => {
    const [activeChart, setActiveChart] = useState('pitchViews');
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        const detectDarkMode = () => {
            setIsDarkMode(document.documentElement.classList.contains('dark'));
        };
        detectDarkMode();
        const observer = new MutationObserver(detectDarkMode);
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
        return () => observer.disconnect();
    }, []);

    const fundingProgress = {
        raised: 7500000,
        goal: 10000000,
        investorsContacted: 120,
        meetingsScheduled: 35,
        commitments: 5,
        targetCloseDate: '2025-12-31'
    };
    const fundingPercentage = (fundingProgress.raised / fundingProgress.goal) * 100;

    const pitchAnalytics = {
        views: 2500,
        downloads: 850,
        conversionRate: 5.2,
        avgRating: 4.5,
        totalRatings: 120
    };

    const recentActivity = [
        { id: 1, type: 'Pitch View', description: 'Your pitch deck viewed by John Doe (Investor)', time: '2 mins ago', icon: <Eye className="text-blue-500" /> },
        { id: 2, type: 'Message', description: 'New message from Jane Smith (Investor)', time: '1 hour ago', icon: <MessageSquare className="text-green-500" /> },
        { id: 3, type: 'Rating', description: 'Your startup received a 5-star rating from Investor A', time: 'Yesterday', icon: <Star className="text-yellow-500" /> },
        { id: 4, type: 'Profile Update', description: 'Your startup profile was last updated', time: '3 days ago', icon: <ClipboardCheck className="text-purple-500" /> },
    ];

    // --- Chart Data & Options for different views ---
    // 1. Pitch Views Chart Data & Options
    const pitchViewsChartData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
        datasets: [
            {
                label: 'Pitch Views',
                data: [500, 700, 1200, 1500, 2000, 2500, 2800, 3100],
                borderColor: '#4F46E5', // Indigo-600
                backgroundColor: 'rgba(79, 70, 229, 0.2)', // Indigo-600 with transparency
                fill: true,
                tension: 0.4,
                pointRadius: 5,
                pointBackgroundColor: '#4F46E5',
                pointBorderColor: '#fff',
                pointHoverRadius: 7,
                pointHoverBackgroundColor: '#4F46E5',
                pointHoverBorderColor: '#fff',
            },
        ],
    };

    const pitchViewsChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
                position: 'top',
                labels: {
                    color: isDarkMode ? 'rgb(249 250 251)' : 'rgb(55 65 81)', // Changed to white for dark mode legend
                }
            },
            title: {
                display: true,
                text: 'Investor Engagement Over Time (Pitch Views)',
                color: isDarkMode ? 'rgb(249 250 251)' : 'rgb(55 65 81)',
                font: {
                    size: 18,
                    weight: 'bold'
                }
            },
            tooltip: {
                backgroundColor: isDarkMode ? 'rgba(0,0,0,0.7)' : 'rgba(255,255,255,0.8)', // Flipped tooltip background for dark mode
                titleColor: isDarkMode ? '#fff' : '#000', // Flipped tooltip title color
                bodyColor: isDarkMode ? '#fff' : '#000', // Flipped tooltip body color
                callbacks: {
                    label: function (context) {
                        let label = context.dataset.label || '';
                        if (label) {
                            label += ': ';
                        }
                        if (context.parsed.y !== null) {
                            label += context.parsed.y.toLocaleString();
                        }
                        return label;
                    }
                }
            }
        },
        scales: {
            x: {
                grid: {
                    color: isDarkMode ? 'rgba(100, 100, 100, 0.2)' : 'rgba(200, 200, 200, 0.1)',
                    borderColor: isDarkMode ? 'rgb(75 85 99)' : 'rgb(229 231 235)',
                },
                ticks: {
                    color: isDarkMode ? 'rgb(249 250 251)' : 'rgb(107 114 128)', // Changed to white for dark mode ticks
                },
                title: {
                    display: true,
                    text: 'Month',
                    color: isDarkMode ? 'rgb(249 250 251)' : 'rgb(55 65 81)',
                    font: {
                        size: 14,
                        weight: 'bold'
                    }
                }
            },
            y: {
                grid: {
                    color: isDarkMode ? 'rgba(100, 100, 100, 0.2)' : 'rgba(200, 200, 200, 0.1)',
                    borderColor: isDarkMode ? 'rgb(75 85 99)' : 'rgb(229 231 235)',
                },
                ticks: {
                    color: isDarkMode ? 'rgb(249 250 251)' : 'rgb(107 114 128)', // Changed to white for dark mode ticks
                    callback: function (value) {
                        return value.toLocaleString();
                    }
                },
                title: {
                    display: true,
                    text: 'Number of Views',
                    color: isDarkMode ? 'rgb(249 250 251)' : 'rgb(55 65 81)',
                    font: {
                        size: 14,
                        weight: 'bold'
                    }
                }
            }
        },
    };

    // 2. Conversion Rate Chart Data & Options
    const conversionRateChartData = {
        labels: ['Q1', 'Q2', 'Q3', 'Q4'],
        datasets: [
            {
                label: 'Conversion Rate (%)',
                data: [3.5, 4.0, 5.2, 4.8],
                backgroundColor: '#EF4444', // Red-500
                borderColor: '#DC2626', // Red-600
                borderWidth: 1,
            },
        ],
    };

    const conversionRateChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
                position: 'top',
                labels: {
                    color: isDarkMode ? 'rgb(249 250 251)' : 'rgb(55 65 81)', // Changed to white for dark mode legend
                }
            },
            title: {
                display: true,
                text: 'Pitch Deck Conversion Rate',
                color: isDarkMode ? 'rgb(249 250 251)' : 'rgb(55 65 81)',
                font: {
                    size: 18,
                    weight: 'bold'
                }
            },
            tooltip: {
                backgroundColor: isDarkMode ? 'rgba(0,0,0,0.7)' : 'rgba(255,255,255,0.8)', // Flipped tooltip background for dark mode
                titleColor: isDarkMode ? '#fff' : '#000', // Flipped tooltip title color
                bodyColor: isDarkMode ? '#fff' : '#000', // Flipped tooltip body color
                callbacks: {
                    label: function (context) {
                        return `${context.dataset.label}: ${context.parsed.y}%`;
                    }
                }
            }
        },
        scales: {
            x: {
                grid: {
                    color: isDarkMode ? 'rgba(100, 100, 100, 0.2)' : 'rgba(200, 200, 200, 0.1)',
                    borderColor: isDarkMode ? 'rgb(75 85 99)' : 'rgb(229 231 235)',
                },
                ticks: {
                    color: isDarkMode ? 'rgb(249 250 251)' : 'rgb(107 114 128)', // Changed to white for dark mode ticks
                },
                title: {
                    display: true,
                    text: 'Quarter',
                    color: isDarkMode ? 'rgb(249 250 251)' : 'rgb(55 65 81)',
                    font: {
                        size: 14,
                        weight: 'bold'
                    }
                }
            },
            y: {
                grid: {
                    color: isDarkMode ? 'rgba(100, 100, 100, 0.2)' : 'rgba(200, 200, 200, 0.1)',
                    borderColor: isDarkMode ? 'rgb(75 85 99)' : 'rgb(229 231 235)',
                },
                ticks: {
                    color: isDarkMode ? 'rgb(249 250 251)' : 'rgb(107 114 128)', // Changed to white for dark mode ticks
                    callback: function (value) {
                        return `${value}%`;
                    }
                },
                title: {
                    display: true,
                    text: 'Percentage',
                    color: isDarkMode ? 'rgb(249 250 251)' : 'rgb(55 65 81)',
                    font: {
                        size: 14,
                        weight: 'bold'
                    }
                }
            }
        },
    };

    // 3. Funding Progress Chart Data & Options (Doughnut)
    const fundingProgressChartData = {
        labels: ['Raised', 'Remaining'],
        datasets: [
            {
                data: [fundingProgress.raised, fundingProgress.goal - fundingProgress.raised],
                backgroundColor: ['#10B981', '#E5E7EB'], // Green-500, Gray-200
                borderColor: isDarkMode ? ['#047857', '#4B5563'] : ['#10B981', '#E5E7EB'], // Darker green / gray-700
                borderWidth: 1,
            },
        ],
    };

    const fundingProgressChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'right',
                labels: {
                    color: isDarkMode ? 'rgb(249 250 251)' : 'rgb(55 65 81)', // Changed to white for dark mode legend
                }
            },
            title: {
                display: true,
                text: 'Funding Progress',
                color: isDarkMode ? 'rgb(249 250 251)' : 'rgb(55 65 81)',
                font: {
                    size: 18,
                    weight: 'bold'
                }
            },
            tooltip: {
                backgroundColor: isDarkMode ? 'rgba(0,0,0,0.7)' : 'rgba(255,255,255,0.8)', // Flipped tooltip background for dark mode
                titleColor: isDarkMode ? '#fff' : '#000', // Flipped tooltip title color
                bodyColor: isDarkMode ? '#fff' : '#000', // Flipped tooltip body color
                callbacks: {
                    label: function (context) {
                        let label = context.label || '';
                        if (label) {
                            label += ': ';
                        }
                        if (context.parsed !== null) {
                            label += `$${context.parsed.toLocaleString()}`;
                        }
                        return label;
                    }
                }
            }
        },
    };

    const chartTypes = [
        { key: 'pitchViews', label: 'Pitch Views' },
        { key: 'conversionRate', label: 'Conversion Rate' },
        { key: 'fundingProgress', label: 'Funding Progress' },
    ];

    useEffect(() => {
        const rotationInterval = setInterval(() => {
            setActiveChart((prevChart) => {
                const currentIndex = chartTypes.findIndex(chart => chart.key === prevChart);
                const nextIndex = (currentIndex + 1) % chartTypes.length;
                return chartTypes[nextIndex].key;
            });
        }, 4000);

        return () => clearInterval(rotationInterval);
    }, [chartTypes.length]);

    const renderChart = () => {
        switch (activeChart) {
            case 'pitchViews':
                return <Line data={pitchViewsChartData} options={pitchViewsChartOptions} />;
            case 'conversionRate':
                return <Bar data={conversionRateChartData} options={conversionRateChartOptions} />;
            case 'fundingProgress':
                return <Doughnut data={fundingProgressChartData} options={fundingProgressChartOptions} />;
            default:
                return <Line data={pitchViewsChartData} options={pitchViewsChartOptions} />;
        }
    };

    // Reusable span for text with potential white background (now dark:text-white)
    const HighlightedText = ({ children }) => (
        <span className="text-black dark:text-white py-0 px-1 rounded box-decoration-clone">
            {children}
        </span>
    );
    return (
        <div className="bg-gray-100 dark:bg-gray-800 min-h-screen p-8"> {/* Added dark:bg-gray-800 to overall container */}
            {/* Main Title Heading */}
            <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-6 pb-4 flex items-center border-b border-blue-500/30 dark:border-blue-400/30">
                <Briefcase className="mr-4 text-blue-600 dark:text-blue-400" size={36} />
                <span className="dark:text-white"> {/* Ensure title text is white in dark mode */}
                    Founder Hub
                </span>
            </h2>
            <p className="text-lg sm:text-xl text-gray-700 dark:text-gray-300 mb-6 leading-relaxed tracking-wide">
                <span className="dark:text-white py-0 px-1 rounded box-decoration-clone"> {/* Apply dark:text-white */}
                    Empowering your startup's journey. Here's your personalized overview and key actions to propel your vision forward.
                </span>
            </p>

            {/* Quick Stats & Actions Grid - Cards are now static divs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                {/* Stat Card: Funding Raised */}
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 dark:from-blue-700 dark:to-indigo-800 p-5 rounded-xl shadow-lg text-white">
                    <div className="flex items-center justify-between mb-2">
                        <DollarSign size={24} className="text-white/80" />
                        <span className="text-sm font-semibold text-white"><HighlightedText>Total Raised</HighlightedText></span>
                    </div>
                    <p className="text-3xl font-bold text-white">${(fundingProgress.raised / 1000000).toFixed(1)}M</p>
                    <p className="text-sm text-white/80 text-white"><HighlightedText>of ${(fundingProgress.goal / 1000000).toFixed(0)}M Goal</HighlightedText></p>
                </div>

                {/* Stat Card: Pitch Views */}
                <div className="bg-gradient-to-r from-green-500 to-teal-600 dark:from-green-700 dark:to-teal-800 p-5 rounded-xl shadow-lg text-white">
                    <div className="flex items-center justify-between mb-2">
                        <Eye className="text-white/80" size={24} />
                        <span className="text-sm font-semibold text-white"><HighlightedText>Pitch Views</HighlightedText></span>
                    </div>
                    <p className="text-3xl font-bold text-white">{pitchAnalytics.views}</p>
                    <p className="text-sm text-white/80 text-white"><HighlightedText>{pitchAnalytics.downloads} Downloads</HighlightedText></p>
                </div>

                {/* Stat Card: Messages */}
                <div className="bg-gradient-to-r from-purple-500 to-pink-600 dark:from-purple-700 dark:to-pink-800 p-5 rounded-xl shadow-lg text-white">
                    <div className="flex items-center justify-between mb-2">
                        <MessageSquare size={24} className="text-white/80" />
                        <span className="text-sm font-semibold text-white"><HighlightedText>New Messages</HighlightedText></span>
                    </div>
                    <p className="text-3xl font-bold text-white">7</p> {/* Mock data */}
                    <p className="text-sm text-white/80 text-white"><HighlightedText>From investors & partners</HighlightedText></p>
                </div>

                {/* Stat Card: Next Key Action */}
                <div className="bg-gradient-to-r from-yellow-500 to-orange-600 dark:from-yellow-700 dark:to-orange-800 p-5 rounded-xl shadow-lg text-white">
                    <div className="flex items-center justify-between mb-2">
                        <Target size={24} className="text-white/80" />
                        <span className="text-sm font-semibold text-white"><HighlightedText>Next Deadline</HighlightedText></span>
                    </div>
                    <p className="text-2xl font-bold text-white flex items-center">
                        <CalendarDays size={20} className="mr-2" />
                        {new Date(fundingProgress.targetCloseDate).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-white/80 text-white"><HighlightedText>Funding Round Close</HighlightedText></p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content Area - Col 1 & 2 */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Section: Fundraising Momentum - Now dynamic charts */}
                    <div className="bg-white dark:bg-gray-700 p-7 rounded-xl shadow-lg border border-gray-200 dark:border-gray-600"> {/* Changed dark:bg-gray-850 to dark:bg-gray-700 and dark:border-gray-700 to dark:border-gray-600 */}
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-5 flex items-center">
                            <TrendingUp className="mr-3 text-green-600 dark:text-green-400" size={26} />
                            <span className="bg-white dark:bg-gray-700 text-black dark:text-white py-1 px-3 rounded-md box-decoration-clone"> {/* Applied dark:bg-gray-700 and dark:text-white */}
                                Fundraising Momentum
                            </span>
                        </h3>
                        <p className="text-gray-700 dark:text-gray-300 mb-6"> {/* Applied dark:text-gray-300 */}
                            <HighlightedText>
                                Visualize your funding progress and key investor engagement metrics.
                            </HighlightedText>
                        </p>
                        <div className="mb-6">
                            <label htmlFor="funding-progress" className="block text-md font-medium text-gray-700 dark:text-gray-300 mb-2"> {/* Applied dark:text-gray-300 */}
                                <HighlightedText>
                                    Funding Progress: {fundingPercentage.toFixed(1)}%
                                </HighlightedText>
                            </label>
                            <div className="w-full bg-gray-200 rounded-full h-3.5 dark:bg-gray-700">
                                <div
                                    className="bg-gradient-to-r from-green-400 to-green-600 h-3.5 rounded-full shadow-inner"
                                    style={{ width: `${fundingPercentage}%` }}
                                ></div>
                            </div>
                            <p className="text-sm mt-2 text-gray-600 dark:text-gray-400"> {/* Applied dark:text-gray-400 */}
                                <HighlightedText>
                                    You've raised ${fundingProgress.raised.toLocaleString()} of your ${fundingProgress.goal.toLocaleString()} goal.
                                </HighlightedText>
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center mb-6">
                            <div className="p-4 bg-blue-50 dark:bg-gray-700 rounded-lg shadow-sm"> {/* Replaced bg-blue-50 with dark:bg-gray-700 */}
                                <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">{fundingProgress.investorsContacted}</p>
                                <p className="text-sm text-gray-700 dark:text-gray-300"><HighlightedText>Investors Contacted</HighlightedText></p> {/* Applied dark:text-gray-300 */}
                            </div>
                            <div className="p-4 bg-purple-50 dark:bg-gray-700 rounded-lg shadow-sm"> {/* Replaced bg-purple-50 with dark:bg-gray-700 */}
                                <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">{fundingProgress.meetingsScheduled}</p>
                                <p className="text-sm text-gray-700 dark:text-gray-300"><HighlightedText>Meetings Scheduled</HighlightedText></p> {/* Applied dark:text-gray-300 */}
                            </div>
                            <div className="p-4 bg-yellow-50 dark:bg-gray-700 rounded-lg shadow-sm"> {/* Replaced bg-yellow-50 with dark:bg-gray-700 */}
                                <p className="text-2xl font-bold text-yellow-700 dark:text-yellow-300">{fundingProgress.commitments}</p>
                                <p className="text-sm text-gray-700 dark:text-gray-300"><HighlightedText>Commitments</HighlightedText></p> {/* Applied dark:text-gray-300 */}
                            </div>
                        </div>

                        {/* Chart Navigation Buttons - Text here should be readable on their background */}
                        <div className="flex justify-center gap-3 mb-6 flex-wrap">
                            {chartTypes.map((chart) => (
                                <button
                                    key={chart.key}
                                    onClick={() => {
                                        setActiveChart(chart.key);
                                    }}
                                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300
                                                ${activeChart === chart.key
                                            ? 'bg-indigo-600 text-white shadow-md'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600' // Applied dark styles
                                        }`}
                                >
                                    {/* No highlight here, button text should contrast with button color */}
                                    {chart.label}
                                </button>
                            ))}
                        </div>

                        {/* Dynamic Chart Display Area */}
                        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-5 h-80 flex items-center justify-center text-gray-500 dark:text-gray-400 border border-gray-300 dark:border-gray-600">
                            {renderChart()}
                        </div>

                        {/* Link Button Text - Not highlighted, button text should contrast with button color */}
                        <Link
                            to="/fundraising-details"
                            className="mt-6 w-full px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 shadow-md flex items-center justify-center text-center"
                        >
                            <DollarSign className="mr-2" size={20} />
                            View Full Fundraising Details
                        </Link>
                    </div>

                    {/* Section: Pitch Deck Performance */}
                    <div className="bg-white dark:bg-gray-700 p-7 rounded-xl shadow-lg border border-gray-200 dark:border-gray-600"> {/* Changed dark:bg-gray-850 to dark:bg-gray-700 and dark:border-gray-700 to dark:border-gray-600 */}
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-5 flex items-center">
                            <Target className="mr-3 text-orange-600 dark:text-orange-400" size={26} />
                            <span className="bg-white dark:bg-gray-700 text-black dark:text-white py-1 px-3 rounded-md box-decoration-clone"> {/* Applied dark:bg-gray-700 and dark:text-white */}
                                Pitch Deck Performance
                            </span>
                        </h3>
                        <p className="text-gray-700 dark:text-gray-300 mb-6"> {/* Applied dark:text-gray-300 */}
                            <HighlightedText>
                                Insights into how your pitch is performing with potential investors.
                            </HighlightedText>
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-center mb-6">
                            <div className="p-4 bg-orange-50 dark:bg-gray-700 rounded-lg shadow-sm flex flex-col items-center justify-center"> {/* Replaced bg-orange-50 with dark:bg-gray-700 */}
                                <p className="text-3xl font-bold text-orange-700 dark:text-orange-300 flex items-center">
                                    {pitchAnalytics.conversionRate}% <ArrowUpRight className="ml-2 text-orange-600 dark:text-orange-400" size={24} />
                                </p>
                                <p className="text-sm text-gray-700 dark:text-gray-300"><HighlightedText>Conversion Rate</HighlightedText></p> {/* Applied dark:text-gray-300 */}
                            </div>
                            <div className="p-4 bg-yellow-50 dark:bg-gray-700 rounded-lg shadow-sm flex flex-col items-center justify-center"> {/* Replaced bg-yellow-50 with dark:bg-gray-700 */}
                                <p className="text-3xl font-bold text-yellow-700 dark:text-yellow-300 flex items-center">
                                    {pitchAnalytics.avgRating} <Star fill="currentColor" className="ml-2 text-yellow-500" size={24} />
                                </p>
                                <p className="text-sm text-gray-700 dark:text-gray-300"><HighlightedText>({pitchAnalytics.totalRatings} reviews)</HighlightedText></p> {/* Applied dark:text-gray-300 */}
                                <p className="text-sm text-gray-700 dark:text-gray-300"><HighlightedText>Average Rating</HighlightedText></p> {/* Applied dark:text-gray-300 */}
                            </div>
                        </div>
                        {/* Link Button Text - Not highlighted */}
                        <Link
                            to="/submit-pitch"
                            className="w-full px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200 shadow-md flex items-center justify-center text-center"
                        >
                            <Briefcase className="mr-2" size={20} />
                            Manage Pitch Decks
                        </Link>
                    </div>

                    {/* Section: Team Overview */}
                    <div className="bg-white dark:bg-gray-700 p-7 rounded-xl shadow-lg border border-gray-200 dark:border-gray-600"> {/* Changed dark:bg-gray-850 to dark:bg-gray-700 and dark:border-gray-700 to dark:border-gray-600 */}
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-5 flex items-center">
                            <Users className="mr-3 text-pink-600 dark:text-pink-400" size={26} />
                            <span className="bg-white dark:bg-gray-700 text-black dark:text-white py-1 px-3 rounded-md box-decoration-clone"> {/* Applied dark:bg-gray-700 and dark:text-white */}
                                Team Overview
                            </span>
                        </h3>
                        <p className="text-gray-700 dark:text-gray-300 mb-6"> {/* Applied dark:text-gray-300 */}
                            <HighlightedText>
                                Your core team members. Ensure everyone's profiles are up to date.
                            </HighlightedText>
                        </p>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-6">
                            {Array.isArray(teamMembers) && teamMembers.length > 0 ? (
                                teamMembers.map(member => (
                                    <div key={member.id} className="text-center">
                                        <img
                                            className="inline-block h-20 w-20 rounded-full ring-2 ring-blue-300 dark:ring-blue-600 object-cover mb-2 shadow-md"
                                            src={member.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${member.name}&backgroundColor=008cff,00b4d8,48bfe3,64dfdf,80ffdb&backgroundType=squiggles,grid,dots&scale=90`}
                                            alt={member.name}
                                        />
                                        <p className="font-semibold text-sm text-gray-900 dark:text-white"><HighlightedText>{member.name}</HighlightedText></p> {/* Applied dark:text-white */}
                                        <p className="text-xs text-gray-600 dark:text-gray-400"><HighlightedText>{member.role}</HighlightedText></p> {/* Applied dark:text-gray-400 */}
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-full text-center py-4 text-gray-700 dark:text-gray-300"> {/* Applied dark:text-gray-300 */}
                                    <p className="mb-2"><HighlightedText>No team members added yet.</HighlightedText></p>
                                    <Link
                                        to="/manage-team"
                                        className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium"
                                    >
                                        <HighlightedText>Click here to add your first team member!</HighlightedText>
                                    </Link>
                                </div>
                            )}

                            {Array.isArray(teamMembers) && teamMembers.length > 0 && (
                                <Link
                                    to="/manage-team"
                                    className="text-center flex flex-col items-center justify-center p-2 group"
                                >
                                    <div className="h-20 w-20 rounded-full ring-2 ring-gray-300 dark:ring-gray-600 border border-dashed border-gray-400 dark:border-gray-500 flex items-center justify-center text-gray-500 dark:text-gray-400 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"> {/* Applied dark:hover:bg-gray-700 */}
                                        <PlusCircle size={36} />
                                    </div>
                                    <p className="font-semibold text-sm mt-2 text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400"> {/* Applied dark:text-white */}
                                        <HighlightedText>Add Member</HighlightedText>
                                    </p>
                                </Link>
                            )}
                        </div>
                        {/* Link Button Text - Not highlighted */}
                        <Link
                            to="/manage-team"
                            className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-md flex items-center justify-center text-center"
                        >
                            <Users className="mr-2" size={20} />
                            Manage Team
                        </Link>
                    </div>
                </div>

                {/* Sidebar Content Area - Col 3 */}
                <div className="lg:col-span-1 space-y-8">
                    {/* Section: Recent Activity */}
                    <div className="bg-white dark:bg-gray-700 p-7 rounded-xl shadow-lg border border-gray-200 dark:border-gray-600"> {/* Changed dark:bg-gray-850 to dark:bg-gray-700 and dark:border-gray-700 to dark:border-gray-600 */}
                        <h3 className="text-2xl dark:bg-[#1B1F2A]font-bold text-gray-900 dark:text-white mb-5 flex items-center">
                            <Bell className="mr-3 text-yellow-600 dark:text-yellow-400" size={26} />
                            <span className="bg-white dark:bg-gray-700 text-black dark:text-white py-1 px-3 rounded-md box-decoration-clone"> {/* Applied dark:bg-gray-700 and dark:text-white */}
                                Recent Activity
                            </span>
                        </h3>
                        <ul className="space-y-4 ">
                            {recentActivity.map(activity => (
                                <li key={activity.id} className="flex items-start dark:bg-[#1B1F2A] dark:bg-[#1F2836] hover:bg-gray-50 dark:hover:bg-gray-600 p-3 rounded-lg transition-colors duration-150 border border-gray-200 dark:border-gray-600"> {/* Applied dark:bg-gray-700, dark:hover:bg-gray-600, dark:border-gray-600 */}
                                    <div className="flex-shrink-0 mr-3 mt-1 dark:bg-[#1B1F2A]">
                                        {activity.icon}
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900 dark:text-white"><HighlightedText>{activity.type}: <span className="text-gray-700 dark:text-gray-300 ">{activity.description}</span></HighlightedText></p> {/* Applied dark:text-white and dark:text-gray-300 */}
                                        <p className="text-sm text-gray-600 dark:text-gray-400"><HighlightedText>{activity.time}</HighlightedText></p> {/* Applied dark:text-gray-400 */}
                                    </div>
                                </li>
                            ))}
                        </ul>
                        <Link
                            to="/notifications"
                            className="mt-6 w-full px-6 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors duration-200 shadow-md flex items-center justify-center text-center"
                        >
                            <Eye className="mr-2" size={20} />
                            View All Activity
                        </Link>
                    </div>

                    {/* Section: Quick Actions */}
                    <div className="bg-white dark:bg-gray-700 p-7 rounded-xl shadow-lg border border-gray-200 dark:border-gray-600"> {/* Changed dark:bg-gray-850 to dark:bg-gray-700 and dark:border-gray-700 to dark:border-gray-600 */}
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-5 flex items-center">
                            <PlusCircle className="mr-3 text-blue-600 dark:text-blue-400" size={26} />
                            <span className="bg-white dark:bg-gray-700 text-black dark:text-white py-1 px-3 rounded-md box-decoration-clone"> {/* Applied dark:bg-gray-700 and dark:text-white */}
                                Quick Actions
                            </span>
                        </h3>
                        <div className="space-y-4">
                            <Link
                                to="/submit-pitch"
                                className="flex items-center px-4 py-3 bg-blue-100 hover:bg-blue-200 dark:bg-[#1F2836] dark:bg-[#1F2836] rounded-lg shadow-sm hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200 text-gray-900 dark:text-white font-medium"
                            > {/* Applied dark:bg-gray-700, dark:hover:bg-gray-600, dark:text-white */}
                                <Briefcase className="mr-3 text-blue-600 dark:text-blue-400" size={20} />
                                <HighlightedText>Create New Pitch</HighlightedText>
                            </Link>
                            <Link
                                to="/investors"
                                className="flex items-center px-4 py-3 bg-green-100 hover:bg-green-200 dark:bg-[#1F2836] dark:bg-[#1F2836] rounded-lg shadow-sm hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200 text-gray-900 dark:text-white font-medium"
                            > {/* Applied dark:bg-gray-700, dark:hover:bg-gray-600, dark:text-white */}
                                <MessageSquare className="mr-3 text-green-600 dark:text-green-400" size={20} />
                                <HighlightedText>Meet Investors</HighlightedText>
                            </Link>
                            <Link
                                to="/settings"
                                className="flex items-center px-4 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-[#1F2836] dark:bg-[#1F2836] rounded-lg shadow-sm hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200 text-gray-900 dark:text-white font-medium"
                            > {/* Applied dark:bg-gray-700, dark:hover:bg-gray-600, dark:text-white */}
                                <Settings className="mr-3 text-gray-600 dark:text-gray-400" size={20} />
                                <HighlightedText>Account Settings</HighlightedText>
                            </Link>
                            <Link
                                to="/faq"
                                className="flex items-center px-4 py-3 bg-yellow-100 hover:bg-yellow-200 dark:bg-[#1F2836] dark:bg-[#1F2836] rounded-lg shadow-sm hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200 text-gray-900 dark:text-white font-medium"
                            > {/* Applied dark:bg-gray-700, dark:hover:bg-gray-600, dark:text-white */}
                                <ClipboardCheck className="mr-3 text-purple-600 dark:text-purple-400" size={20} />
                                <HighlightedText>Support & Help</HighlightedText>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FounderDashboard;