
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Home, Award, MessageCircle, Users, User } from "lucide-react";
import { SolivrahBrandIcon } from "./SolivrahIcons";
import { useApp } from "@/context/AppContext";

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
  const [lastTap, setLastTap] = useState(0);
  const { premiumFeatures, streak, completedQuests } = useApp();
  
  useEffect(() => {
    if (locationHook) {
      setActiveTab(pathname);
    }
  }, [pathname, locationHook]);
  
  // Premium navigation tabs with enhanced features
  const navTabs = [
    { 
      to: "/home", 
      icon: Home, 
      label: "Home",
      badge: null,
      premium: false
    },
    { 
      to: "/quests", 
      icon: Award, 
      label: "Quests",
      badge: completedQuests > 0 ? completedQuests : null,
      premium: false
    },
    { 
      to: "/coach", 
      icon: MessageCircle, 
      label: "Coach",
      badge: premiumFeatures.aiCoach ? "AI" : null,
      premium: true
    },
    { 
      to: "/community", 
      icon: Users, 
      label: "Community",
      badge: null,
      premium: false
    },
    { 
      to: "/profile", 
      icon: User, 
      label: "Profile",
      badge: streak > 0 ? streak : null,
      premium: false
    },
  ];
  
  // Only render navigation if we're on a page that should have it
  const shouldShowNavigation = ['/home', '/quests', '/coach', '/community', '/profile'].includes(pathname);
  
  if (!shouldShowNavigation) {
    return null;
  }

  // Handle double tap for premium haptic feedback
  const handleTabPress = (tab: any) => {
    const now = Date.now();
    const timeDiff = now - lastTap;
    
    if (timeDiff < 300 && timeDiff > 0) {
      // Double tap detected
      if (premiumFeatures.hapticFeedback) {
        // Simulate haptic feedback
        console.log('Premium haptic feedback triggered');
      }
    }
    
    setLastTap(now);
  };

  // Premium animation variants
  const containerVariants = {
    hidden: { y: 100, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { 
        type: "spring", 
        stiffness: 400, 
        damping: 25,
        staggerChildren: 0.03,
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.8 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { type: "spring", stiffness: 500, damping: 20 }
    }
  };

  const badgeVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: { type: "spring", stiffness: 600, damping: 15 }
    }
  };
  
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 px-4 flex justify-center pb-safe">
      <motion.div 
        className="flex items-center justify-between px-4 py-3 rounded-2xl glass-card shadow-premium w-[95%] max-w-[380px] mb-4 relative overflow-hidden"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Premium background gradient */}
        <div className="absolute inset-0 bg-wellness-gradient opacity-5" />
        
        {/* Solivrah Brand Icon - positioned in the center with premium glow */}
        <div className="absolute left-1/2 top-[-24px] transform -translate-x-1/2">
          <motion.div
            className="w-12 h-12 rounded-2xl glass-card flex items-center justify-center shadow-premium-glow relative overflow-hidden"
            whileHover={{ scale: 1.1, y: -3 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 500, damping: 15 }}
          >
            <div className="absolute inset-0 bg-wellness-gradient opacity-20" />
            <div className="relative z-10">
              <SolivrahBrandIcon size={24} />
            </div>
            
            {/* Pulse effect for premium users */}
            {premiumFeatures.animations && (
              <motion.div
                className="absolute inset-0 bg-calm-500/20 rounded-2xl"
                animate={{ 
                  scale: [1, 1.1, 1],
                  opacity: [0.3, 0.1, 0.3]
                }}
                transition={{ 
                  duration: 3, 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }}
              />
            )}
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
              className="relative"
            >
              <Link
                to={tab.to}
                className="flex flex-col items-center justify-center nav-item"
                onClick={() => handleTabPress(tab)}
              >
                <motion.div
                  whileHover={{ scale: 1.15, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ type: "spring", stiffness: 500, damping: 20 }}
                  className="relative p-2"
                >
                  {/* Active tab background with premium styling */}
                  <AnimatePresence mode="wait">
                    {isActive && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 rounded-2xl bg-calm-500/20 backdrop-blur-sm border border-calm-500/30"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ type: "spring", stiffness: 600, damping: 25 }}
                      />
                    )}
                  </AnimatePresence>
                  
                  {/* Premium glow effect for active tab */}
                  {isActive && premiumFeatures.animations && (
                    <motion.div
                      className="absolute inset-0 rounded-2xl bg-calm-500/10"
                      animate={{ 
                        boxShadow: [
                          "0 0 0px rgba(20, 184, 166, 0.3)",
                          "0 0 20px rgba(20, 184, 166, 0.5)",
                          "0 0 0px rgba(20, 184, 166, 0.3)"
                        ]
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  )}
                  
                  <div className={`relative z-10 ${
                    isActive 
                      ? 'text-calm-400' 
                      : tab.premium && !premiumFeatures.aiCoach
                        ? 'text-gray-500'
                        : 'text-gray-400 hover:text-white'
                  } transition-colors duration-300`}>
                    <Icon className="w-5 h-5" strokeWidth={2.5} />
                    
                    {/* Premium lock icon for locked features */}
                    {tab.premium && !premiumFeatures.aiCoach && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-gold-500 rounded-full flex items-center justify-center">
                        <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Badge for notifications/counts */}
                  {tab.badge && (
                    <motion.div
                      className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-red-500 rounded-full flex items-center justify-center"
                      variants={badgeVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      <span className="text-[10px] font-bold text-white px-1">
                        {typeof tab.badge === 'number' && tab.badge > 99 ? '99+' : tab.badge}
                      </span>
                    </motion.div>
                  )}
                </motion.div>
                
                <motion.span 
                  className={`text-[10px] font-medium mt-1 ${
                    isActive 
                      ? 'text-calm-400' 
                      : tab.premium && !premiumFeatures.aiCoach
                        ? 'text-gray-500'
                        : 'text-gray-400'
                  } transition-colors duration-300`}
                  animate={{ 
                    opacity: isActive ? 1 : 0.8,
                    y: isActive ? -1 : 0
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  {tab.label}
                </motion.span>
              </Link>
            </motion.div>
          );
        })}

        {/* Premium shimmer effect */}
        {premiumFeatures.animations && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
            animate={{ x: [-100, 400] }}
            transition={{ 
              duration: 3, 
              repeat: Infinity, 
              ease: "linear",
              repeatDelay: 2
            }}
          />
        )}
      </motion.div>
    </div>
  );
};
