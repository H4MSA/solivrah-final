
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { useApp } from "@/context/AppContext";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "elevated" | "subtle" | "primary" | "accent" | "interactive" | "dark";
  animate?: "fade" | "pop" | "blur" | "none";
  interactive?: boolean;
  depth?: "low" | "medium" | "high";
}

export const GlassCard: React.FC<GlassCardProps> = ({ 
  children, 
  className,
  variant = "default",
  animate = "none",
  interactive = false,
  depth = "medium",
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

  // Enhanced 3D depth styles for iPhone 14
  const getDepthStyle = () => {
    const baseTransform = isPressed ? 'scale(0.98)' : ''; 

    switch (depth) {
      case "low": return { 
        transform: `translateZ(3px) ${baseTransform}`, 
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.3)" 
      };
      case "high": return { 
        transform: `translateZ(15px) ${baseTransform}`, 
        boxShadow: "0 25px 30px -12px rgba(0, 0, 0, 0.5)" 
      };
      default: return { 
        transform: `translateZ(8px) ${baseTransform}`, 
        boxShadow: "0 15px 20px -5px rgba(0, 0, 0, 0.4)" 
      };
    }
  };

  // Touch event handlers for better mobile interaction
  const handleTouchStart = () => {
    if (interactive) setIsPressed(true);
  };

  const handleTouchEnd = () => {
    if (interactive) setIsPressed(false);
  };

  return (
    <div 
      className={cn(
        "backdrop-blur-xl border rounded-xl shadow-lg transition-all duration-300 transform-gpu perspective-1000",
        variant === "default" && "bg-[#1A1A1A]/90 border-white/10 text-white",
        variant === "elevated" && "bg-[#222222]/90 border-white/15 shadow-xl text-white",
        variant === "subtle" && "bg-[#151515]/80 border-white/5 text-white",
        variant === "primary" && "bg-gradient-to-br from-[#2D2D2D]/90 to-[#1A1A1A]/90 border-white/10",
        variant === "accent" && "bg-gradient-to-br from-[#333333]/90 to-[#1E1E1E]/90 border-white/10",
        variant === "interactive" && "bg-[#1E1E1E]/90 border-white/10 hover:bg-[#252525]/90 hover:border-white/20 cursor-pointer active:scale-[0.98]",
        variant === "dark" && "bg-black/90 border-white/5 hover:border-white/10",
        interactive && "cursor-pointer hover:shadow-xl active:scale-[0.98] hover:bg-[#222222]/90",
        getAnimationClass(),
        "p-5",
        className
      )}
      style={getDepthStyle()}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleTouchStart}
      onMouseUp={handleTouchEnd}
      onMouseLeave={() => setIsPressed(false)}
      {...props}
    >
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};
