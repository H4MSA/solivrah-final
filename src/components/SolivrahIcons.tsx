
import React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

// Base icon button component
interface IconButtonProps {
  icon: React.ReactNode;
  onClick?: () => void;
  small?: boolean;
  active?: boolean;
  className?: string;
}

export const IconButton: React.FC<IconButtonProps> = ({ 
  icon, 
  onClick, 
  small = false,
  active = false,
  className 
}) => {
  return (
    <motion.button
      className={cn(
        "flex items-center justify-center rounded-xl border border-white/10 bg-gradient-to-b from-[#1A1A1A] to-[#0A0A0A] transition-all duration-300 shadow-sm",
        small ? "w-12 h-12" : "w-16 h-16 p-3",
        active ? "border-white/30 shadow-lg" : "hover:border-white/20",
        className
      )}
      onClick={onClick}
      whileHover={{ y: -2, boxShadow: "0 10px 20px rgba(0, 0, 0, 0.2)" }}
      whileTap={{ scale: 0.95 }}
    >
      {icon}
    </motion.button>
  );
};

// Solivrah Brand Icon (NEW - matches your logo style)
export const SolivrahBrandIcon = ({ size = 24 }: { size?: number }) => (
  <div className="relative">
    <img 
      src="/lovable-uploads/3175d335-84c5-4f7a-954e-9795d0e93059.png" 
      alt="Solivrah" 
      width={size}
      height={size}
      className="object-contain opacity-90 filter drop-shadow-sm"
    />
  </div>
);

// Custom Premium Icons
export const TriangleIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 3L22 19H2L12 3Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const CircleIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="9" stroke="white" strokeWidth="1.5" />
  </svg>
);

export const PersonIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const TargetIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="1.5" />
    <circle cx="12" cy="12" r="6" stroke="white" strokeWidth="1.5" />
    <circle cx="12" cy="12" r="2" stroke="white" strokeWidth="1.5" />
  </svg>
);

export const SliderIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 21V14" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M4 10V3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M12 21V12" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M12 8V3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M20 21V16" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M20 12V3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M1 14H7" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M9 8H15" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M17 16H23" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const SunIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 17C14.7614 17 17 14.7614 17 12C17 9.23858 14.7614 7 12 7C9.23858 7 7 9.23858 7 12C7 14.7614 9.23858 17 12 17Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M12 1V3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M12 21V23" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M4.22 4.22L5.64 5.64" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M18.36 18.36L19.78 19.78" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M1 12H3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M21 12H23" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M4.22 19.78L5.64 18.36" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M18.36 5.64L19.78 4.22" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const ToggleIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M16 4H8C5.79086 4 4 5.79086 4 8V16C4 18.2091 5.79086 20 8 20H16C18.2091 20 20 18.2091 20 16V8C20 5.79086 18.2091 4 16 4Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8 12H16" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const CloudIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M17.5 18H9C6.79086 18 5 16.2091 5 14C5 11.7909 6.79086 10 9 10C9.71295 10 10.3794 10.1815 10.9558 10.5h.5442c2.2091 0 4 1.7909 4 4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M9 9V9.01" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M14.5 16.5v2" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M17.5 16.5v2" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const HeartIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M19.3139 5.68629C18.3787 4.75107 17.1414 4.18 15.8497 4.0289C14.558 3.87779 13.2587 4.15685 12.1414 4.82174C10.9572 4.12089 9.56806 3.85482 8.21405 4.06636C6.86004 4.2779 5.6239 4.95391 4.73833 5.97836C3.85277 7.00282 3.37708 8.30895 3.39946 9.65747C3.42183 11.006 3.94127 12.2947 4.86139 13.2913L10.4142 18.8441C10.8047 19.2346 11.3298 19.4525 11.8784 19.4525C12.427 19.4525 12.9522 19.2346 13.3426 18.8441L18.8955 13.2913C19.8337 12.3531 20.3587 11.1069 20.3587 9.80955C20.3587 8.51222 19.8337 7.26608 18.8955 6.32784L19.3139 5.68629Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const DiamondIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 3L2 12L12 21L22 12L12 3Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const GridIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="3" width="7" height="7" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <rect x="14" y="3" width="7" height="7" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <rect x="3" y="14" width="7" height="7" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <rect x="14" y="14" width="7" height="7" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const LineIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M5 12H19" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const CircleTargetIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="8" stroke="white" strokeWidth="1.5" />
    <circle cx="12" cy="12" r="3" stroke="white" strokeWidth="1.5" />
    <path d="M12 9V3" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M12 21V15" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M15 12L21 12" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M3 12L9 12" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);
