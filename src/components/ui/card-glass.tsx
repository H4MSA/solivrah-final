import * as React from "react";
import { cn } from "@/lib/utils";
import { motion, HTMLMotionProps } from "framer-motion";

interface CardGlassProps extends Omit<HTMLMotionProps<"div">, "children"> {
  children: React.ReactNode;
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
          return "bg-gradient-to-b from-off-white/90 to-medium-gray/90";
        case "secondary":
          return "bg-gradient-to-b from-medium-gray to-dark-gray";
        default:
          return "bg-gradient-to-b from-light-gray to-dark-gray";
      }
    };
    
    const getBorderClasses = () => {
      if (!withBorder) return "border-0";
      switch (variant) {
        case "accent":
          return "border border-border-dark";
        case "secondary":
          return "border border-border-medium";
        default:
          return "border border-border-dark";
      }
    };
    
    // Filter out any motion specific props that might cause conflicts
    const motionProps = {
      whileHover: interactive ? { scale: 1.02, y: -2 } : undefined,
      whileTap: interactive ? { scale: 0.98 } : undefined,
      transition: { type: "spring", stiffness: 400, damping: 17 }
    };
    
    return (
      <motion.div
        ref={ref}
        className={cn(
          "rounded-custom backdrop-blur-md overflow-hidden p-5 relative",
          getVariantClasses(),
          getBorderClasses(),
          interactive && "cursor-pointer",
          withGlow && "shadow-md",
          className
        )}
        {...motionProps}
        {...props}
      >
        {children}
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
