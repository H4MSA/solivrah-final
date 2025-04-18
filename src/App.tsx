
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Home from "./pages/Home";
import Quests from "./pages/Quests";
import Coach from "./pages/Coach";
import Community from "./pages/Community";
import Profile from "./pages/Profile";
import Survey from "./pages/Survey";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import { AppProvider } from "./context/AppContext";
import { ThemeBackground } from "./components/ThemeBackground";
import { useEffect } from "react";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

const App = () => {
  // Request camera permission on app startup
  useEffect(() => {
    const requestCameraPermission = async () => {
      try {
        // Just check if we can access the camera
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        // Stop the stream immediately after checking permission
        stream.getTracks().forEach(track => track.stop());
        console.log("Camera permission granted");
      } catch (err) {
        console.warn("Camera permission not granted:", err);
      }
    };
    
    // Request permission when the app loads
    requestCameraPermission();
  }, []);
  
  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <TooltipProvider>
          {/* Theme background applied to the entire app */}
          <ThemeBackground />
          
          {/* Optimized for Android - using standard mobile width */}
          <div className="min-h-screen w-full max-w-[390px] mx-auto perspective-[1500px] transform-gpu overflow-hidden relative"> 
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/home" element={<Home />} />
                <Route path="/quests" element={<Quests />} />
                <Route path="/coach" element={<Coach />} />
                <Route path="/community" element={<Community />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/survey" element={<Survey />} />
                <Route path="/auth" element={<Auth />} />
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
