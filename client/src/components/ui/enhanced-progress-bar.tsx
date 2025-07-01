
import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface EnhancedProgressBarProps {
  progress: number;
  showMilestones?: boolean;
  animated?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onMilestoneReached?: (milestone: number) => void;
}

export const EnhancedProgressBar: React.FC<EnhancedProgressBarProps> = ({
  progress,
  showMilestones = true,
  animated = true,
  size = 'md',
  className,
  onMilestoneReached
}) => {
  const milestones = [25, 50, 75, 100];
  
  const sizeClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3'
  };

  React.useEffect(() => {
    milestones.forEach(milestone => {
      if (progress >= milestone && onMilestoneReached) {
        onMilestoneReached(milestone);
      }
    });
  }, [progress, onMilestoneReached]);

  return (
    <div className={cn('relative w-full bg-[#333333] rounded-full overflow-hidden', sizeClasses[size], className)}>
      {/* Background track */}
      <div className="absolute inset-0 bg-[#666666]/20" />
      
      {/* Progress fill */}
      <motion.div
        className="h-full bg-white rounded-full"
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={animated ? { duration: 0.8, ease: "easeOut" } : { duration: 0 }}
      />

      {/* Milestone markers */}
      {showMilestones && milestones.map((milestone) => (
        <div
          key={milestone}
          className="absolute top-0 bottom-0 w-0.5 bg-[#999999]"
          style={{ left: `${milestone}%` }}
        >
          {/* Milestone indicator */}
          <motion.div
            className={cn(
              'absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2',
              'w-3 h-3 rounded-full border-2 transition-colors duration-300',
              progress >= milestone 
                ? 'bg-white border-black' 
                : 'bg-[#666666] border-[#999999]'
            )}
            animate={progress >= milestone ? { scale: [1, 1.2, 1] } : {}}
            transition={{ duration: 0.3 }}
          />
        </div>
      ))}

      {/* Animated shine effect */}
      {animated && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          initial={{ x: '-100%' }}
          animate={{ x: '100%' }}
          transition={{ 
            duration: 1.5, 
            repeat: Infinity, 
            repeatDelay: 3,
            ease: "linear"
          }}
          style={{ width: '50%' }}
        />
      )}
    </div>
  );
};
