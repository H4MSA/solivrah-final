
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Home, Target, MessageCircle, Users, User } from "lucide-react";
import { motion } from "framer-motion";

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

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50">
      <div className="mx-auto max-w-md">
        <div className="mx-4 mb-2">
          <div className="backdrop-blur-xl bg-black/80 border border-white/10 rounded-2xl shadow-lg">
            <div className="flex items-center justify-around p-2">
              {tabs.map(({ icon: Icon, label, path }) => {
                const active = isActive(path);
                return (
                  <button
                    key={path}
                    onClick={() => navigate(path)}
                    className="relative flex flex-col items-center justify-center p-2 w-16 group"
                  >
                    <Icon
                      size={20}
                      className={`transition-colors duration-200 ${
                        active ? "text-white" : "text-white/40 group-hover:text-white/60"
                      }`}
                    />
                    <span
                      className={`text-xs mt-1 transition-colors duration-200 ${
                        active ? "text-white" : "text-white/40 group-hover:text-white/60"
                      }`}
                    >
                      {label}
                    </span>
                    {active && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute -bottom-2 w-1 h-1 bg-white rounded-full"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};
