
import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

type User = {
  id: string;
  name: string;
  email: string;
};

type Theme = "Discipline" | "Focus" | "Resilience" | "Wildcards";

interface AppContextType {
  isGuest: boolean;
  selectedTheme: Theme;
  streak: number;
  xp: number;
  user: User | null;
  setIsGuest: (value: boolean) => void;
  setSelectedTheme: (theme: Theme) => void;
  incrementStreak: () => void;
  addXP: (amount: number) => void;
  setUser: (user: User | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [isGuest, setIsGuest] = useState(true);
  const [selectedTheme, setSelectedTheme] = useState<Theme>("Discipline");
  const [streak, setStreak] = useState(0);
  const [xp, setXP] = useState(0);
  const [user, setUser] = useState<User | null>(null);
  
  // Load saved data from local storage for guest users
  useEffect(() => {
    if (isGuest) {
      const savedTheme = localStorage.getItem("solivrah-theme");
      const savedStreak = localStorage.getItem("solivrah-streak");
      const savedXP = localStorage.getItem("solivrah-xp");
      
      if (savedTheme) setSelectedTheme(savedTheme as Theme);
      if (savedStreak) setStreak(parseInt(savedStreak));
      if (savedXP) setXP(parseInt(savedXP));
    }
  }, [isGuest]);
  
  // Save data to local storage for guest users
  useEffect(() => {
    if (isGuest) {
      localStorage.setItem("solivrah-theme", selectedTheme);
      localStorage.setItem("solivrah-streak", streak.toString());
      localStorage.setItem("solivrah-xp", xp.toString());
    }
  }, [isGuest, selectedTheme, streak, xp]);
  
  const incrementStreak = () => {
    setStreak(prev => prev + 1);
  };
  
  const addXP = (amount: number) => {
    setXP(prev => prev + amount);
  };
  
  const value = {
    isGuest,
    selectedTheme,
    streak,
    xp,
    user,
    setIsGuest,
    setSelectedTheme,
    incrementStreak,
    addXP,
    setUser
  };
  
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
