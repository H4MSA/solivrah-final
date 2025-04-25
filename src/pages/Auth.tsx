
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Eye, EyeOff, Mail, Lock, User, Loader2, Phone } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Logo } from "@/components/Logo";
import { GlassCard } from "@/components/GlassCard";
import { AuthService } from "@/services/AuthService";
import { useApp } from "@/context/AppContext";
import { FaGoogle } from "react-icons/fa";
import { useToast } from "@/hooks/use-toast";

type AuthMode = "sign-in" | "sign-up" | "forgot-password";

const Auth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, setUser, setSession, setIsGuest } = useApp();
  const [mode, setMode] = useState<AuthMode>("sign-in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (user) {
      navigate("/home");
    }
    
    // Check for existing session only if not logged in
    const checkSession = async () => {
      try {
        const session = await AuthService.getCurrentSession();
        if (session) {
          setUser(session.user);
          setSession(session);
          navigate("/home");
        }
      } catch (error) {
        console.error("Session check error:", error);
      }
    };
    
    checkSession();
  }, [user, navigate, setUser, setSession]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setIsLoading(true);
    
    try {
      if (mode === "sign-in") {
        const { session, user } = await AuthService.signIn({ email, password });
        
        if (session) {
          setSession(session);
          setUser(user);
          toast({ title: "Signed in!", description: "Welcome back.", variant: "default" });
          navigate("/home");
        } else {
          throw new Error("Failed to authenticate");
        }
      } else if (mode === "sign-up") {
        await AuthService.signUp({ email, password, username });
        toast({ title: "Account created!", description: "Let's get started.", variant: "default" });
        
        // Attempt to log in immediately after signup
        const { session, user } = await AuthService.signIn({ email, password });
        if (session) {
          setSession(session);
          setUser(user);
          navigate("/survey");
        }
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
      setError(error instanceof Error ? error.message : "Authentication error.");
      toast({
        title: "Authentication error",
        description: error instanceof Error ? error.message : "Unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuthSignIn = async (provider: 'google') => {
    setError("");
    setIsLoading(true);
    try {
      await AuthService.signInWithOAuth(provider);
    } catch (error) {
      setError(error instanceof Error ? error.message : `An error occurred during ${provider} sign-in.`);
      toast({
        title: "Authentication error",
        description: error instanceof Error ? error.message : `Unexpected error with ${provider} sign-in.`,
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  // Guest login: mark as guest, require survey
  const handleGuestLogin = async (e: React.MouseEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      setIsGuest(true);
      const guestUser = {
        id: `guest_${Date.now()}`,
        email: null,
        user_metadata: {
          username: 'Guest'
        },
        app_metadata: {},
        aud: 'guest',
        created_at: new Date().toISOString(),
        role: null,
        updated_at: new Date().toISOString()
      };
      
      setUser(guestUser);
      setSession(null);
      navigate("/survey");
    } catch (error) {
      console.error("Guest login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1, y: 0,
      transition: { staggerChildren: 0.06, delayChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black px-2 py-2">
      <div className="w-full max-w-xs mx-auto z-10 flex flex-col gap-2">
        <motion.div
          initial={{ opacity: 0, y: -25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.33 }}
          className="flex items-center mb-3"
        >
          <button
            onClick={() => navigate("/")}
            className="p-2 rounded-full bg-[#111111] border border-white/5 hover:bg-[#222222] transition-all"
          >
            <ArrowLeft size={20} className="text-white" />
          </button>
          <Logo className="mx-auto w-32 h-10 object-contain" />
        </motion.div>

        <GlassCard
          variant="dark"
          className="w-full mb-4 rounded-2xl shadow-lg bg-[#161616]/90 border border-[#222] px-4 py-6"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={formVariants}
              className="space-y-5"
            >
              <motion.div variants={itemVariants} className="text-center">
                <h1 className="text-lg font-bold text-white">
                  {mode === "sign-in"
                    ? "Welcome Back"
                    : mode === "sign-up"
                    ? "Create Account"
                    : "Reset Password"}
                </h1>
                <p className="text-[#999999] text-sm mt-1">
                  {mode === "sign-in"
                    ? "Sign in to continue to your account"
                    : mode === "sign-up"
                    ? "Join Solivrah and start your journey"
                    : "Enter your email to receive a reset link"}
                </p>
              </motion.div>

              <motion.form onSubmit={handleSubmit} className="space-y-3">
                {mode === "sign-up" && (
                  <motion.div variants={itemVariants} className="space-y-1">
                    <label htmlFor="username" className="text-xs text-[#E0E0E0] font-medium">Username</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#999999]"><User size={16} /></span>
                      <input
                        id="username"
                        type="text"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        className="w-full bg-[#151515] border border-[#262626] rounded-lg py-2.5 pl-9 pr-3 text-white placeholder:text-[#777] focus:outline-none focus:border-[#444] text-sm"
                        placeholder="Your username"
                        autoComplete="username"
                      />
                    </div>
                  </motion.div>
                )}

                <motion.div variants={itemVariants} className="space-y-1">
                  <label htmlFor="email" className="text-xs text-[#E0E0E0] font-medium">Email</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#999999]"><Mail size={16} /></span>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="w-full bg-[#151515] border border-[#262626] rounded-lg py-2.5 pl-9 pr-3 text-white placeholder:text-[#777] focus:outline-none focus:border-[#444] text-sm"
                      placeholder="your.email@example.com"
                      autoComplete="email"
                    />
                  </div>
                </motion.div>

                {mode !== "forgot-password" && (
                  <motion.div variants={itemVariants} className="space-y-1">
                    <div className="flex justify-between">
                      <label htmlFor="password" className="text-xs text-[#E0E0E0] font-medium">
                        Password
                      </label>
                      {mode === "sign-in" && (
                        <button
                          type="button"
                          onClick={() => setMode("forgot-password")}
                          className="text-xs text-[#999999] hover:text-white transition"
                        >
                          Forgot password?
                        </button>
                      )}
                    </div>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#999999]"><Lock size={16} /></span>
                      <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        className="w-full bg-[#151515] border border-[#262626] rounded-lg py-2.5 pl-9 pr-9 text-white placeholder:text-[#777] focus:outline-none focus:border-[#444] text-sm"
                        placeholder="••••••••"
                        autoComplete={mode === "sign-up" ? "new-password" : "current-password"}
                      />
                      <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#999999] hover:text-white transition"
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </motion.div>
                )}

                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-2 bg-red-900/20 border border-red-500/20 rounded-lg text-red-400 text-xs"
                  >
                    {error}
                  </motion.div>
                )}

                {successMessage && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-2 bg-green-900/20 border border-green-500/20 rounded-lg text-green-400 text-xs"
                  >
                    {successMessage}
                  </motion.div>
                )}

                <motion.button
                  variants={itemVariants}
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2.5 bg-white text-black rounded-xl font-medium flex items-center justify-center transition hover:bg-[#EEEEEE] hover:scale-105 active:scale-95 shadow"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  {isLoading
                    ? <Loader2 size={18} className="animate-spin" />
                    : mode === "sign-in"
                      ? "Sign In"
                      : mode === "sign-up"
                        ? "Create Account"
                        : "Send Reset Link"}
                </motion.button>
              </motion.form>

              <motion.div variants={itemVariants} className="relative flex items-center justify-center">
                <div className="absolute left-0 right-0 h-px bg-[#242426]"></div>
                <span className="px-4 bg-[#161616] text-[#888] text-xs z-10">OR</span>
              </motion.div>

              {mode !== "forgot-password" && (
                <motion.div variants={itemVariants} className="flex justify-center">
                  <motion.button
                    type="button"
                    onClick={() => handleOAuthSignIn('google')}
                    className="flex items-center justify-center gap-2 py-2 px-4 w-full bg-[#151515] text-white rounded-lg border border-[#222] transition hover:bg-[#222] hover:scale-105 active:scale-95 shadow"
                    disabled={isLoading}
                  >
                    <FaGoogle size={14} className="text-[#EA4335]" />
                    <span className="text-sm">Continue with Google</span>
                  </motion.button>
                </motion.div>
              )}

              <motion.div variants={itemVariants} className="text-center text-xs text-[#99999A]">
                {mode === "sign-in" ? (
                  <p>
                    {"Don't have an account? "}
                    <button
                      onClick={() => setMode("sign-up")}
                      className="text-white font-medium hover:underline"
                    >
                      Sign Up
                    </button>
                  </p>
                ) : (
                  <p>
                    {"Already have an account? "}
                    <button
                      onClick={() => setMode("sign-in")}
                      className="text-white font-medium hover:underline"
                    >
                      Sign In
                    </button>
                  </p>
                )}
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </GlassCard>

        <button
          onClick={handleGuestLogin}
          className="w-full py-2.5 bg-black/85 border border-[#222] text-white rounded-xl font-bold hover:bg-black hover:border-white transition mt-1 shadow"
          type="button"
        >
          Continue as Guest
        </button>
      </div>
      <div className="text-center text-xs text-[#888] mt-5 mb-2">
        © 2025 Solivrah. All rights reserved.
      </div>
    </div>
  );
};

export default Auth;
