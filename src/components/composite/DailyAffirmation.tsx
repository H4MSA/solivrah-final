import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useAppSound } from "@/context/SoundContext";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { RefreshCw, Quote, Share2 } from "lucide-react";

// Sample affirmations
const AFFIRMATIONS = [
  "I am worthy of love and respect just as I am.",
  "Today I choose peace over worry and faith over fear.",
  "I have the power to create positive change in my life.",
  "I am grateful for all the good things in my life, big and small.",
  "I trust my journey and know I am exactly where I need to be.",
  "My potential is limitless, and I can achieve anything I set my mind to.",
  "I am becoming the best version of myself every day.",
  "I release all negative thoughts and welcome positivity into my life.",
  "I am resilient and can overcome any challenge that comes my way.",
  "My body is healthy, my mind is brilliant, my soul is tranquil.",
  "I am surrounded by love and support from others.",
  "I am confident in my abilities and decisions.",
  "I attract abundance and prosperity into my life.",
  "I am at peace with my past and excited for my future.",
  "I radiate positive energy and inspire those around me.",
];

interface DailyAffirmationProps {
  className?: string;
}

export function DailyAffirmation({ className }: DailyAffirmationProps) {
  const { playWithHaptics } = useAppSound();
  const [affirmation, setAffirmation] = useState("");
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(40); // milliseconds per character
  const [isRefreshing, setIsRefreshing] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Get a random affirmation
  const getRandomAffirmation = () => {
    const randomIndex = Math.floor(Math.random() * AFFIRMATIONS.length);
    return AFFIRMATIONS[randomIndex];
  };
  
  // Initialize with a random affirmation
  useEffect(() => {
    setAffirmation(getRandomAffirmation());
  }, []);
  
  // Typewriter effect
  useEffect(() => {
    if (!affirmation) return;
    
    setIsTyping(true);
    setDisplayedText("");
    
    let currentIndex = 0;
    
    const typeNextChar = () => {
      if (currentIndex < affirmation.length) {
        setDisplayedText(prev => prev + affirmation.charAt(currentIndex));
        currentIndex++;
        timeoutRef.current = setTimeout(typeNextChar, typingSpeed);
      } else {
        setIsTyping(false);
      }
    };
    
    timeoutRef.current = setTimeout(typeNextChar, typingSpeed);
    
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [affirmation, typingSpeed]);
  
  // Handle refresh button click
  const handleRefresh = () => {
    playWithHaptics("button-tap");
    setIsRefreshing(true);
    
    // Clear current timeout if any
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    // Get a new affirmation (ensuring it's different from the current one)
    let newAffirmation = getRandomAffirmation();
    while (newAffirmation === affirmation) {
      newAffirmation = getRandomAffirmation();
    }
    
    // Set the new affirmation after a short delay
    setTimeout(() => {
      setAffirmation(newAffirmation);
      setIsRefreshing(false);
    }, 500);
  };
  
  // Handle share button click
  const handleShare = () => {
    playWithHaptics("button-tap");
    
    // Check if Web Share API is available
    if (navigator.share) {
      navigator.share({
        title: "Daily Affirmation",
        text: affirmation,
      }).catch((error) => console.log("Error sharing:", error));
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(affirmation)
        .then(() => {
          console.log("Affirmation copied to clipboard");
          // TODO: Show toast notification
        })
        .catch((error) => console.log("Error copying to clipboard:", error));
    }
  };
  
  return (
    <GlassCard 
      className={`p-5 relative overflow-hidden ${className}`}
      variant="subtle"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="bg-primary/10 p-2 rounded-full">
            <Quote size={18} className="text-primary" />
          </div>
          <h3 className="font-medium">Daily Affirmation</h3>
        </div>
        
        <div className="flex gap-1">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8"
            onClick={handleShare}
          >
            <Share2 size={16} />
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8"
            onClick={handleRefresh}
            disabled={isTyping || isRefreshing}
          >
            <motion.div
              animate={isRefreshing ? { rotate: 360 } : { rotate: 0 }}
              transition={{ duration: 0.5 }}
            >
              <RefreshCw size={16} />
            </motion.div>
          </Button>
        </div>
      </div>
      
      <div className="min-h-[80px] flex items-center justify-center">
        <motion.p 
          className="text-lg text-center font-medium"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {displayedText}
          {isTyping && (
            <motion.span
              animate={{ opacity: [1, 0, 1] }}
              transition={{ repeat: Infinity, duration: 1 }}
            >
              |
            </motion.span>
          )}
        </motion.p>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-primary/5 to-transparent rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-primary/5 to-transparent rounded-full translate-y-1/2 -translate-x-1/2" />
    </GlassCard>
  );
} 