
import React from "react";
import { useApp } from "@/context/AppContext";

export const ThemeBackground = () => {
  const { selectedTheme } = useApp();
  
  const getThemeGradient = () => {
    // Using monochromatic styles only (black/white/gray)
    return {
      backgroundImage: "radial-gradient(circle at 20% 20%, rgba(255, 255, 255, 0.03) 0%, rgba(0, 0, 0, 0) 70%)",
      opacity: 0.5
    };
  };
  
  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
      {/* Base background */}
      <div className="absolute inset-0 bg-[#121212]"></div>
      
      {/* Subtle gradients */}
      <div 
        className="absolute top-0 right-0 w-full h-full"
        style={getThemeGradient()}
      ></div>
      
      {/* Subtle particle effect */}
      <div className="absolute top-10 left-10 w-20 h-20 rounded-full bg-white/[0.03] blur-3xl animate-float-slow"></div>
      <div className="absolute bottom-20 right-20 w-40 h-40 rounded-full bg-white/[0.02] blur-3xl animate-float-reverse"></div>
      <div className="absolute top-1/3 left-1/4 w-60 h-60 rounded-full bg-white/[0.01] blur-3xl animate-float"></div>
      
      {/* Vignette effect */}
      <div className="absolute inset-0 bg-radial-gradient pointer-events-none opacity-80"></div>
    </div>
  );
};
