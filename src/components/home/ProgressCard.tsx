
import React from "react";
import { PremiumCard } from "@/components/PremiumCard";
import { Star, Zap } from "lucide-react";

interface ProgressCardProps {
  streak: number;
  xp: number;
  level: number;
  progress: number;
}

export const ProgressCard: React.FC<ProgressCardProps> = ({ 
  streak, 
  xp, 
  level, 
  progress 
}) => (
  <PremiumCard className="p-4">
    <div className="flex justify-between items-center mb-3">
      <h2 className="text-lg font-semibold">Progress</h2>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1 bg-white/5 px-2 py-1 rounded-full border border-white/5">
          <Star size={14} className="text-white/70" />
          <span className="text-xs text-white/70">{streak} day streak</span>
        </div>
        <div className="flex items-center gap-1 bg-white/5 px-2 py-1 rounded-full border border-white/5">
          <Zap size={14} className="text-white/70" />
          <span className="text-xs text-white/70">{xp} XP</span>
        </div>
      </div>
    </div>
    
    <div className="space-y-2">
      <div className="flex justify-between text-xs">
        <span className="text-white/70">Level {level}</span>
        <span className="text-white/70">{Math.floor(progress)}%</span>
      </div>
      <div className="h-2 bg-white/5 rounded-full overflow-hidden border border-white/5">
        <div 
          className="h-full bg-white/30 rounded-full"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <div className="text-xs text-white/70 text-right">{1000 - (xp % 1000)} XP to Level {level + 1}</div>
    </div>
  </PremiumCard>
);
