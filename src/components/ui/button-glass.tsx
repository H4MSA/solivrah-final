
import React from 'react';
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition-all duration-200 active:scale-[0.98] focus-visible:outline-none disabled:opacity-40 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        primary: "bg-gradient-to-r from-neon-green to-soft-lime text-black shadow-md hover:shadow-lg",
        secondary: "backdrop-blur-md bg-white/10 text-white border border-white/20 hover:bg-white/20 shadow-sm hover:shadow-md",
        outline: "border border-white/20 bg-transparent text-white hover:bg-white/5",
        ghost: "bg-transparent text-white hover:bg-white/5",
        destructive: "bg-destructive text-white hover:bg-destructive/90",
        accent: "bg-gradient-to-r from-soft-purple to-electric-blue/80 text-white shadow-md hover:shadow-lg",
      },
      size: {
        default: "h-12 px-6 py-3",
        sm: "h-9 rounded-lg px-3 py-2 text-xs",
        lg: "h-14 px-8 py-4 text-base",
        icon: "h-10 w-10",
      },
      fullWidth: {
        true: "w-full",
      },
      withGlow: {
        true: "after:content-[''] after:absolute after:inset-0 after:z-[-1] after:rounded-xl after:blur-xl after:bg-gradient-to-r after:from-neon-green/30 after:to-soft-lime/30 after:opacity-0 hover:after:opacity-100 after:transition-opacity",
      }
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
      fullWidth: false,
      withGlow: false,
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
}

const ButtonGlass = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant, 
    size, 
    fullWidth,
    withGlow,
    asChild = false,
    loading = false,
    disabled,
    children,
    icon,
    iconPosition = "left",
    ...props 
  }, ref) => {
    const Comp = asChild ? Slot : motion.button;
    
    return (
      <Comp
        className={cn(
          buttonVariants({ variant, size, fullWidth, withGlow, className }),
          loading && "opacity-80",
          "relative"
        )}
        ref={ref}
        disabled={disabled || loading}
        whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
        whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
        {...props}
      >
        {loading && (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        )}
        
        {!loading && icon && iconPosition === "left" && (
          <span className="mr-1">{icon}</span>
        )}
        
        {children}
        
        {!loading && icon && iconPosition === "right" && (
          <span className="ml-1">{icon}</span>
        )}
      </Comp>
    );
  }
);

ButtonGlass.displayName = "ButtonGlass";

export { ButtonGlass, buttonVariants };
