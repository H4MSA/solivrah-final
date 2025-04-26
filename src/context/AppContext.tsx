
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export interface AppContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  selectedTheme: string;
  setSelectedTheme: (theme: string) => void;
  signOut: () => Promise<void>;
  streak: number;
  xp: number;
  completedQuests: number;
  addXP: (amount: number) => void;
  resetProgress: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [selectedTheme, setSelectedTheme] = useState<string>('Focus');
  const [streak, setStreak] = useState<number>(0);
  const [xp, setXP] = useState<number>(0);
  const [completedQuests, setCompletedQuests] = useState<number>(0);

  useEffect(() => {
    // Load user data from localStorage if not in user state
    const getUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);

        // If user exists, load their data
        if (user) {
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
      }
    };

    getUser();
  }, []);

  // Save theme preference when it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem(`${user.id}_theme`, selectedTheme);
    }
  }, [selectedTheme, user]);

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setStreak(0);
    setXP(0);
    setCompletedQuests(0);
  };

  const addXP = (amount: number) => {
    setXP(prevXP => prevXP + amount);
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
        selectedTheme,
        setSelectedTheme,
        signOut,
        streak,
        xp,
        completedQuests,
        addXP,
        resetProgress,
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
