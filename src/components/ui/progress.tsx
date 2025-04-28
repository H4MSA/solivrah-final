
import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

interface ProgressProps extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
  indicatorClassName?: string;
  size?: "xs" | "sm" | "md" | "lg";
  showValue?: boolean;
  animated?: boolean;
  progressTextClassName?: string;
  levelIndicator?: boolean;
  glassMorphism?: boolean;
  glowEffect?: boolean;
  glowColor?: string;
}

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressProps
>(({ 
    className, 
    value, 
    indicatorClassName, 
    size = "md", 
    showValue = false, 
    animated = true, 
    progressTextClassName, 
    levelIndicator = false,
    glassMorphism = true,
    glowEffect = false,
    glowColor,
    ...props 
  }, ref) => {
  const getHeightClass = () => {
    switch (size) {
      case "xs": return "h-1";
      case "sm": return "h-1.5";
      case "lg": return "h-4";
      default: return "h-2.5";
    }
  };
  
  const level = Math.floor((value || 0) / 100) + 1;

  return (
    <div className="relative w-full">
      {/* Progress backdrop */}
      <ProgressPrimitive.Root
        ref={ref}
        className={cn(
          "relative w-full overflow-hidden rounded-full",
          glassMorphism ? "bg-black/40 backdrop-blur-md border border-white/10" : "bg-black/50",
          getHeightClass(),
          className
        )}
        {...props}
      >
        {/* Progress indicator */}
        <ProgressPrimitive.Indicator
          className={cn(
            "h-full flex-1 rounded-full transition-all duration-500",
            animated && "animate-pulse-slow",
            glassMorphism ? "bg-gradient-to-r from-white/40 to-white/20" : "bg-white/60",
            indicatorClassName
          )}
          style={{ width: `${value || 0}%` }}
        />
        
        {/* Glow effect */}
        {glowEffect && (
          <div 
            className="absolute inset-0 rounded-full opacity-50 blur-md"
            style={{ background: glowColor || "rgba(255,255,255,0.3)", width: `${value || 0}%` }}
          />
        )}
      </ProgressPrimitive.Root>
      
      {/* Value label */}
      {showValue && (
        <span className={cn(
          "absolute text-xs text-white/70 right-0 top-0 transform -translate-y-6",
          progressTextClassName
        )}>
          {Math.round(value || 0)}%
        </span>
      )}
      
      {/* Level indicator */}
      {levelIndicator && (
        <motion.div 
          className="absolute top-1/2 right-0 transform translate-x-[calc(100%+8px)] -translate-y-1/2 bg-black/70 backdrop-blur-md text-white/90 text-xs font-medium px-2.5 py-1 rounded-full border border-white/10 shadow-lg"
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        >
          Lvl {level}
        </motion.div>
      )}
    </div>
  );
});

Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };
