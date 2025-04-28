
import React, { useEffect, useState } from "react";
import { useApp } from "@/context/AppContext";
import { motion } from "framer-motion";

export const ThemeBackground: React.FC = () => {
  const { selectedTheme } = useApp();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Generate theme-specific colors
  const getThemeColors = () => {
    switch (selectedTheme) {
      case "Focus":
        return {
          primary: "rgba(106, 90, 205, 0.15)",
          secondary: "rgba(90, 70, 185, 0.1)",
          accent: "rgba(138, 116, 240, 0.08)"
        };
      case "Discipline":
        return {
          primary: "rgba(220, 38, 38, 0.1)",
          secondary: "rgba(180, 30, 30, 0.08)",
          accent: "rgba(248, 113, 113, 0.06)"
        };
      case "Resilience":
        return {
          primary: "rgba(16, 185, 129, 0.1)",
          secondary: "rgba(12, 160, 110, 0.08)",
          accent: "rgba(52, 211, 153, 0.06)"
        };
      default:
        return {
          primary: "rgba(100, 100, 120, 0.08)",
          secondary: "rgba(80, 80, 100, 0.06)",
          accent: "rgba(150, 150, 170, 0.04)"
        };
    }
  };

  const colors = getThemeColors();

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Base gradient */}
      <div 
        className="absolute inset-0 bg-gradient-to-b from-black via-black to-[#0a0a0a] transition-all duration-1000"
      />
      
      {/* Ambient glow */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.8 }}
        transition={{ duration: 2 }}
        style={{
          position: "absolute",
          top: "-20%",
          left: "-10%",
          width: "120%",
          height: "50%",
          background: `radial-gradient(ellipse at center, ${colors.primary} 0%, transparent 60%)`,
          filter: "blur(80px)",
        }}
      />
      
      {/* Secondary glow */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ duration: 2, delay: 0.2 }}
        style={{
          position: "absolute",
          bottom: "-20%",
          right: "-10%",
          width: "120%",
          height: "50%",
          background: `radial-gradient(ellipse at center, ${colors.secondary} 0%, transparent 60%)`,
          filter: "blur(100px)",
        }}
      />
      
      {/* Subtle moving particles/lights */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating particles */}
        <div className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full bg-white/5 blur-3xl animate-float-slow" />
        <div className="absolute top-3/4 left-2/3 w-48 h-48 rounded-full bg-white/3 blur-3xl animate-float" />
        <div className="absolute top-2/3 left-1/5 w-40 h-40 rounded-full bg-white/2 blur-3xl animate-float-reverse" />
      </div>
      
      {/* Subtle grid pattern overlay */}
      <div className="absolute inset-0 bg-grid-white opacity-[0.015]" />
      
      {/* Vignette effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/30" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30" />
    </div>
  );
};
