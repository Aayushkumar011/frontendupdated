import React, { useState, useEffect, Fragment } from 'react';
import { ChevronRight, Users, TrendingUp, Shield, Zap, Star, Play, ArrowRight, Check } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import DashboardHomeNavbar from '../../components/DashboardHomeNavbar';
import { useTheme } from '../../context/ThemeContext'; // Import useTheme

const DashboardHome = () => {
    const { user } = useAuth();
    const { theme } = useTheme(); // Use the theme context
    const [activeTestimonial, setActiveTestimonial] = useState(0);

    const testimonials = [
        {
            name: "Sarah Chen",
            role: "CEO, TechFlow",
            content: "PitchBridge helped us secure $2M in Series A funding within 3 months. The platform's matching algorithm connected us with the perfect investors.",
            avatar: "SC",
            raised: "$2M"
        },
        {
            name: "Michael Rodriguez",
            role: "Managing Partner, Innovation Ventures",
            content: "I've discovered and invested in 8 promising startups through PitchBridge. The quality of founders and their pitches is exceptional.",
            avatar: "MR",
            deals: "8 investments"
        },
        {
            name: "Lisa Wang",
            role: "Founder, EcoSmart",
            content: "The pitch builder tools and investor feedback helped us refine our strategy. We went from idea to funded startup in 6 months.",
            avatar: "LW",
            timeline: "6 months"
        }
    ];

    const stats = [
        { number: "500+", label: "Startups Funded", icon: TrendingUp },
        { number: "$50M+", label: "Total Raised", icon: Users },
        { number: "200+", label: "Active Investors", icon: Shield },
        { number: "95%", label: "Success Rate", icon: Star }
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [testimonials.length]);

    const getDashboardPath = () => {
        if (!user) {
            return '/login';
        }
        return '/dashboard'; // Links to the actual dashboard with the sidebar
    };

    const getDashboardCTA = () => {
        if (!user) return 'Sign Up Now';
        if (user.role === 'founder') return 'Build Your Pitch';
        if (user.role === 'investor') return 'Browse Startups';
        return 'Go to Dashboard';
    };

    // Define step icon gradients dynamically based on theme
    const stepGradients = {
        0: `linear-gradient(to right, var(--color-theme-step-gradient-1-start), var(--color-theme-step-gradient-1-end))`,
        1: `linear-gradient(to right, var(--color-theme-step-gradient-2-start), var(--color-theme-step-gradient-2-end))`,
        2: `linear-gradient(to right, var(--color-theme-step-gradient-3-start), var(--color-theme-step-gradient-3-end))`,
    };

    return (
        <div className="min-h-screen bg-theme-bg text-theme-text">
            <DashboardHomeNavbar />

            {/* Main content starts with pt-16 to account for fixed navbar height */}
            <section className="relative pt-20 pb-16 overflow-hidden min-h-screen flex items-center bg-theme-hero-bg">
                {/* Background elements (converted to theme variables where possible) */}
                <div className="absolute inset-0 z-0">
                    {/* Replaced hardcoded gradient with theme variable */}
                    <div className="w-full h-full bg-theme-hero-bg"></div>
                    <div className="absolute inset-0 opacity-10">
                        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                            <defs>
                                <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                                    {/* Grid color controlled by theme */}
                                    <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5"/>
                                </pattern>
                            </defs>
                            <rect width="100" height="100" fill="url(#grid)" />
                        </svg>
                    </div>
                    {/* Animated blobs using theme colors */}
                    <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blob-dark-1 rounded-full animate-ping"></div>
                    <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blob-dark-1 rounded-full animate-ping"></div>
                    <div className="absolute top-1/3 right-1/3 w-3 h-3 bg-blob-dark-2 rounded-full animate-pulse"></div>
                    <div className="absolute bottom-1/4 left-1/3 w-1 h-1 bg-blob-dark-3 rounded-full animate-ping delay-1000"></div>
                    <div className="absolute top-1/2 right-1/4 w-2 h-2 bg-blob-dark-1 rounded-full animate-pulse delay-500"></div>
                    </div>
                {/* Larger blurred blobs using theme colors */}
                <div className="absolute top-20 left-10 w-72 h-72 bg-blob-dark-1/20 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
                <div className="absolute bottom-20 right-10 w-72 h-72 bg-blob-dark-2/20 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blob-dark-3/10 rounded-full mix-blend-multiply filter blur-2xl animate-pulse delay-700"></div>

                <div className="relative max-w-7xl mx-auto px-6 py-20">
                          <div className="grid lg:grid-cols-2 gap-12 items-center">
                            {/* Left Column - Content */}
                            <div className="space-y-8">
                              <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium">
                                <Zap className="w-4 h-4" />
                                <span>Trusted by 500+ funded startups</span>
                              </div>
                
                              <div className="space-y-6">
                                <h1 className="text-5xl lg:text-6xl font-bold text-theme-hero-heading leading-tight">
                                  Turn Your
                                  <span className="bg-gradient-to-r from-[var(--color-hero-gradient-text-start)] to-[var(--color-hero-gradient-text-end)] bg-clip-text text-transparent"> Vision</span>
                                  <br />Into Reality
                                </h1>
                
                                <p className="text-xl text-theme-hero-text leading-relaxed max-w-lg">
                                  Connect with verified investors who believe in your mission. Get the funding, mentorship, and network you need to scale your startup.
                                </p>
                              </div>
                              
                            <div className="flex flex-col sm:flex-row gap-4">
                                {/* Primary Button */}
                                <Link to={getDashboardPath()} className="bg-theme-button-primary-bg text-theme-button-primary-text px-8 py-4 rounded-full hover:bg-theme-button-primary-hover transition flex items-center justify-center space-x-2 text-lg font-semibold shadow-xl">
                                    <span>{getDashboardCTA()}</span>
                                    <ArrowRight className="w-5 h-5" />
                                </Link>
                                {/* Secondary Button */}
                                <button className="border-2 border-theme-button-secondary-border text-theme-button-secondary-text px-8 py-4 rounded-full hover:border-theme-button-secondary-text hover:bg-theme-button-secondary-hover-alt transition flex items-center justify-center space-x-2 text-lg font-semibold">
                                 <Play className="w-5 h-5" />
                                <span>Watch Demo</span>
                                </button>
                            </div>
                            <div className="flex items-center space-x-8 pt-8">
                            <div className="text-center">
                            <div className="text-2xl font-bold text-theme-stat-number">$50M+</div>
                            <div className="text-sm text-theme-stat-label">Raised</div>
                            </div>
                            <div className="text-center">
                            <div className="text-2xl font-bold text-theme-stat-number">500+</div>
                            <div className="text-sm text-theme-stat-label">Funded</div>
                            </div>
                            <div className="text-center">
                            <div className="text-2xl font-bold text-theme-stat-number">95%</div>
                            <div className="text-sm text-theme-stat-label">Success Rate</div>
                            </div>
                        </div>
                        </div>
                        <div className="relative">
                            {/* This gradient is intentionally static/dark for the visual element */}
                            <div className="relative bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-8 shadow-2xl">
                                <div className="bg-theme-card-bg rounded-xl p-6 space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-blue-500 rounded-full"></div> {/* Static gradient for icon */}
                                    <div>
                                        <div className="font-semibold text-theme-heading-primary">EcoTech Solutions</div>
                                        <div className="text-sm text-theme-text-secondary">CleanTech • Series A</div>
                                    </div>
                                    </div>
                                    <div className="text-green-600 font-semibold">$2.5M Raised</div> {/* Static green for money */}
                                </div>

                                <div className="bg-theme-input-bg rounded-lg p-4 space-y-2">
                                    <div className="flex justify-between text-sm">
                                    <span className="text-theme-text-secondary">Funding Progress</span>
                                    <span className="font-semibold text-theme-text-primary">83%</span>
                                    </div>
                                    <div className="w-full bg-theme-progress-bar-bg rounded-full h-2">
                                    {/* This gradient is intentionally static/accent for the progress bar */}
                                    <div className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full w-5/6"></div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-2">
                                    <div className="flex -space-x-2">
                                    {[1,2,3,4].map(i => (
                                        <div key={i} className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full border-2 border-theme-card-bg"></div>
                                    ))}
                                    </div>
                                    <button className="bg-theme-button-primary-bg text-theme-button-primary-text px-4 py-2 rounded-full text-sm hover:bg-theme-button-primary-hover transition">
                                    View Pitch
                                    </button>
                                </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* User Role-Based Section */}
            {user && (
                <section className="py-16 px-6 bg-theme-user-role-section-bg text-white"> {/* Adjusted for theme gradient */}
                    <div className="max-w-4xl mx-auto text-center space-y-6">
                        <h2 className="text-3xl font-bold">
                            {user.role === 'founder'
                            ? '🚀 Ready to accelerate your startup journey?'
                            : user.role === 'investor'
                            ? '💼 Discover the next unicorn startup'
                            : 'Welcome to PitchBridge!'}
                        </h2>
                       <p className="text-xl text-theme-accent-text-secondary">
                            {user.role === 'founder'
                            ? 'Access our founder toolkit: pitch builder, investor matching, and funding analytics.'
                            : user.role === 'investor'
                            ? 'Browse vetted startups, review detailed pitches, and connect with promising entrepreneurs.'
                            : 'Choose your path to get started with personalized features.'}
                        </p>
                        <Link to={getDashboardPath()} className="mt-8 inline-block bg-theme-accent-button-bg text-theme-accent-button-text px-8 py-3 rounded-full font-semibold hover:bg-blue-50 transition shadow-lg">
                            {getDashboardCTA()}
                        </Link>
                    </div>
                </section>
            )}

            {/* Enhanced How It Works */}
                  <section id="how-it-works" className="py-20 px-6 bg-theme-section-bg">
                    <div className="max-w-7xl mx-auto">
                      <div className="text-center space-y-4 mb-16">
                        <h2 className="text-4xl font-bold text-theme-heading-primary">How PitchBridge Works</h2>
                        <p className="text-xl text-theme-text-secondary max-w-2xl mx-auto">
                          From idea to funding in three simple steps. Join thousands of successful founders and investors.
                        </p>
                      </div>
            
                      <div className="grid md:grid-cols-3 gap-8">
                        {[
                          {
                            step: "01",
                            title: "Create Your Profile",
                            desc: "Build a compelling profile showcasing your startup or investment focus. Our AI helps optimize your presentation.",
                            icon: Users,
                            gradient: "bg-gradient-to-r from-[var(--color-gradient-1-start)] to-[var(--color-gradient-1-end)]"
                          },
                          {
                            step: "02",
                            title: "Smart Matching",
                            desc: "Our algorithm connects you with compatible investors or startups based on industry, stage, and preferences.",
                            icon: Zap,
                            gradient: "bg-gradient-to-r from-[var(--color-gradient-2-start)] to-[var(--color-gradient-2-end)]"
                          },
                          {
                            step: "03",
                            title: "Close the Deal",
                            desc: "Communicate securely, share documents, and finalize investments with our built-in deal room tools.",
                            icon: TrendingUp,
                            gradient: "bg-gradient-to-r from-[var(--color-gradient-3-start)] to-[var(--color-gradient-3-end)]"
                          }
                        ].map((item, idx) => (
                          <div key={idx} className="relative group">
                            <div className="bg-theme-card-bg rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                              <div className={`inline-flex p-4 rounded-2xl ${item.gradient} text-white mb-6`}>
                                <item.icon className="w-8 h-8" />
                              </div>
            
                              <div className="space-y-4">
                                <div className="flex items-center space-x-3">
                                  <span className="text-3xl font-bold text-theme-heading-step">{item.step}</span>
                                  <h3 className="text-2xl font-bold text-theme-heading-primary">{item.title}</h3>
                                </div>
                                <p className="text-theme-text-secondary leading-relaxed">{item.desc}</p>
                              </div>
                            </div>
            
                            {idx < 2 && (
                              <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                                <ChevronRight className="w-8 h-8 text-theme-step-arrow" />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </section>
            
                  {/* Stats Section */}
                  <section className="py-16 px-6 bg-theme-bg">
                    <div className="max-w-7xl mx-auto">
                      <div className="grid md:grid-cols-4 gap-8">
                        {stats.map((stat, idx) => (
                          <div key={idx} className="text-center group">
                            <div className="inline-flex p-4 rounded-2xl bg-theme-stat-icon-bg text-theme-stat-icon-color mb-4 group-hover:bg-theme-stat-icon-hover-bg transition">
                              <stat.icon className="w-8 h-8" />
                            </div>
                            <div className="text-4xl font-bold text-theme-stat-number mb-2">{stat.number}</div>
                            <div className="text-theme-stat-label">{stat.label}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </section>
            
                  {/* Enhanced Success Stories */}
                  <section id="success-stories" className="py-20 px-6 bg-theme-section-accent-bg text-white"> {/* Using theme accent bg */}
                    <div className="max-w-7xl mx-auto">
                      <div className="text-center space-y-4 mb-16">
                        <h2 className="text-4xl font-bold">Success Stories</h2>
                        <p className="text-xl text-theme-section-accent-text-secondary max-w-2xl mx-auto">
                          Real founders, real results. See how PitchBridge has transformed businesses.
                        </p>
                      </div>
            
                      <div className="relative max-w-4xl mx-auto">
                        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 md:p-12"> {/* Kept as white/10 for transparency effect */}
                          <div className="text-center space-y-6">
                            <div className="flex justify-center">
                              <div className="w-16 h-16 bg-theme-success-avatar-gradient rounded-full flex items-center justify-center text-xl font-bold">
                                {testimonials[activeTestimonial].avatar}
                              </div>
                            </div>
            
                            <blockquote className="text-2xl md:text-3xl font-light leading-relaxed">
                              "{testimonials[activeTestimonial].content}"
                            </blockquote>
            
                            <div className="space-y-2">
                              <div className="font-semibold text-lg">{testimonials[activeTestimonial].name}</div>
                              <div className="text-theme-section-accent-text-secondary">{testimonials[activeTestimonial].role}</div> {/* Using theme accent text */}
                              {testimonials[activeTestimonial].raised && (
                                <div className="inline-block bg-theme-success-raised-bg text-white px-3 py-1 rounded-full text-sm font-semibold">
                                  Raised {testimonials[activeTestimonial].raised}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
            
                        {/* Testimonial Indicators */}
                        <div className="flex justify-center space-x-2 mt-8">
                          {testimonials.map((_, idx) => (
                            <button
                              key={idx}
                              onClick={() => setActiveTestimonial(idx)}
                              className={`w-3 h-3 rounded-full transition ${
                                idx === activeTestimonial ? 'bg-white' : 'bg-white/30' // Kept white/30 for indicators as they are on a dark background
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </section>
            
                  {/* Enhanced Why Choose Section */}
                  <section className="py-20 px-6 bg-theme-bg">
                    <div className="max-w-7xl mx-auto">
                      <div className="text-center space-y-4 mb-16">
                        <h2 className="text-4xl font-bold text-theme-heading-primary">Why Choose PitchBridge?</h2>
                        <p className="text-xl text-theme-text-secondary max-w-2xl mx-auto">
                          More than a platform—we're your partner in building the future.
                        </p>
                      </div>
            
                      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                          {
                            title: "AI-Powered Matching",
                            desc: "Smart algorithms connect you with the most relevant opportunities",
                            icon: Zap,
                            benefits: ["95% match accuracy", "Save 10+ hours/week", "Quality connections"]
                          },
                          {
                            title: "Verified Network",
                            desc: "All investors and startups go through rigorous verification",
                            icon: Shield,
                            benefits: ["Background checks", "Portfolio verification", "Trusted community"]
                          },
                          {
                            title: "Deal Room Tools",
                            desc: "Secure document sharing and communication platform",
                            icon: Users,
                            benefits: ["Encrypted sharing", "Version control", "Progress tracking"]
                          },
                          {
                            title: "Expert Support",
                            desc: "Get guidance from experienced founders and investors",
                            icon: Star,
                            benefits: ["1-on-1 mentoring", "Pitch feedback", "Market insights"]
                          }
                        ].map((item, idx) => (
                          <div key={idx} className="bg-theme-card-bg-light rounded-2xl p-6 hover:bg-theme-card-hover-bg-light transition group">
                            <div className="inline-flex p-3 rounded-xl bg-theme-icon-bg text-theme-icon-color mb-4 group-hover:bg-blue-200 transition">
                              <item.icon className="w-6 h-6" />
                            </div>
            
                            <h3 className="text-xl font-bold text-theme-heading-primary mb-3">{item.title}</h3>
                            <p className="text-theme-text-secondary mb-4">{item.desc}</p>
            
                            <ul className="space-y-2">
                              {item.benefits.map((benefit, i) => (
                                <li key={i} className="flex items-center text-sm text-theme-text-secondary">
                                  <Check className="w-4 h-4 text-theme-success-color mr-2 flex-shrink-0" />
                                  {benefit}
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  </section>

             <section className="py-20 px-6 bg-theme-cta-bg text-white relative overflow-hidden"> {/* Using theme cta bg */}
        <div className="absolute inset-0 bg-black/20"></div>
        {/* Animated blobs using theme-aware colors if defined, otherwise static */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/10 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white/10 rounded-full filter blur-3xl"></div>

        <div className="relative max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-5xl font-bold leading-tight">
            Ready to Build the Future?
          </h2>
          <p className="text-2xl text-theme-cta-text-secondary max-w-2xl mx-auto leading-relaxed">
            Join 500+ successful founders and investors who've transformed their vision into reality with PitchBridge.
          </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Link to={getDashboardPath()}className="bg-theme-cta-button-primary-bg text-theme-cta-button-primary-text px-10 py-4 rounded-full font-bold text-lg hover:bg-blue-50 transition shadow-2xl">
                            {getDashboardCTA()}
                        </Link>
                        {/* Secondary Button */}
                        <button className="border-2 border-theme-cta-button-secondary-border text-theme-cta-button-secondary-text px-10 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-theme-cta-button-primary-text transition">
              Schedule a Demo
            </button>
                    </div>
                    <div className="pt-8 text-theme-cta-footer-text text-sm"> {/* Adjusted footer text */}
                        ✨ Free to get started • No credit card required • Join in 2 minutes
                    </div>
                </div>
            </section>

            {/* Footer - Keep it consistent, can be themed separately if desired */}
            {/* For now, assuming footer is consistently dark. If it needs to be light/dark themed,
                you'd add theme classes like `bg-theme-footer-bg` and `text-theme-footer-text`
                and define those in your CSS variables.
            */}
            <footer className="bg-theme-footer-bg text-theme-footer-text py-12 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-4 gap-8">
                        <div className="space-y-4">
                            <div className="flex items-center space-x-2">
                                <div className="relative group">
                                    <div className="w-8 h-8 bg-theme-logo-gradient rounded-xl shadow-lg flex items-center justify-center relative overflow-hidden">
                                        <div className="absolute inset-0 bg-white/20"></div>
                                        <div className="relative z-10 flex flex-col items-center">
                                            <div className="w-5 h-0.5 bg-white rounded-full mb-0.5 transform -rotate-12"></div>
                                            <div className="w-3 h-0.5 bg-white/80 rounded-full"></div>
                                        </div>
                                    </div>
                                </div>
                                <span className="text-xl font-bold">PitchBridge</span>
                            </div>
                            <p className="text-theme-footer-link-text">
                                Connecting visionaries with the resources they need to change the world.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4">Platform</h4>
                            <ul className="space-y-2 text-theme-footer-link-text">
                                <li><a href="#" className="hover:text-theme-footer-link-hover transition">For Founders</a></li>
                                <li><a href="#" className="hover:text-theme-footer-link-hover transition">For Investors</a></li>
                                <li><a href="#" className="hover:text-theme-footer-link-hover transition">Success Stories</a></li>
                                <li><a href="#" className="hover:text-theme-footer-link-hover transition">Pricing</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4">Resources</h4>
                            <ul className="space-y-2 text-theme-footer-link-text">
                                <li><a href="#" className="hover:text-theme-footer-link-hover transition">Blog</a></li>
                                <li><a href="#" className="hover:text-theme-footer-link-hover transition">Help Center</a></li>
                                <li><a href="#" className="hover:text-theme-link-hover transition">API Docs</a></li>
                                <li><a href="#" className="hover:text-theme-link-hover transition">Community</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4">Company</h4>
                            <ul className="space-y-2 text-theme-footer-link-text">
                                <li><a href="#" className="hover:text-theme-footer-link-hover transition">About</a></li>
                                <li><a href="#" className="hover:text-theme-footer-link-hover transition">Careers</a></li>
                                <li><a href="#" className="hover:text-theme-footer-link-hover transition">Privacy</a></li>
                                <li><a href="#" className="hover:text-theme-footer-link-hover transition">Terms</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-theme-footer-border mt-12 pt-8 text-center text-theme-footer-link-text">
                        <p>&copy; 2024 PitchBridge. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default DashboardHome;