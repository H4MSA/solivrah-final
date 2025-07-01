
/**
 * Style constants and utilities for consistent UI design
 */

export const colors = {
  // Primary palette
  primary: {
    50: "#f5e8ff",
    100: "#e6cdff",
    200: "#d4a7ff",
    300: "#bb81ff",
    400: "#a05bff",
    500: "#8b5cf6", // Primary purple
    600: "#7539d4",
    700: "#5e28ae",
    800: "#48218a",
    900: "#331b66",
  },
  
  // Accent colors
  accent: {
    blue: "#33c3f0",
    pink: "#f472b6",
    amber: "#fcd34d",
    orange: "#f97316",
    teal: "#14b8a6",
    green: "#22c55e",
  },
  
  // Grayscale
  gray: {
    50: "#ffffff",
    100: "#f2f2f2",
    200: "#e5e5e5", 
    300: "#cccccc",
    400: "#9e9e9e",
    500: "#757575",
    600: "#616161",
    700: "#424242",
    800: "#2a2a2a",
    900: "#212121",
    950: "#121212",
    1000: "#000000",
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
  glass: "backdrop-blur-xl bg-gradient-to-br from-[#1E1E1E]/90 to-[#2A2A2A]/80 border border-white/10 rounded-xl shadow-lg",
  raised: "bg-gradient-to-br from-[#222222] to-[#1A1A1A] border border-white/10 rounded-xl shadow-lg",
  minimal: "bg-[#121212] border border-white/10 rounded-xl",
  modern: "modern-card rounded-xl p-6",
  premium: "gradient-border rounded-xl p-6 hover:scale-[1.02] transition-transform duration-300",
  floating: "floating-element modern-card rounded-xl p-6",
};

export const buttonStyles = {
  primary: "bg-gradient-to-r from-purple-500 to-purple-700 text-white rounded-xl px-4 py-2.5 hover:opacity-90 transition-all active:scale-95",
  secondary: "bg-white/10 backdrop-blur-sm border border-white/10 text-white rounded-xl px-4 py-2.5 hover:bg-white/15 transition-all active:scale-95",
  subtle: "bg-transparent text-white/70 hover:text-white hover:bg-white/5 rounded-xl px-4 py-2.5 transition-all active:scale-95",
  premium: "premium-button-v2",
  glow: "premium-button-v2 glow-effect",
  modern: "bg-gradient-to-r from-slate-800 to-slate-900 hover:from-slate-700 hover:to-slate-800 text-white rounded-xl px-6 py-3 font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 active:scale-95",
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
