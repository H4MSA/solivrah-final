
import React from "react";
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
      className={`flex flex-col items-center justify-center py-2 px-1 rounded-md transition-all cursor-pointer relative
        ${isActive ? 'nav-item-active' : 'nav-item-inactive'}
      `}
      onClick={onClick}
    >
      <div className="text-xl mb-1">{icon}</div>
      <span className="text-xs">{label}</span>
      {isActive && (
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-primary rounded-full" />
      )}
    </div>
  );
};

export const TabNavigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: "/home", label: "Home", icon: <FiHome /> },
    { path: "/quests", label: "Quests", icon: <FiList /> },
    { path: "/community", label: "Community", icon: <FiUsers /> },
    { path: "/coach", label: "Coach", icon: <FiMessageCircle /> },
    { path: "/profile", label: "Profile", icon: <FiUser /> },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 h-16 glass border-t border-white/10 animate-fade-in z-50">
      <div className="flex items-center justify-around h-full w-full max-w-lg mx-auto">
        {navItems.map((item) => (
          <NavItem 
            key={item.path}
            icon={item.icon}
            label={item.label} 
            path={item.path} 
            isActive={isActive(item.path)} 
            onClick={() => navigate(item.path)}
          />
        ))}
      </div>
    </div>
  );
};
