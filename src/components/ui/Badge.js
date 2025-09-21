import React from 'react';

/**
 * Badge Component
 * Colored badge for categorizing content
 */
function Badge({ children, color = "green" }) {
  const colorMap = {
    green: "bg-green-100 text-green-800",
    blue: "bg-blue-100 text-blue-800",
    amber: "bg-amber-100 text-amber-800",
    purple: "bg-purple-100 text-purple-800",
  };

  return (
    <span className={`text-xs px-2 py-1 rounded-full ${colorMap[color] || colorMap.green}`}>
      {children}
    </span>
  );
}

export default Badge;
