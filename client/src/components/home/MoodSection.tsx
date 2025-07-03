
import React from 'react';
import { motion } from 'framer-motion';
import { CollapsibleSection } from './CollapsibleSection';
import { MoodButton } from './MoodButton';

interface Mood {
  emoji: string;
  label: string;
  description?: string;
}

interface MoodSectionProps {
  moods: Mood[];
  selectedMood: string | null;
  setSelectedMood: (mood: string | null) => void;
}

export const MoodSection: React.FC<MoodSectionProps> = ({ 
  moods, 
  selectedMood, 
  setSelectedMood 
}) => {
  return (
    <CollapsibleSection title="How are you feeling today?">
      <div className="space-y-4">
        <p className="text-sm text-white/70 leading-relaxed mb-6">
          Understanding your emotional state helps us provide better guidance and track your wellbeing patterns over time.
        </p>
        
        <div className="grid grid-cols-1 gap-4">
          {moods.map((mood) => (
            <motion.div
              key={mood.label}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <button
                onClick={() => setSelectedMood(selectedMood === mood.label ? null : mood.label)}
                className={`w-full p-5 rounded-xl border transition-all duration-300 text-left ${
                  selectedMood === mood.label
                    ? 'bg-white/20 border-white/30 shadow-lg'
                    : 'bg-white/8 border-white/15 hover:bg-white/12 hover:border-white/20'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="text-3xl">{mood.emoji}</div>
                  <div className="flex-1">
                    <div className="text-lg font-semibold text-white mb-1">
                      {mood.label}
                    </div>
                    {mood.description && (
                      <div className="text-sm text-white/70">
                        {mood.description}
                      </div>
                    )}
                  </div>
                  {selectedMood === mood.label && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-6 h-6 rounded-full bg-white flex items-center justify-center"
                    >
                      <div className="w-2 h-2 rounded-full bg-black" />
                    </motion.div>
                  )}
                </div>
              </button>
            </motion.div>
          ))}
        </div>
        
        {selectedMood && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-4 bg-white/10 rounded-xl border border-white/20"
          >
            <p className="text-sm text-white/80">
              Thanks for sharing! We'll keep track of your mood patterns to help you understand what affects your wellbeing.
            </p>
          </motion.div>
        )}
      </div>
    </CollapsibleSection>
  );
};
