
import React from "react";
import { motion } from "framer-motion";
import { Logo } from "./Logo";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export const WelcomeHero = () => {
  const navigate = useNavigate();
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };
  
  const buttonVariants = {
    rest: { scale: 1 },
    hover: { scale: 1.05 },
    tap: { scale: 0.95 }
  };
  
  const handleGetStarted = () => {
    navigate("/auth");
  };
  
  return (
    <motion.div
      className="min-h-screen flex flex-col items-center justify-center px-6 py-12 text-white"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div variants={itemVariants} className="mb-6">
        <Logo size="xl" className="mx-auto" />
      </motion.div>
      
      <motion.h1 
        variants={itemVariants}
        className="text-3xl font-bold mb-3 text-center text-gradient"
      >
        Welcome to Solivrah
      </motion.h1>
      
      <motion.p 
        variants={itemVariants}
        className="text-lg text-white/70 text-center max-w-xs mb-8"
      >
        Your personal development journey starts here
      </motion.p>
      
      <motion.div
        variants={itemVariants}
        className="w-full max-w-xs"
      >
        <motion.button
          variants={buttonVariants}
          initial="rest"
          whileHover="hover"
          whileTap="tap"
          className="w-full bg-white text-black py-3 px-6 rounded-xl font-medium flex items-center justify-center gap-2 shadow-lg"
          onClick={handleGetStarted}
        >
          Get Started
          <ArrowRight size={16} />
        </motion.button>
        
        <motion.button
          variants={buttonVariants}
          initial="rest"
          whileHover="hover"
          whileTap="tap"
          className="w-full mt-3 bg-transparent border border-white/20 text-white py-3 px-6 rounded-xl font-medium"
          onClick={() => navigate("/auth", { state: { guest: true } })}
        >
          Continue as Guest
        </motion.button>
      </motion.div>
      
      <motion.div
        variants={itemVariants}
        className="mt-12 flex gap-6"
      >
        <div className="text-center">
          <p className="text-2xl font-bold mb-1">30+</p>
          <p className="text-xs text-white/60">Daily Quests</p>
        </div>
        
        <div className="text-center">
          <p className="text-2xl font-bold mb-1">AI</p>
          <p className="text-xs text-white/60">Personalized Coach</p>
        </div>
        
        <div className="text-center">
          <p className="text-2xl font-bold mb-1">24/7</p>
          <p className="text-xs text-white/60">Progress Tracking</p>
        </div>
      </motion.div>
    </motion.div>
  );
};
