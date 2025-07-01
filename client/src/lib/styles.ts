
/**
 * Style constants and utilities for consistent UI design
 */

export const colors = {
  // Enhanced primary palette
  primary: {
    50: "#f8f6ff",
    100: "#f0ebff",
    200: "#e4d9ff",
    300: "#d1bfff",
    400: "#b794ff",
    500: "#8b5cf6", // Primary purple
    600: "#7c3aed",
    700: "#6d28d9",
    800: "#5b21b6",
    900: "#4c1d95",
    950: "#2e1065",
  },
  
  // Enhanced accent colors
  accent: {
    blue: "#3b82f6",
    cyan: "#06b6d4", 
    emerald: "#10b981",
    pink: "#ec4899",
    amber: "#f59e0b",
    orange: "#f97316",
    teal: "#14b8a6",
    green: "#22c55e",
    indigo: "#6366f1",
    violet: "#8b5cf6",
  },
  
  // Enhanced grayscale with better contrast
  gray: {
    50: "#fafafa",
    100: "#f4f4f5",
    200: "#e4e4e7", 
    300: "#d4d4d8",
    400: "#a1a1aa",
    500: "#71717a",
    600: "#52525b",
    700: "#3f3f46",
    800: "#27272a",
    900: "#18181b",
    950: "#09090b",
  },
  
  // Status colors
  status: {
    success: "#10b981",
    warning: "#f59e0b", 
    error: "#ef4444",
    info: "#3b82f6",
  },
};

export const gradients = {
  // Background gradients
  backgrounds: {
    primary: "linear-gradient(to bottom right, #1e1e1e, #121212)",
    purple: "linear-gradient(to bottom right, rgba(75, 0, 130, 0.7), rgba(147, 112, 219, 0.3))",
    blue: "linear-gradient(to bottom right, rgba(25, 130, 196, 0.7), rgba(13, 71, 161, 0.3))",
    green: "linear-gradient(to bottom right, rgba(0, 109, 119, 0.7), rgba(27, 152, 101, 0.3))",
  },
  
  // Button gradients
  buttons: {
    primary: "linear-gradient(to right, #8b5cf6, #7c3aed)",
    secondary: "linear-gradient(to right, #0ea5e9, #2563eb)",
    success: "linear-gradient(to right, #22c55e, #16a34a)",
    warning: "linear-gradient(to right, #f97316, #ea580c)",
  },
  
  // Card gradients
  cards: {
    dark: "linear-gradient(to bottom right, #1e1e1e, #121212)",
    glass: "linear-gradient(to bottom right, rgba(30, 30, 30, 0.8), rgba(18, 18, 18, 0.6))",
    purple: "linear-gradient(to bottom right, rgba(123, 31, 162, 0.7), rgba(74, 20, 140, 0.5))",
  },
};

export const shadows = {
  sm: "0 1px 2px rgba(0, 0, 0, 0.1)",
  md: "0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.1)",
  lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)",
  xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
  glow: {
    purple: "0 0 15px 2px rgba(139, 92, 246, 0.3)",
    blue: "0 0 15px 2px rgba(59, 130, 246, 0.3)",
  }
};

export const animations = {
  fadeIn: "animate-fade-in",
  scaleIn: "animate-scale-in",
  pulseLight: "animate-pulse-soft",
  float: "animate-float",
  glow: "animate-glow",
};

export const cardStyles = {
  glass: "glass rounded-xl p-6",
  raised: "premium-card p-6",
  minimal: "bg-card/50 backdrop-blur-sm border border-border rounded-xl p-4",
  modern: "bg-gradient-to-br from-card/80 to-card/60 backdrop-blur-lg border border-border rounded-xl p-6 shadow-xl hover:shadow-2xl transition-all duration-500",
  premium: "glass p-6 hover:scale-[1.02] transition-all duration-500 shimmer-enhanced",
  floating: "animate-float glass p-6",
  gradient: "bg-gradient-to-br from-primary/10 via-card/80 to-accent/5 backdrop-blur-xl border border-primary/20 rounded-xl p-6 shadow-2xl",
  neon: "bg-card/80 backdrop-blur-lg border border-primary/30 rounded-xl p-6 shadow-xl animate-pulse-color",
};

export const buttonStyles = {
  primary: "btn-primary",
  secondary: "neo-button text-foreground px-6 py-3 font-medium",
  subtle: "bg-transparent text-muted-foreground hover:text-foreground hover:bg-white/5 rounded-xl px-4 py-2.5 transition-all active:scale-95",
  premium: "glass px-6 py-3 font-semibold text-foreground hover:scale-[1.02] transition-all duration-300",
  glow: "btn-primary animate-pulse-color",
  modern: "bg-gradient-to-r from-primary/90 to-accent/90 hover:from-primary hover:to-accent text-primary-foreground rounded-xl px-6 py-3 font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 active:scale-95",
  gradient: "bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%] animate-gradient text-primary-foreground rounded-xl px-6 py-3 font-semibold transition-all duration-300 shadow-lg hover:shadow-xl",
  outline: "border-2 border-primary/50 text-primary hover:bg-primary/10 hover:border-primary rounded-xl px-6 py-3 font-medium transition-all duration-300 active:scale-95",
};

export const animationStyles = {
  slideUp: "slide-up-animation",
  scaleIn: "scale-in-animation",
  float: "floating-element",
  glow: "glow-effect",
  stagger: "stagger-item",
};

export const inputStyles = {
  default: "bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder:text-white/40 focus:outline-none focus:border-white/20",
  pill: "bg-white/5 backdrop-blur-sm border border-white/10 rounded-full px-4 py-2.5 text-white placeholder:text-white/40 focus:outline-none focus:border-white/20",
};
