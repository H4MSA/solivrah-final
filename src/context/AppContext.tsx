
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

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

  // Check for existing session on initial load
  useEffect(() => {
    const checkSession = async () => {
      try {
        // Check for Supabase session first
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          // User is authenticated with Supabase
          setUser({
            id: session.user.id,
            name: session.user.user_metadata?.name || 'User',
            email: session.user.email,
          });
          console.log("User authenticated from Supabase session");
        } else {
          // Check localStorage for saved user data as fallback
          const storedUser = localStorage.getItem("user");
          const storedIsGuest = localStorage.getItem("isGuest");
          
          if (storedUser) {
            try {
              setUser(JSON.parse(storedUser));
              console.log("User restored from localStorage");
            } catch (e) {
              console.error("Failed to parse user data", e);
              localStorage.removeItem("user");
            }
          }
          
          if (storedIsGuest) {
            setIsGuest(storedIsGuest === "true");
          }
        }
        
        // Load theme and progress data
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
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", event);
      
      if (event === 'SIGNED_IN' && session) {
        setUser({
          id: session.user.id,
          name: session.user.user_metadata?.name || 'User',
          email: session.user.email,
        });
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    });
    
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
      localStorage.setItem("isGuest", isGuest.toString());
      if (user) localStorage.setItem("user", JSON.stringify(user));
    };
    
    const timeoutId = setTimeout(saveData, 300);
    return () => clearTimeout(timeoutId);
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
    
    console.log("Progress reset successfully!");
  }, []);

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
      loading
    }}>
      {children}
    </AppContext.Provider>
  );
};
