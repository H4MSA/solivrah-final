
import * as React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface CardGlassProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "primary" | "secondary" | "accent";
  interactive?: boolean;
  withBorder?: boolean;
  withGlow?: boolean;
  glassOpacity?: "light" | "medium" | "heavy";
}

const CardGlass = React.forwardRef<HTMLDivElement, CardGlassProps>(
  ({ 
    className, 
    variant = "primary", 
    interactive = false,
    withBorder = true,
    withGlow = false,
    glassOpacity = "medium",
    children,
    ...props 
  }, ref) => {
    const getVariantClasses = () => {
      switch (variant) {
        case "accent":
          return "border-l-2 border-l-neon-green";
        case "secondary":
          return "bg-black/50";
        default:
          return "bg-black/70";
      }
    };
    
    const getOpacityClasses = () => {
      switch (glassOpacity) {
        case "light":
          return "bg-black/30";
        case "heavy":
          return "bg-black/80";
        default:
          return variant === "secondary" ? "bg-black/50" : "bg-black/70";
      }
    };
    
    return (
      <motion.div
        ref={ref}
        className={cn(
          "rounded-2xl backdrop-blur-xl border-t border-l border-white/10 border-b border-r border-black/20 shadow-glass overflow-hidden p-5 relative",
          getVariantClasses(),
          getOpacityClasses(),
          interactive && "cursor-pointer",
          !withBorder && "border-0",
          withGlow && "after:content-[''] after:absolute after:inset-0 after:z-[-1] after:rounded-2xl after:blur-lg after:bg-neon-green/10 after:opacity-0 hover:after:opacity-100 after:transition-opacity",
          className
        )}
        whileHover={interactive ? { scale: 1.02, y: -2 } : undefined}
        whileTap={interactive ? { scale: 0.98 } : undefined}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
        {...props}
      >
        {children}
        
        {/* Inner highlight effect */}
        <div className="absolute inset-0 rounded-2xl pointer-events-none bg-gradient-to-b from-white/5 to-transparent" />
      </motion.div>
    );
  }
);

CardGlass.displayName = "CardGlass";

interface CardGlassHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

const CardGlassHeader = React.forwardRef<HTMLDivElement, CardGlassHeaderProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("mb-4", className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

CardGlassHeader.displayName = "CardGlassHeader";

interface CardGlassTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {}

const CardGlassTitle = React.forwardRef<HTMLHeadingElement, CardGlassTitleProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <h3
        ref={ref}
        className={cn(
          "text-xl font-semibold leading-none tracking-tight text-white",
          className
        )}
        {...props}
      >
        {children}
      </h3>
    );
  }
);

CardGlassTitle.displayName = "CardGlassTitle";

interface CardGlassDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {}

const CardGlassDescription = React.forwardRef<HTMLParagraphElement, CardGlassDescriptionProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <p
        ref={ref}
        className={cn("text-sm text-white/70", className)}
        {...props}
      >
        {children}
      </p>
    );
  }
);

CardGlassDescription.displayName = "CardGlassDescription";

interface CardGlassContentProps extends React.HTMLAttributes<HTMLDivElement> {}

const CardGlassContent = React.forwardRef<HTMLDivElement, CardGlassContentProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("", className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

CardGlassContent.displayName = "CardGlassContent";

interface CardGlassFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

const CardGlassFooter = React.forwardRef<HTMLDivElement, CardGlassFooterProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("flex items-center mt-4 pt-4 border-t border-white/5", className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

CardGlassFooter.displayName = "CardGlassFooter";

export { 
  CardGlass,
  CardGlassHeader,
  CardGlassTitle,
  CardGlassDescription,
  CardGlassContent,
  CardGlassFooter
};
