
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { useApp } from "@/context/AppContext";
import { motion } from "framer-motion";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "elevated" | "subtle" | "primary" | "interactive" | "dark" | "theme";
  animate?: "fade" | "pop" | "blur" | "none";
  interactive?: boolean;
  depth?: "low" | "medium" | "high";
  hoverEffect?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({ 
  children, 
  className,
  variant = "default",
  animate = "none",
  interactive = false,
  depth = "medium",
  hoverEffect = true,
  ...props 
}) => {
  const { selectedTheme } = useApp();
  const [isPressed, setIsPressed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const getAnimationClass = () => {
    switch (animate) {
      case "fade": return "animate-fade-in";
      case "pop": return "animate-pop-in";
      case "blur": return "animate-blur-in";
      default: return "";
    }
  };

  // Get theme-specific style
  const getThemeStyle = () => {
    if (variant !== "theme") return {};

    // Define theme-specific glow colors
    const themeColors: {[key: string]: string} = {
      Focus: "rgba(106, 90, 205, 0.1)",   // Lavender
      Discipline: "rgba(220, 38, 38, 0.1)", // Red
      Resilience: "rgba(16, 185, 129, 0.1)", // Green
      Wildcards: "rgba(245, 158, 11, 0.1)"  // Amber
    };

    const color = themeColors[selectedTheme as string] || themeColors.Focus;
    
    return {
      boxShadow: isHovered 
        ? `0 10px 30px ${color}, inset 0 0 20px rgba(255, 255, 255, 0.05)`
        : `0 8px 20px ${color}, inset 0 0 10px rgba(255, 255, 255, 0.03)`
    };
  };

  const getDepthStyle = () => {
    const baseStyle = "0 4px 16px rgba(0,0,0,0.16)";
    
    switch (depth) {
      case "low": return "0 2px 10px rgba(0,0,0,0.1)";
      case "high": return "0 8px 30px rgba(0,0,0,0.25)";
      default: return baseStyle;
    }
  };

  const handleTouchStart = () => interactive && setIsPressed(true);
  const handleTouchEnd = () => interactive && setIsPressed(false);
  const handleMouseEnter = () => hoverEffect && setIsHovered(true);
  const handleMouseLeave = () => {
    hoverEffect && setIsHovered(false);
    setIsPressed(false);
  };

  return (
    <motion.div 
      className={cn(
        "relative backdrop-blur-lg border rounded-xl transition-all duration-300 transform-gpu will-change-transform",
        variant === "default" && "bg-black/70 border-white/5 text-white",
        variant === "elevated" && "bg-black/40 border-white/10 text-white",
        variant === "subtle" && "bg-black/30 border-white/5 text-white",
        variant === "primary" && "bg-white text-black border-transparent",
        variant === "interactive" && "bg-black/80 border-white/10 hover:bg-black/70 hover:border-white/20 cursor-pointer active:scale-[0.98]",
        variant === "dark" && "bg-[#121212]/90 border-white/5 hover:border-white/10",
        variant === "theme" && "bg-black/60 border-white/10 hover:border-white/20",
        interactive && "cursor-pointer active:scale-[0.98]",
        isPressed && "scale-[0.98]",
        getAnimationClass(),
        className
      )}
      style={{
        boxShadow: getDepthStyle(),
        ...getThemeStyle(),
        transform: `${isPressed ? 'scale(0.98)' : 'scale(1)'}`
      }}
      initial={false}
      animate={{
        y: isHovered ? -4 : 0,
        boxShadow: isHovered 
          ? `0 20px 25px rgba(0, 0, 0, 0.2)` 
          : getDepthStyle()
      }}
      transition={{ 
        type: "spring", 
        stiffness: 400, 
        damping: 17 
      }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleTouchStart}
      onMouseUp={handleTouchEnd}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      <div className="relative z-10">
        {children}
      </div>
      
      {/* Subtle inner highlight for 3D effect */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-b from-white/5 to-transparent pointer-events-none"></div>
    </motion.div>
  );
};
