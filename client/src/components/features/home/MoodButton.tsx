import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface MoodButtonProps {
  emoji: string;
  label: string;
  selected: boolean;
  onClick: () => void;
}

export const MoodButton: React.FC<MoodButtonProps> = ({
  emoji,
  label,
  selected,
  onClick
}) => {
  return (
    <motion.button
      className={cn(
        "flex flex-col items-center justify-center p-4 rounded-xl border transition-all duration-200",
        "hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-white/20",
        selected 
          ? "bg-white text-black border-white shadow-lg" 
          : "bg-[#1A1A1A] text-white border-[#333333] hover:border-[#666666] hover:bg-[#222222]"
      )}
      onClick={onClick}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.95 }}
      animate={selected ? { 
        boxShadow: "0 4px 12px rgba(255,255,255,0.2)",
        scale: [1, 1.05, 1]
      } : {}}
      transition={{ duration: 0.2 }}
    >
      <motion.div
        className="text-2xl mb-2"
        animate={selected ? { 
          scale: [1, 1.2, 1],
          rotate: [0, 10, -10, 0]
        } : {}}
        transition={{ duration: 0.5 }}
      >
        {emoji}
      </motion.div>
      <span className={cn(
        "text-xs font-medium",
        selected ? "text-black" : "text-white/80"
      )}>
        {label}
      </span>
      
      {/* Selection indicator */}
      {selected && (
        <motion.div
          className="absolute -top-1 -right-1 w-3 h-3 bg-black rounded-full border-2 border-white"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        />
      )}
      
      {/* Ripple effect */}
      <motion.div
        className="absolute inset-0 rounded-xl"
        initial={{ scale: 0, opacity: 0 }}
        animate={selected ? { 
          scale: [0, 1.5], 
          opacity: [0.3, 0] 
        } : { scale: 0, opacity: 0 }}
        transition={{ duration: 0.6 }}
        style={{
          background: selected ? "radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)" : "transparent"
        }}
      />
    </motion.button>
  );
}; 