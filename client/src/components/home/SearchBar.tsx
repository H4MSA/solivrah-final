
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Command } from 'lucide-react';
import { Input } from '@/components/ui/input';

export const SearchBar: React.FC = () => {
  const [searchValue, setSearchValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  return (
    <motion.div
      className="relative"
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.2 }}
    >
      <div className={`relative transition-all duration-300 ${
        isFocused ? 'transform scale-[1.02]' : ''
      }`}>
        <div className="absolute inset-0 bg-white/10 rounded-xl blur-sm" />
        <div className="relative bg-white/15 backdrop-blur-xl border border-white/25 rounded-xl p-4 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-10 h-10 bg-white/20 rounded-lg">
              <Search size={18} className="text-white" />
            </div>
            
            <div className="flex-1">
              <Input
                type="text"
                placeholder="Search quests, achievements, or ask a question..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                className="w-full bg-transparent border-none text-white placeholder:text-white/60 text-base focus:ring-0 focus:outline-none p-0 h-auto"
              />
            </div>
            
            <div className="flex items-center gap-2 text-xs text-white/50">
              <Command size={12} />
              <span className="hidden sm:inline">K</span>
            </div>
          </div>
          
          {searchValue && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 pt-4 border-t border-white/20"
            >
              <div className="text-sm text-white/70">
                Quick suggestions based on "{searchValue}"
              </div>
              <div className="mt-2 space-y-2">
                <button className="w-full text-left p-2 rounded-lg hover:bg-white/10 transition-colors">
                  <div className="text-sm text-white font-medium">Time tracking quest</div>
                  <div className="text-xs text-white/60">Learn to master your schedule</div>
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
