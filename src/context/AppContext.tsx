
import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";

interface AppContextType {
  xp: number;
  streak: number;
  selectedTheme: string;
  addXP: (amount: number) => void;
  increaseStreak: () => void;
  resetStreak: () => void;
  setSelectedTheme: (theme: string) => void;
  resetProgress: () => void;
  user: any; // This should be replaced with a proper user type
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user: authUser, isAuthenticated } = useAuth();
  const [xp, setXp] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [selectedTheme, setSelectedTheme] = useState<string>("Focus");
  const [user, setUser] = useState<any>(null);
  
  // Load user data from local storage or Supabase
  useEffect(() => {
    const loadUserData = async () => {
      if (isAuthenticated && authUser) {
        // Load from Supabase
        try {
          const { data: userData } = await supabase
            .from('users_progress')
            .select('*')
            .eq('user_id', authUser.id)
            .maybeSingle();
          
          if (userData) {
            setXp(userData.xp || 0);
            setStreak(userData.streak || 0);
            setSelectedTheme(userData.theme || "Focus");
          } else {
            // Create initial record
            await supabase
              .from('users_progress')
              .insert({
                user_id: authUser.id,
                xp: 0,
                streak: 0,
                theme: "Focus"
              });
          }
          
          setUser(authUser);
        } catch (error) {
          console.error("Error loading user data:", error);
          
          // Fallback to defaults
          setXp(0);
          setStreak(0);
          setSelectedTheme("Focus");
        }
      } else {
        // Anonymous user, load from localStorage
        const storedXp = localStorage.getItem('anonymous_xp');
        const storedStreak = localStorage.getItem('anonymous_streak');
        const storedTheme = localStorage.getItem('anonymous_theme');
        
        setXp(storedXp ? parseInt(storedXp) : 0);
        setStreak(storedStreak ? parseInt(storedStreak) : 0);
        setSelectedTheme(storedTheme || "Focus");
        
        // Create basic anonymous user object
        setUser({
          id: 'anonymous',
          email: 'anonymous@example.com',
          user_metadata: { username: 'Guest' }
        });
      }
    };
    
    loadUserData();
  }, [isAuthenticated, authUser]);
  
  // Save user data
  const saveUserData = async () => {
    if (isAuthenticated && authUser) {
      // Save to Supabase
      try {
        await supabase
          .from('users_progress')
          .upsert({
            user_id: authUser.id,
            xp,
            streak,
            theme: selectedTheme
          });
      } catch (error) {
        console.error("Error saving user data:", error);
      }
    } else {
      // Anonymous user, save to localStorage
      localStorage.setItem('anonymous_xp', xp.toString());
      localStorage.setItem('anonymous_streak', streak.toString());
      localStorage.setItem('anonymous_theme', selectedTheme);
    }
  };
  
  // Save data when it changes
  useEffect(() => {
    if (user) {
      saveUserData();
    }
  }, [xp, streak, selectedTheme, user]);
  
  const addXP = (amount: number) => {
    setXp(prev => prev + amount);
  };
  
  const increaseStreak = () => {
    setStreak(prev => prev + 1);
  };
  
  const resetStreak = () => {
    setStreak(0);
  };
  
  const resetProgress = () => {
    setXp(0);
    setStreak(0);
    saveUserData();
  };
  
  const value = {
    xp,
    streak,
    selectedTheme,
    addXP,
    increaseStreak,
    resetStreak,
    setSelectedTheme,
    resetProgress,
    user
  };
  
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
