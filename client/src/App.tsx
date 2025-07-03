import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { MobileOptimization, useMobileOptimization } from "@/components/ui/mobile-optimization";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import { AppProvider, useApp } from "./context/AppContext";
import { AppShell } from "./components/ui/app-shell";
import { ThemeBackground } from "./components/ThemeBackground";
import { TabNavigation } from "./components/TabNavigation";
import { NetworkStatusIndicator } from "./components/NetworkStatusIndicator";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import Index from "./pages/Index";
import Home from "./pages/Home";
import Quests from "./pages/Quests";
import Coach from "./pages/Coach";
import Community from "./pages/Community";
import Profile from "./pages/Profile";
import Survey from "./pages/Survey";
import Auth from "./pages/Auth";
import AuthCallback from "./pages/AuthCallback";
import NotFound from "./pages/NotFound";
import { Help } from "./pages/Help";
import { ContextHelp } from "./components/ContextHelp";
import { OnboardingFlow } from "./components/OnboardingFlow";
import Admin from "./pages/Admin";

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
    return (
      <div className="flex items-center justify-center h-screen bg-black">
        <div className="animate-spin w-8 h-8 border-t-2 border-white rounded-full"></div>
      </div>
    );
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
    return (
      <div className="flex items-center justify-center h-screen bg-black">
        <div className="animate-spin w-8 h-8 border-t-2 border-white rounded-full"></div>
      </div>
    );
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
    <div className="flex flex-col h-screen w-full overflow-hidden bg-gray-100"> {/* Added background color */}
      {/* Network status indicator */}
      <NetworkStatusIndicator position="top" variant="minimal" />

      {/* Main content area with proper mobile scroll */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden">
        <div className="min-h-full">
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
  // Check if app is installed as PWA
  const [isPWA, setIsPWA] = useState(false);
  const [hasSafeArea, setHasSafeArea] = useState(false);

  // Add state for onboarding
  const [showOnboarding, setShowOnboarding] = useState(() => {
    return localStorage.getItem('onboardingCompleted') !== 'true';
  });

  useEffect(() => {
    // Check if app is running as installed PWA
    const isPWACheck = window.matchMedia('(display-mode: standalone)').matches;
    setIsPWA(isPWACheck);

    // Check for device with safe areas
    const detectSafeArea = () => {
      const hasSafeAreaInsets = 
        window.CSS && CSS.supports('padding-top: env(safe-area-inset-top)') && 
        (Number(getComputedStyle(document.documentElement).getPropertyValue('--sat').trim()) > 0 ||
         window.innerWidth >= 375);

      setHasSafeArea(hasSafeAreaInsets);

      // Add CSS variables for detection
      document.documentElement.style.setProperty('--sat', 'env(safe-area-inset-top, 0px)');
      document.documentElement.style.setProperty('--sab', 'env(safe-area-inset-bottom, 0px)');
      document.documentElement.style.setProperty('--sal', 'env(safe-area-inset-left, 0px)');
      document.documentElement.style.setProperty('--sar', 'env(safe-area-inset-right, 0px)');

      // Add classes to handle different devices
      if (hasSafeAreaInsets) {
        document.body.classList.add('has-safe-area');

        // Check for iPhone X and newer with notch
        if (window.innerWidth >= 375 && window.innerHeight >= 812) {
          document.body.classList.add('has-notch');
        }

        // Check for iPhone with Dynamic Island
        if (window.innerWidth >= 390 && window.innerHeight >= 844) {
          document.body.classList.add('has-dynamic-island');
        }
      }
    };

    detectSafeArea();

    // Request camera permission on mobile devices
    const requestCameraPermission = async () => {
      if ('mediaDevices' in navigator && isPWACheck) {
        try {
          // Just check if we can access the camera
          const devices = await navigator.mediaDevices.enumerateDevices();
          const hasCamera = devices.some(device => device.kind === 'videoinput');

          if (hasCamera) {
            console.log("Camera access is available");
          }
        } catch (err) {
          console.log("Camera access may require permission", err);
        }
      }
    };

    requestCameraPermission();

    // Performance improvements
    // Use passive event listeners for better scroll performance
    const opts = { passive: true };
    document.addEventListener('touchstart', () => {}, opts);
    document.addEventListener('touchmove', () => {}, opts);

    // Optimize image loading
    if ('loading' in HTMLImageElement.prototype) {
      const images = document.querySelectorAll('img[loading="lazy"]');
      images.forEach(img => {
        img.setAttribute('loading', 'lazy');
      });
    }

    return () => {
      document.removeEventListener('touchstart', () => {});
      document.removeEventListener('touchmove', () => {});
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <AppShell>
          <TooltipProvider>
            {/* Theme background applied to the entire app */}
            <ThemeBackground />

            {/* Onboarding flow for first-time users */}
            {showOnboarding && <OnboardingFlow onComplete={() => setShowOnboarding(false)} />}

            {/* Mobile-optimized viewport container */}
            <div className="h-screen w-screen max-w-sm mx-auto bg-transparent overflow-hidden">
              <Toaster />
              <Sonner />

              <BrowserRouter>
                <SessionHandler>
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

                    {/* Protected routes with TabNavigation */}
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
                </SessionHandler>
              </BrowserRouter>
            </div>
          </TooltipProvider>
        </AppShell>
      </AppProvider>
    </QueryClientProvider>
  );
};

export default App;