
import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SolivrahIconProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  animate?: boolean;
}

export const SolivrahIcon: React.FC<SolivrahIconProps> = ({ 
  size = "md", 
  className = "",
  animate = true 
}) => {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-12 h-12"
  };
  
  const IconComponent = animate ? motion.div : "div";
  const animationProps = animate ? {
    whileHover: { scale: 1.1, rotate: 5 },
    whileTap: { scale: 0.95 },
    transition: { type: "spring", stiffness: 400, damping: 10 }
  } : {};
  
  return (
    <IconComponent
      className={cn(
        "flex items-center justify-center rounded-xl border border-white/10 bg-gradient-to-b from-[#1A1A1A] to-[#0A0A0A] transition-all duration-300 shadow-sm",
        sizeClasses[size],
        className
      )}
      {...animationProps}
    >
      <img 
        src="/lovable-uploads/3175d335-84c5-4f7a-954e-9795d0e93059.png" 
        alt="Solivrah Icon" 
        className="w-full h-full object-contain p-1 opacity-90"
      />
    </IconComponent>
  );
};
