
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Logo } from "@/components/Logo";
import { useApp } from "@/context/AppContext";
import { motion } from "framer-motion";
import { ThemeBackground } from "@/components/ThemeBackground";
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
      <ThemeBackground />
      
      <div className={`flex-1 flex flex-col justify-center items-center text-center space-y-6 transition-all duration-1000 z-10 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <Logo className="mb-10" size="lg" />
        
        <motion.div 
          className="w-full max-w-[292px] mx-auto space-y-4"
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
          initial="hidden"
          animate={isLoaded ? "show" : "hidden"}
        >
          {/* First row */}
          <motion.div 
            className="flex gap-3"
            variants={{
              hidden: { opacity: 0, y: 20 },
              show: { opacity: 1, y: 0 }
            }}
          >
            <IconButton icon={<TriangleIcon />} small />
            <IconButton icon={<PersonIcon />} small />
            <IconButton icon={<CircleIcon />} small />
          </motion.div>
          
          {/* Second row */}
          <motion.div 
            className="flex gap-3"
            variants={{
              hidden: { opacity: 0, y: 20 },
              show: { opacity: 1, y: 0 }
            }}
          >
            <IconButton icon={<TargetIcon />} small />
            <IconButton icon={<SliderIcon />} className="flex-1" />
            <IconButton icon={<SunIcon />} small />
          </motion.div>
          
          {/* Third row */}
          <motion.div 
            className="flex gap-3"
            variants={{
              hidden: { opacity: 0, y: 20 },
              show: { opacity: 1, y: 0 }
            }}
          >
            <IconButton icon={<ToggleIcon />} className="flex-1" />
            <IconButton icon={<CloudIcon />} small />
            <IconButton icon={<HeartIcon />} small />
          </motion.div>
          
          {/* Fourth row */}
          <motion.div 
            className="flex gap-3"
            variants={{
              hidden: { opacity: 0, y: 20 },
              show: { opacity: 1, y: 0 }
            }}
          >
            <IconButton icon={<DiamondIcon />} small />
            <IconButton icon={<GridIcon />} small />
            <IconButton icon={<LineIcon />} small />
            <IconButton icon={<CircleTargetIcon />} small />
          </motion.div>
        </motion.div>
        
        <motion.div 
          className="flex flex-col w-full gap-4 mt-4 max-w-[292px]"
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1,
                delayChildren: 0.3
              }
            }
          }}
          initial="hidden"
          animate={isLoaded ? "show" : "hidden"}
        >
          <motion.button 
            className="group flex items-center justify-center gap-1 px-5 py-4 bg-white text-black rounded-xl font-medium text-sm transition-all duration-300 hover:bg-[#EEEEEE] shadow-lg hover:shadow-xl"
            onClick={() => navigate("/auth")}
            variants={{
              hidden: { opacity: 0, y: 20 },
              show: { opacity: 1, y: 0 }
            }}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
          >
            Create Account 
            <span className="ml-1 group-hover:translate-x-0.5 transition-transform">›</span>
          </motion.button>
          
          <motion.button 
            className="flex items-center justify-center gap-1 px-5 py-4 bg-[#1A1A1A] text-white rounded-xl font-medium transition-all duration-300 border border-white/10 hover:bg-[#222222] shadow-md hover:shadow-lg"
            onClick={() => navigate("/auth")}
            variants={{
              hidden: { opacity: 0, y: 20 },
              show: { opacity: 1, y: 0 }
            }}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
          >
            Sign In
          </motion.button>
          
          <motion.button
            className="mt-2 text-sm text-white/70 hover:text-white transition-colors"
            onClick={handleGuestLogin}
            variants={{
              hidden: { opacity: 0 },
              show: { opacity: 1 }
            }}
          >
            Continue as Guest
          </motion.button>
        </motion.div>
        
        <motion.div 
          className="text-white/70 text-[10px] mt-3 max-w-md"
          variants={{
            hidden: { opacity: 0 },
            show: { 
              opacity: 1,
              transition: { delay: 0.6 }
            }
          }}
          initial="hidden"
          animate={isLoaded ? "show" : "hidden"}
        >
          <p className="flex items-center justify-center gap-2 text-center">
            Your data is safe with us. We only use it to personalize your experience.
          </p>
          <div className="mt-3 flex justify-center gap-6">
            <a href="#" className="text-white/70 hover:text-white hover:underline transition-all">Privacy Policy</a>
            <a href="#" className="text-white/70 hover:text-white hover:underline transition-all">Terms of Service</a>
          </div>
        </motion.div>
      </div>
      
      <motion.div 
        className="text-[#666666] text-[10px] text-center mt-6 z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoaded ? 1 : 0 }}
        transition={{ delay: 0.8 }}
      >
        © 2025 Solivrah. All rights reserved.
      </motion.div>
    </div>
  );
};

export default Index;
