
import React from "react";
import { cn } from "@/lib/utils";
import { useApp } from "@/context/AppContext";
import { motion, HTMLMotionProps, Variants } from "framer-motion";

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

  // Enhanced card animations
  const cardVariants: Variants = {
    hidden: { 
      opacity: 0,
      y: 20,
      scale: 0.95,
    },
    visible: { 
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    },
    hover: hoverEffect ? { 
      y: -5,
      boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 8px 10px -6px rgba(0, 0, 0, 0.2)", 
      transition: { duration: 0.3 } 
    } : {},
    tap: interactive ? { 
      scale: 0.98,
      transition: { duration: 0.1 } 
    } : {}
  };

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
      case "default": return "bg-[#1A1A1A]";
      case "elevated": return "bg-[#222222] border-white/10";
      case "subtle": return "bg-[#141414] border-white/5";
      case "primary": return "bg-[#252525] text-white border-white/10";
      case "interactive": return "bg-[#1A1A1A] hover:bg-[#222222]";
      case "dark": return "bg-black/90";
      case "theme": return "bg-[#1A1A1A]";
      case "premium": return "bg-gradient-to-br from-[#222222] to-[#1A1A1A]";
      case "ultra-glass": return "bg-[#1A1A1A]/80 backdrop-blur-md border-white/20";
      default: return "bg-[#1A1A1A]";
    }
  };

  const getDepthStyle = () => {
    switch (depth) {
      case "low": return "shadow-sm";
      case "high": return "shadow-md";
      default: return "shadow-sm";
    }
  };

  return (
    <motion.div 
      className={cn(
        "border rounded-xl p-4 mb-4 transition-all duration-300",
        getBgClass(),
        "border-[#333333]",
        interactive && "cursor-pointer",
        getAnimationClass(),
        getDepthStyle(),
        className
      )}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      whileTap="tap"
      variants={cardVariants}
      {...props}
    >
      <div className="relative">
        {children}
      </div>
    </motion.div>
  );
};
