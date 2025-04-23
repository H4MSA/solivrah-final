
import { supabase } from "@/integrations/supabase/client";

interface SignUpData {
  email: string;
  password: string;
  username?: string;
}

interface SignInData {
  email: string;
  password: string;
}

type OAuthProvider = 'google' | 'facebook' | 'apple' | 'discord' | 'github';

export const AuthService = {
  signUp: async (data: SignUpData) => {
    const { email, password, username } = data;
    
    // Validation
    if (!email || !password) {
      throw new Error("Email and password are required");
    }
    
    // Sign up with email and password
    const { data: authData, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username: username || email.split('@')[0], // Default username is first part of email
        },
      },
    });
    
    if (error) {
      console.error("Sign up error:", error);
      throw error;
    }
    
    return authData;
  },
  
  signIn: async (data: SignInData) => {
    const { email, password } = data;
    
    // Validation
    if (!email || !password) {
      throw new Error("Email and password are required");
    }
    
    try {
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error("Sign in error:", error.message);
        throw error;
      }
      
      return authData;
    } catch (error) {
      console.error("Sign in error:", error);
      throw error;
    }
  },
  
  signInWithOAuth: async (provider: OAuthProvider) => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      
      if (error) {
        console.error(`${provider} OAuth error:`, error);
        throw error;
      }
      
      return data;
    } catch (error) {
      console.error(`${provider} OAuth error:`, error);
      throw error;
    }
  },
  
  signOut: async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error("Sign out error:", error);
        throw error;
      }
    } catch (error) {
      console.error("Sign out error:", error);
      throw error;
    }
  },
  
  resetPassword: async (email: string) => {
    if (!email) {
      throw new Error("Email is required");
    }
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) {
        console.error("Reset password error:", error);
        throw error;
      }
    } catch (error) {
      console.error("Reset password error:", error);
      throw error;
    }
  },
  
  getCurrentSession: async () => {
    try {
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error("Get session error:", error);
        throw error;
      }
      
      return data.session;
    } catch (error) {
      console.error("Get session error:", error);
      throw error;
    }
  },
  
  // Subscribe to authentication state changes
  onAuthStateChange: (callback: Function) => {
    return supabase.auth.onAuthStateChange((event, session) => {
      callback(event, session);
    });
  },
  
  // Update user data
  updateUser: async (userData: { username?: string; email?: string; password?: string }) => {
    const updateData: any = {};
    
    if (userData.email) updateData.email = userData.email;
    if (userData.password) updateData.password = userData.password;
    
    // Handle metadata separately
    const meta: any = {};
    if (userData.username) meta.username = userData.username;
    
    try {
      const { data, error } = await supabase.auth.updateUser({
        ...updateData,
        ...(Object.keys(meta).length ? { data: meta } : {})
      });
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Update user error:", error);
      throw error;
    }
  }
};
