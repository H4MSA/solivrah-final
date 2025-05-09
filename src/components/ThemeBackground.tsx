
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useApp } from "@/context/AppContext";
import { useLocation } from "react-router-dom";

export const ThemeBackground: React.FC = () => {
  const { selectedTheme } = useApp();
  const [mounted, setMounted] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render on auth pages
  if (!mounted || location.pathname.includes("/auth")) return null;

  const getThemeGradient = () => {
    switch (selectedTheme) {
      case "Discipline":
        return "from-[#131313] via-[#0F0F0F] to-[#0D0D0D] bg-[radial-gradient(circle_at_90%_10%,rgba(220,38,38,0.07),transparent_50%)]";
      case "Focus":
        return "from-[#131313] via-[#0F0F0F] to-[#0D0D0D] bg-[radial-gradient(circle_at_90%_10%,rgba(106,90,205,0.07),transparent_50%)]";
      case "Resilience":
        return "from-[#131313] via-[#0F0F0F] to-[#0D0D0D] bg-[radial-gradient(circle_at_90%_10%,rgba(16,185,129,0.07),transparent_50%)]";
      case "Wildcards":
        return "from-[#131313] via-[#0F0F0F] to-[#0D0D0D] bg-[radial-gradient(circle_at_90%_10%,rgba(245,158,11,0.07),transparent_50%)]";
      default:
        return "from-[#131313] via-[#0F0F0F] to-[#0D0D0D]";
    }
  };

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Main background */}
      <div className={`absolute inset-0 bg-gradient-to-b ${getThemeGradient()}`} />
      
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-grid-white opacity-30" />
      
      {/* Animated bubbles */}
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.01),transparent_70%)] -top-[250px] -left-[250px]"
        animate={{
          x: [0, 30, 0],
          y: [0, 50, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.01),transparent_70%)] -bottom-[300px] -right-[300px]"
        animate={{
          x: [0, -40, 0],
          y: [0, -30, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      {/* Subtle animated gradient overlay */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 animate-gradient-shift bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.03),transparent)]" />
      </div>
    </div>
  );
};
