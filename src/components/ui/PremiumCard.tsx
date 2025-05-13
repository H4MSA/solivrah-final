
import React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface PremiumCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: "default" | "selected" | "dark" | "subtle" | "glass" | "premium";
  interactive?: boolean;
  hoverEffect?: boolean;
  className?: string;
}

export const PremiumCard = ({
  children,
  className,
  variant = "default",
  interactive = false,
  hoverEffect = false,
  ...props
}: PremiumCardProps) => {
  return (
    <motion.div
      className={cn(
        "rounded-xl p-5 mb-4 transition-all duration-300",
        variant === "default" && "bg-[#151515] text-white border border-white/10",
        variant === "selected" && "bg-[#1A1A1A] border-white/20 text-white border",
        variant === "dark" && "bg-black/90 text-white border border-white/5",
        variant === "subtle" && "bg-black/20 border-white/5 text-white border",
        variant === "glass" && "bg-black/40 backdrop-blur-xl text-white border border-white/10",
        variant === "premium" && "bg-gradient-to-br from-[#151515] to-[#0D0D0D] text-white border border-white/10",
        interactive && "cursor-pointer",
        className
      )}
      whileHover={hoverEffect ? { y: -4, transition: { duration: 0.2 } } : undefined}
      whileTap={interactive ? { scale: 0.98 } : undefined}
      {...props}
    >
      {children}
    </motion.div>
  );
};
