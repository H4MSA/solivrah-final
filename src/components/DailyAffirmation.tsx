
import React, { useState, useEffect } from "react";
import { Quote, RefreshCw } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { AIService } from "@/services/AIService";
import { motion } from "framer-motion";

// More impactful affirmations based on themes
const themeAffirmations = {
  Focus: [
    "I direct my focus with intention and purpose.",
    "My mind is clear, focused, and ready for any challenge.",
    "I choose where my attention goes, and it serves my highest goals.",
    "With each deep breath, my focus strengthens and sharpens.",
    "I am fully present in this moment, exactly where I need to be.",
  ],
  Fitness: [
    "My body grows stronger with every effort I make.",
    "I honor my body by challenging its limits and respecting its needs.",
    "Each choice I make today builds the healthier future I deserve.",
    "My commitment to myself is unwavering; I show up for my health.",
    "My strength is not just physical—it flows from mind to body and back.",
  ],
  Mindfulness: [
    "I am grounded in the present, aware of all that surrounds and fills me.",
    "Peace begins with this breath, this moment, this awareness.",
    "I observe my thoughts without judgment, letting what doesn't serve me flow away.",
    "The wisdom I seek has always been within me, waiting for stillness.",
    "In the space between thoughts, I find my truest self.",
  ],
  Learning: [
    "My mind expands with each new idea I encounter.",
    "I transform challenges into opportunities for profound growth.",
    "The curiosity that drives me is my greatest strength.",
    "Every question leads me closer to the wisdom I seek.",
    "I am becoming more capable and insightful with each day.",
  ],
  Discipline: [
    "I am the architect of my habits and the master of my actions.",
    "My willpower grows stronger each time I choose long-term fulfillment over instant gratification.",
    "Consistency is my superpower—small daily actions create extraordinary results.",
    "I follow through on commitments to myself with the same respect I show others.",
    "The discipline I practice today creates freedom for my future self.",
  ],
  Default: [
    "I am capable of remarkable growth and transformation.",
    "The path forward becomes clear when I take the first step.",
    "I have everything I need within me to create the life I desire.",
    "My potential is limitless when I align my actions with my purpose.",
    "Today I choose progress over perfection.",
  ]
};

export const DailyAffirmation = () => {
  const { selectedTheme, user } = useApp();
  const [affirmation, setAffirmation] = useState<string>("");
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  
  const aiService = new AIService();
  
  useEffect(() => {
    // Get a personalized affirmation or use stored one
    const storedAffirmation = localStorage.getItem("dailyAffirmation");
    const storedDate = localStorage.getItem("affirmationDate");
    const today = new Date().toDateString();
    
    if (storedAffirmation && storedDate === today) {
      setAffirmation(storedAffirmation);
    } else {
      getNewAffirmation();
    }
  }, [selectedTheme]);
  
  const getNewAffirmation = async () => {
    setRefreshing(true);
    setError(false);
    
    try {
      // Try to get AI-generated affirmation first
      const username = user?.user_metadata?.username || user?.email?.split('@')[0] || "";
      const userMood = localStorage.getItem("currentMood") || "";
      
      // Use AI service to generate personalized affirmation
      const newAffirmation = await aiService.generateDailyAffirmation(
        selectedTheme,
        username,
        userMood
      );
      
      // Save to localStorage
      localStorage.setItem("dailyAffirmation", newAffirmation);
      localStorage.setItem("affirmationDate", new Date().toDateString());
      
      // Update state
      setAffirmation(newAffirmation);
    } catch (err) {
      console.error("Failed to generate affirmation:", err);
      setError(true);
      
      // Fall back to our theme-based curated affirmations
      const theme = selectedTheme || "Default";
      const affirmations = themeAffirmations[theme as keyof typeof themeAffirmations] || 
                         themeAffirmations.Default;
      
      const randomIndex = Math.floor(Math.random() * affirmations.length);
      const fallbackAffirmation = affirmations[randomIndex];
      
      setAffirmation(fallbackAffirmation);
      
      // Still save to localStorage to prevent repeated attempts
      localStorage.setItem("dailyAffirmation", fallbackAffirmation);
      localStorage.setItem("affirmationDate", new Date().toDateString());
    } finally {
      setRefreshing(false);
    }
  };
  
  return (
    <div 
      className="relative overflow-hidden bg-[#1A1A1A] border border-[#333333] rounded-xl p-3 shadow-sm mb-4"
    >
      <div className="absolute top-3 left-3">
        <Quote size={14} className="text-white/30" />
      </div>
      
      <div className="ml-6 mr-6">
        <h3 className="text-xs uppercase tracking-wider text-white/60 font-medium mb-1.5 flex items-center gap-1">
          <span className="w-1 h-1 rounded-full bg-purple-400/70 inline-block"></span>
          <span>Daily Affirmation</span>
        </h3>
        
        <motion.p 
          key={affirmation}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className={`text-white text-sm font-medium ${refreshing ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        >
          {affirmation}
        </motion.p>
        
        {error && !refreshing && (
          <p className="text-xs text-white/50 mt-1">Offline mode</p>
        )}
      </div>
      
      <button 
        onClick={getNewAffirmation}
        className="absolute top-2 right-2 text-white/50 hover:text-white hover:bg-white/10 transition-all active:scale-90 p-1 rounded-full"
        disabled={refreshing}
      >
        <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} />
      </button>
    </div>
  );
};
