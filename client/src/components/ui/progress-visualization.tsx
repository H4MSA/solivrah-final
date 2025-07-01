
import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ProgressVisualizationProps {
  progress: number; // 0-100
  type?: 'tree' | 'building' | 'mountain' | 'path';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  animated?: boolean;
}

export const ProgressVisualization: React.FC<ProgressVisualizationProps> = ({
  progress,
  type = 'tree',
  size = 'md',
  className,
  animated = true
}) => {
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32'
  };

  const renderTree = () => {
    const leafCount = Math.floor((progress / 100) * 12);
    
    return (
      <div className="relative w-full h-full flex items-end justify-center">
        {/* Tree trunk */}
        <motion.div
          className="w-2 bg-[#666] rounded-t-sm"
          style={{ height: '30%' }}
          initial={{ height: 0 }}
          animate={{ height: '30%' }}
          transition={{ duration: 0.5 }}
        />
        
        {/* Tree crown */}
        <motion.div
          className="absolute bottom-1/4 left-1/2 transform -translate-x-1/2 w-full h-3/4 rounded-full bg-[#999] flex items-center justify-center flex-wrap"
          initial={{ scale: 0 }}
          animate={{ scale: progress > 10 ? 1 : 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          {/* Leaves/fruits representing progress */}
          {Array.from({ length: 12 }).map((_, i) => (
            <motion.div
              key={i}
              className="w-1 h-1 bg-white rounded-full m-0.5"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ 
                scale: i < leafCount ? 1 : 0,
                opacity: i < leafCount ? 1 : 0 
              }}
              transition={{ 
                delay: 0.7 + (i * 0.1),
                duration: 0.2 
              }}
            />
          ))}
        </motion.div>
      </div>
    );
  };

  const renderBuilding = () => {
    const floors = Math.floor((progress / 100) * 8);
    
    return (
      <div className="relative w-full h-full flex items-end justify-center">
        {/* Building base */}
        <div className="w-3/4 flex flex-col items-center">
          {Array.from({ length: 8 }).map((_, i) => (
            <motion.div
              key={i}
              className="w-full h-2 bg-[#666] border border-[#333] mb-0.5"
              initial={{ scaleY: 0, opacity: 0 }}
              animate={{ 
                scaleY: i < floors ? 1 : 0,
                opacity: i < floors ? 1 : 0 
              }}
              transition={{ 
                delay: i * 0.2,
                duration: 0.3 
              }}
              style={{ transformOrigin: 'bottom' }}
            />
          ))}
        </div>
      </div>
    );
  };

  const renderMountain = () => {
    const pathProgress = progress / 100;
    
    return (
      <div className="relative w-full h-full">
        {/* Mountain silhouette */}
        <div className="absolute bottom-0 w-full h-3/4 bg-[#666]" 
             style={{ clipPath: 'polygon(0% 100%, 50% 0%, 100% 100%)' }} />
        
        {/* Progress path */}
        <motion.div
          className="absolute bottom-0 left-0 w-1 h-full bg-white rounded-full"
          style={{
            left: `${pathProgress * 50}%`,
            bottom: `${pathProgress * 75}%`,
          }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        />
        
        {/* Flag at the top */}
        {progress >= 100 && (
          <motion.div
            className="absolute top-0 left-1/2 transform -translate-x-1/2 w-2 h-3 bg-white"
            initial={{ scale: 0, y: 10 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.4 }}
          />
        )}
      </div>
    );
  };

  const renderPath = () => {
    const segments = 10;
    const completedSegments = Math.floor((progress / 100) * segments);
    
    return (
      <div className="relative w-full h-full flex items-center">
        <div className="w-full h-1 bg-[#333] rounded-full relative overflow-hidden">
          {Array.from({ length: segments }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute top-0 h-full bg-white"
              style={{
                left: `${(i / segments) * 100}%`,
                width: `${100 / segments}%`
              }}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: i < completedSegments ? 1 : 0 }}
              transition={{ 
                delay: i * 0.1,
                duration: 0.3 
              }}
            />
          ))}
        </div>
        
        {/* Moving indicator */}
        <motion.div
          className="absolute w-3 h-3 bg-white rounded-full border-2 border-black"
          style={{ left: `${progress}%` }}
          initial={{ x: '-50%' }}
          animate={{ x: '-50%' }}
          transition={{ duration: 0.5 }}
        />
      </div>
    );
  };

  const renderVisualization = () => {
    switch (type) {
      case 'tree':
        return renderTree();
      case 'building':
        return renderBuilding();
      case 'mountain':
        return renderMountain();
      case 'path':
        return renderPath();
      default:
        return renderTree();
    }
  };

  return (
    <motion.div
      className={cn(
        'relative flex items-center justify-center bg-[#1A1A1A] border border-[#333] rounded-xl p-4',
        sizeClasses[size],
        className
      )}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      {renderVisualization()}
      
      {/* Progress percentage */}
      <div className="absolute bottom-1 right-1 text-xs text-white/70 font-medium">
        {Math.round(progress)}%
      </div>
    </motion.div>
  );
};
