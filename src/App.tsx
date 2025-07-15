import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import { MotionConfig, LazyMotion, domAnimation } from "framer-motion";
import { AppProvider, useApp } from "./context/AppContext";
import { ThemeBackground } from "./components/ThemeBackground";
import { TabNavigation } from "./components/TabNavigation";
import { NetworkStatusIndicator } from "./components/NetworkStatusIndicator";
import { useState, useEffect, Suspense, lazy } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ContextHelp } from "./components/ContextHelp";
import { OnboardingFlow } from "./components/OnboardingFlow";

// Lazy load pages for better performance
const Index = lazy(() => import("./pages/Index"));
const Home = lazy(() => import("./pages/Home"));
const Quests = lazy(() => import("./pages/Quests"));
const Coach = lazy(() => import("./pages/Coach"));
const Community = lazy(() => import("./pages/Community"));
const Profile = lazy(() => import("./pages/Profile"));
const Survey = lazy(() => import("./pages/Survey"));
const Auth = lazy(() => import("./pages/Auth"));
const AuthCallback = lazy(() => import("./pages/AuthCallback"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Help = lazy(() => import("./pages/Help"));
const Admin = lazy(() => import("./pages/Admin"));

// Create a new QueryClient instance with custom options
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000,
    },
  },
});

// Premium Loading Screen Component
const PremiumLoadingScreen = () => (
  <div className="flex items-center justify-center h-screen bg-gradient-to-br from-black via-zinc-900 to-black">
    <div className="flex flex-col items-center space-y-6">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-white/20 border-t-calm-500 rounded-full animate-spin"></div>
        <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-gold-500 rounded-full animate-spin animation-delay-150"></div>
      </div>
      <div className="text-center">
        <h2 className="text-xl font-semibold text-white mb-2">Solivrah</h2>
        <div className="loading-dots">
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    </div>
  </div>
);

// Enhanced Error Boundary Component
class PremiumErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Premium Error Boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center h-screen bg-gradient-to-br from-black via-zinc-900 to-black p-6">
          <div className="glass-card max-w-md w-full p-8 text-center">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">Something went wrong</h2>
            <p className="text-gray-400 mb-6">We're sorry for the inconvenience. Please refresh the page to try again.</p>
            <button 
              onClick={() => window.location.reload()} 
              className="btn-primary w-full"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// SessionHandler component to manage authentication state
const SessionHandler = ({ children }: { children: React.ReactNode }) => {
  const { setUser, setSession, setIsGuest } = useApp();
  const [checking, setChecking] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Set up auth state listener FIRST (critical for avoiding auth deadlocks)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("Auth state changed:", event);
        setSession(session);
        setUser(session?.user ?? null);
        
        // Store session in localStorage for persistence between page refreshes
        if (session) {
          localStorage.setItem('authSession', JSON.stringify(session));
        } else {
          localStorage.removeItem('authSession');
        }
      }
    );

    // Check for existing session
    const checkSession = async () => {
      try {
        // First try to get from localStorage for faster initial load
        const storedSession = localStorage.getItem('authSession');
        if (storedSession) {
          const parsedSession = JSON.parse(storedSession);
          setSession(parsedSession);
          setUser(parsedSession?.user ?? null);
        }
        
        // Check if user has completed a survey
        const hasCompletedSurvey = localStorage.getItem('hasCompletedSurvey') === 'true';
        
        // Then verify with Supabase
        const { data: { session } } = await supabase.auth.getSession();
        console.log("Initial session check:", session?.user?.email || "No session");
        
        if (session) {
          setSession(session);
          setUser(session?.user ?? null);
          localStorage.setItem('authSession', JSON.stringify(session));
          
          // Check if we need to redirect to survey
          if (location.pathname === '/auth' || location.pathname === '/') {
            navigate('/home');
          }
        } else {
          // If Supabase says no session, clear localStorage
          localStorage.removeItem('authSession');
          setSession(null);
          setUser(null);
          
          // Check if guest mode is active
          const isGuestMode = localStorage.getItem('guestMode') === 'true';
          if (isGuestMode) {
            setIsGuest(true);
            
            // If guest user hasn't completed survey, redirect them
            if (!hasCompletedSurvey && !location.pathname.includes('/survey')) {
              // Wait for the next tick to avoid navigation conflicts
              setTimeout(() => {
                navigate('/survey');
              }, 0);
            }
          }
        }
      } catch (error) {
        console.error("Session check error:", error);
        localStorage.removeItem('authSession');
      } finally {
        setChecking(false);
      }
    };
    
    checkSession();

    return () => {
      subscription.unsubscribe();
    };
  }, [setUser, setSession, setIsGuest, navigate, location.pathname]);

  if (checking) {
    return <PremiumLoadingScreen />;
  }

  return <>{children}</>;
};

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading, isGuest } = useApp();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is in guest mode and needs to complete survey
    if (isGuest && localStorage.getItem('hasCompletedSurvey') !== 'true' && !location.pathname.includes('/survey')) {
      navigate('/survey');
    }
  }, [isGuest, location.pathname, navigate]);

  if (loading) {
    return <PremiumLoadingScreen />;
  }

  // Allow access if user is authenticated or is a guest
  if (!user && !isGuest) {
    // Save the attempted URL for redirecting after login
    const returnUrl = location.pathname !== "/auth" ? location.pathname : "/home";
    return <Navigate to="/auth" state={{ returnUrl }} replace />;
  }

  return <>{children}</>;
};

// App Layout with Navigation - Updated for better mobile experience
const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const showNavigation = ['/home', '/quests', '/community', '/coach', '/profile'].includes(location.pathname);

  return (
    <div className="flex flex-col min-h-screen w-full overflow-hidden">
      {/* Network status indicator */}
      <NetworkStatusIndicator position="top" variant="minimal" />
      
      {/* Main content area with scroll */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden page-transition">
        <div className="mobile-optimized-container">
          {children}
        </div>
      </main>

      {/* Context-sensitive help button */}
      {showNavigation && <ContextHelp />}

      {/* Only show TabNavigation on app pages, not on public pages */}
      {showNavigation && <TabNavigation />}
    </div>
  );
};

const App = () => {
  // Premium app state management
  const [isPWA, setIsPWA] = useState(false);
  const [hasSafeArea, setHasSafeArea] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showOnboarding, setShowOnboarding] = useState(() => {
    return localStorage.getItem('onboardingCompleted') !== 'true';
  });
  
  // Detect user's motion preference for accessibility
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  useEffect(() => {
    // Enhanced PWA and device detection
    const isPWACheck = window.matchMedia('(display-mode: standalone)').matches;
    setIsPWA(isPWACheck);
    
    // Premium safe area detection
    const detectSafeArea = () => {
      const hasSafeAreaInsets = 
        window.CSS && CSS.supports('padding-top: env(safe-area-inset-top)') && 
        (Number(getComputedStyle(document.documentElement).getPropertyValue('--sat').trim()) > 0 ||
         window.innerWidth >= 375);
      
      setHasSafeArea(hasSafeAreaInsets);
      
      // Enhanced CSS variables for premium safe area handling
      document.documentElement.style.setProperty('--sat', 'env(safe-area-inset-top, 0px)');
      document.documentElement.style.setProperty('--sab', 'env(safe-area-inset-bottom, 0px)');
      document.documentElement.style.setProperty('--sal', 'env(safe-area-inset-left, 0px)');
      document.documentElement.style.setProperty('--sar', 'env(safe-area-inset-right, 0px)');
      
      // Premium device-specific classes
      if (hasSafeAreaInsets) {
        document.body.classList.add('has-safe-area');
        
        // iPhone X and newer with notch
        if (window.innerWidth >= 375 && window.innerHeight >= 812) {
          document.body.classList.add('has-notch');
        }
        
        // iPhone with Dynamic Island
        if (window.innerWidth >= 390 && window.innerHeight >= 844) {
          document.body.classList.add('has-dynamic-island');
        }
      }
    };
    
    detectSafeArea();
    
    // Network status monitoring
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Premium performance optimizations
    const opts = { passive: true };
    document.addEventListener('touchstart', () => {}, opts);
    document.addEventListener('touchmove', () => {}, opts);
    
    // Enhanced image loading optimization
    if ('loading' in HTMLImageElement.prototype) {
      const images = document.querySelectorAll('img[loading="lazy"]');
      images.forEach(img => {
        img.setAttribute('loading', 'lazy');
      });
    }
    
    // Premium font loading optimization
    if ('fonts' in document) {
      document.fonts.ready.then(() => {
        document.body.classList.add('fonts-loaded');
      });
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      document.removeEventListener('touchstart', () => {});
      document.removeEventListener('touchmove', () => {});
    };
  }, []);

  return (
    <PremiumErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AppProvider>
          <LazyMotion features={domAnimation}>
            <MotionConfig reducedMotion={prefersReducedMotion ? "always" : "never"}>
              <TooltipProvider>
                {/* Premium theme background */}
                <ThemeBackground />

                {/* Premium onboarding flow */}
                {showOnboarding && <OnboardingFlow onComplete={() => setShowOnboarding(false)} />}

                {/* Premium viewport container with enhanced safe areas */}
                <div className={`fixed inset-0 flex flex-col w-full max-w-[430px] mx-auto bg-transparent overflow-hidden ${hasSafeArea ? 'dynamic-island-aware' : 'p-4 pb-20'}`}>
                  <Toaster />
                  <Sonner />

                  <BrowserRouter>
                    <SessionHandler>
                      <Suspense fallback={<PremiumLoadingScreen />}>
                        <Routes>
                          {/* Public routes */}
                          <Route path="/" element={<Index />} />
                          <Route path="/auth" element={<Auth />} />
                          <Route path="/auth/callback" element={<AuthCallback />} />

                          {/* Survey route (accessible after auth) */}
                          <Route path="/survey" element={
                            <ProtectedRoute>
                              <Survey />
                            </ProtectedRoute>
                          } />

                          {/* Protected routes with premium layout */}
                          <Route path="/home" element={
                            <ProtectedRoute>
                              <AppLayout>
                                <Home />
                              </AppLayout>
                            </ProtectedRoute>
                          } />
                          <Route path="/quests" element={
                            <ProtectedRoute>
                              <AppLayout>
                                <Quests />
                              </AppLayout>
                            </ProtectedRoute>
                          } />
                          <Route path="/coach" element={
                            <ProtectedRoute>
                              <AppLayout>
                                <Coach />
                              </AppLayout>
                            </ProtectedRoute>
                          } />
                          <Route path="/community" element={
                            <ProtectedRoute>
                              <AppLayout>
                                <Community />
                              </AppLayout>
                            </ProtectedRoute>
                          } />
                          <Route path="/profile" element={
                            <ProtectedRoute>
                              <AppLayout>
                                <Profile />
                              </AppLayout>
                            </ProtectedRoute>
                          } />
                          <Route path="/help" element={<Help />} />
                          <Route path="/admin" element={<Admin />} />

                          {/* Catch-all for 404s */}
                          <Route path="*" element={<NotFound />} />
                        </Routes>
                      </Suspense>
                    </SessionHandler>
                  </BrowserRouter>
                </div>
              </TooltipProvider>
            </MotionConfig>
          </LazyMotion>
        </AppProvider>
      </QueryClientProvider>
    </PremiumErrorBoundary>
  );
};

export default App;
