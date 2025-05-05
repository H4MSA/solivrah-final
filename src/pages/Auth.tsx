
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthService } from "@/services/AuthService";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { useApp } from "@/context/AppContext";

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const { setIsGuest } = useApp();

  const returnUrl = location.state?.returnUrl || "/home";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        await AuthService.signUp({ email, password, username });
        toast({
          title: "Account created",
          description: "Please check your email to confirm your account.",
        });
      } else {
        await AuthService.signIn({ email, password });
        // Upon successful sign-in, make sure guest mode is turned off
        setIsGuest(false);
        localStorage.removeItem("isGuest");
        navigate(returnUrl);
      }
    } catch (error: any) {
      toast({
        title: "Authentication Error",
        description: error.message || "An error occurred during authentication",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogin = () => {
    setIsGuest(true);
    localStorage.setItem("isGuest", "true");
    navigate("/home");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black px-6 py-8">
      <button
        onClick={() => navigate("/")}
        className="absolute top-6 left-6 flex items-center text-gray-400 hover:text-white"
      >
        <ArrowLeft size={20} className="mr-2" />
        Back
      </button>

      <div className="max-w-sm w-full">
        <div className="mb-8 text-center">
          <Logo className="mb-6" />
          <h1 className="text-2xl font-semibold text-white mb-2">
            {isSignUp ? "Create an account" : "Welcome back"}
          </h1>
          <p className="text-gray-400 text-sm">
            {isSignUp
              ? "Sign up to track your progress"
              : "Sign in to continue your journey"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <div>
              <Input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="bg-[#333] text-white border-none h-12"
              />
            </div>
          )}

          <div>
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-[#333] text-white border-none h-12"
            />
          </div>

          <div>
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-[#333] text-white border-none h-12"
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className={`w-full h-12 rounded-xl ${
              isSignUp ? "bg-white text-black" : "bg-white text-black"
            }`}
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : isSignUp ? (
              "Create Account"
            ) : (
              "Sign In"
            )}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-gray-400 hover:text-white text-sm"
          >
            {isSignUp
              ? "Already have an account? Sign In"
              : "Don't have an account? Sign Up"}
          </button>
        </div>

        <div className="mt-4 text-center">
          <button
            onClick={handleGuestLogin}
            className="text-gray-400 hover:text-white text-sm underline"
          >
            Continue as Guest
          </button>
        </div>

        <div className="mt-8 text-center text-xs text-gray-500">
          <p>
            By continuing, you agree to our{" "}
            <a href="#" className="text-gray-400 hover:text-white">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-gray-400 hover:text-white">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
