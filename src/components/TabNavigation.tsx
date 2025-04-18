
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Home, ListChecks, Users, MessageCircle, User } from "lucide-react";
import { useApp } from "@/context/AppContext";

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
      className="flex flex-col items-center justify-center py-1 px-3 transition-all duration-300 cursor-pointer transform-gpu active:scale-95 touch-manipulation relative"
      onClick={onClick}
      style={{ transform: isActive ? 'translateZ(15px)' : 'translateZ(1px)' }}
    >
      <div 
        className={`p-2.5 rounded-full flex items-center justify-center transition-all duration-300 ${
          isActive ? 'scale-110 bg-[#222222] backdrop-blur-xl border border-white/10' : 'scale-100 bg-transparent'
        }`}
        style={{ 
          boxShadow: isActive ? '0 5px 15px rgba(0,0,0,0.3)' : 'none',
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
      
      {/* Active indicator dot */}
      {isActive && (
        <div className="absolute top-0 w-1 h-1 rounded-full bg-white animate-pulse-slow" />
      )}
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
    { path: "/home", label: "Home", icon: <Home size={24} /> },
    { path: "/quests", label: "Quests", icon: <ListChecks size={24} /> },
    { path: "/community", label: "Community", icon: <Users size={24} /> },
    { path: "/coach", label: "Coach", icon: <MessageCircle size={24} /> },
    { path: "/profile", label: "Profile", icon: <User size={24} /> },
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
    <div 
      className={`fixed bottom-0 left-0 right-0 z-50 transition-all duration-500 perspective-1000 transform-gpu ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'}`}
    >
      {/* Enhanced blurred background for iPhone 14 */}
      <div 
        className="absolute inset-0 bg-[#0A0A0A]/90 backdrop-blur-xl border-t border-white/5 shadow-2xl z-0"
        style={{ transform: 'translateZ(2px)' }}
      ></div>
      
      {/* Content */}
      <div className="relative z-10 flex items-center justify-around py-2 w-full max-w-[390px] mx-auto px-3 h-16">
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
      
      {/* Safe area padding for iPhone 14 */}
      <div className="h-8 bg-black"></div>
    </div>
  );
};
