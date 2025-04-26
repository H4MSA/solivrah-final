import React from "react";
import { useApp } from "@/context/AppContext";
import { motion } from "framer-motion";

export const ThemeBackground = () => {
  const { selectedTheme } = useApp();
  
  const getThemeAccentColor = () => {
    switch (selectedTheme) {
      case "Focus":
        return "bg-[#3a2c7c]/[0.05]";
      case "Discipline":
        return "bg-[#7c2c2c]/[0.05]";
      case "Resilience":
        return "bg-[#2c7c56]/[0.05]";
      case "Wildcards":
        return "bg-[#7c6c2c]/[0.05]";
      default:
        return "bg-white/[0.02]";
    }
  };

  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
      {/* Enhanced base background with subtle grid */}
      <div className="absolute inset-0 bg-[#0A0A0A] bg-grid-white/[0.02]"></div>

      {/* Improved animated gradients with better blur */}
      <div className="absolute inset-0">
        <motion.div 
          className={`absolute top-0 right-0 w-[800px] h-[800px] ${getThemeAccentColor()} rounded-full blur-[150px] opacity-50`}
          animate={{ 
            x: [0, 20, 0],
            y: [0, -20, 0],
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 20, 
            ease: "easeInOut" 
          }}
        />
        <motion.div 
          className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-white/[0.02] rounded-full blur-[120px] opacity-40"
          animate={{ 
            x: [0, -20, 0],
            y: [0, 20, 0],
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 18, 
            ease: "easeInOut",
            repeatType: "reverse" 
          }}
        />
      </div>

      {/* Enhanced grid overlay with animation */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:44px_44px]">
        <motion.div
          className="w-full h-full"
          animate={{
            backgroundPosition: ['0px 0px', '44px 44px', '0px 0px'],
          }}
          transition={{ 
            duration: 20, 
            ease: "linear", 
            repeat: Infinity,
          }}
        />
      </div>

      {/* Improved vignette effect */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#000000_100%)] opacity-80"></div>
    </div>
  );
};
