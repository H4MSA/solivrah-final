
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Logo } from "@/components/Logo";
import { FiArrowRight, FiShield, FiCheckCircle } from "react-icons/fi";
import { GlassCard } from "@/components/GlassCard";

const Index = () => {
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);
  const [bubbles, setBubbles] = useState<Array<{id: number, size: number, left: string, top: string, delay: number}>>([]);
  
  useEffect(() => {
    // Simulate logo animation with a delay
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 1000);
    
    // Create dynamic background bubbles
    const newBubbles = Array.from({ length: 7 }, (_, i) => ({
      id: i,
      size: Math.floor(Math.random() * 150) + 50,
      left: `${Math.floor(Math.random() * 100)}%`,
      top: `${Math.floor(Math.random() * 100)}%`,
      delay: Math.random() * 5
    }));
    setBubbles(newBubbles);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <div className="min-h-screen flex flex-col justify-between p-6 bg-gradient-to-b from-background to-background-end overflow-hidden">
      {/* Dynamic background effects */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {bubbles.map(bubble => (
          <div 
            key={bubble.id} 
            className="bubble" 
            style={{ 
              width: `${bubble.size}px`, 
              height: `${bubble.size}px`, 
              left: bubble.left, 
              top: bubble.top,
              animationDelay: `${bubble.delay}s`,
              background: bubble.id % 2 === 0 ? 'rgba(197, 114, 255, 0.05)' : 'rgba(96, 150, 255, 0.05)'
            }}
          />
        ))}
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-secondary/10 rounded-full blur-[100px]"></div>
      </div>
      
      <div className={`flex-1 flex flex-col justify-center items-center text-center space-y-8 transition-all duration-1000 z-10 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <Logo className="text-7xl mb-4 animate-float drop-shadow-lg" />
        
        <div className="space-y-3">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Build better habits
          </h1>
          <h2 className="text-2xl font-medium text-white/90 animate-fade-in">
            One day at a time
          </h2>
        </div>
        
        <GlassCard className="max-w-md mx-auto" variant="primary" animate="pop">
          <p className="text-white text-lg mb-6 leading-relaxed">
            Solivrah helps you achieve personal growth through gamified quests, AI coaching, and community support.
          </p>
          <ul className="space-y-4 text-left mb-6">
            {[
              "Overcome challenges with personalized quests", 
              "Build lasting habits through gamification", 
              "Unlock your potential with AI guidance"
            ].map((item, i) => (
              <li key={i} className="flex items-center gap-3 animate-fade-in" style={{ animationDelay: `${i * 0.2}s` }}>
                <div className="p-1 rounded-full bg-primary/20 text-primary flex-shrink-0">
                  <FiCheckCircle className="text-lg" />
                </div>
                <span className="text-white">{item}</span>
              </li>
            ))}
          </ul>
        </GlassCard>
        
        <div className="flex flex-col w-full max-w-xs gap-4 mt-4">
          <button
            className="btn-primary py-4 flex items-center justify-center gap-2 shadow-lg text-lg font-medium interactive"
            onClick={() => navigate("/survey")}
          >
            Get Started <FiArrowRight />
          </button>
          
          <button
            className="btn-secondary flex items-center justify-center gap-2 interactive"
            onClick={() => navigate("/home")}
          >
            Continue as Guest
          </button>
        </div>
        
        <div className="text-muted-foreground text-sm mt-2 max-w-md animate-fade-in" style={{ animationDelay: "0.6s" }}>
          <p className="flex items-center justify-center gap-2 text-center">
            <FiShield className="text-muted-foreground" /> 
            Your data is safe with us. We only use it to personalize your experience.
          </p>
          <div className="mt-3 flex justify-center gap-6">
            <a href="#" className="text-primary hover:underline transition-all">Privacy Policy</a>
            <a href="#" className="text-primary hover:underline transition-all">Terms of Service</a>
          </div>
        </div>
      </div>
      
      <div className="text-muted-foreground text-sm text-center mt-8 z-10 animate-fade-in" style={{ animationDelay: "0.8s" }}>
        © 2025 Solivrah. All rights reserved.
      </div>
    </div>
  );
};

export default Index;
