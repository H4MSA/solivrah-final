import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Clock, Target, CheckCircle, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PremiumButton } from './premium-button';

interface PremiumDailyQuestProps {
  title: string;
  description: string;
  xp: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  timeEstimate?: string;
  progress?: number;
  completed?: boolean;
  locked?: boolean;
  isActive?: boolean;
  onStart: () => void;
  className?: string;
}

export const PremiumDailyQuest: React.FC<PremiumDailyQuestProps> = ({
  title,
  description,
  xp,
  difficulty,
  timeEstimate,
  progress = 0,
  completed = false,
  locked = false,
  isActive = false,
  onStart,
  className
}) => {
  const [isHovered, setIsHovered] = React.useState(false);

  const difficultyConfig = {
    Easy: { color: 'text-white/80', dots: 1, bgColor: 'from-white/10 to-white/5' },
    Medium: { color: 'text-white/90', dots: 2, bgColor: 'from-white/12 to-white/7' },
    Hard: { color: 'text-white', dots: 3, bgColor: 'from-white/15 to-white/10' }
  };

  const config = difficultyConfig[difficulty];

  const cardVariants = {
    initial: { opacity: 0, y: 20, scale: 0.95 },
    animate: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 24,
        duration: 0.5 
      }
    },
    hover: !locked ? {
      y: -8,
      scale: 1.02,
      transition: { duration: 0.2 }
    } : {},
    tap: !locked ? { scale: 0.98 } : {}
  };

  const getStatusIcon = () => {
    if (completed) return <CheckCircle size={20} className="text-white" />;
    if (locked) return <Lock size={16} className="text-white/50" />;
    if (isActive) return <Target size={20} className="text-white animate-pulse" />;
    return null;
  };

  return (
    <motion.div
      className={cn(
        'relative overflow-hidden rounded-2xl backdrop-blur-xl cursor-pointer',
        'border transition-all duration-500 group',
        completed 
          ? 'bg-gradient-to-br from-white/15 to-white/8 border-white/30' 
          : isActive
            ? 'bg-gradient-to-br from-white/12 to-white/6 border-white/25 shadow-lg shadow-white/10'
            : locked
              ? 'bg-gradient-to-br from-white/5 to-white/2 border-white/10 opacity-60'
              : `bg-gradient-to-br ${config.bgColor} border-white/20`,
        className
      )}
      variants={cardVariants}
      initial="initial"
      animate="animate"
      whileHover="hover"
      whileTap="tap"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* Animated background glow on hover */}
      <AnimatePresence>
        {isHovered && !locked && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />
        )}
      </AnimatePresence>

      {/* Status indicator */}
      <div className="absolute top-4 right-4 z-10">
        {getStatusIcon()}
      </div>

      {/* Active quest indicator */}
      {isActive && !completed && (
        <motion.div
          className="absolute top-0 right-0 bg-white text-black text-xs px-3 py-1 rounded-bl-xl font-medium"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          ACTIVE
        </motion.div>
      )}

      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0 pr-4">
            <h3 className={cn(
              'font-bold text-lg leading-tight mb-2',
              completed ? 'text-white/80 line-through' : 'text-white',
              isActive && 'text-xl'
            )}>
              {title}
            </h3>
            
            <p className={cn(
              'text-sm leading-relaxed',
              completed ? 'text-white/50' : 'text-white/70'
            )}>
              {description}
            </p>
          </div>

          {/* XP Badge */}
          <motion.div
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/20 border border-white/30 backdrop-blur-sm"
            whileHover={{ scale: 1.05 }}
            animate={isHovered ? { 
              boxShadow: '0 0 20px rgba(255, 255, 255, 0.3)' 
            } : {}}
          >
            <Star size={14} className="text-white" />
            <span className="text-sm font-bold text-white">+{xp}</span>
          </motion.div>
        </div>

        {/* Quest metadata */}
        <div className="flex items-center justify-between mb-6 text-xs">
          <div className="flex items-center gap-4">
            {/* Difficulty */}
            <div className="flex items-center gap-2">
              <Target size={12} className={config.color} />
              <span className={cn('font-medium', config.color)}>
                {difficulty}
              </span>
              <div className="flex gap-0.5">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className={cn(
                      'w-1 h-1 rounded-full',
                      i < config.dots ? 'bg-white/80' : 'bg-white/20'
                    )}
                  />
                ))}
              </div>
            </div>

            {/* Time estimate */}
            {timeEstimate && (
              <div className="flex items-center gap-1 text-white/60">
                <Clock size={12} />
                <span className="font-medium">{timeEstimate}</span>
              </div>
            )}
          </div>
        </div>

        {/* Progress bar for active quests */}
        {isActive && progress > 0 && !completed && (
          <motion.div 
            className="mb-6"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-medium text-white/80">Progress</span>
              <span className="text-xs text-white/60">{Math.round(progress)}%</span>
            </div>
            
            <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-white/80 to-white/60 rounded-full relative"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              >
                {/* Shine effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                  animate={{ x: [-100, 200] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                />
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* Action Button */}
        {!locked && (
          <PremiumButton
            variant={completed ? "ghost" : isActive ? "primary" : "outline"}
            size="md"
            showArrow={!completed}
            celebrateOnClick={!completed}
            disabled={completed}
            onClick={completed ? undefined : onStart}
            className="w-full"
          >
            {completed ? (
              <div className="flex items-center justify-center gap-2">
                <CheckCircle size={16} />
                <span>Completed</span>
              </div>
            ) : isActive ? (
              'Continue Quest'
            ) : (
              'Start Quest'
            )}
          </PremiumButton>
        )}

        {locked && (
          <div className="flex items-center justify-center py-3 text-sm text-white/50 bg-white/5 rounded-xl border border-white/10">
            <Lock size={14} className="mr-2" />
            <span>Complete previous quests to unlock</span>
          </div>
        )}
      </div>

      {/* Subtle shine effect */}
      <motion.div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
        style={{
          background: "linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.1) 50%, transparent 70%)",
          transform: "translateX(-100%)"
        }}
        animate={isHovered ? { transform: "translateX(100%)" } : { transform: "translateX(-100%)" }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      />

      {/* Active quest pulse border */}
      {isActive && !completed && (
        <motion.div
          className="absolute inset-0 rounded-2xl border-2 border-white/40 pointer-events-none"
          animate={{
            opacity: [0.3, 0.8, 0.3],
            scale: [1, 1.01, 1]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      )}
    </motion.div>
  );
};