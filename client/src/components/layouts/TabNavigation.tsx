
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, Target, MessageCircle, Users, User } from "lucide-react";

const tabs = [
  { id: "home", label: "Home", icon: Home, path: "/" },
  { id: "quests", label: "Quests", icon: Target, path: "/quests" },
  { id: "coach", label: "Coach", icon: MessageCircle, path: "/coach" },
  { id: "community", label: "Community", icon: Users, path: "/community" },
  { id: "profile", label: "Profile", icon: User, path: "/profile" },
];

export const TabNavigation: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const activeTab = tabs.find(tab => tab.path === location.pathname)?.id || "home";

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-xl border-t border-white/10 z-40">
      <div className="flex justify-around items-center py-2 px-4 max-w-md mx-auto">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          
          return (
            <button
              key={tab.id}
              onClick={() => navigate(tab.path)}
              className="relative flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-200"
            >
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-white/10 rounded-xl"
                  transition={{ type: "spring", duration: 0.3 }}
                />
              )}
              
              <div className="relative z-10">
                <Icon
                  size={22}
                  className={`transition-colors ${
                    isActive ? "text-white" : "text-white/60"
                  }`}
                />
              </div>
              
              <span
                className={`text-xs font-medium transition-colors relative z-10 ${
                  isActive ? "text-white" : "text-white/60"
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
