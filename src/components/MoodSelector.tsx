import { motion } from 'framer-motion';
import { useState } from 'react';
import { useApp } from '@/context/AppContext';

interface Mood {
  id: string;
  name: string;
  emoji: string;
  color: string;
  description: string;
  gradient: string;
}

const moods: Mood[] = [
  {
    id: 'energetic',
    name: 'Energetic',
    emoji: '⚡',
    color: 'text-yellow-400',
    description: 'Ready to take on the world',
    gradient: 'from-yellow-400 to-orange-500'
  },
  {
    id: 'calm',
    name: 'Calm',
    emoji: '🧘',
    color: 'text-calm-400',
    description: 'Peaceful and centered',
    gradient: 'from-calm-400 to-calm-600'
  },
  {
    id: 'focused',
    name: 'Focused',
    emoji: '🎯',
    color: 'text-blue-400',
    description: 'Sharp and determined',
    gradient: 'from-blue-400 to-blue-600'
  },
  {
    id: 'creative',
    name: 'Creative',
    emoji: '🎨',
    color: 'text-purple-400',
    description: 'Inspired and imaginative',
    gradient: 'from-purple-400 to-pink-500'
  },
  {
    id: 'grateful',
    name: 'Grateful',
    emoji: '🙏',
    color: 'text-green-400',
    description: 'Appreciative and thankful',
    gradient: 'from-green-400 to-emerald-500'
  },
  {
    id: 'reflective',
    name: 'Reflective',
    emoji: '🤔',
    color: 'text-indigo-400',
    description: 'Thoughtful and introspective',
    gradient: 'from-indigo-400 to-purple-500'
  },
  {
    id: 'stressed',
    name: 'Stressed',
    emoji: '😰',
    color: 'text-red-400',
    description: 'Feeling overwhelmed',
    gradient: 'from-red-400 to-red-600'
  },
  {
    id: 'content',
    name: 'Content',
    emoji: '😌',
    color: 'text-serenity-400',
    description: 'Satisfied and at peace',
    gradient: 'from-serenity-400 to-serenity-600'
  }
];

interface MoodSelectorProps {
  onMoodSelect?: (mood: Mood) => void;
  selectedMood?: string;
  size?: 'small' | 'medium' | 'large';
  layout?: 'grid' | 'circle';
}

export const MoodSelector = ({ 
  onMoodSelect, 
  selectedMood, 
  size = 'medium',
  layout = 'circle'
}: MoodSelectorProps) => {
  const [hoveredMood, setHoveredMood] = useState<string | null>(null);
  const { addXP } = useApp();

  const handleMoodSelect = (mood: Mood) => {
    onMoodSelect?.(mood);
    addXP(5); // Award XP for mood tracking
  };

  const sizeClasses = {
    small: 'w-12 h-12 text-lg',
    medium: 'w-16 h-16 text-2xl',
    large: 'w-20 h-20 text-3xl'
  };

  if (layout === 'grid') {
    return (
      <div className="grid grid-cols-4 gap-4 p-4">
        {moods.map((mood, index) => (
          <motion.button
            key={mood.id}
            className={`
              ${sizeClasses[size]} 
              mood-button relative overflow-hidden rounded-2xl
              ${selectedMood === mood.id ? 'ring-2 ring-white/50' : ''}
            `}
            style={{
              background: hoveredMood === mood.id 
                ? `linear-gradient(135deg, var(--tw-gradient-stops))` 
                : undefined
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.3 }}
            onHoverStart={() => setHoveredMood(mood.id)}
            onHoverEnd={() => setHoveredMood(null)}
            onClick={() => handleMoodSelect(mood)}
          >
            <span className="relative z-10">{mood.emoji}</span>
            
            {/* Hover gradient overlay */}
            <motion.div
              className={`absolute inset-0 bg-gradient-to-br ${mood.gradient} opacity-0`}
              animate={{ opacity: hoveredMood === mood.id ? 0.2 : 0 }}
              transition={{ duration: 0.2 }}
            />
            
            {/* Selection indicator */}
            {selectedMood === mood.id && (
              <motion.div
                className="absolute inset-0 bg-white/10 rounded-2xl"
                layoutId="moodSelection"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
          </motion.button>
        ))}
      </div>
    );
  }

  // Circle layout
  const radius = size === 'large' ? 120 : size === 'medium' ? 100 : 80;
  const centerX = radius + 40;
  const centerY = radius + 40;

  return (
    <div 
      className="relative mx-auto"
      style={{ 
        width: (radius + 40) * 2, 
        height: (radius + 40) * 2 
      }}
    >
      {/* Center circle with selected mood */}
      <motion.div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5, type: "spring", bounce: 0.3 }}
      >
        <div className="w-24 h-24 glass-card rounded-full flex flex-col items-center justify-center">
          {selectedMood ? (
            <>
              <span className="text-3xl mb-1">
                {moods.find(m => m.id === selectedMood)?.emoji}
              </span>
              <span className="text-xs text-gray-400 font-medium">
                {moods.find(m => m.id === selectedMood)?.name}
              </span>
            </>
          ) : (
            <>
              <span className="text-2xl mb-1">😊</span>
              <span className="text-xs text-gray-400">How are you?</span>
            </>
          )}
        </div>
      </motion.div>

      {/* Mood options in circle */}
      {moods.map((mood, index) => {
        const angle = (index / moods.length) * 2 * Math.PI - Math.PI / 2;
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);

        return (
          <motion.button
            key={mood.id}
            className={`
              absolute ${sizeClasses[size]} mood-button rounded-full
              ${selectedMood === mood.id ? 'ring-2 ring-white/50' : ''}
            `}
            style={{
              left: x - (size === 'large' ? 40 : size === 'medium' ? 32 : 24),
              top: y - (size === 'large' ? 40 : size === 'medium' ? 32 : 24),
            }}
            initial={{ 
              scale: 0, 
              x: centerX - x, 
              y: centerY - y 
            }}
            animate={{ 
              scale: 1, 
              x: 0, 
              y: 0 
            }}
            transition={{ 
              delay: index * 0.1, 
              type: "spring", 
              bounce: 0.4,
              duration: 0.6 
            }}
            whileHover={{ 
              scale: 1.2,
              zIndex: 10
            }}
            whileTap={{ scale: 0.9 }}
            onHoverStart={() => setHoveredMood(mood.id)}
            onHoverEnd={() => setHoveredMood(null)}
            onClick={() => handleMoodSelect(mood)}
          >
            <span className="relative z-10">{mood.emoji}</span>
            
            {/* Tooltip */}
            {hoveredMood === mood.id && (
              <motion.div
                className="absolute -top-12 left-1/2 transform -translate-x-1/2 z-20"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
              >
                <div className="glass-card px-3 py-2 rounded-lg text-xs whitespace-nowrap">
                  <div className="font-medium text-white">{mood.name}</div>
                  <div className="text-gray-400">{mood.description}</div>
                </div>
              </motion.div>
            )}
            
            {/* Selection indicator */}
            {selectedMood === mood.id && (
              <motion.div
                className="absolute inset-0 bg-white/20 rounded-full"
                layoutId="circularMoodSelection"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
          </motion.button>
        );
      })}

      {/* Connecting lines (subtle) */}
      <svg 
        className="absolute inset-0 pointer-events-none"
        width={(radius + 40) * 2}
        height={(radius + 40) * 2}
      >
        {moods.map((_, index) => {
          const angle = (index / moods.length) * 2 * Math.PI - Math.PI / 2;
          const x = centerX + radius * Math.cos(angle);
          const y = centerY + radius * Math.sin(angle);
          
          return (
            <motion.line
              key={index}
              x1={centerX}
              y1={centerY}
              x2={x}
              y2={y}
              stroke="rgba(255,255,255,0.05)"
              strokeWidth="1"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 0.8 + index * 0.05, duration: 0.5 }}
            />
          );
        })}
      </svg>
    </div>
  );
};

export default MoodSelector;
