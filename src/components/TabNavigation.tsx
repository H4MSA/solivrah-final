
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FiHome, FiList, FiUsers, FiMessageCircle, FiUser } from "react-icons/fi";

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  path: string;
  isActive: boolean;
  onClick: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, isActive, onClick }) => {
  return (
    <div 
      className="flex flex-col items-center justify-center py-2 px-3 transition-all duration-300 cursor-pointer relative"
      onClick={onClick}
    >
      <div className={`relative transition-all duration-300 ${isActive ? 'scale-110' : ''}`}>
        {isActive && (
          <div className="absolute -inset-1 bg-white/5 rounded-full blur-sm animate-pulse-slow"></div>
        )}
        <div className={`text-xl mb-1 transition-all duration-300 ${isActive ? 'text-white' : 'text-[#808080]'}`}>
          {icon}
        </div>
      </div>
      
      <span className={`text-xs font-medium transition-all duration-300 ${isActive ? 'text-white' : 'text-[#808080]'}`}>
        {label}
      </span>
      
      {isActive && (
        <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full bg-white animate-pulse-slow"></div>
      )}
      
      <div 
        className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 h-0.5 rounded-full transition-all duration-300 ${
          isActive ? 'w-10 bg-white' : 'w-0 bg-transparent'
        }`} 
      />
    </div>
  );
};

export const TabNavigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mounted, setMounted] = useState(false);
  
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

  return (
    <div className={`fixed bottom-0 left-0 right-0 z-50 transition-all duration-500 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'}`}>
      {/* Blurred background */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-xl border-t border-[#222222] z-0"></div>
      
      {/* Content */}
      <div className="relative z-10 flex items-center justify-around h-16 w-full max-w-lg mx-auto px-2">
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
    </div>
  );
};
