
import React from 'react';
import { ArrowRight } from 'lucide-react';
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

type StartButtonPropsWithoutMotion = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  'onAnimationStart' | 'onDrag' | 'onDragEnd' | 'onDragStart' | 'onAnimationComplete' | 'style'
>;

type FramerProps = {
  whileHover?: object;
  whileTap?: object;
  transition?: object;
  animate?: object;
  initial?: object;
  exit?: object;
  style?: React.CSSProperties | any;
};

type StartButtonProps = {
  children: React.ReactNode;
  variant?: 'default' | 'outline';
  className?: string;
} & StartButtonPropsWithoutMotion & FramerProps;

export const StartButton = React.forwardRef<HTMLButtonElement, StartButtonProps>(
  ({ className, children, variant = 'default', whileHover, whileTap, ...props }, ref) => {
    // Set default motion props
    const motionProps = {
      whileHover: whileHover || { scale: 1.02 },
      whileTap: whileTap || { scale: 0.98 },
    };

    // Extract any remaining Framer Motion props to avoid conflicts
    const {
      transition,
      animate,
      initial,
      exit,
      ...buttonProps
    } = props;

    return (
      <motion.button
        ref={ref}
        className={cn(
          "w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg transition-colors duration-200",
          "text-xs font-medium",
          variant === 'default' 
            ? "bg-black/80 text-white hover:bg-black/90 shadow-sm border border-white/10" 
            : "bg-transparent text-white border border-white/10 hover:bg-black/50",
          className
        )}
        {...motionProps}
        animate={animate}
        initial={initial}
        exit={exit}
        transition={transition}
        {...buttonProps}
      >
        {children}
        <ArrowRight size={14} />
      </motion.button>
    );
  }
);

StartButton.displayName = 'StartButton';
