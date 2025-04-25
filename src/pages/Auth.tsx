
import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { AuthService } from "@/services/AuthService";
import { Eye, EyeOff, Mail, Lock, ChevronLeft } from "lucide-react";
import { GlassCard } from "@/components/GlassCard";
import { motion, AnimatePresence } from "framer-motion";
import { Logo } from "@/components/Logo";
import { useToast } from "@/hooks/use-toast";
import { useApp } from "@/context/AppContext";

type AuthMode = "login" | "signup" | "reset";

const Auth = () => {
  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { setIsGuest } = useApp();
  
  // Get return URL from state or default to home
  const returnUrl = (location.state as { returnUrl?: string })?.returnUrl || "/home";

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Input validation
      if (!email.trim()) {
        throw new Error("Email is required");
      }
      
      if (mode !== "reset" && !password.trim()) {
        throw new Error("Password is required");
      }
      
      if (mode === "signup") {
        // Signup checks
        if (password.length < 6) {
          throw new Error("Password must be at least 6 characters");
        }
        
        if (password !== confirmPassword) {
          throw new Error("Passwords do not match");
        }
        
        await AuthService.signUp({ email, password });
        toast({
          title: "Account created successfully!",
          description: "Welcome to your personal growth journey.",
        });
        navigate("/survey");
      } else if (mode === "login") {
        // Login
        await AuthService.signIn({ email, password });
        toast({
          title: "Welcome back!",
          description: "You've successfully signed in.",
        });
        navigate(returnUrl);
      } else {
        // Password reset
        await AuthService.resetPassword(email);
        toast({
          title: "Reset email sent",
          description: "Check your inbox for instructions to reset your password.",
        });
        setMode("login");
      }
    } catch (error) {
      let message = "An unexpected error occurred";
      
      if (error instanceof Error) {
        message = error.message;
        
        // Handle common Supabase error messages with more user-friendly language
        if (message.includes("User already registered")) {
          message = "This email is already registered. Please sign in instead.";
        } else if (message.includes("Email not confirmed")) {
          message = "Please verify your email before signing in.";
        } else if (message.includes("Invalid login credentials")) {
          message = "Incorrect email or password. Please try again.";
        }
      }
      
      toast({
        title: "Authentication error",
        description: message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    try {
      setLoading(true);
      await AuthService.signInWithOAuth("google");
      // No toast needed, will redirect to callback
    } catch (error) {
      toast({
        title: "Google sign-in failed",
        description: error instanceof Error ? error.message : "Please try again later",
        variant: "destructive",
      });
      setLoading(false);
    }
  };
  
  const handleGuestMode = () => {
    setIsGuest(true);
    toast({
      title: "Guest mode active",
      description: "You can explore the app, but your data won't be saved.",
    });
    navigate("/home");
  };
  
  const formVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, x: -20, transition: { duration: 0.2 } }
  };

  const renderForm = () => {
    switch (mode) {
      case "login":
        return (
          <motion.form 
            key="login"
            variants={formVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onSubmit={handleEmailAuth}
            className="space-y-4"
          >
            <h1 className="text-2xl font-bold text-white mb-1">Welcome Back</h1>
            <p className="text-white/60 text-sm mb-4">Sign in to continue your journey</p>
            
            <div className="space-y-4">
              <div>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5" />
                  <input
                    type="email"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3.5 bg-[#121212] border border-white/10 rounded-xl text-white focus:outline-none focus:border-white/30"
                    autoComplete="email"
                  />
                </div>
              </div>
              
              <div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5" />
                  <input 
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-12 py-3.5 bg-[#121212] border border-white/10 rounded-xl text-white focus:outline-none focus:border-white/30"
                    autoComplete="current-password"
                  />
                  <button 
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                <div className="flex justify-end mt-1">
                  <button
                    type="button"
                    onClick={() => setMode("reset")}
                    className="text-sm text-white/50 hover:text-white"
                  >
                    Forgot password?
                  </button>
                </div>
              </div>
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-white text-black rounded-xl font-medium transition-all hover:bg-white/90 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex justify-center items-center">
                  <span className="h-5 w-5 border-2 border-black/30 border-t-black rounded-full animate-spin mr-2"></span>
                  Signing in...
                </span>
              ) : (
                "Sign In"
              )}
            </button>
            
            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t border-white/10"></div>
              <span className="flex-shrink mx-3 text-white/40 text-sm">or continue with</span>
              <div className="flex-grow border-t border-white/10"></div>
            </div>
            
            <button
              type="button"
              onClick={handleGoogleAuth}
              disabled={loading}
              className="w-full flex justify-center items-center gap-2 py-3.5 bg-[#121212] border border-white/10 hover:bg-[#222] text-white rounded-xl font-medium transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M21.35 11.1h-9.17v2.73h6.51c-.33 3.81-3.5 5.44-6.5 5.44C8.36 19.27 5 16.25 5 12c0-4.1 3.2-7.27 7.2-7.27c3.09 0 4.9 1.97 4.9 1.97L19 4.72S16.56 2 12.1 2C6.42 2 2.03 6.8 2.03 12c0 5.05 4.13 10 10.22 10c5.35 0 9.25-3.67 9.25-9.09c0-1.15-.15-1.81-.15-1.81Z"
                />
              </svg>
              Google
            </button>
            
            <button 
              type="button"
              onClick={handleGuestMode}
              className="w-full bg-transparent hover:bg-white/5 text-white/70 py-3.5 rounded-xl font-medium transition-all"
            >
              Continue as Guest
            </button>
            
            <div className="text-center">
              <p className="text-white/50">
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={() => setMode("signup")}
                  className="text-white hover:underline font-medium"
                >
                  Sign Up
                </button>
              </p>
            </div>
          </motion.form>
        );

      case "signup":
        return (
          <motion.form
            key="signup"
            variants={formVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onSubmit={handleEmailAuth}
            className="space-y-4"
          >
            <div className="flex items-center mb-2">
              <button
                type="button"
                onClick={() => setMode("login")}
                className="p-1 -ml-1 rounded-full hover:bg-white/10"
              >
                <ChevronLeft className="w-5 h-5 text-white" />
              </button>
              <h1 className="text-2xl font-bold text-white ml-1">Create Account</h1>
            </div>
            <p className="text-white/60 text-sm mb-4">Start your personal growth journey today</p>
            
            <div className="space-y-4">
              <div>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5" />
                  <input
                    type="email"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3.5 bg-[#121212] border border-white/10 rounded-xl text-white focus:outline-none focus:border-white/30"
                    autoComplete="email"
                  />
                </div>
              </div>
              
              <div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5" />
                  <input 
                    type={showPassword ? "text" : "password"}
                    placeholder="Create password (min 6 characters)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-12 py-3.5 bg-[#121212] border border-white/10 rounded-xl text-white focus:outline-none focus:border-white/30"
                    autoComplete="new-password"
                  />
                  <button 
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
              
              <div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5" />
                  <input 
                    type={showPassword ? "text" : "password"}
                    placeholder="Confirm password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3.5 bg-[#121212] border border-white/10 rounded-xl text-white focus:outline-none focus:border-white/30"
                    autoComplete="new-password"
                  />
                </div>
              </div>
            </div>
            
            <button
              type="submit"
              disabled={loading || !email || !password || !confirmPassword}
              className="w-full py-3.5 bg-white text-black rounded-xl font-medium transition-all hover:bg-white/90 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex justify-center items-center">
                  <span className="h-5 w-5 border-2 border-black/30 border-t-black rounded-full animate-spin mr-2"></span>
                  Creating account...
                </span>
              ) : (
                "Create Account"
              )}
            </button>
            
            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t border-white/10"></div>
              <span className="flex-shrink mx-3 text-white/40 text-sm">or sign up with</span>
              <div className="flex-grow border-t border-white/10"></div>
            </div>
            
            <button
              type="button"
              onClick={handleGoogleAuth}
              disabled={loading}
              className="w-full flex justify-center items-center gap-2 py-3.5 bg-[#121212] border border-white/10 hover:bg-[#222] text-white rounded-xl font-medium transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M21.35 11.1h-9.17v2.73h6.51c-.33 3.81-3.5 5.44-6.5 5.44C8.36 19.27 5 16.25 5 12c0-4.1 3.2-7.27 7.2-7.27c3.09 0 4.9 1.97 4.9 1.97L19 4.72S16.56 2 12.1 2C6.42 2 2.03 6.8 2.03 12c0 5.05 4.13 10 10.22 10c5.35 0 9.25-3.67 9.25-9.09c0-1.15-.15-1.81-.15-1.81Z"
                />
              </svg>
              Google
            </button>
            
            <div className="text-center">
              <p className="text-white/50">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => setMode("login")}
                  className="text-white hover:underline font-medium"
                >
                  Sign In
                </button>
              </p>
            </div>
          </motion.form>
        );

      case "reset":
        return (
          <motion.form
            key="reset"
            variants={formVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onSubmit={handleEmailAuth}
            className="space-y-4"
          >
            <div className="flex items-center mb-2">
              <button
                type="button"
                onClick={() => setMode("login")}
                className="p-1 -ml-1 rounded-full hover:bg-white/10"
              >
                <ChevronLeft className="w-5 h-5 text-white" />
              </button>
              <h1 className="text-2xl font-bold text-white ml-1">Reset Password</h1>
            </div>
            <p className="text-white/60 text-sm mb-4">Enter your email to receive reset instructions</p>
            
            <div className="space-y-4">
              <div>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5" />
                  <input
                    type="email"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3.5 bg-[#121212] border border-white/10 rounded-xl text-white focus:outline-none focus:border-white/30"
                    autoComplete="email"
                  />
                </div>
              </div>
            </div>
            
            <button
              type="submit"
              disabled={loading || !email}
              className="w-full py-3.5 bg-white text-black rounded-xl font-medium transition-all hover:bg-white/90 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex justify-center items-center">
                  <span className="h-5 w-5 border-2 border-black/30 border-t-black rounded-full animate-spin mr-2"></span>
                  Sending reset email...
                </span>
              ) : (
                "Send Reset Instructions"
              )}
            </button>
            
            <div className="text-center">
              <p className="text-white/50">
                <button
                  type="button"
                  onClick={() => setMode("login")}
                  className="text-white hover:underline font-medium"
                >
                  Back to Sign In
                </button>
              </p>
            </div>
          </motion.form>
        );
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col p-6 relative">
      {/* Logo */}
      <div className="flex justify-center mb-4">
        <Logo className="h-12" />
      </div>
      
      {/* Auth container */}
      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-md mx-auto">
        <GlassCard variant="dark" className="w-full p-6 md:p-8">
          <AnimatePresence mode="wait">
            {renderForm()}
          </AnimatePresence>
        </GlassCard>
        
        <div className="text-center mt-6">
          <p className="text-white/50 text-xs">
            By continuing, you agree to our{" "}
            <Link to="#" className="text-white/70 hover:text-white underline">Terms of Service</Link>
            {" "}and{" "}
            <Link to="#" className="text-white/70 hover:text-white underline">Privacy Policy</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
