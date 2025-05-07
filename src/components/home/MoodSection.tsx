
import React from "react";
import { CollapsibleSection } from "./CollapsibleSection";
import { MoodButton } from "./MoodButton";

interface MoodSectionProps {
  moods: Array<{ emoji: string, label: string }>;
  selectedMood: string | null;
  setSelectedMood: (mood: string) => void;
}

export const MoodSection: React.FC<MoodSectionProps> = ({ moods, selectedMood, setSelectedMood }) => (
  <CollapsibleSection title="How do you feel today?" defaultOpen={true}>
    <div className="flex justify-end mb-2">
      <span className="text-xs text-white/70 bg-white/5 px-2 py-1 rounded-full border border-white/5">Daily check-in</span>
    </div>
    
    <div className="grid grid-cols-3 gap-3">
      {moods.map((mood) => (
        <MoodButton 
          key={mood.label} 
          emoji={mood.emoji} 
          label={mood.label} 
          selected={selectedMood === mood.label}
          onClick={() => setSelectedMood(mood.label)}
        />
      ))}
    </div>
  </CollapsibleSection>
);
