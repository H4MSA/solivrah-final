import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface TabButtonProps {
  id: string;
  icon: React.ElementType;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

const TabButton: React.FC<TabButtonProps> = ({ id, icon: Icon, label, isActive, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-col items-center gap-2 p-3 rounded-2xl transition-all duration-300",
        isActive 
          ? "text-white bg-white/10 backdrop-blur-sm border border-white/20" 
          : "text-gray-500 hover:text-gray-300 hover:bg-white/5"
      )}
    >
      <AnimatePresence mode="wait">
        {isActive && (
          <motion.div
            layoutId="activeTabBackground"
            className="absolute inset-0 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />
        )}
      </AnimatePresence>
      
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
        className="relative z-10"
      >
        <Icon size={22} strokeWidth={2} />
      </motion.div>
      
      <span className="text-xs font-semibold tracking-wide relative z-10">{label}</span>
    </button>
  );
};

export default TabButton;