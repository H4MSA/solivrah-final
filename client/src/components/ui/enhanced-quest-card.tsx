import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Lock, CheckCircle, Clock, Target, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { XPBadge, ProgressBar } from './gamification-elements';

interface EnhancedQuestCardProps {
  title: string;
  description: string;
  xp: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  timeEstimate?: string;
  completed?: boolean;
  locked?: boolean;
  progress?: number;
  streak?: number;
  isActive?: boolean;
  onClick: () => void;
  className?: string;
}

export const EnhancedQuestCard: React.FC<EnhancedQuestCardProps> = ({
  title,
  description,
  xp,
  difficulty,
  timeEstimate,
  completed = false,
  locked = false,
  progress = 0,
  streak,
  isActive = false,
  onClick,
  className
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const difficultyConfig = {
    Easy: { color: 'text-white/80', dots: 1 },
    Medium: { color: 'text-white/90', dots: 2 },
    Hard: { color: 'text-white', dots: 3 }
  };

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
    hover: {
      y: -8,
      scale: 1.02,
      transition: { duration: 0.2 }
    },
    tap: { scale: 0.97 }
  };

  const contentVariants = {
    initial: { opacity: 0 },
    animate: { 
      opacity: 1,
      transition: { delay: 0.1, duration: 0.3 }
    }
  };

  const getCardStyle = () => {
    if (completed) return "bg-gradient-to-br from-white/15 to-white/5 border-white/30";
    if (isActive) return "bg-gradient-to-br from-white/10 to-white/5 border-white/25 shadow-lg shadow-white/10";
    if (locked) return "bg-gradient-to-br from-white/5 to-white/2 border-white/10";
    return "bg-gradient-to-br from-white/8 to-white/3 border-white/20";
  };

  return (
    <motion.div
      className={cn(
        "relative overflow-hidden rounded-2xl border backdrop-blur-md cursor-pointer",
        "transition-all duration-300 group",
        getCardStyle(),
        locked && "opacity-60 cursor-not-allowed",
        className
      )}
      variants={cardVariants}
      initial="initial"
      animate="animate"
      whileHover={!locked ? "hover" : undefined}
      whileTap={!locked ? "tap" : undefined}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={!locked ? onClick : undefined}
    >
      {/* Animated background glow on hover */}
      <AnimatePresence>
        {isHovered && !locked && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0"
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />
        )}
      </AnimatePresence>

      {/* Streak badge for active quests */}
      {isActive && streak && (
        <motion.div 
          className="absolute top-3 right-3 z-10"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 300 }}
        >
          <div className="flex items-center gap-1 px-2 py-1 bg-white/20 rounded-full text-xs font-semibold text-white backdrop-blur-sm">
            <Zap size={12} />
            <span>{streak}</span>
          </div>
        </motion.div>
      )}

      {/* Lock overlay for locked quests */}
      <AnimatePresence>
        {locked && (
          <motion.div 
            className="absolute inset-0 bg-black/40 backdrop-blur-sm z-10 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="text-center text-white/70"
              initial={{ scale: 0.8, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Lock size={24} className="mx-auto mb-2" />
              <p className="text-sm font-medium">Complete previous quests</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div className="p-6" variants={contentVariants}>
        {/* Header with status and XP */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              {completed && (
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <CheckCircle size={20} className="text-white" />
                </motion.div>
              )}
              
              <h3 className={cn(
                "font-bold text-lg leading-tight",
                completed ? "text-white/80 line-through" : "text-white",
                isActive && "text-white"
              )}>
                {title}
              </h3>
            </div>
            
            <p className={cn(
              "text-sm leading-relaxed mb-4",
              completed ? "text-white/50" : "text-white/70"
            )}>
              {description}
            </p>
          </div>

          <XPBadge amount={xp} animated={isHovered} />
        </div>

        {/* Quest metadata */}
        <div className="flex items-center justify-between mb-4 text-xs">
          <div className="flex items-center gap-4">
            {/* Difficulty indicator */}
            <div className="flex items-center gap-1">
              <Target size={12} className={difficultyConfig[difficulty].color} />
              <span className={cn("font-medium", difficultyConfig[difficulty].color)}>
                {difficulty}
              </span>
              <div className="flex gap-0.5 ml-1">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className={cn(
                      "w-1 h-1 rounded-full",
                      i < difficultyConfig[difficulty].dots 
                        ? "bg-white/80" 
                        : "bg-white/20"
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
        {isActive && progress > 0 && (
          <motion.div 
            className="mb-4"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            transition={{ delay: 0.2 }}
          >
            <ProgressBar 
              progress={progress} 
              size="sm" 
              showPercentage={true}
              animated={true}
            />
          </motion.div>
        )}

        {/* Action button */}
        <motion.button
          className={cn(
            "w-full py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-200",
            "border backdrop-blur-sm",
            completed 
              ? "bg-white/10 border-white/20 text-white/70 cursor-default"
              : isActive
                ? "bg-white text-black border-white/30 hover:bg-white/95 hover:scale-[1.02] active:scale-[0.98] shadow-md hover:shadow-lg"
                : "bg-white/10 border-white/20 text-white hover:bg-white/20 hover:border-white/30"
          )}
          whileHover={!completed ? { scale: 1.01 } : undefined}
          whileTap={!completed ? { scale: 0.99 } : undefined}
          disabled={completed}
        >
          {completed ? (
            <span className="flex items-center justify-center gap-2">
              <CheckCircle size={16} />
              Completed
            </span>
          ) : isActive ? (
            "Continue Quest"
          ) : (
            "Start Quest"
          )}
        </motion.button>
      </motion.div>

      {/* Animated border for active quests */}
      {isActive && (
        <motion.div
          className="absolute inset-0 rounded-2xl border-2 border-white/30 pointer-events-none"
          animate={{
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      )}

      {/* Subtle shine effect */}
      <motion.div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: "linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.1) 50%, transparent 70%)",
          transform: "translateX(-100%)"
        }}
        animate={isHovered ? { transform: "translateX(100%)" } : { transform: "translateX(-100%)" }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      />
    </motion.div>
  );
};