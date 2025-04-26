
import React from 'react';
import { Trophy, Star, Target } from 'lucide-react';
import { GlassCard } from './GlassCard';
import { useApp } from '@/context/AppContext';

export const ProfileOverview = () => {
  const { streak, xp, completedQuests } = useApp();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-3">
        <GlassCard variant="dark" className="p-4 flex flex-col items-center justify-center space-y-2">
          <Star className="w-5 h-5 text-white/70" />
          <span className="text-2xl font-semibold">{streak}</span>
          <span className="text-xs text-white/70">Day streak</span>
        </GlassCard>
        
        <GlassCard variant="dark" className="p-4 flex flex-col items-center justify-center space-y-2">
          <Trophy className="w-5 h-5 text-white/70" />
          <span className="text-2xl font-semibold">{xp}</span>
          <span className="text-xs text-white/70">Total XP</span>
        </GlassCard>
        
        <GlassCard variant="dark" className="p-4 flex flex-col items-center justify-center space-y-2">
          <Target className="w-5 h-5 text-white/70" />
          <span className="text-2xl font-semibold">{completedQuests}</span>
          <span className="text-xs text-white/70">Completed</span>
        </GlassCard>
      </div>

      <GlassCard variant="dark" className="p-4">
        <h3 className="text-lg font-medium mb-3">Level Progress</h3>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-white/70">Level {Math.floor(xp / 1000) + 1}</span>
            <span className="text-white/70">{xp % 1000}/1000 XP</span>
          </div>
          <div className="h-2 bg-white/5 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-white/80 to-white/60 rounded-full transition-all duration-500"
              style={{ width: `${(xp % 1000) / 10}%` }}
            />
          </div>
        </div>
      </GlassCard>

      <GlassCard variant="dark" className="p-4">
        <h3 className="text-lg font-medium mb-3">Recent Badges</h3>
        <div className="grid grid-cols-4 gap-3">
          {[1, 2, 3, 4].map((_, i) => (
            <div key={i} className="aspect-square rounded-xl bg-white/5 flex items-center justify-center">
              <div className="w-8 h-8 rounded-full bg-white/10" />
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
};
