import React from 'react';
import { motion, type MotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface PremiumButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive' | 'outline' | 'premium';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isLoading?: boolean;
  showArrow?: boolean;
  celebrateOnClick?: boolean;
  children: React.ReactNode;
}

export const PremiumButton: React.FC<PremiumButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  showArrow = false,
  celebrateOnClick = false,
  className,
  onClick,
  disabled,
  ...props
}) => {
  const [isPressed, setIsPressed] = React.useState(false);

  const baseClasses = `
    relative overflow-hidden font-semibold rounded-2xl transition-all duration-300 
    focus:outline-none focus:ring-2 focus:ring-white/20 focus:ring-offset-2 focus:ring-offset-black
    disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation
    select-none active:scale-[0.98]
  `;

  const variantClasses = {
    primary: `
      bg-white text-black border border-white/20 shadow-lg 
      hover:shadow-xl hover:scale-[1.02] hover:bg-white/95
      active:scale-[0.98]
    `,
    secondary: `
      bg-gray-800/80 text-white border border-white/10 
      hover:bg-gray-700/90 hover:border-white/20 shadow-md hover:shadow-lg
    `,
    ghost: `
      hover:bg-white/10 text-white border border-transparent 
      hover:border-white/10 shadow-none hover:shadow-md
    `,
    destructive: `
      bg-gray-600 text-white border border-gray-500/50 
      hover:bg-gray-700 shadow-lg hover:shadow-xl
    `,
    outline: `
      border-2 border-white/30 bg-transparent hover:bg-white/10 
      hover:border-white/50 text-white backdrop-blur-md shadow-md hover:shadow-lg
    `,
    premium: `
      bg-gradient-to-b from-white to-gray-100 text-black border border-white/30 
      shadow-2xl hover:shadow-3xl hover:scale-[1.03] hover:shadow-white/20
    `
  };

  const sizeClasses = {
    sm: 'h-10 px-4 py-2 text-sm rounded-xl',
    md: 'h-12 px-6 py-3 text-base',
    lg: 'h-14 px-8 py-4 text-lg',
    xl: 'h-16 px-10 py-5 text-xl rounded-3xl'
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || isLoading) return;
    
    setIsPressed(true);
    setTimeout(() => setIsPressed(false), 200);
    
    if (celebrateOnClick) {
      // Add celebration effect
      const rect = e.currentTarget.getBoundingClientRect();
      const particles = Array.from({ length: 8 }, (_, i) => {
        const particle = document.createElement('div');
        particle.className = 'fixed w-1 h-1 bg-white rounded-full pointer-events-none z-50';
        particle.style.left = `${rect.left + rect.width / 2}px`;
        particle.style.top = `${rect.top + rect.height / 2}px`;
        document.body.appendChild(particle);
        
        const angle = (i / 8) * Math.PI * 2;
        const distance = 40;
        const x = Math.cos(angle) * distance;
        const y = Math.sin(angle) * distance;
        
        particle.animate([
          { transform: 'translate(0, 0) scale(1)', opacity: 1 },
          { transform: `translate(${x}px, ${y}px) scale(0)`, opacity: 0 }
        ], {
          duration: 600,
          easing: 'ease-out'
        }).onfinish = () => particle.remove();
      });
    }
    
    onClick?.(e);
  };

  return (
    <motion.button
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      onClick={handleClick}
      disabled={disabled || isLoading}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      animate={isPressed ? { 
        boxShadow: "0 0 20px rgba(255,255,255,0.5)",
      } : {}}
      // Filter out animation-related props to avoid conflicts
      {...Object.fromEntries(
        Object.entries(props).filter(([key]) => 
          !key.startsWith('onAnimation') && 
          !key.startsWith('onTransition') &&
          key !== 'animate' &&
          key !== 'transition' &&
          key !== 'initial' &&
          key !== 'exit'
        )
      )}
    >
      {/* Shimmer effect overlay */}
      <div className="absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
      
      {/* Content */}
      <div className="relative flex items-center justify-center gap-2">
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <>
            {children}
            {showArrow && (
              <motion.svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                animate={{ x: [0, 4, 0] }}
                transition={{ 
                  repeat: Infinity, 
                  duration: 1.5,
                  ease: "easeInOut",
                  repeatDelay: 0.5
                }}
              >
                <polyline points="9,18 15,12 9,6" />
              </motion.svg>
            )}
          </>
        )}
      </div>
      
      {/* Ripple effect for touch feedback */}
      {isPressed && (
        <motion.div
          className="absolute inset-0 bg-white/20 rounded-2xl"
          initial={{ scale: 0, opacity: 1 }}
          animate={{ scale: 2, opacity: 0 }}
          transition={{ duration: 0.4 }}
        />
      )}
    </motion.button>
  );
};