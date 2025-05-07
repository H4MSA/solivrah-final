
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
    switch (depth) {
      case "low": return "0 4px 15px rgba(0,0,0,0.15), 0 1px 5px rgba(0,0,0,0.1)";
      case "high": return "0 20px 40px rgba(0,0,0,0.3), 0 10px 15px rgba(0,0,0,0.2)";
      default: return "0 10px 25px rgba(0,0,0,0.2), 0 4px 10px rgba(0,0,0,0.1)";
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
        ? `0 20px 40px rgba(0, 0, 0, 0.3), 0 8px 15px rgba(0, 0, 0, 0.15)` 
        : getDepthStyle()
    },
    transition: { 
      type: "spring", 
      stiffness: 400, 
      damping: 17 
    }
  };

  const getBgClass = () => {
    switch (variant) {
      case "default": return "bg-black/50";
      case "elevated": return "bg-black/30 border-white/20";
      case "subtle": return "bg-black/20 border-white/5";
      case "primary": return "bg-gradient-to-b from-white/95 to-white/90 text-black border-transparent";
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
        "relative backdrop-blur-xl border rounded-xl transition-all duration-300 transform-gpu will-change-transform overflow-hidden",
        getBgClass(),
        "border-white/10",
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
      <div className="relative z-10">
        {children}
      </div>
      
      {/* Glass effect lighting */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
      
      {/* 3D highlight effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-50 rounded-xl pointer-events-none" />
      
      {variant === "ultra-glass" && (
        <div className="absolute inset-0 rounded-xl overflow-hidden">
          <div className="absolute -inset-[100%] opacity-[0.03] bg-[radial-gradient(circle_at_50%_50%,white,transparent_60%)]" />
          <div className="absolute inset-0 backdrop-blur-2xl" />
        </div>
      )}
    </motion.div>
  );
};
