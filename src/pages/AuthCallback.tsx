
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useApp } from "@/context/AppContext";

const AuthCallback = () => {
  const navigate = useNavigate();
  const { setUser, setSession } = useApp();

  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        // The hash contains OAuth info
        const { data, error } = await supabase.auth.getSession();
        
        if (error) throw error;
        
        if (data.session) {
          setSession(data.session);
          setUser(data.session.user);
          navigate("/home");
        } else {
          // If no session, redirect to auth page
          navigate("/auth");
        }
      } catch (error) {
        console.error("OAuth callback error:", error);
        navigate("/auth");
      }
    };

    handleOAuthCallback();
  }, [navigate, setUser, setSession]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black">
      <div className="animate-spin w-16 h-16 border-t-2 border-white rounded-full mb-6"></div>
      <h2 className="text-xl text-white font-medium mb-2">Completing Sign In</h2>
      <p className="text-[#999999]">Please wait while we complete your authentication...</p>
    </div>
  );
};

export default AuthCallback;
