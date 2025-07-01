
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ParticleCelebrationProps {
  show: boolean;
  onComplete?: () => void;
  intensity?: 'low' | 'medium' | 'high';
  type?: 'stars' | 'confetti' | 'sparkles';
}

export const ParticleCelebration: React.FC<ParticleCelebrationProps> = ({
  show,
  onComplete,
  intensity = 'medium',
  type = 'stars'
}) => {
  const particleCount = {
    low: 8,
    medium: 16,
    high: 24
  };

  const getParticleShape = (index: number) => {
    switch (type) {
      case 'stars':
        return (
          <div className="w-2 h-2 bg-white transform rotate-45" 
               style={{ clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)' }} />
        );
      case 'confetti':
        return <div className={`w-3 h-1 bg-white rounded ${index % 2 === 0 ? 'bg-[#ccc]' : 'bg-white'}`} />;
      case 'sparkles':
        return <div className="w-1 h-1 bg-white rounded-full" />;
      default:
        return <div className="w-2 h-2 bg-white rounded-full" />;
    }
  };

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
          {Array.from({ length: particleCount[intensity] }).map((_, i) => {
            const angle = (i / particleCount[intensity]) * Math.PI * 2;
            const distance = 80 + Math.random() * 40;
            const x = Math.cos(angle) * distance;
            const y = Math.sin(angle) * distance;
            
            return (
              <motion.div
                key={i}
                className="absolute"
                initial={{
                  x: 0,
                  y: 0,
                  scale: 0,
                  opacity: 1,
                  rotate: 0
                }}
                animate={{
                  x: x,
                  y: y,
                  scale: [0, 1, 0.5, 0],
                  opacity: [1, 1, 0.7, 0],
                  rotate: [0, 180, 360]
                }}
                transition={{
                  duration: 1.5,
                  delay: i * 0.05,
                  ease: "easeOut"
                }}
              >
                {getParticleShape(i)}
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
