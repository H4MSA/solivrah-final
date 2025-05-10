
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuestCardProps {
  title: string;
  description: string;
  onClick: () => void;
  locked?: boolean;
  active?: boolean;
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
  date,
  progress,
  className
}) => {
  return (
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
        "relative overflow-hidden",
        className
      )}
    >
      <div className={cn(
        "p-4 bg-[#1A1A1A] border border-[#333333] rounded-xl shadow-sm",
        active && "border-white/20"
      )}>
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
        
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-white leading-tight">{title}</h3>
          <p className="text-xs text-white/70 leading-relaxed">{description}</p>
          
          {!locked ? (
            <motion.button
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg transition-colors duration-200 bg-[#222222] text-white hover:bg-[#2A2A2A] border border-white/10 text-xs font-medium"
              onClick={onClick}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Start 
              <motion.span
                initial={{ x: 0 }}
                animate={{ x: [0, 3, 0] }}
                transition={{ 
                  repeat: Infinity, 
                  repeatType: "loop", 
                  duration: 1.5,
                  ease: "easeInOut",
                  repeatDelay: 0.5
                }}
              >→</motion.span>
            </motion.button>
          ) : (
            <div className="flex items-center justify-center py-2 text-xs text-white/50">
              <Lock size={12} className="mr-1" />
              <span>Complete previous quests to unlock</span>
            </div>
          )}
        </div>
        
        {/* Overlay for locked quests - improved styling for premium look */}
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
              >
                <Lock size={24} className="text-white/70 mb-2" />
                <p className="text-xs text-white/70 text-center px-6">
                  Complete previous quests to unlock
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
