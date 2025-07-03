
import React from 'react';
import { motion } from 'framer-motion';
import { Camera, MessageCircle, Users, Search, Calendar, Award } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuickActionGridProps {
  onCameraClick?: () => void;
  onChatClick?: () => void;
  onCommunityClick?: () => void;
  onSearchClick?: () => void;
  onCalendarClick?: () => void;
  onAchievementsClick?: () => void;
  className?: string;
}

export const QuickActionGrid: React.FC<QuickActionGridProps> = ({
  onCameraClick,
  onChatClick,
  onCommunityClick,
  onSearchClick,
  onCalendarClick,
  onAchievementsClick,
  className
}) => {
  const actions = [
    {
      icon: Camera,
      label: 'Capture',
      onClick: onCameraClick,
      bgColor: 'bg-[#333333]',
      hoverColor: 'hover:bg-[#666666]'
    },
    {
      icon: MessageCircle,
      label: 'AI Coach',
      onClick: onChatClick,
      bgColor: 'bg-[#333333]',
      hoverColor: 'hover:bg-[#666666]'
    },
    {
      icon: Users,
      label: 'Community',
      onClick: onCommunityClick,
      bgColor: 'bg-[#333333]',
      hoverColor: 'hover:bg-[#666666]'
    },
    {
      icon: Search,
      label: 'Search',
      onClick: onSearchClick,
      bgColor: 'bg-[#333333]',
      hoverColor: 'hover:bg-[#666666]'
    },
    {
      icon: Calendar,
      label: 'Schedule',
      onClick: onCalendarClick,
      bgColor: 'bg-[#333333]',
      hoverColor: 'hover:bg-[#666666]'
    },
    {
      icon: Award,
      label: 'Achievements',
      onClick: onAchievementsClick,
      bgColor: 'bg-[#333333]',
      hoverColor: 'hover:bg-[#666666]'
    }
  ];

  return (
    <div className={cn('grid grid-cols-3 gap-3', className)}>
      {actions.map((action, index) => (
        <motion.button
          key={action.label}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={action.onClick}
          className={cn(
            'flex flex-col items-center justify-center p-4 rounded-xl',
            'border border-[#333333] transition-all duration-200',
            action.bgColor,
            action.hoverColor,
            'focus:outline-none focus:ring-2 focus:ring-white/20'
          )}
        >
          <action.icon size={24} className="text-white mb-2" />
          <span className="text-xs font-medium text-white text-center">
            {action.label}
          </span>
        </motion.button>
      ))}
    </div>
  );
};
