import React from 'react';

// ExportButton Component
// Triggers the PDF export functionality
const ExportButton = () => {
  return (
    <button className="px-4 py-2 bg-brand-cyan text-white rounded">
      {/* TODO: Add export icon and hook up to backend export route */}
      Export PDF
    </button>
  );
};

export default ExportButton;
