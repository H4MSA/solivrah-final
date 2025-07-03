
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

  const progressVariants = {
    hidden: { width: 0 },
    visible: { 
      width: `${progress}%`,
      transition: { 
        duration: 0.8,
        ease: "easeOut",
        delay: 0.4
      } 
    }
  };

  return (
    <motion.div 
      className="mb-4 bg-[#1A1A1A] p-4 rounded-xl border border-[#333333]"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants} className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-medium text-white">Level {level}</h3>
        <div className="bg-black/30 px-2 py-1 rounded-full border border-white/10">
          <span className="text-xs text-white/80">{xp} XP</span>
        </div>
      </motion.div>
      
      <motion.div variants={itemVariants} className="space-y-2">
        <div className="flex justify-between text-xs">
          <span className="text-white/70">{xp} XP</span>
          <span className="text-white/70">{1000 - (xp % 1000)} XP to Level {level + 1}</span>
        </div>
        
        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-indigo-500/50 rounded-full"
            variants={progressVariants}
          />
        </div>
      </motion.div>
      
      <div className="grid grid-cols-3 gap-3 mt-4">
        <motion.div 
          variants={itemVariants}
          whileHover={{ y: -5, transition: { duration: 0.3 } }}
          className="flex flex-col items-center justify-center bg-[#222222] p-3 rounded-lg border border-[#333333]"
        >
          <Star size={16} className="text-yellow-500/80 mb-1" />
          <span className="text-xl font-semibold text-white">{streak}</span>
          <span className="text-xs text-white/70">Day Streak</span>
        </motion.div>
        
        <motion.div 
          variants={itemVariants}
          whileHover={{ y: -5, transition: { duration: 0.3 } }}
          className="flex flex-col items-center justify-center bg-[#222222] p-3 rounded-lg border border-[#333333]"
        >
          <Trophy size={16} className="text-purple-500/80 mb-1" />
          <span className="text-xl font-semibold text-white">{xp}</span>
          <span className="text-xs text-white/70">Total XP</span>
        </motion.div>
        
        <motion.div 
          variants={itemVariants}
          whileHover={{ y: -5, transition: { duration: 0.3 } }}
          className="flex flex-col items-center justify-center bg-[#222222] p-3 rounded-lg border border-[#333333]"
        >
          <Calendar size={16} className="text-blue-500/80 mb-1" />
          <span className="text-xl font-semibold text-white">{level}</span>
          <span className="text-xs text-white/70">Level</span>
        </motion.div>
      </div>
    </motion.div>
  );
};
