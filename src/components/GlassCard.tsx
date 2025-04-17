
import React from "react";
import { cn } from "@/lib/utils";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "elevated" | "subtle" | "primary" | "accent" | "interactive" | "dark";
  animate?: "fade" | "pop" | "blur" | "none";
  interactive?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({ 
  children, 
  className,
  variant = "default",
  animate = "none",
  interactive = false,
  ...props 
}) => {
  const getAnimationClass = () => {
    switch (animate) {
      case "fade": return "animate-fade-in";
      case "pop": return "animate-pop-in";
      case "blur": return "animate-blur-in";
      default: return "";
    }
  };

  return (
    <div 
      className={cn(
        "backdrop-blur-md border rounded-xl shadow-lg transition-all duration-300",
        variant === "default" && "bg-[#121212]/90 border-[#333333] text-white",
        variant === "elevated" && "bg-[#181818]/95 border-[#383838] shadow-xl text-white",
        variant === "subtle" && "bg-[#0D0D0D]/95 border-[#222222] text-white",
        variant === "primary" && "bg-gradient-to-br from-[#121212]/95 to-[#1F1F1F]/95 border-[#333333]",
        variant === "accent" && "bg-gradient-to-br from-[#1D1D1D]/95 to-[#121212]/95 border-[#333333]",
        variant === "interactive" && "bg-[#121212]/95 border-[#333333] hover:bg-[#181818] hover:border-[#444444] cursor-pointer active:scale-[0.98]",
        variant === "dark" && "bg-black/90 border-[#222222] hover:border-[#333333]",
        interactive && "cursor-pointer hover:shadow-xl active:scale-[0.98] hover:bg-[#181818]",
        getAnimationClass(),
        "p-5",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
