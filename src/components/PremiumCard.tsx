
import React from "react";
import { cn } from "@/lib/utils";
import { motion, HTMLMotionProps } from "framer-motion";

interface PremiumCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: "default" | "selected" | "dark" | "subtle" | "black" | "ultra" | "frost";
  interactive?: boolean;
  hoverEffect?: boolean;
  className?: string;
  withBorder?: boolean;
  glowEffect?: boolean;
  glowColor?: string;
}

export const PremiumCard: React.FC<PremiumCardProps> = ({
  children,
  className,
  variant = "default",
  interactive = false,
  hoverEffect = false,
  withBorder = true,
  glowEffect = false,
  glowColor,
  ...props
}) => {
  // Prepare motion props separately to avoid type conflicts
  const motionProps: any = {
    ...(hoverEffect ? { 
      whileHover: { y: -4, scale: 1.01 },
      transition: { type: "spring", stiffness: 400, damping: 25 }
    } : {}),
    ...(interactive ? { whileTap: { scale: 0.98 } } : {})
  };

  return (
    <motion.div
      className={cn(
        "rounded-xl backdrop-blur-xl transition-all duration-300 overflow-hidden p-4 relative",
        variant === "default" && "bg-[#0A0A0A]/80 text-white",
        variant === "selected" && "bg-[#0F0F0F]/90 text-white border-white/30",
        variant === "dark" && "bg-[#090909]/90 text-white",
        variant === "subtle" && "bg-[#111111]/60 text-white",
        variant === "black" && "bg-black text-white",
        variant === "ultra" && "bg-black/30 backdrop-blur-2xl text-white",
        variant === "frost" && "bg-white/5 backdrop-blur-lg text-white",
        withBorder && "border border-white/10",
        interactive && "cursor-pointer hover:border-white/20",
        hoverEffect && "hover:translate-y-[-2px] hover:shadow-lg",
        className
      )}
      {...motionProps}
      {...props}
    >
      {children}
      
      {/* Inner highlight effect */}
      <div className="absolute inset-0 rounded-xl pointer-events-none border border-white/5 bg-gradient-to-b from-white/5 to-transparent" />
      
      {/* Glow effect */}
      {glowEffect && (
        <div 
          className="absolute -inset-1 rounded-xl opacity-30 blur-xl pointer-events-none z-0" 
          style={{ background: glowColor || "rgba(255,255,255,0.1)" }} 
        />
      )}
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
      glowEffect={selected}
      glowColor={selected ? "rgba(255,255,255,0.08)" : undefined}
      {...props}
    >
      <div className="flex items-center gap-3 relative z-10">
        {icon && (
          <div className={cn(
            "flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300", 
            selected ? "bg-white text-black" : "bg-white/10 text-white"
          )}>
            {icon}
          </div>
        )}
        <div>
          <h3 className="font-medium text-base">{title}</h3>
          {description && (
            <p className="text-sm text-white/70 mt-0.5">{description}</p>
          )}
        </div>
      </div>
    </PremiumCard>
  );
};
