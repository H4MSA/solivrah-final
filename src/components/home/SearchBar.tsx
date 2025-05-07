
import React from "react";
import { Search } from "lucide-react";

export const SearchBar: React.FC = () => (
  <div className="relative">
    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/50">
      <Search size={18} />
    </div>
    <input 
      type="text" 
      placeholder="Search for quests or tasks..." 
      className="w-full h-11 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full pl-11 pr-4 text-white placeholder:text-white/50 focus:outline-none focus:ring-1 focus:ring-white/20 focus:border-white/20 transition-all duration-300"
    />
  </div>
);
