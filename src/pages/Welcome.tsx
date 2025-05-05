
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Logo } from "@/components/Logo";
import { CheckCircle, ArrowRight, Shield, User, LogIn } from "lucide-react";
import { GlassButton } from "@/components/ui/glass";
import { useAuth } from "@/context/AuthContext";
import { AuthService } from "@/services/AuthService";
import { useToast } from "@/hooks/use-toast";

const Feature = ({
  icon,
  text,
  delay = 0
}: {
  icon: React.ReactNode;
  text: string;
  delay?: number;
}) => (
  <motion.div 
    className="flex items-start gap-3.5 p-4 bg-black/60 backdrop-blur-xl rounded-xl border border-white/10 hover:border-white/20 transition-all duration-300 transform-gpu hover:scale-[1.02] shadow-lg active:scale-[0.98] touch-manipulation mb-3" 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: delay + 0.4, duration: 0.6, type: "spring" }}
  >
    <div className="p-2 rounded-full bg-black/80 text-white flex-shrink-0 border border-white/10 shadow-md">
      {icon}
    </div>
    <p className="text-white text-sm leading-tight">{text}</p>
  </motion.div>
);

const Welcome = () => {
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoggingInAsGuest, setIsLoggingInAsGuest] = useState(false);
  const { isAuthenticated, hasCompletedOnboarding, isLoading, skipAuthentication } = useAuth();
  const { toast } = useToast();
  
  useEffect(() => {
    // If the auth check is complete and user is loading the welcome page
    if (!isLoading) {
      // If authenticated and has completed onboarding, redirect to home
      if (isAuthenticated && hasCompletedOnboarding) {
        navigate('/', { replace: true });
      } 
      // If authenticated but hasn't completed onboarding, redirect to survey
      else if (isAuthenticated && !hasCompletedOnboarding) {
        navigate('/survey', { replace: true });
      } 
      // Otherwise, stay on welcome page and show the animation
      else {
        const timer = setTimeout(() => {
          setIsLoaded(true);
        }, 800);
        return () => clearTimeout(timer);
      }
    }
  }, [isAuthenticated, hasCompletedOnboarding, isLoading, navigate]);

  const handleGuestLogin = async () => {
    setIsLoggingInAsGuest(true);
    try {
      const { user, session } = await AuthService.signInAsGuest();
      
      if (!user || !session) {
        throw new Error("Failed to create guest account");
      }
      
      navigate("/survey", { replace: true });
      toast({
        title: "Welcome!",
        description: "You're logged in as a guest. Enjoy exploring the app.",
      });
    } catch (error: any) {
      console.error("Guest login error:", error);
      toast({
        variant: "destructive",
        title: "Guest login failed",
        description: error.message || "Please try again or create an account.",
      });
    } finally {
      setIsLoggingInAsGuest(false);
    }
  };
  
  const handleSkipLogin = () => {
    skipAuthentication();
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between px-6 py-10 overflow-hidden">      
      <motion.div 
        className="flex-1 flex flex-col justify-center items-center text-center space-y-7 z-10"
        initial="hidden"
        animate={isLoaded ? "visible" : "hidden"}
        variants={containerVariants}
      >
        <motion.div variants={itemVariants}>
          <Logo className="mb-5 animate-float drop-shadow-lg" />
        </motion.div>
        
        <motion.div className="space-y-3" variants={itemVariants}>
          <h1 className="text-white font-medium text-sm tracking-wider">A QUICK START FOR A LIFE YOU WANT</h1>
        </motion.div>
        
        <motion.div className="space-y-6 w-full max-w-xs mx-auto" variants={itemVariants}>
          <div className="space-y-3.5">
            <Feature 
              icon={<CheckCircle size={18} />} 
              text="Overcome challenges with personalized quests" 
              delay={0.1}
            />
            <Feature 
              icon={<CheckCircle size={18} />} 
              text="Build lasting habits through gamification" 
              delay={0.2}
            />
            <Feature 
              icon={<CheckCircle size={18} />} 
              text="Unlock your potential with AI guidance" 
              delay={0.3}
            />
          </div>
          
          <div className="flex flex-col w-full gap-4 mt-6">
            <GlassButton
              variant="primary"
              size="lg"
              fullWidth
              className="rounded-xl font-semibold"
              onClick={handleSkipLogin}
              iconRight={<LogIn size={18} />}
            >
              Skip Login & Explore
            </GlassButton>
            
            <GlassButton
              variant="secondary"
              size="lg"
              fullWidth
              className="rounded-xl font-semibold"
              onClick={() => navigate("/auth")}
              iconRight={<ArrowRight size={18} />}
            >
              Create Account
            </GlassButton>
            
            <GlassButton
              variant="secondary"
              size="lg"
              fullWidth
              className="rounded-xl font-medium"
              onClick={() => navigate("/auth", { state: { initialTab: 'login' } })}
            >
              Sign In
            </GlassButton>

            <GlassButton
              variant="outline"
              size="lg"
              fullWidth
              className="rounded-xl font-medium mt-2"
              onClick={handleGuestLogin}
              loading={isLoggingInAsGuest}
              disabled={isLoggingInAsGuest}
              iconLeft={<User size={16} />}
            >
              Continue as Guest
            </GlassButton>
          </div>
        </motion.div>
        
        <motion.div 
          className="text-white/90 text-xs mt-3 max-w-md"
          variants={itemVariants}
        >
          <p className="flex items-center justify-center gap-2 text-center">
            <Shield size={14} className="text-white/80" /> 
            Your data is safe with us. We only use it to personalize your experience.
          </p>
          <div className="mt-3 flex justify-center gap-6">
            <a href="#" className="text-white hover:underline transition-all">Privacy Policy</a>
            <a href="#" className="text-white hover:underline transition-all">Terms of Service</a>
          </div>
        </motion.div>
      </motion.div>
      
      <motion.div 
        className="text-white/60 text-xs text-center mt-6 z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
      >
        © 2025 Solivrah. All rights reserved.
      </motion.div>
    </div>
  );
};

export default Welcome;
