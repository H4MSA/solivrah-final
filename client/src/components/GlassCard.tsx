
import React, { forwardRef } from "react";
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
      // Improved contrast ratios for better accessibility
      case "default": return "bg-[#1A1A1A]";
      case "elevated": return "bg-[#1D1D1D] border-white/15";
      case "subtle": return "bg-[#141414] border-white/5";
      case "primary": return "bg-[#1D1D1D] text-white border-white/15";
      case "interactive": return "bg-[#1A1A1A] hover:bg-[#222222]";
      case "dark": return "bg-black/90";
      case "theme": return "bg-[#1A1A1A]";
      case "premium": return "bg-gradient-to-br from-[#1D1D1D] to-[#0D0D0D]";
      case "ultra-glass": return "bg-[#1A1A1A]/85 backdrop-blur-md border-white/20";
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
