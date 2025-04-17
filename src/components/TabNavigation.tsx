
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FiHome, FiList, FiUsers, FiMessageCircle, FiUser } from "react-icons/fi";
import { useApp } from "@/context/AppContext";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  path: string;
  isActive: boolean;
  onClick: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, isActive, onClick }) => {
  const { selectedTheme } = useApp();
  
  // Theme-specific glow colors
  const getThemeGlow = () => {
    if (!isActive) return "transparent";
    
    switch (selectedTheme) {
      case "Discipline": return "rgba(255, 0, 0, 0.3)";
      case "Focus": return "rgba(0, 128, 128, 0.3)";
      case "Resilience": return "rgba(255, 165, 0, 0.3)";
      case "Wildcards": return "rgba(0, 255, 0, 0.3)";
      default: return "rgba(255, 255, 255, 0.2)";
    }
  };
  
  return (
    <div 
      className="flex flex-col items-center justify-center py-1 px-2 transition-all duration-300 cursor-pointer transform"
      onClick={onClick}
      style={{ transform: isActive ? 'translateZ(10px)' : 'translateZ(1px)' }}
    >
      <div 
        className={`p-2 rounded-full flex items-center justify-center transition-all duration-300 ${
          isActive ? 'scale-115 bg-black/30 backdrop-blur-xl border border-white/10' : 'scale-100'
        }`}
        style={{ 
          boxShadow: isActive ? `0 0 15px ${getThemeGlow()}` : 'none',
          transform: isActive ? 'translateY(-8px)' : 'translateY(0)'
        }}
      >
        <div className={`text-xl transition-all duration-300 ${isActive ? 'text-white' : 'text-white/50'}`}>
          {icon}
        </div>
      </div>
      
      <span 
        className={`text-xs font-medium transition-all duration-300 ${
          isActive ? 'text-white opacity-100' : 'text-white/50 opacity-70'
        }`}
        style={{ marginTop: isActive ? '0' : '8px' }}
      >
        {label}
      </span>
    </div>
  );
};

export const TabNavigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mounted, setMounted] = useState(false);
  const { selectedTheme } = useApp();
  
  // Fix the active path detection
  const isActive = (path: string) => location.pathname === path;
  
  // Prevent layout shift by ensuring component is mounted before animating
  useEffect(() => {
    setMounted(true);
  }, []);
  
  const navItems = [
    { path: "/home", label: "Home", icon: <FiHome /> },
    { path: "/quests", label: "Quests", icon: <FiList /> },
    { path: "/community", label: "Community", icon: <FiUsers /> },
    { path: "/coach", label: "Coach", icon: <FiMessageCircle /> },
    { path: "/profile", label: "Profile", icon: <FiUser /> },
  ];

  const handleNavigation = (path: string) => {
    // Add a smooth animation when changing routes
    document.body.classList.add('page-transition');
    setTimeout(() => {
      navigate(path);
      setTimeout(() => {
        document.body.classList.remove('page-transition');
      }, 300);
    }, 100);
  };
  
  // Get theme-specific color
  const getThemeBorderColor = () => {
    switch (selectedTheme) {
      case "Discipline": return "rgba(255, 0, 0, 0.2)";
      case "Focus": return "rgba(0, 128, 128, 0.2)";
      case "Resilience": return "rgba(255, 165, 0, 0.2)";
      case "Wildcards": return "rgba(0, 255, 0, 0.2)";
      default: return "rgba(255, 255, 255, 0.1)";
    }
  };

  return (
    <div 
      className={`fixed bottom-0 left-0 right-0 z-50 transition-all duration-500 perspective-1000 transform-gpu ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'}`}
    >
      {/* Blurred background */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-xl border-t shadow-xl z-0"
        style={{ 
          borderColor: getThemeBorderColor(),
          transform: 'translateZ(2px)'
        }}
      ></div>
      
      {/* Content */}
      <div className="relative z-10 flex items-center justify-around py-1 w-full max-w-lg mx-auto px-2 h-16">
        {navItems.map((item) => (
          <NavItem 
            key={item.path}
            icon={item.icon}
            label={item.label} 
            path={item.path} 
            isActive={isActive(item.path)} 
            onClick={() => handleNavigation(item.path)}
          />
        ))}
      </div>
      
      {/* Safe area padding for notched phones */}
      <div className="h-6 bg-black"></div>
    </div>
  );
};
