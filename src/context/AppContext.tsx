
import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User, Session, AuthChangeEvent } from "@supabase/supabase-js";
import { AuthService } from "@/services/AuthService";

interface AppContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  setSession: (session: Session | null) => void;
  selectedTheme: string;
  setSelectedTheme: (theme: string) => void;
  streak: number;
  xp: number;
  addXP: (amount: number) => void;
  incrementStreak: () => void;
  resetProgress: () => void;
  isGuest: boolean;
  signOut: () => Promise<void>;
}

const AppContext = createContext<AppContextType>({
  user: null,
  session: null,
  loading: true,
  setUser: () => {},
  setSession: () => {},
  selectedTheme: "Discipline",
  setSelectedTheme: () => {},
  streak: 0,
  xp: 0,
  addXP: () => {},
  incrementStreak: () => {},
  resetProgress: () => {},
  isGuest: false,
  signOut: async () => {},
});

export const useApp = () => useContext(AppContext);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTheme, setSelectedTheme] = useState("Discipline");
  const [streak, setStreak] = useState(0);
  const [xp, setXP] = useState(0);
  const [isGuest, setIsGuest] = useState(false);
  
  useEffect(() => {
    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event: AuthChangeEvent, session: Session | null) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );
    
    // Get current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      
      // If user is logged in, fetch their profile data
      if (session?.user) {
        fetchUserProfile(session.user.id);
      }
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);
  
  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) throw error;
      
      if (data) {
        setSelectedTheme(data.theme || "Discipline");
        setStreak(data.streak || 0);
        setXP(data.xp || 0);
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };
  
  const addXP = async (amount: number) => {
    if (!user) return;
    
    const newXP = xp + amount;
    setXP(newXP);
    
    try {
      await supabase
        .from('profiles')
        .update({ xp: newXP })
        .eq('id', user.id);
    } catch (error) {
      console.error("Error updating XP:", error);
    }
  };
  
  const incrementStreak = async () => {
    if (!user) return;
    
    const newStreak = streak + 1;
    setStreak(newStreak);
    
    try {
      await supabase
        .from('profiles')
        .update({ streak: newStreak })
        .eq('id', user.id);
    } catch (error) {
      console.error("Error updating streak:", error);
    }
  };
  
  const updateSelectedTheme = async (theme: string) => {
    setSelectedTheme(theme);
    
    if (user) {
      try {
        await supabase
          .from('profiles')
          .update({ theme })
          .eq('id', user.id);
      } catch (error) {
        console.error("Error updating theme:", error);
      }
    }
  };
  
  const resetProgress = async () => {
    if (!user) return;
    
    setStreak(0);
    setXP(0);
    
    try {
      await supabase
        .from('profiles')
        .update({ streak: 0, xp: 0 })
        .eq('id', user.id);
    } catch (error) {
      console.error("Error resetting progress:", error);
    }
  };
  
  const signOut = async () => {
    try {
      await AuthService.signOut();
      setUser(null);
      setSession(null);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };
  
  return (
    <AppContext.Provider
      value={{
        user,
        session,
        loading,
        setUser,
        setSession,
        selectedTheme,
        setSelectedTheme: updateSelectedTheme,
        streak,
        xp,
        addXP,
        incrementStreak,
        resetProgress,
        isGuest,
        signOut,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
