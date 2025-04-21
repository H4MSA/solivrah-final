
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Eye, EyeOff, Mail, Lock, User, Loader2 } from "lucide-react";
import { Logo } from "@/components/Logo";
import { GlassCard } from "@/components/GlassCard";
import { AuthService } from "@/services/AuthService";
import { useApp } from "@/context/AppContext";

type AuthMode = "sign-in" | "sign-up" | "forgot-password";

const Auth = () => {
  const navigate = useNavigate();
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
        navigate("/home");
      } else if (mode === "sign-up") {
        await AuthService.signUp({ email, password, username });
        setSuccessMessage("Account created successfully! Please check your email for verification.");
        setTimeout(() => {
          setMode("sign-in");
        }, 3000);
      } else if (mode === "forgot-password") {
        await AuthService.resetPassword(email);
        setSuccessMessage("Password reset link sent to your email!");
      }
    } catch (error) {
      console.error("Auth error:", error);
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An error occurred during authentication.");
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  
  return (
    <div className="min-h-screen flex flex-col justify-between px-6 py-6 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-[#333333]/10 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-[#444444]/10 rounded-full blur-[100px]"></div>
      </div>
      
      <div className="flex-1 flex flex-col w-full max-w-md mx-auto z-10">
        <div className="flex items-center mb-6">
          <button 
            onClick={() => navigate("/")}
            className="p-2 rounded-full bg-[#111111]/80 border border-white/5 hover:bg-[#222222]/80 transition-all"
          >
            <ArrowLeft size={20} className="text-white" />
          </button>
          <Logo className="mx-auto" />
        </div>
        
        <GlassCard variant="dark" className="w-full mb-4 rounded-xl">
          <div className="space-y-6">
            <div className="text-center">
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
            </div>
            
            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === "sign-up" && (
                <div className="space-y-2">
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
                </div>
              )}
              
              <div className="space-y-2">
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
              </div>
              
              {mode !== "forgot-password" && (
                <div className="space-y-2">
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
                </div>
              )}
              
              {error && (
                <div className="p-3 bg-red-900/20 border border-red-500/20 rounded-lg text-red-400 text-sm">
                  {error}
                </div>
              )}
              
              {successMessage && (
                <div className="p-3 bg-green-900/20 border border-green-500/20 rounded-lg text-green-400 text-sm">
                  {successMessage}
                </div>
              )}
              
              <button 
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-white text-black rounded-xl font-medium flex items-center justify-center transition-all hover:bg-[#EEEEEE] active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none"
              >
                {isLoading ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  mode === "sign-in" ? "Sign In" : mode === "sign-up" ? "Create Account" : "Send Reset Link"
                )}
              </button>
            </form>
            
            <div className="text-center text-sm text-[#999999]">
              {mode === "sign-in" ? (
                <p>
                  Don't have an account?{" "}
                  <button 
                    onClick={() => setMode("sign-up")}
                    className="text-white font-medium hover:underline transition-all"
                  >
                    Sign Up
                  </button>
                </p>
              ) : (
                <p>
                  Already have an account?{" "}
                  <button 
                    onClick={() => setMode("sign-in")}
                    className="text-white font-medium hover:underline transition-all"
                  >
                    Sign In
                  </button>
                </p>
              )}
            </div>
          </div>
        </GlassCard>
      </div>
      
      <div className="text-center text-xs text-[#777777] mt-8 mb-2">
        © 2025 Solivrah. All rights reserved.
      </div>
    </div>
  );
};

export default Auth;
