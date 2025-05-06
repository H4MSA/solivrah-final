
import React, { useState, useEffect } from "react";
import { Quote, RefreshCw } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { AIService } from "@/services/AIService";

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
      
      // Use AI service to generate personalized affirmation
      const newAffirmation = await aiService.generateDailyAffirmation(
        selectedTheme,
        username
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
        "I am capable of creating positive change in my life.",
        "My potential to succeed is limitless.",
        "Today, I choose progress over perfection.",
        "I have the power to overcome any obstacle.",
        "Every challenge helps me grow stronger.",
      ];
      const randomIndex = Math.floor(Math.random() * fallbacks.length);
      setAffirmation(fallbacks[randomIndex]);
    } finally {
      setRefreshing(false);
    }
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
        {error && !refreshing && (
          <p className="text-xs text-white/50 mt-1">Offline mode</p>
        )}
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
