
import React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface PremiumCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: "default" | "selected" | "dark" | "subtle" | "black" | "premium" | "glass";
  interactive?: boolean;
  hoverEffect?: boolean;
  className?: string;
  withBorder?: boolean;
  depth?: "low" | "medium" | "high";
}

export const PremiumCard: React.FC<PremiumCardProps> = ({
  children,
  className,
  variant = "default",
  interactive = false,
  hoverEffect = false,
  withBorder = true,
  depth = "medium",
  ...props
}) => {
  // Simplified motion props for better performance
  const motionProps: any = {
    ...(hoverEffect ? { whileHover: { y: -2 } } : {}),
    ...(interactive ? { whileTap: { scale: 0.98 } } : {})
  };

  const getDepthStyle = () => {
    switch (depth) {
      case "low": return "shadow-sm";
      case "high": return "shadow-lg";
      default: return "shadow-md";
    }
  };

  return (
    <motion.div
      className={cn(
        "rounded-xl p-5 mb-5 transition-colors duration-200",
        variant === "default" && "bg-[#1A1A1A] text-white",
        variant === "selected" && "bg-[#222222] border-white/10 text-white",
        variant === "dark" && "bg-black text-white",
        variant === "subtle" && "bg-black/60 border-white/5 text-white",
        variant === "black" && "bg-black text-white",
        variant === "premium" && "bg-[#1A1A1A] text-white",
        variant === "glass" && "bg-black/60 text-white",
        withBorder && "border border-[#333333]",
        interactive && "cursor-pointer",
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

// Variant for option selection cards
export const OptionCard: React.FC<PremiumCardProps & {
  selected?: boolean;
  icon?: React.ReactNode;
  title: string;
  description?: string;
  onClick?: () => void;
}> = ({
  selected = false,
  icon,
  title,
  description,
  onClick,
  className,
  ...props
}) => {
  return (
    <PremiumCard
      variant={selected ? "selected" : "default"}
      className={cn("p-4", className)}
      interactive={true}
      onClick={onClick}
      {...props}
    >
      <div className="flex items-center gap-3">
        {icon && (
          <div className={cn(
            "flex items-center justify-center w-10 h-10 rounded-full", 
            selected ? "bg-white text-black shadow-md" : "bg-white/10 text-white"
          )}>
            {icon}
          </div>
        )}
        <div>
          <h3 className="text-base font-semibold">{title}</h3>
          {description && (
            <p className="text-sm text-white/70 mt-1 leading-relaxed">{description}</p>
          )}
        </div>
      </div>
    </PremiumCard>
  );
};
