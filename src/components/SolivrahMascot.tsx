
import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SolivrahMascotProps {
  mood?: 'happy' | 'thinking' | 'encouraging' | 'celebrating' | 'neutral';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const SolivrahMascot: React.FC<SolivrahMascotProps> = ({
  mood = 'neutral',
  size = 'md',
  className
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  const getMascotAnimation = () => {
    switch (mood) {
      case 'happy':
        return {
          scale: [1, 1.1, 1],
          transition: { duration: 0.6, repeat: Infinity, repeatDelay: 2 }
        };
      case 'thinking':
        return {
          rotateZ: [-2, 2, -2],
          transition: { duration: 1.5, repeat: Infinity }
        };
      case 'encouraging':
        return {
          y: [0, -4, 0],
          transition: { duration: 0.8, repeat: Infinity, repeatDelay: 1 }
        };
      case 'celebrating':
        return {
          scale: [1, 1.2, 1],
          rotateZ: [0, 10, -10, 0],
          transition: { duration: 0.5, repeat: 3 }
        };
      default:
        return {};
    }
  };

  return (
    <motion.div 
      className={cn(
        'flex items-center justify-center rounded-full bg-white border-2 border-black',
        sizeClasses[size],
        className
      )}
      animate={getMascotAnimation()}
    >
      {/* Minimalist face design */}
      <div className="relative w-full h-full flex items-center justify-center">
        {/* Eyes */}
        <div className="absolute top-1/3 left-1/3 w-1 h-1 bg-black rounded-full" />
        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-black rounded-full" />
        
        {/* Mouth based on mood */}
        <div className={cn(
          "absolute bottom-1/3 left-1/2 transform -translate-x-1/2",
          mood === 'happy' || mood === 'celebrating' ? "w-3 h-1.5 border-b-2 border-black rounded-b-full" : "",
          mood === 'thinking' ? "w-1 h-1 bg-black rounded-full" : "",
          mood === 'encouraging' ? "w-2 h-1 border-b border-black rounded-b-sm" : "",
          mood === 'neutral' ? "w-2 h-0.5 bg-black" : ""
        )} />
      </div>
    </motion.div>
  );
};
