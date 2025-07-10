import React, { useState, useRef, ReactNode } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

// Define card variants using CVA
const cardVariants = cva(
  "relative rounded-xl backdrop-blur-md border overflow-hidden transition-all duration-300",
  {
    variants: {
      variant: {
        default: "bg-white/10 border-white/20 shadow-lg",
        subtle: "bg-white/5 border-white/10 shadow-md",
        solid: "bg-card border-white/5 shadow-xl",
        outline: "bg-transparent border-white/20",
        ghost: "border-transparent shadow-none bg-transparent",
      },
      size: {
        sm: "p-2",
        default: "p-4",
        lg: "p-6",
      },
      interactive: {
        true: "cursor-pointer hover:shadow-xl active:scale-[0.98] transition-transform",
        false: "",
      },
      tilt: {
        none: "",
        subtle: "hover:shadow-xl",
        medium: "hover:shadow-xl",
        strong: "hover:shadow-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      interactive: false,
      tilt: "none",
    },
  }
);

export interface GlassCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  children: ReactNode;
  tiltStrength?: number;
  glareOpacity?: number;
  perspective?: number;
}

export function GlassCard({
  className,
  variant,
  size,
  interactive,
  tilt = "none",
  tiltStrength = 20,
  glareOpacity = 0.1,
  perspective = 800,
  children,
  ...props
}: GlassCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  
  // Motion values for tilt effect
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  // Spring animations for smoother movement
  const springConfig = { damping: 20, stiffness: 300 };
  const xSpring = useSpring(x, springConfig);
  const ySpring = useSpring(y, springConfig);
  
  // Map the motion values to rotation values
  const getTiltFactor = () => {
    if (tilt === "subtle") return 0.5;
    if (tilt === "medium") return 1;
    if (tilt === "strong") return 1.5;
    return 0;
  };
  
  const tiltFactor = getTiltFactor() * tiltStrength;
  const rotateX = useTransform(ySpring, [-0.5, 0.5], [tiltFactor, -tiltFactor]);
  const rotateY = useTransform(xSpring, [-0.5, 0.5], [-tiltFactor, tiltFactor]);
  
  // Handle mouse move for tilt effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (tilt === "none" || !cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    // Calculate normalized position (from -0.5 to 0.5)
    const xPos = (e.clientX - rect.left) / width - 0.5;
    const yPos = (e.clientY - rect.top) / height - 0.5;
    
    x.set(xPos);
    y.set(yPos);
  };
  
  // Reset position when mouse leaves
  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };
  
  return (
    <motion.div
      ref={cardRef}
      className={cn(cardVariants({ variant, size, interactive, tilt }), className)}
      style={{
        perspective: perspective,
        transformStyle: "preserve-3d",
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {/* Card content with 3D transform */}
      <motion.div
        style={{
          rotateX: tilt !== "none" ? rotateX : 0,
          rotateY: tilt !== "none" ? rotateY : 0,
          transformStyle: "preserve-3d",
        }}
      >
        {children}
      </motion.div>
      
      {/* Glare effect */}
      {tilt !== "none" && (
        <motion.div
          className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-white to-transparent opacity-0"
          style={{
            opacity: isHovered ? glareOpacity : 0,
            backgroundPosition: `${(x.get() + 0.5) * 100}% ${(y.get() + 0.5) * 100}%`,
            mixBlendMode: "overlay",
          }}
        />
      )}
    </motion.div>
  );
} 