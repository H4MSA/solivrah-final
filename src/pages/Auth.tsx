
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthService } from "@/services/AuthService";
import { Logo } from "@/components/Logo";
import { useApp } from "@/context/AppContext";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { XCircle } from "lucide-react";

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

  // Apply a fixed background color to prevent the dark background issue
  useEffect(() => {
    document.body.classList.add('bg-black');
    return () => {
      document.body.classList.remove('bg-black');
    };
  }, []);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isSignup) {
        const { data } = await AuthService.signUp({
          email,
          password,
        });

        toast({
          title: "Account created!",
          description: "Check your email for the confirmation link.",
        });

        // Auto-login if email confirmation is disabled
        if (data?.user && !data.user.email_confirmed_at) {
          navigate("/home");
        }

      } else {
        await AuthService.signIn({
          email,
          password,
        });

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

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black px-6 py-12">
      <motion.div 
        className="w-full max-w-sm space-y-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col items-center justify-center">
          <Logo className="h-28 w-auto mb-6" />
          <h2 className="mb-4 text-center text-2xl font-bold text-white">
            {isSignup ? "Create your account" : "Sign in to your account"}
          </h2>
          <p className="text-center text-sm text-white/60 max-w-[250px]">
            {isSignup 
              ? "Join our community and start your journey towards your goals" 
              : "Welcome back! Sign in to continue your journey"}
          </p>
        </div>

        {error && (
          <motion.div 
            className="rounded-lg bg-red-500/10 border border-red-500/30 p-3 text-sm text-red-300 relative pl-10"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <XCircle className="absolute left-3 top-3 h-4 w-4 text-red-300" />
            {error}
          </motion.div>
        )}

        <form className="mt-6 space-y-5" onSubmit={handleAuth}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-white/80 mb-2">
              Email address
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-[#121212] border border-[#333333] text-white focus:border-purple-500 focus:ring-purple-500/20"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-white/80 mb-2">
              Password
            </label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete={isSignup ? "new-password" : "current-password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-[#121212] border border-[#333333] text-white focus:border-purple-500 focus:ring-purple-500/20"
              placeholder="••••••••••••"
            />
          </div>

          <div>
            <motion.button
              type="submit"
              whileTap={{ scale: 0.97 }}
              className="group relative flex w-full justify-center rounded-xl bg-gradient-to-r from-purple-600 to-purple-700 px-4 py-3.5 text-white font-medium transition-all hover:from-purple-700 hover:to-purple-800 active:scale-[0.98] shadow-lg shadow-purple-900/20"
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
                <span>
                  {isSignup ? "Create Account" : "Sign In"}
                </span>
              )}
            </motion.button>
          </div>

          <div className="flex items-center">
            <div className="h-px flex-1 bg-[#333333]"></div>
            <p className="mx-4 text-sm text-white/40">or</p>
            <div className="h-px flex-1 bg-[#333333]"></div>
          </div>

          <div className="flex items-center justify-center">
            <motion.button
              type="button"
              whileTap={{ scale: 0.97 }}
              className="text-sm text-white/70 px-4 py-2 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
              onClick={handleGuestLogin}
            >
              Continue as Guest
            </motion.button>
          </div>
        </form>

        <div className="text-center mt-6">
          <motion.button
            whileTap={{ scale: 0.97 }}
            className="text-sm text-white/70 hover:text-white transition-colors"
            onClick={() => setIsSignup(!isSignup)}
          >
            {isSignup ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
          </motion.button>
        </div>
        
        <div className="text-[#666666] text-[10px] text-center mt-8">
          © 2025 Solivrah. All rights reserved.
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;
