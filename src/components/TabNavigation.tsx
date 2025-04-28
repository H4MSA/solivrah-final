
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Home, Target, MessageCircle, Users, User } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const TabNavigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const isActive = (path: string) => location.pathname === path;
  
  const tabs = [
    { icon: Home, label: "Home", path: "/" },
    { icon: Target, label: "Quests", path: "/quests" },
    { icon: MessageCircle, label: "Coach", path: "/coach" },
    { icon: Users, label: "Social", path: "/social" },
    { icon: User, label: "Profile", path: "/profile" }
  ];

  // Enhanced animation variants
  const barVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: "spring",
        stiffness: 400,
        damping: 30
      }
    }
  };

  return (
    <motion.nav 
      className="fixed bottom-0 left-0 right-0 z-50 pb-2"
      initial="hidden"
      animate="visible"
      variants={barVariants}
    >
      <div className="mx-auto max-w-md">
        <div className="mx-4 mb-2">
          <div className="backdrop-blur-2xl bg-black/80 border border-white/10 rounded-2xl shadow-lg overflow-hidden">
            <div className="flex items-center justify-around">
              {tabs.map(({ icon: Icon, label, path }) => {
                const active = isActive(path);
                return (
                  <button
                    key={path}
                    onClick={() => navigate(path)}
                    className={cn(
                      "relative flex flex-col items-center justify-center py-3 px-2 w-16 group transition-all",
                      active ? "text-white" : "text-white/40 hover:text-white/60"
                    )}
                  >
                    <div className={cn(
                      "flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300",
                      active ? "bg-white/10" : "bg-transparent"
                    )}>
                      <Icon
                        size={18}
                        className={cn(
                          "transition-all duration-200",
                          active ? "text-white" : "text-white/40 group-hover:text-white/60"
                        )}
                      />
                    </div>
                    <span
                      className={cn(
                        "text-xs mt-1 transition-all duration-200",
                        active ? "text-white font-medium" : "text-white/40 group-hover:text-white/60"
                      )}
                    >
                      {label}
                    </span>
                    
                    {/* Active indicator with enhanced glow */}
                    {active && (
                      <>
                        <motion.div
                          layoutId="activeTabGlow"
                          className="absolute bottom-0 w-12 h-1 rounded-full bg-white/20 blur-md"
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                        <motion.div
                          layoutId="activeTab"
                          className="absolute bottom-0 w-8 h-[3px] bg-white rounded-full"
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                      </>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};
