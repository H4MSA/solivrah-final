
import React, { useState, useEffect } from "react";
import { FiRefreshCw, FiShare2 } from "react-icons/fi";
import { useApp } from "@/context/AppContext";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";

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
  
  // Theme-specific colors
  const getThemeColor = () => {
    switch (selectedTheme) {
      case "Discipline": return "rgba(255, 0, 0, 0.2)";
      case "Focus": return "rgba(0, 128, 128, 0.2)";
      case "Resilience": return "rgba(255, 165, 0, 0.2)";
      case "Wildcards": return "rgba(0, 255, 0, 0.2)";
      default: return "rgba(255, 255, 255, 0.1)";
    }
  };
  
  if (!affirmation) {
    return null;
  }
  
  return (
    <div className="relative mb-3 animate-fade-in">
      <div 
        className="w-full relative backdrop-blur-xl bg-black/30 border border-white/10 rounded-full py-1.5 px-3 overflow-hidden shadow-lg"
        style={{ boxShadow: `0 0 15px ${getThemeColor()}` }}
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
        
        <div className="flex items-center justify-between z-10 relative">
          <span className="text-white/90 text-xs font-medium italic truncate mr-2 flex-1">{affirmation}</span>
          
          <div className="flex gap-1 shrink-0">
            <button 
              onClick={refreshAffirmation}
              className="p-1 rounded-full bg-black/50 text-white hover:bg-black/70 transition-all transform hover:scale-110 active:scale-95"
              aria-label="Refresh affirmation"
            >
              <FiRefreshCw size={10} />
            </button>
            <button 
              onClick={shareAffirmation}
              className="p-1 rounded-full bg-black/50 text-white hover:bg-black/70 transition-all transform hover:scale-110 active:scale-95"
              aria-label="Share affirmation"
            >
              <FiShare2 size={10} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
