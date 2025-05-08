
import React from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";

export const SearchBar: React.FC = () => (
  <motion.div 
    className="relative"
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
  >
    <div className="absolute left-5 top-1/2 transform -translate-y-1/2 text-white/50">
      <Search size={20} strokeWidth={2.5} />
    </div>
    <input 
      type="text" 
      placeholder="Search for quests or tasks..." 
      className="w-full h-14 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl pl-12 pr-5 text-white placeholder:text-white/50 focus:outline-none focus:ring-1 focus:ring-white/20 focus:border-white/20 transition-all duration-300 shadow-lg"
    />
  </motion.div>
);
