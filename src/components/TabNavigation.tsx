
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Home, ListChecks, Users, MessageCircle, User } from "lucide-react";

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
      className="flex flex-col items-center justify-center py-1 px-3 transition-all duration-300 cursor-pointer transform-gpu active:scale-95 touch-manipulation"
      onClick={onClick}
      style={{ transform: isActive ? 'translateZ(15px)' : 'translateZ(1px)' }}
    >
      <div 
        className={`p-2.5 rounded-full flex items-center justify-center transition-all duration-300 ${
          isActive ? 'scale-110 bg-[#222222] backdrop-blur-xl border border-white/15 shadow-lg' : 'scale-100 bg-transparent'
        }`}
        style={{ 
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
      
      {isActive && (
        <div className="absolute top-0 w-1 h-1 rounded-full bg-white animate-pulse-slow" />
      )}
    </div>
  );
};

export const TabNavigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  const navItems = [
    { path: "/home", label: "Home", icon: <Home size={24} /> },
    { path: "/quests", label: "Quests", icon: <ListChecks size={24} /> },
    { path: "/community", label: "Community", icon: <Users size={24} /> },
    { path: "/coach", label: "Coach", icon: <MessageCircle size={24} /> },
    { path: "/profile", label: "Profile", icon: <User size={24} /> },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center pointer-events-none">
      <nav className="flex items-center justify-around w-full max-w-[390px] h-16 bg-[#0A0A0A]/90 backdrop-blur-xl border-t border-white/5 shadow-2xl z-50 pointer-events-auto">
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
        
        {/* Safe area padding for iPhone */}
        <div className="h-8 bg-black absolute bottom-0 left-0 right-0 -z-10" />
      </nav>
    </div>
  );
};
