
import React from 'react';
import { Star, Trophy, Target, RotateCcw, Calendar, Share2, Download } from 'lucide-react';
import { GlassCard } from './GlassCard';
import { useApp } from '@/context/AppContext';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Button } from '@/components/ui/button';

export const ProfileOverview = () => {
  const { streak, xp, completedQuests, selectedTheme } = useApp();
  const level = Math.floor(xp / 1000) + 1;
  const xpToNextLevel = 1000 - (xp % 1000);
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-3">
        <GlassCard variant="dark" className="p-4 flex flex-col items-center justify-center space-y-2">
          <Star className="w-5 h-5 text-white/90" />
          <span className="text-2xl font-semibold">{streak}</span>
          <span className="text-xs text-white/70">Day Streak</span>
        </GlassCard>
        
        <GlassCard variant="dark" className="p-4 flex flex-col items-center justify-center space-y-2">
          <Trophy className="w-5 h-5 text-white/90" />
          <span className="text-2xl font-semibold">{xp}</span>
          <span className="text-xs text-white/70">Total XP</span>
        </GlassCard>
        
        <GlassCard variant="dark" className="p-4 flex flex-col items-center justify-center space-y-2">
          <Target className="w-5 h-5 text-white/90" />
          <span className="text-2xl font-semibold">{completedQuests}</span>
          <span className="text-xs text-white/70">Completed</span>
        </GlassCard>
      </div>

      <GlassCard variant="dark" className="p-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-medium">Level Progress</h3>
          <RotateCcw size={16} className="text-white/50" />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-white/70">Level {level}</span>
            <span className="text-white/70">{xpToNextLevel} XP to Level {level + 1}</span>
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
        <h3 className="text-lg font-medium mb-3">Badges</h3>
        <div className="grid grid-cols-4 gap-4">
          <div className="flex flex-col items-center">
            <div className="aspect-square w-12 h-12 rounded-full bg-black/60 flex items-center justify-center mb-2">
              <Trophy size={20} className="text-white/80" />
            </div>
            <span className="text-xs text-white/70">Early Adopter</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="aspect-square w-12 h-12 rounded-full bg-black/60 flex items-center justify-center mb-2">
              <Star size={20} className="text-white/80" />
            </div>
            <span className="text-xs text-white/70">7-Day Streak</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="aspect-square w-12 h-12 rounded-full bg-black/60 flex items-center justify-center mb-2">
              <Target size={20} className="text-white/80" />
            </div>
            <span className="text-xs text-white/70">First Quest</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="aspect-square w-12 h-12 rounded-full bg-black/60 flex items-center justify-center mb-2 opacity-50">
              <Share2 size={20} className="text-white/80" />
            </div>
            <span className="text-xs text-white/50">Social</span>
          </div>
        </div>
      </GlassCard>

      <div className="grid grid-cols-3 gap-3">
        <Button variant="outline" className="bg-black/60 border border-white/10 text-white hover:bg-black/40 hover:border-white/20 h-14 flex flex-col gap-1 rounded-xl">
          <Calendar size={18} />
          <span className="text-xs">Calendar</span>
        </Button>
        <Button variant="outline" className="bg-black/60 border border-white/10 text-white hover:bg-black/40 hover:border-white/20 h-14 flex flex-col gap-1 rounded-xl">
          <Download size={18} />
          <span className="text-xs">Export</span>
        </Button>
        <Button variant="outline" className="bg-black/60 border border-white/10 text-white hover:bg-black/40 hover:border-white/20 h-14 flex flex-col gap-1 rounded-xl">
          <Share2 size={18} />
          <span className="text-xs">Share</span>
        </Button>
      </div>

      <GlassCard variant="dark" className="p-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-medium">Theme Preferences</h3>
          <span className="text-sm text-white/70">{selectedTheme}</span>
        </div>
      </GlassCard>
    </div>
  );
};
