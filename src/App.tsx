
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ThemeBackground } from "./components/ThemeBackground";
import { TabNavigation } from "./components/TabNavigation";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import Welcome from "./pages/Welcome";
import Home from "./pages/Home";
import Quests from "./pages/Quests";
import Coach from "./pages/Coach";
import Social from "./pages/Social";
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

// App Layout with Navigation
const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  
  // If user is not authenticated, don't render the app layout
  if (!isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <>
      {/* Main content area with scroll */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden page-transition dynamic-island-aware notch-aware gesture-area-aware pb-20">
        {children}
      </main>
      {/* TabNavigation always rendered for authenticated users */}
      <TabNavigation />
    </>
  );
};

// Protected route component using enhanced auth context
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading, isSkippingAuth } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-black">
        <div className="animate-spin w-8 h-8 border-t-2 border-white rounded-full"></div>
      </div>
    );
  }

  // Allow access if authenticated or skipping authentication
  if (!isAuthenticated && !isSkippingAuth) {
    return <Navigate to="/welcome" replace />;
  }

  return <>{children}</>;
};

// Survey route component that checks if survey is completed
const SurveyRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, hasCompletedOnboarding, isLoading, isSkippingAuth } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-black">
        <div className="animate-spin w-8 h-8 border-t-2 border-white rounded-full"></div>
      </div>
    );
  }

  // If not authenticated and not skipping auth, redirect to welcome
  if (!isAuthenticated && !isSkippingAuth) {
    return <Navigate to="/welcome" replace />;
  }

  // If authenticated or skipping auth but already completed onboarding, redirect to home
  if ((isAuthenticated || isSkippingAuth) && hasCompletedOnboarding) {
    return <Navigate to="/" replace />;
  }

  // Otherwise show the survey
  return <>{children}</>;
};

// Public route component that redirects authenticated users
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, hasCompletedOnboarding, isLoading, isSkippingAuth } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-black">
        <div className="animate-spin w-8 h-8 border-t-2 border-white rounded-full"></div>
      </div>
    );
  }

  // If authenticated or skipping auth and has completed onboarding, redirect to home
  if ((isAuthenticated || isSkippingAuth) && hasCompletedOnboarding) {
    return <Navigate to="/" replace />;
  }

  // If authenticated or skipping auth but hasn't completed onboarding, redirect to survey
  if ((isAuthenticated || isSkippingAuth) && !hasCompletedOnboarding) {
    return <Navigate to="/survey" replace />;
  }

  // Otherwise show the public route
  return <>{children}</>;
};

// Dynamic route resolver based on auth state
const RootRoute = () => {
  const { isAuthenticated, hasCompletedOnboarding, isLoading, isSkippingAuth } = useAuth();
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-black">
        <div className="animate-spin w-8 h-8 border-t-2 border-white rounded-full"></div>
      </div>
    );
  }
  
  if (!isAuthenticated && !isSkippingAuth) {
    return <Navigate to="/welcome" replace />;
  }
  
  if ((isAuthenticated || isSkippingAuth) && !hasCompletedOnboarding) {
    return <Navigate to="/survey" replace />;
  }
  
  return <Home />;
};

const App = () => {
  // Check if app is installed as PWA
  const [isPWA, setIsPWA] = useState(false);
  const [hasSafeArea, setHasSafeArea] = useState(false);
  
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
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppProvider>
          <AuthProvider>
            <TooltipProvider>
              {/* Theme background applied to the entire app */}
              <ThemeBackground />

              {/* Fixed viewport container with safe areas */}
              <div className={`fixed inset-0 flex flex-col w-full max-w-[430px] mx-auto bg-transparent overflow-hidden ${hasSafeArea ? 'dynamic-island-aware' : 'p-4 pb-20'}`}>
                <Toaster />
                <Sonner />

                <Routes>
                  {/* Welcome screen - public route */}
                  <Route 
                    path="/welcome" 
                    element={
                      <PublicRoute>
                        <Welcome />
                      </PublicRoute>
                    } 
                  />

                  {/* Auth routes - public */}
                  <Route 
                    path="/auth" 
                    element={
                      <PublicRoute>
                        <Auth />
                      </PublicRoute>
                    } 
                  />
                  <Route path="/auth/callback" element={<AuthCallback />} />

                  {/* Survey route - protected but requires onboarding check */}
                  <Route 
                    path="/survey" 
                    element={
                      <SurveyRoute>
                        <Survey />
                      </SurveyRoute>
                    }
                  />

                  {/* Root route - dynamically resolves based on auth state */}
                  <Route 
                    path="/" 
                    element={
                      <RootRoute />
                    } 
                  />

                  {/* Protected app routes */}
                  <Route
                    path="/home"
                    element={
                      <ProtectedRoute>
                        <AppLayout>
                          <Home />
                        </AppLayout>
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/quests"
                    element={
                      <ProtectedRoute>
                        <AppLayout>
                          <Quests />
                        </AppLayout>
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/coach"
                    element={
                      <ProtectedRoute>
                        <AppLayout>
                          <Coach />
                        </AppLayout>
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/social"
                    element={
                      <ProtectedRoute>
                        <AppLayout>
                          <Social />
                        </AppLayout>
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/profile"
                    element={
                      <ProtectedRoute>
                        <AppLayout>
                          <Profile />
                        </AppLayout>
                      </ProtectedRoute>
                    }
                  />

                  {/* Catch-all for 404s */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </div>
            </TooltipProvider>
          </AuthProvider>
        </AppProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
