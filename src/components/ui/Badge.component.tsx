import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'dangerSoft' | 'info' | 'outline';
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({ children, variant = 'default', className = '' }) => {
  const variants: Record<string, string> = {
    default: "bg-gray-100 text-gray-600",
    success: "bg-green-100 text-green-700",
    warning: "bg-yellow-400 text-white shadow-sm",
    danger: "bg-red-500 text-white shadow-red-200 shadow-sm",
    dangerSoft: "bg-red-50 text-red-600 border border-red-100",
    info: "bg-blue-50 text-blue-600 border border-blue-100",
    outline: "bg-white border border-gray-200 text-gray-600"
  };

  return (
    <span className={`px-2 py-1 rounded-md text-[10px] uppercase font-bold tracking-wide ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;