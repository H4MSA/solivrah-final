
import React, { useState } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface CollapsibleSectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  rightLabel?: string;
}

export const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({ 
  title, 
  children, 
  defaultOpen = true,
  rightLabel
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  return (
    <div className="space-y-3 mb-5">
      <div 
        className="flex justify-between items-center cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h2 className="text-base font-semibold text-white">{title}</h2>
        <div className="flex items-center gap-2">
          {rightLabel && (
            <span className="text-xs text-white/60 bg-white/5 px-2 py-0.5 rounded-full border border-white/5">
              {rightLabel}
            </span>
          )}
          <button className="p-1 rounded-full bg-white/5 border border-white/5 active:scale-95 transition-all">
            {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
      </div>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="space-y-3">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
