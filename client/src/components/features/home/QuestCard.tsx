import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Calendar, CheckCircle, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { EnhancedButton } from "@/components/ui/enhanced-button";
import { CelebrationAnimation } from "@/components/ui/celebration-animation";
import { QuestCompletionBadge } from "@/components/ui/quest-completion-badge";
import { QuestStatusIndicator } from "@/components/ui/quest-status-indicator";
import { SolivrahMascot } from "@/components/SolivrahMascot";

interface QuestCardProps {
  title: string;
  description: string;
  onClick: () => void;
  locked?: boolean;
  active?: boolean;
  completed?: boolean;
  date?: string;
  progress?: number;
  xp?: number;
  className?: string;
}

export const QuestCard: React.FC<QuestCardProps> = ({
  title,
  description,
  onClick,
  locked = false,
  active = false,
  completed = false,
  date,
  progress,
  xp = 50,
  className
}) => {
  const [showCelebration, setShowCelebration] = useState(false);
  const [showCompletionBadge, setShowCompletionBadge] = useState(false);

  const handleClick = () => {
    if (!locked && !completed) {
      onClick();
      if (active) {
        setShowCelebration(true);
        setTimeout(() => setShowCompletionBadge(true), 1000);
      }
    }
  };

  const getStatusColor = () => {
    if (completed) return "border-white/30 bg-[#333333]/80";
    if (active) return "border-white/40 bg-[#1A1A1A] ring-1 ring-white/10";
    if (locked) return "border-[#333333] bg-[#1A1A1A]/50";
    return "border-[#333333] bg-[#1A1A1A]";
  };

  const getMascotMood = () => {
    if (completed) return "celebrating";
    if (active) return "encouraging";
    if (locked) return "neutral";
    return "happy";
  };

  return (
    <>
      <CelebrationAnimation 
        show={showCelebration} 
        onComplete={() => setShowCelebration(false)}
        type="quest"
      />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, type: "spring", stiffness: 100 }}
        whileHover={!locked ? { 
          y: -3,
          boxShadow: "0 8px 25px -5px rgba(255, 255, 255, 0.1)",
          transition: { duration: 0.2 }
        } : {}}
        className={cn(
          "relative overflow-hidden rounded-xl border p-4 transition-all duration-300",
          getStatusColor(),
          !locked && "cursor-pointer",
          locked && "opacity-60",
          className
        )}
        onClick={handleClick}
      >
        {/* Status Indicator */}
        <div className="absolute top-3 right-3">
          <QuestStatusIndicator 
            status={completed ? "completed" : active ? "active" : "locked"} 
            size="sm"
          />
        </div>

        {/* Active Quest Badge */}
        {active && !completed && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute top-0 right-0 bg-white text-black text-xs px-2 py-1 rounded-bl-lg font-medium"
          >
            Active
          </motion.div>
        )}

        {/* Main Content */}
        <div className="flex items-start gap-3 mb-4">
          <SolivrahMascot 
            mood={getMascotMood()} 
            size="sm" 
            className="flex-shrink-0 mt-1"
          />
          
          <div className="flex-1 min-w-0">
            <h3 className={cn(
              "font-bold leading-tight mb-2",
              completed ? "text-lg text-white/80 line-through" : "text-lg text-white",
              active && "text-xl"
            )}>
              {title}
            </h3>
            
            <p className={cn(
              "text-sm leading-relaxed",
              completed ? "text-white/50" : "text-white/70"
            )}>
              {description}
            </p>
          </div>
        </div>

        {/* XP Display */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1 bg-white/10 px-2 py-1 rounded">
            <Star size={12} className="text-white" />
            <span className="text-xs font-medium text-white">{xp} XP</span>
          </div>
          
          {date && (
            <div className="flex items-center gap-1 text-xs text-white/60">
              <Calendar size={12} />
              <span>{date}</span>
            </div>
          )}
        </div>
        
        {/* Progress Bar */}
        {progress !== undefined && !completed && (
          <div className="mb-4">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-white/60">Progress</span>
              <span className="text-xs text-white/80">{progress}%</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-1.5">
              <motion.div 
                className="bg-white/60 h-full rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </div>
          </div>
        )}
        
        {/* Action Button */}
        {!locked && !completed ? (
          <EnhancedButton
            variant="secondary"
            size="sm"
            showArrow={true}
            celebrateOnClick={true}
            className="w-full font-medium"
          >
            {active ? 'Continue Quest' : 'Start Quest'} 
          </EnhancedButton>
        ) : completed ? (
          <div className="flex items-center justify-center py-2 text-sm text-white/70 bg-white/5 rounded-lg">
            <CheckCircle size={16} className="mr-2" />
            <span className="font-medium">Completed</span>
          </div>
        ) : (
          <div className="flex items-center justify-center py-2 text-xs text-white/50 bg-[#333333]/30 rounded-lg">
            <Lock size={12} className="mr-2" />
            <span>Complete previous quests to unlock</span>
          </div>
        )}

        {/* Completion Badge Overlay */}
        <AnimatePresence>
          {showCompletionBadge && (
            <QuestCompletionBadge 
              show={showCompletionBadge}
              xp={xp}
            />
          )}
        </AnimatePresence>

        {/* Locked Quest Blur Overlay */}
        <AnimatePresence>
          {locked && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm rounded-xl flex items-center justify-center"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="text-center px-4"
              >
                <Lock size={20} className="text-white/60 mb-2 mx-auto" />
                <p className="text-xs text-white/60 leading-tight">
                  Complete previous quests to unlock
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
};
