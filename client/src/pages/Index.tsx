import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Logo } from "@/components/common/Logo";
import { useApp } from "@/context/AppContext";
import { motion } from "framer-motion";

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
  
  // Custom icon components based on the design references
  const IconButton = ({ children, className = "", small = false }) => (
    <motion.div 
      className={`flex items-center justify-center bg-[#1A1A1A] border border-[#333333] rounded-2xl ${small ? 'w-16 h-16' : 'flex-1 h-16'} ${className}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {children}
    </motion.div>
  );
  
  return (
    <div className="min-h-screen flex flex-col justify-between px-6 py-10 overflow-hidden max-w-[430px] mx-auto">
      
      {/* Main content */}
      <div className={`flex-1 flex flex-col justify-center items-center text-center space-y-6 transition-all duration-1000 z-10 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <Logo size="lg" className="mb-10" />
        
        <motion.div 
          className="w-full max-w-[340px] mx-auto space-y-4"
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
            <IconButton small>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 22L2 7L12 2L22 7L12 22Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </IconButton>
            <IconButton small>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 12C14.2091 12 16 10.2091 16 8C16 5.79086 14.2091 4 12 4C9.79086 4 8 5.79086 8 8C8 10.2091 9.79086 12 12 12Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M18 20C18 16.6863 15.3137 14 12 14C8.68629 14 6 16.6863 6 20" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </IconButton>
            <IconButton small>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="1.5"/>
              </svg>
            </IconButton>
          </motion.div>
          
          {/* Second row */}
          <motion.div 
            className="flex gap-3"
            variants={{
              hidden: { opacity: 0, y: 20 },
              show: { opacity: 1, y: 0 }
            }}
          >
            <IconButton small>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="1.5"/>
                <circle cx="12" cy="12" r="5" stroke="white" strokeWidth="1.5"/>
                <path d="M12 2V4" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M12 20V22" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M2 12H4" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M20 12H22" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </IconButton>
            <IconButton className="flex-1">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 6H20" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M6 12H18" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M8 18H16" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </IconButton>
            <IconButton small>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="5" stroke="white" strokeWidth="1.5"/>
                <path d="M12 4V2" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M12 22V20" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M4.92993 4.92999L6.33993 6.33999" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M17.6599 17.66L19.0699 19.07" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M2 12H4" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M20 12H22" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M4.92993 19.07L6.33993 17.66" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M17.6599 6.33999L19.0699 4.92999" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </IconButton>
          </motion.div>
          
          {/* Third row */}
          <motion.div 
            className="flex gap-3"
            variants={{
              hidden: { opacity: 0, y: 20 },
              show: { opacity: 1, y: 0 }
            }}
          >
            <IconButton className="flex-1">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="4" y="6" width="16" height="12" rx="6" stroke="white" strokeWidth="1.5"/>
                <circle cx="7" cy="12" r="2" fill="white"/>
              </svg>
            </IconButton>
            <IconButton small>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M17 7L12 12M12 12L7 17M12 12L7 7M12 12L17 17" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </IconButton>
            <IconButton small>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 21.35L10.55 20.03C5.4 15.36 2 12.27 2 8.5C2 5.41 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.08C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.41 22 8.5C22 12.27 18.6 15.36 13.45 20.03L12 21.35Z" stroke="white" strokeWidth="1.5"/>
              </svg>
            </IconButton>
          </motion.div>
          
          {/* Fourth row */}
          <motion.div 
            className="flex gap-3"
            variants={{
              hidden: { opacity: 0, y: 20 },
              show: { opacity: 1, y: 0 }
            }}
          >
            <IconButton small>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L20 8.5L12 15L4 8.5L12 2Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M20 15L12 21.5L4 15" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </IconButton>
            <IconButton small>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="4" y="4" width="7" height="7" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <rect x="13" y="4" width="7" height="7" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <rect x="4" y="13" width="7" height="7" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <rect x="13" y="13" width="7" height="7" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </IconButton>
            <IconButton small>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 12H19" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </IconButton>
            <IconButton small>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="1.5"/>
                <path d="M12 8L12 16" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M16 12L8 12" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </IconButton>
          </motion.div>
        </motion.div>
        
        <motion.div 
          className="flex flex-col w-full gap-4 mt-6 max-w-[340px]"
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
            className="group flex items-center justify-center gap-1 px-5 py-4 bg-white text-black rounded-xl font-medium transition-all duration-300 hover:bg-[#EEEEEE] shadow-lg hover:shadow-xl"
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
          className="text-white/70 text-xs mt-3 max-w-md"
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
        className="text-[#666666] text-xs text-center mt-6 z-10"
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
