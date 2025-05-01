import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  hasCompletedOnboarding: boolean;
  isSkippingAuth: boolean;
  checkAuthStatus: () => Promise<boolean>;
  setHasCompletedOnboarding: (status: boolean) => void;
  skipAuthentication: () => void;
  logOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState<boolean>(false);
  const [isSkippingAuth, setIsSkippingAuth] = useState<boolean>(false);
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
      
      // First check if user is skipping authentication
      const isSkipping = localStorage.getItem('skipAuthentication') === 'true';
      setIsSkippingAuth(isSkipping);
      
      if (isSkipping) {
        setIsAuthenticated(true);
        setHasCompletedOnboarding(localStorage.getItem('onboardingComplete') === 'true');
        return true;
      }
      
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        setIsAuthenticated(true);
        await checkOnboardingStatus(session.user.id);
        
        // Check if user is a guest from metadata
        const isGuestUser = session.user?.user_metadata?.isGuest === true;
        console.log("User is guest:", isGuestUser, session.user?.user_metadata);
        
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

  // Skip authentication
  const skipAuthentication = () => {
    localStorage.setItem('skipAuthentication', 'true');
    setIsSkippingAuth(true);
    setIsAuthenticated(true);
    
    // Mark onboarding as not completed so user goes to survey
    setHasCompletedOnboarding(false);
    localStorage.setItem('onboardingComplete', 'false');
    
    toast({
      title: "Exploring the app",
      description: "You're now exploring the app without an account.",
    });
    
    navigate('/survey', { replace: true });
  };

  // Log out
  const logOut = async () => {
    try {
      setIsLoading(true);
      
      // Check if user was skipping authentication
      if (isSkippingAuth) {
        localStorage.removeItem('skipAuthentication');
        setIsSkippingAuth(false);
      } else {
        await supabase.auth.signOut();
      }
      
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
      // Check if user is skipping authentication
      const isSkipping = localStorage.getItem('skipAuthentication') === 'true';
      if (isSkipping) {
        setIsSkippingAuth(true);
        setIsAuthenticated(true);
        setHasCompletedOnboarding(localStorage.getItem('onboardingComplete') === 'true');
        setIsLoading(false);
        return;
      }
      
      // Set up the auth state change listener
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          console.log("Auth state changed:", event, session?.user?.email);
          
          if (session) {
            setIsAuthenticated(true);
            localStorage.setItem('authToken', session.access_token);
            
            // Check if user is a guest from metadata
            const isGuestUser = session.user?.user_metadata?.isGuest === true;
            console.log("User is guest:", isGuestUser, session.user?.user_metadata);
            
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

  // Handle redirects based on authentication state
  useEffect(() => {
    // Don't redirect during loading
    if (isLoading) return;

    const publicRoutes = ['/welcome', '/auth', '/auth/callback'];
    const currentPath = location.pathname;

    // If skipping authentication, allow access to all routes
    if (isSkippingAuth) {
      if (publicRoutes.includes(currentPath)) {
        // If on public route, go to home or survey depending on onboarding status
        if (hasCompletedOnboarding) {
          navigate('/', { replace: true });
        } else {
          navigate('/survey', { replace: true });
        }
      } else if (currentPath === '/survey' && hasCompletedOnboarding) {
        // If survey is completed but user is on survey page
        navigate('/', { replace: true });
      }
      return;
    }

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
  }, [isAuthenticated, hasCompletedOnboarding, isSkippingAuth, location.pathname, isLoading, navigate]);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        hasCompletedOnboarding,
        isSkippingAuth,
        checkAuthStatus,
        setHasCompletedOnboarding,
        skipAuthentication,
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
