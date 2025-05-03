import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Logo } from "@/components/Logo";
import { GlassPane, GlassInput, GlassButton } from "@/components/ui/glass";
import { AuthService } from "@/services/AuthService";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { Mail, Lock, ArrowLeft, User, Fingerprint } from "lucide-react";

interface LocationState {
  returnUrl?: string;
  initialTab?: 'login' | 'signup';
}

const Auth = () => {
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('signup');
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { user, setUser, session, setSession } = useAuth();
  
  const locationState = location.state as LocationState;
  const returnUrl = locationState?.returnUrl || "/";
  
  useEffect(() => {
    // If initialTab is provided in the location state, use it
    if (locationState?.initialTab) {
      setActiveTab(locationState.initialTab);
    }
  }, [locationState]);
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    if (!email || !password) {
      toast({
        variant: "destructive",
        title: "Required fields missing",
        description: "Please enter both email and password."
      });
      setIsLoading(false);
      return;
    }
    
    try {
      const { user, session } = await AuthService.signIn({ email, password });
      
      if (rememberMe) {
        localStorage.setItem('authToken', session?.access_token || "");
      }
      
      setUser(user);
      setSession(session);
      
      toast({
        title: "Login successful",
        description: "Welcome back!"
      });
      
      navigate(returnUrl, { replace: true });
    } catch (error) {
      console.error("Login error:", error);
      toast({
        variant: "destructive",
        title: "Login failed",
        description: error instanceof Error ? error.message : "Please check your credentials and try again."
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    if (!email || !password) {
      toast({
        variant: "destructive",
        title: "Required fields missing",
        description: "Please enter email and password."
      });
      setIsLoading(false);
      return;
    }
    
    try {
      const { user, session } = await AuthService.signUp({ email, password, username });
      
      if (session) {
        if (rememberMe) {
          localStorage.setItem('authToken', session.access_token || "");
        }
        
        setUser(user);
        setSession(session);
        
        toast({
          title: "Account created successfully",
          description: "Welcome to Solivrah! Let's set up your profile."
        });
        
        navigate("/survey", { replace: true });
      } else {
        toast({
          title: "Verification email sent",
          description: "Please check your email to verify your account."
        });
      }
    } catch (error: any) {
      console.error("Sign up error:", error);
      let errorMessage = "Please try again.";
      
      if (error.message.includes("User already registered")) {
        errorMessage = "Email already in use. Please try logging in instead.";
      }
      
      toast({
        variant: "destructive",
        title: "Sign up failed",
        description: errorMessage
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      await AuthService.signInWithOAuth('google');
      // Redirect happens automatically
    } catch (error) {
      console.error("Google sign in error:", error);
      toast({
        variant: "destructive",
        title: "Google sign in failed",
        description: "There was a problem signing in with Google."
      });
      setIsLoading(false);
    }
  };
  
  const handleGuestLogin = async () => {
    setIsLoading(true);
    
    try {
      const { user, session } = await AuthService.signInAsGuest();
      
      if (!user || !session) {
        throw new Error("Failed to create guest account");
      }
      
      localStorage.setItem('authToken', session?.access_token || "");
      
      setUser(user);
      setSession(session);
      
      toast({
        title: "Guest login successful",
        description: "Welcome! You're logged in as a guest."
      });
      
      navigate("/survey", { replace: true });
    } catch (error: any) {
      console.error("Guest login error:", error);
      toast({
        variant: "destructive",
        title: "Guest login failed",
        description: error.message || "Please try again later."
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };
  
  const variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 300,
      }
    },
    exit: { 
      opacity: 0, 
      y: -20, 
      transition: { duration: 0.2 } 
    }
  };

  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center px-4 py-10">
      <motion.div 
        className="absolute top-6 left-6 z-10"
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
      >
        <GlassButton
          variant="secondary" 
          size="sm"
          className="px-3 py-2"
          onClick={() => navigate("/welcome")}
          iconLeft={<ArrowLeft size={16} />}
        >
          Back
        </GlassButton>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-6"
      >
        <Logo />
      </motion.div>

      <GlassPane 
        className="w-full max-w-md p-6" 
        variant="ultra"
        depth="high"
      >
        <motion.div 
          className="flex mb-6 border-b border-white/10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <button
            className={`flex-1 pb-3 text-center font-medium transition-all relative ${
              activeTab === 'signup' 
                ? 'text-white' 
                : 'text-white/60 hover:text-white/80'
            }`}
            onClick={() => setActiveTab('signup')}
          >
            Create Account
            {activeTab === 'signup' && (
              <motion.div 
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-white rounded-full"
                layoutId="activeTabIndicator"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
          </button>
          
          <button
            className={`flex-1 pb-3 text-center font-medium transition-all relative ${
              activeTab === 'login' 
                ? 'text-white' 
                : 'text-white/60 hover:text-white/80'
            }`}
            onClick={() => setActiveTab('login')}
          >
            Sign In
            {activeTab === 'login' && (
              <motion.div 
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-white rounded-full"
                layoutId="activeTabIndicator"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
          </button>
        </motion.div>

        <AnimatePresence mode="wait">
          {activeTab === 'login' ? (
            <motion.form 
              key="login-form"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={variants}
              className="space-y-4"
              onSubmit={handleLogin}
            >
              <GlassInput
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                icon={<Mail size={16} />}
                label="Email"
                required
              />
              
              <div className="relative">
                <GlassInput
                  type={passwordVisible ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  icon={<Lock size={16} />}
                  label="Password"
                  required
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-1/2 transform -translate-y-1/4 text-white/60 hover:text-white transition-all"
                >
                  <Fingerprint size={16} />
                </button>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="remember-me"
                    className="w-4 h-4 rounded bg-black/40 border-white/20 text-purple-600 focus:ring-purple-500"
                    checked={rememberMe}
                    onChange={() => setRememberMe(!rememberMe)}
                  />
                  <label htmlFor="remember-me" className="text-sm text-white/80">
                    Remember me
                  </label>
                </div>
                
                <a href="#" className="text-sm text-white/80 hover:text-white hover:underline">
                  Forgot password?
                </a>
              </div>
              
              <GlassButton
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                loading={isLoading}
                className="mt-6"
              >
                Sign In
              </GlassButton>

              <GlassButton
                type="button"
                variant="secondary"
                size="lg"
                fullWidth
                onClick={handleGuestLogin}
                disabled={isLoading}
                className="mt-2"
              >
                Continue as Guest
              </GlassButton>
            </motion.form>
          ) : (
            <motion.form 
              key="signup-form"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={variants}
              className="space-y-4"
              onSubmit={handleSignUp}
            >
              <GlassInput
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                icon={<Mail size={16} />}
                label="Email"
                required
              />
              
              <GlassInput
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                icon={<User size={16} />}
                label="Username (optional)"
              />
              
              <div className="relative">
                <GlassInput
                  type={passwordVisible ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  icon={<Lock size={16} />}
                  label="Password"
                  required
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-1/2 transform -translate-y-1/4 text-white/60 hover:text-white transition-all"
                >
                  <Fingerprint size={16} />
                </button>
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="remember-me"
                  className="w-4 h-4 rounded bg-black/40 border-white/20 text-purple-600 focus:ring-purple-500"
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                />
                <label htmlFor="remember-me" className="text-sm text-white/80">
                  Remember me
                </label>
              </div>
              
              <GlassButton
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                loading={isLoading}
                className="mt-6"
              >
                Create Account
              </GlassButton>

              <GlassButton
                type="button"
                variant="secondary"
                size="lg"
                fullWidth
                onClick={handleGuestLogin}
                disabled={isLoading}
                className="mt-2"
              >
                Continue as Guest
              </GlassButton>
            </motion.form>
          )}
        </AnimatePresence>
        
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-black/40 backdrop-blur-md text-white/60">
                Or continue with
              </span>
            </div>
          </div>

          <div className="mt-6">
            <GlassButton
              type="button"
              variant="secondary"
              size="lg"
              fullWidth
              onClick={handleGoogleSignIn}
              className="mt-4"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 21 20" fill="none">
                <path d="M18.9892 10.1871C18.9892 9.36767 18.9246 8.76973 18.7847 8.14966H9.68848V11.848H15.0277C14.9201 12.767 14.3388 14.1512 13.047 15.0812L13.0289 15.205L15.905 17.4969L16.1042 17.5173C17.9342 15.7789 18.9892 13.221 18.9892 10.1871Z" fill="#4285F4" />
                <path d="M9.68813 19.9314C12.3039 19.9314 14.4999 19.0455 16.1039 17.5174L13.0467 15.0813C12.2286 15.6682 11.1306 16.0779 9.68813 16.0779C7.12612 16.0779 4.95165 14.3395 4.17651 11.9366L4.06289 11.9465L1.07231 14.3273L1.0332 14.4391C2.62638 17.6946 5.89889 19.9314 9.68813 19.9314Z" fill="#34A853" />
                <path d="M4.17667 11.9366C3.97215 11.3165 3.85378 10.6521 3.85378 9.96562C3.85378 9.27905 3.97215 8.6147 4.16591 7.99463L4.1605 7.86257L1.13246 5.44363L1.03339 5.49211C0.37677 6.84302 0 8.36005 0 9.96562C0 11.5712 0.37677 13.0881 1.03339 14.4391L4.17667 11.9366Z" fill="#FBBC05" />
                <path d="M9.68807 3.85336C11.5073 3.85336 12.7344 4.66168 13.4342 5.33718L16.1684 2.59107C14.4892 0.985496 12.3039 0 9.68807 0C5.89885 0 2.62637 2.23672 1.0332 5.49214L4.16573 7.99466C4.95162 5.59183 7.12608 3.85336 9.68807 3.85336Z" fill="#EB4335" />
              </svg>
              Google
            </GlassButton>
          </div>
        </div>
      </GlassPane>
      
      <motion.p 
        className="mt-6 text-xs text-white/60 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        By signing up, you agree to our{' '}
        <a href="#" className="text-white hover:underline">Terms</a> and{' '}
        <a href="#" className="text-white hover:underline">Privacy Policy</a>
      </motion.p>
    </div>
  );
};

export default Auth;
