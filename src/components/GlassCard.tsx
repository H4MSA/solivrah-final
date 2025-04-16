
import React from "react";
import { cn } from "@/lib/utils";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "elevated" | "subtle";
}

export const GlassCard: React.FC<GlassCardProps> = ({ 
  children, 
  className,
  variant = "default",
  ...props 
}) => {
  return (
    <div 
      className={cn(
        "backdrop-blur-md border rounded-2xl shadow-lg animate-fade-in transition-all duration-300",
        variant === "default" && "bg-[#3A4546]/80 border-white/10",
        variant === "elevated" && "bg-[#3A4546]/90 border-white/20",
        variant === "subtle" && "bg-[#3A4546]/60 border-white/5",
        "hover:border-white/20",
        "p-6",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
