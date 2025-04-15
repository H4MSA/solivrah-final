
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FiHome, FiList, FiUsers, FiMessageCircle, FiUser } from "react-icons/fi";

interface NavItemProps {
  icon: React.ReactNode;
  path: string;
  isActive: boolean;
  onClick: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon, isActive, onClick }) => {
  return (
    <div 
      className={`flex flex-col items-center justify-center p-2 rounded-md transition-all cursor-pointer
        ${isActive ? 'text-white' : 'text-muted hover:text-white'}
      `}
      onClick={onClick}
    >
      <div className="text-2xl">{icon}</div>
    </div>
  );
};

export const TabNavigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="fixed bottom-0 left-0 right-0 h-16 glass border-t border-white/10 animate-fade-in">
      <div className="flex items-center justify-around h-full w-full max-w-lg mx-auto">
        <NavItem 
          icon={<FiHome />} 
          path="/home" 
          isActive={isActive("/home")} 
          onClick={() => navigate("/home")}
        />
        <NavItem 
          icon={<FiList />} 
          path="/quests" 
          isActive={isActive("/quests")} 
          onClick={() => navigate("/quests")}
        />
        <NavItem 
          icon={<FiUsers />} 
          path="/community" 
          isActive={isActive("/community")} 
          onClick={() => navigate("/community")}
        />
        <NavItem 
          icon={<FiMessageCircle />} 
          path="/coach" 
          isActive={isActive("/coach")} 
          onClick={() => navigate("/coach")}
        />
        <NavItem 
          icon={<FiUser />} 
          path="/profile" 
          isActive={isActive("/profile")} 
          onClick={() => navigate("/profile")}
        />
      </div>
    </div>
  );
};
