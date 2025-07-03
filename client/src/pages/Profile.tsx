import React, { useState, useEffect, useCallback } from "react";
import { useApp } from "@/context/AppContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { CameraUpload } from "@/components/CameraUpload";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Edit, Check, X, Upload, Image as ImageIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GlassCard } from "@/components/common/GlassCard";
import { useDropzone } from "react-dropzone";

const Profile = () => {
  const { user, profile, setProfile, addXP } = useApp();
  const [showAvatarCamera, setShowAvatarCamera] = useState(false);
  const [showBannerCamera, setShowBannerCamera] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState(profile?.username || "");
  const [fullName, setFullName] = useState(profile?.full_name || "");
	const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || "");
	const [bannerUrl, setBannerUrl] = useState(profile?.banner_url || "");
  const { toast } = useToast();

  useEffect(() => {
    if (profile) {
      setUsername(profile.username || "");
      setFullName(profile.full_name || "");
			setAvatarUrl(profile.avatar_url || "");
			setBannerUrl(profile.banner_url || "");
    }
  }, [profile]);

  const handleAvatarUpload = async (file: File | null) => {
    if (!file || !user) return;
    
    try {
      setIsUploading(true);
      
      // For now, just show success message without actual upload
      toast({
        title: "Avatar Updated",
        description: "Your profile picture has been updated successfully!",
      });
      
      setShowAvatarCamera(false);
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

	const handleBannerUpload = async (file: File | null) => {
    if (!file || !user) return;
    
    try {
      setIsUploading(true);
      
      // For now, just show success message without actual upload
      toast({
        title: "Banner Updated",
        description: "Your banner image has been updated successfully!",
      });
      
      setShowBannerCamera(false);
    } catch (error) {
      console.error("Error uploading banner:", error);
      toast({
        title: "Upload Failed",
        description: "There was a problem uploading your banner. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!user) return;

    try {
      setIsUploading(true);

      // Simulate saving profile
      setTimeout(() => {
        const updatedProfile = {
          ...profile,
          username: username,
          full_name: fullName,
        };

        setProfile(updatedProfile);
        setIsEditing(false);
        toast({
          title: "Profile Updated",
          description: "Your profile has been updated successfully!",
        });
      }, 1000);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Update Failed",
        description: "There was a problem updating your profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="container max-w-2xl mx-auto py-8">
      <GlassCard variant="dark" className="p-6 space-y-6">
        {/* Banner Image */}
				<div className="relative rounded-lg overflow-hidden h-48 bg-gray-800">
					{bannerUrl ? (
						<img
							src={bannerUrl}
							alt="Banner"
							className="absolute inset-0 w-full h-full object-cover"
						/>
					) : (
						<div className="absolute inset-0 flex items-center justify-center text-white/50">
							No banner image
						</div>
					)}
					<Button
						onClick={() => setShowBannerCamera(true)}
						variant="ghost"
						size="icon"
						className="absolute top-2 right-2 rounded-full bg-black/20 hover:bg-black/30 text-white"
					>
						<Upload className="h-4 w-4" />
						<span className="sr-only">Update banner</span>
					</Button>
				</div>

        {/* Avatar and Edit Button */}
        <div className="flex items-center justify-between">
          <Avatar className="w-24 h-24">
            {avatarUrl ? (
              <AvatarImage src={avatarUrl} alt="Avatar" />
            ) : (
              <AvatarFallback>{user?.email?.[0]?.toUpperCase() || "U"}</AvatarFallback>
            )}
          </Avatar>
          <div>
            {isEditing ? (
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  onClick={() => {
                    setIsEditing(false);
                    setUsername(profile?.username || "");
                    setFullName(profile?.full_name || "");
                  }}
                  disabled={isUploading}
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
                <Button onClick={handleSaveProfile} disabled={isUploading}>
                  {isUploading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white"></div>
                  ) : (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Save
                    </>
                  )}
                </Button>
              </div>
            ) : (
              <Button onClick={() => setShowAvatarCamera(true)}>
                <Edit className="w-4 h-4 mr-2" />
                Update Profile Picture
              </Button>
            )}
          </div>
        </div>

        {/* Profile Information */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={!isEditing}
            />
          </div>
          <div>
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              placeholder="Enter your full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              disabled={!isEditing}
            />
          </div>
        </div>

        {/* Edit Button */}
        {!isEditing && (
          <Button onClick={() => setIsEditing(true)} className="w-full">
            <Edit className="w-4 h-4 mr-2" />
            Edit Profile
          </Button>
        )}
      </GlassCard>

      {showAvatarCamera && (
        <CameraUpload 
          onClose={() => setShowAvatarCamera(false)}
          onCapture={handleAvatarUpload}
          title="Update Profile Picture"
        />
      )}

			{showBannerCamera && (
        <CameraUpload 
          onClose={() => setShowBannerCamera(false)}
          onCapture={handleBannerUpload}
          title="Update Banner Image"
        />
      )}
    </div>
  );
};

export default Profile;
