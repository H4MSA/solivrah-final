
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, Award, MessageCircle, Users, User } from "lucide-react";
import { colors, gradients, shadows } from "@/lib/styles";

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
    <div className="fixed inset-x-0 bottom-0 z-50 mx-auto max-w-[430px]">
      <div className="pb-safe">
        <motion.div 
          className="flex items-center justify-between px-6 py-3 bg-gradient-to-t from-black to-black/70 backdrop-blur-md border-t border-white/5"
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
                <div className="relative">
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 -m-1 rounded-full bg-gradient-to-r from-purple-500/20 to-fuchsia-500/20 backdrop-blur-sm"
                      style={{
                        boxShadow: shadows.glow.purple,
                      }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                  
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    className={`relative p-2 ${isActive ? 'text-white' : 'text-white/50'} transition-colors duration-200`}
                  >
                    <Icon className="w-[22px] h-[22px]" />
                    
                    {isActive && (
                      <motion.span
                        layoutId="activeIndicator"
                        className="absolute bottom-[-8px] left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full bg-white"
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      />
                    )}
                  </motion.div>
                </div>
                
                <span 
                  className={`mt-1 text-[10px] ${isActive ? 'text-white font-medium' : 'text-white/50'}`}
                >
                  {tab.label}
                </span>
              </Link>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
};
