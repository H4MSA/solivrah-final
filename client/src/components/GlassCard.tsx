
import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { useApp } from "@/context/AppContext";
import { motion, HTMLMotionProps, Variants } from "framer-motion";

interface GlassCardProps extends Omit<HTMLMotionProps<"div">, "animate"> {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "elevated" | "subtle" | "primary" | "interactive" | "dark" | "theme" | "premium" | "ultra-glass" | "duolingo" | "achievement";
  animate?: "fade" | "pop" | "blur" | "none";
  interactive?: boolean;
  depth?: "low" | "medium" | "high";
  hoverEffect?: boolean;
  ariaLabel?: string;
  role?: string; 
  ariaLabelledBy?: string;
  tabIndex?: number;
}

export const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(({ 
  children, 
  className,
  variant = "default",
  animate = "none",
  interactive = false,
  depth = "medium",
  hoverEffect = false,
  ariaLabel,
  role,
  ariaLabelledBy,
  tabIndex,
  ...props 
}, ref) => {
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
      // Enhanced monochromatic variants with sophisticated glass effects
      case "default": return "glass";
      case "elevated": return "glass border-white/20 bg-gradient-to-br from-white/8 to-white/3";
      case "subtle": return "bg-white/[0.02] backdrop-blur-sm border-white/5";
      case "primary": return "bg-white text-black border-white/30 shadow-lg";
      case "interactive": return "glass hover:bg-white/10 cursor-pointer";
      case "dark": return "bg-black/95 backdrop-blur-xl border-white/10";
      case "theme": return "glass";
      case "premium": return "bg-gradient-to-br from-white/12 to-white/4 backdrop-blur-2xl border-white/15 shadow-2xl";
      case "ultra-glass": return "bg-white/[0.03] backdrop-blur-2xl border-white/25 shadow-3xl";
      case "duolingo": return "bg-gradient-to-br from-white/10 via-white/5 to-white/2 backdrop-blur-xl border-white/20 hover:from-white/15 hover:via-white/8 hover:to-white/4";
      case "achievement": return "bg-gradient-to-br from-white/20 via-white/10 to-white/5 backdrop-blur-xl border-white/30 shadow-2xl animate-pulse-color";
      default: return "glass";
    }
  };

  const getDepthStyle = () => {
    switch (depth) {
      case "low": return "shadow-sm";
      case "high": return "shadow-md";
      default: return "shadow-sm";
    }
  };

  // Proper ARIA handling for interactive cards
  const getAriaProps = () => {
    const ariaProps: Record<string, any> = {};
    
    if (interactive) {
      ariaProps.role = role || "button";
      ariaProps["aria-label"] = ariaLabel;
      ariaProps["aria-labelledby"] = ariaLabelledBy;
      ariaProps.tabIndex = tabIndex ?? 0;
    } else if (role) {
      ariaProps.role = role;
      ariaProps["aria-label"] = ariaLabel;
      ariaProps["aria-labelledby"] = ariaLabelledBy;
    }
    
    return ariaProps;
  };

  // Focus handling for keyboard navigation
  const getInteractiveClasses = () => {
    if (interactive) {
      return "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-white/20";
    }
    return "";
  };

  return (
    <motion.div 
      ref={ref}
      className={cn(
        "border rounded-xl p-4 mb-4 transition-all duration-300 w-full",
        "max-w-full overflow-hidden", // Prevent overflow
        getBgClass(),
        "border-[#333333]",
        interactive && "cursor-pointer",
        getAnimationClass(),
        getDepthStyle(),
        getInteractiveClasses(),
        className
      )}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      whileTap="tap"
      variants={cardVariants}
      {...getAriaProps()}
      {...props}
    >
      <div className="relative w-full">
        {children}
      </div>
    </motion.div>
  );
});

GlassCard.displayName = "GlassCard";
