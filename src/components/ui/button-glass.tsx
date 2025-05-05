
import React from 'react';
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-normal transition-all duration-200 active:scale-[0.98] focus-visible:outline-none disabled:opacity-40 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        primary: "bg-off-white text-black border border-border-dark rounded-custom",
        secondary: "bg-dark-gray text-white border border-border-medium rounded-xl",
        outline: "border border-border-medium bg-transparent text-white rounded-custom",
        ghost: "bg-transparent text-white hover:bg-white/5 rounded-custom",
        destructive: "bg-destructive text-white hover:bg-destructive/90 rounded-custom",
        accent: "bg-light-gray text-black rounded-custom",
      },
      size: {
        default: "h-12 px-6 py-3",
        sm: "h-9 rounded-lg px-3 py-2 text-xs",
        lg: "h-14 px-8 py-4 text-[13px]",
        icon: "h-10 w-10",
      },
      fullWidth: {
        true: "w-full",
      },
      withGlow: {
        true: "shadow-md",
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
    const Comp = asChild ? Slot : "button";
    
    return (
      <motion.div
        className={cn(
          buttonVariants({ variant, size, fullWidth, withGlow, className }),
          loading && "opacity-80",
          "relative"
        )}
        whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
        whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        <Comp
          ref={ref}
          disabled={disabled || loading}
          {...props}
          className="contents"
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
      </motion.div>
    );
  }
);

ButtonGlass.displayName = "ButtonGlass";

export { ButtonGlass, buttonVariants };
