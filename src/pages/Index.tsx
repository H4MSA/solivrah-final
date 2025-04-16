
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Logo } from "@/components/Logo";
import { FiArrowRight, FiShield } from "react-icons/fi";
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
    <div className="min-h-screen flex flex-col justify-between p-6 bg-gradient-to-b from-background to-background-end">
      <div className={`flex-1 flex flex-col justify-center items-center text-center space-y-6 transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
        <Logo className="text-6xl mb-6 animate-fade-in" />
        
        <h1 className="text-3xl font-bold text-gradient">
          Build better habits,<br />one day at a time
        </h1>
        
        <GlassCard className="max-w-md mx-auto">
          <p className="text-white text-lg">
            Solivrah helps you achieve personal growth through gamified quests, AI coaching, and community support. Overcome challenges, build habits, and unlock your potential!
          </p>
        </GlassCard>
        
        <div className="flex flex-col w-full max-w-xs gap-4 mt-8">
          <button
            className="btn-primary py-4 flex items-center justify-center gap-2"
            onClick={() => navigate("/survey")}
          >
            Get Started <FiArrowRight />
          </button>
          
          <button
            className="bg-secondary/40 text-white rounded-xl px-4 py-4 font-medium transition-all flex items-center justify-center gap-2"
            onClick={() => navigate("/home")}
          >
            Continue as Guest
          </button>
        </div>
        
        <div className="text-muted text-sm mt-6 max-w-md">
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
      
      <div className="text-muted text-sm text-center mt-8">
        © 2025 Solivrah. All rights reserved.
      </div>
    </div>
  );
};

export default Index;
