
import React from 'react';
import { motion } from 'framer-motion';
import { Star, Trophy, Calendar } from 'lucide-react';
import { EnhancedProgressBar } from '@/components/ui/enhanced-progress-bar';
import { SolivrahMascot } from '@/components/SolivrahMascot';

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
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  const getMascotMood = () => {
    if (progress >= 75) return 'celebrating';
    if (progress >= 50) return 'happy';
    if (progress >= 25) return 'encouraging';
    return 'neutral';
  };

  return (
    <motion.div 
      className="mb-4 bg-[#1A1A1A] p-4 rounded-xl border border-[#333333] shadow-lg"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants} className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-3">
          <SolivrahMascot mood={getMascotMood()} size="md" />
          <h3 className="text-lg font-bold text-white">Level {level}</h3>
        </div>
        <div className="bg-black/30 px-3 py-1 rounded-full border border-white/10">
          <span className="text-xs font-medium text-white">{xp} XP</span>
        </div>
      </motion.div>
      
      <motion.div variants={itemVariants} className="space-y-3">
        <div className="flex justify-between text-xs">
          <span className="text-[#999999] font-medium">{xp} XP</span>
          <span className="text-[#999999] font-medium">{1000 - (xp % 1000)} XP to Level {level + 1}</span>
        </div>
        
        <EnhancedProgressBar 
          progress={progress}
          showMilestones={true}
          animated={true}
          size="md"
        />
      </motion.div>
      
      <div className="grid grid-cols-3 gap-3 mt-4">
        <motion.div 
          variants={itemVariants}
          whileHover={{ y: -3, scale: 1.02 }}
          transition={{ duration: 0.2 }}
          className="flex flex-col items-center justify-center bg-[#222222] p-3 rounded-lg border border-[#333333] hover:border-[#666666] transition-colors"
        >
          <Star size={16} className="text-[#CCCCCC] mb-1" />
          <span className="text-xl font-bold text-white">{streak}</span>
          <span className="text-xs text-[#999999] font-medium">Day Streak</span>
        </motion.div>
        
        <motion.div 
          variants={itemVariants}
          whileHover={{ y: -3, scale: 1.02 }}
          transition={{ duration: 0.2 }}
          className="flex flex-col items-center justify-center bg-[#222222] p-3 rounded-lg border border-[#333333] hover:border-[#666666] transition-colors"
        >
          <Trophy size={16} className="text-[#CCCCCC] mb-1" />
          <span className="text-xl font-bold text-white">{xp}</span>
          <span className="text-xs text-[#999999] font-medium">Total XP</span>
        </motion.div>
        
        <motion.div 
          variants={itemVariants}
          whileHover={{ y: -3, scale: 1.02 }}
          transition={{ duration: 0.2 }}
          className="flex flex-col items-center justify-center bg-[#222222] p-3 rounded-lg border border-[#333333] hover:border-[#666666] transition-colors"
        >
          <Calendar size={16} className="text-[#CCCCCC] mb-1" />
          <span className="text-xl font-bold text-white">{level}</span>
          <span className="text-xs text-[#999999] font-medium">Level</span>
        </motion.div>
      </div>
    </motion.div>
  );
};
