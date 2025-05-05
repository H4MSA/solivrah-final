
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Session, User } from "@supabase/supabase-js";
import { useToast } from "@/hooks/use-toast";

// Define types for our context
interface AppContextType {
  selectedTheme: string;
  setSelectedTheme: (theme: string) => void;
  user: User | null;
  setUser: (user: User | null) => void;
  session: Session | null;
  setSession: (session: Session | null) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  isGuest: boolean;
  setIsGuest: (isGuest: boolean) => void;
  
  // Add missing properties that are used in various components
  streak: number;
  xp: number;
  completedQuests: number;
  addXP: (amount: number) => void;
  incrementStreak: () => void;
  resetProgress: () => void;
  signOut: () => Promise<void>;
}

// Create the context with default values
const AppContext = createContext<AppContextType>({
  selectedTheme: "Focus",
  setSelectedTheme: () => {},
  user: null,
  setUser: () => {},
  session: null,
  setSession: () => {},
  loading: true,
  setLoading: () => {},
  isGuest: false,
  setIsGuest: () => {},
  
  // Add default values for missing properties
  streak: 0,
  xp: 0,
  completedQuests: 0,
  addXP: () => {},
  incrementStreak: () => {},
  resetProgress: () => {},
  signOut: async () => {},
});

// Custom hook for using the context
export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};

// Provider component to wrap the app
export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [selectedTheme, setSelectedTheme] = useState<string>("Focus");
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isGuest, setIsGuest] = useState<boolean>(false);
  
  // Add state for missing properties
  const [streak, setStreak] = useState<number>(0);
  const [xp, setXP] = useState<number>(0);
  const [completedQuests, setCompletedQuests] = useState<number>(0);

  // Load guest status from localStorage on initial load
  useEffect(() => {
    const storedGuestStatus = localStorage.getItem("isGuest");
    if (storedGuestStatus === "true") {
      setIsGuest(true);
    }
    
    // Load user progress from localStorage
    const storedStreak = localStorage.getItem("streak");
    const storedXP = localStorage.getItem("xp");
    const storedCompletedQuests = localStorage.getItem("completedQuests");
    
    if (storedStreak) setStreak(parseInt(storedStreak));
    if (storedXP) setXP(parseInt(storedXP));
    if (storedCompletedQuests) setCompletedQuests(parseInt(storedCompletedQuests));
  }, []);

  // Save guest status to localStorage whenever it changes
  useEffect(() => {
    if (isGuest) {
      localStorage.setItem("isGuest", "true");
    } else {
      localStorage.removeItem("isGuest");
    }
  }, [isGuest]);
  
  // Save user progress to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("streak", streak.toString());
    localStorage.setItem("xp", xp.toString());
    localStorage.setItem("completedQuests", completedQuests.toString());
  }, [streak, xp, completedQuests]);

  // Add XP function
  const addXP = (amount: number) => {
    setXP(prevXP => prevXP + amount);
  };
  
  // Increment streak function
  const incrementStreak = () => {
    setStreak(prevStreak => prevStreak + 1);
    // Give bonus XP for streak milestones
    if ((streak + 1) % 7 === 0) {
      addXP(100); // Bonus XP for weekly streak
    } else {
      addXP(10); // Regular streak XP
    }
  };
  
  // Reset progress function
  const resetProgress = () => {
    setStreak(0);
    setXP(0);
    setCompletedQuests(0);
    localStorage.removeItem("streak");
    localStorage.removeItem("xp");
    localStorage.removeItem("completedQuests");
  };
  
  // Sign out function
  const signOut = async () => {
    // In a real app, this would call the authentication service
    // For now, we'll just clear the user and session
    setUser(null);
    setSession(null);
    setIsGuest(false);
    localStorage.removeItem("isGuest");
  };

  const value = {
    selectedTheme,
    setSelectedTheme,
    user,
    setUser,
    session,
    setSession,
    loading,
    setLoading,
    isGuest,
    setIsGuest,
    streak,
    xp,
    completedQuests,
    addXP,
    incrementStreak,
    resetProgress,
    signOut,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
