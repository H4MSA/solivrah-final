
import React from 'react';
import { ArrowRight } from 'lucide-react';
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface StartButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'default' | 'outline';
  className?: string;
}

export const StartButton = React.forwardRef<HTMLButtonElement, StartButtonProps>(
  ({ className, children, variant = 'default', ...props }, ref) => {
    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={cn(
          "w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg transition-colors duration-200",
          "text-xs font-medium",
          variant === 'default' 
            ? "bg-black/80 text-white hover:bg-black/90 shadow-sm border border-white/10" 
            : "bg-transparent text-white border border-white/10 hover:bg-black/50",
          className
        )}
        {...props}
      >
        {children}
        <ArrowRight size={14} />
      </motion.button>
    );
  }
);

StartButton.displayName = 'StartButton';
