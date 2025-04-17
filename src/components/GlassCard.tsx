
import React from "react";
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

  const getAnimationClass = () => {
    switch (animate) {
      case "fade": return "animate-fade-in";
      case "pop": return "animate-pop-in";
      case "blur": return "animate-blur-in";
      default: return "";
    }
  };

  // Get theme-specific border glow
  const getThemeGlow = () => {
    if (variant === "subtle" || variant === "dark") return "transparent";
    
    switch (selectedTheme) {
      case "Discipline": return "rgba(255, 0, 0, 0.1)";
      case "Focus": return "rgba(0, 128, 128, 0.1)";
      case "Resilience": return "rgba(255, 165, 0, 0.1)";
      case "Wildcards": return "rgba(0, 255, 0, 0.1)";
      default: return "rgba(255, 255, 255, 0.05)";
    }
  };

  // Get 3D depth styles
  const getDepthStyle = () => {
    switch (depth) {
      case "low": return { transform: "translateZ(2px)", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" };
      case "high": return { transform: "translateZ(10px)", boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.2)" };
      default: return { transform: "translateZ(5px)", boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.15)" };
    }
  };

  return (
    <div 
      className={cn(
        "backdrop-blur-md border rounded-xl shadow-lg transition-all duration-300 transform-gpu perspective-1000",
        variant === "default" && "bg-black/40 border-white/10 text-white",
        variant === "elevated" && "bg-black/50 border-white/15 shadow-xl text-white",
        variant === "subtle" && "bg-black/30 border-white/5 text-white",
        variant === "primary" && "bg-gradient-to-br from-black/60 to-black/40 border-white/10",
        variant === "accent" && "bg-gradient-to-br from-black/50 to-black/30 border-white/10",
        variant === "interactive" && "bg-black/40 border-white/10 hover:bg-black/50 hover:border-white/20 cursor-pointer active:scale-[0.98]",
        variant === "dark" && "bg-black/70 border-white/5 hover:border-white/10",
        interactive && "cursor-pointer hover:shadow-xl active:scale-[0.98] hover:bg-black/50",
        getAnimationClass(),
        "p-5",
        className
      )}
      style={{ 
        boxShadow: `0 10px 30px -5px ${getThemeGlow()}, 0 8px 10px -6px rgba(0, 0, 0, 0.1)`,
        ...getDepthStyle()
      }}
      {...props}
    >
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};
