
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle } from 'lucide-react';

interface CelebrationAnimationProps {
  show: boolean;
  onComplete?: () => void;
  type?: 'quest' | 'milestone' | 'achievement';
}

export const CelebrationAnimation: React.FC<CelebrationAnimationProps> = ({
  show,
  onComplete,
  type = 'quest'
}) => {
  const particleCount = type === 'achievement' ? 12 : 8;
  
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onAnimationComplete={() => onComplete?.()}
        >
          {/* Main celebration icon */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            transition={{ duration: 0.6, ease: "backOut" }}
            className="relative"
          >
            <CheckCircle size={80} className="text-white" />
          </motion.div>

          {/* Particle effects */}
          {Array.from({ length: particleCount }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-white rounded-full"
              initial={{
                x: 0,
                y: 0,
                scale: 0,
                opacity: 1
              }}
              animate={{
                x: Math.cos((i / particleCount) * Math.PI * 2) * 100,
                y: Math.sin((i / particleCount) * Math.PI * 2) * 100,
                scale: [0, 1, 0],
                opacity: [1, 1, 0]
              }}
              transition={{
                duration: 1.2,
                delay: 0.3,
                ease: "easeOut"
              }}
            />
          ))}

          {/* Text overlay */}
          <motion.div
            className="absolute bottom-1/3 text-center"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <p className="text-white font-semibold text-lg">
              {type === 'quest' && 'Quest Complete!'}
              {type === 'milestone' && 'Milestone Reached!'}
              {type === 'achievement' && 'Achievement Unlocked!'}
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
