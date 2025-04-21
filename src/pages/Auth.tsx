
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Eye, EyeOff, Mail, Lock, User, Loader2, AlertCircle, CheckCircle, Github } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Logo } from "@/components/Logo";
import { GlassCard } from "@/components/GlassCard";
import { AuthService } from "@/services/AuthService";
import { useApp } from "@/context/AppContext";
import { FaGoogle, FaApple, FaDiscord, FaFacebookF } from "react-icons/fa";
import { useToast } from "@/hooks/use-toast";

type AuthMode = "sign-in" | "sign-up" | "forgot-password";

const Auth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, setUser } = useApp();
  const [mode, setMode] = useState<AuthMode>("sign-in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  
  useEffect(() => {
    // If user is already logged in, redirect to home
    if (user) {
      navigate("/home");
    }
    
    // Check for existing session
    const checkSession = async () => {
      try {
        const session = await AuthService.getCurrentSession();
        if (session) {
          setUser(session.user);
          navigate("/home");
        }
      } catch (error) {
        console.error("Session check error:", error);
      }
    };
    
    checkSession();
  }, [user, navigate, setUser]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setIsLoading(true);
    
    try {
      if (mode === "sign-in") {
        await AuthService.signIn({ email, password });
        toast({
          title: "Success!",
          description: "You have been signed in.",
          variant: "default",
        });
        navigate("/home");
      } else if (mode === "sign-up") {
        await AuthService.signUp({ email, password, username });
        setSuccessMessage("Account created successfully! Please check your email for verification.");
        toast({
          title: "Account created!",
          description: "Please check your email for verification.",
          variant: "default",
        });
        setTimeout(() => {
          setMode("sign-in");
        }, 3000);
      } else if (mode === "forgot-password") {
        await AuthService.resetPassword(email);
        setSuccessMessage("Password reset link sent to your email!");
        toast({
          title: "Reset link sent!",
          description: "Check your email for instructions.",
          variant: "default",
        });
      }
    } catch (error) {
      console.error("Auth error:", error);
      if (error instanceof Error) {
        setError(error.message);
        toast({
          title: "Authentication error",
          description: error.message,
          variant: "destructive",
        });
      } else {
        setError("An error occurred during authentication.");
        toast({
          title: "Authentication error",
          description: "An unexpected error occurred. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleOAuthSignIn = async (provider: 'google' | 'facebook' | 'apple' | 'discord' | 'github') => {
    setError("");
    setIsLoading(true);
    
    try {
      await AuthService.signInWithOAuth(provider);
      // The redirect will happen automatically
    } catch (error) {
      console.error(`${provider} sign-in error:`, error);
      if (error instanceof Error) {
        setError(error.message);
        toast({
          title: "Authentication error",
          description: error.message,
          variant: "destructive",
        });
      } else {
        setError(`An error occurred during ${provider} sign-in.`);
        toast({
          title: "Authentication error",
          description: `An unexpected error occurred with ${provider} sign-in. Please try again.`,
          variant: "destructive",
        });
      }
      setIsLoading(false);
    }
  };
  
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  
  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };
  
  return (
    <div className="min-h-screen flex flex-col justify-between px-6 py-6 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="absolute top-0 right-0 w-[300px] h-[300px] bg-[#333333]/10 rounded-full blur-[100px]"
        ></motion.div>
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-[#444444]/10 rounded-full blur-[100px]"
        ></motion.div>
      </div>
      
      <div className="flex-1 flex flex-col w-full max-w-md mx-auto z-10">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center mb-6"
        >
          <button 
            onClick={() => navigate("/")}
            className="p-2 rounded-full bg-[#111111]/80 border border-white/5 hover:bg-[#222222]/80 transition-all"
          >
            <ArrowLeft size={20} className="text-white" />
          </button>
          <Logo className="mx-auto" />
        </motion.div>
        
        <GlassCard variant="dark" className="w-full mb-4 rounded-xl">
          <AnimatePresence mode="wait">
            <motion.div 
              key={mode}
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={formVariants}
              className="space-y-6"
            >
              <motion.div variants={itemVariants} className="text-center">
                <h1 className="text-xl font-bold text-white">
                  {mode === "sign-in" ? "Welcome Back" : mode === "sign-up" ? "Create Account" : "Reset Password"}
                </h1>
                <p className="text-[#999999] text-sm mt-1">
                  {mode === "sign-in" 
                    ? "Sign in to continue to your account" 
                    : mode === "sign-up" 
                    ? "Join Solivrah and start your journey" 
                    : "Enter your email to receive a reset link"}
                </p>
              </motion.div>
              
              {/* Form */}
              <motion.form onSubmit={handleSubmit} className="space-y-4">
                {mode === "sign-up" && (
                  <motion.div variants={itemVariants} className="space-y-2">
                    <label htmlFor="username" className="text-sm text-[#E0E0E0] font-medium">Username</label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#999999]">
                        <User size={18} />
                      </div>
                      <input 
                        id="username"
                        type="text" 
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full bg-[#111111] border border-[#333333] rounded-xl py-3 pl-10 pr-4 text-white placeholder:text-[#777777] focus:outline-none focus:border-[#444444] transition-all"
                        placeholder="Your username"
                      />
                    </div>
                  </motion.div>
                )}
                
                <motion.div variants={itemVariants} className="space-y-2">
                  <label htmlFor="email" className="text-sm text-[#E0E0E0] font-medium">Email</label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#999999]">
                      <Mail size={18} />
                    </div>
                    <input 
                      id="email"
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-[#111111] border border-[#333333] rounded-xl py-3 pl-10 pr-4 text-white placeholder:text-[#777777] focus:outline-none focus:border-[#444444] transition-all"
                      placeholder="your.email@example.com"
                    />
                  </div>
                </motion.div>
                
                {mode !== "forgot-password" && (
                  <motion.div variants={itemVariants} className="space-y-2">
                    <div className="flex justify-between">
                      <label htmlFor="password" className="text-sm text-[#E0E0E0] font-medium">Password</label>
                      {mode === "sign-in" && (
                        <button 
                          type="button"
                          onClick={() => setMode("forgot-password")}
                          className="text-xs text-[#999999] hover:text-white transition-colors"
                        >
                          Forgot password?
                        </button>
                      )}
                    </div>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#999999]">
                        <Lock size={18} />
                      </div>
                      <input 
                        id="password"
                        type={showPassword ? "text" : "password"} 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-[#111111] border border-[#333333] rounded-xl py-3 pl-10 pr-10 text-white placeholder:text-[#777777] focus:outline-none focus:border-[#444444] transition-all"
                        placeholder="••••••••"
                      />
                      <button 
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#999999] hover:text-white transition-colors"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </motion.div>
                )}
                
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-3 bg-red-900/20 border border-red-500/20 rounded-lg text-red-400 text-sm"
                  >
                    <div className="flex items-start gap-2">
                      <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
                      <span>{error}</span>
                    </div>
                  </motion.div>
                )}
                
                {successMessage && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-3 bg-green-900/20 border border-green-500/20 rounded-lg text-green-400 text-sm"
                  >
                    <div className="flex items-start gap-2">
                      <CheckCircle size={16} className="flex-shrink-0 mt-0.5" />
                      <span>{successMessage}</span>
                    </div>
                  </motion.div>
                )}
                
                <motion.button 
                  variants={itemVariants}
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 bg-white text-black rounded-xl font-medium flex items-center justify-center transition-all hover:bg-[#EEEEEE] hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isLoading ? (
                    <Loader2 size={20} className="animate-spin" />
                  ) : (
                    mode === "sign-in" ? "Sign In" : mode === "sign-up" ? "Create Account" : "Send Reset Link"
                  )}
                </motion.button>
              </motion.form>
              
              {mode !== "forgot-password" && (
                <motion.div variants={itemVariants} className="relative flex items-center justify-center">
                  <div className="absolute left-0 right-0 h-px bg-[#333333]"></div>
                  <span className="px-4 bg-[#121212] text-[#777777] text-xs relative z-10">OR</span>
                </motion.div>
              )}
              
              {mode !== "forgot-password" && (
                <motion.div variants={itemVariants} className="grid grid-cols-2 gap-3">
                  <motion.button
                    type="button"
                    onClick={() => handleOAuthSignIn('google')}
                    className="flex items-center justify-center gap-2 py-2.5 bg-[#111111] text-white rounded-lg border border-[#333333] transition-all hover:bg-[#1A1A1A] hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none"
                    disabled={isLoading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <FaGoogle size={16} className="text-[#EA4335]" />
                    <span className="text-sm">Google</span>
                  </motion.button>
                  
                  <motion.button
                    type="button"
                    onClick={() => handleOAuthSignIn('facebook')}
                    className="flex items-center justify-center gap-2 py-2.5 bg-[#111111] text-white rounded-lg border border-[#333333] transition-all hover:bg-[#1A1A1A] hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none"
                    disabled={isLoading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <FaFacebookF size={16} className="text-[#1877F2]" />
                    <span className="text-sm">Facebook</span>
                  </motion.button>
                  
                  <motion.button
                    type="button"
                    onClick={() => handleOAuthSignIn('apple')}
                    className="flex items-center justify-center gap-2 py-2.5 bg-[#111111] text-white rounded-lg border border-[#333333] transition-all hover:bg-[#1A1A1A] hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none"
                    disabled={isLoading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <FaApple size={16} />
                    <span className="text-sm">Apple</span>
                  </motion.button>
                  
                  <motion.button
                    type="button"
                    onClick={() => handleOAuthSignIn('discord')}
                    className="flex items-center justify-center gap-2 py-2.5 bg-[#111111] text-white rounded-lg border border-[#333333] transition-all hover:bg-[#1A1A1A] hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none"
                    disabled={isLoading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <FaDiscord size={16} className="text-[#5865F2]" />
                    <span className="text-sm">Discord</span>
                  </motion.button>
                </motion.div>
              )}
              
              <motion.div variants={itemVariants} className="text-center text-sm text-[#999999]">
                {mode === "sign-in" ? (
                  <p>
                    Don't have an account?{" "}
                    <motion.button 
                      onClick={() => setMode("sign-up")}
                      className="text-white font-medium hover:underline transition-all"
                      whileHover={{ scale: 1.05 }}
                    >
                      Sign Up
                    </motion.button>
                  </p>
                ) : (
                  <p>
                    Already have an account?{" "}
                    <motion.button 
                      onClick={() => setMode("sign-in")}
                      className="text-white font-medium hover:underline transition-all"
                      whileHover={{ scale: 1.05 }}
                    >
                      Sign In
                    </motion.button>
                  </p>
                )}
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </GlassCard>
      </div>
      
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center text-xs text-[#777777] mt-8 mb-2"
      >
        © 2025 Solivrah. All rights reserved.
      </motion.div>
    </div>
  );
};

export default Auth;
