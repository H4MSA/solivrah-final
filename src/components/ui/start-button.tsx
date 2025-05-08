
import React from 'react';
import { ArrowRight } from 'lucide-react';
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface StartButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'default' | 'outline';
}

export const StartButton = React.forwardRef<HTMLButtonElement, StartButtonProps>(
  ({ className, children, variant = 'default', ...props }, ref) => {
    return (
      <motion.button
        ref={ref}
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.98 }}
        className={cn(
          "w-full flex items-center justify-center gap-3 py-4 px-6 rounded-xl transition-all duration-300",
          "text-base font-medium touch-manipulation",
          variant === 'default' 
            ? "bg-[#222222] text-white hover:bg-[#2a2a2a] shadow-lg border border-white/10" 
            : "bg-transparent text-white border border-white/10 hover:bg-white/5",
          className
        )}
        {...props}
      >
        {children}
        <ArrowRight className="w-5 h-5" />
      </motion.button>
    );
  }
);

StartButton.displayName = 'StartButton';
