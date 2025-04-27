
import React from "react";
import { useApp } from "@/context/AppContext";
import { motion } from "framer-motion";

export const ThemeBackground = () => {
  const { selectedTheme } = useApp();
  
  const getThemeAccentColor = () => {
    switch (selectedTheme) {
      case "Focus":
        return "bg-[#3a2c7c]/[0.25]";
      case "Discipline":
        return "bg-[#7c2c2c]/[0.25]";
      case "Resilience":
        return "bg-[#2c7c56]/[0.25]";
      case "Wildcards":
        return "bg-[#7c6c2c]/[0.25]";
      default:
        return "bg-white/[0.07]";
    }
  };

  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
      {/* Enhanced base background with subtle grid and glow */}
      <div className="absolute inset-0 bg-[#030303] bg-grid-white/[0.02]"></div>

      {/* Improved animated gradients with enhanced blur and glow */}
      <div className="absolute inset-0">
        <motion.div 
          className={`absolute top-[-20%] right-[-10%] w-[1200px] h-[1200px] ${getThemeAccentColor()} rounded-full blur-[250px] opacity-60`}
          animate={{ 
            x: [0, 30, 0],
            y: [0, -30, 0],
            scale: [1, 1.05, 1]
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 25, 
            ease: "easeInOut" 
          }}
        />
        <motion.div 
          className="absolute bottom-[-20%] left-[-10%] w-[1000px] h-[1000px] bg-white/[0.06] rounded-full blur-[220px] opacity-50"
          animate={{ 
            x: [0, -30, 0],
            y: [0, 30, 0],
            scale: [1, 1.03, 1]
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 20, 
            ease: "easeInOut"
          }}
        />
        
        {/* Additional subtle glow points */}
        <motion.div 
          className="absolute top-[30%] left-[20%] w-[300px] h-[300px] bg-white/[0.04] rounded-full blur-[100px]"
          animate={{ 
            opacity: [0.3, 0.5, 0.3],
            scale: [1, 1.2, 1]
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 15, 
            ease: "easeInOut"
          }}
        />
        
        <motion.div 
          className="absolute bottom-[30%] right-[20%] w-[250px] h-[250px] bg-white/[0.03] rounded-full blur-[80px]"
          animate={{ 
            opacity: [0.2, 0.4, 0.2],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 12, 
            ease: "easeInOut",
            delay: 2
          }}
        />
      </div>

      {/* Enhanced radial gradient for better depth */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#000000_100%)] opacity-80"></div>
    </div>
  );
};
