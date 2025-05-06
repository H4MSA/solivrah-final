
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Logo } from "@/components/Logo";
import { useApp } from "@/context/AppContext";
import { motion } from "framer-motion";
import { 
  PartyIcon, 
  MeditationIcon, 
  MindIcon, 
  TargetIcon, 
  SliderIcon, 
  IdeaIcon,
  ToggleIcon,
  BrainIcon,
  HeartIcon,
  SparkleIcon,
  AwardIcon,
  StairsIcon,
  SmileIcon,
  IconButton
} from "@/components/SolivrahIcons";

const Index = () => {
  const navigate = useNavigate();
  const { setIsGuest } = useApp();
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    // Simulate logo animation with a delay
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 800);
    return () => clearTimeout(timer);
  }, []);
  
  const handleGuestLogin = () => {
    setIsGuest(true);
    navigate("/home");
  };
  
  return (
    <div className="min-h-screen flex flex-col justify-between px-5 py-10 overflow-hidden max-w-[480px] mx-auto">      
      <div className={`flex-1 flex flex-col justify-center items-center text-center space-y-6 transition-all duration-1000 z-10 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <Logo className="mb-8 animate-pulse-soft" />
        
        <div className="w-full max-w-[292px] mx-auto space-y-3">
          {/* First row */}
          <div className="flex gap-3">
            <IconButton icon={<PartyIcon />} small />
            <IconButton icon={<MeditationIcon />} small />
            <IconButton icon={<MindIcon />} className="flex-1" />
          </div>
          
          {/* Second row */}
          <div className="flex gap-3">
            <IconButton icon={<TargetIcon />} small />
            <IconButton icon={<SliderIcon />} className="flex-1" />
            <IconButton icon={<IdeaIcon />} small />
          </div>
          
          {/* Third row */}
          <div className="flex gap-3">
            <IconButton icon={<ToggleIcon />} className="flex-1" />
            <IconButton icon={<BrainIcon />} small />
            <IconButton icon={<HeartIcon />} small />
          </div>
          
          {/* Fourth row */}
          <div className="flex gap-3">
            <IconButton icon={<SparkleIcon />} small dark />
            <IconButton icon={<AwardIcon />} small dark />
            <IconButton icon={<StairsIcon />} small dark />
            <IconButton icon={<SmileIcon />} small dark />
          </div>
        </div>
        
        <div className="flex flex-col w-full gap-4 mt-6 max-w-[292px]">
          <motion.button 
            className="flex items-center justify-center gap-1 px-5 py-4 bg-white text-black rounded-xl font-semibold text-[13px] transition-all duration-300 hover:bg-[#EEEEEE] active:scale-[0.98] shadow-lg animate-pop-in transform-gpu touch-manipulation"
            onClick={() => navigate("/auth")}
            whileTap={{ scale: 0.97 }}
            style={{ animationDelay: "0.3s" }}
          >
            Create Account <span className="ml-1">›</span>
          </motion.button>
          
          <motion.button 
            className="flex items-center justify-center gap-1 px-5 py-4 bg-transparent text-white rounded-xl font-medium transition-all duration-300 hover:bg-[#1A1A1A] active:scale-[0.98] border border-white/10 animate-pop-in transform-gpu touch-manipulation"
            onClick={() => navigate("/auth")}
            whileTap={{ scale: 0.97 }}
            style={{ animationDelay: "0.4s" }}
          >
            Sign In
          </motion.button>
          
          <motion.button 
            className="flex items-center justify-center gap-1 px-5 py-4 bg-transparent text-[#999999] rounded-xl font-normal transition-all duration-300 hover:bg-[#1A1A1A] active:scale-[0.98] animate-pop-in transform-gpu touch-manipulation text-[13px]"
            onClick={handleGuestLogin}
            whileTap={{ scale: 0.97 }}
            style={{ animationDelay: "0.5s" }}
          >
            Continue as Guest
          </motion.button>
        </div>
        
        <div className="text-[#E0E0E0] text-[9px] mt-3 max-w-md animate-fade-in">
          <p className="flex items-center justify-center gap-2 text-center">
            Your data is safe with us. We only use it to personalize your experience.
          </p>
          <div className="mt-3 flex justify-center gap-6">
            <a href="#" className="text-white hover:underline transition-all">Privacy Policy</a>
            <a href="#" className="text-white hover:underline transition-all">Terms of Service</a>
          </div>
        </div>
      </div>
      
      <div className="text-[#999999] text-[9px] text-center mt-6 z-10 animate-fade-in">
        © 2025 Solivrah. All rights reserved.
      </div>
    </div>
  );
};

export default Index;
