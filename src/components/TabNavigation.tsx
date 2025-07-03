
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, Target, MessageCircle, Users, User } from "lucide-react";
import TabButton from "./ui/TabButton";

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
    { to: "/quests", icon: Target, label: "Quests" },
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
  
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 px-4 flex justify-center pb-safe">
      <motion.nav 
        className="fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-sm border-t border-gray-800/50"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="flex justify-around items-center py-4 px-6 max-w-md mx-auto">
          {navTabs.map((tab) => (
            <Link to={tab.to} key={tab.to}>
              <TabButton
                id={tab.to}
                icon={tab.icon}
                label={tab.label}
                isActive={activeTab === tab.to}
                onClick={() => setActiveTab(tab.to)}
              />
            </Link>
          ))}
        </div>
      </motion.nav>
    </div>
  );
};
