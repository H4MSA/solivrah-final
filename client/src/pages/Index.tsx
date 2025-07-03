
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppProvider } from "@/context/AppContext";
import { TabNavigation } from "@/components/layouts/TabNavigation";
import { ThemeBackground } from "@/components/layouts/ThemeBackground";
import { NetworkStatusIndicator } from "@/components/common/NetworkStatusIndicator";

// Page imports
import Home from "@/pages/Home";
import Auth from "@/pages/Auth";
import Quests from "@/pages/Quests";
import Coach from "@/pages/Coach";
import Community from "@/pages/Community";
import Profile from "@/pages/Profile";
import Survey from "@/pages/Survey";
import Help from "@/pages/Help";
import NotFound from "@/pages/NotFound";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  // For now, just render children without authentication check
  return <>{children}</>;
};

function App() {
  return (
    <TooltipProvider>
      <AppProvider>
        <Router>
          <ThemeBackground />
          <NetworkStatusIndicator />
          
          <div className="min-h-screen pb-20">
            <Routes>
              <Route path="/auth" element={<Auth />} />
              <Route path="/survey" element={<Survey />} />
              <Route path="/help" element={<Help />} />
              
              <Route path="/" element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              } />
              
              <Route path="/quests" element={
                <ProtectedRoute>
                  <Quests />
                </ProtectedRoute>
              } />
              
              <Route path="/coach" element={
                <ProtectedRoute>
                  <Coach />
                </ProtectedRoute>
              } />
              
              <Route path="/community" element={
                <ProtectedRoute>
                  <Community />
                </ProtectedRoute>
              } />
              
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
          
          <TabNavigation />
          <Toaster />
        </Router>
      </AppProvider>
    </TooltipProvider>
  );
}

export default App;
