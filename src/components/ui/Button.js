import React from 'react';

/**
 * Button Component
 * Reusable button with different variants
 */
function Button({ 
  children, 
  variant = "primary", 
  size = "md", 
  disabled = false, 
  className = "", 
  onClick,
  type = "button",
  ...props 
}) {
  const baseClasses = "font-medium transition duration-200 focus:outline-none focus:ring-4 rounded-lg";
  
  const variantClasses = {
    primary: "bg-primary-600 hover:bg-primary-700 text-white focus:ring-primary-300",
    secondary: "bg-white hover:bg-brandGray-100 text-primary-700 border-2 border-primary-600 focus:ring-primary-300",
    gold: "bg-gold-600 hover:bg-gold-700 text-white focus:ring-gold-300",
    amber: "bg-amber-600 hover:bg-amber-700 text-white focus:ring-amber-300",
    outline: "bg-transparent hover:bg-brandGray-100 text-brandGray-700 border border-brandGray-300 focus:ring-brandGray-300",
  };

  const sizeClasses = {
    sm: "px-3 py-2 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
    xl: "px-8 py-4 text-lg",
  };

  const disabledClasses = disabled ? "opacity-60 cursor-not-allowed" : "";

  return (
    <button
      type={type}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabledClasses} ${className}`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
