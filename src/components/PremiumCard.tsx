
import React from "react";
import { cn } from "@/lib/utils";
import { motion, HTMLMotionProps } from "framer-motion";

interface PremiumCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: "default" | "selected" | "dark" | "subtle" | "black";
  interactive?: boolean;
  hoverEffect?: boolean;
  className?: string;
  withBorder?: boolean;
}

export const PremiumCard: React.FC<PremiumCardProps> = ({
  children,
  className,
  variant = "default",
  interactive = false,
  hoverEffect = false,
  withBorder = true,
  ...props
}) => {
  // Prepare motion props separately to avoid type conflicts
  const motionProps: any = {
    ...(hoverEffect ? { whileHover: { y: -4, scale: 1.01 } } : {}),
    ...(interactive ? { whileTap: { scale: 0.98 } } : {})
  };

  return (
    <motion.div
      className={cn(
        "rounded-[8px] backdrop-blur-xl transition-all duration-300 overflow-hidden p-4",
        variant === "default" && "bg-[#0A0A0A]/80 text-white",
        variant === "selected" && "bg-[#0F0F0F]/90 text-white border-white/30",
        variant === "dark" && "bg-[#090909]/90 text-white",
        variant === "subtle" && "bg-[#111111]/60 text-white",
        variant === "black" && "bg-black text-white",
        withBorder && "border border-white/10",
        interactive && "cursor-pointer hover:border-white/20", // Fixed: replaced isInteractive with interactive
        hoverEffect && "hover:translate-y-[-2px]",
        className
      )}
      {...motionProps}
      {...props}
    >
      {children}
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
            "flex items-center justify-center w-6 h-6 rounded-full", 
            selected ? "bg-white text-black" : "bg-white/10 text-white"
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
