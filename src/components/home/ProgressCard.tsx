
import React from 'react';
import { motion } from 'framer-motion';
import { Star, Trophy, Calendar } from 'lucide-react';

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
}) => {
  return (
    <motion.div 
      className="mb-4 bg-[#1A1A1A] p-4 rounded-xl border border-[#333333]"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
    >
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-medium">Level {level}</h3>
        <div className="bg-black/30 px-2 py-1 rounded-full border border-white/10">
          <span className="text-xs text-white/80">{xp} XP</span>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between text-xs">
          <span className="text-white/70">{xp} XP</span>
          <span className="text-white/70">{1000 - (xp % 1000)} XP to Level {level + 1}</span>
        </div>
        
        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
          <div 
            className="h-full bg-white/30 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-3 mt-4">
        <div className="flex flex-col items-center justify-center bg-[#222222] p-3 rounded-lg border border-[#333333]">
          <Star size={16} className="text-white/80 mb-1" />
          <span className="text-xl font-semibold">{streak}</span>
          <span className="text-xs text-white/70">Day Streak</span>
        </div>
        
        <div className="flex flex-col items-center justify-center bg-[#222222] p-3 rounded-lg border border-[#333333]">
          <Trophy size={16} className="text-white/80 mb-1" />
          <span className="text-xl font-semibold">{xp}</span>
          <span className="text-xs text-white/70">Total XP</span>
        </div>
        
        <div className="flex flex-col items-center justify-center bg-[#222222] p-3 rounded-lg border border-[#333333]">
          <Calendar size={16} className="text-white/80 mb-1" />
          <span className="text-xl font-semibold">{level}</span>
          <span className="text-xs text-white/70">Level</span>
        </div>
      </div>
    </motion.div>
  );
};
