
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Logo } from "@/components/Logo";
import { CheckCircle, ArrowRight, Shield, User } from "lucide-react";

const Feature = ({
  icon,
  text
}: {
  icon: React.ReactNode;
  text: string;
}) => (
  <div className="flex items-start gap-3.5 p-4 bg-[#1A1A1A]/90 backdrop-blur-md rounded-xl animate-pop-in border border-white/10 hover:border-white/15 transition-all duration-300 transform-gpu hover:scale-[1.02] shadow-lg active:scale-[0.98] touch-manipulation mb-3" style={{
    transform: 'translateZ(4px)'
  }}>
    <div className="p-2 rounded-full bg-black/60 text-white flex-shrink-0 border border-white/10 shadow-md">
      {icon}
    </div>
    <p className="text-white text-sm leading-tight">{text}</p>
  </div>
);

const Index = () => {
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    // Simulate logo animation with a delay
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 800);
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <div className="min-h-screen flex flex-col justify-between px-6 py-10 overflow-hidden">      
      <div className={`flex-1 flex flex-col justify-center items-center text-center space-y-7 transition-all duration-1000 z-10 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <Logo className="mb-5 animate-float drop-shadow-lg" />
        
        <div className="space-y-3">
          <h1 className="text-2xl font-medium text-white animate-fade-in">A QUICK START FOR A LIFE YOU WANT</h1>
          <h2 className="text-lg font-medium text-[#E0E0E0] animate-fade-in">
            One day at a time
          </h2>
        </div>
        
        <div className="space-y-6 w-full max-w-xs mx-auto">
          <div className="space-y-3.5">
            <Feature icon={<CheckCircle size={18} />} text="Overcome challenges with personalized quests" />
            <Feature icon={<CheckCircle size={18} />} text="Build lasting habits through gamification" />
            <Feature icon={<CheckCircle size={18} />} text="Unlock your potential with AI guidance" />
          </div>
          
          <div className="flex flex-col w-full gap-4 mt-6">
            <button className="flex items-center justify-center gap-2 px-5 py-4 bg-white text-black rounded-xl font-semibold text-base transition-all duration-300 hover:bg-[#EEEEEE] active:scale-[0.98] shadow-lg animate-pop-in transform-gpu touch-manipulation" onClick={() => navigate("/auth")} style={{
              animationDelay: "0.3s",
              transform: 'translateZ(8px)'
            }}>
              Create Account <ArrowRight size={18} />
            </button>
            
            <button className="flex items-center justify-center gap-2 px-5 py-4 bg-transparent text-white rounded-xl font-medium transition-all duration-300 hover:bg-[#1A1A1A] active:scale-[0.98] border border-white/10 animate-pop-in transform-gpu touch-manipulation" onClick={() => navigate("/auth")} style={{
              animationDelay: "0.5s",
              transform: 'translateZ(4px)'
            }}>
              <User size={18} /> Sign In
            </button>
          </div>
        </div>
        
        <div className="text-[#E0E0E0] text-xs mt-3 max-w-md animate-fade-in">
          <p className="flex items-center justify-center gap-2 text-center">
            <Shield size={14} className="text-[#E0E0E0]" /> 
            Your data is safe with us. We only use it to personalize your experience.
          </p>
          <div className="mt-3 flex justify-center gap-6">
            <a href="#" className="text-white hover:underline transition-all">Privacy Policy</a>
            <a href="#" className="text-white hover:underline transition-all">Terms of Service</a>
          </div>
        </div>
      </div>
      
      <div className="text-[#999999] text-xs text-center mt-6 z-10 animate-fade-in">
        © 2025 Solivrah. All rights reserved.
      </div>
    </div>
  );
};

export default Index;
