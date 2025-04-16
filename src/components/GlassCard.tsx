
import React from "react";
import { cn } from "@/lib/utils";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "elevated" | "subtle" | "primary" | "accent" | "interactive" | "dark";
  animate?: "fade" | "pop" | "blur" | "none";
}

export const GlassCard: React.FC<GlassCardProps> = ({ 
  children, 
  className,
  variant = "default",
  animate = "none",
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
        "backdrop-blur-md border rounded-2xl shadow-lg transition-all duration-300",
        variant === "default" && "bg-card/40 border-white/10",
        variant === "elevated" && "bg-card/60 border-white/20 shadow-xl",
        variant === "subtle" && "bg-card/20 border-white/5",
        variant === "primary" && "bg-gradient-to-br from-primary/30 to-secondary/30 border-primary/20",
        variant === "accent" && "bg-gradient-to-br from-accent/30 to-accent/10 border-accent/20",
        variant === "interactive" && "bg-card/40 border-white/10 hover:bg-card/60 hover:border-white/20 cursor-pointer active:scale-[0.98]",
        variant === "dark" && "bg-black/70 border-white/5 hover:border-white/10",
        "hover:shadow-xl",
        getAnimationClass(),
        "p-6",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
