
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useApp } from "@/context/AppContext";

export const ThemeBackground: React.FC<{
  forcedPathname?: string;
}> = ({ forcedPathname }) => {
  const { selectedTheme } = useApp();
  const [mounted, setMounted] = useState(false);
  
  let pathname = forcedPathname || '/';
  
  try {
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
      <div className="absolute inset-0 bg-black" />
      
      {/* Subtle grid pattern overlay */}
      <div 
        className="absolute inset-0 opacity-5" 
        style={{
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='20' height='20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h20v20H0z' fill='%23FFF' fill-opacity='0.05'/%3E%3C/svg%3E\")",
          backgroundSize: "20px 20px"
        }}
      />
      
      {/* Subtle animated gradient overlays for depth */}
      <motion.div
        className="absolute w-[800px] h-[800px] rounded-full bg-gradient-radial from-white/[0.03] to-transparent -top-[400px] -left-[400px]"
        animate={{
          x: [0, 30, 0],
          y: [0, 20, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      <motion.div
        className="absolute w-[1000px] h-[1000px] rounded-full bg-gradient-radial from-white/[0.02] to-transparent -bottom-[500px] -right-[500px]"
        animate={{
          x: [0, -40, 0],
          y: [0, -20, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      {/* Subtle glow effect */}
      <motion.div
        className="absolute inset-0 opacity-20"
        animate={{
          opacity: [0.15, 0.2, 0.15],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{
          background: "radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.03) 0%, transparent 70%)"
        }}
      />
    </div>
  );
};
