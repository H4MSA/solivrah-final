
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
          <div className="glass shadow-glass border-t border-l border-white/10 border-b border-r border-black/20 backdrop-blur-xl bg-black/60 rounded-2xl mb-2">
            <div className="flex items-center justify-between">
              {tabs.map((tab) => {
                const isActive = (tab.path === '/' ? pathname === '/' : pathname.startsWith(tab.path));
                
                return (
                  <button
                    key={tab.name}
                    className="nav-tab relative flex-1 py-3"
                    onClick={() => navigate(tab.path)}
                  >
                    <div className="flex flex-col items-center">
                      <tab.icon className={`w-5 h-5 mb-1 transition-all ${isActive ? 'text-white' : 'text-white/40'}`} />
                      <span className={`text-xs transition-all ${isActive ? 'text-white font-medium' : 'text-white/40'}`}>
                        {tab.name}
                      </span>
                      
                      {isActive && (
                        <motion.div 
                          layoutId="activeTab"
                          className="absolute -top-1 w-1 h-1 bg-neon-green rounded-full"
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        />
                      )}
                      
                      {isActive && (
                        <motion.div 
                          layoutId="activeTabGlow"
                          className="absolute -top-2 w-8 h-1 bg-neon-green/20 rounded-full blur-sm"
                          transition={{ type: "spring", stiffness: 400, damping: 25 }}
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
