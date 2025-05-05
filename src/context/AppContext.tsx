
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export interface AppContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  session: Session | null;
  setSession: (session: Session | null) => void;
  selectedTheme: string;
  setSelectedTheme: (theme: string) => void;
  signOut: () => Promise<void>;
  streak: number;
  xp: number;
  completedQuests: number;
  addXP: (amount: number) => void;
  resetProgress: () => Promise<void>;
  incrementStreak: () => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  isGuest: boolean;
  setIsGuest: (isGuest: boolean) => void;
  isAnonymous: boolean;
  setIsAnonymous: (isAnonymous: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [selectedTheme, setSelectedTheme] = useState<string>('Focus');
  const [streak, setStreak] = useState<number>(0);
  const [xp, setXP] = useState<number>(0);
  const [completedQuests, setCompletedQuests] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [isGuest, setIsGuest] = useState<boolean>(false);
  const [isAnonymous, setIsAnonymous] = useState<boolean>(false);

  useEffect(() => {
    // Load user data from localStorage if not in user state
    const getUser = async () => {
      try {
        setLoading(true);
        
        // Check if user is skipping authentication
        const isSkipping = localStorage.getItem('skipAuthentication') === 'true';
        
        if (isSkipping) {
          setIsAnonymous(true);
          // Create placeholder data for anonymous users
          setStreak(Math.floor(Math.random() * 5));
          setXP(Math.floor(Math.random() * 200));
          setCompletedQuests(Math.floor(Math.random() * 3));
          
          // Load theme preference from localStorage if it exists
          const savedTheme = localStorage.getItem('anonymous_theme');
          if (savedTheme) {
            setSelectedTheme(savedTheme);
          }
          setLoading(false);
          return;
        }
        
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);

        // If user exists, load their data
        if (user) {
          // Check if user is a guest
          const userMetadata = user.user_metadata || {};
          setIsGuest(Boolean(userMetadata.isGuest));
          
          // In a real app, we would load the user's data from the database
          // For now, we'll use some placeholder data
          setStreak(Math.floor(Math.random() * 30));
          setXP(Math.floor(Math.random() * 5000));
          setCompletedQuests(Math.floor(Math.random() * 10));
          
          // Try to load theme preference from localStorage
          const savedTheme = localStorage.getItem(`${user.id}_theme`);
          if (savedTheme) {
            setSelectedTheme(savedTheme);
          }
        }
      } catch (error) {
        console.error('Error loading user:', error);
      } finally {
        setLoading(false);
      }
    };

    getUser();
  }, []);

  // Save theme preference when it changes
  useEffect(() => {
    if (isAnonymous) {
      localStorage.setItem('anonymous_theme', selectedTheme);
    } else if (user) {
      localStorage.setItem(`${user.id}_theme`, selectedTheme);
    }
  }, [selectedTheme, user, isAnonymous]);

  const signOut = async () => {
    // If anonymous user
    if (isAnonymous) {
      localStorage.removeItem('skipAuthentication');
      localStorage.removeItem('anonymous_theme');
      setIsAnonymous(false);
    } else {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      setIsGuest(false);
    }
    
    setStreak(0);
    setXP(0);
    setCompletedQuests(0);
  };

  const addXP = (amount: number) => {
    setXP(prevXP => prevXP + amount);
  };

  const incrementStreak = () => {
    setStreak(prevStreak => prevStreak + 1);
  };

  const resetProgress = async () => {
    // In a real app, we would reset the user's data in the database
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        setStreak(0);
        setXP(0);
        setCompletedQuests(0);
        resolve();
      }, 1000);
    });
  };

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        session,
        setSession,
        selectedTheme,
        setSelectedTheme,
        signOut,
        streak,
        xp,
        completedQuests,
        addXP,
        resetProgress,
        incrementStreak,
        loading,
        setLoading,
        isGuest,
        setIsGuest,
        isAnonymous,
        setIsAnonymous,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
