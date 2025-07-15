
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';
import { useToast } from '@/hooks/use-toast';

// Premium theme options
export type ThemeMode = 'light' | 'dark' | 'system';
export type WellnessTheme = 'calm' | 'focus' | 'energy' | 'serenity';

interface PremiumFeatures {
  darkMode: boolean;
  hapticFeedback: boolean;
  animations: boolean;
  notifications: boolean;
  analytics: boolean;
  premiumQuests: boolean;
  aiCoach: boolean;
  customThemes: boolean;
}

interface UserPreferences {
  themeMode: ThemeMode;
  wellnessTheme: WellnessTheme;
  reducedMotion: boolean;
  soundEnabled: boolean;
  notificationsEnabled: boolean;
  language: string;
}

interface AppContextType {
  // Theme Management
  selectedTheme: string;
  setSelectedTheme: (theme: string) => void;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  wellnessTheme: WellnessTheme;
  setWellnessTheme: (theme: WellnessTheme) => void;
  
  // Authentication
  user: User | null;
  session: Session | null;
  setUser: (user: User | null) => void;
  setSession: (session: Session | null) => void;
  loading: boolean;
  isGuest: boolean;
  setIsGuest: (isGuest: boolean) => void;
  signOut: () => Promise<void>;
  
  // User Progress
  streak: number;
  xp: number;
  completedQuests: number;
  addXP: (amount: number) => void;
  incrementStreak: () => void;
  resetProgress: () => void;
  
  // Premium Features
  premiumFeatures: PremiumFeatures;
  setPremiumFeatures: (features: Partial<PremiumFeatures>) => void;
  isPremiumUser: boolean;
  
  // User Preferences
  userPreferences: UserPreferences;
  setUserPreferences: (preferences: Partial<UserPreferences>) => void;
  
  // App State
  isOnline: boolean;
  setIsOnline: (online: boolean) => void;
  lastSync: Date | null;
  setLastSync: (date: Date) => void;
}

const AppContext = createContext<AppContextType>({
  // Theme Management
  selectedTheme: 'Focus',
  setSelectedTheme: () => {},
  themeMode: 'system',
  setThemeMode: () => {},
  wellnessTheme: 'calm',
  setWellnessTheme: () => {},
  
  // Authentication
  user: null,
  session: null,
  setUser: () => {},
  setSession: () => {},
  loading: true,
  isGuest: false,
  setIsGuest: () => {},
  signOut: async () => {},
  
  // User Progress
  streak: 0,
  xp: 0,
  completedQuests: 0,
  addXP: () => {},
  incrementStreak: () => {},
  resetProgress: () => {},
  
  // Premium Features
  premiumFeatures: {
    darkMode: true,
    hapticFeedback: true,
    animations: true,
    notifications: true,
    analytics: false,
    premiumQuests: false,
    aiCoach: false,
    customThemes: false,
  },
  setPremiumFeatures: () => {},
  isPremiumUser: false,
  
  // User Preferences
  userPreferences: {
    themeMode: 'system',
    wellnessTheme: 'calm',
    reducedMotion: false,
    soundEnabled: true,
    notificationsEnabled: true,
    language: 'en',
  },
  setUserPreferences: () => {},
  
  // App State
  isOnline: true,
  setIsOnline: () => {},
  lastSync: null,
  setLastSync: () => {},
});

export const useApp = () => useContext(AppContext);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  // Theme Management
  const [selectedTheme, setSelectedTheme] = useState<string>('Focus');
  const [themeMode, setThemeMode] = useState<ThemeMode>('system');
  const [wellnessTheme, setWellnessTheme] = useState<WellnessTheme>('calm');
  
  // Authentication
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isGuest, setIsGuest] = useState<boolean>(false);
  
  // User Progress
  const [streak, setStreak] = useState<number>(0);
  const [xp, setXP] = useState<number>(0);
  const [completedQuests, setCompletedQuests] = useState<number>(0);
  
  // Premium Features
  const [premiumFeatures, setPremiumFeaturesState] = useState<PremiumFeatures>({
    darkMode: true,
    hapticFeedback: true,
    animations: true,
    notifications: true,
    analytics: false,
    premiumQuests: false,
    aiCoach: false,
    customThemes: false,
  });
  
  // User Preferences
  const [userPreferences, setUserPreferencesState] = useState<UserPreferences>({
    themeMode: 'system',
    wellnessTheme: 'calm',
    reducedMotion: false,
    soundEnabled: true,
    notificationsEnabled: true,
    language: 'en',
  });
  
  // App State
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [lastSync, setLastSync] = useState<Date | null>(null);
  
  const { toast } = useToast();
  
  // Computed values
  const isPremiumUser = user?.user_metadata?.subscription_status === 'active' || false;

  // Initialize app state from localStorage and system preferences
  useEffect(() => {
    // Load saved data
    const savedStreak = localStorage.getItem('userStreak');
    const savedXP = localStorage.getItem('userXP');
    const savedQuests = localStorage.getItem('completedQuests');
    const savedTheme = localStorage.getItem('selectedTheme');
    const savedThemeMode = localStorage.getItem('themeMode') as ThemeMode;
    const savedWellnessTheme = localStorage.getItem('wellnessTheme') as WellnessTheme;
    const savedPreferences = localStorage.getItem('userPreferences');
    const savedPremiumFeatures = localStorage.getItem('premiumFeatures');
    const guestStatus = localStorage.getItem('isGuest');
    const savedLastSync = localStorage.getItem('lastSync');
    
    // Restore user progress
    if (savedStreak) setStreak(parseInt(savedStreak));
    if (savedXP) setXP(parseInt(savedXP));
    if (savedQuests) setCompletedQuests(parseInt(savedQuests));
    if (savedTheme) setSelectedTheme(savedTheme);
    if (savedThemeMode) setThemeMode(savedThemeMode);
    if (savedWellnessTheme) setWellnessTheme(savedWellnessTheme);
    if (guestStatus) setIsGuest(guestStatus === 'true');
    if (savedLastSync) setLastSync(new Date(savedLastSync));
    
    // Restore user preferences
    if (savedPreferences) {
      try {
        const preferences = JSON.parse(savedPreferences);
        setUserPreferencesState(prev => ({ ...prev, ...preferences }));
      } catch (error) {
        console.error('Failed to parse user preferences:', error);
      }
    }
    
    // Restore premium features
    if (savedPremiumFeatures) {
      try {
        const features = JSON.parse(savedPremiumFeatures);
        setPremiumFeaturesState(prev => ({ ...prev, ...features }));
      } catch (error) {
        console.error('Failed to parse premium features:', error);
      }
    }
    
    // Detect system theme preference
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    if (!savedThemeMode) {
      setThemeMode('system');
    }
    
    // Apply theme to document
    applyTheme(savedThemeMode || 'system', systemTheme);
    
    setLoading(false);
  }, []);

  // Save data to localStorage when state changes
  useEffect(() => {
    localStorage.setItem('userStreak', streak.toString());
    localStorage.setItem('userXP', xp.toString());
    localStorage.setItem('completedQuests', completedQuests.toString());
    localStorage.setItem('selectedTheme', selectedTheme);
    localStorage.setItem('themeMode', themeMode);
    localStorage.setItem('wellnessTheme', wellnessTheme);
    localStorage.setItem('isGuest', isGuest.toString());
    localStorage.setItem('userPreferences', JSON.stringify(userPreferences));
    localStorage.setItem('premiumFeatures', JSON.stringify(premiumFeatures));
    if (lastSync) {
      localStorage.setItem('lastSync', lastSync.toISOString());
    }
  }, [streak, xp, completedQuests, selectedTheme, themeMode, wellnessTheme, isGuest, userPreferences, premiumFeatures, lastSync]);

  // Theme application function
  const applyTheme = (mode: ThemeMode, systemTheme: string) => {
    const effectiveTheme = mode === 'system' ? systemTheme : mode;
    document.documentElement.classList.toggle('dark', effectiveTheme === 'dark');
    document.documentElement.setAttribute('data-theme', effectiveTheme);
    document.documentElement.setAttribute('data-wellness-theme', wellnessTheme);
  };

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      if (themeMode === 'system') {
        applyTheme('system', e.matches ? 'dark' : 'light');
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [themeMode, wellnessTheme]);

  // Premium XP system with enhanced feedback
  const addXP = (amount: number) => {
    setXP(prev => {
      const newXP = prev + amount;
      const levelUp = Math.floor(newXP / 100) > Math.floor(prev / 100);
      
      if (levelUp) {
        toast({
          title: "🎉 Level Up!",
          description: `You've reached level ${Math.floor(newXP / 100) + 1}!`,
          duration: 5000
        });
      } else {
        toast({
          title: `+${amount} XP`,
          description: "Experience points added!",
          duration: 3000
        });
      }
      
      return newXP;
    });
  };

  const incrementStreak = () => {
    setStreak(prev => {
      const newStreak = prev + 1;
      const milestone = newStreak % 7 === 0; // Weekly milestone
      
      toast({
        title: milestone ? "🔥 Weekly Streak!" : "Streak Increased!",
        description: milestone 
          ? `Amazing! You've maintained a ${newStreak} day streak!` 
          : `You're on a ${newStreak} day streak!`,
        duration: milestone ? 5000 : 3000
      });
      
      return newStreak;
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
    // Clear sensitive data on sign out
    localStorage.removeItem('userPreferences');
    localStorage.removeItem('premiumFeatures');
  };

  // Premium feature management
  const setPremiumFeatures = (features: Partial<PremiumFeatures>) => {
    setPremiumFeaturesState(prev => ({ ...prev, ...features }));
  };

  // User preferences management
  const setUserPreferences = (preferences: Partial<UserPreferences>) => {
    setUserPreferencesState(prev => {
      const newPreferences = { ...prev, ...preferences };
      
      // Apply theme changes immediately
      if (preferences.themeMode) {
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        applyTheme(preferences.themeMode, systemTheme);
      }
      
      return newPreferences;
    });
  };

  return (
    <AppContext.Provider
      value={{
        // Theme Management
        selectedTheme,
        setSelectedTheme,
        themeMode,
        setThemeMode: (mode) => {
          setThemeMode(mode);
          const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
          applyTheme(mode, systemTheme);
        },
        wellnessTheme,
        setWellnessTheme: (theme) => {
          setWellnessTheme(theme);
          document.documentElement.setAttribute('data-wellness-theme', theme);
        },
        
        // Authentication
        user,
        session,
        setUser,
        setSession,
        loading,
        isGuest,
        setIsGuest,
        signOut,
        
        // User Progress
        streak,
        xp,
        completedQuests,
        addXP,
        incrementStreak,
        resetProgress,
        
        // Premium Features
        premiumFeatures,
        setPremiumFeatures,
        isPremiumUser,
        
        // User Preferences
        userPreferences,
        setUserPreferences,
        
        // App State
        isOnline,
        setIsOnline,
        lastSync,
        setLastSync,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
