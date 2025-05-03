
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useApp } from "@/context/AppContext";

export const ThemeBackground: React.FC = () => {
  const { selectedTheme } = useApp();
  const [bgColors, setBgColors] = useState<{
    primary: string;
    secondary: string;
    accent: string;
  }>({
    primary: "rgba(0, 255, 133, 0.2)",
    secondary: "rgba(167, 139, 250, 0.1)",
    accent: "rgba(56, 189, 248, 0.1)"
  });

  useEffect(() => {
    // Change background colors based on selected theme
    switch (selectedTheme) {
      case "Focus":
        setBgColors({
          primary: "rgba(0, 255, 133, 0.2)",
          secondary: "rgba(167, 139, 250, 0.1)",
          accent: "rgba(56, 189, 248, 0.1)"
        });
        break;
      case "Discipline":
        setBgColors({
          primary: "rgba(167, 139, 250, 0.2)",
          secondary: "rgba(0, 255, 133, 0.1)",
          accent: "rgba(255, 144, 31, 0.1)"
        });
        break;
      case "Resilience":
        setBgColors({
          primary: "rgba(56, 189, 248, 0.2)",
          secondary: "rgba(167, 139, 250, 0.1)",
          accent: "rgba(0, 255, 133, 0.1)"
        });
        break;
      case "Wildcards":
        setBgColors({
          primary: "rgba(255, 144, 31, 0.2)",
          secondary: "rgba(0, 255, 133, 0.1)",
          accent: "rgba(56, 189, 248, 0.1)"
        });
        break;
      default:
        setBgColors({
          primary: "rgba(0, 255, 133, 0.2)",
          secondary: "rgba(167, 139, 250, 0.1)",
          accent: "rgba(56, 189, 248, 0.1)"
        });
    }
  }, [selectedTheme]);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-[-1]">
      {/* Background base color */}
      <div className="absolute inset-0 bg-gradient-to-b from-rich-black via-rich-black to-dark-purple"></div>
      
      {/* Primary orb */}
      <motion.div 
        className="absolute blur-3xl rounded-full opacity-20"
        style={{
          width: "60%",
          height: "60%",
          top: "-10%",
          right: "-10%",
          background: bgColors.primary,
        }}
        animate={{
          x: [0, 30, 0],
          y: [0, -30, 0],
        }}
        transition={{
          duration: 20,
          ease: "easeInOut",
          repeat: Infinity,
        }}
      ></motion.div>
      
      {/* Secondary orb */}
      <motion.div 
        className="absolute blur-3xl rounded-full opacity-20"
        style={{
          width: "50%",
          height: "50%",
          bottom: "-10%",
          left: "-5%",
          background: bgColors.secondary,
        }}
        animate={{
          x: [0, -20, 0],
          y: [0, 20, 0],
        }}
        transition={{
          duration: 18,
          ease: "easeInOut",
          repeat: Infinity,
          repeatType: "reverse"
        }}
      ></motion.div>
      
      {/* Accent orb */}
      <motion.div 
        className="absolute blur-3xl rounded-full opacity-10"
        style={{
          width: "30%",
          height: "30%",
          top: "40%",
          left: "40%",
          background: bgColors.accent,
        }}
        animate={{
          x: [0, 40, 0],
          y: [0, 40, 0],
        }}
        transition={{
          duration: 25,
          ease: "easeInOut",
          repeat: Infinity,
        }}
      ></motion.div>
      
      {/* Fine grain overlay for texture */}
      <div className="absolute inset-0 bg-noise opacity-20"></div>
      
      {/* Vignette effect */}
      <div className="absolute inset-0 bg-radial-dark opacity-50"></div>
    </div>
  );
};
