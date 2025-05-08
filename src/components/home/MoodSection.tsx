
import React from "react";
import { CollapsibleSection } from "./CollapsibleSection";
import { MoodButton } from "./MoodButton";

interface MoodSectionProps {
  moods: Array<{ emoji: string, label: string }>;
  selectedMood: string | null;
  setSelectedMood: (mood: string) => void;
}

export const MoodSection: React.FC<MoodSectionProps> = ({ moods, selectedMood, setSelectedMood }) => (
  <CollapsibleSection 
    title="How do you feel today?" 
    defaultOpen={true}
    rightLabel="Daily check-in"
  >
    <div className="grid grid-cols-3 gap-2">
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
