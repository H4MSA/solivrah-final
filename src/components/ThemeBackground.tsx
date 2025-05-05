
import React from "react";
import { useApp } from "@/context/AppContext";
import { motion } from "framer-motion";

export const ThemeBackground = () => {
  const { selectedTheme } = useApp();
  
  const getThemeAccentColor = () => {
    switch (selectedTheme) {
      case "Focus":
        return "bg-[#3a2c7c]/[0.15]";
      case "Discipline":
        return "bg-[#7c2c2c]/[0.15]";
      case "Resilience":
        return "bg-[#2c7c56]/[0.15]";
      case "Wildcards":
        return "bg-[#7c6c2c]/[0.15]";
      default:
        return "bg-white/[0.05]";
    }
  };

  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
      {/* Pure black background */}
      <div className="absolute inset-0 bg-black"></div>

      {/* Remove previous animated gradients - maintaining simpler design */}
    </div>
  );
};
