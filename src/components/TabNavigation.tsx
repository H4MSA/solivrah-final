
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Wallet, ArrowUpDown, LineChart, User } from 'lucide-react';

const TabNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-4">
      <div className="relative mx-auto max-w-[430px]">
        <div className="flex items-center justify-between bg-black/60 backdrop-blur-xl rounded-2xl px-6 py-4 border border-white/10">
          {/* Notch cutout */}
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-20 h-20 bg-black/60 backdrop-blur-xl rounded-full border border-white/10 flex items-center justify-center">
            <button 
              onClick={() => navigate('/quests')}
              className="w-14 h-14 bg-blue-500 rounded-full flex items-center justify-center transform hover:scale-105 transition-transform"
            >
              <ArrowUpDown className="text-white" size={24} />
            </button>
          </div>

          {/* Left items */}
          <div className="flex items-center gap-8">
            <TabItem
              icon={Home}
              label="Home"
              isActive={isActive('/home')}
              onClick={() => navigate('/home')}
            />
            <TabItem
              icon={Wallet}
              label="Wallet"
              isActive={isActive('/wallet')}
              onClick={() => navigate('/wallet')}
            />
          </div>

          {/* Center spacer */}
          <div className="w-20" />

          {/* Right items */}
          <div className="flex items-center gap-8">
            <TabItem
              icon={LineChart}
              label="Markets"
              isActive={isActive('/markets')}
              onClick={() => navigate('/markets')}
            />
            <TabItem
              icon={User}
              label="Profile"
              isActive={isActive('/profile')}
              onClick={() => navigate('/profile')}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

interface TabItemProps {
  icon: React.ElementType;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

const TabItem = ({ icon: Icon, label, isActive, onClick }: TabItemProps) => (
  <button
    onClick={onClick}
    className="flex flex-col items-center gap-1 group"
  >
    <Icon
      size={20}
      className={`${
        isActive ? 'text-white' : 'text-white/50 group-hover:text-white/70'
      } transition-colors`}
    />
    <span
      className={`text-xs ${
        isActive ? 'text-white' : 'text-white/50 group-hover:text-white/70'
      } transition-colors`}
    >
      {label}
    </span>
    {isActive && (
      <div className="absolute bottom-0 w-8 h-0.5 bg-green-500 rounded-full" />
    )}
  </button>
);

export default TabNavigation;
