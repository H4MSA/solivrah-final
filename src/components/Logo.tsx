
import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  withText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ size = "md", className, withText = false }) => {
  // Updated size classes with larger dimensions and added "xl" option
  const sizeClass = {
    sm: "h-10 w-auto",
    md: "h-16 w-auto",
    lg: "h-24 w-auto",
    xl: "h-32 w-auto",
  };

  return (
    <motion.div 
      className={cn("flex items-center", className)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="relative overflow-hidden rounded-lg"
        initial={{ rotate: -5, scale: 0.9 }}
        animate={{ rotate: 0, scale: 1 }}
        transition={{ 
          type: "spring",
          stiffness: 260,
          damping: 20,
          delay: 0.2
        }}
        whileHover={{ 
          scale: 1.05,
          rotate: -3,
          transition: { duration: 0.3 } 
        }}
      >
        <motion.img 
          src="/lovable-uploads/68c40b83-f35c-4ca2-a67e-23d5ff575a28.png" 
          alt="Solivrah Logo" 
          className={cn(sizeClass[size], "object-contain")}
          style={{
            filter: "drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))"
          }}
        />
      </motion.div>
      
      {withText && (
        <motion.div 
          className="ml-4"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <h1 className="text-white text-2xl font-bold">Solivrah</h1>
          <p className="text-white/60 text-sm">Personal Development</p>
        </motion.div>
      )}
    </motion.div>
  );
};
