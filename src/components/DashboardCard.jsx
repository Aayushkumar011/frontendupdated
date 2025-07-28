import React from 'react';
// Assuming lucide-react is installed for icons (Icon component comes from there)

const DashboardCard = ({ icon: Icon, title, value, color, onClick, className = '' }) => {
  // This internal content block makes it easy to apply conditional wrappers (like a button or link)
  const CardContent = (
    <div className="flex items-center">
      <div className="mr-5 flex-shrink-0"> {/* Increased margin, flex-shrink to prevent icon shrinking */}
        {/* Slightly larger icon, subtle opacity for visual depth */}
        <Icon size={36} className="text-white opacity-80" />
      </div>
      <div>
        {/* Slightly smaller bottom margin for title, subtle opacity */}
        <p className="text-lg font-semibold mb-1 opacity-90">{title}</p>
        {/* Larger value font size for prominence */}
        <p className="text-3xl font-bold">{value}</p>
      </div>
    </div>
  );

  return (
    <div
      // Base styling for the card container
      className={`
        relative
        p-6 rounded-2xl
        shadow-lg transition-all duration-300 ease-in-out /* Smooth transitions for hover */
        transform /* Enable transform properties like translate-y */
        ${color || 'bg-blue-600'} text-white /* Use provided color or a default blue, text is white */
        ${onClick ? 'cursor-pointer hover:-translate-y-1 hover:shadow-xl' : ''} /* Conditional hover effects */
        ${className} /* Allows for additional custom classes from parent component */
      `}
      onClick={onClick} // Pass the onClick handler
      role={onClick ? "button" : undefined} // Add ARIA role for accessibility if it's clickable
      tabIndex={onClick ? 0 : undefined}   // Make clickable elements focusable by keyboard
    >
      {CardContent}
    </div>
  );
};

export default DashboardCard;