
import React, { useEffect, useState } from "react";
import { useApp } from "@/context/AppContext";

export const ThemeBackground: React.FC = () => {
  const { selectedTheme, themeColors } = useApp();
  const [animationOffset, setAnimationOffset] = useState(0);
  
  useEffect(() => {
    // Create a subtle animation effect
    const interval = setInterval(() => {
      setAnimationOffset(prev => (prev + 1) % 100);
    }, 50);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div 
      className="fixed inset-0 z-[-1] overflow-hidden"
      aria-hidden="true"
    >
      {/* Base background color */}
      <div className="absolute inset-0 bg-[#121212]"></div>
      
      {/* Theme-specific gradient background */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          background: `radial-gradient(ellipse at top, ${themeColors.gradientStart}22, transparent 70%), 
                      radial-gradient(ellipse at bottom, ${themeColors.gradientEnd}22, transparent 70%)`
        }}
      ></div>
      
      {/* Animated wave patterns */}
      <div 
        className="absolute w-full h-full opacity-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3ClinearGradient id='grad' x1='0%25' y1='0%25' x2='100%25' y2='0%25'%3E%3Cstop offset='0%25' stop-color='%23${themeColors.gradientStart.substring(1)}' /%3E%3Cstop offset='100%25' stop-color='%23${themeColors.gradientEnd.substring(1)}' /%3E%3C/linearGradient%3E%3C/defs%3E%3Cpath d='M0,64 C150,192 350,0 500,128 C650,320 850,64 1000,192 L1000,500 L0,500 Z' fill='url(%23grad)' opacity='0.4'%3E%3C/path%3E%3C/svg%3E")`,
          backgroundSize: "100% 100%",
          transform: `translateY(${animationOffset}px)`,
          transition: "transform 0.5s ease-out"
        }}
      ></div>
      
      {/* Subtle mesh pattern for texture */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: "url('data:image/svg+xml,%3Csvg xmlns=\"http://www.w3.org/2000/svg\" width=\"100\" height=\"100\"%3E%3Ccircle cx=\"50\" cy=\"50\" r=\"0.5\" fill=\"%23FFFFFF\" /%3E%3C/svg%3E')",
          backgroundSize: "20px 20px"
        }}
      ></div>
      
      {/* Vignette effect */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(circle at center, transparent 30%, rgba(0,0,0,0.6) 100%)"
        }}
      ></div>
    </div>
  );
};
