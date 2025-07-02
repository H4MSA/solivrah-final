import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Flame, Crown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StreakDisplayProps {
  days: number;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'fire' | 'lightning' | 'crown';
  glowing?: boolean;
  showLabel?: boolean;
  onClick?: () => void;
  className?: string;
}

export const StreakDisplay: React.FC<StreakDisplayProps> = ({
  days,
  size = 'md',
  variant = 'fire',
  glowing = false,
  showLabel = true,
  onClick,
  className
}) => {
  const sizeClasses = {
    sm: 'w-12 h-12 text-xs',
    md: 'w-16 h-16 text-sm',
    lg: 'w-20 h-20 text-base'
  };

  const iconSize = {
    sm: 16,
    md: 20,
    lg: 24
  };

  const getIcon = () => {
    switch (variant) {
      case 'lightning':
        return <Zap size={iconSize[size]} className="text-white" />;
      case 'crown':
        return <Crown size={iconSize[size]} className="text-white" />;
      default:
        return <Flame size={iconSize[size]} className="text-white" />;
    }
  };

  const getStreakColor = () => {
    if (days >= 30) return 'from-white via-gray-200 to-white';
    if (days >= 14) return 'from-white/90 via-gray-300 to-white/90';
    if (days >= 7) return 'from-white/80 via-gray-400 to-white/80';
    return 'from-white/70 via-gray-500 to-white/70';
  };

  const shouldAnimate = days > 0;

  return (
    <motion.div
      className={cn(
        'relative flex flex-col items-center justify-center rounded-2xl cursor-pointer group',
        'bg-gradient-to-br from-white/10 to-white/5 border border-white/20',
        'backdrop-blur-md transition-all duration-300',
        sizeClasses[size],
        glowing && 'animate-pulse shadow-lg shadow-white/20',
        className
      )}
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      animate={shouldAnimate ? {
        boxShadow: [
          '0 4px 20px rgba(255, 255, 255, 0.1)',
          '0 4px 25px rgba(255, 255, 255, 0.2)',
          '0 4px 20px rgba(255, 255, 255, 0.1)'
        ]
      } : {}}
      transition={{ duration: 2, repeat: Infinity }}
    >
      {/* Background glow */}
      <AnimatePresence>
        {glowing && (
          <motion.div
            className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 to-white/5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />
        )}
      </AnimatePresence>

      {/* Icon */}
      <motion.div
        className="mb-1"
        animate={shouldAnimate ? { 
          rotate: [0, 5, -5, 0],
          scale: [1, 1.1, 1]
        } : {}}
        transition={{ 
          duration: 2, 
          repeat: Infinity,
          repeatDelay: 3
        }}
      >
        {getIcon()}
      </motion.div>

      {/* Days count */}
      <motion.div
        className={cn(
          'font-bold text-white mb-1',
          size === 'sm' && 'text-lg',
          size === 'md' && 'text-xl',
          size === 'lg' && 'text-2xl'
        )}
        animate={shouldAnimate ? { 
          scale: [1, 1.1, 1] 
        } : {}}
        transition={{ 
          duration: 1.5, 
          repeat: Infinity,
          repeatDelay: 4
        }}
      >
        {days}
      </motion.div>

      {/* Label */}
      {showLabel && (
        <div className="text-xs text-white/70 font-medium text-center leading-tight">
          {days === 1 ? 'Day' : 'Days'}
        </div>
      )}

      {/* Particle effects for high streaks */}
      <AnimatePresence>
        {days >= 7 && (
          <>
            {Array.from({ length: days >= 30 ? 6 : days >= 14 ? 4 : 2 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full"
                initial={{
                  x: 0,
                  y: 0,
                  scale: 0,
                  opacity: 0
                }}
                animate={{
                  x: [0, Math.cos(i * Math.PI / 3) * 25, 0],
                  y: [0, Math.sin(i * Math.PI / 3) * 25, 0],
                  scale: [0, 1, 0],
                  opacity: [0, 1, 0]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: i * 0.2,
                  repeatDelay: 2
                }}
              />
            ))}
          </>
        )}
      </AnimatePresence>

      {/* Border glow animation */}
      {glowing && (
        <motion.div
          className="absolute inset-0 rounded-2xl border border-white/30"
          animate={{
            opacity: [0.5, 1, 0.5],
            scale: [1, 1.05, 1]
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      )}

      {/* Milestone celebration overlay */}
      <AnimatePresence>
        {(days % 7 === 0 && days > 0) && (
          <motion.div
            className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/30 to-white/10"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ 
              scale: [0, 1.2, 1],
              opacity: [0, 0.8, 0]
            }}
            transition={{ duration: 1.5 }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};