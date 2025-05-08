
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
        boxShadow: "0 15px 30px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.07)"
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
        "rounded-2xl backdrop-blur-xl transition-all duration-300 overflow-hidden",
        variant === "default" && "bg-solivrah-card border-solivrah-border text-white",
        variant === "selected" && "bg-solivrah-card-hover border-white/30 text-white",
        variant === "dark" && "bg-black/90 text-white",
        variant === "subtle" && "bg-black/20 border-white/5 text-white",
        variant === "black" && "bg-black text-white",
        variant === "premium" && "bg-gradient-to-br from-[#1A1A1A] to-[#101010] text-white",
        variant === "glass" && "bg-black/40 backdrop-blur-xl text-white",
        withBorder && "border border-white/10",
        interactive && "cursor-pointer hover:border-white/20",
        hoverEffect && "hover:-translate-y-1 transition-transform",
        getDepthStyle(),
        className
      )}
      {...motionProps}
      {...props}
    >
      <div className="relative">
        {children}
      </div>
      
      {/* Simple gradient overlay for premium feel without performance cost */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
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
      className={cn("p-5", className)}
      interactive={true}
      onClick={onClick}
      {...props}
    >
      <div className="flex items-center gap-4">
        {icon && (
          <div className={cn(
            "flex items-center justify-center w-10 h-10 rounded-full", 
            selected ? "bg-white text-black shadow-lg" : "bg-white/10 text-white"
          )}>
            {icon}
          </div>
        )}
        <div>
          <h3 className="text-lg font-semibold">{title}</h3>
          {description && (
            <p className="text-base text-white/70 mt-1">{description}</p>
          )}
        </div>
      </div>
    </PremiumCard>
  );
};
