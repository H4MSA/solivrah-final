
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
      {/* Main background - dark gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black to-gray-900" />
      
      {/* Subtle grid pattern overlay */}
      <div 
        className="absolute inset-0 opacity-10" 
        style={{
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='20' height='20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h20v20H0z' fill='%23FFF' fill-opacity='0.05'/%3E%3C/svg%3E\")",
          backgroundSize: "20px 20px"
        }}
      />
      
      {/* Animated particles */}
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full bg-gradient-radial from-purple-900/10 to-transparent -top-[300px] -left-[300px]"
        animate={{
          x: [0, 30, 0],
          y: [0, 20, 0],
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      <motion.div
        className="absolute w-[800px] h-[800px] rounded-full bg-gradient-radial from-indigo-900/10 to-transparent -bottom-[400px] -right-[400px]"
        animate={{
          x: [0, -40, 0],
          y: [0, -20, 0],
          scale: [1, 1.03, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      {/* Subtle glow effect */}
      <motion.div
        className="absolute inset-0 opacity-30"
        animate={{
          opacity: [0.2, 0.3, 0.2],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{
          background: "radial-gradient(circle at 50% 50%, rgba(79, 70, 229, 0.15) 0%, transparent 70%)"
        }}
      />
    </div>
  );
};
