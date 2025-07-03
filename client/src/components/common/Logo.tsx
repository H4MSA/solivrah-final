import React from "react";
import { motion } from "framer-motion";

type LogoProps = {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  withText?: boolean;
};

export const Logo = ({ size = "md", className = "", withText = true }: LogoProps) => {
  const sizeClasses = {
    sm: "w-10 h-10",
    md: "w-14 h-14",
    lg: "w-24 h-24", 
    xl: "w-32 h-32"
  };
  
  return (
    <div className={`flex flex-col items-center ${className}`}>
      <motion.div
        className="relative"
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
      >
        <img 
          src="/lovable-uploads/3175d335-84c5-4f7a-954e-9795d0e93059.png" 
          alt="Solivrah Logo" 
          className={`${sizeClasses[size]} drop-shadow-lg filter`}
          style={{
            filter: "drop-shadow(0px 4px 6px rgba(0, 0, 0, 0.25))"
          }}
        />
        
        {withText && (
          <div className="text-center mt-2 font-bold text-white text-xl drop-shadow-md">
            Solivrah
          </div>
        )}
      </motion.div>
    </div>
  );
}; 