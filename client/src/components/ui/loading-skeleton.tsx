
import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface LoadingSkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  lines?: number;
  animate?: boolean;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  className,
  variant = 'rectangular',
  lines = 1,
  animate = true
}) => {
  const baseClasses = "bg-white/10 rounded";
  
  const variantClasses = {
    text: "h-4 w-full",
    circular: "rounded-full aspect-square",
    rectangular: "h-12 w-full"
  };

  const skeletonElement = (
    <div className={cn(baseClasses, variantClasses[variant], className)}>
      {animate && (
        <motion.div
          className="h-full w-full bg-gradient-to-r from-transparent via-white/5 to-transparent"
          animate={{ x: ['-100%', '100%'] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        />
      )}
    </div>
  );

  if (variant === 'text' && lines > 1) {
    return (
      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, index) => (
          <div key={index} className={cn(baseClasses, variantClasses[variant], className)}>
            {animate && (
              <motion.div
                className="h-full w-full bg-gradient-to-r from-transparent via-white/5 to-transparent"
                animate={{ x: ['-100%', '100%'] }}
                transition={{ 
                  duration: 1.5, 
                  repeat: Infinity, 
                  ease: "linear",
                  delay: index * 0.1
                }}
              />
            )}
          </div>
        ))}
      </div>
    );
  }

  return skeletonElement;
};
