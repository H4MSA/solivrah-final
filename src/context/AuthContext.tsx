import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  hasCompletedOnboarding: boolean;
  checkAuthStatus: () => Promise<boolean>;
  setHasCompletedOnboarding: (status: boolean) => void;
  logOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState<boolean>(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  // Check if the user has completed onboarding
  const checkOnboardingStatus = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('survey_responses')
        .select('*')
        .eq('user_id', userId)
        .single();
      
      if (data) {
        setHasCompletedOnboarding(true);
        localStorage.setItem('onboardingComplete', 'true');
      } else {
        setHasCompletedOnboarding(false);
        localStorage.setItem('onboardingComplete', 'false');
      }
    } catch (error) {
      console.error("Error checking onboarding status:", error);
      setHasCompletedOnboarding(false);
      localStorage.setItem('onboardingComplete', 'false');
    }
  };

  // Check authentication status
  const checkAuthStatus = async (): Promise<boolean> => {
    try {
      setIsLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        setIsAuthenticated(true);
        await checkOnboardingStatus(session.user.id);
        return true;
      } else {
        setIsAuthenticated(false);
        setHasCompletedOnboarding(false);
        return false;
      }
    } catch (error) {
      console.error("Error checking auth status:", error);
      setIsAuthenticated(false);
      setHasCompletedOnboarding(false);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Log out
  const logOut = async () => {
    try {
      setIsLoading(true);
      await supabase.auth.signOut();
      localStorage.removeItem('authToken');
      localStorage.removeItem('onboardingComplete');
      setIsAuthenticated(false);
      setHasCompletedOnboarding(false);
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account.",
      });
      navigate('/welcome', { replace: true });
    } catch (error) {
      console.error("Error logging out:", error);
      toast({
        variant: "destructive",
        title: "Log out failed",
        description: "There was a problem logging you out."
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Check auth status on component mount and route changes
  useEffect(() => {
    const setupAuthListener = async () => {
      // Set up the auth state change listener
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          if (session) {
            setIsAuthenticated(true);
            localStorage.setItem('authToken', session.access_token);
            await checkOnboardingStatus(session.user.id);
          } else {
            setIsAuthenticated(false);
            setHasCompletedOnboarding(false);
            localStorage.removeItem('authToken');
          }
        }
      );

      // Initial auth check
      await checkAuthStatus();
      
      // Clean up subscription on unmount
      return () => {
        subscription.unsubscribe();
      };
    };

    setupAuthListener();
  }, []);

  useEffect(() => {
    // Handle redirects based on authentication state
    const handleRouteBasedOnAuth = async () => {
      // Don't redirect during loading
      if (isLoading) return;

      const publicRoutes = ['/welcome', '/auth', '/auth/callback'];
      const currentPath = location.pathname;

      if (isAuthenticated) {
        // If authenticated but on a public route
        if (publicRoutes.includes(currentPath)) {
          // If user hasn't completed onboarding, go to survey
          if (!hasCompletedOnboarding) {
            navigate('/survey', { replace: true });
          } else {
            // Otherwise go to home
            navigate('/', { replace: true });
          }
        } else if (currentPath === '/survey' && hasCompletedOnboarding) {
          // If survey is completed but user is on survey page
          navigate('/', { replace: true });
        }
      } else {
        // If not authenticated and not on a public route
        if (!publicRoutes.includes(currentPath)) {
          navigate('/welcome', { replace: true });
        }
      }
    };

    handleRouteBasedOnAuth();
  }, [isAuthenticated, hasCompletedOnboarding, location.pathname, isLoading, navigate]);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        hasCompletedOnboarding,
        checkAuthStatus,
        setHasCompletedOnboarding,
        logOut
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};
