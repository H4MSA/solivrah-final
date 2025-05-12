import React, { useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useVirtualList } from '@/hooks/useVirtualList';
import { GlassCard } from './GlassCard';
import { FiCheck, FiLock } from 'react-icons/fi';
import { useMemoized } from '@/hooks/useMemoized';

// Define Quest interface
interface Quest {
  id: number;
  day: number;
  title: string;
  description: string;
  status: "completed" | "active" | "locked";
  xp: number;
  requiresPhoto: boolean;
  theme: string;
}

interface VirtualizedQuestListProps {
  quests: Quest[];
  onQuestClick: (quest: Quest) => void;
  className?: string;
  showAllQuests?: boolean;
  containerHeight?: string | number;
}

export const VirtualizedQuestList: React.FC<VirtualizedQuestListProps> = ({
  quests,
  onQuestClick,
  className,
  showAllQuests = true,
  containerHeight = '70vh'
}) => {
  // Setup refs for container
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Memoize the filtered quests to prevent unnecessary recalculations
  const displayedQuests = useMemoized(() => {
    return showAllQuests ? quests : quests.slice(0, 5);
  }, [quests, showAllQuests]);
  
  // Use our custom virtualized list hook
  const {
    visibleItems,
    containerProps,
    itemProps,
    totalHeight,
    isScrolling
  } = useVirtualList<Quest>({
    items: displayedQuests,
    estimatedItemHeight: 140, // Approximate height of a quest card
    overscan: 3, // Number of items to render above/below viewport
    getItemKey: (item) => item.id
  });
  
  // Render each quest item
  const renderQuestItem = useCallback(({ item, index, measureRef }: { 
    item: Quest, 
    index: number,
    measureRef: (el: HTMLElement | null) => void 
  }) => {
    // Determine status-based styles
    const statusClass = item.status === "locked" 
      ? "opacity-50" 
      : item.status === "completed" 
        ? "border-green-500/20 bg-green-500/10" 
        : "border-white/20";
    
    const isLocked = item.status === "locked";
    
    return (
      <div 
        {...itemProps(index)}
        key={item.id}
        ref={measureRef}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
          layout
          className="py-1 px-2"
        >
          <GlassCard 
            interactive={!isLocked}
            onClick={() => !isLocked && onQuestClick(item)}
            className={`relative ${statusClass}`}
            depth={item.status === "active" ? "high" : "low"}
            hoverEffect={item.status !== "locked"}
            ariaLabel={`${item.title} - Day ${item.day}`}
            role="button"
            animate="none" // Disable the default animations for better performance
          >
            <div className="absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center">
              {item.status === "completed" ? (
                <FiCheck className="text-green-400" size={18} />
              ) : item.status === "locked" ? (
                <FiLock className="text-white/40" size={16} />
              ) : null}
            </div>
            
            <div className="flex flex-col">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="flex items-center justify-center w-7 h-7 rounded-full bg-white/10 mr-2">
                    <span className="text-xs font-medium">{item.day}</span>
                  </div>
                  <h3 className="text-sm font-medium">{item.title}</h3>
                </div>
              </div>
              
              <p className="text-xs text-white/70 mt-2 line-clamp-2">
                {item.description}
              </p>
              
              <div className="flex items-center mt-3 text-xs">
                <div className="flex items-center bg-white/10 px-2 py-1 rounded">
                  <span className="text-yellow-300 mr-1">★</span>
                  <span>{item.xp} XP</span>
                </div>
                
                {item.requiresPhoto && (
                  <div className="flex items-center bg-white/10 px-2 py-1 rounded ml-2">
                    <span>📷 Photo</span>
                  </div>
                )}
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    );
  }, [onQuestClick, itemProps]);
  
  return (
    <div 
      className={className}
      style={{ 
        height: containerHeight, 
        position: 'relative', 
        overflow: 'hidden'
      }}
    >
      <div
        {...containerProps}
        style={{
          ...containerProps.style,
          height: containerHeight,
          willChange: isScrolling ? 'transform' : 'auto', // Optimize for GPU during scrolling
        }}
      >
        <div style={{ height: `${totalHeight}px`, position: 'relative' }}>
          {visibleItems.map(renderQuestItem)}
        </div>
      </div>
      
      {displayedQuests.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-white/60">No quests to display</p>
        </div>
      )}
    </div>
  );
}; 