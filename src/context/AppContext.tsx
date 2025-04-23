
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
  const [isGuest, setIsGuest] = useState(false);

  // Fix login/auth state management
  useEffect(() => {
    if (isGuest) {
      setLoading(false);
      setUser(null);
      setSession(null);
      return;
    }

    // Set up auth state listener FIRST (critical for avoiding auth deadlocks)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event: AuthChangeEvent, session: Session | null) => {
        console.log("Auth state changed:", event, session?.user?.email);
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);

        // To avoid async/blocking problem, use setTimeout for side effects
        if (session?.user) {
          setTimeout(() => {
            fetchUserProfile(session.user.id);
          }, 0);
        }

        // Show toast notification based on event
        if (event === 'SIGNED_IN') {
          toast({
            title: "Welcome back!",
            description: `You're now signed in${session?.user?.email ? ` as ${session.user.email}` : ''}`,
          });
        } else if (event === 'SIGNED_OUT') {
          toast({
            title: "Signed out",
            description: "You've been signed out successfully",
          });
        } else if (event === 'USER_UPDATED') {
          toast({
            title: "Profile updated",
            description: "Your profile has been updated",
          });
        }
      }
    );

    // Then check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("Initial session check:", session?.user?.email);
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      if (session?.user) {
        fetchUserProfile(session.user.id);
      }
    }).catch(error => {
      console.error("Error getting session:", error);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [isGuest]);

  const fetchUserProfile = async (userId: string) => {
    try {
      console.log("Fetching profile for user:", userId);
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .maybeSingle();

      if (error) {
        console.error("Error fetching user profile:", error);
        throw error;
      }

      if (data) {
        console.log("Profile data loaded:", data);
        setSelectedTheme(data.theme || "Discipline");
        setStreak(data.streak || 0);
        setXP(data.xp || 0);
      } else {
        console.log("No profile found, creating new profile");
        // Profile might not exist if RLS is preventing access or it genuinely doesn't exist
        // Let's try to create it
        const { error: insertError } = await supabase
          .from("profiles")
          .insert([{ id: userId, theme: "Discipline", streak: 0, xp: 0 }]);
          
        if (insertError) {
          console.error("Error creating profile:", insertError);
        }
      }
    } catch (error) {
      console.error("Error in fetchUserProfile:", error);
    }
  };

  const addXP = async (amount: number) => {
    if (!user) return;

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
    if (!user) return;

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

    if (user) {
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
    if (!user) return;

    setStreak(0);
    setXP(0);

    toast({
      title: "Progress Reset",
      description: "Your progress has been reset. Ready for a fresh start!",
    });

    try {
      await supabase
        .from("profiles")
        .update({ streak: 0, xp: 0 })
        .eq("id", user.id);
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
