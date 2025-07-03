
import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';
import { useSoundManager } from './sound-manager';

interface EnhancedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  showArrow?: boolean;
  celebrateOnClick?: boolean;
  soundEffect?: 'button-click' | 'quest-complete' | 'milestone';
}

export const EnhancedButton: React.FC<EnhancedButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  showArrow = false,
  celebrateOnClick = false,
  soundEffect = 'button-click',
  className,
  onClick,
  ...props
}) => {
  const [isClicked, setIsClicked] = React.useState(false);
  const { playSound } = useSoundManager();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (celebrateOnClick) {
      setIsClicked(true);
      setTimeout(() => setIsClicked(false), 200);
    }
    
    // Play sound effect
    playSound(soundEffect);
    
    onClick?.(e);
  };

  const baseClasses = "relative overflow-hidden font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/20 focus:ring-offset-2 focus:ring-offset-black";
  
  const variantClasses = {
    primary: "bg-white text-black hover:bg-[#cccccc] shadow-lg active:scale-95",
    secondary: "bg-[#333333] text-white border border-[#666666] hover:bg-[#666666] hover:border-[#999999] active:scale-95",
    ghost: "bg-transparent text-white hover:bg-white/10 active:scale-95"
  };

  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2.5 text-base",
    lg: "px-6 py-3 text-lg"
  };

  // Filter out conflicting props that might interfere with Framer Motion
  const {
    onDrag,
    onDragStart,
    onDragEnd,
    onDragEnter,
    onDragLeave,
    onDragOver,
    onDrop,
    onAnimationStart,
    onAnimationEnd,
    onAnimationIteration,
    onTransitionEnd,
    ...filteredProps
  } = props;

  return (
    <motion.button
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        loading && "opacity-70 cursor-not-allowed",
        className
      )}
      onClick={handleClick}
      disabled={loading}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      animate={isClicked ? { 
        boxShadow: "0 0 20px rgba(255,255,255,0.5)",
        scale: [1, 1.05, 1]
      } : {}}
      transition={{ duration: 0.2 }}
      {...filteredProps}
    >
      <div className="flex items-center justify-center gap-2">
        {loading ? (
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        ) : (
          <>
            {children}
            {showArrow && (
              <motion.div
                animate={{ x: [0, 3, 0] }}
                transition={{ 
                  repeat: Infinity, 
                  duration: 1.5,
                  ease: "easeInOut",
                  repeatDelay: 0.5
                }}
              >
                <ArrowRight size={16} />
              </motion.div>
            )}
          </>
        )}
      </div>

      {/* Ripple effect */}
      <motion.div
        className="absolute inset-0 bg-white/20 rounded-xl"
        initial={{ scale: 0, opacity: 1 }}
        animate={isClicked ? { scale: 2, opacity: 0 } : { scale: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
      />
    </motion.button>
  );
};
