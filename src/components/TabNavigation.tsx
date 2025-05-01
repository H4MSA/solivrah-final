
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Home, Target, MessageCircle, Users, User } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const TabNavigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Helper function to check if a path is active
  const isActive = (path: string) => {
    // Special case for home path to match both "/" and "/home"
    if (path === "/" && (location.pathname === "/" || location.pathname === "/home")) {
      return true;
    }
    return location.pathname === path;
  };
  
  // Define our tabs with all needed properties
  const tabs = [
    { 
      icon: Home, 
      label: "Home", 
      path: "/", 
      accessibilityLabel: "Navigate to home page"
    },
    { 
      icon: Target, 
      label: "Quests", 
      path: "/quests", 
      accessibilityLabel: "Navigate to quests page"
    },
    { 
      icon: MessageCircle, 
      label: "Coach", 
      path: "/coach", 
      accessibilityLabel: "Navigate to AI coach page"
    },
    { 
      icon: Users, 
      label: "Social", 
      path: "/social", 
      accessibilityLabel: "Navigate to social page"
    },
    { 
      icon: User, 
      label: "Profile", 
      path: "/profile", 
      accessibilityLabel: "Navigate to profile page"
    }
  ];

  return (
    <motion.nav 
      className="fixed bottom-0 left-0 right-0 z-50 pb-safe pointer-events-none"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        type: "spring",
        stiffness: 400,
        damping: 30
      }}
    >
      <div className="mx-auto max-w-md px-4 pb-2">
        <motion.div
          className="backdrop-blur-2xl bg-black/80 border border-white/10 rounded-2xl shadow-lg overflow-hidden pointer-events-auto"
          whileHover={{ y: -2 }}
          transition={{ type: "spring", stiffness: 500 }}
        >
          <div className="flex items-center justify-around">
            {tabs.map(({ icon: Icon, label, path, accessibilityLabel }) => {
              const active = isActive(path);
              return (
                <button
                  key={path}
                  onClick={() => navigate(path)}
                  aria-label={accessibilityLabel}
                  className={cn(
                    "relative flex flex-col items-center justify-center py-3 px-2 w-16 group transition-all -webkit-tap-highlight-color-transparent",
                    active ? "text-white" : "text-white/40 hover:text-white/60"
                  )}
                  style={{WebkitTapHighlightColor: 'transparent'}}
                >
                  <motion.div 
                    className={cn(
                      "flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300",
                      active ? "bg-white/10" : "bg-transparent"
                    )}
                    whileHover={{ 
                      scale: active ? 1 : 1.05, 
                      backgroundColor: active ? "rgba(255, 255, 255, 0.1)" : "rgba(255, 255, 255, 0.05)" 
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Icon
                      size={active ? 20 : 18}
                      className={cn(
                        "transition-all duration-200",
                        active ? "text-white" : "text-white/40 group-hover:text-white/60"
                      )}
                    />
                  </motion.div>
                  <span
                    className={cn(
                      "text-xs mt-1 transition-all duration-200",
                      active ? "text-white font-medium" : "text-white/40 group-hover:text-white/60"
                    )}
                  >
                    {label}
                  </span>
                  
                  {active && (
                    <>
                      <motion.div
                        layoutId="activeTabGlow"
                        className="absolute -bottom-0.5 w-12 h-1 rounded-full bg-white/20 blur-md"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                      <motion.div
                        layoutId="activeTab"
                        className="absolute -bottom-0.5 w-8 h-[3px] bg-white rounded-full"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    </>
                  )}
                </button>
              );
            })}
          </div>
        </motion.div>
      </div>
    </motion.nav>
  );
};
