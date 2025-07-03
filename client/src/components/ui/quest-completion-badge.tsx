
import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuestCompletionBadgeProps {
  show: boolean;
  xp: number;
  className?: string;
}

export const QuestCompletionBadge: React.FC<QuestCompletionBadgeProps> = ({
  show,
  xp,
  className
}) => {
  if (!show) return null;

  return (
    <motion.div
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      exit={{ scale: 0, rotate: 180 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={cn(
        "absolute inset-0 bg-[#333333] border border-white/20 rounded-xl shadow-lg",
        "flex flex-col items-center justify-center text-center p-4",
        className
      )}
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 400 }}
        className="mb-3"
      >
        <CheckCircle size={48} className="text-white" />
      </motion.div>
      
      <motion.h3
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-lg font-bold text-white mb-2"
      >
        Quest Complete!
      </motion.h3>
      
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="flex items-center gap-1 bg-white/10 px-3 py-1 rounded-full"
      >
        <Star size={16} className="text-white" />
        <span className="text-sm font-medium text-white">+{xp} XP</span>
      </motion.div>
    </motion.div>
  );
};
