
import React from 'react';
import { ArrowRight } from 'lucide-react';
import { cn } from "@/lib/utils";
import { motion, HTMLMotionProps } from "framer-motion";

interface StartButtonProps {
  children: React.ReactNode;
  variant?: 'default' | 'outline';
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
}

export const StartButton = React.forwardRef<HTMLButtonElement, StartButtonProps>(
  ({ className, children, variant = 'default', onClick, disabled, type, ...props }, ref) => {
    // Create motion props separately to avoid type conflicts
    const motionProps: HTMLMotionProps<"button"> = {
      whileHover: { y: -2 },
      whileTap: { scale: 0.98 },
      transition: { type: "spring", stiffness: 400, damping: 25 }
    };
    
    // HTML button props
    const buttonProps = {
      ref,
      className: cn(
        "w-full flex items-center justify-center gap-3 py-3 px-5 rounded-xl transition-colors duration-200",
        "text-sm font-medium touch-manipulation",
        variant === 'default' 
          ? "bg-[#222222] text-white hover:bg-[#2a2a2a] shadow-md border border-white/10" 
          : "bg-transparent text-white border border-white/10 hover:bg-white/5",
        className
      ),
      onClick,
      disabled,
      type
    };
    
    return (
      <motion.button
        {...motionProps}
        {...buttonProps}
        {...props}
      >
        {children}
        <ArrowRight size={18} />
      </motion.button>
    );
  }
);

StartButton.displayName = 'StartButton';
