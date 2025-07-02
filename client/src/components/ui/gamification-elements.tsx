import React from 'react';
import { motion } from 'framer-motion';
import { Star, Trophy, Zap, Target, Medal, Crown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface XPBadgeProps {
  amount: number;
  className?: string;
  animated?: boolean;
}

export const XPBadge: React.FC<XPBadgeProps> = ({ 
  amount, 
  className, 
  animated = true 
}) => (
  <motion.div
    className={cn(
      "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full",
      "bg-gradient-to-r from-white/10 to-white/5 border border-white/20",
      "text-white font-semibold text-sm backdrop-blur-md",
      className
    )}
    initial={animated ? { scale: 0, opacity: 0 } : false}
    animate={animated ? { scale: 1, opacity: 1 } : false}
    transition={{ type: "spring", stiffness: 300, damping: 20 }}
    whileHover={{ scale: 1.05 }}
  >
    <Star size={14} className="text-white" />
    <span>+{amount} XP</span>
  </motion.div>
);

interface StreakCounterProps {
  days: number;
  size?: 'sm' | 'md' | 'lg';
  glowing?: boolean;
}

export const StreakCounter: React.FC<StreakCounterProps> = ({ 
  days, 
  size = 'md',
  glowing = false 
}) => {
  const sizeClasses = {
    sm: 'text-lg p-2',
    md: 'text-xl p-3',
    lg: 'text-2xl p-4'
  };

  return (
    <motion.div
      className={cn(
        "relative inline-flex flex-col items-center justify-center rounded-xl",
        "bg-gradient-to-b from-white/15 to-white/5 border border-white/20",
        "backdrop-blur-md transition-all duration-300",
        sizeClasses[size],
        glowing && "animate-pulse shadow-lg shadow-white/20"
      )}
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.div
        className="text-white font-bold"
        animate={glowing ? { scale: [1, 1.1, 1] } : {}}
        transition={{ duration: 2, repeat: Infinity }}
      >
        {days}
      </motion.div>
      <div className="text-xs text-white/70 font-medium">
        {days === 1 ? 'Day' : 'Days'}
      </div>
      
      {glowing && (
        <motion.div
          className="absolute inset-0 rounded-xl border border-white/30"
          animate={{
            opacity: [0.5, 1, 0.5],
            scale: [1, 1.05, 1]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}
    </motion.div>
  );
};

interface ProgressBarProps {
  progress: number;
  label?: string;
  showPercentage?: boolean;
  animated?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'success' | 'warning';
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  label,
  showPercentage = true,
  animated = true,
  size = 'md',
  variant = 'default'
}) => {
  const heightClasses = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4'
  };

  const variantClasses = {
    default: 'from-white/80 to-white/60',
    success: 'from-white/90 to-white/70',
    warning: 'from-white/70 to-white/50'
  };

  return (
    <div className="w-full">
      {(label || showPercentage) && (
        <div className="flex justify-between items-center mb-2">
          {label && <span className="text-sm font-medium text-white/80">{label}</span>}
          {showPercentage && (
            <span className="text-xs text-white/60 font-semibold">{Math.round(progress)}%</span>
          )}
        </div>
      )}
      
      <div className={cn(
        "w-full bg-white/10 rounded-full overflow-hidden backdrop-blur-sm",
        "border border-white/20",
        heightClasses[size]
      )}>
        <motion.div
          className={cn(
            "h-full bg-gradient-to-r rounded-full relative overflow-hidden",
            variantClasses[variant]
          )}
          initial={animated ? { width: 0 } : { width: `${progress}%` }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: animated ? 1.5 : 0, ease: "easeOut" }}
        >
          {/* Animated shine effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            animate={{ x: [-100, 300] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          />
        </motion.div>
      </div>
    </div>
  );
};

interface AchievementBadgeProps {
  icon: React.ReactNode;
  title: string;
  description?: string;
  earned?: boolean;
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
}

export const AchievementBadge: React.FC<AchievementBadgeProps> = ({
  icon,
  title,
  description,
  earned = false,
  size = 'md',
  onClick
}) => {
  const sizeClasses = {
    sm: 'w-16 h-16 text-sm',
    md: 'w-20 h-20 text-base',
    lg: 'w-24 h-24 text-lg'
  };

  return (
    <motion.div
      className={cn(
        "relative flex flex-col items-center justify-center rounded-xl",
        "border transition-all duration-300 cursor-pointer",
        sizeClasses[size],
        earned 
          ? "bg-gradient-to-b from-white/20 to-white/10 border-white/30 text-white shadow-lg shadow-white/10" 
          : "bg-white/5 border-white/10 text-white/40"
      )}
      whileHover={earned ? { scale: 1.05, y: -2 } : { scale: 1.02 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      title={description}
    >
      <div className={cn("mb-1", earned ? "text-white" : "text-white/30")}>
        {icon}
      </div>
      <div className={cn(
        "text-xs font-medium text-center px-1 leading-tight",
        earned ? "text-white" : "text-white/40"
      )}>
        {title}
      </div>
      
      {earned && (
        <motion.div
          className="absolute -top-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
        >
          <Star size={10} className="text-black" />
        </motion.div>
      )}
    </motion.div>
  );
};

interface LevelIndicatorProps {
  currentLevel: number;
  currentXP: number;
  xpToNext: number;
  size?: 'sm' | 'md' | 'lg';
}

export const LevelIndicator: React.FC<LevelIndicatorProps> = ({
  currentLevel,
  currentXP,
  xpToNext,
  size = 'md'
}) => {
  const progress = (currentXP % 1000) / 10; // Assuming 1000 XP per level
  
  const sizeClasses = {
    sm: 'w-16 h-16 text-sm',
    md: 'w-20 h-20 text-lg',
    lg: 'w-24 h-24 text-xl'
  };

  return (
    <div className="relative">
      <motion.div
        className={cn(
          "relative flex flex-col items-center justify-center rounded-full",
          "bg-gradient-to-b from-white/20 to-white/10 border-2 border-white/30",
          "backdrop-blur-md font-bold text-white",
          sizeClasses[size]
        )}
        whileHover={{ scale: 1.05 }}
      >
        <Crown size={size === 'sm' ? 14 : size === 'md' ? 16 : 18} className="mb-0.5" />
        <span>{currentLevel}</span>
        
        {/* Progress ring */}
        <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 36 36">
          <path
            d="M18 2.0845
              a 15.9155 15.9155 0 0 1 0 31.831
              a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            stroke="rgba(255, 255, 255, 0.2)"
            strokeWidth="2"
          />
          <motion.path
            d="M18 2.0845
              a 15.9155 15.9155 0 0 1 0 31.831
              a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            stroke="rgba(255, 255, 255, 0.8)"
            strokeWidth="2"
            strokeDasharray="100"
            initial={{ strokeDashoffset: 100 }}
            animate={{ strokeDashoffset: 100 - progress }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
        </svg>
      </motion.div>
      
      <div className="text-center mt-2">
        <div className="text-xs text-white/60 font-medium">
          {xpToNext} XP to Level {currentLevel + 1}
        </div>
      </div>
    </div>
  );
};

interface CelebrationAnimationProps {
  show: boolean;
  type?: 'xp' | 'level' | 'achievement' | 'streak';
  value?: number;
}

export const CelebrationAnimation: React.FC<CelebrationAnimationProps> = ({
  show,
  type = 'xp',
  value = 0
}) => {
  if (!show) return null;

  const celebrationText = {
    xp: `+${value} XP!`,
    level: `Level ${value}!`,
    achievement: 'Achievement Unlocked!',
    streak: `${value} Day Streak!`
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Celebration particles */}
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-white rounded-full"
          initial={{
            x: 0,
            y: 0,
            scale: 0,
            opacity: 1
          }}
          animate={{
            x: (Math.random() - 0.5) * 300,
            y: (Math.random() - 0.5) * 300,
            scale: [0, 1, 0],
            opacity: [1, 1, 0]
          }}
          transition={{
            duration: 2,
            delay: i * 0.1,
            ease: "easeOut"
          }}
        />
      ))}
      
      {/* Main celebration text */}
      <motion.div
        className="text-center bg-black/80 backdrop-blur-xl rounded-2xl p-8 border border-white/20 shadow-2xl"
        initial={{ scale: 0, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0, y: -50 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <motion.div
          className="text-3xl font-bold text-white mb-2"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 0.5, repeat: 2 }}
        >
          {type === 'xp' && <Star size={32} className="mx-auto mb-2" />}
          {type === 'level' && <Crown size={32} className="mx-auto mb-2" />}
          {type === 'achievement' && <Trophy size={32} className="mx-auto mb-2" />}
          {type === 'streak' && <Zap size={32} className="mx-auto mb-2" />}
        </motion.div>
        <motion.div
          className="text-xl font-semibold text-white"
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 1, repeat: Infinity }}
        >
          {celebrationText[type]}
        </motion.div>
      </motion.div>
    </motion.div>
  );
};