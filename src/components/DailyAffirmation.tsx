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

// Create singleton instance of AIService to avoid multiple instances
const aiServiceInstance = new AIService();

// Create a component for the affirmation text to isolate renders
const AffirmationText = memo(({ text, isLoading }: { text: string; isLoading: boolean }) => (
  <motion.p 
    key={text}
    initial={{ opacity: 0, y: 5 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    className={`text-white text-sm font-medium ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
  >
    {text}
  </motion.p>
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
        
        // Save to localStorage
        localStorage.setItem("dailyAffirmation", newAffirmation);
        localStorage.setItem("affirmationDate", new Date().toDateString());
        
        // Update state
        setAffirmation(newAffirmation);
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
        
        <AnimatePresence mode="wait">
          {/* Use the memoized component to avoid unnecessary renders */}
          <AffirmationText text={affirmation} isLoading={refreshing} />
        </AnimatePresence>
        
        {error && !refreshing && (
          <p className="text-xs text-white/50 mt-1">Offline mode</p>
        )}
      </div>
      
      <button 
        onClick={() => getNewAffirmation(true)}
        className="absolute top-2 right-2 text-white/50 hover:text-white hover:bg-white/10 transition-all active:scale-90 p-1 rounded-full"
        disabled={refreshing}
        aria-label="Refresh affirmation"
      >
        <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} />
      </button>
    </div>
  );
});

DailyAffirmation.displayName = 'DailyAffirmation';
