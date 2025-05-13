
import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  color?: "primary" | "white" | "black";
  className?: string;
  text?: string;
}

export const LoadingSpinner = ({ 
  size = "md", 
  color = "white",
  className = "",
  text
}: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: "w-4 h-4 border-2",
    md: "w-6 h-6 border-2",
    lg: "w-10 h-10 border-3"
  };
  
  const colorClasses = {
    primary: "border-t-purple-500",
    white: "border-t-white",
    black: "border-t-black"
  };
  
  return (
    <div className={cn("flex flex-col items-center justify-center", className)}>
      <motion.div 
        className={cn(
          "rounded-full border-transparent animate-spin",
          sizeClasses[size],
          colorClasses[color]
        )}
        animate={{ rotate: 360 }}
        transition={{ 
          duration: 1, 
          repeat: Infinity, 
          ease: "linear"
        }}
      />
      {text && (
        <p className="text-sm text-white/70 mt-2">{text}</p>
      )}
    </div>
  );
};

// Full screen loader with overlay
export const FullScreenLoader = ({ text }: { text?: string }) => {
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="flex flex-col items-center">
        <LoadingSpinner size="lg" />
        {text && <p className="mt-4 text-white/80 font-medium">{text}</p>}
      </div>
    </div>
  );
};
