
import React from 'react';

interface EnhancedBackgroundProps {
  variant?: 'mesh' | 'gradient' | 'particles';
  className?: string;
}

export const EnhancedBackground: React.FC<EnhancedBackgroundProps> = ({
  variant = 'mesh',
  className = '',
}) => {
  const renderBackground = () => {
    switch (variant) {
      case 'mesh':
        return (
          <div className={`fixed inset-0 mesh-gradient ${className}`}>
            {/* Animated floating orbs */}
            <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-purple-500/10 rounded-full blur-xl animate-pulse" />
            <div className="absolute top-3/4 right-1/4 w-24 h-24 bg-blue-500/10 rounded-full blur-xl animate-pulse delay-1000" />
            <div className="absolute bottom-1/4 left-1/3 w-40 h-40 bg-pink-500/10 rounded-full blur-xl animate-pulse delay-2000" />
          </div>
        );
      case 'gradient':
        return (
          <div className={`fixed inset-0 gradient-bg ${className}`} />
        );
      case 'particles':
        return (
          <div className={`fixed inset-0 bg-black ${className}`}>
            <div className="absolute inset-0 bg-grid-white opacity-20" />
          </div>
        );
      default:
        return null;
    }
  };

  return renderBackground();
};

export default EnhancedBackground;
