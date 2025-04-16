
import React from "react";
import { cn } from "@/lib/utils";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export const GlassCard: React.FC<GlassCardProps> = ({ 
  children, 
  className, 
  ...props 
}) => {
  return (
    <div 
      className={cn(
        "bg-secondary/30 backdrop-blur-md border border-white/10 rounded-xl p-6 shadow-lg animate-fade-in", 
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
