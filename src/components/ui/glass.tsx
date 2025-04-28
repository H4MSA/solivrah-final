
import React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export interface GlassPaneProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "ultra" | "standard" | "light" | "dark" | "frost";
  hoverEffect?: boolean;
  pressEffect?: boolean;
  glowEffect?: boolean;
  glowColor?: string;
  innerBorder?: boolean;
  depth?: "low" | "medium" | "high";
  interactive?: boolean;
  noPadding?: boolean;
}

export const GlassPane = React.forwardRef<HTMLDivElement, GlassPaneProps>(
  (
    {
      children,
      className,
      variant = "standard",
      hoverEffect = false,
      pressEffect = true,
      glowEffect = false,
      glowColor,
      innerBorder = true,
      depth = "medium",
      interactive = false,
      noPadding = false,
      ...props
    },
    ref
  ) => {
    const getDepthStyles = () => {
      switch (depth) {
        case "low":
          return "shadow-sm border-opacity-5";
        case "high":
          return "shadow-xl border-opacity-15";
        default:
          return "shadow-md border-opacity-10";
      }
    };

    const getVariantStyles = () => {
      switch (variant) {
        case "ultra":
          return "bg-black/30 backdrop-blur-2xl";
        case "light":
          return "bg-white/5 backdrop-blur-md";
        case "dark":
          return "bg-black/70 backdrop-blur-xl";
        case "frost":
          return "bg-white/10 backdrop-blur-xl";
        default:
          return "bg-black/40 backdrop-blur-lg";
      }
    };

    return (
      <motion.div
        ref={ref}
        className={cn(
          "relative rounded-xl border border-white/10 transition-all duration-300 overflow-hidden",
          getVariantStyles(),
          getDepthStyles(),
          hoverEffect && "hover:bg-white/10 hover:border-white/20 hover:-translate-y-0.5",
          pressEffect && interactive && "active:scale-[0.98]",
          interactive && "cursor-pointer",
          !noPadding && "p-4",
          className
        )}
        whileHover={hoverEffect ? { y: -4 } : undefined}
        whileTap={interactive && pressEffect ? { scale: 0.98 } : undefined}
        {...props}
      >
        {children}
        
        {/* Inner highlight effect */}
        {innerBorder && (
          <div className="absolute inset-0 rounded-xl pointer-events-none border border-white/5 bg-gradient-to-b from-white/5 to-transparent" />
        )}
        
        {/* Glow effect */}
        {glowEffect && (
          <div 
            className="absolute -inset-1 rounded-xl opacity-30 blur-xl pointer-events-none z-0" 
            style={{ background: glowColor || "rgba(255,255,255,0.1)" }} 
          />
        )}
      </motion.div>
    );
  }
);

GlassPane.displayName = "GlassPane";

export interface GlassCardProps extends GlassPaneProps {
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  footer?: React.ReactNode;
  headerClassName?: string;
  bodyClassName?: string;
  footerClassName?: string;
}

export const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  (
    {
      children,
      className,
      title,
      subtitle,
      icon,
      footer,
      headerClassName,
      bodyClassName,
      footerClassName,
      ...props
    },
    ref
  ) => {
    return (
      <GlassPane ref={ref} className={cn("flex flex-col", className)} {...props}>
        {(title || subtitle || icon) && (
          <div className={cn("flex items-center gap-3 mb-3", headerClassName)}>
            {icon && (
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white/10 text-white">
                {icon}
              </div>
            )}
            <div>
              {title && <h3 className="font-medium text-white/90">{title}</h3>}
              {subtitle && <p className="text-sm text-white/60">{subtitle}</p>}
            </div>
          </div>
        )}
        
        <div className={cn("flex-1", bodyClassName)}>{children}</div>
        
        {footer && (
          <div className={cn("mt-3 pt-3 border-t border-white/5", footerClassName)}>
            {footer}
          </div>
        )}
      </GlassPane>
    );
  }
);

GlassCard.displayName = "GlassCard";

export const GlassButton = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "primary" | "secondary" | "outline" | "ghost";
    size?: "sm" | "md" | "lg";
    iconLeft?: React.ReactNode;
    iconRight?: React.ReactNode;
    loading?: boolean;
    fullWidth?: boolean;
    glassBorder?: boolean;
  }
>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      children,
      iconLeft,
      iconRight,
      disabled,
      loading,
      fullWidth,
      glassBorder = true,
      ...props
    },
    ref
  ) => {
    const getVariantStyles = () => {
      switch (variant) {
        case "primary":
          return "bg-white text-black hover:bg-white/90";
        case "secondary":
          return "bg-white/10 backdrop-blur-lg text-white hover:bg-white/20";
        case "outline":
          return "bg-transparent backdrop-blur-md border border-white/20 text-white hover:bg-white/10";
        case "ghost":
          return "bg-transparent text-white hover:bg-white/5";
        default:
          return "bg-white text-black hover:bg-white/90";
      }
    };

    const getSizeStyles = () => {
      switch (size) {
        case "sm":
          return "py-2 px-3 text-xs";
        case "lg":
          return "py-4 px-6 text-base";
        default:
          return "py-3 px-4 text-sm";
      }
    };

    return (
      <motion.button
        ref={ref}
        className={cn(
          "relative rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2",
          getVariantStyles(),
          getSizeStyles(),
          disabled || loading ? "opacity-50 cursor-not-allowed" : "active:scale-[0.98]",
          fullWidth && "w-full",
          glassBorder && variant !== "primary" && "border border-white/10",
          className
        )}
        disabled={disabled || loading}
        whileTap={!disabled && !loading ? { scale: 0.98 } : undefined}
        {...props}
      >
        {iconLeft && <span className="flex-shrink-0">{iconLeft}</span>}
        {loading ? (
          <div className="w-4 h-4 border-2 border-current rounded-full animate-spin border-t-transparent" />
        ) : (
          children
        )}
        {iconRight && <span className="flex-shrink-0">{iconRight}</span>}
        
        {variant !== "primary" && variant !== "ghost" && (
          <div className="absolute inset-0 rounded-xl pointer-events-none border border-white/5 bg-gradient-to-b from-white/5 to-transparent" />
        )}
      </motion.button>
    );
  }
);

GlassButton.displayName = "GlassButton";

export const GlassInput = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & {
    icon?: React.ReactNode;
    error?: string;
    label?: string;
  }
>(({ className, icon, error, label, ...props }, ref) => {
  return (
    <div className="space-y-2 w-full">
      {label && (
        <label className="text-sm font-medium text-white/80">{label}</label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50">
            {icon}
          </div>
        )}
        <input
          ref={ref}
          className={cn(
            "w-full h-12 bg-black/20 backdrop-blur-xl border border-white/10 rounded-xl text-white placeholder:text-white/40",
            "focus:outline-none focus:ring-1 focus:ring-white/20 focus:border-white/20 transition-all duration-300",
            icon ? "pl-10 pr-4" : "px-4",
            error && "border-red-500/50",
            className
          )}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
});

GlassInput.displayName = "GlassInput";

export const GlassBadge = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    variant?: "default" | "outline" | "subtle";
  }
>(({ className, variant = "default", ...props }, ref) => {
  const getVariantStyles = () => {
    switch (variant) {
      case "outline":
        return "bg-transparent border border-white/20";
      case "subtle":
        return "bg-white/5 border border-white/10";
      default:
        return "bg-white/10 border border-white/20 backdrop-blur-md";
    }
  };

  return (
    <div
      ref={ref}
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium text-white",
        getVariantStyles(),
        className
      )}
      {...props}
    />
  );
});

GlassBadge.displayName = "GlassBadge";
