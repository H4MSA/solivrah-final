import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface EnhancedProgressCircleProps {
  progress: number; // 0-100
  size?: 'sm' | 'md' | 'lg' | 'xl';
  strokeWidth?: number;
  showPercentage?: boolean;
  animated?: boolean;
  children?: React.ReactNode;
  className?: string;
  variant?: 'default' | 'success' | 'warning' | 'premium';
}

export const EnhancedProgressCircle: React.FC<EnhancedProgressCircleProps> = ({
  progress,
  size = 'md',
  strokeWidth,
  showPercentage = false,
  animated = true,
  children,
  className,
  variant = 'default'
}) => {
  const sizeConfig = {
    sm: { diameter: 40, defaultStroke: 3 },
    md: { diameter: 60, defaultStroke: 4 },
    lg: { diameter: 80, defaultStroke: 5 },
    xl: { diameter: 120, defaultStroke: 6 }
  };

  const config = sizeConfig[size];
  const radius = (config.diameter - (strokeWidth || config.defaultStroke)) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const variantColors = {
    default: 'stroke-white/80',
    success: 'stroke-white/90',
    warning: 'stroke-white/70',
    premium: 'stroke-white'
  };

  return (
    <div 
      className={cn(
        'relative flex items-center justify-center',
        className
      )}
      style={{ width: config.diameter, height: config.diameter }}
    >
      <svg
        width={config.diameter}
        height={config.diameter}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={config.diameter / 2}
          cy={config.diameter / 2}
          r={radius}
          stroke="rgba(255, 255, 255, 0.1)"
          strokeWidth={strokeWidth || config.defaultStroke}
          fill="none"
        />
        
        {/* Progress circle */}
        <motion.circle
          cx={config.diameter / 2}
          cy={config.diameter / 2}
          r={radius}
          stroke="rgba(255, 255, 255, 0.8)"
          strokeWidth={strokeWidth || config.defaultStroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={animated ? { strokeDashoffset: circumference } : { strokeDashoffset }}
          animate={{ strokeDashoffset }}
          transition={{ duration: animated ? 1.5 : 0, ease: "easeOut" }}
          className={cn(
            'transition-all duration-300',
            variantColors[variant]
          )}
          style={{
            filter: variant === 'premium' ? 'drop-shadow(0 0 8px rgba(255, 255, 255, 0.4))' : 'none'
          }}
        />
        
        {/* Glow effect for premium variant */}
        {variant === 'premium' && (
          <motion.circle
            cx={config.diameter / 2}
            cy={config.diameter / 2}
            r={radius}
            stroke="rgba(255, 255, 255, 0.3)"
            strokeWidth={(strokeWidth || config.defaultStroke) + 2}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="animate-pulse"
          />
        )}
      </svg>
      
      {/* Center content */}
      <div className="absolute inset-0 flex items-center justify-center">
        {children || (showPercentage && (
          <motion.span 
            className={cn(
              'font-bold text-white',
              size === 'sm' && 'text-xs',
              size === 'md' && 'text-sm',
              size === 'lg' && 'text-base',
              size === 'xl' && 'text-lg'
            )}
            initial={animated ? { scale: 0 } : { scale: 1 }}
            animate={{ scale: 1 }}
            transition={{ delay: animated ? 0.5 : 0, duration: 0.3 }}
          >
            {Math.round(progress)}%
          </motion.span>
        ))}
      </div>
    </div>
  );
};