
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

export const SearchBar: React.FC = () => {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const handleClear = () => {
    setQuery("");
  };

  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className={cn(
        "relative flex items-center transition-all duration-200",
        "bg-[#1A1A1A] border rounded-xl overflow-hidden",
        isFocused 
          ? "border-white/30 ring-1 ring-white/10 shadow-lg" 
          : "border-[#333333] hover:border-[#666666]"
      )}>
        <div className="pl-4 pr-2">
          <Search 
            size={16} 
            className={cn(
              "transition-colors duration-200",
              isFocused ? "text-white" : "text-[#999999]"
            )} 
          />
        </div>
        
        <input
          type="text"
          placeholder="Search quests, topics, or ask a question..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={cn(
            "flex-1 py-3 pr-4 bg-transparent text-white text-sm",
            "placeholder:text-[#666666] focus:outline-none",
            "selection:bg-white/20"
          )}
        />
        
        {query && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={handleClear}
            className="mr-3 p-1 text-[#999999] hover:text-white transition-colors duration-200 rounded-full hover:bg-white/10"
          >
            <X size={14} />
          </motion.button>
        )}
      </div>
      
      {/* Focus glow effect */}
      {isFocused && (
        <motion.div
          className="absolute inset-0 rounded-xl border border-white/20 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        />
      )}
    </motion.div>
  );
};
