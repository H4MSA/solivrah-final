
import React from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";

export const SearchBar: React.FC = () => (
  <motion.div 
    className="relative mb-5"
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
  >
    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/50">
      <Search size={18} strokeWidth={2.5} />
    </div>
    <input 
      type="text" 
      placeholder="Search for quests or tasks..." 
      className="w-full h-12 bg-[#1A1A1A] border border-[#333333] rounded-full pl-12 pr-4 text-sm text-white placeholder:text-white/50 focus:outline-none focus:ring-1 focus:ring-white/20 focus:border-white/20 transition-all"
    />
  </motion.div>
);
