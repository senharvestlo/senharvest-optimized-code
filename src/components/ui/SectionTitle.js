import React from 'react';

/**
 * SectionTitle Component
 * Consistent section heading with optional subtitle
 */
function SectionTitle({ title, subtitle }) {
  return (
    <div className="text-center mb-16">
      <h2 className="text-4xl font-bold text-gray-800 mb-4">{title}</h2>
      {subtitle && <p className="text-xl text-gray-600 max-w-3xl mx-auto">{subtitle}</p>}
    </div>
  );
}

export default SectionTitle;
