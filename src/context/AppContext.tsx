
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Session, User } from "@supabase/supabase-js";

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
});

// Custom hook for using the context
export const useApp = () => useContext(AppContext);

// Provider component to wrap the app
export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [selectedTheme, setSelectedTheme] = useState<string>("Focus");
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isGuest, setIsGuest] = useState<boolean>(false);

  // Load guest status from localStorage on initial load
  useEffect(() => {
    const storedGuestStatus = localStorage.getItem("isGuest");
    if (storedGuestStatus === "true") {
      setIsGuest(true);
    }
  }, []);

  // Save guest status to localStorage whenever it changes
  useEffect(() => {
    if (isGuest) {
      localStorage.setItem("isGuest", "true");
    } else {
      localStorage.removeItem("isGuest");
    }
  }, [isGuest]);

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
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
