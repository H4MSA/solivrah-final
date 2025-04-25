
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import { AppProvider, useApp } from "./context/AppContext";
import { ThemeBackground } from "./components/ThemeBackground";
import { TabNavigation } from "./components/TabNavigation";
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
  const { setUser, setSession } = useApp();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // Set up auth state listener FIRST (critical for avoiding auth deadlocks)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("Auth state changed:", event);
        setSession(session);
        setUser(session?.user ?? null);
      }
    );

    // Check for existing session
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        console.log("Initial session check:", session?.user?.email || "No session");
        setSession(session);
        setUser(session?.user ?? null);
      } catch (error) {
        console.error("Session check error:", error);
      } finally {
        setChecking(false);
      }
    };
    
    checkSession();

    return () => {
      subscription.unsubscribe();
    };
  }, [setUser, setSession]);

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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-black">
        <div className="animate-spin w-8 h-8 border-t-2 border-white rounded-full"></div>
      </div>
    );
  }

  if (!user && !isGuest) {
    // Save the attempted URL for redirecting after login
    const returnUrl = location.pathname !== "/auth" ? location.pathname : "/home";
    return <Navigate to="/auth" state={{ returnUrl }} replace />;
  }

  return <>{children}</>;
};

// App Layout with Navigation
const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const showNavigation = ['/home', '/quests', '/community', '/coach', '/profile'].includes(location.pathname);

  return (
    <>
      {/* Main content area with scroll */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden page-transition">
        {children}
      </main>

      {/* Only show TabNavigation on app pages, not on public pages */}
      {showNavigation && <TabNavigation />}
    </>
  );
};

const App = () => {
  // Check if app is installed as PWA
  const [isPWA, setIsPWA] = useState(false);
  
  useEffect(() => {
    // Check if app is running as installed PWA
    const isPWACheck = window.matchMedia('(display-mode: standalone)').matches;
    setIsPWA(isPWACheck);
    
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
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <TooltipProvider>
          {/* Theme background applied to the entire app */}
          <ThemeBackground />

          {/* Fixed viewport container with safe areas */}
          <div className="fixed inset-0 flex flex-col w-full max-w-[430px] mx-auto bg-black overflow-hidden dynamic-island-aware">
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

                  {/* Catch-all for 404s */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </SessionHandler>
            </BrowserRouter>
          </div>
        </TooltipProvider>
      </AppProvider>
    </QueryClientProvider>
  );
};

export default App;
