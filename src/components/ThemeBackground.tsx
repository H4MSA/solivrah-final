
import React from "react";
import { useApp } from "@/context/AppContext";
import { motion } from "framer-motion";

export const ThemeBackground = () => {
  // Get the selected theme from context to influence background colors
  const { selectedTheme } = useApp();
  
  // Determine gradient colors based on the selected theme
  const getThemeAccentColor = () => {
    switch (selectedTheme) {
      case "Focus":
        return "bg-[#3a2c7c]/[0.03]";
      case "Discipline":
        return "bg-[#7c2c2c]/[0.03]";
      case "Resilience":
        return "bg-[#2c7c56]/[0.03]";
      case "Wildcards":
        return "bg-[#7c6c2c]/[0.03]";
      default:
        return "bg-white/[0.02]";
    }
  };

  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
      {/* Base background with subtle grid */}
      <div className="absolute inset-0 bg-[#0A0A0A] bg-grid-white/[0.02]"></div>

      {/* Subtle animated gradients */}
      <div className="absolute inset-0">
        <motion.div 
          className={`absolute top-0 right-0 w-[600px] h-[600px] ${getThemeAccentColor()} rounded-full blur-[120px]`}
          animate={{ 
            x: [0, 20, 0],
            y: [0, -20, 0],
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 18, 
            ease: "easeInOut" 
          }}
        />
        <motion.div 
          className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-white/[0.03] rounded-full blur-[100px]"
          animate={{ 
            x: [0, -20, 0],
            y: [0, 20, 0],
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 15, 
            ease: "easeInOut",
            repeatType: "reverse" 
          }}
        />
      </div>

      {/* Grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:44px_44px]"></div>

      {/* Moving dot pattern (subtle) */}
      <div className="absolute inset-0 opacity-[0.08]" style={{
        backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)',
        backgroundSize: '32px 32px',
        backgroundPosition: '0 0',
      }}>
        <motion.div 
          className="w-full h-full"
          animate={{
            backgroundPosition: ['0px 0px', '32px 32px', '0px 0px'],
          }}
          transition={{ 
            duration: 20, 
            ease: "linear", 
            repeat: Infinity,
          }}
        />
      </div>

      {/* Vignette effect */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#000000_100%)] opacity-70"></div>
    </div>
  );
};
