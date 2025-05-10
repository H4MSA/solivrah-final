
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useApp } from "@/context/AppContext";

export const ThemeBackground: React.FC<{
  forcedPathname?: string; // Optional prop to pass pathname explicitly
}> = ({ forcedPathname }) => {
  const { selectedTheme } = useApp();
  const [mounted, setMounted] = useState(false);
  
  // Try to use location, but if not available, use the forcedPathname prop or window.location
  let pathname = forcedPathname || '/';
  
  // Try to get location from window when available
  try {
    // Only import and use if we're in a browser environment
    if (typeof window !== 'undefined') {
      pathname = window.location.pathname;
    }
  } catch (error) {
    console.warn("Could not access window.location, using forcedPathname");
  }

  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render on auth pages
  if (!mounted || (pathname && pathname.includes("/auth"))) return null;
  
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Main background - light gray */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-100 to-gray-200" />
      
      {/* Subtle grid pattern overlay - simplified to avoid SVG escaping issues */}
      <div className="absolute inset-0 opacity-10">
        <div className="w-full h-full bg-[length:20px_20px] bg-gray-900/5" 
             style={{ 
               backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 19px, rgba(0,0,0,0.05) 19px, rgba(0,0,0,0.05) 20px), 
                                repeating-linear-gradient(90deg, transparent, transparent 19px, rgba(0,0,0,0.05) 19px, rgba(0,0,0,0.05) 20px)` 
             }}
        />
      </div>
      
      {/* Subtle animated bubbles */}
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(0,0,0,0.01),transparent_70%)] -top-[250px] -left-[250px]"
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
        className="absolute w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(0,0,0,0.01),transparent_70%)] -bottom-[300px] -right-[300px]"
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
    </div>
  );
};
