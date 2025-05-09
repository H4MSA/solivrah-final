
import React from "react";
import { motion } from "framer-motion";
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
      whileHover={!locked ? { scale: 1.01 } : {}}
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
          <div className="absolute top-0 right-0">
            <div className="bg-white/10 text-white/80 text-xs py-0.5 px-2 rounded-bl-lg">
              Active
            </div>
          </div>
        )}
        
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-white leading-tight">{title}</h3>
          <p className="text-xs text-white/70 leading-relaxed">{description}</p>
          
          {!locked ? (
            <button
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg transition-colors duration-200 bg-black/80 text-white hover:bg-black/90 shadow-sm border border-white/10 text-xs font-medium"
              onClick={onClick}
            >
              Start <span className="ml-1">→</span>
            </button>
          ) : (
            <div className="flex items-center justify-center py-2 text-xs text-white/50">
              <Lock size={12} className="mr-1" />
              <span>Complete previous quests to unlock</span>
            </div>
          )}
        </div>
        
        {/* Overlay for locked quests - improved styling for premium look */}
        {locked && (
          <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px] rounded-xl flex flex-col items-center justify-center">
            <Lock size={24} className="text-white/70 mb-2" />
            <p className="text-xs text-white/70 text-center px-6">
              Complete previous quests to unlock
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
};
