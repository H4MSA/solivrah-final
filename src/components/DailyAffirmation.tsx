
import React, { useState, useEffect } from "react";
import { Quote, RefreshCw } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { AIService } from "@/services/AIService";
import { motion } from "framer-motion";

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
      // Get user's information for personalization
      const username = user?.user_metadata?.username || user?.email?.split('@')[0] || "";
      
      // Get user's mood from local storage if available
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
      
      // Fallback to default affirmation if API call fails
      const fallbacks = [
        "I am capable of growth.",
        "Progress over perfection.",
        "I embrace challenges.",
        "Today's efforts shape tomorrow.",
        "My potential is limitless.",
      ];
      const randomIndex = Math.floor(Math.random() * fallbacks.length);
      setAffirmation(fallbacks[randomIndex]);
    } finally {
      setRefreshing(false);
    }
  };
  
  return (
    <motion.div 
      className="relative overflow-hidden backdrop-blur-xl bg-gradient-to-br from-[#1E1E1E]/90 to-[#2A2A2A]/80 border border-white/10 rounded-xl p-4 shadow-lg"
      whileHover={{ scale: 1.01, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <div className="absolute top-3 left-3">
        <Quote size={18} className="text-white/30" />
      </div>
      
      <div className="ml-7 mr-7">
        <h3 className="text-sm uppercase tracking-wider text-white/60 font-medium mb-2 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-purple-400/70 inline-block"></span>
          <span>Daily Affirmation</span>
        </h3>
        
        <motion.p 
          key={affirmation} // Key helps with animation when content changes
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className={`text-white text-base font-medium ${refreshing ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        >
          {affirmation}
        </motion.p>
        
        {error && !refreshing && (
          <p className="text-xs text-white/50 mt-1">Offline mode</p>
        )}
      </div>
      
      <button 
        onClick={getNewAffirmation}
        className="absolute top-3 right-3 text-white/50 hover:text-white hover:bg-white/10 transition-all active:scale-90 p-1.5 rounded-full"
        disabled={refreshing}
      >
        <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
      </button>
    </motion.div>
  );
};
