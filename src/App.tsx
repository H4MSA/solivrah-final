
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import { ThemeBackground } from "./components/ThemeBackground";
import { TabNavigation } from "./components/TabNavigation";  // Add this import
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
              {/* Main content area with scroll */}
              <main className="flex-1 overflow-y-auto overflow-x-hidden">
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
              </main>
              <TabNavigation />
            </BrowserRouter>
          </div>
        </TooltipProvider>
      </AppProvider>
    </QueryClientProvider>
  );
};

export default App;
