
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Logo } from "@/components/Logo";
import { useApp } from "@/context/AppContext";
import { motion } from "framer-motion";
import { 
  TriangleIcon,
  PersonIcon,
  CircleIcon,
  TargetIcon,
  SliderIcon,
  SunIcon,
  ToggleIcon,
  CloudIcon,
  HeartIcon,
  DiamondIcon,
  GridIcon,
  LineIcon,
  CircleTargetIcon,
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
    <div className="min-h-screen flex flex-col justify-between px-5 py-10 overflow-hidden max-w-[430px] mx-auto">      
      <div className={`flex-1 flex flex-col justify-center items-center text-center space-y-6 transition-all duration-1000 z-10 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <Logo className="mb-10" />
        
        <div className="w-full max-w-[292px] mx-auto space-y-4">
          {/* First row */}
          <div className="flex gap-3">
            <IconButton icon={<TriangleIcon />} small />
            <IconButton icon={<PersonIcon />} small />
            <IconButton icon={<CircleIcon />} small />
          </div>
          
          {/* Second row */}
          <div className="flex gap-3">
            <IconButton icon={<TargetIcon />} small />
            <IconButton icon={<SliderIcon />} className="flex-1" />
            <IconButton icon={<SunIcon />} small />
          </div>
          
          {/* Third row */}
          <div className="flex gap-3">
            <IconButton icon={<ToggleIcon />} className="flex-1" />
            <IconButton icon={<CloudIcon />} small />
            <IconButton icon={<HeartIcon />} small />
          </div>
          
          {/* Fourth row */}
          <div className="flex gap-3">
            <IconButton icon={<DiamondIcon />} small />
            <IconButton icon={<GridIcon />} small />
            <IconButton icon={<LineIcon />} small />
            <IconButton icon={<CircleTargetIcon />} small />
          </div>
        </div>
        
        <div className="flex flex-col w-full gap-4 mt-4 max-w-[292px]">
          <motion.button 
            className="flex items-center justify-center gap-1 px-5 py-4 bg-white text-black rounded-xl font-medium text-sm transition-all duration-300 hover:bg-[#EEEEEE] active:scale-[0.98]"
            onClick={() => navigate("/auth")}
            whileTap={{ scale: 0.97 }}
          >
            Create Account <span className="ml-1">›</span>
          </motion.button>
          
          <motion.button 
            className="flex items-center justify-center gap-1 px-5 py-4 bg-[#1A1A1A] text-white rounded-xl font-medium transition-all duration-300 border border-[#333333] hover:bg-[#222222] active:scale-[0.98]"
            onClick={() => navigate("/auth")}
            whileTap={{ scale: 0.97 }}
          >
            Sign In
          </motion.button>
        </div>
        
        <div className="text-white/70 text-[9px] mt-3 max-w-md">
          <p className="flex items-center justify-center gap-2 text-center">
            Your data is safe with us. We only use it to personalize your experience.
          </p>
          <div className="mt-3 flex justify-center gap-6">
            <a href="#" className="text-white hover:underline transition-all">Privacy Policy</a>
            <a href="#" className="text-white hover:underline transition-all">Terms of Service</a>
          </div>
        </div>
      </div>
      
      <div className="text-[#666666] text-[9px] text-center mt-6 z-10">
        © 2025 Solivrah. All rights reserved.
      </div>
    </div>
  );
};

export default Index;
