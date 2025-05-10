
import React from 'react';
import { Star, Trophy, Target, Calendar, Share2 } from 'lucide-react';
import { PremiumCard } from './PremiumCard';
import { useApp } from '@/context/AppContext';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

export const ProfileOverview: React.FC = () => {
  const { streak, xp, completedQuests, selectedTheme } = useApp();
  const level = Math.floor(xp / 1000) + 1;
  const xpToNextLevel = 1000 - (xp % 1000);
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    }
  };
  
  return (
    <motion.div 
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants} className="grid grid-cols-3 gap-3">
        <PremiumCard className="p-4 flex flex-col items-center justify-center space-y-2" variant="dark">
          <Star className="w-5 h-5 text-white/90" />
          <span className="text-2xl font-semibold">{streak}</span>
          <span className="text-xs text-white/70">Day Streak</span>
        </PremiumCard>
        
        <PremiumCard className="p-4 flex flex-col items-center justify-center space-y-2" variant="dark">
          <Trophy className="w-5 h-5 text-white/90" />
          <span className="text-2xl font-semibold">{xp}</span>
          <span className="text-xs text-white/70">Total XP</span>
        </PremiumCard>
        
        <PremiumCard className="p-4 flex flex-col items-center justify-center space-y-2" variant="dark">
          <Target className="w-5 h-5 text-white/90" />
          <span className="text-2xl font-semibold">{completedQuests}</span>
          <span className="text-xs text-white/70">Completed</span>
        </PremiumCard>
      </motion.div>

      <motion.div variants={itemVariants}>
        <PremiumCard className="p-4" variant="dark">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-medium">Level Progress</h3>
            <span className="text-xs bg-black/50 px-2 py-1 rounded-full text-white/70 border border-white/5">
              Level {level}
            </span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-white/70">{xp} XP</span>
              <span className="text-white/70">{xpToNextLevel} XP to Level {level + 1}</span>
            </div>
            <div className="h-2 bg-black/50 rounded-full overflow-hidden">
              <div 
                className="h-full bg-white/30 rounded-full transition-all duration-500"
                style={{ width: `${(xp % 1000) / 10}%` }}
              />
            </div>
          </div>
        </PremiumCard>
      </motion.div>

      <motion.div variants={itemVariants}>
        <PremiumCard className="p-4" variant="dark">
          <h3 className="text-lg font-medium mb-3">Badges</h3>
          <div className="grid grid-cols-4 gap-4">
            <div className="flex flex-col items-center">
              <div className="aspect-square w-12 h-12 rounded-full bg-black/50 flex items-center justify-center mb-2 border border-white/10">
                <Trophy size={20} className="text-white/80" />
              </div>
              <span className="text-xs text-white/70 text-center">Early Adopter</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="aspect-square w-12 h-12 rounded-full bg-black/50 flex items-center justify-center mb-2 border border-white/10">
                <Star size={20} className="text-white/80" />
              </div>
              <span className="text-xs text-white/70 text-center">7-Day Streak</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="aspect-square w-12 h-12 rounded-full bg-black/50 flex items-center justify-center mb-2 border border-white/10">
                <Target size={20} className="text-white/80" />
              </div>
              <span className="text-xs text-white/70 text-center">First Quest</span>
            </div>
            <div className="flex flex-col items-center opacity-40">
              <div className="aspect-square w-12 h-12 rounded-full bg-black/50 flex items-center justify-center mb-2 border border-white/10">
                <Share2 size={20} className="text-white/80" />
              </div>
              <span className="text-xs text-white/70 text-center">Social</span>
            </div>
          </div>
        </PremiumCard>
      </motion.div>

      <motion.div variants={itemVariants} className="grid grid-cols-3 gap-3">
        <Button variant="outline" className="bg-black/50 border border-white/10 text-white hover:bg-black/70 hover:border-white/20 h-14 flex flex-col gap-1 rounded-xl">
          <Calendar size={18} />
          <span className="text-xs">Calendar</span>
        </Button>
        <Button variant="outline" className="bg-black/50 border border-white/10 text-white hover:bg-black/70 hover:border-white/20 h-14 flex flex-col gap-1 rounded-xl">
          <Trophy size={18} />
          <span className="text-xs">Ranking</span>
        </Button>
        <Button variant="outline" className="bg-black/50 border border-white/10 text-white hover:bg-black/70 hover:border-white/20 h-14 flex flex-col gap-1 rounded-xl">
          <Share2 size={18} />
          <span className="text-xs">Share</span>
        </Button>
      </motion.div>

      <motion.div variants={itemVariants}>
        <PremiumCard className="p-4" variant="dark">
          <div className="flex justify-between items-center mb-1">
            <h3 className="text-lg font-medium">Current Theme</h3>
            <span className="text-sm text-white/70">{selectedTheme}</span>
          </div>
          <p className="text-sm text-white/70">Enhance your journey with personalized theme settings.</p>
        </PremiumCard>
      </motion.div>
    </motion.div>
  );
};
