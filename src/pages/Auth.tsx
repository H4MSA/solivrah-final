
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Logo } from "@/components/Logo";
import { useApp } from "@/context/AppContext";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

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
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          }
        });

        if (error) {
          throw error;
        }

        toast({
          title: "Account created!",
          description: "Check your email for the confirmation link.",
        });

        // Auto-login if email confirmation is disabled
        if (data?.user && !data.user.email_confirmed_at) {
          navigate("/home");
        }

      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

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
    navigate("/home");
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-solivrah-bg px-6 py-12">
      <motion.div 
        className="w-full max-w-sm space-y-8"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col items-center justify-center">
          <Logo className="h-40 w-auto" />
          <h2 className="mt-6 text-center text-xl font-bold text-white">
            {isSignup ? "Create your account" : "Sign in to your account"}
          </h2>
        </div>

        {error && (
          <div className="rounded-lg bg-red-500/10 border border-red-500/30 p-3 text-sm text-red-300">
            {error}
          </div>
        )}

        <form className="mt-8 space-y-4" onSubmit={handleAuth}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-200 mb-1">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="relative block w-full appearance-none rounded-md border border-[#464646] bg-[#222222] px-4 py-3 text-white focus:border-white focus:outline-none focus:ring-0"
              placeholder="Email address"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-200 mb-1">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete={isSignup ? "new-password" : "current-password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="relative block w-full appearance-none rounded-md border border-[#464646] bg-[#222222] px-4 py-3 text-white focus:border-white focus:outline-none focus:ring-0"
              placeholder="Password"
            />
          </div>

          <div>
            <motion.button
              type="submit"
              whileTap={{ scale: 0.97 }}
              className="group relative flex w-full justify-center rounded-xl border border-transparent bg-white px-4 py-3.5 text-black font-medium transition-all hover:bg-[#EEEEEE] active:scale-[0.98]"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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

          <div className="flex items-center justify-center">
            <motion.button
              type="button"
              whileTap={{ scale: 0.97 }}
              className="text-sm text-gray-300 hover:text-white transition-colors"
              onClick={handleGuestLogin}
            >
              Continue as Guest
            </motion.button>
          </div>
        </form>

        <div className="text-center mt-4">
          <motion.button
            whileTap={{ scale: 0.97 }}
            className="text-sm text-white hover:underline transition-colors"
            onClick={() => setIsSignup(!isSignup)}
          >
            {isSignup ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
          </motion.button>
        </div>
        
        <div className="text-[#999999] text-[9px] text-center mt-10">
          © 2025 Solivrah. All rights reserved.
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;
