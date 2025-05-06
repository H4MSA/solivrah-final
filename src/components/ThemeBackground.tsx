
import React from "react";
import { useApp } from "@/context/AppContext";
import { motion } from "framer-motion";

export const ThemeBackground = () => {
  const { selectedTheme } = useApp();
  
  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none bg-solivrah-bg">
      {/* Subtle grid overlay with animation */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:44px_44px] opacity-40">
        <motion.div
          className="w-full h-full"
          animate={{
            backgroundPosition: ['0px 0px', '44px 44px', '0px 0px'],
          }}
          transition={{ 
            duration: 30, 
            ease: "linear", 
            repeat: Infinity,
          }}
        />
      </div>

      {/* Improved vignette effect */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_10%,#000000_100%)] opacity-80"></div>
      
      {/* Subtle animated particles */}
      <div className="absolute inset-0 overflow-hidden opacity-20">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white/10"
            style={{
              width: Math.random() * 4 + 2,
              height: Math.random() * 4 + 2,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 10 + 20,
              repeat: Infinity,
              delay: Math.random() * 20,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    </div>
  );
};
