
import React, { createContext, useContext, useState, useEffect } from "react";

// User type
interface User {
  name: string;
  email?: string;
  id?: string;
  photoURL?: string;
  bio?: string;
}

// AppContext type
interface AppContextType {
  selectedTheme: "Discipline" | "Focus" | "Resilience" | "Wildcards";
  setSelectedTheme: (theme: "Discipline" | "Focus" | "Resilience" | "Wildcards") => void;
  streak: number;
  xp: number;
  addXP: (amount: number) => void;
  resetProgress: () => void;
  user: User | null;
  setUser: (user: User | null) => void;
}

// Create context with default values
const AppContext = createContext<AppContextType>({
  selectedTheme: "Focus",
  setSelectedTheme: () => {},
  streak: 0,
  xp: 0,
  addXP: () => {},
  resetProgress: () => {},
  user: null,
  setUser: () => {},
});

// Hook to use the AppContext
export const useApp = () => useContext(AppContext);

// Provider component
export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Get values from local storage or use defaults
  const storedTheme = localStorage.getItem("selectedTheme") as "Discipline" | "Focus" | "Resilience" | "Wildcards" | null;
  const storedStreak = parseInt(localStorage.getItem("streak") || "0", 10);
  const storedXP = parseInt(localStorage.getItem("xp") || "0", 10);
  const storedUser = localStorage.getItem("user");
  
  // State
  const [selectedTheme, setSelectedTheme] = useState<"Discipline" | "Focus" | "Resilience" | "Wildcards">(
    storedTheme || "Focus"
  );
  const [streak, setStreak] = useState(storedStreak);
  const [xp, setXP] = useState(storedXP);
  const [user, setUser] = useState<User | null>(storedUser ? JSON.parse(storedUser) : null);
  
  // Update localStorage when state changes
  useEffect(() => {
    localStorage.setItem("selectedTheme", selectedTheme);
  }, [selectedTheme]);
  
  useEffect(() => {
    localStorage.setItem("streak", streak.toString());
  }, [streak]);
  
  useEffect(() => {
    localStorage.setItem("xp", xp.toString());
  }, [xp]);
  
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);
  
  // Function to add XP
  const addXP = (amount: number) => {
    setXP(prevXP => prevXP + amount);
    
    // Check if this is a new day and update streak
    const lastStreak = localStorage.getItem("lastStreakDate");
    const today = new Date().toDateString();
    
    if (lastStreak !== today) {
      setStreak(prevStreak => prevStreak + 1);
      localStorage.setItem("lastStreakDate", today);
    }
  };
  
  // Function to reset progress
  const resetProgress = () => {
    setXP(0);
    setStreak(0);
    localStorage.removeItem("lastStreakDate");
  };
  
  // Context value
  const value = {
    selectedTheme,
    setSelectedTheme,
    streak,
    xp,
    addXP,
    resetProgress,
    user,
    setUser,
  };
  
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
