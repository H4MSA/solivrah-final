
import React from "react";
import { motion } from "framer-motion";

interface LogoProps {
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ className = "" }) => {
  return (
    <motion.div className={`logo-container ${className}`}>
      <motion.div 
        className="relative w-16 h-16 rounded-full bg-gradient-to-b from-neon-green to-soft-lime flex items-center justify-center shadow-xl"
        animate={{ rotate: [0, 5, 0, -5, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      >
        <motion.div 
          className="absolute inset-0 rounded-full border-2 border-white/10"
          animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        ></motion.div>
        
        <span className="text-black text-2xl font-black">S</span>
      </motion.div>
    </motion.div>
  );
};
