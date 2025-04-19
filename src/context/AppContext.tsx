
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Session, User } from "@supabase/supabase-js";
import { useToast } from "@/hooks/use-toast";

export interface AppContextType {
  selectedTheme: string;
  setSelectedTheme: (theme: string) => void;
  streak: number;
  xp: number;
  addXP: (amount: number) => void;
  incrementStreak: () => void;
  user: { id?: string; name: string; email?: string } | null;
  setUser: (user: { id?: string; name: string; email?: string } | null) => void;
  isGuest: boolean;
  setIsGuest: (isGuest: boolean) => void;
  resetProgress: () => void;
  loading: boolean;
  session: Session | null;
  signOut: () => Promise<void>;
}

const AppContext = createContext<AppContextType>({
  selectedTheme: "Dark",
  setSelectedTheme: () => {},
  streak: 0,
  xp: 0,
  addXP: () => {},
  incrementStreak: () => {},
  user: null,
  setUser: () => {},
  isGuest: false,
  setIsGuest: () => {},
  resetProgress: () => {},
  loading: true,
  session: null,
  signOut: async () => {},
});

export const useApp = () => useContext(AppContext);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedTheme, setSelectedTheme] = useState("Dark");
  const [streak, setStreak] = useState(0);
  const [xp, setXP] = useState(0);
  const [user, setUser] = useState<{ id?: string; name: string; email?: string } | null>(null);
  const [isGuest, setIsGuest] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);
  const { toast } = useToast();

  // Set up auth state listener FIRST to prevent deadlocks
  useEffect(() => {
    console.log("Setting up auth state listener");
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log("Auth state changed:", event);
        
        setSession(currentSession);
        
        if (currentSession?.user) {
          setUser({
            id: currentSession.user.id,
            name: currentSession.user.user_metadata?.name || 'User',
            email: currentSession.user.email,
          });
          setIsGuest(false);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setIsGuest(false);
        }
      }
    );
    
    // AFTER setting up the listener, check for existing session
    const checkSession = async () => {
      try {
        // Check for Supabase session first
        const { data } = await supabase.auth.getSession();
        const currentSession = data.session;
        
        if (currentSession?.user) {
          // User is authenticated with Supabase
          setSession(currentSession);
          setUser({
            id: currentSession.user.id,
            name: currentSession.user.user_metadata?.name || 'User',
            email: currentSession.user.email,
          });
          console.log("User authenticated from Supabase session");
          setIsGuest(false);
        } else {
          // No active session, check localStorage for guest data
          const storedUser = localStorage.getItem("user");
          const storedIsGuest = localStorage.getItem("isGuest");
          
          if (storedUser && storedIsGuest === "true") {
            try {
              setUser(JSON.parse(storedUser));
              setIsGuest(true);
              console.log("Guest user restored from localStorage");
            } catch (e) {
              console.error("Failed to parse user data", e);
              localStorage.removeItem("user");
              localStorage.removeItem("isGuest");
            }
          }
        }
        
        // Load progress data regardless of auth state
        const storedTheme = localStorage.getItem("selectedTheme");
        const storedStreak = localStorage.getItem("streak");
        const storedXP = localStorage.getItem("xp");
        
        if (storedTheme) setSelectedTheme(storedTheme);
        if (storedStreak) setStreak(parseInt(storedStreak));
        if (storedXP) setXP(parseInt(storedXP));
        
        setIsInitialized(true);
        setLoading(false);
      } catch (error) {
        console.error("Error checking auth session:", error);
        setLoading(false);
      }
    };
    
    checkSession();
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Save to localStorage whenever values change
  useEffect(() => {
    if (!isInitialized) return;
    
    const saveData = () => {
      localStorage.setItem("selectedTheme", selectedTheme);
      localStorage.setItem("streak", streak.toString());
      localStorage.setItem("xp", xp.toString());
      
      // Only save user data to localStorage if guest mode
      if (isGuest) {
        localStorage.setItem("isGuest", "true");
        if (user) localStorage.setItem("user", JSON.stringify(user));
      }
    };
    
    saveData();
  }, [selectedTheme, streak, xp, user, isGuest, isInitialized]);

  const addXP = useCallback((amount: number) => {
    setXP(prev => prev + amount);
  }, []);

  const incrementStreak = useCallback(() => {
    setStreak(prev => prev + 1);
  }, []);

  const resetProgress = useCallback(() => {
    setStreak(0);
    setXP(0);
    localStorage.setItem("streak", "0");
    localStorage.setItem("xp", "0");
    
    toast({
      title: "Progress Reset",
      description: "Your progress has been reset successfully!"
    });
    
    console.log("Progress reset successfully!");
  }, [toast]);

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      // Clear localStorage guest data if exists
      localStorage.removeItem("user");
      localStorage.removeItem("isGuest");
      setUser(null);
      setIsGuest(false);
      
      toast({
        title: "Signed out",
        description: "You have been signed out successfully."
      });
    } catch (error) {
      console.error("Error signing out:", error);
      toast({
        title: "Sign out failed",
        description: "There was an error signing out. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <AppContext.Provider value={{ 
      selectedTheme, 
      setSelectedTheme, 
      streak, 
      xp, 
      addXP, 
      incrementStreak,
      user,
      setUser,
      isGuest,
      setIsGuest,
      resetProgress,
      loading,
      session,
      signOut
    }}>
      {children}
    </AppContext.Provider>
  );
};
