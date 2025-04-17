
import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

type User = {
  id: string;
  name: string;
  email: string;
  bio?: string;
  avatarUrl?: string;
};

export type Theme = "Discipline" | "Focus" | "Resilience" | "Wildcards";

export interface ThemeColors {
  gradientStart: string;
  gradientEnd: string;
  accent: string;
  card: string;
  cardBorder: string;
}

// Theme color configurations
export const themeColors: Record<Theme, ThemeColors> = {
  Discipline: {
    gradientStart: "#FF0000", // Bright Red
    gradientEnd: "#6B0000", // Dark Red
    accent: "#FF3333",
    card: "rgba(107, 0, 0, 0.15)",
    cardBorder: "rgba(255, 0, 0, 0.2)"
  },
  Focus: {
    gradientStart: "#008080", // Teal
    gradientEnd: "#000046", // Dark Blue
    accent: "#00A0A0",
    card: "rgba(0, 0, 70, 0.15)",
    cardBorder: "rgba(0, 128, 128, 0.2)"
  },
  Resilience: {
    gradientStart: "#FFA500", // Orange
    gradientEnd: "#8B4513", // Dark Brown
    accent: "#FFB52E",
    card: "rgba(139, 69, 19, 0.15)",
    cardBorder: "rgba(255, 165, 0, 0.2)"
  },
  Wildcards: {
    gradientStart: "#00FF00", // Lime Green
    gradientEnd: "#006400", // Dark Green
    accent: "#33FF33",
    card: "rgba(0, 100, 0, 0.15)",
    cardBorder: "rgba(0, 255, 0, 0.2)"
  }
};

interface AppContextType {
  isGuest: boolean;
  selectedTheme: Theme;
  streak: number;
  xp: number;
  user: User | null;
  themeColors: ThemeColors;
  setIsGuest: (value: boolean) => void;
  setSelectedTheme: (theme: Theme) => void;
  incrementStreak: () => void;
  addXP: (amount: number) => void;
  setUser: (user: User | null) => void;
  updateUserProfile: (data: Partial<User>) => void;
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
  
  const updateUserProfile = (data: Partial<User>) => {
    if (!user) return;
    setUser({
      ...user,
      ...data
    });
    
    // In a real app, you would also update the user profile in your database
    // For example, using Supabase:
    // if (!isGuest && user) {
    //   supabase.from('profiles').upsert({
    //     id: user.id,
    //     ...data
    //   }).then(console.log).catch(console.error);
    // }
  };
  
  const value = {
    isGuest,
    selectedTheme,
    streak,
    xp,
    user,
    themeColors: themeColors[selectedTheme],
    setIsGuest,
    setSelectedTheme,
    incrementStreak,
    addXP,
    setUser,
    updateUserProfile
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
