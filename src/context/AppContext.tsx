
import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User, Session, AuthChangeEvent } from "@supabase/supabase-js";
import { AuthService } from "@/services/AuthService";
import type { Database } from "@/integrations/supabase/types";
import { useToast } from "@/hooks/use-toast";

type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];

interface AppContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  setSession: (session: Session | null) => void;
  selectedTheme: string;
  setSelectedTheme: (theme: string) => void;
  streak: number;
  xp: number;
  completedQuests: number;
  addXP: (amount: number) => void;
  incrementStreak: () => void;
  resetProgress: () => void;
  isGuest: boolean;
  setIsGuest: (guest: boolean) => void;
  signOut: () => Promise<void>;
}

const AppContext = createContext<AppContextType>({
  user: null,
  session: null,
  loading: true,
  setUser: () => {},
  setSession: () => {},
  selectedTheme: "Discipline",
  setSelectedTheme: () => {},
  streak: 0,
  xp: 0,
  completedQuests: 0,
  addXP: () => {},
  incrementStreak: () => {},
  resetProgress: () => {},
  isGuest: false,
  setIsGuest: () => {},
  signOut: async () => {},
});

export const useApp = () => useContext(AppContext);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTheme, setSelectedTheme] = useState("Discipline");
  const [streak, setStreak] = useState(0);
  const [xp, setXP] = useState(0);
  const [completedQuests, setCompletedQuests] = useState(0);
  const [isGuest, setIsGuest] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);

  // User profile loading effect - separated from auth state management
  useEffect(() => {
    if (isGuest || !user?.id || profileLoading) return;
    
    const loadUserProfile = async () => {
      try {
        setProfileLoading(true);
        console.log("Fetching profile for user:", user.id);
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .maybeSingle();

        if (error) {
          console.error("Error fetching user profile:", error);
          return;
        }

        if (data) {
          console.log("Profile data loaded:", data);
          setSelectedTheme(data.theme || "Discipline");
          setStreak(data.streak || 0);
          setXP(data.xp || 0);
          
          // Load completed quests count
          const { data: questsData, error: questsError } = await supabase
            .from("quests")
            .select("id")
            .eq("user_id", user.id)
            .eq("completed", true);
          
          if (!questsError && questsData) {
            setCompletedQuests(questsData.length);
          }
        } else {
          console.log("No profile found, creating new profile");
          // Profile might not exist if RLS is preventing access or it genuinely doesn't exist
          const { error: insertError } = await supabase
            .from("profiles")
            .insert([{ id: user.id, theme: "Discipline", streak: 0, xp: 0 }]);
            
          if (insertError) {
            console.error("Error creating profile:", insertError);
          }
        }
      } catch (error) {
        console.error("Error in fetchUserProfile:", error);
      } finally {
        setProfileLoading(false);
      }
    };

    loadUserProfile();
  }, [user, isGuest]);

  // Clear loading state when user state is set
  useEffect(() => {
    if (user !== null || isGuest) {
      setLoading(false);
    }
  }, [user, isGuest]);

  const addXP = async (amount: number) => {
    if (!user || isGuest) return;

    const newXP = xp + amount;
    setXP(newXP);
    
    toast({
      title: `+${amount} XP`,
      description: "Great job! Keep going!",
      duration: 3000,
    });

    try {
      await supabase
        .from("profiles")
        .update({ xp: newXP })
        .eq("id", user.id);
    } catch (error) {
      console.error("Error updating XP:", error);
    }
  };

  const incrementStreak = async () => {
    if (!user || isGuest) return;

    const newStreak = streak + 1;
    setStreak(newStreak);
    
    toast({
      title: `${newStreak} Day Streak!`,
      description: "You're building great habits!",
      duration: 3000,
    });

    try {
      await supabase
        .from("profiles")
        .update({ streak: newStreak })
        .eq("id", user.id);
    } catch (error) {
      console.error("Error updating streak:", error);
    }
  };

  const updateSelectedTheme = async (theme: string) => {
    setSelectedTheme(theme);

    if (user && !isGuest) {
      try {
        await supabase
          .from("profiles")
          .update({ theme })
          .eq("id", user.id);
      } catch (error) {
        console.error("Error updating theme:", error);
      }
    }
  };

  const resetProgress = async () => {
    if (!user || isGuest) return;

    setStreak(0);
    setXP(0);
    setCompletedQuests(0);

    toast({
      title: "Progress Reset",
      description: "Your progress has been reset. Ready for a fresh start!",
    });

    try {
      await supabase
        .from("profiles")
        .update({ streak: 0, xp: 0 })
        .eq("id", user.id);
        
      // Mark all quests as incomplete
      await supabase
        .from("quests")
        .update({ completed: false, completed_at: null })
        .eq("user_id", user.id);
    } catch (error) {
      console.error("Error resetting progress:", error);
    }
  };

  const signOut = async () => {
    try {
      await AuthService.signOut();
      setUser(null);
      setSession(null);
      setIsGuest(false);
      
      toast({
        title: "Signed out",
        description: "You've been signed out successfully",
      });
    } catch (error) {
      console.error("Error signing out:", error);
      
      toast({
        title: "Sign out failed",
        description: "There was a problem signing you out. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <AppContext.Provider
      value={{
        user,
        session,
        loading,
        setUser,
        setSession,
        selectedTheme,
        setSelectedTheme: updateSelectedTheme,
        streak,
        xp,
        completedQuests,
        addXP,
        incrementStreak,
        resetProgress,
        isGuest,
        setIsGuest,
        signOut,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
