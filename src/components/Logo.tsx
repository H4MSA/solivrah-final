
import React from "react";
import { motion } from "framer-motion";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  withText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ size = "md", className, withText = false }) => {
  const sizeClass = {
    sm: "h-8",
    md: "h-12",
    lg: "h-20",
  };

  return (
    <motion.div 
      className={cn("flex items-center", className)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.img 
        src="/lovable-uploads/68c40b83-f35c-4ca2-a67e-23d5ff575a28.png" 
        alt="Solivrah Logo" 
        className={cn(sizeClass[size], "object-contain")}
        initial={{ rotate: -10, scale: 0.8 }}
        animate={{ rotate: 0, scale: 1 }}
        transition={{ 
          type: "spring",
          stiffness: 260,
          damping: 20,
          delay: 0.2
        }}
        whileHover={{ 
          scale: 1.05,
          rotate: -5,
          transition: { duration: 0.3 } 
        }}
      />
      
      {withText && (
        <motion.div 
          className="ml-3"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <h1 className="text-white text-xl font-bold">Solivrah</h1>
          <p className="text-white/60 text-xs">Personal Development</p>
        </motion.div>
      )}
    </motion.div>
  );
};

// Import utility function
import { cn } from "@/lib/utils";
