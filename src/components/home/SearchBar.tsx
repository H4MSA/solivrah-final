
import React from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export const SearchBar: React.FC = () => (
  <motion.div 
    className="relative mb-4"
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
  >
    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50">
      <Search size={16} strokeWidth={2.5} />
    </div>
    <Input 
      type="text" 
      placeholder="Search for quests or tasks..." 
      className="w-full h-10 bg-[#1A1A1A] border border-[#333333] rounded-lg pl-10 pr-4 text-xs text-white/80 placeholder:text-white/40 focus:ring-1 focus:ring-white/20 focus:border-white/20 transition-all"
    />
  </motion.div>
);
