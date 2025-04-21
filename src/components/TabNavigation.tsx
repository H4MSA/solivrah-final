
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
      className={`flex flex-col items-center justify-center w-14 py-1 transition-all duration-300 ${
        isActive ? 'text-white translate-y-[-4px]' : 'text-gray-500'
      }`}
    >
      <div className={`${isActive ? 'opacity-100' : 'opacity-60'}`}>
        {icon}
      </div>
      <span className="text-[10px] mt-0.5 font-medium opacity-80">
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
    { path: "/home", label: "Home", icon: <Home size={18} strokeWidth={1.5} /> },
    { path: "/quests", label: "Quests", icon: <Wallet size={18} strokeWidth={1.5} /> },
    { path: "/community", label: "Community", icon: <BarChart3 size={18} strokeWidth={1.5} /> },
    { path: "/coach", label: "Coach", icon: <Store size={18} strokeWidth={1.5} /> },
    { path: "/profile", label: "Profile", icon: <User size={18} strokeWidth={1.5} /> },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 pb-safe">
      <nav className="flex justify-between items-center mx-3 mb-2 py-1 px-2 bg-black/80 backdrop-blur-xl rounded-2xl border border-white/5">
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
