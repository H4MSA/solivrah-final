
import React, { useEffect, useState } from "react";
import { useApp } from "@/context/AppContext";

interface Bubble {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  animationDuration: number;
}

export const BackgroundBubbles: React.FC = () => {
  const { themeColors } = useApp();
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  
  useEffect(() => {
    // Create initial bubbles
    const newBubbles: Bubble[] = [];
    for (let i = 0; i < 6; i++) {
      newBubbles.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 20 + Math.random() * 80,
        opacity: 0.03 + Math.random() * 0.05,
        animationDuration: 20 + Math.random() * 40
      });
    }
    setBubbles(newBubbles);
    
    // Periodically adjust the bubbles
    const interval = setInterval(() => {
      setBubbles(prev => {
        return prev.map(bubble => ({
          ...bubble,
          x: (bubble.x + (Math.random() * 2 - 1) * 5 + 100) % 100,
          y: (bubble.y + (Math.random() * 2 - 1) * 5 + 100) % 100,
          size: 20 + Math.random() * 80,
          opacity: 0.03 + Math.random() * 0.05
        }));
      });
    }, 8000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div 
      className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none"
      aria-hidden="true"
    >
      {bubbles.map(bubble => (
        <div
          key={bubble.id}
          className="absolute rounded-full animate-morph"
          style={{
            left: `${bubble.x}%`,
            top: `${bubble.y}%`,
            width: `${bubble.size}px`,
            height: `${bubble.size}px`,
            opacity: bubble.opacity,
            background: `radial-gradient(circle at center, ${themeColors.gradientStart}, ${themeColors.gradientEnd})`,
            animation: `float ${bubble.animationDuration}s infinite ease-in-out, morph 15s infinite alternate ease-in-out`,
            transitionProperty: "left, top, width, height",
            transitionDuration: "8s",
            transitionTimingFunction: "ease-in-out",
          }}
        />
      ))}
    </div>
  );
};
