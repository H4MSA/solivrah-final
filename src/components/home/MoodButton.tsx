
import React from "react";
import { motion } from "framer-motion";
import { PremiumCard } from "@/components/PremiumCard";

interface MoodButtonProps {
  emoji: string;
  label: string;
  selected?: boolean;
  onClick: () => void;
}

export const MoodButton: React.FC<MoodButtonProps> = ({ emoji, label, selected, onClick }) => (
  <motion.div
    whileHover={{ y: -2 }}
    whileTap={{ scale: 0.95 }}
  >
    <PremiumCard
      variant={selected ? "selected" : "default"}
      className={cn(
        "p-4 flex flex-col items-center justify-center gap-3 transition-all",
        selected && "border-white/30 shadow-xl"
      )}
      interactive={true}
      onClick={onClick}
    >
      <div className={cn(
        "flex items-center justify-center w-16 h-16 rounded-full mb-2 text-3xl",
        selected 
          ? "bg-gradient-to-br from-white/20 to-white/5 shadow-lg" 
          : "bg-white/5"
      )}>
        {emoji}
      </div>
      <span className="text-sm font-medium">{label}</span>
    </PremiumCard>
  </motion.div>
);

// Import utility function
import { cn } from "@/lib/utils";
