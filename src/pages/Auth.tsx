
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Logo } from "@/components/Logo";
import { GlassCard } from "@/components/GlassCard";
import { FiMail, FiPhone, FiLock, FiArrowRight, FiChevronLeft, FiEye, FiEyeOff } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { useApp } from "@/context/AppContext";

const Auth = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [method, setMethod] = useState<'email' | 'phone'>('email');
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [animation, setAnimation] = useState("");
  
  const { setUser } = useApp();
  
  // Mock login function
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real app, this would connect to your authentication backend
      if (mode === 'login') {
        // Mock successful login
        setUser({
          id: "user-1",
          name: "Test User",
          email: email || phone,
        });
        navigate('/home');
      } else {
        // Mock registration
        if (password !== confirmPassword) {
          throw new Error("Passwords don't match");
        }
        
        // Mock successful registration
        setUser({
          id: "user-1",
          name: name,
          email: email || phone,
        });
        navigate('/survey');
      }
    } catch (err: any) {
      setError(err.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };
  
  const handleGoogleLogin = async () => {
    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock successful Google login
      setUser({
        id: "google-user-1",
        name: "Google User",
        email: "google@example.com",
      });
      navigate('/home');
    } catch (err: any) {
      setError("Google authentication failed");
    } finally {
      setLoading(false);
    }
  };
  
  const toggleMode = () => {
    setAnimation("animate-blur-out");
    setTimeout(() => {
      setMode(mode === 'login' ? 'register' : 'login');
      setAnimation("animate-blur-in");
    }, 300);
  };
  
  return (
    <div className="min-h-screen w-full flex flex-col justify-center items-center bg-black p-4">
      {/* Background effects */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-[300px] h-[300px] bg-[#333333]/10 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-[#444444]/10 rounded-full blur-[100px]"></div>
      </div>
      
      <div className={`w-full max-w-md z-10 transition-all duration-500 ${animation}`}>
        <div className="flex justify-center mb-6">
          <Logo className="text-5xl animate-float" />
        </div>
        
        <GlassCard className="backdrop-blur-lg p-6 animate-pop-in">
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold text-white mb-2">
              {mode === 'login' ? 'Welcome Back' : 'Create Account'}
            </h1>
            <p className="text-[#AAAAAA] text-sm">
              {mode === 'login' 
                ? 'Sign in to continue your journey' 
                : 'Join Solivrah to start your journey'}
            </p>
          </div>
          
          {error && (
            <div className="bg-red-900/30 border border-red-700 text-white px-4 py-3 rounded-lg mb-4 text-sm">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div className="space-y-2">
                <Label htmlFor="name" className="text-[#CCCCCC]">Full Name</Label>
                <div className="relative">
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="bg-[#121212] border-[#333333] focus:border-white text-white pl-4 pr-4 py-2 h-12 rounded-lg w-full transition-all"
                    placeholder="Enter your name"
                  />
                </div>
              </div>
            )}
            
            <div className="flex space-x-2 bg-[#0D0D0D] p-1 rounded-lg mb-4">
              <button
                type="button"
                onClick={() => setMethod('email')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md transition-all ${
                  method === 'email' 
                    ? 'bg-[#222222] text-white' 
                    : 'text-[#888888] hover:text-white'
                }`}
              >
                <FiMail size={16} />
                <span>Email</span>
              </button>
              <button
                type="button"
                onClick={() => setMethod('phone')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md transition-all ${
                  method === 'phone' 
                    ? 'bg-[#222222] text-white' 
                    : 'text-[#888888] hover:text-white'
                }`}
              >
                <FiPhone size={16} />
                <span>Phone</span>
              </button>
            </div>
            
            {method === 'email' ? (
              <div className="space-y-2">
                <Label htmlFor="email" className="text-[#CCCCCC]">Email</Label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-[#121212] border-[#333333] focus:border-white text-white pl-4 pr-4 py-2 h-12 rounded-lg w-full transition-all"
                    placeholder="your@email.com"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-[#CCCCCC]">Phone Number</Label>
                <div className="relative">
                  <Input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    className="bg-[#121212] border-[#333333] focus:border-white text-white pl-4 pr-4 py-2 h-12 rounded-lg w-full transition-all"
                    placeholder="+1 (123) 456-7890"
                  />
                </div>
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-[#CCCCCC]">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-[#121212] border-[#333333] focus:border-white text-white pl-4 pr-10 py-2 h-12 rounded-lg w-full transition-all"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#888888] hover:text-white transition-colors"
                >
                  {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </div>
            </div>
            
            {mode === 'register' && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-[#CCCCCC]">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="bg-[#121212] border-[#333333] focus:border-white text-white pl-4 pr-10 py-2 h-12 rounded-lg w-full transition-all"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            )}
            
            {mode === 'login' && (
              <div className="text-right">
                <a href="#" className="text-[#CCCCCC] text-sm hover:text-white transition-colors">
                  Forgot password?
                </a>
              </div>
            )}
            
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-white text-black py-3 rounded-xl font-medium transition-all hover:bg-[#EEEEEE] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <span className="animate-pulse">Processing</span>
                </>
              ) : (
                <>
                  {mode === 'login' ? 'Sign In' : 'Create Account'} <FiArrowRight />
                </>
              )}
            </button>
            
            {loading && (
              <Progress 
                value={100} 
                className="h-1" 
                indicatorClassName="bg-white animate-progress" 
              />
            )}
          </form>
          
          <div className="mt-6 flex items-center justify-center">
            <div className="border-t border-[#333333] w-full"></div>
            <div className="mx-4 text-[#AAAAAA] text-sm">or</div>
            <div className="border-t border-[#333333] w-full"></div>
          </div>
          
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="mt-4 w-full flex items-center justify-center gap-3 bg-[#121212] text-white py-3 rounded-xl border border-[#333333] font-medium transition-all hover:bg-[#1A1A1A] active:scale-[0.98]"
          >
            <FcGoogle size={20} />
            Continue with Google
          </button>
          
          <div className="mt-6 text-center">
            <button 
              type="button" 
              onClick={toggleMode}
              className="text-white hover:underline transition-all"
            >
              {mode === 'login' 
                ? "Don't have an account? Sign Up" 
                : "Already have an account? Sign In"}
            </button>
          </div>
          
          <div className="mt-4 text-center">
            <button 
              type="button" 
              onClick={() => navigate('/')}
              className="text-[#888888] text-sm hover:text-white flex items-center justify-center gap-1 mx-auto transition-colors"
            >
              <FiChevronLeft size={14} /> Back to Home
            </button>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default Auth;
