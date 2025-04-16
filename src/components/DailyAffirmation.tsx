
import React, { useState, useEffect } from "react";
import { GlassCard } from "@/components/GlassCard";
import { FiRefreshCw, FiShare2 } from "react-icons/fi";
import { useApp } from "@/context/AppContext";

// Predefined list of affirmations
const affirmations = [
  "You are capable of amazing things.",
  "Every small step takes you closer to your goals.",
  "Your discipline today creates freedom tomorrow.",
  "Focus on progress, not perfection.",
  "Resilience is your superpower.",
  "You have the strength to overcome any obstacle.",
  "Consistency compounds over time.",
  "Your creativity knows no bounds.",
  "Today's challenges are tomorrow's strengths.",
  "You are in control of your habits and choices.",
  "Small daily improvements lead to stunning results.",
  "Your potential is limitless.",
  "Every moment is a chance to begin again.",
  "Trust the process. Growth takes time.",
  "You are stronger than your excuses."
];

export const DailyAffirmation: React.FC = () => {
  const { selectedTheme } = useApp();
  const [affirmation, setAffirmation] = useState("");
  
  useEffect(() => {
    // Select an affirmation based on the day of the year (so it's consistent for the day)
    const dayOfYear = Math.floor((new Date().getTime() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
    const index = dayOfYear % affirmations.length;
    setAffirmation(affirmations[index]);
  }, []);
  
  const refreshAffirmation = () => {
    // Pick a random affirmation different from the current one
    let index;
    do {
      index = Math.floor(Math.random() * affirmations.length);
    } while (affirmations[index] === affirmation);
    setAffirmation(affirmations[index]);
  };
  
  const shareAffirmation = () => {
    // In a real app, this would use the native share API
    if (navigator.share) {
      navigator.share({
        title: "My Daily Affirmation",
        text: affirmation,
        url: "https://solivrah.app"
      }).catch(console.error);
    } else {
      // Fallback
      alert("Copied to clipboard: " + affirmation);
      navigator.clipboard.writeText(affirmation).catch(console.error);
    }
  };
  
  if (!affirmation) {
    return null;
  }
  
  return (
    <GlassCard className="py-6 px-4">
      <div className="flex flex-col items-center text-center">
        <h2 className="text-lg font-medium mb-1">Daily Affirmation</h2>
        <p className="text-white text-lg font-medium mb-4 italic">"{affirmation}"</p>
        
        <div className="flex gap-4">
          <button 
            onClick={refreshAffirmation}
            className="p-2 rounded-full bg-secondary/20 text-white hover:bg-secondary/30 transition-all"
            aria-label="Refresh affirmation"
          >
            <FiRefreshCw />
          </button>
          <button 
            onClick={shareAffirmation}
            className="p-2 rounded-full bg-secondary/20 text-white hover:bg-secondary/30 transition-all"
            aria-label="Share affirmation"
          >
            <FiShare2 />
          </button>
        </div>
      </div>
    </GlassCard>
  );
};
