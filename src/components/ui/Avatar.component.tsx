import React from 'react';

interface AvatarProps {
  src: string;
  alt?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const Avatar: React.FC<AvatarProps> = ({ src, alt, size = 'md', className = '' }) => {
  const sizes: Record<string, string> = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-20 h-20"
  };

  return (
    <img 
      src={src} 
      alt={alt || 'Avatar'} 
      className={`rounded-full object-cover border border-gray-200 shadow-sm ${sizes[size]} ${className}`} 
    />
  );
};

export default Avatar;