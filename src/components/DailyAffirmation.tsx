
import React, { useState, useEffect } from "react";
import { Quote, RefreshCw } from "lucide-react";
import { useApp } from "@/context/AppContext";

const affirmations = [
  "I am capable of creating positive change in my life.",
  "My potential to succeed is limitless.",
  "Today, I choose progress over perfection.",
  "I have the power to overcome any obstacle.",
  "Every challenge helps me grow stronger.",
  "I embrace the journey of self-improvement.",
  "Each small step forward is meaningful.",
  "My discipline creates freedom in my life.",
  "I celebrate my progress, no matter how small.",
  "I am worthy of success and happiness.",
  "My focus determines my reality.",
  "I trust in my ability to figure things out.",
  "Today's efforts create tomorrow's achievements.",
  "I am becoming better every day.",
  "My resilience is stronger than any setback."
];

export const DailyAffirmation = () => {
  const { selectedTheme } = useApp();
  const [affirmation, setAffirmation] = useState<string>("");
  const [refreshing, setRefreshing] = useState<boolean>(false);
  
  useEffect(() => {
    // Get a random affirmation or use stored one
    const storedAffirmation = localStorage.getItem("dailyAffirmation");
    const storedDate = localStorage.getItem("affirmationDate");
    const today = new Date().toDateString();
    
    if (storedAffirmation && storedDate === today) {
      setAffirmation(storedAffirmation);
    } else {
      getNewAffirmation();
    }
  }, []);
  
  const getNewAffirmation = () => {
    setRefreshing(true);
    const randomIndex = Math.floor(Math.random() * affirmations.length);
    const newAffirmation = affirmations[randomIndex];
    
    // Save to localStorage
    localStorage.setItem("dailyAffirmation", newAffirmation);
    localStorage.setItem("affirmationDate", new Date().toDateString());
    
    // Fade effect
    setTimeout(() => {
      setAffirmation(newAffirmation);
      setRefreshing(false);
    }, 300);
  };
  
  return (
    <div 
      className="relative overflow-hidden backdrop-blur-xl bg-[#1E1E1E]/80 border border-white/10 rounded-xl p-4 shadow-lg transform-gpu"
      style={{ transform: 'translateZ(5px)' }}
    >
      <div className="absolute top-3 left-3">
        <Quote size={18} className="text-white/30" />
      </div>
      
      <div className="ml-7 mr-7">
        <h3 className="text-sm uppercase tracking-wider text-white/60 font-medium mb-1">Daily Affirmation</h3>
        <p className={`text-white text-base font-medium ${refreshing ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}>
          {affirmation}
        </p>
      </div>
      
      <button 
        onClick={getNewAffirmation}
        className="absolute top-3 right-3 text-white/50 hover:text-white transition-all active:scale-90"
        disabled={refreshing}
      >
        <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
      </button>
    </div>
  );
};
