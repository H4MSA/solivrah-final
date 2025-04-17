
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Logo } from "@/components/Logo";
import { FiArrowRight, FiShield, FiCheckCircle } from "react-icons/fi";
import { GlassCard } from "@/components/GlassCard";

const Feature = ({ icon, text }: { icon: React.ReactNode, text: string }) => (
  <div className="flex items-start gap-3 p-4 bg-black/40 backdrop-blur-md rounded-xl animate-pop-in border border-[#333333] hover:border-[#444444] transition-all duration-300 cursor-pointer">
    <div className="p-2 rounded-full bg-[#222222] text-white flex-shrink-0">
      {icon}
    </div>
    <p className="text-white text-sm">{text}</p>
  </div>
);

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
    <div className="min-h-screen flex flex-col justify-between p-6 bg-black overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-[#333333]/10 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-[#444444]/10 rounded-full blur-[100px]"></div>
      </div>
      
      <div className={`flex-1 flex flex-col justify-center items-center text-center space-y-8 transition-all duration-1000 z-10 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <Logo className="text-6xl mb-4 animate-float drop-shadow-lg" />
        
        <div className="space-y-3">
          <h1 className="text-5xl font-bold text-white animate-fade-in">
            Build better habits
          </h1>
          <h2 className="text-xl font-medium text-[#CCCCCC] animate-fade-in">
            One day at a time
          </h2>
        </div>
        
        <div className="space-y-6 w-full max-w-md mx-auto">
          <div className="space-y-4">
            <Feature 
              icon={<FiCheckCircle className="text-lg" />} 
              text="Overcome challenges with personalized quests" 
            />
            <Feature 
              icon={<FiCheckCircle className="text-lg" />} 
              text="Build lasting habits through gamification" 
            />
            <Feature 
              icon={<FiCheckCircle className="text-lg" />} 
              text="Unlock your potential with AI guidance" 
            />
          </div>
          
          <div className="flex flex-col w-full gap-4 mt-6">
            <button
              className="flex items-center justify-center gap-2 px-6 py-4 bg-white text-black rounded-xl font-semibold text-lg transition-all duration-300 hover:bg-[#EEEEEE] active:scale-[0.98] shadow-lg"
              onClick={() => navigate("/survey")}
            >
              Get Started <FiArrowRight />
            </button>
            
            <button
              className="flex items-center justify-center gap-2 px-6 py-3.5 bg-[#222222] text-white rounded-xl font-medium transition-all duration-300 hover:bg-[#333333] active:scale-[0.98] border border-[#333333]"
              onClick={() => navigate("/home")}
            >
              Continue as Guest
            </button>
          </div>
        </div>
        
        <div className="text-[#999999] text-sm mt-2 max-w-md animate-fade-in">
          <p className="flex items-center justify-center gap-2 text-center">
            <FiShield className="text-[#999999]" /> 
            Your data is safe with us. We only use it to personalize your experience.
          </p>
          <div className="mt-3 flex justify-center gap-6">
            <a href="#" className="text-white hover:underline transition-all">Privacy Policy</a>
            <a href="#" className="text-white hover:underline transition-all">Terms of Service</a>
          </div>
        </div>
      </div>
      
      <div className="text-[#999999] text-sm text-center mt-8 z-10 animate-fade-in">
        © 2025 Solivrah. All rights reserved.
      </div>
    </div>
  );
};

export default Index;
