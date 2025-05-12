
import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface QuickGuideProps {
  title: string;
  steps: string[];
}

export const QuickGuide = ({ title, steps }: QuickGuideProps) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="bg-white/5 rounded-lg border border-white/10 overflow-hidden mb-4">
      <button
        className="w-full px-4 py-3 flex items-center justify-between text-left"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="font-medium text-white">{title}</span>
        {isOpen ? (
          <ChevronUp size={18} className="text-white/70" />
        ) : (
          <ChevronDown size={18} className="text-white/70" />
        )}
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="px-4 pb-3">
              <ol className="space-y-2 pl-5 list-decimal text-white/70 text-sm">
                {steps.map((step, index) => (
                  <li key={index}>{step}</li>
                ))}
              </ol>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
