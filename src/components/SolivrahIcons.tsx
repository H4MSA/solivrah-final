
import React from "react";

interface IconProps {
  className?: string;
}

export const TriangleIcon: React.FC<IconProps> = ({ className = "" }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M12 3L21 18H3L12 3Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const PersonIcon: React.FC<IconProps> = ({ className = "" }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M12 12C14.2091 12 16 10.2091 16 8C16 5.79086 14.2091 4 12 4C9.79086 4 8 5.79086 8 8C8 10.2091 9.79086 12 12 12Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M6 20C6 16.6863 8.68629 14 12 14C15.3137 14 18 16.6863 18 20" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const CircleIcon: React.FC<IconProps> = ({ className = "" }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <circle cx="12" cy="12" r="9" stroke="white" strokeWidth="1.5"/>
    <circle cx="12" cy="12" r="3" stroke="white" strokeWidth="1.5"/>
    <path d="M12 3V5" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M12 19V21" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M3 12H5" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M19 12H21" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

export const TargetIcon: React.FC<IconProps> = ({ className = "" }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <circle cx="12" cy="12" r="9" stroke="white" strokeWidth="1.5"/>
    <circle cx="12" cy="12" r="6" stroke="white" strokeWidth="1.5"/>
    <circle cx="12" cy="12" r="3" stroke="white" strokeWidth="1.5"/>
  </svg>
);

export const SliderIcon: React.FC<IconProps> = ({ className = "" }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M3 7H21" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M3 12H21" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M3 17H21" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

export const SunIcon: React.FC<IconProps> = ({ className = "" }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <circle cx="12" cy="12" r="4" stroke="white" strokeWidth="1.5"/>
    <path d="M12 3V5" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M12 19V21" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M3 12H5" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M19 12H21" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M5.63605 5.63604L7.05026 7.05025" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M16.9497 16.9497L18.364 18.364" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M5.63605 18.364L7.05026 16.9497" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M16.9497 7.05025L18.364 5.63604" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

export const ToggleIcon: React.FC<IconProps> = ({ className = "" }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect x="3" y="8" width="18" height="8" rx="4" stroke="white" strokeWidth="1.5"/>
    <circle cx="15" cy="12" r="2" fill="white"/>
  </svg>
);

export const CloudIcon: React.FC<IconProps> = ({ className = "" }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M6 19C3.79086 19 2 17.2091 2 15C2 12.7909 3.79086 11 6 11C6.08156 11 6.16251 11.0023 6.24272 11.0069C6.81025 8.70084 8.87755 7 11.3333 7C14.0173 7 16.2502 9.01099 16.7231 11.6364C16.8.0909 16.9.5454 17 11C19.2091 11 21 12.7909 21 15C21 17.2091 19.2091 19 17 19H6Z" stroke="white" strokeWidth="1.5"/>
  </svg>
);

export const HeartIcon: React.FC<IconProps> = ({ className = "" }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M12 20L4.3314 12.0474C3.47892 11.1633 3 9.96429 3 8.71405C3 6.11055 5.11929 4 7.73143 4C8.97981 4 10.1749 4.48098 11.0602 5.3662L12 6.30597L12.9398 5.3662C13.8251 4.48098 15.0202 4 16.2686 4C18.8807 4 21 6.11055 21 8.71405C21 9.96429 20.5211 11.1633 19.6686 12.0474L12 20Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const DiamondIcon: React.FC<IconProps> = ({ className = "" }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M2.5 9L12 20.5L21.5 9L18 3.5H6L2.5 9Z" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
    <path d="M2.5 9H21.5" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M6 3.5L9 9L12 3.5L15 9L18 3.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9 9L12 20.5L15 9" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
  </svg>
);

export const GridIcon: React.FC<IconProps> = ({ className = "" }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect x="3" y="3" width="7" height="7" stroke="white" strokeWidth="1.5"/>
    <rect x="14" y="3" width="7" height="7" stroke="white" strokeWidth="1.5"/>
    <rect x="3" y="14" width="7" height="7" stroke="white" strokeWidth="1.5"/>
    <rect x="14" y="14" width="7" height="7" stroke="white" strokeWidth="1.5"/>
  </svg>
);

export const LineIcon: React.FC<IconProps> = ({ className = "" }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M5 19L19 5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M5 12L12 5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 19L19 12" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const CircleTargetIcon: React.FC<IconProps> = ({ className = "" }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <circle cx="12" cy="12" r="9" stroke="white" strokeWidth="1.5"/>
    <circle cx="12" cy="12" r="5" stroke="white" strokeWidth="1.5"/>
    <circle cx="12" cy="12" r="1" fill="white"/>
  </svg>
);

interface IconButtonProps {
  icon: React.ReactNode;
  className?: string;
  onClick?: () => void;
  small?: boolean;
  dark?: boolean;
}

export const IconButton: React.FC<IconButtonProps> = ({ 
  icon, 
  className = "", 
  onClick,
  small = false,
  dark = false 
}) => {
  return (
    <button 
      className={`
        ${small ? 'w-[72px] h-[72px]' : 'w-full h-[72px]'} 
        bg-[#1A1A1A] hover:bg-[#222222]
        rounded-[14px] border border-[#333333] flex items-center justify-center
        transition-all duration-200 hover:border-[#464646] active:scale-[0.98] shadow-md
        ${className}
      `}
      onClick={onClick}
    >
      <div className="animate-pulse-soft">
        {icon}
      </div>
    </button>
  );
};
