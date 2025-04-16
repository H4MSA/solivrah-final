
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
        "bg-[#3A4546]/80 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-lg animate-fade-in", 
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
