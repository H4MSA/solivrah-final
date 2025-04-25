
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useApp } from "@/context/AppContext";
import { useToast } from "@/hooks/use-toast";

const AuthCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser, setSession } = useApp();
  const { toast } = useToast();
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        // Get any error messages from the URL
        const params = new URLSearchParams(location.search);
        const errorDescription = params.get('error_description');
        
        if (errorDescription) {
          throw new Error(errorDescription);
        }
        
        // Get session data from supabase
        const { data, error } = await supabase.auth.getSession();
        
        if (error) throw error;
        
        if (data.session) {
          console.log("OAuth callback: Got session for user:", data.session.user.email);
          setSession(data.session);
          setUser(data.session.user);
          
          // Check if this is a new user or returning user
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.session.user.id)
            .maybeSingle();
            
          if (profile) {
            // Check if user has completed survey
            const { data: surveyData, error: surveyError } = await supabase
              .from('survey_responses')
              .select('*')
              .eq('user_id', data.session.user.id)
              .maybeSingle();

            if (surveyError) {
              console.error("Error checking survey data:", surveyError);
            }

            if (surveyData) {
              // User has completed survey, go to home
              toast({
                title: "Welcome back!",
                description: "Great to see you again. Let's continue your journey.",
                duration: 3000,
              });
              
              // Force navigation to home page
              console.log("Redirecting existing user with completed survey to /home");
              setTimeout(() => {
                navigate("/home", { replace: true });
              }, 500);
            } else {
              // User exists but hasn't completed survey
              console.log("Redirecting existing user without survey to /survey");
              setTimeout(() => {
                navigate("/survey", { replace: true });
              }, 500);
            }
          } else {
            // New user - go to survey
            toast({
              title: "Account created!",
              description: "Let's personalize your experience.",
              duration: 3000,
            });
            
            // Force navigation to survey page
            console.log("Redirecting new user to /survey");
            setTimeout(() => {
              navigate("/survey", { replace: true });
            }, 500);
          }
        } else {
          // No session found
          setError("Authentication failed. Please try signing in again.");
          setTimeout(() => navigate("/auth", { replace: true }), 2000);
        }
      } catch (error) {
        console.error("OAuth callback error:", error);
        setError(error instanceof Error ? error.message : "Authentication failed");
        setTimeout(() => navigate("/auth", { replace: true }), 2000);
      }
    };

    handleOAuthCallback();
  }, [navigate, setUser, setSession, location.search, toast]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black p-6">
      {error ? (
        <div className="text-center space-y-4">
          <div className="inline-flex p-3 bg-red-500/20 rounded-full mb-4">
            <Loader2 className="w-8 h-8 text-red-400 animate-spin" />
          </div>
          <h2 className="text-xl text-white font-medium mb-2">Authentication Error</h2>
          <p className="text-[#999999] max-w-md">{error}</p>
          <p className="text-[#999999]">Redirecting you back to sign in...</p>
        </div>
      ) : (
        <div className="text-center space-y-4">
          <div className="inline-flex p-3 bg-white/10 rounded-full mb-4">
            <Loader2 className="w-8 h-8 text-white animate-spin" />
          </div>
          <h2 className="text-xl text-white font-medium mb-2">Finalizing Sign In</h2>
          <p className="text-[#999999]">Just a moment while we prepare your experience...</p>
        </div>
      )}
    </div>
  );
};

export default AuthCallback;
