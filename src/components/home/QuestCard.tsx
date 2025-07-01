
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Calendar, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { EnhancedButton } from "@/components/ui/enhanced-button";
import { CelebrationAnimation } from "@/components/ui/celebration-animation";
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
  className
}) => {
  const [showCelebration, setShowCelebration] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);

  const handleClick = () => {
    if (!locked && !completed) {
      onClick();
      if (active) {
        setShowCelebration(true);
        setIsFlipped(true);
      }
    }
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
          y: -5,
          boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 8px 10px -6px rgba(0, 0, 0, 0.2)",
          transition: { duration: 0.3 }
        } : {}}
        className={cn(
          "relative overflow-hidden cursor-pointer",
          className
        )}
        style={{ perspective: "1000px" }}
      >
        <motion.div
          className="relative w-full h-full"
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.6 }}
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* Front face */}
          <div 
            className={cn(
              "absolute inset-0 backface-hidden",
              "p-4 bg-[#1A1A1A] border rounded-xl shadow-sm",
              completed && "bg-[#333333] border-white/20",
              active && "border-white/20 ring-1 ring-white/10",
              locked && "opacity-60"
            )}
            style={{ backfaceVisibility: "hidden" }}
          >
            <div className="flex items-start gap-3 mb-3">
              <SolivrahMascot 
                mood={completed ? "celebrating" : active ? "encouraging" : locked ? "neutral" : "happy"} 
                size="sm" 
              />
              
              <div className="flex-1">
                {active && (
                  <motion.div 
                    className="absolute top-0 right-0"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <div className="bg-white/10 text-white/80 text-xs py-0.5 px-2 rounded-bl-lg">
                      Active
                    </div>
                  </motion.div>
                )}

                {completed && (
                  <motion.div 
                    className="absolute top-2 right-2"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <CheckCircle size={20} className="text-white" />
                  </motion.div>
                )}
              </div>
            </div>
            
            <div className="space-y-3">
              <h3 className={cn(
                "font-semibold leading-tight",
                completed ? "text-lg text-white/90 line-through" : "text-sm text-white"
              )}>
                {title}
              </h3>
              
              <p className={cn(
                "text-xs leading-relaxed",
                completed ? "text-white/60" : "text-white/70"
              )}>
                {description}
              </p>
              
              {progress !== undefined && !completed && (
                <div className="w-full bg-white/5 rounded-full h-1.5 mb-2">
                  <motion.div 
                    className="bg-white/30 h-full rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  />
                </div>
              )}
              
              {!locked && !completed ? (
                <EnhancedButton
                  variant="secondary"
                  size="sm"
                  showArrow={true}
                  celebrateOnClick={true}
                  onClick={handleClick}
                  className="w-full"
                >
                  {active ? 'Continue' : 'Start'} 
                </EnhancedButton>
              ) : completed ? (
                <div className="flex items-center justify-center py-2 text-xs text-white/70">
                  <CheckCircle size={12} className="mr-1" />
                  <span>Completed</span>
                </div>
              ) : (
                <div className="flex items-center justify-center py-2 text-xs text-white/50">
                  <Lock size={12} className="mr-1" />
                  <span>Complete previous quests to unlock</span>
                </div>
              )}
            </div>
          </div>

          {/* Back face (completion celebration) */}
          {completed && (
            <div 
              className="absolute inset-0 backface-hidden"
              style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
            >
              <div className="p-4 bg-[#333333] border border-white/20 rounded-xl shadow-sm h-full flex flex-col items-center justify-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: "spring", stiffness: 300 }}
                >
                  <CheckCircle size={48} className="text-white mb-4" />
                </motion.div>
                <h3 className="text-lg font-bold text-white mb-2">Quest Complete!</h3>
                <p className="text-sm text-white/70 text-center">Great job on completing this quest!</p>
              </div>
            </div>
          )}
        </motion.div>
        
        {/* Overlay for locked quests */}
        <AnimatePresence>
          {locked && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/70 backdrop-blur-[2px] rounded-xl flex flex-col items-center justify-center"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-center"
              >
                <Lock size={24} className="text-white/70 mb-2 mx-auto" />
                <p className="text-xs text-white/70 px-6">
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
