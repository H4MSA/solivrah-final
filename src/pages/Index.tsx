
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Logo } from "@/components/Logo";
import { CheckCircle, User, Shield } from "lucide-react";

const Feature = ({ text }: { text: string }) => (
  <div className="flex items-center gap-3 p-4 bg-[#1A1A1A]/90 backdrop-blur-md rounded-xl border border-white/10 mb-3">
    <div className="p-2 rounded-full bg-black/60 border border-white/10">
      <CheckCircle size={18} />
    </div>
    <p className="text-white text-sm">{text}</p>
  </div>
);

const Index = () => {
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex flex-col justify-between px-6 py-10 bg-black">
      <div className={`flex-1 flex flex-col justify-center items-center text-center space-y-7 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <Logo className="mb-5 animate-float" />
        
        <div className="mb-2">
          <h1 className="text-white text-sm font-medium mb-1">A QUICK START FOR A LIFE YOU WANT</h1>
          <h2 className="text-white/70 text-lg">One day at a time</h2>
        </div>
        
        <div className="w-full max-w-xs mx-auto space-y-6">
          <div>
            <Feature text="Overcome challenges with personalized quests" />
            <Feature text="Build lasting habits through gamification" />
            <Feature text="Unlock your potential with AI guidance" />
          </div>
          
          <div className="flex flex-col gap-3">
            <button 
              className="w-full px-5 py-4 bg-white text-black rounded-xl font-semibold flex items-center justify-center gap-2"
              onClick={() => navigate("/auth")}
            >
              Create Account
            </button>
            
            <button 
              className="w-full px-5 py-4 bg-black text-white rounded-xl font-medium border border-white/10 flex items-center justify-center gap-2"
              onClick={() => navigate("/auth")}
            >
              <User size={18} /> Sign In
            </button>
          </div>
        </div>
        
        <div className="text-[#E0E0E0] text-xs max-w-md">
          <p className="flex items-center justify-center gap-2">
            <Shield size={14} /> 
            Your data is safe with us. We only use it to personalize your experience.
          </p>
          <div className="mt-3 flex justify-center gap-6">
            <a href="#" className="text-white/70 hover:text-white">Privacy Policy</a>
            <a href="#" className="text-white/70 hover:text-white">Terms of Service</a>
          </div>
        </div>
      </div>
      
      <div className="text-[#999999] text-xs text-center">
        © 2025 Solivrah. All rights reserved.
      </div>
    </div>
  );
};

export default Index;
