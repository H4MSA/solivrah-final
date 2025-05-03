
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeBackground } from '@/components/ThemeBackground';
import TabNavigation from '@/components/TabNavigation';
import Welcome from '@/pages/Welcome';
import Index from '@/pages/Index';
import Social from '@/pages/Social';
import Survey from '@/pages/Survey';
import Coach from '@/pages/Coach';
import Quests from '@/pages/Quests';
import Profile from '@/pages/Profile';
import Auth from '@/pages/Auth';
import NotFound from '@/pages/NotFound';
import AuthCallback from '@/pages/AuthCallback'; // Add this import
import './App.css';
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';

// Route guard component for authenticated routes
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading, hasCompletedOnboarding } = useAuth();
  
  if (isLoading) return <div className="loading-screen">Loading...</div>;
  
  // If not authenticated, redirect to welcome page
  if (!isAuthenticated) {
    return <Navigate to="/welcome" replace />;
  }
  
  // If authenticated but hasn't completed onboarding, redirect to survey
  if (isAuthenticated && !hasCompletedOnboarding) {
    return <Navigate to="/survey" replace />;
  }
  
  return <>{children}</>;
};

function App() {
  const { isAuthenticated } = useAuth();
  
  return (
    <>
      <ThemeBackground />
      <div className="min-h-screen w-full dynamic-island-aware relative">
        <Routes>
          {/* Public routes */}
          <Route path="/welcome" element={<Welcome />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/auth/callback" element={<AuthCallback />} /> {/* Add this route */}
          <Route path="/survey" element={<Survey />} />
          
          {/* Protected routes */}
          <Route path="/" element={
            <ProtectedRoute>
              <Index />
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
          <Route path="/social" element={
            <ProtectedRoute>
              <Social />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          
          {/* Catch all route for 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        {isAuthenticated && <TabNavigation />}
      </div>
    </>
  );
}

export default App;
