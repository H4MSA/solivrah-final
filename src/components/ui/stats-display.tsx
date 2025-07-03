
import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Star, Trophy, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatsDisplayProps {
  streak: number;
  xp: number;
  level: number;
  completedQuests?: number;
  className?: string;
  layout?: 'horizontal' | 'grid';
}

export const StatsDisplay: React.FC<StatsDisplayProps> = ({
  streak,
  xp,
  level,
  completedQuests = 0,
  className,
  layout = 'grid'
}) => {
  const stats = [
    {
      icon: Calendar,
      value: streak,
      label: 'Day Streak',
      color: 'text-white'
    },
    {
      icon: Star,
      value: xp.toLocaleString(),
      label: 'Total XP',
      color: 'text-white'
    },
    {
      icon: Trophy,
      value: level,
      label: 'Level',
      color: 'text-white'
    },
    {
      icon: Zap,
      value: completedQuests,
      label: 'Quests Done',
      color: 'text-white'
    }
  ];

  const containerClasses = layout === 'grid' 
    ? 'grid grid-cols-2 gap-3'
    : 'flex gap-4 overflow-x-auto';

  const itemClasses = layout === 'grid'
    ? 'flex-1'
    : 'flex-shrink-0 min-w-[120px]';

  return (
    <div className={cn(containerClasses, className)}>
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.1 }}
          whileHover={{ y: -2, scale: 1.02 }}
          className={cn(
            'bg-[#1A1A1A] border border-[#333333] rounded-xl p-4',
            'hover:border-[#666666] transition-all duration-200',
            itemClasses
          )}
        >
          <div className="flex flex-col items-center text-center">
            <stat.icon size={20} className={cn('mb-2', stat.color)} />
            <div className="text-xl font-bold text-white mb-1">
              {stat.value}
            </div>
            <div className="text-xs text-[#999999] font-medium">
              {stat.label}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};
