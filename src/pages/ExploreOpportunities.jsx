import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, SlidersHorizontal, MapPin, Building2, DollarSign, Lightbulb, Clock, UserCheck, ShieldCheck, Zap, Globe, BriefcaseBusiness, Crown, Rocket, X, TrendingUp } from 'lucide-react'; 

// --- IMPORT ALL LOCAL IMAGES HERE ---
// Ensure these paths match where you placed your images EXACTLY.
// Note the 'startup' and 'investors' folders directly under 'assets'.

// Investors
import janeKapoor from '../assets/investors/i41.jpg'; // Adjust filename if different (e.g., jane_kapoor.jpeg)
import rajMehta from '../assets/investors/i31.jpg';
import evaThomas from '../assets/investors/i40.jpg';
import amitSingh from '../assets/investors/i28.jpg';
import priyaSharma from '../assets/investors/i39.jpg';
import vikramBose from '../assets/investors/i36.jpg';
import nishaReddy from '../assets/investors/i38.jpg';
import sanjayGupta from '../assets/investors/i27.jpg';
import kiranRao from '../assets/investors/i37.jpg';
import ananyaDas from '../assets/investors/i34.jpg';
import rahulPatel from '../assets/investors/i23.jpg';
import deepaVerma from '../assets/investors/i33.jpg';
import alokJain from '../assets/investors/i22.jpg';
import swatiMurthy from '../assets/investors/i32.jpg';
import gautamKumar from '../assets/investors/i29.jpg';
import rituSingh from '../assets/investors/i30.jpg';
import arjunShah from '../assets/investors/i21.jpg';
import meenaDevi from '../assets/investors/i25.jpg';

// Startups
import farmlinkStartup from '../assets/startup/i20.jpg'; // Adjust filename if different
import skillnestStartup from '../assets/startup/i1.jpg';
import urbancrateStartup from '../assets/startup/i4.jpg';
import medisureStartup from '../assets/startup/i3.jpg';
import finflowStartup from '../assets/startup/i7.jpg';
import greenwaveStartup from '../assets/startup/i6.jpg';
import aiGenixStartup from '../assets/startup/i10.jpg';
import securenetStartup from '../assets/startup/i8.jpg';
import eduverseStartup from '../assets/startup/i12.jpg';
import homeharvestStartup from '../assets/startup/i11.jpg';
import autologicStartup from '../assets/startup/i9.jpg';
import biocureStartup from '../assets/startup/i14.jpg';
import dataflowStartup from '../assets/startup/i13.jpg';
import healthbridgeStartup from '../assets/startup/i16.jpg';
import spaceforgeStartup from '../assets/startup/i19.jpg';
import gameonStartup from '../assets/startup/i18.jpg';
import workflowxStartup from '../assets/startup/i17.jpg';
import smarthomeStartup from '../assets/startup/i15.jpg';


// --- DUMMY DATA WITH LOCAL IMAGE IMPORTS ---
const initialInvestors = [
  { id: 1, name: 'Jane Kapoor', focus: 'FinTech, AI, SaaS', location: 'Mumbai', stage: 'Seed, Series A', active: true, bio: 'Seasoned investor with a strong portfolio in disruptive tech. Passionate about early-stage innovation.', imageUrl: janeKapoor },
  { id: 2, name: 'Raj Mehta', focus: 'HealthTech, SaaS, Deep Tech', location: 'Bengaluru', stage: 'Series A, Series B', active: true, bio: 'Focus on scaling health-tech solutions and B2B SaaS platforms. Looking for sustainable growth.', imageUrl: rajMehta },
  { id: 3, name: 'Eva Thomas', focus: 'EdTech, Green Energy, Impact', location: 'Delhi', stage: 'Series B, Growth', active: false, bio: 'Committed to impact investing in education and renewable energy. Supports long-term visionaries.', imageUrl: evaThomas },
  { id: 4, name: 'Amit Singh', focus: 'Deep Tech, AI, Robotics', location: 'Pune', stage: 'Seed, Pre-Seed', active: true, bio: 'Early-stage evangelist for AI and robotics. Believes in foundational technological breakthroughs.', imageUrl: amitSingh },
  { id: 5, name: 'Priya Sharma', focus: 'Consumer Goods, D2C, Retail', location: 'Hyderabad', stage: 'Series A, Growth', active: true, bio: 'Experienced in scaling consumer brands and D2C businesses. Provides strategic guidance.', imageUrl: priyaSharma },
  { id: 6, name: 'Vikram Bose', focus: 'Biotech, Pharma, Med Devices', location: 'Chennai', stage: 'Series B, Later Stage', active: true, bio: 'Specializes in life sciences and pharmaceutical investments. Drives innovation in healthcare.', imageUrl: vikramBose },
  { id: 7, name: 'Nisha Reddy', focus: 'FinTech, Web3, Blockchain', location: 'Bengaluru', stage: 'Seed, Pre-Seed', active: false, bio: 'Enthusiastic about the future of finance and decentralized technologies. Active in the Web3 space.', imageUrl: nishaReddy },
  { id: 8, name: 'Sanjay Gupta', focus: 'Logistics, Supply Chain, Mobility', location: 'Mumbai', stage: 'Series A, Seed', active: true, bio: 'Investing in solutions that optimize supply chains and urban mobility. Operational expertise.', imageUrl: sanjayGupta },
  { id: 9, name: 'Kiran Rao', focus: 'Cybersecurity, Cloud, Enterprise SaaS', location: 'Delhi', stage: 'Series B, Growth', active: true, bio: 'Deep expertise in cybersecurity and secure cloud solutions. Advises on market penetration.', imageUrl: kiranRao },
  { id: 10, name: 'Ananya Das', focus: 'CleanTech, Renewables, ESG', location: 'Kolkata', stage: 'Seed, Series A', active: true, bio: 'Championing sustainable technologies and environmentally friendly initiatives.', imageUrl: ananyaDas },
  { id: 11, name: 'Rahul Patel', focus: 'AI, Robotics, Manufacturing', location: 'Ahmedabad', stage: 'Series A, Series B', active: true, bio: 'Focused on industrial automation and AI applications in manufacturing.', imageUrl: rahulPatel },
  { id: 12, name: 'Deepa Verma', focus: 'FoodTech, AgriTech, Sustainable Food', location: 'Jaipur', stage: 'Series B, Growth', active: false, bio: 'Passionate about transforming the food industry through technology and sustainable practices.', imageUrl: deepaVerma },
  { id: 13, name: 'Alok Jain', focus: 'SaaS, Enterprise, Cloud', location: 'Mumbai', stage: 'Seed, Series A', active: true, bio: 'Building the next generation of enterprise software. Focus on recurring revenue models.', imageUrl: alokJain },
  { id: 14, name: 'Swati Murthy', focus: 'HealthTech, Diagnostics, Digital Health', location: 'Bengaluru', stage: 'Series A, Series B', active: true, bio: 'Innovating in digital health and diagnostics. Improving patient outcomes through tech.', imageUrl: swatiMurthy },
  { id: 15, name: 'Gautam Kumar', focus: 'SpaceTech, Defence, Frontier Tech', location: 'Delhi', stage: 'Series B, Growth', active: true, bio: 'Venturing into space technology and defence innovations. Future-focused investments.', imageUrl: gautamKumar },
  { id: 16, name: 'Ritu Singh', focus: 'Gaming, Entertainment, Creator Economy', location: 'Pune', stage: 'Seed, Pre-Seed', active: false, bio: 'Investing in the evolving gaming landscape and supporting content creators.', imageUrl: rituSingh },
  { id: 17, name: 'Arjun Shah', focus: 'EdTech, Future of Work, HR Tech', location: 'Hyderabad', stage: 'Series A, Series B', active: true, bio: 'Shaping the future of education and work with transformative technologies.', imageUrl: arjunShah },
  { id: 18, name: 'Meena Devi', focus: 'Consumer Electronics, Hardware, IoT', location: 'Chennai', stage: 'Series B, Growth', active: true, bio: 'Bringing cutting-edge consumer electronics and IoT devices to market.', imageUrl: meenaDevi },
];

const initialStartups = [
  { id: 101, name: 'FarmLink', industry: 'AgriTech', fundingGoal: '$500K', location: 'Mumbai', stage: 'Seed', funded: false, tagline: 'Connecting farmers directly to consumers for fresh produce.', imageUrl: farmlinkStartup },
  { id: 102, name: 'SkillNest', industry: 'EdTech', fundingGoal: '$1M', location: 'Delhi', stage: 'Series A', funded: true, tagline: 'Personalized upskilling platform for the modern workforce.', imageUrl: skillnestStartup },
  { id: 103, name: 'UrbanCrate', industry: 'Logistics', fundingGoal: '$2M', location: 'Bengaluru', stage: 'Series B', funded: false, tagline: 'Sustainable last-mile delivery solutions for urban areas.', imageUrl: urbancrateStartup },
  { id: 104, name: 'MediSure', industry: 'HealthTech', fundingGoal: '$750K', location: 'Pune', stage: 'Seed', funded: true, tagline: 'AI-powered diagnostic tools for early disease detection.', imageUrl: medisureStartup },
  { id: 105, name: 'FinFlow', industry: 'FinTech', fundingGoal: '$1.5M', location: 'Hyderabad', stage: 'Series A', funded: false, tagline: 'Simplifying personal finance with smart budgeting and investment advice.', imageUrl: finflowStartup },
  { id: 106, name: 'GreenWave', industry: 'CleanTech', fundingGoal: '$3M', location: 'Chennai', stage: 'Series B', funded: true, tagline: 'Innovative solar panel technology for residential and commercial use.', imageUrl: greenwaveStartup },
  { id: 107, name: 'AI Genix', industry: 'AI', fundingGoal: '$600K', location: 'Bengaluru', stage: 'Seed', funded: false, tagline: 'Custom AI model development for various industries.', imageUrl: aiGenixStartup },
  { id: 108, name: 'SecureNet', industry: 'Cybersecurity', fundingGoal: '$1.2M', location: 'Mumbai', stage: 'Series A', funded: true, tagline: 'Next-gen threat intelligence and protection for enterprises.', imageUrl: securenetStartup },
  { id: 109, name: 'EduVerse', industry: 'EdTech', fundingGoal: '$2.5M', location: 'Delhi', stage: 'Series B', funded: false, tagline: 'Immersive VR learning experiences for K-12 students.', imageUrl: eduverseStartup },
  { id: 110, name: 'HomeHarvest', industry: 'AgriTech', fundingGoal: '$400K', location: 'Kolkata', stage: 'Seed', funded: true, tagline: 'DIY smart farming kits for urban dwellers.', imageUrl: homeharvestStartup },
  { id: 111, name: 'AutoLogic', industry: 'Logistics', fundingGoal: '$1.8M', location: 'Ahmedabad', stage: 'Series A', funded: false, tagline: 'Automated warehouse management system for e-commerce.', imageUrl: autologicStartup },
  { id: 112, name: 'BioCure', industry: 'Biotech', fundingGoal: '$4M', location: 'Jaipur', stage: 'Series B', funded: true, tagline: 'Biotechnology solutions for sustainable waste management.', imageUrl: biocureStartup },
  { id: 113, name: 'DataFlow', industry: 'SaaS', fundingGoal: '$900K', location: 'Mumbai', stage: 'Seed', funded: false, tagline: 'No-code platform for data pipeline automation.', imageUrl: dataflowStartup },
  { id: 114, name: 'HealthBridge', industry: 'HealthTech', fundingGoal: '$2.1M', location: 'Bengaluru', stage: 'Series A', funded: true, tagline: 'Telemedicine platform connecting patients with specialists instantly.', imageUrl: healthbridgeStartup },
  { id: 115, name: 'SpaceForge', industry: 'SpaceTech', fundingGoal: '$5M', location: 'Delhi', stage: 'Series B', funded: false, tagline: 'Developing reusable launch vehicle technology.', imageUrl: spaceforgeStartup },
  { id: 116, name: 'GameOn', industry: 'Gaming', fundingGoal: '$700K', location: 'Pune', stage: 'Seed', funded: true, tagline: 'Cross-platform casual gaming studio with social features.', imageUrl: gameonStartup },
  { id: 117, name: 'WorkFlowX', industry: 'Future of Work', fundingGoal: '$1.3M', location: 'Hyderabad', stage: 'Series A', funded: false, tagline: 'AI-driven productivity suite for remote teams.', imageUrl: workflowxStartup },
  { id: 118, name: 'SmartHome Solutions', industry: 'Consumer Electronics', fundingGoal: '$2.8M', location: 'Chennai', stage: 'Series B', funded: true, tagline: 'Integrated smart home ecosystem for enhanced living.', imageUrl: smarthomeStartup },
];

const ExploreOpportunities = () => {
  const [activeTab, setActiveTab] = useState('startup');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilterPopup, setShowFilterPopup] = useState(false);

  // Filter states
  const [filterLocation, setFilterLocation] = useState('');
  const [filterIndustry, setFilterIndustry] = useState('');
  const [filterStage, setFilterStage] = useState('');
  const [onlyActiveInvestors, setOnlyActiveInvestors] = useState(false);
  const [onlyFundedStartups, setOnlyFundedStartups] = useState(false);

  // Derive unique filter options from dummy data
  const uniqueLocations = useMemo(() => {
    const locations = new Set();
    initialInvestors.forEach(inv => locations.add(inv.location));
    initialStartups.forEach(s => locations.add(s.location));
    return ['', ...Array.from(locations).sort()];
  }, []);

  const uniqueIndustries = useMemo(() => {
    const industries = new Set();
    initialInvestors.forEach(inv => inv.focus.split(',').map(f => f.trim()).forEach(ind => industries.add(ind)));
    initialStartups.forEach(s => industries.add(s.industry));
    return ['', ...Array.from(industries).sort()];
  }, []);

  const uniqueStages = useMemo(() => {
    const stages = new Set();
    initialInvestors.forEach(inv => inv.stage.split(',').map(s => s.trim()).forEach(st => stages.add(st)));
    initialStartups.forEach(s => stages.add(s.stage));
    return ['', ...Array.from(stages).sort((a, b) => {
      const order = { 'Pre-Seed': 0, 'Seed': 1, 'Series A': 2, 'Series B': 3, 'Growth': 4, 'Later Stage': 5 };
      return (order[a] ?? 99) - (order[b] ?? 99);
    })];
  }, []);

  // Memoized filtered lists to avoid re-calculating on every render
  const filteredInvestors = useMemo(() => {
    return initialInvestors.filter(investor => {
      const text = `${investor.name} ${investor.focus} ${investor.location} ${investor.stage} ${investor.bio}`.toLowerCase();
      const matchesQuery = text.includes(searchQuery.toLowerCase());
      const matchesLocation = !filterLocation || investor.location === filterLocation;
      const matchesIndustry = !filterIndustry || investor.focus.toLowerCase().includes(filterIndustry.toLowerCase());
      const matchesStage = !filterStage || investor.stage.toLowerCase().includes(filterStage.toLowerCase());
      const matchesActive = !onlyActiveInvestors || investor.active;

      return matchesQuery && matchesLocation && matchesIndustry && matchesStage && matchesActive;
    });
  }, [searchQuery, filterLocation, filterIndustry, filterStage, onlyActiveInvestors]);

  const filteredStartups = useMemo(() => {
    return initialStartups.filter(startup => {
      const text = `${startup.name} ${startup.industry} ${startup.fundingGoal} ${startup.location} ${startup.stage} ${startup.tagline}`.toLowerCase();
      const matchesQuery = text.includes(searchQuery.toLowerCase());
      const matchesLocation = !filterLocation || startup.location === filterLocation;
      const matchesIndustry = !filterIndustry || startup.industry === filterIndustry;
      const matchesStage = !filterStage || startup.stage === filterStage;
      const matchesFunded = !onlyFundedStartups || startup.funded;

      return matchesQuery && matchesLocation && matchesIndustry && matchesStage && matchesFunded;
    });
  }, [searchQuery, filterLocation, filterIndustry, filterStage, onlyFundedStartups]);

  const handleSearch = () => {
    setShowFilterPopup(false);
  };

  const handleShowAll = () => {
    setSearchQuery('');
    setFilterLocation('');
    setFilterIndustry('');
    setFilterStage('');
    setOnlyActiveInvestors(false);
    setOnlyFundedStartups(false);
    setShowFilterPopup(false);
  };

  const handleFilterToggle = () => {
    setShowFilterPopup(prev => !prev);
  };

  const applyFilters = () => {
    setShowFilterPopup(false);
  };

  return (
    <div className={`min-h-screen bg-theme-bg text-theme-text py-8 md:py-12 px-4 sm:px-6 lg:px-8 font-sans relative`}>
        {/* Background blobs - Using theme variables */}
        <div className="absolute inset-0 z-0">
            <div className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-theme-blob-1 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
            <div className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-theme-blob-2 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/3 h-1/3 bg-theme-blob-3 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
        </div>

      {/* Header and tools section */}
      <div className="max-w-7xl mx-auto mb-12 relative z-10">
        <h1 className="text-4xl md:text-6xl font-extrabold  bg-clip-text bg-gradient-to-r from-theme-gradient-text-start to-theme-gradient-text-end text-center mb-4 leading-tight drop-shadow-md">
          Explore Your Next Partnership
        </h1>
        <p className={`text-xl md:text-2xl text-theme-text-secondary text-center mb-8 max-w-3xl mx-auto`}>
          Discover a curated list of innovative startups and impactful investors.
        </p>

        <div className={`flex flex-col md:flex-row items-center justify-between gap-6 mb-10 p-4 rounded-xl shadow-2xl bg-theme-card-bg border border-theme-border`}>
          {/* Search Box */}
          <div className="relative flex-grow w-full md:w-auto group">
            <input
              type="text"
              className={`w-full pl-12 pr-4 py-3 bg-theme-input-bg text-theme-text rounded-xl border-2 border-theme-input-border focus:outline-none focus:border-theme-input-border-hover focus:ring-3 focus:ring-theme-link/50 transition-all duration-300 placeholder-theme-input-placeholder shadow-inner`}
              placeholder="Search by name, industry, location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => { if (e.key === 'Enter') handleSearch(); }}
            />
            <Search className={`absolute left-4 top-1/2 transform -translate-y-1/2 text-theme-text-secondary w-6 h-6 group-focus-within:text-theme-link transition-colors duration-200`} />
            <button
              className={`absolute right-2 top-1/2 transform -translate-y-1/2 px-5 py-1.5 rounded-lg bg-theme-button-primary-bg text-theme-button-primary-text hover:bg-theme-button-primary-hover transition duration-200 font-semibold shadow-lg focus:outline-none focus:ring-2 focus:ring-theme-link/50`}
              onClick={handleSearch}
            >
              Search
            </button>
          </div>

          {/* Buttons Row (Show All & Filter) */}
          <div className="flex items-center gap-4 w-full md:w-auto justify-end">
            <button
              className={`px-6 py-3 bg-theme-button-secondary-bg text-theme-button-secondary-text rounded-xl hover:bg-theme-button-secondary-hover transition duration-200 shadow-lg flex items-center gap-2 font-semibold border border-theme-border hover:border-theme-input-border-hover`}
              onClick={handleShowAll}
            >
              <Globe className={`w-5 h-5 text-theme-text-secondary`} /> Show All
            </button>

            {/* Filter Toggle Button */}
            <button
              className={`px-6 py-3 bg-theme-button-primary-bg text-theme-button-primary-text rounded-xl hover:bg-theme-button-primary-hover transition duration-200 shadow-lg flex items-center gap-2 font-semibold focus:outline-none focus:ring-2 focus:ring-theme-link/50`}
              id="filterToggleBtn"
              onClick={handleFilterToggle}
              aria-expanded={showFilterPopup}
            >
              <SlidersHorizontal className="w-5 h-5" />
              Filter
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto relative z-10">
        {/* Toggle Buttons for Investor/Startup */}
        <div className={`flex justify-center mb-10 bg-theme-card-bg rounded-full p-2 shadow-xl border border-theme-border`}>
          <button
            className={`flex-1 px-8 py-4 rounded-full text-xl font-bold transition-all duration-300 ease-in-out flex items-center justify-center gap-3
              ${activeTab === 'startup' ? `bg-theme-button-primary-bg text-theme-button-primary-text shadow-xl transform scale-105` : `bg-transparent text-theme-text hover:bg-theme-button-secondary-hover hover:text-theme-link`}
            `}
            onClick={() => setActiveTab('startup')}
          >
            <Rocket className="w-6 h-6" /> Startups
          </button>
          <button
            className={`flex-1 px-8 py-4 rounded-full text-xl font-bold transition-all duration-300 ease-in-out flex items-center justify-center gap-3
              ${activeTab === 'investor' ? `bg-theme-button-primary-bg text-theme-button-primary-text shadow-xl transform scale-105` : `bg-transparent text-theme-text hover:bg-theme-button-secondary-hover hover:text-theme-link`}
            `}
            onClick={() => setActiveTab('investor')}
          >
            <Crown className="w-6 h-6" /> Investors
          </button>
        </div>

        {/* Dynamic Card List based on activeTab */}
        {activeTab === 'investor' && (
          <div id="investorList" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredInvestors.length > 0 ? (
              filteredInvestors.map((investor) => (
                <div className={`
                  bg-theme-card-bg rounded-2xl shadow-xl p-7 flex flex-col items-center text-center transition-all duration-300
                  hover:shadow-2xl hover:-translate-y-2 hover:bg-theme-card-hover-bg
                  border border-theme-border hover:border-theme-link relative overflow-hidden
                `} key={investor.id}>
                  {/* Background gradient overlay - Using theme variables */}
                  <div className={`absolute inset-0 opacity-10 blur-xl bg-gradient-to-br from-theme-blob-1 to-theme-blob-2`}></div>

                  {/* Profile Picture for Investor */}
                  <img
                    src={investor.imageUrl}
                    alt={investor.name}
                    className={`relative w-24 h-24 rounded-full object-cover mb-5
                      ring-4 ring-offset-4 ring-theme-link/50 ring-offset-theme-card-bg
                      transform transition-transform duration-300 hover:scale-110 cursor-pointer
                    `}
                    // Add a fallback for image load errors if loremflickr fails
                    onError={(e) => { e.target.onerror = null; e.target.src = `https://via.placeholder.com/150/CCCCCC/808080?text=${investor.name.split(' ')[0][0]}${investor.name.split(' ')[1][0]}`; }}
                  />
                  
                  <h3 className={`text-2xl font-bold text-theme-heading-primary mb-2 tracking-wide`}>{investor.name}</h3>
                  <p className={`text-theme-text-secondary text-base mb-3 max-h-16 overflow-hidden text-ellipsis line-clamp-2`}>{investor.bio}</p>

                  <div className="flex flex-col gap-2 text-sm text-theme-text-secondary mb-5 w-full">
                    <p className="flex items-center justify-center"><Lightbulb className="inline-block w-4 h-4 mr-2 text-yellow-500" /> <span className="font-semibold text-theme-text">Focus:</span> {investor.focus}</p>
                    <p className="flex items-center justify-center"><MapPin className="inline-block w-4 h-4 mr-2 text-red-500" /> <span className="font-semibold text-theme-text">Location:</span> {investor.location}</p>
                    <p className="flex items-center justify-center"><Clock className="inline-block w-4 h-4 mr-2 text-green-500" /> <span className="font-semibold text-theme-text">Stage:</span> {investor.stage}</p>
                  </div>

                  <Link to={`/profile/${investor.id}`} className={`mt-auto px-8 py-3 bg-theme-button-primary-bg text-theme-button-primary-text rounded-full hover:bg-theme-button-primary-hover transition duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2`}>
                    <BriefcaseBusiness className="w-5 h-5" /> View Profile
                  </Link>
                </div>
              ))
            ) : (
              <div className={`col-span-full text-center py-20 bg-theme-card-bg rounded-2xl shadow-xl border border-theme-border`}>
                <ShieldCheck className="w-16 h-16 mx-auto mb-6 text-theme-text-secondary opacity-60" />
                <p className={`text-xl md:text-2xl text-theme-text-secondary font-semibold`}>
                  No investors found matching your refined search.
                </p>
                <p className={`text-md text-theme-text-secondary mt-2`}>Try broadening your filters or search query.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'startup' && (
          <div id="startupList" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredStartups.length > 0 ? (
              filteredStartups.map((startup) => (
                <div className={`
                  bg-theme-card-bg rounded-2xl shadow-xl p-7 flex flex-col items-center text-center transition-all duration-300
                  hover:shadow-2xl hover:-translate-y-2 hover:bg-theme-card-hover-bg
                  border border-theme-border hover:border-theme-link relative overflow-hidden
                `} key={startup.id}>
                  {/* Background gradient overlay - Using theme variables */}
                  <div className={`absolute inset-0 opacity-10 blur-xl bg-gradient-to-br from-theme-blob-3 to-theme-blob-1`}></div>

                  {/* Profile Picture for Startup */}
                  <img
                    src={startup.imageUrl}
                    alt={startup.name}
                    className={`relative w-24 h-24 rounded-full object-cover mb-5
                      ring-4 ring-offset-4 ring-theme-link/50 ring-offset-theme-card-bg
                      transform transition-transform duration-300 hover:scale-110 cursor-pointer
                    `}
                    // Add a fallback for image load errors if loremflickr fails
                    onError={(e) => { e.target.onerror = null; e.target.src = `https://via.placeholder.com/150/CCCCCC/808080?text=${startup.name.split(' ')[0][0]}${startup.name.split(' ')[1] ? startup.name.split(' ')[1][0] : ''}`; }}
                  />
                  
                  <h3 className={`text-2xl font-bold text-theme-heading-primary mb-2 tracking-wide`}>{startup.name}</h3>
                  <p className={`text-theme-text-secondary text-base mb-3 max-h-16 overflow-hidden text-ellipsis line-clamp-2`}>{startup.tagline}</p>

                  <div className="flex flex-col gap-2 text-sm text-theme-text-secondary mb-5 w-full">
                    <p className="flex items-center justify-center"><Building2 className="inline-block w-4 h-4 mr-2 text-indigo-500" /> <span className="font-semibold text-theme-text">Industry:</span> {startup.industry}</p>
                    <p className="flex items-center justify-center"><DollarSign className="inline-block w-4 h-4 mr-2 text-yellow-500" /> <span className="font-semibold text-theme-text">Funding Goal:</span> {startup.fundingGoal}</p>
                    <p className="flex items-center justify-center"><MapPin className="inline-block w-4 h-4 mr-2 text-red-500" /> <span className="font-semibold text-theme-text">Location:</span> {startup.location}</p>
                  </div>
                  
                  <Link to={`/startups/${startup.id}`} className={`mt-auto px-8 py-3 bg-theme-button-primary-bg text-theme-button-primary-text rounded-full hover:bg-theme-button-primary-hover transition duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2`}>
                    <BriefcaseBusiness className="w-5 h-5" /> View Profile
                  </Link>
                </div>
              ))
            ) : (
              <div className={`col-span-full text-center py-20 bg-theme-card-bg rounded-2xl shadow-xl border border-theme-border`}>
                <ShieldCheck className="w-16 h-16 mx-auto mb-6 text-theme-text-secondary opacity-60" />
                <p className={`text-xl md:text-2xl text-theme-text-secondary font-semibold`}>
                  No startups found matching your refined search.
                </p>
                <p className={`text-md text-theme-text-secondary mt-2`}>Try broadening your filters or search query.</p>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Filter Popup as an Overlay Modal */}
      {showFilterPopup && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className={`relative bg-theme-card-bg rounded-2xl shadow-2xl p-8 w-full max-w-md animate-scale-in border border-theme-border`}>
            <button
              onClick={() => setShowFilterPopup(false)}
              className="absolute top-4 right-4 text-theme-text-secondary hover:text-theme-text transition-colors z-10"
              aria-label="Close filters"
            >
              <X size={28} />
            </button>
            <h3 className={`text-2xl font-bold text-theme-heading-primary border-b border-theme-border pb-3 mb-5`}>Apply Filters</h3>

            <div className="space-y-5"> {/* Added space-y for consistent spacing */}
              {/* Location Filter */}
              <div>
                <label htmlFor="filter-location" className={`block text-theme-text-secondary text-sm font-medium mb-2 flex items-center`}>
                  <MapPin className="inline-block w-4 h-4 mr-2 text-blue-500" /> Location
                </label>
                <select
                  id="filter-location"
                  className={`w-full p-3 bg-theme-input-bg text-theme-text rounded-lg border border-theme-input-border focus:outline-none focus:ring-2 focus:ring-theme-link/50 appearance-none bg-no-repeat bg-[length:1.5em_1.5em] bg-[right_0.75rem_center] bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22%236b7280%22%3E%3Cpath%20fill-rule%3D%22evenodd%22%20d%3D%22M5.293%207.293a1%201%200%20011.414%200L10%2010.586l3.293-3.293a1%201%200%20111.414%201.414l-4%204a1%201%200%2001-1.414%200l-4-4a1%201%200%20010-1.414z%22%20clip-rule%3D%22evenodd%22%2F%3E%3C%2Fsvg%3E')]`}
                  value={filterLocation}
                  onChange={(e) => setFilterLocation(e.target.value)}
                >
                  {uniqueLocations.map(loc => (
                    <option key={loc} value={loc}>{loc === '' ? 'All Locations' : loc}</option>
                  ))}
                </select>
              </div>

              {/* Industry Filter */}
              <div>
                <label htmlFor="filter-industry" className={`block text-theme-text-secondary text-sm font-medium mb-2 flex items-center`}>
                  <Building2 className="inline-block w-4 h-4 mr-2 text-purple-500" /> Industry
                </label>
                <select
                  id="filter-industry"
                  className={`w-full p-3 bg-theme-input-bg text-theme-text rounded-lg border border-theme-input-border focus:outline-none focus:ring-2 focus:ring-theme-link/50 appearance-none bg-no-repeat bg-[length:1.5em_1.5em] bg-[right_0.75rem_center] bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22%236b7280%22%3E%3Cpath%20fill-rule%3D%22evenodd%22%20d%3D%22M5.293%207.293a1%201%200%20011.414%200L10%2010.586l3.293-3.293a1%201%200%20111.414%201.414l-4%204a1%201%200%2001-1.414%200l-4-4a1%201%200%20010-1.414z%22%20clip-rule%3D%22evenodd%22%2F%3E%3C%2Fsvg%3E')]`}
                  value={filterIndustry}
                  onChange={(e) => setFilterIndustry(e.target.value)}
                >
                  {uniqueIndustries.map(ind => (
                    <option key={ind} value={ind}>{ind === '' ? 'All Industries' : ind}</option>
                  ))}
                </select>
              </div>

              {/* Stage Filter */}
              <div>
                <label htmlFor="filter-stage" className={`block text-theme-text-secondary text-sm font-medium mb-2 flex items-center`}>
                  <TrendingUp className="inline-block w-4 h-4 mr-2 text-green-500" /> Stage
                </label>
                <select
                  id="filter-stage"
                  className={`w-full p-3 bg-theme-input-bg text-theme-text rounded-lg border border-theme-input-border focus:outline-none focus:ring-2 focus:ring-theme-link/50 appearance-none bg-no-repeat bg-[length:1.5em_1.5em] bg-[right_0.75rem_center] bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22%236b7280%22%3E%3Cpath%20fill-rule%3D%22evenodd%22%20d%3D%22M5.293%207.293a1%201%200%20011.414%200L10%2010.586l3.293-3.293a1%201%200%20111.414%201.414l-4%204a1%201%200%2001-1.414%200l-4-4a1%201%200%20010-1.414z%22%20clip-rule%3D%22evenodd%22%2F%3E%3C%2Fsvg%3E')]`}
                  value={filterStage}
                  onChange={(e) => setFilterStage(e.target.value)}
                >
                  {uniqueStages.map(stage => (
                    <option key={stage} value={stage}>{stage === '' ? 'All Stages' : stage}</option>
                  ))}
                </select>
              </div>

              {/* Checkboxes based on active tab */}
              {activeTab === 'investor' && (
                <div>
                  <label className={`flex items-center text-theme-text-secondary text-sm font-medium cursor-pointer`}>
                    <input
                      type="checkbox"
                      className={`accent-theme-link h-4 w-4 rounded-md border-theme-input-border focus:ring-theme-link focus:ring-offset-2 focus:ring-offset-theme-card-bg`}
                      checked={onlyActiveInvestors}
                      onChange={(e) => setOnlyActiveInvestors(e.target.checked)}
                    />
                    <UserCheck className="inline-block w-4 h-4 ml-3 mr-2 text-blue-500" /> Only Active Investors
                  </label>
                </div>
              )}

              {activeTab === 'startup' && (
                <div>
                  <label className={`flex items-center text-theme-text-secondary text-sm font-medium cursor-pointer`}>
                    <input
                      type="checkbox"
                      className={`accent-theme-link h-4 w-4 rounded-md border-theme-input-border focus:ring-theme-link focus:ring-offset-2 focus:ring-offset-theme-card-bg`}
                      checked={onlyFundedStartups}
                      onChange={(e) => setOnlyFundedStartups(e.target.checked)}
                    />
                    <DollarSign className="inline-block w-4 h-4 ml-3 mr-2 text-green-500" /> Only Funded Startups
                  </label>
                </div>
              )}

              {/* Apply Filters Button */}
              <button
                className={`w-full py-3 bg-theme-button-primary-bg text-theme-button-primary-text rounded-lg hover:bg-theme-button-primary-hover transition duration-200 font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-theme-link/50 flex items-center justify-center gap-2`}
                onClick={applyFilters}
              >
                <Zap className="w-5 h-5" /> Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExploreOpportunities;