
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
  with3D?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({ 
  children, 
  className,
  variant = "default",
  animate = "none",
  interactive = false,
  depth = "medium",
  hoverEffect = false,
  with3D = false,
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
      case "elevated": return "bg-[#1A1A1A]/90 border-white/5";
      case "subtle": return "bg-black/60 border-white/5";
      case "primary": return "bg-[#1A1A1A] text-white border-transparent";
      case "interactive": return "bg-black/80 hover:bg-[#1A1A1A]/90";
      case "dark": return "bg-black/90";
      case "theme": return "bg-black/80";
      case "premium": return "bg-gradient-to-br from-black/90 to-[#1A1A1A]/95";
      case "ultra-glass": return "bg-black/40 border-white/10";
      default: return "bg-black/80";
    }
  };

  const getDepthStyle = () => {
    switch (depth) {
      case "low": return "shadow-sm";
      case "high": return "shadow-glass-hover";
      default: return "shadow-glass";
    }
  };

  // 3D effect properties
  const get3DProps = () => {
    if (!with3D) return {};
    
    return {
      whileHover: { 
        rotateX: 5, 
        rotateY: 5, 
        scale: 1.02,
        transition: { duration: 0.2 }
      },
      style: {
        transformStyle: "preserve-3d" as "preserve-3d"
      }
    };
  };

  // Simplified motion props for better performance
  const motionProps = {
    whileHover: hoverEffect && !with3D ? { scale: 1.01, y: -2 } : {},
    whileTap: interactive ? { scale: 0.98 } : {},
    transition: { type: 'spring', stiffness: 500, damping: 30 },
    ...get3DProps()
  };

  return (
    <motion.div 
      className={cn(
        "border rounded-xl p-4 mb-4 transition-colors duration-200",
        getBgClass(),
        "backdrop-blur-xl",
        interactive && "cursor-pointer",
        getAnimationClass(),
        getDepthStyle(),
        with3D && "transform-gpu perspective-1000",
        className
      )}
      {...motionProps}
      {...props}
    >
      <div className={cn("relative", with3D && "transform-style-3d")}>
        {children}
      </div>
    </motion.div>
  );
};

// Gradient border card variant
export const GradientBorderCard: React.FC<{
  children: React.ReactNode;
  className?: string;
  gradientFrom?: string;
  gradientTo?: string;
}> = ({ 
  children, 
  className,
  gradientFrom = "from-white/10",
  gradientTo = "to-white/5"
}) => {
  return (
    <div className={cn(
      "relative rounded-xl p-[1px] mb-4",
      `bg-gradient-to-r ${gradientFrom} ${gradientTo}`,
      "shadow-glass",
      className
    )}>
      <div className="absolute inset-0 rounded-xl bg-black/80 backdrop-blur-xl" />
      <div className="relative z-10 p-4">
        {children}
      </div>
    </div>
  );
};
