
import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { PremiumCard } from '@/components/PremiumCard';
import { supabase } from '@/integrations/supabase/client';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { motion } from 'framer-motion';
import { Camera, Edit, UserCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { CameraUpload } from '@/components/CameraUpload';
import { TabNavigation } from '@/components/TabNavigation';
import { ProfileTabs } from '@/components/ProfileTabs';
import { ThemeBackground } from '@/components/ThemeBackground';

const Profile = () => {
  const { user, selectedTheme } = useApp();
  const { toast } = useToast();
  const [showProfileUpload, setShowProfileUpload] = useState(false);
  const [showBannerUpload, setShowBannerUpload] = useState(false);
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const [bannerImageUrl, setBannerImageUrl] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);
  
  // Load profile and banner images if available
  useEffect(() => {
    const loadUserImages = async () => {
      if (!user) return;
      
      try {
        // Check if the bucket exists first and create it if needed
        let { data: buckets } = await supabase.storage.listBuckets();
        
        const profileBucketExists = buckets?.some(bucket => bucket.name === 'profile-images');
        
        if (!profileBucketExists) {
          // Create bucket if it doesn't exist
          await supabase.storage.createBucket('profile-images', { 
            public: true,
            fileSizeLimit: 2 * 1024 * 1024 // 2MB
          });
        }
        
        // Try to get profile image
        try {
          const { data: profileData } = await supabase.storage
            .from('profile-images')
            .getPublicUrl(`${user.id}/profile`);
            
          if (profileData?.publicUrl) {
            // Add cache-busting parameter
            setProfileImageUrl(`${profileData.publicUrl}?t=${new Date().getTime()}`);
          }
        } catch (error) {
          console.log("No profile image found");
        }
        
        // Try to get banner image
        try {
          const { data: bannerData } = await supabase.storage
            .from('profile-images')
            .getPublicUrl(`${user.id}/banner`);
            
          if (bannerData?.publicUrl) {
            // Add cache-busting parameter
            setBannerImageUrl(`${bannerData.publicUrl}?t=${new Date().getTime()}`);
          }
        } catch (error) {
          console.log("No banner image found");
        }
      } catch (error) {
        console.error("Error loading profile images:", error);
      } finally {
        setLoaded(true);
      }
    };
    
    loadUserImages();
  }, [user]);

  // Handle profile image upload/change
  const handleProfileImageChange = async (file: File | null) => {
    if (!file || !user) return;
    
    try {
      // Upload to Supabase Storage
      const filePath = `${user.id}/profile`;
      
      const { error: uploadError } = await supabase.storage
        .from('profile-images')
        .upload(filePath, file, { upsert: true });
        
      if (uploadError) throw uploadError;
      
      // Get the URL for the uploaded image
      const { data } = await supabase.storage
        .from('profile-images')
        .getPublicUrl(filePath);
      
      if (data) {
        // Add cache-busting parameter
        setProfileImageUrl(`${data.publicUrl}?t=${new Date().getTime()}`);
        
        toast({
          title: "Profile image updated",
          description: "Your new profile image has been set.",
        });
      }
      
      setShowProfileUpload(false);
    } catch (error) {
      console.error("Error uploading profile image:", error);
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: "There was a problem uploading your image.",
      });
    }
  };
  
  // Handle banner image upload/change
  const handleBannerImageChange = async (file: File | null) => {
    if (!file || !user) return;
    
    try {
      // Upload to Supabase Storage
      const filePath = `${user.id}/banner`;
      
      const { error: uploadError } = await supabase.storage
        .from('profile-images')
        .upload(filePath, file, { upsert: true });
        
      if (uploadError) throw uploadError;
      
      // Get the URL for the uploaded image
      const { data } = await supabase.storage
        .from('profile-images')
        .getPublicUrl(filePath);
      
      if (data) {
        // Add cache-busting parameter
        setBannerImageUrl(`${data.publicUrl}?t=${new Date().getTime()}`);
        
        toast({
          title: "Banner image updated",
          description: "Your new banner image has been set.",
        });
      }
      
      setShowBannerUpload(false);
    } catch (error) {
      console.error("Error uploading banner image:", error);
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: "There was a problem uploading your image.",
      });
    }
  };

  // Get display name from email
  const displayName = user?.email?.split('@')[0] || "Guest User";

  return (
    <div className="h-full overflow-y-auto">
      <ThemeBackground />
      <motion.div 
        className="px-4 py-6 pb-24 w-full max-w-sm mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* Profile Header with Banner and Avatar */}
        <div className="mb-6">
          <PremiumCard className="relative h-36 overflow-hidden rounded-xl">
            {/* Banner with theme-based background */}
            <div className={`absolute inset-0 bg-gradient-to-tr ${
              selectedTheme === "Discipline" ? "from-red-400/20 to-red-700/10" :
              selectedTheme === "Focus" ? "from-purple-400/20 to-purple-700/10" :
              selectedTheme === "Resilience" ? "from-green-400/20 to-green-700/10" :
              "from-amber-400/20 to-amber-700/10"
            }`}>
              {bannerImageUrl ? (
                <img
                  src={bannerImageUrl}
                  alt="Profile Banner"
                  className="w-full h-full object-cover opacity-70"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="absolute inset-0 bg-grid-white/[0.02]"></div>
                </div>
              )}
            </div>
            
            {/* Banner overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
            
            {/* Edit banner button */}
            <button
              onClick={() => setShowBannerUpload(true)}
              className="absolute top-3 right-3 bg-black/40 p-2 rounded-full backdrop-blur-sm border border-white/10 hover:bg-black/60 transition-all"
            >
              <Edit size={14} className="text-white" />
            </button>
            
            {/* User avatar */}
            <div className="absolute bottom-3 left-3 flex items-center gap-3">
              <div className="relative">
                <Avatar className="h-14 w-14 border-2 border-[#030303] shadow-xl">
                  {profileImageUrl ? (
                    <AvatarImage src={profileImageUrl} alt="Profile" className="object-cover" />
                  ) : (
                    <AvatarFallback className="bg-black text-white text-lg">
                      {displayName.charAt(0).toUpperCase() || <UserCircle size={24} />}
                    </AvatarFallback>
                  )}
                </Avatar>
                
                <button
                  onClick={() => setShowProfileUpload(true)}
                  className="absolute bottom-0 right-0 bg-black/80 p-1 rounded-full backdrop-blur-sm border border-white/10 hover:bg-black/60 transition-all"
                >
                  <Camera size={12} className="text-white" />
                </button>
              </div>
              
              {/* User info */}
              <div>
                <h2 className="font-bold text-white text-sm">
                  {displayName}
                </h2>
                <p className="text-white/70 text-xs">
                  {selectedTheme}
                </p>
              </div>
            </div>
          </PremiumCard>
        </div>
        
        {/* Tabs for Overview, Achievements, Settings */}
        <ProfileTabs />
        
        {/* Camera Upload Modals */}
        {showProfileUpload && (
          <CameraUpload
            onClose={() => setShowProfileUpload(false)}
            onCapture={handleProfileImageChange}
            title="Update Profile Photo"
            aspectRatio="1:1"
          />
        )}
        
        {showBannerUpload && (
          <CameraUpload
            onClose={() => setShowBannerUpload(false)}
            onCapture={handleBannerImageChange}
            title="Update Banner Image"
            aspectRatio="16:9"
          />
        )}
      </motion.div>
    </div>
  );
};

export default Profile;
