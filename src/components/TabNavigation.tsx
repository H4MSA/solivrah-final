
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
      onClick={onClick}
      className={`flex flex-col items-center justify-center gap-1 p-2 ${
        isActive ? 'text-white' : 'text-white/60'
      }`}
    >
      <div className="text-xl">
        {icon}
      </div>
      <span className="text-xs font-medium">
        {label}
      </span>
      {isActive && (
        <div className="absolute bottom-0 w-8 h-0.5 bg-green-500 rounded-full" />
      )}
    </div>
  );
};

export const TabNavigation = () => {
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

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      <nav className="flex justify-around items-center bg-black/90 backdrop-blur-xl border-t border-white/10 py-4">
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
      </nav>
    </div>
  );
};

export default TabNavigation;
