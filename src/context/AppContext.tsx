
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';
import { useToast } from '@/hooks/use-toast';

interface AppContextType {
  selectedTheme: string;
  setSelectedTheme: (theme: string) => void;
  user: User | null;
  session: Session | null;
  setUser: (user: User | null) => void;
  setSession: (session: Session | null) => void;
  loading: boolean;
  isGuest: boolean;
  setIsGuest: (isGuest: boolean) => void;
  signOut: () => Promise<void>;
  streak: number;
  xp: number;
  completedQuests: number;
  addXP: (amount: number) => void;
  incrementStreak: () => void;
  resetProgress: () => void;
}

const AppContext = createContext<AppContextType>({
  selectedTheme: 'Focus',
  setSelectedTheme: () => {},
  user: null,
  session: null,
  setUser: () => {},
  setSession: () => {},
  loading: true,
  isGuest: false,
  setIsGuest: () => {},
  signOut: async () => {},
  streak: 0,
  xp: 0,
  completedQuests: 0,
  addXP: () => {},
  incrementStreak: () => {},
  resetProgress: () => {}
});

export const useApp = () => useContext(AppContext);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [selectedTheme, setSelectedTheme] = useState<string>('Focus');
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isGuest, setIsGuest] = useState<boolean>(false);
  const { toast } = useToast();
  
  // User stats
  const [streak, setStreak] = useState<number>(0);
  const [xp, setXP] = useState<number>(0);
  const [completedQuests, setCompletedQuests] = useState<number>(0);

  useEffect(() => {
    // Load user stats from localStorage
    const savedStreak = localStorage.getItem('userStreak');
    const savedXP = localStorage.getItem('userXP');
    const savedQuests = localStorage.getItem('completedQuests');
    const savedTheme = localStorage.getItem('selectedTheme');
    const guestStatus = localStorage.getItem('isGuest');
    
    if (savedStreak) setStreak(parseInt(savedStreak));
    if (savedXP) setXP(parseInt(savedXP));
    if (savedQuests) setCompletedQuests(parseInt(savedQuests));
    if (savedTheme) setSelectedTheme(savedTheme);
    if (guestStatus) setIsGuest(guestStatus === 'true');
    
    setLoading(false);
  }, []);

  // Save user stats to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('userStreak', streak.toString());
    localStorage.setItem('userXP', xp.toString());
    localStorage.setItem('completedQuests', completedQuests.toString());
    localStorage.setItem('selectedTheme', selectedTheme);
    localStorage.setItem('isGuest', isGuest.toString());
  }, [streak, xp, completedQuests, selectedTheme, isGuest]);

  const addXP = (amount: number) => {
    setXP(prev => prev + amount);
    toast({
      title: `+${amount} XP`,
      description: "Experience points added!",
      duration: 3000
    });
  };

  const incrementStreak = () => {
    setStreak(prev => prev + 1);
    toast({
      title: "Streak Increased!",
      description: `You're on a ${streak + 1} day streak!`,
      duration: 3000
    });
  };

  const resetProgress = () => {
    setStreak(0);
    setXP(0);
    setCompletedQuests(0);
    localStorage.removeItem('userStreak');
    localStorage.removeItem('userXP');
    localStorage.removeItem('completedQuests');
    toast({
      title: "Progress Reset",
      description: "All progress has been reset",
      duration: 3000
    });
  };

  const signOut = async () => {
    if (isGuest) {
      setIsGuest(false);
    } else {
      await supabase.auth.signOut();
    }
    localStorage.removeItem('isGuest');
  };

  return (
    <AppContext.Provider
      value={{
        selectedTheme,
        setSelectedTheme,
        user,
        session,
        setUser,
        setSession,
        loading,
        isGuest,
        setIsGuest,
        signOut,
        streak,
        xp,
        completedQuests,
        addXP,
        incrementStreak,
        resetProgress
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
