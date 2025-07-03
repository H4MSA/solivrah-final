
import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Lock, Play } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuestStatusIndicatorProps {
  status: 'completed' | 'active' | 'locked';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const QuestStatusIndicator: React.FC<QuestStatusIndicatorProps> = ({
  status,
  size = 'md',
  className
}) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10'
  };

  const iconSize = {
    sm: 16,
    md: 20,
    lg: 24
  };

  const getStatusConfig = () => {
    switch (status) {
      case 'completed':
        return {
          icon: CheckCircle,
          bgColor: 'bg-white',
          iconColor: 'text-black',
          borderColor: 'border-white'
        };
      case 'active':
        return {
          icon: Play,
          bgColor: 'bg-[#666666]',
          iconColor: 'text-white',
          borderColor: 'border-[#666666]'
        };
      case 'locked':
        return {
          icon: Lock,
          bgColor: 'bg-[#333333]',
          iconColor: 'text-[#999999]',
          borderColor: 'border-[#333333]'
        };
    }
  };

  const { icon: Icon, bgColor, iconColor, borderColor } = getStatusConfig();

  return (
    <motion.div
      className={cn(
        'rounded-full border-2 flex items-center justify-center',
        sizeClasses[size],
        bgColor,
        borderColor,
        className
      )}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      whileHover={status !== 'locked' ? { scale: 1.1 } : {}}
    >
      <Icon size={iconSize[size]} className={iconColor} />
    </motion.div>
  );
};
