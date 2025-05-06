
import React from "react";

interface IconProps {
  className?: string;
}

export const PartyIcon: React.FC<IconProps> = ({ className = "" }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M9.5 8.5L4.5 3.5M9.5 3.5L4.5 8.5M19.5 14.5L14.5 9.5M14.5 14.5L19.5 9.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M7 16.9749C8.97984 16.9915 10.9218 16.3152 12.5 15.0249C14.0782 16.3152 16.0202 16.9915 18 16.9749C18 12.5 15.5 10.0249 12.5 7.97494C9.5 10.0249 7 12.5 7 16.9749Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const MeditationIcon: React.FC<IconProps> = ({ className = "" }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M12 17C14.7614 17 17 14.7614 17 12C17 9.23858 14.7614 7 12 7C9.23858 7 7 9.23858 7 12C7 14.7614 9.23858 17 12 17Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 7V3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M4.22 9.88989L7.76 11.3199" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M4.22 14.1099L7.76 12.6799" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M19.78 9.88989L16.24 11.3199" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M19.78 14.1099L16.24 12.6799" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const MindIcon: React.FC<IconProps> = ({ className = "" }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M17 9.76001C15.66 8.76001 14 8.15991 12.22 8.01991C12.3 7.53991 12.8 6.25002 14.22 5.51002" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M11.8799 8.01995C11.3399 8.19995 10.7999 8.41991 10.2999 8.68991C9.65991 9.04991 9.05992 9.49995 8.50992 10.02" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M8.5 10C7.3 11.49 6.9 13.3 7 15" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M7 15C7.3 17.3 8.6 19.22 10.81 20.3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M10.8801 20.3C14.0001 21.6 17.6 20.8 19.8 18" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const TargetIcon: React.FC<IconProps> = ({ className = "" }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 18C15.3137 18 18 15.3137 18 12C18 8.68629 15.3137 6 12 6C8.68629 6 6 8.68629 6 12C6 15.3137 8.68629 18 12 18Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 14C13.1046 14 14 13.1046 14 12C14 10.8954 13.1046 10 12 10C10.8954 10 10 10.8954 10 12C10 13.1046 10.8954 14 12 14Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const SliderIcon: React.FC<IconProps> = ({ className = "" }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M19 8H5C3.89543 8 3 7.10457 3 6C3 4.89543 3.89543 4 5 4H19C20.1046 4 21 4.89543 21 6C21 7.10457 20.1046 8 19 8Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M19 20H5C3.89543 20 3 19.1046 3 18C3 16.8954 3.89543 16 5 16H19C20.1046 16 21 16.8954 21 18C21 19.1046 20.1046 20 19 20Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M19 14H5C3.89543 14 3 13.1046 3 12C3 10.8954 3.89543 10 5 10H19C20.1046 10 21 10.8954 21 12C21 13.1046 20.1046 14 19 14Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M7 8V4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M17 14V10" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M7 20V16" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const IdeaIcon: React.FC<IconProps> = ({ className = "" }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M12 2V4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 20V22" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M4 12H2" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M22 12H20" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M19.7778 4.22266L17.5558 6.44466" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M4.22217 4.22266L6.44417 6.44466" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M6.44434 17.5553L4.22234 19.7773" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M19.7778 19.7773L17.5558 17.5553" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const ToggleIcon: React.FC<IconProps> = ({ className = "" }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M17 10C18.6569 10 20 8.65685 20 7C20 5.34315 18.6569 4 17 4C15.3431 4 14 5.34315 14 7C14 8.65685 15.3431 10 17 10Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M7 20C8.65685 20 10 18.6569 10 17C10 15.3431 8.65685 14 7 14C5.34315 14 4 15.3431 4 17C4 18.6569 5.34315 20 7 20Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M14 7H22" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M2 7H7" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M17 17H22" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M2 17H4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const BrainIcon: React.FC<IconProps> = ({ className = "" }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M16 10.9C16 10.9 16 10.9 16 10.9C16 10.9 16 10.9 16 10.9C16 10.9 16 10.9 16 10.9Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M16 16.9C16 16.9 16 16.9 16 16.9C16 16.9 16 16.9 16 16.9Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M10 10.9C10 10.9 10 10.9 10 10.9C10 10.9 10 10.9 10 10.9Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M10 16.9C10 16.9 10 16.9 10 16.9C10 16.9 10 16.9 10 16.9Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M13 18C16.771 18 20 15.3137 20 12C20 8.68629 16.771 6 13 6C9.22895 6 6 8.68629 6 12C6 15.3137 9.22895 18 13 18Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const HeartIcon: React.FC<IconProps> = ({ className = "" }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M12 20C12 20 21 16 21 9.5C21 5.91 18.09 3 14.5 3C12.5 3 10.73 3.92 9.5 5.36C8.27 3.92 6.5 3 4.5 3C0.91 3 -2 5.91 -2 9.5C-2 16 7 20 7 20" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const SparkleIcon: React.FC<IconProps> = ({ className = "" }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M10 7V3M12 5H8M14 12V8M16 10H12M5 19V15M7 17H3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M19.5 19.5L16.5 16.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M19.5 16.5L16.5 19.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const AwardIcon: React.FC<IconProps> = ({ className = "" }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M14.2725 10.0082L17.0382 7.24251C17.2933 6.9874 17.4821 6.6718 17.5871 6.32389C17.6922 5.97598 17.7105 5.60451 17.6408 5.24729C17.5711 4.89006 17.4153 4.55661 17.1872 4.27538C16.9591 3.99416 16.665 3.77348 16.3305 3.63134L15.8366 3.43457C15.4636 3.27519 15.1359 3.02797 14.8802 2.71462C14.6244 2.40127 14.4476 2.03124 14.3653 1.63444C14.283 1.23764 14.2973 0.826376 14.4071 0.436576C14.5169 0.046775 14.7193 -0.309948 15.0002 -0.604114L15.3602 -0.964115C14.9274 -1.08329 14.4682 -1.09339 14.0305 -0.993186C13.5928 -0.892979 13.1926 -0.686353 12.8725 -0.394093L10.1002 2.37856L5.39737 7.0814C4.07023 8.40854 4.07023 10.535 5.39737 11.8621L12.1912 18.656C13.5183 19.9831 15.6448 19.9831 16.9719 18.656L18.4447 17.1832C19.7719 15.8561 19.7719 13.7296 18.4447 12.4025L14.2725 10.0082Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const StairsIcon: React.FC<IconProps> = ({ className = "" }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M5 21V5H11V9H16V13H19V21H5Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const SmileIcon: React.FC<IconProps> = ({ className = "" }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M8 14C8 14 9.5 16 12 16C14.5 16 16 14 16 14" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9 9H9.01" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M15 9H15.01" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
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
        ${dark ? 'bg-[#222222]' : 'bg-button-gradient'} 
        rounded-[14px] border border-solivrah-border flex items-center justify-center shadow-md
        transition-all duration-300 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]
        backdrop-blur-xs
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
