
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

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
});

export const useApp = () => useContext(AppContext);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedTheme, setSelectedTheme] = useState("Dark");
  const [streak, setStreak] = useState(0);
  const [xp, setXP] = useState(0);
  const [user, setUser] = useState<{ id?: string; name: string; email?: string } | null>(null);
  const [isGuest, setIsGuest] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load data from localStorage on initial load - using a single effect for better performance
  useEffect(() => {
    const loadData = () => {
      const storedTheme = localStorage.getItem("selectedTheme");
      const storedStreak = localStorage.getItem("streak");
      const storedXP = localStorage.getItem("xp");
      const storedUser = localStorage.getItem("user");
      const storedIsGuest = localStorage.getItem("isGuest");
  
      if (storedTheme) setSelectedTheme(storedTheme);
      if (storedStreak) setStreak(parseInt(storedStreak));
      if (storedXP) setXP(parseInt(storedXP));
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (e) {
          console.error("Failed to parse user data", e);
          localStorage.removeItem("user");
        }
      }
      if (storedIsGuest) setIsGuest(storedIsGuest === "true");
      
      setIsInitialized(true);
    };
    
    loadData();
  }, []);

  // Save to localStorage whenever values change - optimized with a debounce
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
      resetProgress
    }}>
      {children}
    </AppContext.Provider>
  );
};
