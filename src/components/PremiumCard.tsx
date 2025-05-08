
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
    ...(hoverEffect ? { whileHover: { y: -4 } } : {}),
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
        "rounded-2xl backdrop-blur-xl p-6 mb-5 transition-all duration-300 overflow-hidden",
        variant === "default" && "bg-solivrah-card border-solivrah-border text-white",
        variant === "selected" && "bg-solivrah-card-hover border-white/30 text-white",
        variant === "dark" && "bg-black/90 text-white",
        variant === "subtle" && "bg-black/20 border-white/5 text-white",
        variant === "black" && "bg-black text-white",
        variant === "premium" && "bg-gradient-to-br from-[#1A1A1A] to-[#101010] text-white",
        variant === "glass" && "bg-black/40 backdrop-blur-xl text-white",
        withBorder && "border border-white/10",
        interactive && "cursor-pointer hover:border-white/20",
        getDepthStyle(),
        className
      )}
      {...motionProps}
      {...props}
    >
      <div className="relative flex flex-col">
        {children}
      </div>
      
      {/* Simplified gradient overlay for premium feel */}
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
      className={cn("p-6", className)}
      interactive={true}
      onClick={onClick}
      {...props}
    >
      <div className="flex items-center gap-5">
        {icon && (
          <div className={cn(
            "flex items-center justify-center w-12 h-12 rounded-full", 
            selected ? "bg-white text-black shadow-lg" : "bg-white/10 text-white"
          )}>
            {icon}
          </div>
        )}
        <div>
          <h3 className="text-lg font-semibold">{title}</h3>
          {description && (
            <p className="text-base text-white/70 mt-2 leading-relaxed">{description}</p>
          )}
        </div>
      </div>
    </PremiumCard>
  );
};
