
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthService } from "@/services/AuthService";
import { Logo } from "@/components/Logo";
import { useApp } from "@/context/AppContext";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Mail, Lock, AlertCircle, ArrowRight } from "lucide-react";

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
        const response = await AuthService.signUp({
          email,
          password,
        });

        toast({
          title: "Account created!",
          description: "Check your email for the confirmation link.",
        });

        // Auto-login if email confirmation is disabled
        if (response.user && !response.user.email_confirmed_at) {
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-6 py-12">
      <motion.div 
        className="w-full max-w-sm space-y-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col items-center justify-center">
          <Logo className="h-28 w-auto mb-6" />
          <h2 className="mb-2 text-center text-2xl font-bold text-gray-900">
            {isSignup ? "Create your account" : "Sign in to your account"}
          </h2>
          <p className="text-center text-sm text-gray-600 max-w-[250px]">
            {isSignup 
              ? "Join our community and start your journey towards your goals" 
              : "Welcome back! Sign in to continue your journey"}
          </p>
        </div>

        {error && (
          <motion.div 
            className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-600 relative pl-10"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <AlertCircle className="absolute left-3 top-3 h-4 w-4 text-red-500" />
            {error}
          </motion.div>
        )}

        <div className="backdrop-blur-lg bg-white/70 rounded-xl p-6 border border-gray-200 shadow-lg">
          <form className="space-y-5" onSubmit={handleAuth}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 bg-white border border-gray-300 text-gray-900 focus:border-gray-500 focus:ring-gray-500/20"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete={isSignup ? "new-password" : "current-password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 bg-white border border-gray-300 text-gray-900 focus:border-gray-500 focus:ring-gray-500/20"
                  placeholder="••••••••••••"
                />
              </div>
            </div>

            <div>
              <motion.button
                type="submit"
                whileTap={{ scale: 0.97 }}
                className="group relative flex w-full justify-center rounded-xl bg-gray-900 px-4 py-3.5 text-white font-medium transition-all hover:bg-gray-800 active:scale-[0.98] shadow-lg"
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
                    <ArrowRight className="ml-1.5 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                )}
              </motion.button>
            </div>
          </form>
        </div>

        <div className="flex items-center">
          <div className="h-px flex-1 bg-gray-300"></div>
          <p className="mx-4 text-sm text-gray-500">or</p>
          <div className="h-px flex-1 bg-gray-300"></div>
        </div>

        <div className="flex items-center justify-center">
          <motion.button
            type="button"
            whileTap={{ scale: 0.97 }}
            className="text-sm text-gray-600 px-4 py-2 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            onClick={handleGuestLogin}
          >
            Continue as Guest
          </motion.button>
        </div>

        <div className="text-center mt-6">
          <motion.button
            whileTap={{ scale: 0.97 }}
            className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
            onClick={() => setIsSignup(!isSignup)}
          >
            {isSignup ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
          </motion.button>
        </div>
        
        <div className="text-gray-500 text-[10px] text-center mt-8">
          © 2025 Solivrah. All rights reserved.
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;
