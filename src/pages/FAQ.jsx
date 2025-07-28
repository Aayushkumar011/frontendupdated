import React, { useState, useEffect } from 'react'; // Import useEffect
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronDown, MessageSquare, LifeBuoy, Zap, Sparkles } from 'lucide-react'; // Added Sparkles

// Removed direct import of Sidebar and AuthNavbar as they are provided by AuthenticatedLayout
// import Sidebar from '../components/Sidebar';
// import AuthNavbar from '../components/AuthNavbar';

const FAQ = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [openQuestionId, setOpenQuestionId] = useState(null);

  // --- Start of code copied from Settings.jsx for background animations ---
  useEffect(() => {
    const style = document.createElement('style');
    style.id = 'faq-animations'; // Changed ID to 'faq-animations'
    style.innerHTML = `
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }
      .animate-fade-in {
        animation: fadeIn 0.5s ease-out forwards;
      }

      @keyframes blob {
        0% { transform: translate(0px, 0px) scale(1); }
        33% { transform: translate(30px, -50px) scale(1.1); }
        66% { transform: translate(-20px, 20px) scale(0.9); }
        100% { transform: translate(0px, 0px) scale(1); }
      }
      .animate-blob {
        animation: blob 7s infinite cubic-bezier(0.68, -0.55, 0.27, 1.55);
      }
      .animation-delay-2000 {
        animation-delay: 2s;
      }
      .animation-delay-4000 {
        animation-delay: 4s;
      }
    `;

    if (!document.getElementById('faq-animations')) { // Check for new ID
      document.head.appendChild(style);
    }

    return () => {
      const existingStyle = document.getElementById('faq-animations'); // Use new ID for cleanup
      if (existingStyle) {
        document.head.removeChild(existingStyle);
      }
    };
  }, []);
  // --- End of code copied from Settings.jsx ---

  const faqData = [
    {
      id: 'general-1',
      category: 'General',
      question: 'What is PitchBridge?',
      answer: 'PitchBridge is a platform designed to connect innovative startups with potential investors. We streamline the fundraising process by providing tools for showcasing your startup, discovering investors, and facilitating secure communication and pitching.'
    },
    {
      id: 'general-2',
      category: 'General',
      question: 'Who can use PitchBridge?',
      answer: 'PitchBridge is primarily for two main user groups: **Founders** who are seeking capital for their startups, and **Investors** who are looking for promising investment opportunities. We also have an **Admin** role for platform management.'
    },
    {
      id: 'account-1',
      category: 'Account & Profile',
      question: 'How do I create an account?',
      answer: 'You can create an account by navigating to the "Register" page and selecting whether you are a Founder or an Investor. Follow the prompts to fill in your details and set up your profile.'
    },
    {
      id: 'account-2',
      category: 'Account & Profile',
      question: 'Can I change my role later?',
      answer: 'Currently, roles are set during registration to tailor your experience. If you need to change your primary role, please contact support for assistance.'
    },
    {
      id: 'general-3',
      category: 'General',
      question: 'Is PitchBridge available globally?',
      answer: 'Yes, PitchBridge is a global platform, and we welcome founders and investors from all regions. Our goal is to connect promising ventures with capital wherever they are.'
    },
    {
      id: 'general-4',
      category: 'General',
      question: 'How does PitchBridge ensure quality of startups/investors?',
      answer: 'We employ a review process for profiles to ensure quality and legitimacy. While we facilitate connections, we encourage users to conduct their own due diligence before engaging in any serious discussions or transactions.'
    },
    {
      id: 'account-3',
      category: 'Account & Profile',
      question: 'What information is public on my profile?',
      answer: 'For founders, your startup overview, team, and public pitch deck sections are visible to logged-in investors. For investors, your general investment focus and public bio are visible to founders. You control the privacy settings for more sensitive documents.'
    },
    {
      id: 'account-4',
      category: 'Account & Profile',
      question: 'How do I update my profile information?',
      answer: 'You can update your profile by navigating to the "My Profile" or "Settings" section once you are logged in. Remember to save any changes you make.'
    },
    {
      id: 'founder-1',
      category: 'For Founders',
      question: 'How do I list my startup?',
      answer: 'Once logged in as a Founder, go to the "My Startup" section (or similar). You\'ll find options to create a new startup profile, upload pitch decks, financial documents, and other relevant information.'
    },
    {
      id: 'founder-2',
      category: 'For Founders',
      question: 'How do I pitch to an investor?',
      answer: 'On an Investor\'s profile, you will see a "Pitch Idea" button. Clicking this will guide you through submitting your pitch deck and a brief message directly to that investor. Ensure your startup profile is complete before pitching!'
    },
    {
      id: 'founder-6',
      category: 'For Founders',
      question: 'What makes a strong startup profile?',
      answer: 'A strong profile includes a clear problem statement, a well-defined solution, a compelling team bio, realistic financial projections, a detailed market analysis, and a concise yet informative pitch deck. High-quality visuals and a compelling story also help.'
    },
    {
      id: 'founder-7',
      category: 'For Founders',
      question: 'Can I track investor interest in my startup?',
      answer: 'Yes, your founder dashboard provides analytics on profile views, pitch deck downloads, and interactions from investors. You\'ll also receive notifications when an investor shows interest or messages you.'
    },
    {
      id: 'founder-8',
      category: 'For Founders',
      question: 'Is my data secure on PitchBridge?',
      answer: 'Absolutely. We use industry-standard encryption protocols (SSL/TLS) for data transmission and store your information in secure, access-controlled databases. We are committed to protecting your sensitive information.'
    },
    {
      id: 'investor-1',
      category: 'For Investors',
      question: 'How do I find startups to invest in?',
      answer: 'Navigate to the "Explore Startups" section. You can use search filters based on industry, funding stage, region, and more to discover startups that align with your investment criteria.'
    },
    {
      id: 'investor-2',
      category: 'For Investors',
      question: 'What information do I see on a startup profile?',
      answer: 'Startup profiles typically include a detailed overview, team information, business model, market analysis, financial projections, and attached documents like pitch decks and executive summaries. The level of detail depends on what the founder has provided.'
    },
    {
      id: 'investor-6',
      category: 'For Investors',
      question: 'How can I set my investment preferences?',
      answer: 'In your investor profile settings, you can define your preferred investment criteria, such as industry focus, funding stage, geographical region, and typical deal size. This helps PitchBridge suggest relevant startups to you.'
    },
    {
      id: 'investor-7',
      category: 'For Investors',
      question: 'What is the "Due Diligence" checklist?',
      answer: 'The due diligence checklist is a tool we provide to help investors systematically evaluate startups. It includes key areas like legal, financial, market, and team assessments to guide your investment decision-making process.'
    },
    {
      id: 'investor-8',
      category: 'For Investors',
      question: 'Can I communicate directly with founders?',
      answer: 'Yes, once you express interest in a startup or a founder accepts your connection request, you can use our secure messaging system to communicate directly and schedule meetings.'
    },
    {
      id: 'platform-1',
      category: 'Platform Features',
      question: 'Does PitchBridge offer matchmaking services?',
      answer: 'While we don\'t offer traditional matchmaking, our platform utilizes smart algorithms based on your profile and preferences to recommend relevant startups to investors and potential investors to founders, facilitating organic connections.'
    },
    {
      id: 'platform-2',
      category: 'Platform Features',
      question: 'Are there any fees to use PitchBridge?',
      answer: 'Basic access for both founders and investors is free. We offer premium subscription tiers that unlock advanced features, deeper analytics, and enhanced visibility. Details are available on our pricing page.'
    },
    {
      id: 'platform-3',
      category: 'Platform Features',
      question: 'How does the pitching process work?',
      answer: 'Founders can send pitch requests directly from an investor\'s profile. Investors review these requests and can choose to accept, decline, or ask for more information. Accepted pitches often lead to direct communication and potential meetings.'
    },
    {
      id: 'technical-1',
      category: 'Technical Support',
      question: 'I forgot my password. How do I reset it?',
      answer: 'On the login page, click the "Forgot Password" link. Enter your registered email address, and we\'ll send you instructions to reset your password.'
    },
    {
      id: 'technical-2',
      category: 'Technical Support',
      question: 'I encountered a bug/error. What should I do?',
      answer: 'Please try refreshing the page or clearing your browser cache. If the issue persists, contact our technical support team via the "Contact Us" section, providing as much detail as possible (screenshots are helpful!).'
    },
    {
      id: 'security-1',
      category: 'Security & Privacy',
      question: 'How is my privacy protected on PitchBridge?',
      answer: 'Your privacy is paramount. We adhere to strict data protection policies, including GDPR and other relevant regulations. We do not share your personal data with third parties without your explicit consent. Please refer to our Privacy Policy for full details.'
    },
    {
      id: 'security-2',
      category: 'Security & Privacy',
      question: 'What measures are in place to prevent fraud?',
      answer: 'We employ a multi-layered approach including user verification, data encryption, continuous monitoring, and community reporting features. We encourage users to report any suspicious activity immediately.'
    },
    {
      id: 'founder-9',
      category: 'For Founders',
      question: 'How to Craft a Winning Pitch Deck?',
      answer: 'A winning pitch deck tells a compelling story. Focus on clarity, conciseness, and impact. Key slides include: Problem, Solution, Market Opportunity, Product/Service, Business Model, Go-to-Market Strategy, Team, Financials, Competition, and Ask. Use strong visuals and tailor it to your audience. The goal is to generate interest for a follow-up meeting.'
    },
    {
      id: 'investor-9',
      category: 'For Investors',
      question: 'Understanding Investor Due Diligence',
      answer: 'Due diligence is the process investors undertake to verify information about a potential investment. This includes reviewing financial records, legal documents, intellectual property, market analysis, team background, and customer references. It ensures the investment opportunity aligns with their risk appetite and investment thesis, and that all claims by the startup are substantiated.'
    },
    {
      id: 'early-stage-metrics-1',
      category: 'For Founders', // You can change this category if you have a more specific one like 'Metrics'
      question: 'Key Metrics for Early-Stage Startups',
      answer: 'For early-stage startups, investors look beyond just revenue. Key metrics include: Customer Acquisition Cost (CAC), Lifetime Value (LTV), Monthly Recurring Revenue (MRR) if applicable, Churn Rate, User Engagement (DAU/MAU), Burn Rate, and Runway. Demonstrating product-market fit and growth potential through these metrics is crucial.'
    }
  ];

  const filteredFaqs = faqData.filter(faq =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleQuestion = (id) => {
    setOpenQuestionId(openQuestionId === id ? null : id);
  };

  const faqsByCategory = faqData.reduce((acc, faq) => {
    if (!acc[faq.category]) {
      acc[faq.category] = [];
    }
    acc[faq.category].push(faq);
    return acc;
  }, {});

  const getCategoryIcon = (cat) => {
    switch (cat) {
      case 'General': return <Zap className="h-6 w-6 text-blue-500 dark:text-blue-400" />;
      case 'Account & Profile': return <MessageSquare className="h-6 w-6 text-purple-500 dark:text-purple-400" />;
      case 'For Founders': return <LifeBuoy className="h-6 w-6 text-green-500 dark:text-green-400" />;
      case 'For Investors': return <LifeBuoy className="h-6 w-6 text-yellow-500 dark:text-yellow-400" />;
      case 'Platform Features': return <Zap className="h-6 w-6 text-indigo-500 dark:text-indigo-400" />;
      case 'Security & Privacy': return <MessageSquare className="h-6 w-6 text-red-500 dark:text-red-400" />;
      case 'Technical Support': return <LifeBuoy className="h-6 w-6 text-red-500 dark:text-red-400" />;
      default: return <LifeBuoy className="h-6 w-6 text-gray-500 dark:text-gray-400" />;
    }
  };


  return (
    // Main container with the same background as Settings page
    <div >
      {/* Background blobs copied from Settings.jsx */}
      
      {/* Content wrapper to ensure it's above the background elements and retains original max-width */}
      <div className="relative z-10 animate-fade-in max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <Sparkles size={48} className="text-yellow-500 dark:text-yellow-400 mx-auto mb-4 drop-shadow-lg" /> {/* Added Sparkles icon */}
          <h1 className="text-5xl font-extrabold text-gray-900 dark:text-white mb-4 leading-tight">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Find quick answers to your questions about PitchBridge.
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="relative mb-12 max-w-2xl mx-auto"
        >
          <input
            type="text"
            placeholder="Search questions..."
            className="w-full px-6 py-3 pl-12 border border-gray-300 dark:border-gray-700 rounded-full bg-white dark:bg-gray-800 text-lg text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-3 focus:ring-blue-500/50 shadow-md"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 h-6 w-6" />
        </motion.div>

        {/* FAQ Sections */}
        {filteredFaqs.length > 0 ? (
          Object.keys(faqsByCategory).map((category) => {
            const categoryFaqs = faqsByCategory[category].filter(faq =>
              faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
              faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
            );

            if (categoryFaqs.length === 0) return null;

            return (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mb-10 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-xl shadow-xl border border-white/30 dark:border-gray-700/50 p-6"
              >
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                  {getCategoryIcon(category)}
                  <span className="ml-3">{category}</span>
                </h2>
                <div className="space-y-4">
                  {categoryFaqs.map((faq) => (
                    <div
                      key={faq.id}
                      className="border-b border-gray-200 dark:border-gray-700 last:border-b-0 pb-4"
                    >
                      <button
                        className="flex justify-between items-center w-full text-left py-2 focus:outline-none"
                        onClick={() => toggleQuestion(faq.id)}
                      >
                        <span className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                          {faq.question}
                        </span>
                        <motion.span
                          initial={false}
                          animate={{ rotate: openQuestionId === faq.id ? 180 : 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <ChevronDown className="h-6 w-6 text-gray-600 dark:text-gray-400" />
                        </motion.span>
                      </button>
                      <AnimatePresence>
                        {openQuestionId === faq.id && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className="overflow-hidden"
                          >
                            <p className="mt-2 text-gray-600 dark:text-gray-300 pr-8">
                              {faq.answer}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mt-20 p-10 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/30 dark:border-gray-700/50 max-w-xl mx-auto"
          >
            <h3 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
              No results found!
            </h3>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Try a different search term or browse the categories.
            </p>
          </motion.div>
        )}

        {/* This div helps push the contact section to the bottom if content is short */}
        <div className="flex-grow"></div>

        {/* Contact Support Section */}
        <motion.div
          id="contact-support-section"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16 text-center bg-blue-600/10 dark:bg-blue-900/20 rounded-xl p-8 shadow-inner border border-blue-500/30 dark:border-blue-700/50"
        >
          <h2 className="text-3xl font-bold text-blue-800 dark:text-blue-300 mb-4">
            Still need help?
          </h2>
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
            If you can't find the answer you're looking for, feel free to reach out to our support team.
          </p>
          <a
            href="#contact-support-section"
            className="inline-flex items-center px-8 py-3 bg-blue-600 text-white rounded-full font-semibold text-lg hover:bg-blue-700 transition duration-300 shadow-lg hover:shadow-xl"
          >
            <LifeBuoy className="h-6 w-6 mr-3" /> Contact Support
          </a>
        </motion.div>
      </div>
    </div>
  );
};

export default FAQ;