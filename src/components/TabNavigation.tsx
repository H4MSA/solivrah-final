
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Home, Wallet, BarChart3, Store, User } from "lucide-react";

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, isActive, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center w-20 py-2 transition-all ${
        isActive ? 'text-white scale-110' : 'text-gray-500'
      }`}
    >
      <div className={`relative ${isActive ? 'bg-white/10 p-3 rounded-full' : ''}`}>
        {icon}
      </div>
      <span className="text-xs mt-1 font-medium">
        {label}
      </span>
    </button>
  );
};

export const TabNavigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: "/home", label: "Home", icon: <Home size={24} strokeWidth={1.5} /> },
    { path: "/quests", label: "Wallet", icon: <Wallet size={24} strokeWidth={1.5} /> },
    { path: "/community", label: "Exchange", icon: <BarChart3 size={24} strokeWidth={1.5} /> },
    { path: "/coach", label: "Markets", icon: <Store size={24} strokeWidth={1.5} /> },
    { path: "/profile", label: "Profile", icon: <User size={24} strokeWidth={1.5} /> },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 pb-safe">
      <nav className="flex justify-between items-center mx-4 mb-2 py-2 px-4 bg-black/90 backdrop-blur-xl rounded-full border border-white/10">
        {navItems.map((item) => (
          <NavItem
            key={item.path}
            icon={item.icon}
            label={item.label}
            isActive={isActive(item.path)}
            onClick={() => navigate(item.path)}
          />
        ))}
      </nav>
    </div>
  );
};
