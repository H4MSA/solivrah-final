
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-base font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-[#222222] text-white hover:bg-[#2A2A2A] shadow-md border border-white/5",
        destructive: "bg-red-500/90 text-white hover:bg-red-500/80 shadow-md",
        outline: "border border-white/20 bg-black/20 hover:bg-black/30 hover:border-white/30 text-white backdrop-blur-md",
        secondary: "bg-solivrah-button text-white hover:bg-solivrah-button-hover shadow-md border border-white/5",
        ghost: "hover:bg-white/5 text-white",
        link: "text-white underline-offset-4 hover:underline",
        neumorphic: "bg-gradient-to-b from-[#252525] to-[#1A1A1A] text-white border border-white/5 shadow-lg hover:shadow-xl",
        premium: "bg-gradient-to-b from-[#1A1A1A] to-[#0A0A0A] text-white border border-white/10 shadow-button hover:shadow-button-hover",
      },
      size: {
        default: "h-14 px-6 py-3",
        sm: "h-10 rounded-lg px-4 py-2",
        lg: "h-14 rounded-xl px-8 py-4",
        icon: "h-12 w-12",
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

// Create a separate MotionButton component that wraps the Button component
interface MotionButtonProps extends ButtonProps {
  whileHover?: any;
  whileTap?: any;
  transition?: any;
  animate?: any;
  initial?: any;
  exit?: any;
}

const MotionButton = React.forwardRef<HTMLButtonElement, MotionButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    // Default animation values
    const motionProps = {
      whileHover: props.whileHover || { scale: 1.02 },
      whileTap: props.whileTap || { scale: 0.98 },
      transition: props.transition || { type: "spring", stiffness: 500, damping: 30 },
    };
    
    // Remove framer-motion specific props from the props passed to the button
    const { whileHover, whileTap, transition, animate, initial, exit, ...buttonProps } = props;
    
    return (
      <motion.button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...motionProps}
        animate={animate}
        initial={initial}
        exit={exit}
        {...buttonProps}
      />
    )
  }
)
MotionButton.displayName = "MotionButton"

export { Button, MotionButton, buttonVariants }
