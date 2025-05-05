
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Compass, MessageCircle, User, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';

export const TabNavigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname;

  const tabs = [
    {
      name: 'Home',
      path: '/',
      icon: Home
    },
    {
      name: 'Quests',
      path: '/quests',
      icon: Trophy
    },
    {
      name: 'Coach',
      path: '/coach',
      icon: MessageCircle
    },
    {
      name: 'Social',
      path: '/social',
      icon: Compass
    },
    {
      name: 'Profile',
      path: '/profile',
      icon: User
    }
  ];

  return (
    <motion.div 
      className="fixed bottom-0 left-0 right-0 z-50"
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="pb-safe flex justify-center">
        <div className="w-full max-w-md mx-auto px-4 pb-2">
          <div className="bg-gradient-to-b from-light-gray to-dark-gray border border-border-medium rounded-t-xl">
            <div className="flex items-center justify-between">
              {tabs.map((tab) => {
                const isActive = (tab.path === '/' ? pathname === '/' : pathname.startsWith(tab.path));
                
                return (
                  <button
                    key={tab.name}
                    className="relative flex-1 py-3"
                    onClick={() => navigate(tab.path)}
                  >
                    <div className="flex flex-col items-center">
                      <tab.icon className={`w-5 h-5 mb-1 transition-all ${isActive ? 'text-black' : 'text-black/60'}`} />
                      <span className={`text-xs transition-all ${isActive ? 'text-black font-medium' : 'text-black/60'}`}>
                        {tab.name}
                      </span>
                      
                      {isActive && (
                        <motion.div 
                          layoutId="activeTab"
                          className="absolute -bottom-1 w-10 h-0.5 bg-black rounded-full"
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TabNavigation;
