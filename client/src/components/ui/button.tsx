import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { motion, type MotionProps } from "framer-motion"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-2xl font-semibold ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-5 [&_svg]:shrink-0 touch-manipulation relative overflow-hidden",
  {
    variants: {
      variant: {
        // Primary: White button with black text (Duolingo-inspired)
        default: "bg-white text-black border border-white/20 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] hover:bg-white/95",
        
        // Destructive: Gray monochromatic
        destructive: "bg-gray-600 text-white border border-gray-500/50 hover:bg-gray-700 shadow-lg hover:shadow-xl",
        
        // Outline: Transparent with white border
        outline: "border-2 border-white/30 bg-transparent hover:bg-white/10 hover:border-white/50 text-white backdrop-blur-md shadow-md hover:shadow-lg",
        
        // Secondary: Dark with subtle white accents
        secondary: "bg-gray-800/80 text-white border border-white/10 hover:bg-gray-700/90 hover:border-white/20 shadow-md hover:shadow-lg",
        
        // Ghost: Minimal hover effect
        ghost: "hover:bg-white/10 text-white border border-transparent hover:border-white/10 shadow-none hover:shadow-md",
        
        // Link: Simple text button
        link: "text-white underline-offset-4 hover:underline shadow-none",
        
        // Neumorphic: Premium raised effect
        neumorphic: "bg-gradient-to-b from-gray-700 to-gray-800 text-white border border-white/10 shadow-2xl hover:shadow-3xl hover:scale-[1.02]",
        
        // Premium: Maximum visual impact with glow
        premium: "bg-gradient-to-b from-white to-gray-100 text-black border border-white/30 shadow-2xl hover:shadow-3xl hover:scale-[1.03] hover:shadow-white/20",
        
        // Gamification: Special variant for achievements and rewards
        reward: "bg-gradient-to-r from-white/90 to-white/80 text-black border border-white/40 shadow-xl hover:shadow-2xl hover:scale-[1.05] animate-pulse-subtle",
      },
      size: {
        default: "h-14 px-8 py-4 text-base",
        sm: "h-10 rounded-xl px-4 py-2 text-sm",
        lg: "h-16 rounded-2xl px-10 py-5 text-lg",
        xl: "h-20 rounded-3xl px-12 py-6 text-xl",
        icon: "h-12 w-12 rounded-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

// Fix: Define proper types for Framer Motion buttons to avoid TypeScript errors
type MotionButtonPropsWithoutMotion = Omit<ButtonProps, 
  keyof MotionProps
>;

// Combined type for Motion Button
interface MotionButtonProps extends MotionButtonPropsWithoutMotion, MotionProps {}

const MotionButton = React.forwardRef<HTMLButtonElement, MotionButtonProps>(
  ({ className, variant, size, asChild = false, whileHover, whileTap, ...props }, ref) => {
    // Default animation values with proper typing
    const motionProps: MotionProps = {
      whileHover: whileHover || { scale: 1.02 },
      whileTap: whileTap || { scale: 0.98 },
      transition: props.transition || { type: "spring", stiffness: 500, damping: 30 },
    };
    
    // Extract Framer Motion specific props to avoid passing them to the HTML element
    const { 
      transition, 
      animate, 
      initial, 
      exit,
      ...buttonProps 
    } = props;
    
    return (
      <motion.button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...motionProps}
        {...buttonProps}
      />
    )
  }
)
MotionButton.displayName = "MotionButton"

export { Button, MotionButton, buttonVariants }
