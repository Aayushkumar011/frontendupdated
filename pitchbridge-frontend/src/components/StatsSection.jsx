// src/components/StatsSection.jsx

import React from 'react';

const StatsSection = () => {
  const stats = [
    { number: "500+", label: "Startups Funded" },
    { number: "$50M+", label: "Total Raised" },
    { number: "200+", label: "Active Investors" },
    { number: "95%", label: "Success Rate" },
  ];

  return (
    <section className="py-16 bg-color-section-bg transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6">
        {/* You might have a title here, e.g., "Our Impact" */}
        <h2 className="text-3xl font-bold text-center mb-12 text-heading-primary">Our Impact</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="flex flex-col items-center p-6 rounded-lg bg-color-card-bg shadow-lg"
            >
              <p className="text-5xl font-extrabold mb-2 text-theme-stat-number">{stat.number}</p>
              <p className="text-xl font-medium text-theme-stat-label">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;