import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppSound } from "@/context/SoundContext";
import { Home, Search, User, MessageSquare, Users } from "lucide-react";

interface TabItem {
  icon: React.ReactNode;
  label: string;
  path: string;
}

const tabs: TabItem[] = [
  {
    icon: <Home size={24} />,
    label: "Home",
    path: "/home",
  },
  {
    icon: <Search size={24} />,
    label: "Quests",
    path: "/quests",
  },
  {
    icon: <Users size={24} />,
    label: "Community",
    path: "/community",
  },
  {
    icon: <MessageSquare size={24} />,
    label: "Coach",
    path: "/coach",
  },
  {
    icon: <User size={24} />,
    label: "Profile",
    path: "/profile",
  },
];

export function TabNavigation() {
  const location = useLocation();
  const navigate = useNavigate();
  const { playWithHaptics } = useAppSound();
  const [activeTab, setActiveTab] = useState<string>("");
  
  // Update active tab based on current location
  useEffect(() => {
    const path = location.pathname;
    const tab = tabs.find(tab => path.startsWith(tab.path));
    if (tab) {
      setActiveTab(tab.path);
    }
  }, [location]);
  
  // Handle tab click
  const handleTabClick = (path: string) => {
    playWithHaptics("button-tap");
    navigate(path);
  };
  
  // Get tab index
  const getActiveIndex = () => {
    return tabs.findIndex(tab => tab.path === activeTab);
  };
  
  return (
    <div className="fixed bottom-0 left-0 right-0 z-10 bg-background/80 backdrop-blur-lg border-t border-white/10 pb-safe">
      <div className="flex items-center justify-around relative">
        {/* Indicator */}
        <motion.div 
          className="absolute top-0 w-1/5 h-1 bg-primary rounded-b-md"
          initial={false}
          animate={{ 
            left: `${getActiveIndex() * 20}%`,
          }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
        
        {/* Tabs */}
        {tabs.map((tab) => (
          <motion.button
            key={tab.path}
            className="flex flex-col items-center justify-center py-3 w-full"
            onClick={() => handleTabClick(tab.path)}
            whileTap={{ scale: 0.9 }}
          >
            <motion.div
              animate={{
                scale: activeTab === tab.path ? 1.1 : 1,
                color: activeTab === tab.path ? "var(--primary)" : "var(--muted-foreground)",
              }}
              transition={{ duration: 0.2 }}
            >
              {tab.icon}
            </motion.div>
            
            <motion.span 
              className="text-xs mt-1"
              animate={{
                color: activeTab === tab.path ? "var(--primary)" : "var(--muted-foreground)",
              }}
              transition={{ duration: 0.2 }}
            >
              {tab.label}
            </motion.span>
          </motion.button>
        ))}
      </div>
    </div>
  );
} 