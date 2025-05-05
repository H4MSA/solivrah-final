
import React from "react";
import { motion } from "framer-motion";

interface LogoProps {
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ className = "" }) => {
  return (
    <motion.div className={`logo-container ${className}`}>
      <img 
        src="/attached_assets/logo.png" 
        alt="Solivrah Logo" 
        className="w-[163px] h-[123px] object-contain"
      />
    </motion.div>
  );
};
