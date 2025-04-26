
import React from "react";
import { useApp } from "@/context/AppContext";
import { motion } from "framer-motion";

export const ThemeBackground = () => {
  const { selectedTheme } = useApp();
  
  const getThemeAccentColor = () => {
    switch (selectedTheme) {
      case "Focus":
        return "bg-[#3a2c7c]/[0.12]";
      case "Discipline":
        return "bg-[#7c2c2c]/[0.12]";
      case "Resilience":
        return "bg-[#2c7c56]/[0.12]";
      case "Wildcards":
        return "bg-[#7c6c2c]/[0.12]";
      default:
        return "bg-white/[0.05]";
    }
  };

  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
      {/* Enhanced base background with subtle grid */}
      <div className="absolute inset-0 bg-[#070707] bg-grid-white/[0.03]"></div>

      {/* Improved animated gradients with better blur */}
      <div className="absolute inset-0">
        <motion.div 
          className={`absolute top-[-20%] right-[-10%] w-[1000px] h-[1000px] ${getThemeAccentColor()} rounded-full blur-[180px] opacity-60`}
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
          className="absolute bottom-[-20%] left-[-10%] w-[800px] h-[800px] bg-white/[0.03] rounded-full blur-[150px] opacity-50"
          animate={{ 
            x: [0, -30, 0],
            y: [0, 30, 0],
            scale: [1, 1.03, 1]
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 20, 
            ease: "easeInOut",
            repeatType: "reverse" 
          }}
        />
      </div>

      {/* Enhanced grid overlay with animation */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:44px_44px]">
        <motion.div
          className="w-full h-full"
          animate={{
            backgroundPosition: ['0px 0px', '44px 44px', '0px 0px'],
          }}
          transition={{ 
            duration: 30, 
            ease: "linear", 
            repeat: Infinity,
          }}
        />
      </div>

      {/* Improved vignette effect */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_10%,#000000_100%)] opacity-90"></div>
      
      {/* Subtle animated particles */}
      <div className="absolute inset-0 overflow-hidden opacity-30">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white/10"
            style={{
              width: Math.random() * 4 + 2,
              height: Math.random() * 4 + 2,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 10 + 20,
              repeat: Infinity,
              delay: Math.random() * 20,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    </div>
  );
};
