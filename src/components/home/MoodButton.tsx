
import React from "react";
import { motion } from "framer-motion";
import { PremiumCard } from "@/components/PremiumCard";
import { cn } from "@/lib/utils";

interface MoodButtonProps {
  emoji: string;
  label: string;
  selected?: boolean;
  onClick: () => void;
}

export const MoodButton: React.FC<MoodButtonProps> = ({ emoji, label, selected, onClick }) => (
  <motion.div
    whileHover={{ scale: 1.03 }}
    whileTap={{ scale: 0.97 }}
  >
    <div
      className={cn(
        "p-3 flex flex-col items-center justify-center gap-2 transition-all rounded-xl",
        selected 
          ? "bg-black border border-white/20 shadow-md" 
          : "bg-black/90 border border-[#333333]"
      )}
      onClick={onClick}
    >
      <div className={cn(
        "flex items-center justify-center w-12 h-12 rounded-full mb-1 text-2xl",
        selected 
          ? "bg-black/80 shadow-sm" 
          : "bg-black/60"
      )}>
        {emoji}
      </div>
      <span className="text-xs font-medium">{label}</span>
    </div>
  </motion.div>
);
