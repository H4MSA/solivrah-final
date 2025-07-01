
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface AdvancedMascotProps {
  mood?: 'happy' | 'thinking' | 'encouraging' | 'celebrating' | 'neutral' | 'excited' | 'focused';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showMessage?: boolean;
  message?: string;
  context?: 'quest' | 'ai-chat' | 'progress' | 'celebration';
}

export const AdvancedMascot: React.FC<AdvancedMascotProps> = ({
  mood = 'neutral',
  size = 'md',
  className,
  showMessage = false,
  message = '',
  context = 'quest'
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-20 h-20'
  };

  const getMascotAnimation = () => {
    switch (mood) {
      case 'happy':
        return {
          scale: [1, 1.1, 1],
          rotateZ: [0, 5, -5, 0],
          transition: { duration: 0.8, repeat: Infinity, repeatDelay: 3 }
        };
      case 'thinking':
        return {
          rotateZ: [-3, 3, -3],
          y: [0, -2, 0],
          transition: { duration: 2, repeat: Infinity }
        };
      case 'encouraging':
        return {
          y: [0, -6, 0],
          scale: [1, 1.05, 1],
          transition: { duration: 1, repeat: Infinity, repeatDelay: 1.5 }
        };
      case 'celebrating':
        return {
          scale: [1, 1.3, 1.1, 1.2, 1],
          rotateZ: [0, 15, -15, 10, 0],
          y: [0, -8, 0, -4, 0],
          transition: { duration: 0.8, repeat: 2 }
        };
      case 'excited':
        return {
          scale: [1, 1.15, 0.95, 1.1, 1],
          rotateZ: [0, 8, -8, 4, 0],
          transition: { duration: 0.6, repeat: Infinity, repeatDelay: 2 }
        };
      case 'focused':
        return {
          scale: [1, 1.02, 1],
          transition: { duration: 3, repeat: Infinity }
        };
      default:
        return {
          y: [0, -1, 0],
          transition: { duration: 4, repeat: Infinity }
        };
    }
  };

  const getEyeExpression = () => {
    switch (mood) {
      case 'happy':
      case 'celebrating':
      case 'excited':
        return { shape: 'curved', size: 'w-1.5 h-1' }; // Happy squinted eyes
      case 'thinking':
      case 'focused':
        return { shape: 'normal', size: 'w-1 h-1' }; // Normal focused eyes
      case 'encouraging':
        return { shape: 'wide', size: 'w-1.5 h-1.5' }; // Wide encouraging eyes
      default:
        return { shape: 'normal', size: 'w-1 h-1' };
    }
  };

  const getMouthExpression = () => {
    switch (mood) {
      case 'happy':
      case 'celebrating':
      case 'excited':
        return 'w-4 h-2 border-b-2 border-black rounded-b-full'; // Big smile
      case 'encouraging':
        return 'w-3 h-1.5 border-b-2 border-black rounded-b-lg'; // Encouraging smile
      case 'thinking':
      case 'focused':
        return 'w-2 h-1 border-b border-black rounded-b-sm'; // Small thoughtful line
      default:
        return 'w-2 h-0.5 bg-black rounded'; // Neutral line
    }
  };

  const eyeExpression = getEyeExpression();

  return (
    <div className="relative">
      <motion.div 
        className={cn(
          'flex items-center justify-center rounded-full bg-white border-2 border-black shadow-lg',
          sizeClasses[size],
          className
        )}
        animate={getMascotAnimation()}
      >
        {/* Minimalist face design */}
        <div className="relative w-full h-full flex items-center justify-center">
          {/* Eyes */}
          <div className={cn(
            'absolute top-1/4 left-1/4 bg-black rounded-full',
            eyeExpression.size,
            eyeExpression.shape === 'curved' && 'rounded-b-full border-t-0'
          )} />
          <div className={cn(
            'absolute top-1/4 right-1/4 bg-black rounded-full',
            eyeExpression.size,
            eyeExpression.shape === 'curved' && 'rounded-b-full border-t-0'
          )} />
          
          {/* Mouth */}
          <div className={cn(
            "absolute bottom-1/4 left-1/2 transform -translate-x-1/2",
            getMouthExpression()
          )} />

          {/* Special effects for celebrating */}
          {mood === 'celebrating' && (
            <motion.div
              className="absolute inset-0 rounded-full"
              animate={{
                boxShadow: [
                  '0 0 0 0 rgba(255, 255, 255, 0.7)',
                  '0 0 0 8px rgba(255, 255, 255, 0)',
                  '0 0 0 0 rgba(255, 255, 255, 0)'
                ]
              }}
              transition={{ duration: 1, repeat: 3 }}
            />
          )}
        </div>
      </motion.div>

      {/* Message bubble */}
      <AnimatePresence>
        {showMessage && message && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-white border-2 border-black rounded-lg px-3 py-1 text-xs font-medium text-black whitespace-nowrap shadow-lg"
          >
            {message}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
