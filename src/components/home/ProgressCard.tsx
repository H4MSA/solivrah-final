
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
  <PremiumCard className="p-6">
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-xl font-semibold">Progress</h2>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
          <Star size={16} className="text-white/80" />
          <span className="text-sm text-white/80">{streak} day streak</span>
        </div>
        <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
          <Zap size={16} className="text-white/80" />
          <span className="text-sm text-white/80">{xp} XP</span>
        </div>
      </div>
    </div>
    
    <div className="space-y-3">
      <div className="flex justify-between text-sm">
        <span className="text-white/80">Level {level}</span>
        <span className="text-white/80">{Math.floor(progress)}%</span>
      </div>
      <div className="h-3 bg-white/5 rounded-full overflow-hidden border border-white/10">
        <div 
          className="h-full bg-white/40 rounded-full"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <div className="text-sm text-white/80 text-right">{1000 - (xp % 1000)} XP to Level {level + 1}</div>
    </div>
  </PremiumCard>
);
