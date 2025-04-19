
import React from 'react';
import { ArrowRight } from 'lucide-react';
import { cn } from "@/lib/utils";

interface StartButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'default' | 'outline';
}

export const StartButton = React.forwardRef<HTMLButtonElement, StartButtonProps>(
  ({ className, children, variant = 'default', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl transition-all duration-300",
          "text-sm font-medium active:scale-[0.98] touch-manipulation",
          variant === 'default' 
            ? "bg-[#222222] text-white hover:bg-[#2a2a2a] shadow-lg border border-white/10" 
            : "bg-transparent text-white border border-white/10 hover:bg-white/5",
          className
        )}
        {...props}
      >
        {children}
        <ArrowRight className="w-4 h-4" />
      </button>
    );
  }
);

StartButton.displayName = 'StartButton';
