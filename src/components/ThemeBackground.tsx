
import React, { useEffect, useState } from "react";
import { useApp } from "@/context/AppContext";
import { motion } from "framer-motion";

export const ThemeBackground = () => {
  const { selectedTheme } = useApp();
  const [themeColors, setThemeColors] = useState({
    primary: "rgba(75, 0, 130, 0.5)",
    secondary: "rgba(128, 0, 128, 0.3)",
    accent: "rgba(147, 112, 219, 0.2)"
  });

  useEffect(() => {
    // Adjust background colors based on selected theme
    switch (selectedTheme) {
      case "Focus":
        setThemeColors({
          primary: "rgba(0, 48, 73, 0.6)",
          secondary: "rgba(20, 33, 61, 0.4)",
          accent: "rgba(69, 123, 157, 0.3)"
        });
        break;
      case "Fitness":
        setThemeColors({
          primary: "rgba(0, 109, 119, 0.5)",
          secondary: "rgba(27, 152, 101, 0.3)",
          accent: "rgba(131, 197, 190, 0.2)"
        });
        break;
      case "Mindfulness":
        setThemeColors({
          primary: "rgba(75, 0, 130, 0.5)",
          secondary: "rgba(128, 0, 128, 0.3)",
          accent: "rgba(147, 112, 219, 0.2)"
        });
        break;
      case "Learning":
        setThemeColors({
          primary: "rgba(25, 130, 196, 0.5)",
          secondary: "rgba(13, 71, 161, 0.3)",
          accent: "rgba(21, 101, 192, 0.2)"
        });
        break;
      case "Discipline":
        setThemeColors({
          primary: "rgba(123, 31, 162, 0.5)",
          secondary: "rgba(74, 20, 140, 0.3)",
          accent: "rgba(106, 27, 154, 0.2)"
        });
        break;
      default:
        setThemeColors({
          primary: "rgba(75, 0, 130, 0.5)",
          secondary: "rgba(128, 0, 128, 0.3)",
          accent: "rgba(147, 112, 219, 0.2)"
        });
    }
  }, [selectedTheme]);

  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
      {/* Dark base background */}
      <div className="absolute inset-0 bg-black"></div>
      
      {/* Animated gradient orbs */}
      <motion.div 
        className="absolute rounded-full blur-[80px] opacity-30"
        animate={{
          x: ["0%", "10%", "0%"],
          y: ["0%", "-15%", "0%"],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          repeatType: "reverse",
        }}
        style={{
          width: "40%",
          height: "40%",
          top: "10%",
          left: "10%",
          background: themeColors.primary,
        }}
      />
      
      <motion.div 
        className="absolute rounded-full blur-[100px] opacity-20"
        animate={{
          x: ["0%", "-10%", "0%"],
          y: ["0%", "15%", "0%"],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          repeatType: "reverse",
          delay: 1
        }}
        style={{
          width: "35%",
          height: "35%",
          top: "50%",
          right: "10%",
          background: themeColors.secondary,
        }}
      />
      
      <motion.div 
        className="absolute rounded-full blur-[70px] opacity-15"
        animate={{
          x: ["0%", "15%", "0%"],
          y: ["0%", "10%", "0%"],
          scale: [1, 0.9, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          repeatType: "reverse",
          delay: 2
        }}
        style={{
          width: "25%",
          height: "25%",
          bottom: "15%",
          left: "25%",
          background: themeColors.accent,
        }}
      />
      
      {/* Subtle grain texture overlay */}
      <div 
        className="absolute inset-0 opacity-30" 
        style={{ 
          backgroundImage: "url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGQ9Ik0wIDBoMzAwdjMwMEgweiIgZmlsdGVyPSJ1cmwoI2EpIiBvcGFjaXR5PSIuMDUiLz48L3N2Zz4=')",
          backgroundRepeat: "repeat"
        }}
      />
    </div>
  );
};
