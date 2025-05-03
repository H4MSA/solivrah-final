
import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import type { AuthError, Session, User } from "@supabase/supabase-js";
import { useToast } from "@/hooks/use-toast";
import type { Database } from "@/integrations/supabase/types";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  hasCompletedOnboarding: boolean;
  signUp: (email: string, password: string) => Promise<{ 
    error: AuthError | null; 
    data: { user: User | null; session: Session | null } 
  }>;
  signIn: (email: string, password: string) => Promise<{ 
    error: AuthError | null; 
    data: { user: User | null; session: Session | null } 
  }>;
  signOut: () => Promise<void>;
  skipAuthentication: () => void;
  setHasCompletedOnboarding: (value: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState<boolean>(false);
  
  useEffect(() => {
    // Check if user has skipped authentication
    const skippedAuth = localStorage.getItem('skipAuthentication') === 'true';
    const completedOnboarding = localStorage.getItem('onboardingComplete') === 'true';
    
    if (skippedAuth) {
      setHasCompletedOnboarding(completedOnboarding);
    }
    
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setIsLoading(false);
        
        // Check if user has completed onboarding
        if (session?.user) {
          const checkOnboarding = async () => {
            try {
              const { data } = await supabase
                .from('survey_responses')
                .select('*')
                .eq('user_id', session.user.id)
                .maybeSingle();
              
              setHasCompletedOnboarding(!!data);
            } catch (error) {
              console.error("Error checking onboarding status:", error);
            }
          };
          
          // Use setTimeout to avoid Supabase deadlock
          setTimeout(() => {
            checkOnboarding();
          }, 0);
        }
      }
    );
    
    // Then check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
      
      // Check if user has completed onboarding
      if (session?.user) {
        const checkOnboarding = async () => {
          try {
            const { data } = await supabase
              .from('survey_responses')
              .select('*')
              .eq('user_id', session.user.id)
              .maybeSingle();
            
            setHasCompletedOnboarding(!!data);
          } catch (error) {
            console.error("Error checking onboarding status:", error);
          }
        };
        
        checkOnboarding();
      }
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);
  
  const signUp = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    
    if (error) {
      toast({
        variant: "destructive",
        title: "Sign up failed",
        description: error.message,
      });
    } else if (data?.user) {
      toast({
        title: "Sign up successful",
        description: "Welcome to your personal growth journey!",
      });
      navigate("/survey");
    }
    
    return { error, data };
  };
  
  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      toast({
        variant: "destructive",
        title: "Sign in failed",
        description: error.message,
      });
    } else if (data?.user) {
      toast({
        title: "Sign in successful",
        description: "Welcome back!",
      });
      
      // Check if user has completed onboarding
      try {
        const { data: surveyData } = await supabase
          .from('survey_responses')
          .select('*')
          .eq('user_id', data.user.id)
          .maybeSingle();
        
        setHasCompletedOnboarding(!!surveyData);
        
        if (surveyData) {
          navigate("/");
        } else {
          navigate("/survey");
        }
      } catch (error) {
        console.error("Error checking onboarding status:", error);
        navigate("/survey");
      }
    }
    
    return { error, data };
  };
  
  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setHasCompletedOnboarding(false);
    localStorage.removeItem('skipAuthentication');
    localStorage.removeItem('onboardingComplete');
    navigate("/welcome");
  };
  
  const skipAuthentication = () => {
    localStorage.setItem('skipAuthentication', 'true');
    setHasCompletedOnboarding(false);
    navigate("/survey");
  };
  
  const value = {
    user,
    session,
    isAuthenticated: !!user || localStorage.getItem('skipAuthentication') === 'true',
    isLoading,
    hasCompletedOnboarding,
    signUp,
    signIn,
    signOut,
    skipAuthentication,
    setHasCompletedOnboarding,
  };
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
