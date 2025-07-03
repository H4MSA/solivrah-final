
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthService } from "@/services/AuthService";
import { Logo } from "@/components/Logo";
import { useApp } from "@/context/AppContext";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Mail, Lock, AlertCircle, ArrowRight } from "lucide-react";
import { ThemeBackground } from "@/components/ThemeBackground";
import { GlassCard } from "@/components/GlassCard";

const Auth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { setIsGuest } = useApp();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get the redirect URL from state, or default to "/home"
  const returnUrl = location.state?.returnUrl || "/home";

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isSignup) {
        const { data, error } = await AuthService.signUp(email, password);

        if (error) {
          throw error;
        }

        toast({
          title: "Account created!",
          description: "Check your email for the confirmation link.",
        });

        // Auto-login if email confirmation is disabled
        if (data.user && !data.user.email_confirmed_at) {
          navigate("/home");
        }

      } else {
        const { data, error } = await AuthService.signIn(email, password);

        if (error) {
          throw error;
        }

        navigate(returnUrl);
      }
    } catch (error: any) {
      setError(error.message || "An error occurred");
      toast({
        title: "Authentication error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogin = () => {
    setIsGuest(true);
    // Redirect to survey page for guest users to generate 30-day plan
    navigate("/survey");
  };

  // Animation variants
  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    },
    exit: { 
      opacity: 0,
      y: -20,
      transition: { duration: 0.2 }
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0A0A0A] px-6 py-12 relative overflow-hidden">
      <ThemeBackground />
      
      {/* Animated background elements */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <motion.div 
          className="bubble w-32 h-32 top-[10%] left-[10%]"
          animate={{ 
            x: [0, 20, 0], 
            y: [0, -30, 0],
            opacity: [0.05, 0.08, 0.05]
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 15,
            ease: "easeInOut" 
          }}
        />
        <motion.div 
          className="bubble w-64 h-64 bottom-[10%] right-[5%]"
          animate={{ 
            x: [0, -30, 0], 
            y: [0, 20, 0],
            opacity: [0.03, 0.06, 0.03]
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 20,
            ease: "easeInOut",
            delay: 2
          }}
        />
      </div>
      
      <motion.div 
        className="w-full max-w-sm space-y-6 relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col items-center justify-center">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Logo className="h-28 w-auto mb-6" />
          </motion.div>
          
          <motion.h2 
            className="mb-2 text-center text-2xl font-bold text-white"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {isSignup ? "Create your account" : "Sign in to your account"}
          </motion.h2>
          
          <motion.p 
            className="text-center text-sm text-white/70 max-w-[280px]"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            {isSignup 
              ? "Join our community and start your journey towards your goals" 
              : "Welcome back! Sign in to continue your journey"}
          </motion.p>
        </div>

        <AnimatePresence mode="wait">
          {error && (
            <motion.div 
              className="rounded-lg bg-red-900/20 border border-red-500/20 p-3 text-sm text-red-400 relative pl-10"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, height: 0, marginTop: 0, marginBottom: 0 }}
              transition={{ duration: 0.3 }}
            >
              <AlertCircle className="absolute left-3 top-3 h-4 w-4 text-red-400" />
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <GlassCard 
          variant="ultra-glass" 
          className="p-6"
          animate="fade"
        >
          <AnimatePresence mode="wait">
            <motion.form 
              key={isSignup ? "signup" : "signin"}
              className="space-y-5" 
              onSubmit={handleAuth}
              variants={formVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-white/80 mb-2">
                  Email address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-5 w-5 text-white/50" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 bg-black/40 border border-white/10 text-white focus:border-white/20 focus:ring-white/10"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-white/80 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-5 w-5 text-white/50" />
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete={isSignup ? "new-password" : "current-password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 bg-black/40 border border-white/10 text-white focus:border-white/20 focus:ring-white/10"
                    placeholder="••••••••••••"
                  />
                </div>
              </div>

              <div>
                <motion.button
                  type="submit"
                  whileTap={{ scale: 0.97 }}
                  whileHover={{ y: -2, boxShadow: "0 10px 20px rgba(0,0,0,0.2)" }}
                  className="group relative flex w-full justify-center rounded-xl bg-[#222222] px-4 py-3.5 text-white font-medium transition-all hover:bg-[#333333] active:scale-[0.98] shadow-lg border border-white/10"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center">
                      {isSignup ? "Create Account" : "Sign In"}
                      <motion.div
                        animate={{ x: [0, 5, 0] }}
                        transition={{ 
                          repeat: Infinity, 
                          repeatType: "loop", 
                          duration: 1.5, 
                          repeatDelay: 2 
                        }}
                      >
                        <ArrowRight className="ml-1.5 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </motion.div>
                    </span>
                  )}
                </motion.button>
              </div>
            </motion.form>
          </AnimatePresence>
        </GlassCard>

        <div className="flex items-center">
          <div className="h-px flex-1 bg-white/10"></div>
          <p className="mx-4 text-sm text-white/50">or</p>
          <div className="h-px flex-1 bg-white/10"></div>
        </div>

        <div className="flex items-center justify-center">
          <motion.button
            type="button"
            whileHover={{ backgroundColor: "rgba(255,255,255,0.1)" }}
            whileTap={{ scale: 0.97 }}
            className="text-sm text-white/60 px-4 py-2 rounded-lg transition-colors"
            onClick={handleGuestLogin}
          >
            Continue as Guest
          </motion.button>
        </div>

        <div className="text-center mt-6">
          <motion.button
            whileHover={{ color: "rgba(255,255,255,1)" }}
            whileTap={{ scale: 0.97 }}
            className="text-sm text-white/60 hover:text-white transition-colors"
            onClick={() => setIsSignup(!isSignup)}
          >
            {isSignup ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
          </motion.button>
        </div>
        
        <motion.div 
          className="text-white/50 text-[10px] text-center mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          © 2025 Solivrah. All rights reserved.
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Auth;
