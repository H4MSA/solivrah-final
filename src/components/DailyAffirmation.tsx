
import React, { useState, useEffect } from "react";
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
  const [shinePosition, setShinePosition] = useState(-100);
  
  useEffect(() => {
    // Select an affirmation based on the day of the year (so it's consistent for the day)
    const dayOfYear = Math.floor((new Date().getTime() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
    const index = dayOfYear % affirmations.length;
    setAffirmation(affirmations[index]);
    
    // Set up the shine animation
    const shineInterval = setInterval(() => {
      setShinePosition(-100);
      setTimeout(() => {
        setShinePosition(100);
      }, 100);
    }, 5000);
    
    return () => clearInterval(shineInterval);
  }, []);
  
  const refreshAffirmation = () => {
    // Pick a random affirmation different from the current one
    let index;
    do {
      index = Math.floor(Math.random() * affirmations.length);
    } while (affirmations[index] === affirmation);
    setAffirmation(affirmations[index]);
    
    // Trigger shine effect
    setShinePosition(-100);
    setTimeout(() => {
      setShinePosition(100);
    }, 100);
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
  
  // Theme-specific styles
  const getThemeGlow = () => {
    switch (selectedTheme) {
      case "Discipline": return "rgba(255, 0, 0, 0.1)";
      case "Focus": return "rgba(0, 128, 128, 0.1)";
      case "Resilience": return "rgba(255, 165, 0, 0.1)";
      case "Wildcards": return "rgba(0, 255, 0, 0.1)";
      default: return "rgba(255, 255, 255, 0.1)";
    }
  };
  
  if (!affirmation) {
    return null;
  }
  
  return (
    <div 
      className="w-full relative backdrop-blur-sm bg-black/40 border border-white/10 rounded-full p-2.5 overflow-hidden animate-fade-in shadow-lg"
      style={{ boxShadow: `0 0 15px ${getThemeGlow()}` }}
    >
      {/* Shine effect overlay */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)",
          transform: `translateX(${shinePosition}%)`,
          transition: "transform 1s ease-in-out",
        }}
      />
      
      <div className="flex items-center justify-between z-10 relative px-3">
        <span className="text-white/90 text-sm font-medium italic truncate mr-2 flex-1">{affirmation}</span>
        
        <div className="flex gap-1 shrink-0">
          <button 
            onClick={refreshAffirmation}
            className="p-1 rounded-full bg-[#222222] text-white hover:bg-[#333333] transition-all"
            aria-label="Refresh affirmation"
          >
            <FiRefreshCw size={12} />
          </button>
          <button 
            onClick={shareAffirmation}
            className="p-1 rounded-full bg-[#222222] text-white hover:bg-[#333333] transition-all"
            aria-label="Share affirmation"
          >
            <FiShare2 size={12} />
          </button>
        </div>
      </div>
    </div>
  );
};
