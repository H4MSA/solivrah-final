
import React, { useState, useEffect, useCallback, memo } from "react";
import { Quote, RefreshCw } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { AIService } from "@/services/AIService";
import { motion, AnimatePresence } from "framer-motion";
import { useMemoized } from "@/hooks/useMemoized";

// More impactful affirmations based on themes
const themeAffirmations = {
  Focus: [
    "I direct my focus with intention and purpose.",
    "My mind is clear, focused, and ready for any challenge.",
    "I choose where my attention goes, and it serves my highest goals.",
    "With each deep breath, my focus strengthens and sharpens.",
    "I am fully present in this moment, exactly where I need to be.",
  ],
  Discipline: [
    "Small daily disciplines lead to major achievements.",
    "I am building the habit of consistency.",
    "Each mindful choice strengthens my self-discipline.",
    "I follow through on commitments to myself.",
    "My discipline creates future freedom.",
  ],
  Resilience: [
    "I grow stronger with each challenge I face.",
    "Setbacks are opportunities for greater comebacks.",
    "My resilience expands with every obstacle overcome.",
    "I bend but do not break; I adapt and evolve.",
    "My capacity to recover and thrive is limitless.",
  ],
  Wildcards: [
    "I embrace the unexpected with curiosity and courage.",
    "New experiences expand my understanding and capabilities.",
    "I step outside my comfort zone and discover my potential.",
    "Today I welcome spontaneity and creative insights.",
    "I find joy in breaking my routine to discover new paths.",
  ],
  Default: [
    "I am capable of remarkable growth and transformation.",
    "The path forward becomes clear when I take the first step.",
    "I have everything I need within me to create the life I desire.",
    "My potential is limitless when I align my actions with my purpose.",
    "Today I choose progress over perfection.",
  ]
};

// Create singleton instance of AIService to avoid multiple instances
const aiServiceInstance = new AIService();

// Create a component for the affirmation text to isolate renders
const AffirmationText = memo(({ text, isLoading }: { text: string; isLoading: boolean }) => (
  <AnimatePresence mode="wait">
    {!isLoading && (
      <motion.p 
        key={text}
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -5 }}
        transition={{ duration: 0.3 }}
        className="text-white text-sm font-medium"
      >
        {text}
      </motion.p>
    )}
    {isLoading && (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="h-5 bg-white/10 animate-pulse rounded-md"
      />
    )}
  </AnimatePresence>
));

AffirmationText.displayName = 'AffirmationText';

export const DailyAffirmation = memo(() => {
  const { selectedTheme, user } = useApp();
  const [affirmation, setAffirmation] = useState<string>("");
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  
  // Get fallback affirmations for the selected theme
  const themeFallbackAffirmations = useMemoized(() => {
    const theme = selectedTheme || "Default";
    return themeAffirmations[theme as keyof typeof themeAffirmations] || themeAffirmations.Default;
  }, [selectedTheme]);
  
  // Get a random fallback affirmation when needed
  const getRandomFallback = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * themeFallbackAffirmations.length);
    return themeFallbackAffirmations[randomIndex];
  }, [themeFallbackAffirmations]);
  
  // Memoize user info to prevent unnecessary recomputation
  const userInfo = useMemoized(() => {
    return {
      username: user?.user_metadata?.username || user?.email?.split('@')[0] || "",
      mood: localStorage.getItem("currentMood") || ""
    };
  }, [user]);
  
  // Function to check if we should load a new affirmation
  const shouldLoadNewAffirmation = useCallback(() => {
    const storedDate = localStorage.getItem("affirmationDate");
    const today = new Date().toDateString();
    return storedDate !== today;
  }, []);
  
  // Fetch a new affirmation from the API or get a fallback
  const getNewAffirmation = useCallback(async (forceRefresh = false) => {
    // If already refreshing, don't do anything
    if (refreshing) return;
    
    // If not forcing a refresh, check if we have a cached affirmation for today
    if (!forceRefresh) {
      const storedAffirmation = localStorage.getItem("dailyAffirmation");
      const needsNewAffirmation = shouldLoadNewAffirmation();
      
      if (storedAffirmation && !needsNewAffirmation) {
        setAffirmation(storedAffirmation);
        return;
      }
    }
    
    setRefreshing(true);
    setError(false);
    
    try {
      // Only make API call if online
      if (navigator.onLine) {
        // Use AI service to generate personalized affirmation
        const newAffirmation = await aiServiceInstance.generateDailyAffirmation(
          selectedTheme,
          userInfo.username,
          userInfo.mood
        );
        
        // Validate affirmation length to ensure it's not too long
        const cleanedAffirmation = newAffirmation.length > 120 
          ? newAffirmation.split('.')[0] + '.'  // Take just the first sentence if too long
          : newAffirmation;
        
        // Save to localStorage
        localStorage.setItem("dailyAffirmation", cleanedAffirmation);
        localStorage.setItem("affirmationDate", new Date().toDateString());
        
        // Update state
        setAffirmation(cleanedAffirmation);
      } else {
        // If offline, use fallback immediately without trying API
        throw new Error("Offline - using fallback affirmation");
      }
    } catch (err) {
      console.error("Failed to generate affirmation:", err);
      setError(true);
      
      // Fall back to our theme-based curated affirmations
      const fallbackAffirmation = getRandomFallback();
      
      setAffirmation(fallbackAffirmation);
      
      // Still save to localStorage to prevent repeated attempts
      localStorage.setItem("dailyAffirmation", fallbackAffirmation);
      localStorage.setItem("affirmationDate", new Date().toDateString());
    } finally {
      setRefreshing(false);
    }
  }, [selectedTheme, userInfo, getRandomFallback, shouldLoadNewAffirmation, refreshing]);
  
  // Initialize affirmation on component mount
  useEffect(() => {
    getNewAffirmation(false);
    
    // Setup periodic check for new day (at midnight)
    const checkForNewDay = () => {
      const now = new Date();
      if (shouldLoadNewAffirmation()) {
        getNewAffirmation(false);
      }
    };
    
    // Check once per hour for a day change
    const intervalId = setInterval(checkForNewDay, 60 * 60 * 1000);
    
    return () => clearInterval(intervalId);
  }, [getNewAffirmation, shouldLoadNewAffirmation]);
  
  // Force refresh when theme changes
  useEffect(() => {
    getNewAffirmation(true);
  }, [selectedTheme]); 
  
  return (
    <motion.div 
      className="relative overflow-hidden bg-[#1A1A1A] border border-[#333333] rounded-xl p-3 shadow-sm mb-4"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ 
        y: -2, 
        boxShadow: "0 10px 20px rgba(0,0,0,0.2)",
        transition: { duration: 0.2 } 
      }}
    >
      <motion.div 
        className="absolute top-3 left-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <Quote size={14} className="text-white/30" />
      </motion.div>
      
      <div className="ml-6 mr-6">
        <motion.h3 
          className="text-xs uppercase tracking-wider text-white/60 font-medium mb-1.5 flex items-center gap-1"
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.3 }}
        >
          <span className="w-1 h-1 rounded-full bg-purple-400/70 inline-block"></span>
          <span>Daily Affirmation</span>
        </motion.h3>
        
        {/* Use the memoized component to avoid unnecessary renders */}
        <AffirmationText text={affirmation} isLoading={refreshing} />
        
        {error && !refreshing && (
          <p className="text-xs text-white/50 mt-1">Offline mode</p>
        )}
      </div>
      
      <motion.button 
        onClick={() => getNewAffirmation(true)}
        className="absolute top-2 right-2 text-white/50 hover:text-white hover:bg-white/10 transition-all active:scale-90 p-1 rounded-full"
        disabled={refreshing}
        aria-label="Refresh affirmation"
        whileTap={{ scale: 0.8, rotate: 180 }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
      >
        <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} />
      </motion.button>
    </motion.div>
  );
});

DailyAffirmation.displayName = 'DailyAffirmation';
