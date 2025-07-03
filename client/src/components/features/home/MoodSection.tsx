import React from 'react';
import { motion } from 'framer-motion';

interface Mood {
  emoji: string;
  label: string;
}

interface MoodSectionProps {
  moods: Mood[];
  selectedMood: string | null;
  setSelectedMood: (mood: string) => void;
}

export const MoodSection: React.FC<MoodSectionProps> = ({
  moods,
  selectedMood,
  setSelectedMood
}) => {
  return (
    <motion.div 
      className="mb-4 bg-[#151515] p-4 rounded-xl border border-[#333333]"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
    >
      <h3 className="text-sm font-semibold mb-3">How do you feel today?</h3>
      
      <div className="flex justify-between items-center">
        {moods.map((mood) => (
          <button
            key={mood.label}
            onClick={() => setSelectedMood(mood.label)}
            className={`flex flex-col items-center justify-center p-3 rounded-lg transition-all ${
              selectedMood === mood.label 
                ? 'bg-white text-black' 
                : 'bg-[#1A1A1A] text-white hover:bg-[#222222] border border-[#333333]'
            }`}
          >
            <span className="text-2xl mb-1">{mood.emoji}</span>
            <span className="text-xs">{mood.label}</span>
          </button>
        ))}
      </div>
    </motion.div>
  );
};
