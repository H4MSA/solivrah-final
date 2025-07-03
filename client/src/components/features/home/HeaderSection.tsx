import React from 'react';
import { motion } from 'framer-motion';
import { Camera } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useApp } from '@/context/AppContext';

interface HeaderSectionProps {
  greeting: string;
  displayName: string;
  onCameraClick: () => void;
}

export const HeaderSection: React.FC<HeaderSectionProps> = ({
  greeting,
  displayName,
  onCameraClick
}) => {
  const { user } = useApp();
  
  return (
    <motion.div 
      className="flex justify-between items-center mb-6"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div>
        <h1 className="text-xl font-bold text-white leading-tight">{greeting},</h1>
        <p className="text-sm text-white/70">{displayName}</p>
      </div>
      
      <div className="flex items-center gap-3">
        <button 
          onClick={onCameraClick}
          className="bg-[#1A1A1A] border border-[#333333] p-2 rounded-full hover:bg-[#222222] transition-colors"
        >
          <Camera size={18} className="text-white" />
        </button>
        
        <Avatar className="h-10 w-10 border border-[#333333]">
          {user?.user_metadata?.avatar_url ? (
            <AvatarImage 
              src={user.user_metadata.avatar_url} 
              alt={displayName} 
            />
          ) : (
            <AvatarFallback className="bg-[#1A1A1A] text-white">
              {displayName?.charAt(0)?.toUpperCase() || '?'}
            </AvatarFallback>
          )}
        </Avatar>
      </div>
    </motion.div>
  );
}; 