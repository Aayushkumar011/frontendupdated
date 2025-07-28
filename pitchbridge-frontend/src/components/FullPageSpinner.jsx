// src/components/FullPageSpinner.jsx
import React from 'react';
import { Loader2 } from 'lucide-react'; // Make sure lucide-react is installed: npm install lucide-react

const FullPageSpinner = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-900 z-50">
      <Loader2 className="animate-spin text-blue-500" size={48} />
      <span className="sr-only">Loading...</span> {/* For accessibility */}
    </div>
  );
};

export default FullPageSpinner;