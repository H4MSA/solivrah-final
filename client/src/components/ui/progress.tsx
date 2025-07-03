
import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

import { cn } from "@/lib/utils"

interface ProgressProps extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
  indicatorClassName?: string;
  size?: "sm" | "md" | "lg";
  showValue?: boolean;
  animated?: boolean;
  progressTextClassName?: string;
  levelIndicator?: boolean;
}

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressProps
>(({ className, value, indicatorClassName, size = "md", showValue = false, animated = true, progressTextClassName, levelIndicator = false, ...props }, ref) => {
  const getHeightClass = () => {
    switch (size) {
      case "sm": return "h-1";
      case "md": return "h-2";
      case "lg": return "h-3";
      default: return "h-2";
    }
  };

  return (
    <div className="relative w-full">
      <ProgressPrimitive.Root
        ref={ref}
        className={cn(
          "relative w-full overflow-hidden rounded-full bg-[#1A1A1A]",
          getHeightClass(),
          className
        )}
        {...props}
      >
        <ProgressPrimitive.Indicator
          className={cn(
            "h-full w-full flex-1 rounded-full transition-all duration-700 ease-in-out",
            animated && "animate-pulse-slow",
            indicatorClassName || "bg-white"
          )}
          style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
        />
      </ProgressPrimitive.Root>
      
      {showValue && (
        <span className={cn(
          "absolute text-xs text-[#CCCCCC] right-0 top-0 transform -translate-y-6 font-medium",
          progressTextClassName
        )}>
          {Math.round(value || 0)}%
        </span>
      )}
      
      {levelIndicator && (
        <div className="absolute top-1/2 right-0 transform translate-x-[calc(100%+8px)] -translate-y-1/2 bg-[#222222] text-white text-xs font-bold px-2 py-1 rounded-full border border-[#333333] shadow-lg">
          Lvl {Math.floor((value || 0) / 100) + 1}
        </div>
      )}
    </div>
  )
})
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }
