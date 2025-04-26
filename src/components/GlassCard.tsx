
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { useApp } from "@/context/AppContext";
import { motion, HTMLMotionProps } from "framer-motion";

interface GlassCardProps extends Omit<HTMLMotionProps<"div">, "animate"> {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "elevated" | "subtle" | "primary" | "interactive" | "dark" | "theme" | "ultra-glass";
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

  const getThemeStyle = () => {
    if (variant !== "theme") return {};

    const themeColors: {[key: string]: string} = {
      Focus: "rgba(106, 90, 205, 0.15)",
      Discipline: "rgba(220, 38, 38, 0.15)",
      Resilience: "rgba(16, 185, 129, 0.15)",
      Wildcards: "rgba(245, 158, 11, 0.15)"
    };

    const color = themeColors[selectedTheme as string] || themeColors.Focus;
    
    return {
      boxShadow: isHovered 
        ? `0 10px 30px ${color}, inset 0 0 20px rgba(255, 255, 255, 0.08)`
        : `0 8px 20px ${color}, inset 0 0 15px rgba(255, 255, 255, 0.05)`
    };
  };

  const getDepthStyle = () => {
    const baseStyle = "0 4px 16px rgba(0,0,0,0.2)";
    
    switch (depth) {
      case "low": return "0 2px 10px rgba(0,0,0,0.15)";
      case "high": return "0 8px 30px rgba(0,0,0,0.3)";
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

  const motionProps: any = {
    initial: false,
    style: {
      boxShadow: getDepthStyle(),
      ...getThemeStyle(),
      transform: `${isPressed ? 'scale(0.98)' : 'scale(1)'}`
    },
    animate: {
      y: isHovered ? -4 : 0,
      boxShadow: isHovered 
        ? `0 20px 25px rgba(0, 0, 0, 0.25)` 
        : getDepthStyle()
    },
    transition: { 
      type: "spring", 
      stiffness: 400, 
      damping: 17 
    }
  };

  return (
    <motion.div 
      className={cn(
        "relative backdrop-blur-xl border rounded-xl transition-all duration-300 transform-gpu will-change-transform shadow-lg overflow-hidden",
        variant === "default" && "bg-black/50 border-white/10 text-white",
        variant === "elevated" && "bg-black/30 border-white/20 text-white shadow-xl",
        variant === "subtle" && "bg-black/20 border-white/5 text-white",
        variant === "primary" && "bg-gradient-to-b from-white/95 to-white/90 text-black border-transparent",
        variant === "interactive" && "bg-black/40 border-white/10 hover:bg-black/30 hover:border-white/20 cursor-pointer active:scale-[0.98]",
        variant === "dark" && "bg-[#121212]/95 border-white/10 hover:border-white/20",
        variant === "theme" && "bg-black/40 border-white/10 hover:border-white/20",
        variant === "ultra-glass" && "bg-black/30 backdrop-blur-2xl border-white/20 shadow-2xl",
        interactive && "cursor-pointer active:scale-[0.98]",
        isPressed && "scale-[0.98]",
        getAnimationClass(),
        className
      )}
      {...motionProps}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleTouchStart}
      onMouseUp={handleTouchEnd}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {children}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
      {variant === "ultra-glass" && (
        <div className="absolute inset-0 rounded-xl overflow-hidden">
          <div className="absolute -inset-[100%] opacity-[0.02] bg-[radial-gradient(circle_at_50%_50%,white,transparent_60%)]" />
        </div>
      )}
    </motion.div>
  );
};
