
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Logo } from "@/components/Logo";
import { FiArrowRight, FiShield, FiCheckCircle } from "react-icons/fi";
import { GlassCard } from "@/components/GlassCard";

const Index = () => {
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    // Simulate logo animation with a delay
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <div className="min-h-screen flex flex-col justify-between p-6 bg-gradient-to-b from-background to-background-end overflow-hidden">
      {/* Background effect */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-white/5 rounded-full blur-3xl"></div>
      </div>
      
      <div className={`flex-1 flex flex-col justify-center items-center text-center space-y-6 transition-opacity duration-500 z-10 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
        <Logo className="text-6xl mb-2 animate-float" />
        
        <h1 className="text-4xl font-bold text-gradient">
          Build better habits
        </h1>
        <h2 className="text-2xl font-medium text-white/80 -mt-3">
          One day at a time
        </h2>
        
        <GlassCard className="max-w-md mx-auto">
          <p className="text-white text-lg mb-4">
            Solivrah helps you achieve personal growth through gamified quests, AI coaching, and community support.
          </p>
          <ul className="space-y-2 text-left mb-4">
            {["Overcome challenges", "Build lasting habits", "Unlock your potential"].map((item, i) => (
              <li key={i} className="flex items-center">
                <FiCheckCircle className="text-primary mr-2 flex-shrink-0" />
                <span className="text-white">{item}</span>
              </li>
            ))}
          </ul>
        </GlassCard>
        
        <div className="flex flex-col w-full max-w-xs gap-4 mt-4">
          <button
            className="btn-primary py-4 flex items-center justify-center gap-2 shadow-lg"
            onClick={() => navigate("/survey")}
          >
            Get Started <FiArrowRight />
          </button>
          
          <button
            className="btn-secondary flex items-center justify-center gap-2"
            onClick={() => navigate("/home")}
          >
            Continue as Guest
          </button>
        </div>
        
        <div className="text-muted text-sm mt-2 max-w-md">
          <p className="flex items-center justify-center gap-2 text-center">
            <FiShield className="text-muted" /> 
            Your data is safe with us. We only use it to personalize your experience.
          </p>
          <div className="mt-2 flex justify-center gap-4">
            <a href="#" className="text-primary hover:underline">Privacy Policy</a>
            <a href="#" className="text-primary hover:underline">Terms of Service</a>
          </div>
        </div>
      </div>
      
      <div className="text-muted text-sm text-center mt-8 z-10">
        © 2025 Solivrah. All rights reserved.
      </div>
    </div>
  );
};

export default Index;
