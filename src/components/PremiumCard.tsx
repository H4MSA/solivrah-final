
import React from "react";
import { cn } from "@/lib/utils";
import { motion, HTMLMotionProps } from "framer-motion";

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
  // Prepare motion props separately to avoid type conflicts
  const motionProps: any = {
    ...(hoverEffect ? { 
      whileHover: { 
        y: -4, 
        scale: 1.01,
        boxShadow: "0 20px 40px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.07)"
      } 
    } : {}),
    ...(interactive ? { whileTap: { scale: 0.98 } } : {})
  };

  const getDepthStyle = () => {
    switch (depth) {
      case "low": return "shadow-md";
      case "high": return "shadow-xl";
      default: return "shadow-lg";
    }
  };

  return (
    <motion.div
      className={cn(
        "rounded-xl backdrop-blur-xl transition-all duration-300 overflow-hidden transform-gpu will-change-transform",
        variant === "default" && "bg-solivrah-card border-solivrah-border text-white",
        variant === "selected" && "bg-solivrah-card-hover border-white/30 text-white",
        variant === "dark" && "bg-black/90 text-white",
        variant === "subtle" && "bg-black/20 border-white/5 text-white",
        variant === "black" && "bg-black text-white",
        variant === "premium" && "bg-gradient-to-br from-[#1A1A1A] to-[#101010] text-white",
        variant === "glass" && "glass-effect text-white",
        withBorder && "border border-white/10",
        interactive && "cursor-pointer hover:border-white/20",
        hoverEffect && "hover-lift",
        getDepthStyle(),
        className
      )}
      {...motionProps}
      {...props}
    >
      <div className="relative z-10">
        {children}
      </div>
      
      {/* Premium lighting effect */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
      
      {/* 3D effect highlight */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-50 rounded-xl pointer-events-none" />
    </motion.div>
  );
};

// Variant for option selection cards like in the images
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
            "flex items-center justify-center w-7 h-7 rounded-full", 
            selected ? "bg-white text-black shadow-lg" : "bg-white/10 text-white"
          )}>
            {icon}
          </div>
        )}
        <div>
          <h3 className="font-medium">{title}</h3>
          {description && (
            <p className="text-sm text-white/70 mt-0.5">{description}</p>
          )}
        </div>
      </div>
    </PremiumCard>
  );
};
