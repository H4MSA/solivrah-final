
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, Award, MessageCircle, Users, User } from "lucide-react";

export const TabNavigation = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("/home");
  
  useEffect(() => {
    setActiveTab(location.pathname);
  }, [location]);
  
  const navTabs = [
    { to: "/home", icon: Home, label: "Home" },
    { to: "/quests", icon: Award, label: "Quests" },
    { to: "/coach", icon: MessageCircle, label: "Coach" },
    { to: "/community", icon: Users, label: "Community" },
    { to: "/profile", icon: User, label: "Profile" },
  ];
  
  return (
    <div className="fixed inset-x-0 bottom-4 z-50 px-6 flex justify-center">
      <motion.div 
        className="flex items-center justify-between px-6 py-3 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/10 shadow-lg max-w-[430px] w-full"
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {navTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.to;
          
          return (
            <Link
              key={tab.to}
              to={tab.to}
              className="flex-1 flex flex-col items-center justify-center"
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                className="relative"
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 -m-2 rounded-full bg-white/10 backdrop-blur-sm"
                    style={{
                      boxShadow: "0 0 15px 2px rgba(255, 255, 255, 0.2)"
                    }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
                
                <div className={`p-2 ${isActive ? 'text-white' : 'text-white/50'} transition-colors duration-200`}>
                  <Icon className="w-7 h-7" />
                </div>
              </motion.div>
              
              <span 
                className={`mt-1 text-xs font-semibold ${isActive ? 'text-white' : 'text-white/50'}`}
              >
                {tab.label}
              </span>
            </Link>
          );
        })}
      </motion.div>
    </div>
  );
};
