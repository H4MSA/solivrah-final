
import React from "react";
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
  <div className="p-4 bg-black/80 border border-[#333333] rounded-xl shadow-sm">
    <div className="flex justify-between items-center mb-3">
      <h2 className="text-base font-semibold">Progress</h2>
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5 bg-black/60 px-2 py-1 rounded-md border border-white/10">
          <Star size={14} className="text-white/80" />
          <span className="text-xs text-white/80">{streak}-day streak</span>
        </div>
        <div className="flex items-center gap-1.5 bg-black/60 px-2 py-1 rounded-md border border-white/10">
          <Zap size={14} className="text-white/80" />
          <span className="text-xs text-white/80">{xp} XP</span>
        </div>
      </div>
    </div>
    
    <div className="space-y-2">
      <div className="flex justify-between text-xs">
        <span className="text-white/80">Level {level}</span>
        <span className="text-white/80">{Math.floor(progress)}%</span>
      </div>
      <div className="h-2 bg-black/60 rounded-full overflow-hidden border border-white/10">
        <div 
          className="h-full bg-white/40 rounded-full"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <div className="text-xs text-white/80 text-right">{1000 - (xp % 1000)} XP to Level {level + 1}</div>
    </div>
  </div>
);
