import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { useApp } from "@/context/AppContext";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "elevated" | "subtle" | "primary" | "interactive" | "dark";
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
  const [isPressed, setIsPressed] = useState(false);

  const getAnimationClass = () => {
    switch (animate) {
      case "fade": return "animate-fade-in";
      case "pop": return "animate-pop-in";
      case "blur": return "animate-blur-in";
      default: return "";
    }
  };

  const handleTouchStart = () => interactive && setIsPressed(true);
  const handleTouchEnd = () => interactive && setIsPressed(false);

  return (
    <div 
      className={cn(
        "relative backdrop-blur-lg border rounded-2xl transition-all duration-300 transform-gpu will-change-transform",
        variant === "default" && "bg-black/75 border-white/5 text-white shadow-[0_8px_16px_-6px_rgba(0,0,0,0.2)]",
        variant === "elevated" && "bg-white/5 border-white/10 shadow-xl text-white",
        variant === "subtle" && "bg-black/50 border-white/5 text-white",
        variant === "primary" && "bg-white text-black border-transparent",
        variant === "interactive" && "bg-black/80 border-white/10 hover:bg-black/90 hover:border-white/20 cursor-pointer active:scale-[0.98]",
        variant === "dark" && "bg-black border-white/5 hover:border-white/10",
        interactive && "cursor-pointer hover:scale-[1.02] active:scale-[0.98] hover:shadow-lg",
        isPressed && "scale-[0.98]",
        getAnimationClass(),
        "p-4 md:p-5",
        className
      )}
      style={{
        transform: `${isPressed ? 'scale(0.98)' : 'scale(1)'}`,
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)'
      }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleTouchStart}
      onMouseUp={handleTouchEnd}
      onMouseLeave={() => setIsPressed(false)}
      {...props}
    >
      {children}
    </div>
  );
};