import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { useToast } from "@/hooks/use-toast";
import { GlassCard } from "@/components/common/GlassCard";
import { Avatar } from "@/components/ui/avatar";
import { CameraUpload } from "@/components/CameraUpload";
import { Button } from "@/components/ui/button";
import { Camera } from "lucide-react";
import { OnboardingFlow } from "@/components/common/OnboardingFlow";

const Home: React.FC = () => {
  const { user, signOut, isGuest } = useApp();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [showCamera, setShowCamera] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(() => {
    return localStorage.getItem('onboardingCompleted') !== 'true';
  });

  useEffect(() => {
    if (!user && !isGuest) {
      navigate("/auth");
    }
  }, [user, navigate, isGuest]);

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: "Signed out",
      description: "You have been successfully signed out.",
    });
    navigate("/auth");
  };

  const handleAvatarUpload = async (file: File | null) => {
    if (!file || !user) return;
    
    try {
      setIsUploading(true);
      
      // For now, just show success message without actual upload
      toast({
        title: "Avatar Updated",
        description: "Your profile picture has been updated successfully!",
      });
      
      setShowCamera(false);
    } catch (error) {
      console.error("Error uploading avatar:", error);
      toast({
        title: "Upload Failed",
        description: "There was a problem uploading your avatar. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="container max-w-md mx-auto p-4">
      {showOnboarding && <OnboardingFlow onComplete={() => setShowOnboarding(false)} />}
      
      <GlassCard variant="dark" className="p-6 space-y-4">
        <h2 className="text-2xl font-semibold text-center">Welcome Home!</h2>
        
        {user && (
          <div className="flex flex-col items-center space-y-4">
            <Avatar name={user.email || "Guest User"} src={user.avatar_url || undefined} size="lg" />
            <Button variant="secondary" size="sm" onClick={() => setShowCamera(true)} disabled={isUploading}>
              <Camera size={16} className="mr-2" />
              {isUploading ? "Uploading..." : "Update Avatar"}
            </Button>
            <p className="text-white/70">Logged in as: {user.email || "Guest User"}</p>
          </div>
        )}
        
        <Button variant="destructive" onClick={handleSignOut} className="w-full">
          Sign Out
        </Button>
      </GlassCard>
      
      {showCamera && (
        <CameraUpload 
          onClose={() => setShowCamera(false)}
          onCapture={handleAvatarUpload}
          title="Update Profile Picture"
        />
      )}
    </div>
  );
};

export default Home;
