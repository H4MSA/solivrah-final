
import React from "react";
import { useApp } from "@/context/AppContext";

// Import the theme background images
const disciplineGradientBg = "public/lovable-uploads/5ec3ceb5-2985-4182-a734-dd7cf47cc4bf.png";
const focusGradientBg = "public/lovable-uploads/42c2d95a-ea45-4dcb-996e-daaadbc1faa4.png";
const resilienceGradientBg = "public/lovable-uploads/fe753006-6783-4677-ad80-43c266d31f3e.png";
const wildcardsGradientBg = "public/lovable-uploads/7d333bac-8153-4409-a9bb-0c3d5fe35bfc.png";
const patternBg = "public/lovable-uploads/8b68a791-5705-43a8-bb6e-0d820e855f06.png";

export const ThemeBackground: React.FC = () => {
  const { selectedTheme } = useApp();
  
  // Map themes to their background images and gradients
  const themeBackgrounds = {
    Discipline: {
      image: disciplineGradientBg,
      gradient: "linear-gradient(to bottom, #FF0000, #6B0000)",
      patternOpacity: 0.05,
      patternRotate: "0deg"
    },
    Focus: {
      image: focusGradientBg,
      gradient: "linear-gradient(to bottom, #008080, #000046)",
      patternOpacity: 0.04,
      patternRotate: "45deg"
    },
    Resilience: {
      image: resilienceGradientBg,
      gradient: "linear-gradient(to bottom, #FFA500, #8B4513)",
      patternOpacity: 0.03,
      patternRotate: "90deg"
    },
    Wildcards: {
      image: wildcardsGradientBg,
      gradient: "linear-gradient(to bottom, #00FF00, #006400)",
      patternOpacity: 0.04,
      patternRotate: "135deg"
    }
  };
  
  const currentTheme = themeBackgrounds[selectedTheme];
  
  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
      {/* Base dark background */}
      <div className="absolute inset-0 bg-black"></div>
      
      {/* Theme gradient */}
      <div 
        className="absolute inset-0 opacity-60 transition-opacity duration-1000"
        style={{ 
          backgroundImage: currentTheme.gradient,
          opacity: 0.3
        }}
      ></div>
      
      {/* Theme image background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000"
        style={{ 
          backgroundImage: `url(${currentTheme.image})`,
          opacity: 0.5,
          mixBlendMode: "overlay"
        }}
      ></div>
      
      {/* Pattern overlay */}
      <div 
        className="absolute inset-0 bg-repeat transition-all duration-1000"
        style={{ 
          backgroundImage: `url(${patternBg})`,
          opacity: currentTheme.patternOpacity,
          transform: `rotate(${currentTheme.patternRotate})`,
          backgroundSize: "200px 200px",
          mixBlendMode: "soft-light"
        }}
      ></div>
      
      {/* Vignette effect */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-70"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-transparent opacity-40"></div>
      
      {/* Glassmorphism layer */}
      <div className="absolute inset-0 backdrop-blur-[80px] opacity-20"></div>
    </div>
  );
};
