
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SolivrahMascot } from '@/components/SolivrahMascot';
import { EnhancedButton } from './enhanced-button';

interface DailyQuestHeroProps {
  title: string;
  description: string;
  xp: number;
  progress?: number;
  onStart: () => void;
  className?: string;
}

export const DailyQuestHero: React.FC<DailyQuestHeroProps> = ({
  title,
  description,
  xp,
  progress = 0,
  onStart,
  className
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn(
        "relative overflow-hidden rounded-2xl border-2 border-white/20",
        "bg-gradient-to-br from-[#1A1A1A] to-[#333333] p-6 shadow-2xl",
        className
      )}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23ffffff\" fill-opacity=\"0.1\"%3E%3Ccircle cx=\"30\" cy=\"30\" r=\"2\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]" />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <SolivrahMascot mood="encouraging" size="md" />
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Calendar size={16} className="text-white/70" />
                <span className="text-xs font-medium text-white/70 uppercase tracking-wide">
                  Today's Quest
                </span>
              </div>
              <h2 className="text-2xl font-bold text-white leading-tight">
                {title}
              </h2>
            </div>
          </div>
          
          <div className="flex items-center gap-1 bg-white/10 px-3 py-1 rounded-full">
            <Star size={14} className="text-white" />
            <span className="text-sm font-medium text-white">{xp} XP</span>
          </div>
        </div>

        {/* Description */}
        <p className="text-white/80 text-base leading-relaxed mb-6 max-w-md">
          {description}
        </p>

        {/* Progress Bar (if progress > 0) */}
        {progress > 0 && (
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-white/70">Progress</span>
              <span className="text-sm font-medium text-white">{progress}%</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2">
              <motion.div
                className="bg-white h-full rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </div>
          </div>
        )}

        {/* Action Button */}
        <EnhancedButton
          variant="primary"
          size="lg"
          showArrow={true}
          celebrateOnClick={true}
          onClick={onStart}
          className="w-full font-bold text-lg"
        >
          {progress > 0 ? 'Continue Quest' : 'Start Quest'}
        </EnhancedButton>
      </div>

      {/* Glow Effect */}
      <motion.div
        className="absolute -inset-1 bg-gradient-to-r from-white/20 via-white/5 to-white/20 rounded-2xl opacity-0"
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
      />
    </motion.div>
  );
};
