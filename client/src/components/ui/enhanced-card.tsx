
import React from 'react';
import { cn } from '@/lib/utils';

interface EnhancedCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'modern' | 'premium' | 'floating' | 'glass';
  hover?: boolean;
  glow?: boolean;
}

export const EnhancedCard: React.FC<EnhancedCardProps> = ({
  children,
  className,
  variant = 'modern',
  hover = true,
  glow = false,
}) => {
  const baseClasses = 'relative overflow-hidden transition-all duration-300';
  
  const variantClasses = {
    modern: 'modern-card',
    premium: 'gradient-border',
    floating: 'floating-element modern-card',
    glass: 'glass-effect',
  };

  const hoverClasses = hover ? 'hover:scale-[1.02] hover:-translate-y-1' : '';
  const glowClasses = glow ? 'glow-effect' : '';

  return (
    <div
      className={cn(
        baseClasses,
        variantClasses[variant],
        hoverClasses,
        glowClasses,
        className
      )}
    >
      {children}
      {/* Subtle animated border effect */}
      <div className="absolute inset-0 rounded-inherit bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
    </div>
  );
};

export default EnhancedCard;
