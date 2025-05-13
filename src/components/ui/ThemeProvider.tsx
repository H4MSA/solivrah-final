
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type ThemeProviderProps = {
  children: React.ReactNode;
};

export function ThemeProvider({ children }: ThemeProviderProps) {
  return (
    <div className="theme-provider">
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="min-h-screen"
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
