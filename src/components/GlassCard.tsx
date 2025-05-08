
import React from "react";
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
  hoverEffect = false,
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

  const getBgClass = () => {
    switch (variant) {
      case "default": return "bg-black/80";
      case "elevated": return "bg-black/90 border-white/10";
      case "subtle": return "bg-black/70 border-white/5";
      case "primary": return "bg-white text-black border-transparent";
      case "interactive": return "bg-black/80 hover:bg-black/90";
      case "dark": return "bg-black/90";
      case "theme": return "bg-black/80";
      case "premium": return "bg-black/80";
      case "ultra-glass": return "bg-black/80 border-white/20";
      default: return "bg-black/80";
    }
  };

  const getDepthStyle = () => {
    switch (depth) {
      case "low": return "shadow-sm";
      case "high": return "shadow-md";
      default: return "shadow-sm";
    }
  };

  // Simplified motion props for better performance
  const motionProps = {
    whileHover: hoverEffect ? { scale: 1.01 } : {},
    whileTap: interactive ? { scale: 0.98 } : {},
    transition: { type: 'spring', stiffness: 500, damping: 30 }
  };

  return (
    <motion.div 
      className={cn(
        "border rounded-xl p-4 mb-4 transition-colors duration-200",
        getBgClass(),
        "border-[#333333]",
        interactive && "cursor-pointer",
        getAnimationClass(),
        getDepthStyle(),
        className
      )}
      {...motionProps}
      {...props}
    >
      <div className="relative">
        {children}
      </div>
    </motion.div>
  );
};
