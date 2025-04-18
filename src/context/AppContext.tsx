
import React, { createContext, useContext, useState, useEffect } from "react";

// Update user type to include id and email properties
export interface AppContextType {
  selectedTheme: string;
  setSelectedTheme: (theme: string) => void;
  streak: number;
  xp: number;
  addXP: (amount: number) => void;
  incrementStreak: () => void;
  user: { id?: string; name: string; email?: string } | null; // Updated user type
  setUser: (user: { id?: string; name: string; email?: string } | null) => void; // Updated setter
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

// Add children prop type
export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedTheme, setSelectedTheme] = useState("Dark");
  const [streak, setStreak] = useState(0);
  const [xp, setXP] = useState(0);
  const [user, setUser] = useState<{ name: string } | null>(null);
  const [isGuest, setIsGuest] = useState(false);

  // Load data from localStorage on initial load
  useEffect(() => {
    const storedTheme = localStorage.getItem("selectedTheme");
    const storedStreak = localStorage.getItem("streak");
    const storedXP = localStorage.getItem("xp");
    const storedUser = localStorage.getItem("user");
    const storedIsGuest = localStorage.getItem("isGuest");

    if (storedTheme) setSelectedTheme(storedTheme);
    if (storedStreak) setStreak(parseInt(storedStreak));
    if (storedXP) setXP(parseInt(storedXP));
    if (storedUser) setUser(JSON.parse(storedUser));
    if (storedIsGuest) setIsGuest(storedIsGuest === "true");
  }, []);

  // Save to localStorage whenever values change
  useEffect(() => {
    localStorage.setItem("selectedTheme", selectedTheme);
    localStorage.setItem("streak", streak.toString());
    localStorage.setItem("xp", xp.toString());
    localStorage.setItem("isGuest", isGuest.toString());
    if (user) localStorage.setItem("user", JSON.stringify(user));
  }, [selectedTheme, streak, xp, user, isGuest]);

  const addXP = (amount: number) => {
    setXP(prev => prev + amount);
  };

  const incrementStreak = () => {
    setStreak(prev => prev + 1);
  };

  // Add resetProgress function
  const resetProgress = () => {
    setStreak(0);
    setXP(0);
    localStorage.setItem("streak", "0");
    localStorage.setItem("xp", "0");
    
    // Optional: animate the UI or show a confirmation
    console.log("Progress reset successfully!");
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
      resetProgress
    }}>
      {children}
    </AppContext.Provider>
  );
};
