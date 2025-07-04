
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import { ThemeBackground } from "./components/ThemeBackground";
import { TabNavigation } from "./components/TabNavigation";
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
import Admin from "./pages/Admin";

// Create a new QueryClient instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000,
    },
  },
});

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <TooltipProvider>
          <ThemeBackground />
          
          <div className="fixed inset-0 flex flex-col w-full max-w-[430px] mx-auto bg-transparent overflow-hidden">
            <Toaster />
            <Sonner />

            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/auth/callback" element={<AuthCallback />} />
                <Route path="/survey" element={<Survey />} />
                <Route path="/home" element={<Home />} />
                <Route path="/quests" element={<Quests />} />
                <Route path="/coach" element={<Coach />} />
                <Route path="/community" element={<Community />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/help" element={<Help />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
              <TabNavigation />
            </BrowserRouter>
          </div>
        </TooltipProvider>
      </AppProvider>
    </QueryClientProvider>
  );
};

export default App;
