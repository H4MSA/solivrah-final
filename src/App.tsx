
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import { ThemeBackground } from "./components/ThemeBackground";
import { TabNavigation } from "./components/TabNavigation";
import { useApp } from "./context/AppContext";
import Index from "./pages/Index";
import Home from "./pages/Home";
import Quests from "./pages/Quests";
import Coach from "./pages/Coach";
import Community from "./pages/Community";
import Profile from "./pages/Profile";
import Survey from "./pages/Survey";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000,
    },
  },
});

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useApp();
  
  if (loading) {
    return <div className="flex items-center justify-center h-screen bg-black">
      <div className="animate-spin w-8 h-8 border-t-2 border-white rounded-full"></div>
    </div>;
  }
  
  if (!user) {
    return <Navigate to="/auth" replace />;
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
      <main className="flex-1 overflow-y-auto overflow-x-hidden">
        {children}
      </main>
      
      {/* Only show TabNavigation on app pages, not on public pages */}
      {showNavigation && <TabNavigation />}
    </>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <TooltipProvider>
          {/* Theme background applied to the entire app */}
          <ThemeBackground />
          
          {/* Fixed viewport container */}
          <div className="fixed inset-0 flex flex-col w-full max-w-[390px] mx-auto bg-black overflow-hidden">
            <Toaster />
            <Sonner />
            
            <BrowserRouter>
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/survey" element={<Survey />} />
                
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
            </BrowserRouter>
          </div>
        </TooltipProvider>
      </AppProvider>
    </QueryClientProvider>
  );
};

export default App;
