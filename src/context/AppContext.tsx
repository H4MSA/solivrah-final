import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import type { Session, User } from "@supabase/supabase-js";

interface AppContextType {
  xp: number;
  streak: number;
  selectedTheme: string;
  completedQuests: number;
  addXP: (amount: number) => void;
  increaseStreak: () => void;
  resetStreak: () => void;
  setSelectedTheme: (theme: string) => void;
  resetProgress: () => void;
  user: any;
  setUser: (user: User | null) => void;
  setSession: (session: Session | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user: authUser, isAuthenticated } = useAuth();
  const [xp, setXp] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [selectedTheme, setSelectedTheme] = useState<string>("Focus");
  const [completedQuests, setCompletedQuests] = useState<number>(0);
  const [user, setUser] = useState<any>(null);
  const [session, setSession] = useState<Session | null>(null);
  
  // Load user data from local storage or Supabase
  useEffect(() => {
    const loadUserData = async () => {
      if (isAuthenticated && authUser) {
        // Load from Supabase profiles table instead of users_progress
        try {
          const { data: userData } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', authUser.id)
            .maybeSingle();
          
          if (userData) {
            setXp(userData.xp || 0);
            setStreak(userData.streak || 0);
            setSelectedTheme(userData.theme || "Focus");
          }
          
          // Get completed quests count
          const { data: questsData, error: questsError } = await supabase
            .from('quests')
            .select('*')
            .eq('user_id', authUser.id)
            .eq('completed', true);
          
          setCompletedQuests(questsData?.length || 0);
          setUser(authUser);
          
        } catch (error) {
          console.error("Error loading user data:", error);
          
          // Fallback to defaults
          setXp(0);
          setStreak(0);
          setCompletedQuests(0);
          setSelectedTheme("Focus");
        }
      } else {
        // Anonymous user, load from localStorage
        const storedXp = localStorage.getItem('anonymous_xp');
        const storedStreak = localStorage.getItem('anonymous_streak');
        const storedTheme = localStorage.getItem('anonymous_theme');
        const storedQuests = localStorage.getItem('anonymous_completed_quests');
        
        setXp(storedXp ? parseInt(storedXp) : 0);
        setStreak(storedStreak ? parseInt(storedStreak) : 0);
        setCompletedQuests(storedQuests ? parseInt(storedQuests) : 0);
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
      // Save to Supabase profiles table
      try {
        await supabase
          .from('profiles')
          .upsert({
            id: authUser.id,
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
      localStorage.setItem('anonymous_completed_quests', completedQuests.toString());
    }
  };
  
  // Save data when it changes
  useEffect(() => {
    if (user) {
      saveUserData();
    }
  }, [xp, streak, selectedTheme, completedQuests, user]);
  
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
    setCompletedQuests(0);
    saveUserData();
  };
  
  const value = {
    xp,
    streak,
    selectedTheme,
    completedQuests,
    addXP,
    increaseStreak,
    resetStreak,
    setSelectedTheme,
    resetProgress,
    user,
    setUser,
    setSession
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
