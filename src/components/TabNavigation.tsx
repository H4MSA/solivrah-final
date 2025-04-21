
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
      className={`flex flex-col items-center justify-center w-16 py-1.5 transition-all duration-200 ${
        isActive ? 'text-white scale-110' : 'text-gray-500'
      }`}
    >
      <div className={`relative ${isActive ? 'bg-white/10 p-2.5 rounded-full transform scale-110 transition-transform' : 'p-2.5'}`}>
        {icon}
      </div>
      <span className="text-[10px] mt-0.5 font-medium">
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
    { path: "/home", label: "Home", icon: <Home size={20} strokeWidth={1.5} /> },
    { path: "/quests", label: "Quests", icon: <Wallet size={20} strokeWidth={1.5} /> },
    { path: "/community", label: "Community", icon: <BarChart3 size={20} strokeWidth={1.5} /> },
    { path: "/coach", label: "Coach", icon: <Store size={20} strokeWidth={1.5} /> },
    { path: "/profile", label: "Profile", icon: <User size={20} strokeWidth={1.5} /> },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 pb-safe">
      <nav className="flex justify-between items-center mx-4 mb-2 py-1 px-3 bg-black/90 backdrop-blur-xl rounded-full border border-white/10">
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
