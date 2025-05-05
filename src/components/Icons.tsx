
import React from 'react';

interface IconProps {
  name: string;
  className?: string;
}

export const Icon: React.FC<IconProps> = ({ name, className = "" }) => {
  return (
    <img 
      src="/attached_assets/icons.png" 
      alt={`${name} icon`} 
      className={`w-6 h-6 object-contain ${className}`}
    />
  );
};
