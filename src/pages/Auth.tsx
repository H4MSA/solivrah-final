
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Logo } from "@/components/Logo";
import { GlassCard } from "@/components/GlassCard";
import { Mail, Phone, Lock, ArrowRight, ChevronLeft, Eye, EyeOff } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { useApp } from "@/context/AppContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

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
  
  const { setUser, setIsGuest, user } = useApp();
  const { toast } = useToast();
  
  // Redirect if already authenticated
  useEffect(() => {
    if (user) {
      navigate('/home');
    }
  }, [user, navigate]);
  
  useEffect(() => {
    // Clear any guest state
    setIsGuest(false);
  }, [setIsGuest]);
  
  const validateForm = () => {
    setError("");
    
    if (mode === 'register') {
      if (!name.trim()) {
        setError("Name is required");
        return false;
      }
      
      if (password !== confirmPassword) {
        setError("Passwords don't match");
        return false;
      }
      
      if (password.length < 6) {
        setError("Password must be at least 6 characters");
        return false;
      }
    }
    
    if (method === 'email') {
      if (!email.includes('@') || !email.includes('.')) {
        setError("Please enter a valid email");
        return false;
      }
    } else {
      if (phone.length < 10) {
        setError("Please enter a valid phone number");
        return false;
      }
    }
    
    if (!password) {
      setError("Password is required");
      return false;
    }
    
    return true;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    setError("");
    
    try {
      if (mode === 'login') {
        // Real Supabase authentication
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email,
          password: password,
        });
        
        if (error) throw error;
        
        if (data.user) {
          toast({
            title: "Welcome back!",
            description: "You've successfully logged in",
          });
          
          navigate('/home');
        }
      } else {
        // Register new user
        const { data, error } = await supabase.auth.signUp({
          email: email,
          password: password,
          options: {
            data: {
              name: name,
            },
          },
        });
        
        if (error) throw error;
        
        toast({
          title: "Account created!",
          description: "Welcome to Solivrah",
        });
        
        navigate('/survey');
      }
    } catch (err: any) {
      console.error("Auth error:", err);
      setError(err.message || "Authentication failed");
      
      toast({
        title: "Authentication failed",
        description: err.message || "Please check your credentials and try again",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleGoogleLogin = async () => {
    setLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin + '/home',
        },
      });
      
      if (error) throw error;
      
      // The user will be redirected to Google for authentication
      
    } catch (err: any) {
      setError("Google authentication failed");
      
      toast({
        title: "Google sign in failed",
        description: "Please try again or use another method",
        variant: "destructive",
      });
      setLoading(false);
    }
  };
  
  const handleGuestLogin = () => {
    // Create a temporary guest user
    const guestUser = {
      id: `guest-${Date.now()}`,
      name: "Guest User",
    };
    
    setUser(guestUser);
    setIsGuest(true);
    
    toast({
      title: "Guest mode activated",
      description: "You can explore the app without creating an account",
    });
    
    navigate('/home');
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
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-[300px] h-[300px] bg-[#333333]/10 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-[#444444]/10 rounded-full blur-[100px]"></div>
      </div>
      
      <div className={`w-full max-w-md z-10 transition-all duration-500 ${animation}`}>
        <div className="flex justify-center mb-6">
          <Logo className="animate-float" />
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
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md transition-all touch-manipulation ${
                  method === 'email' 
                    ? 'bg-[#222222] text-white' 
                    : 'text-[#888888] hover:text-white'
                }`}
              >
                <Mail size={16} />
                <span>Email</span>
              </button>
              <button
                type="button"
                onClick={() => setMethod('phone')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md transition-all touch-manipulation ${
                  method === 'phone' 
                    ? 'bg-[#222222] text-white' 
                    : 'text-[#888888] hover:text-white'
                }`}
              >
                <Phone size={16} />
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
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#888888] hover:text-white transition-colors touch-manipulation"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
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
              className="w-full flex items-center justify-center gap-2 bg-white text-black py-3 rounded-xl font-medium transition-all hover:bg-[#EEEEEE] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed touch-manipulation"
            >
              {loading ? (
                <>
                  <span className="animate-pulse">Processing</span>
                </>
              ) : (
                <>
                  {mode === 'login' ? 'Sign In' : 'Create Account'} <ArrowRight />
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
            className="mt-4 w-full flex items-center justify-center gap-3 bg-[#121212] text-white py-3 rounded-xl border border-[#333333] font-medium transition-all hover:bg-[#1A1A1A] active:scale-[0.98] touch-manipulation"
          >
            <FcGoogle size={20} />
            Continue with Google
          </button>
          
          <button
            type="button"
            onClick={handleGuestLogin}
            className="mt-3 w-full flex items-center justify-center gap-3 bg-transparent text-white py-3 rounded-xl border border-[#333333] font-medium transition-all hover:bg-[#1A1A1A]/30 active:scale-[0.98] touch-manipulation"
          >
            Continue as Guest
          </button>
          
          <div className="mt-6 text-center">
            <button 
              type="button" 
              onClick={toggleMode}
              className="text-white hover:underline transition-all touch-manipulation"
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
              className="text-[#888888] text-sm hover:text-white flex items-center justify-center gap-1 mx-auto transition-colors touch-manipulation"
            >
              <ChevronLeft size={14} /> Back to Home
            </button>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default Auth;
