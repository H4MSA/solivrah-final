import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { motion, type MotionProps } from "framer-motion"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-2xl text-base font-semibold ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-5 [&_svg]:shrink-0 shadow-lg hover:shadow-xl active:shadow-md",
  {
    variants: {
      variant: {
        default: "bg-[#232323]/80 text-white glassmorphism-card border border-white/10 hover:bg-[#232323]/90",
        destructive: "bg-red-500/90 text-white glassmorphism-card border border-red-500/30 hover:bg-red-600/90",
        outline: "border border-white/20 bg-black/20 hover:bg-black/30 hover:border-white/30 text-white backdrop-blur-md glassmorphism-card",
        secondary: "bg-[#232323]/60 text-white glassmorphism-card border border-white/10 hover:bg-[#232323]/80",
        ghost: "hover:bg-white/10 text-white glassmorphism-card border border-white/5",
        link: "text-white underline-offset-4 hover:underline",
        neumorphic: "bg-gradient-to-b from-[#252525] to-[#1A1A1A] text-white border border-white/10 shadow-xl hover:shadow-2xl",
        premium: "bg-gradient-to-b from-[#232323] to-[#111] text-white border border-white/15 shadow-2xl hover:shadow-3xl glass-premium",
      },
      size: {
        default: "h-16 px-8 py-4 text-lg",
        sm: "h-12 rounded-xl px-6 py-3 text-base",
        lg: "h-20 rounded-2xl px-10 py-6 text-xl",
        icon: "h-14 w-14",
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
