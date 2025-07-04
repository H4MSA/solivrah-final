
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Home, Award, MessageCircle, Users, User } from "lucide-react";
import { SolivrahBrandIcon } from "./SolivrahIcons";

export const TabNavigation = () => {
  // Safely handle the location to prevent errors outside Router context
  let pathname = '/';
  let locationHook;
  
  try {
    locationHook = useLocation();
    pathname = locationHook.pathname;
  } catch (error) {
    console.warn("Router context not available in TabNavigation");
  }
  
  const [activeTab, setActiveTab] = useState(pathname);
  
  useEffect(() => {
    if (locationHook) {
      setActiveTab(pathname);
    }
  }, [pathname, locationHook]);
  
  const navTabs = [
    { to: "/home", icon: Home, label: "Home" },
    { to: "/quests", icon: Award, label: "Quests" },
    { to: "/coach", icon: MessageCircle, label: "Coach" },
    { to: "/community", icon: Users, label: "Community" },
    { to: "/profile", icon: User, label: "Profile" },
  ];
  
  // Only render navigation if we're on a page that should have it
  const shouldShowNavigation = ['/home', '/quests', '/coach', '/community', '/profile'].includes(pathname);
  
  if (!shouldShowNavigation) {
    return null;
  }

  // Enhanced animation variants
  const containerVariants = {
    hidden: { y: 100, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 30,
        staggerChildren: 0.05,
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };
  
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 px-4 flex justify-center pb-safe">
      <motion.div 
        className="flex items-center justify-between px-4 py-2 rounded-xl backdrop-blur-xl bg-[#1A1A1A]/80 border border-[#333333] shadow-lg w-[95%] max-w-[340px] mb-3 relative"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Solivrah Brand Icon - positioned in the center */}
        <div className="absolute left-1/2 top-[-20px] transform -translate-x-1/2">
          <motion.div
            className="w-10 h-10 rounded-xl bg-gradient-to-b from-[#1A1A1A] to-[#0A0A0A] border border-white/20 flex items-center justify-center shadow-xl"
            whileHover={{ scale: 1.1, y: -2 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <SolivrahBrandIcon size={20} />
          </motion.div>
        </div>

        {navTabs.map((tab, index) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.to;
          
          return (
            <motion.div
              key={tab.to}
              variants={itemVariants}
              custom={index}
            >
              <Link
                to={tab.to}
                className="flex flex-col items-center justify-center"
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  className="relative p-1"
                >
                  <AnimatePresence mode="wait">
                    {isActive && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 rounded-full bg-white/10 backdrop-blur-sm"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      />
                    )}
                  </AnimatePresence>
                  
                  <div className={`p-1.5 ${isActive ? 'text-white' : 'text-gray-400'} transition-colors duration-200`}>
                    <Icon className="w-4 h-4" strokeWidth={2.5} />
                  </div>
                </motion.div>
                
                <motion.span 
                  className={`text-[10px] font-medium mt-0.5 ${isActive ? 'text-white' : 'text-gray-400'}`}
                  animate={{ opacity: isActive ? 1 : 0.7 }}
                >
                  {tab.label}
                </motion.span>
              </Link>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
};
