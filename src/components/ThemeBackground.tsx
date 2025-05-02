
import React, { useEffect, useState } from "react";
import { useApp } from "@/context/AppContext";
import { motion } from "framer-motion";

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
}

export const ThemeBackground: React.FC = () => {
  const { selectedTheme } = useApp();
  const [mounted, setMounted] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    setMounted(true);
    
    // Generate particles
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 10 + 10,
      delay: Math.random() * 5
    }));
    
    setParticles(newParticles);
  }, []);

  // Generate theme-specific colors
  const getThemeColors = () => {
    switch (selectedTheme) {
      case "Focus":
        return {
          primary: "rgba(106, 90, 205, 0.15)",
          secondary: "rgba(90, 70, 185, 0.1)",
          accent: "rgba(138, 116, 240, 0.08)"
        };
      case "Discipline":
        return {
          primary: "rgba(220, 38, 38, 0.1)",
          secondary: "rgba(180, 30, 30, 0.08)",
          accent: "rgba(248, 113, 113, 0.06)"
        };
      case "Resilience":
        return {
          primary: "rgba(16, 185, 129, 0.1)",
          secondary: "rgba(12, 160, 110, 0.08)",
          accent: "rgba(52, 211, 153, 0.06)"
        };
      default:
        return {
          primary: "rgba(0, 255, 133, 0.08)",
          secondary: "rgba(191, 255, 0, 0.05)",
          accent: "rgba(56, 189, 248, 0.05)"
        };
    }
  };

  const colors = getThemeColors();

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Base gradient */}
      <div 
        className="absolute inset-0 bg-gradient-to-b from-rich-black via-rich-black to-dark-purple transition-all duration-1000"
      />
      
      {/* Ambient glow */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.8 }}
        transition={{ duration: 2 }}
        style={{
          position: "absolute",
          top: "-20%",
          left: "-10%",
          width: "120%",
          height: "50%",
          background: `radial-gradient(ellipse at center, ${colors.primary} 0%, transparent 60%)`,
          filter: "blur(80px)",
        }}
      />
      
      {/* Secondary glow */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ duration: 2, delay: 0.2 }}
        style={{
          position: "absolute",
          bottom: "-20%",
          right: "-10%",
          width: "120%",
          height: "50%",
          background: `radial-gradient(ellipse at center, ${colors.secondary} 0%, transparent 60%)`,
          filter: "blur(100px)",
        }}
      />
      
      {/* Subtle moving particles/lights */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating particles */}
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute w-2 h-2 rounded-full bg-white/5"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
            }}
            animate={{
              y: [0, -100, 0],
              x: [0, Math.random() * 50 - 25, 0],
              opacity: [0, 0.5, 0],
            }}
            transition={{
              duration: particle.duration,
              delay: particle.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
      
      {/* Subtle grid pattern overlay */}
      <div className="absolute inset-0 bg-grid-white opacity-[0.015]" />
      
      {/* Vignette effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/30" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30" />
    </div>
  );
};

export default ThemeBackground;
