import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useAppSound } from "@/context/SoundContext";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface MoodOption {
  emoji: string;
  label: string;
  color: string;
  value: number;
}

interface MoodSectionProps {
  onMoodSelect?: (mood: MoodOption) => void;
  className?: string;
}

/**
 * MoodSection - A component for tracking daily mood with animated emoji selection
 */
export function MoodSection({ onMoodSelect, className }: MoodSectionProps) {
  const { playWithHaptics } = useAppSound();
  const [selectedMood, setSelectedMood] = useState<MoodOption | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  
  // Mood options with colors
  const moods: MoodOption[] = [
    { emoji: "😢", label: "Sad", color: "bg-blue-500", value: 1 },
    { emoji: "😕", label: "Meh", color: "bg-indigo-500", value: 2 },
    { emoji: "😐", label: "Okay", color: "bg-purple-500", value: 3 },
    { emoji: "🙂", label: "Good", color: "bg-pink-500", value: 4 },
    { emoji: "😄", label: "Great", color: "bg-amber-500", value: 5 },
  ];
  
  // Handle mood selection
  const handleMoodSelect = (mood: MoodOption) => {
    playWithHaptics("button-tap");
    setSelectedMood(mood);
    
    // Show confirmation animation
    setShowConfirmation(true);
    
    // Hide confirmation after animation
    setTimeout(() => {
      setShowConfirmation(false);
    }, 2000);
    
    // Call the callback
    onMoodSelect?.(mood);
  };
  
  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-white/80">How are you feeling today?</h3>
        
        {selectedMood && (
          <span className="text-xs text-muted-foreground">
            Last updated: Just now
          </span>
        )}
      </div>
      
      {/* Mood selection grid */}
      <div className="grid grid-cols-5 gap-2">
        <AnimatePresence mode="wait">
          {moods.map((mood) => (
            <motion.div
              key={mood.value}
              className="relative"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2, delay: mood.value * 0.05 }}
            >
              <Button
                variant="ghost"
                className={cn(
                  "w-full h-16 flex flex-col items-center justify-center gap-1 rounded-xl border",
                  selectedMood?.value === mood.value
                    ? `border-${mood.color.split('-')[1]}-500/50 bg-${mood.color.split('-')[1]}-500/10`
                    : "border-white/10 bg-black/40 hover:bg-black/50"
                )}
                onClick={() => handleMoodSelect(mood)}
              >
                <span className="text-2xl">{mood.emoji}</span>
                <span className="text-xs font-medium">{mood.label}</span>
              </Button>
              
              {/* Selected indicator */}
              {selectedMood?.value === mood.value && (
                <motion.div
                  className={cn(
                    "absolute -bottom-1 left-1/2 w-1.5 h-1.5 rounded-full",
                    mood.color
                  )}
                  layoutId="moodIndicator"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                />
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      
      {/* Mood distribution */}
      <div className="pt-2">
        <div className="flex h-1.5 w-full overflow-hidden rounded-full">
          {moods.map((mood) => (
            <div
              key={mood.value}
              className={cn(
                "h-full transition-all duration-500",
                mood.color,
                selectedMood?.value === mood.value ? "flex-grow" : "flex-grow-0 w-1/5"
              )}
            />
          ))}
        </div>
      </div>
      
      {/* Confirmation animation */}
      <AnimatePresence>
        {showConfirmation && selectedMood && (
          <motion.div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1.5, opacity: 1 }}
            exit={{ scale: 2, opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-6xl">{selectedMood.emoji}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 