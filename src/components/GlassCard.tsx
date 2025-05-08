
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { useApp } from "@/context/AppContext";
import { motion, HTMLMotionProps } from "framer-motion";

interface GlassCardProps extends Omit<HTMLMotionProps<"div">, "animate"> {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "elevated" | "subtle" | "primary" | "interactive" | "dark" | "theme" | "premium" | "ultra-glass";
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
      boxShadow: `0 8px 25px ${color}`
    };
  };

  const getDepthStyle = () => {
    switch (depth) {
      case "low": return "shadow-md";
      case "high": return "shadow-xl";
      default: return "shadow-lg";
    }
  };

  const handleTouchStart = () => interactive && setIsPressed(true);
  const handleTouchEnd = () => interactive && setIsPressed(false);

  // Simplified animation props for better performance
  const motionProps: any = {
    initial: false,
    style: {
      ...getThemeStyle(),
      transform: isPressed ? 'scale(0.98)' : 'scale(1)'
    },
    whileHover: hoverEffect ? { y: -4 } : {},
    whileTap: interactive ? { scale: 0.98 } : {}
  };

  const getBgClass = () => {
    switch (variant) {
      case "default": return "bg-black/50";
      case "elevated": return "bg-black/30 border-white/20";
      case "subtle": return "bg-black/20 border-white/5";
      case "primary": return "bg-white text-black border-transparent";
      case "interactive": return "bg-black/40 hover:bg-black/30";
      case "dark": return "bg-[#0A0A0A]/95";
      case "theme": return "bg-black/40";
      case "premium": return "bg-gradient-to-br from-[#1A1A1A] to-[#101010]";
      case "ultra-glass": return "bg-black/30 backdrop-blur-2xl border-white/20";
      default: return "bg-black/50";
    }
  };

  return (
    <motion.div 
      className={cn(
        "backdrop-blur-xl border rounded-2xl p-6 mb-5 transition-all duration-300",
        getBgClass(),
        "border-white/10",
        interactive && "cursor-pointer",
        getAnimationClass(),
        getDepthStyle(),
        className
      )}
      {...motionProps}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleTouchStart}
      onMouseUp={handleTouchEnd}
      {...props}
    >
      <div className="relative">
        {children}
      </div>
      
      {/* Single, simplified gradient overlay for premium feel without performance cost */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
    </motion.div>
  );
};
