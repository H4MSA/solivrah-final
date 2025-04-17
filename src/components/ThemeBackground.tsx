
import React, { useEffect, useState } from "react";
import { useApp } from "@/context/AppContext";

// Import the theme background images
const disciplineGradientBg = "public/lovable-uploads/5ec3ceb5-2985-4182-a734-dd7cf47cc4bf.png";
const focusGradientBg = "public/lovable-uploads/42c2d95a-ea45-4dcb-996e-daaadbc1faa4.png";
const resilienceGradientBg = "public/lovable-uploads/fe753006-6783-4677-ad80-43c266d31f3e.png";
const wildcardsGradientBg = "public/lovable-uploads/7d333bac-8153-4409-a9bb-0c3d5fe35bfc.png";
const patternBg = "public/lovable-uploads/8b68a791-5705-43a8-bb6e-0d820e855f06.png";

// New background images (from uploads in the current message)
const userBg1 = "public/lovable-uploads/038bdabb-7c03-4472-8960-1570ffc24f9f.png";
const userBg2 = "public/lovable-uploads/58f08911-0411-45dc-b1fc-3a77b14e8585.png";
const userBg3 = "public/lovable-uploads/3cb43d71-59fe-4452-adb5-fba6ec518708.png";
const userBg4 = "public/lovable-uploads/c0fe3edb-79c7-443c-9af8-eb71e678615e.png";
const userBg5 = "public/lovable-uploads/3cde794b-6406-42a9-a531-3ebb816e38ff.png";

export const ThemeBackground: React.FC = () => {
  const { selectedTheme } = useApp();
  const [bubbles, setBubbles] = useState<Array<{id: number, size: number, x: number, y: number, speed: number, opacity: number}>>([]);
  
  // Generate random bubbles
  useEffect(() => {
    const newBubbles = [];
    const count = 6; // Number of bubbles
    
    for (let i = 0; i < count; i++) {
      newBubbles.push({
        id: i,
        size: Math.random() * 300 + 100, // Size between 100px and 400px
        x: Math.random() * 100, // Position X (%)
        y: Math.random() * 100, // Position Y (%)
        speed: Math.random() * 20 + 10, // Animation duration between 10s and 30s
        opacity: Math.random() * 0.05 + 0.02, // Opacity between 0.02 and 0.07
      });
    }
    
    setBubbles(newBubbles);
  }, []);
  
  // Map themes to their background images and gradients
  const themeBackgrounds = {
    Discipline: {
      image: userBg3, // Red/warm theme
      gradient: "linear-gradient(to bottom, #FF0000, #6B0000)",
      patternOpacity: 0.05,
      patternRotate: "0deg"
    },
    Focus: {
      image: userBg2, // Teal/blue theme
      gradient: "linear-gradient(to bottom, #008080, #000046)",
      patternOpacity: 0.04,
      patternRotate: "45deg"
    },
    Resilience: {
      image: userBg4, // Orange/brown theme
      gradient: "linear-gradient(to bottom, #FFA500, #8B4513)",
      patternOpacity: 0.03,
      patternRotate: "90deg"
    },
    Wildcards: {
      image: userBg5, // Green theme
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
          opacity: 0.4
        }}
      ></div>
      
      {/* Theme image background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000"
        style={{ 
          backgroundImage: `url(${currentTheme.image})`,
          opacity: 0.6,
          mixBlendMode: "overlay"
        }}
      ></div>
      
      {/* Random bubble effects */}
      {bubbles.map(bubble => (
        <div 
          key={bubble.id}
          className="bubble absolute rounded-full z-0"
          style={{
            width: `${bubble.size}px`,
            height: `${bubble.size}px`,
            left: `${bubble.x}%`,
            top: `${bubble.y}%`,
            opacity: bubble.opacity,
            animation: `float ${bubble.speed}s infinite ease-in-out`,
            background: "radial-gradient(circle at center, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 70%)",
            filter: "blur(40px)"
          }}
        />
      ))}
      
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
      <div className="absolute inset-0 backdrop-blur-[60px] opacity-10"></div>
    </div>
  );
};
