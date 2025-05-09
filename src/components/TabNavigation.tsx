
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
  
  // Only render navigation if we're on a page that should have it
  const shouldShowNavigation = ['/home', '/quests', '/coach', '/community', '/profile'].includes(location.pathname);
  
  if (!shouldShowNavigation) {
    return null;
  }
  
  return (
    <div className="fixed inset-x-0 bottom-4 z-50 px-4 flex justify-center">
      <motion.div 
        className="flex items-center justify-between px-4 py-2 rounded-xl bg-black/90 backdrop-blur-xl border border-white/10 shadow-lg max-w-[340px] w-full"
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
              className="flex flex-col items-center justify-center"
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                className="relative p-1"
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 rounded-full bg-white/10 backdrop-blur-sm"
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
                
                <div className={`p-1.5 ${isActive ? 'text-white' : 'text-white/50'} transition-colors duration-200`}>
                  <Icon className="w-4 h-4" strokeWidth={2.5} />
                </div>
              </motion.div>
              
              <span 
                className={`text-[10px] font-medium mt-0.5 ${isActive ? 'text-white' : 'text-white/50'}`}
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
