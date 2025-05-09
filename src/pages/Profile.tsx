import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '@/context/AppContext';
import { PremiumCard } from '@/components/PremiumCard';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { motion } from 'framer-motion';
import { 
  Award, 
  Calendar, 
  Camera, 
  Edit, 
  LogOut, 
  Send, 
  Settings, 
  Share2, 
  Trophy, 
  UserCircle 
} from 'lucide-react';
import { ProfileReset } from '@/components/ProfileReset';
import { useToast } from '@/hooks/use-toast';
import { CameraUpload } from '@/components/CameraUpload';
import { TabNavigation } from '@/components/TabNavigation';

const Profile = () => {
  const { user, xp, streak, signOut, selectedTheme, setSelectedTheme, resetProgress, completedQuests } = useApp();
  const { toast } = useToast();
  const [showProfileUpload, setShowProfileUpload] = useState(false);
  const [showBannerUpload, setShowBannerUpload] = useState(false);
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const [bannerImageUrl, setBannerImageUrl] = useState<string | null>(null);
  const [isResetting, setIsResetting] = useState(false);
  
  const level = Math.floor(xp / 1000) + 1;
  const xpToNextLevel = 1000 - (xp % 1000);
  
  const themes = [
    { id: "Discipline", name: "Discipline", color: "from-red-400/20 to-red-700/10" },
    { id: "Focus", name: "Focus", color: "from-purple-400/20 to-purple-700/10" },
    { id: "Resilience", name: "Resilience", color: "from-green-400/20 to-green-700/10" },
    { id: "Wildcards", name: "Wildcards", color: "from-amber-400/20 to-amber-700/10" }
  ];
  
  // Attempt to load profile image and banner image on component mount
  useEffect(() => {
    if (user) {
      // Check if image exists in storage for this user
      const checkAndLoadImages = async () => {
        try {
          // Create the bucket if it doesn't exist
          const { data: buckets } = await supabase.storage
            .listBuckets();
            
          const profileBucketExists = buckets?.some(bucket => bucket.name === 'profile-images');
          
          if (!profileBucketExists) {
            await supabase.storage.createBucket('profile-images', {
              public: true,
              fileSizeLimit: 1024 * 1024 * 2 // 2MB
            });
          }
          
          // For profile image
          const profilePath = `${user.id}/profile`;
          const { data: profileData, error: profileError } = await supabase.storage
            .from('profile-images')
            .download(profilePath);
            
          if (profileData && !profileError) {
            const url = URL.createObjectURL(profileData);
            setProfileImageUrl(url);
          }
          
          // For banner image
          const bannerPath = `${user.id}/banner`;
          const { data: bannerData, error: bannerError } = await supabase.storage
            .from('profile-images')
            .download(bannerPath);
            
          if (bannerData && !bannerError) {
            const url = URL.createObjectURL(bannerData);
            setBannerImageUrl(url);
          }
        } catch (error) {
          console.error("Error loading profile images:", error);
        }
      };
      
      checkAndLoadImages();
    }
  }, [user]);
  
  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Signed out successfully",
        description: "We hope to see you again soon!",
      });
    } catch (error) {
      console.error("Error signing out:", error);
      toast({
        variant: "destructive",
        title: "Error signing out",
        description: "There was a problem signing you out. Please try again.",
      });
    }
  };

  const handleResetProfile = async () => {
    setIsResetting(true);
    try {
      await resetProgress();
      toast({
        title: "Profile reset successful",
        description: "Your progress has been reset.",
      });
    } catch (error) {
      console.error("Error resetting profile:", error);
      toast({
        variant: "destructive",
        title: "Reset failed",
        description: "There was a problem resetting your profile.",
      });
    } finally {
      setIsResetting(false);
    }
  };
  
  const handleProfileImageChange = async (file: File | null) => {
    if (!file || !user) return;
    
    try {
      // Upload to Supabase Storage
      const filePath = `${user.id}/profile`;
      
      const { error: uploadError } = await supabase.storage
        .from('profile-images')
        .upload(filePath, file, { upsert: true });
        
      if (uploadError) throw uploadError;
      
      // Generate a URL for the uploaded image
      const { data } = await supabase.storage
        .from('profile-images')
        .getPublicUrl(filePath);
      
      // Set the profile image URL with a cache-busting query parameter
      setProfileImageUrl(`${data.publicUrl}?t=${new Date().getTime()}`);
      
      toast({
        title: "Profile image updated",
        description: "Your new profile image has been set.",
      });
      
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
  
  const handleBannerImageChange = async (file: File | null) => {
    if (!file || !user) return;
    
    try {
      // Upload to Supabase Storage
      const filePath = `${user.id}/banner`;
      
      const { error: uploadError } = await supabase.storage
        .from('profile-images')
        .upload(filePath, file, { upsert: true });
        
      if (uploadError) throw uploadError;
      
      // Generate a URL for the uploaded image
      const { data } = await supabase.storage
        .from('profile-images')
        .getPublicUrl(filePath);
      
      // Set the banner image URL with a cache-busting query parameter
      setBannerImageUrl(`${data.publicUrl}?t=${new Date().getTime()}`);
      
      toast({
        title: "Banner image updated",
        description: "Your new banner image has been set.",
      });
      
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

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    }
  };

  const badges = [
    { name: "Early Adopter", icon: <Award size={20} />, unlocked: true },
    { name: "7-Day Streak", icon: <Trophy size={20} />, unlocked: streak >= 7 },
    { name: "First Quest", icon: <Award size={20} />, unlocked: completedQuests > 0 },
    { name: "Social", icon: <Share2 size={20} />, unlocked: false }
  ];
  
  return (
    <div className="pb-24">
      <motion.div 
        className="px-4 pt-6 pb-24 max-w-[340px] mx-auto"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Profile Header with Banner and Avatar */}
        <motion.div variants={itemVariants} className="mb-6">
          <PremiumCard className="relative h-40 overflow-hidden rounded-[8px]">
            <div className={`absolute inset-0 bg-gradient-to-tr ${
              themes.find(t => t.id === selectedTheme)?.color || "from-purple-400/20 to-purple-700/10"
            }`}>
              {bannerImageUrl ? (
                <img
                  src={bannerImageUrl}
                  alt="Profile Banner"
                  className="w-full h-full object-cover opacity-70"
                />
              ) : (
                <div className="w-full h-full">
                  <div className="absolute inset-0 bg-grid-white/[0.02]"></div>
                  
                  {/* Theme-based backgrounds */}
                  {selectedTheme === "Discipline" && (
                    <div className="absolute inset-0 flex items-center justify-center opacity-10">
                      <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                      </svg>
                    </div>
                  )}
                  
                  {selectedTheme === "Focus" && (
                    <div className="absolute inset-0 flex items-center justify-center opacity-10">
                      <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white">
                        <circle cx="12" cy="12" r="5"></circle>
                        <line x1="12" y1="1" x2="12" y2="3"></line>
                        <line x1="12" y1="21" x2="12" y2="23"></line>
                        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                        <line x1="1" y1="12" x2="3" y2="12"></line>
                        <line x1="21" y1="12" x2="23" y2="12"></line>
                        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                      </svg>
                    </div>
                  )}
                  
                  {selectedTheme === "Resilience" && (
                    <div className="absolute inset-0 flex items-center justify-center opacity-10">
                      <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                      </svg>
                    </div>
                  )}
                  
                  {selectedTheme === "Wildcards" && (
                    <div className="absolute inset-0 flex items-center justify-center opacity-10">
                      <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                      </svg>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            {/* Banner overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
            
            {/* Edit banner button */}
            <button
              onClick={() => setShowBannerUpload(true)}
              className="absolute top-4 right-4 bg-black/40 p-2 rounded-full backdrop-blur-sm border border-white/10 hover:bg-black/60 transition-all"
            >
              <Edit size={16} className="text-white" />
            </button>
            
            {/* User avatar */}
            <div className="absolute bottom-4 left-4 flex items-center gap-3">
              <div className="relative">
                <Avatar className="h-16 w-16 border-2 border-[#030303] shadow-xl">
                  {profileImageUrl ? (
                    <AvatarImage src={profileImageUrl} alt="Profile" className="object-cover" />
                  ) : (
                    <AvatarFallback className="bg-black text-white text-xl">
                      {user?.email?.charAt(0).toUpperCase() || <UserCircle size={28} />}
                    </AvatarFallback>
                  )}
                </Avatar>
                
                <button
                  onClick={() => setShowProfileUpload(true)}
                  className="absolute bottom-0 right-0 bg-black/80 p-1.5 rounded-full backdrop-blur-sm border border-white/10 hover:bg-black/60 transition-all"
                >
                  <Camera size={14} className="text-white" />
                </button>
              </div>
              
              {/* User info */}
              <div>
                <h2 className="font-bold text-white">
                  {user?.email?.split('@')[0] || "Guest User"}
                </h2>
                <p className="text-white/70 text-xs">
                  {selectedTheme} • Level {level} • {streak} day streak
                </p>
              </div>
            </div>
            
            {/* Settings button */}
            <button
              onClick={() => {/* Show settings */}}
              className="absolute bottom-4 right-4 bg-black/40 p-2 rounded-full backdrop-blur-sm border border-white/10 hover:bg-black/60 transition-all"
            >
              <Settings size={16} className="text-white" />
            </button>
          </PremiumCard>
        </motion.div>
        
        {/* XP and Level Progress */}
        <motion.div variants={itemVariants} className="mb-6">
          <PremiumCard className="p-4">
            <div className="flex justify-between items-center mb-3">
              <div>
                <h3 className="text-lg font-semibold">Level {level}</h3>
                <p className="text-xs text-white/70">{xpToNextLevel} XP to next level</p>
              </div>
              <div className="bg-white/5 px-3 py-1 rounded-full border border-white/10">
                <span className="text-white font-medium">{xp} XP</span>
              </div>
            </div>
            
            {/* Progress bar */}
            <div className="h-2 bg-white/5 rounded-full overflow-hidden mb-1">
              <div 
                className="h-full bg-white/30 rounded-full transition-all duration-500"
                style={{ width: `${(xp % 1000) / 10}%` }}
              />
            </div>
          </PremiumCard>
        </motion.div>
        
        {/* Stats Grid */}
        <motion.div variants={itemVariants} className="grid grid-cols-3 gap-3 mb-6">
          <PremiumCard className="p-4 flex flex-col items-center justify-center">
            <div className="text-2xl font-semibold mb-1">{streak}</div>
            <div className="text-xs text-white/70">Day Streak</div>
          </PremiumCard>
          
          <PremiumCard className="p-4 flex flex-col items-center justify-center">
            <div className="text-2xl font-semibold mb-1">{completedQuests}</div>
            <div className="text-xs text-white/70">Completed</div>
          </PremiumCard>
          
          <PremiumCard className="p-4 flex flex-col items-center justify-center">
            <div className="text-2xl font-semibold mb-1">{level}</div>
            <div className="text-xs text-white/70">Current Level</div>
          </PremiumCard>
        </motion.div>
        
        {/* Badges */}
        <motion.div variants={itemVariants} className="mb-6">
          <PremiumCard className="p-4">
            <h3 className="text-lg font-semibold mb-4">Badges</h3>
            <div className="grid grid-cols-4 gap-3">
              {badges.map((badge, index) => (
                <div key={index} className={`flex flex-col items-center ${!badge.unlocked && 'opacity-40'}`}>
                  <div className={`w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-2 ${badge.unlocked ? 'border border-white/20' : 'border border-white/10'}`}>
                    {badge.icon}
                  </div>
                  <span className="text-xs text-white/70 text-center">{badge.name}</span>
                </div>
              ))}
            </div>
          </PremiumCard>
        </motion.div>
        
        {/* Action Buttons */}
        <motion.div variants={itemVariants} className="grid grid-cols-3 gap-3 mb-6">
          <Button variant="outline" className="bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-white/20 h-14 flex flex-col gap-1 rounded-[8px]">
            <Calendar size={18} />
            <span className="text-xs">Calendar</span>
          </Button>
          <Button variant="outline" className="bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-white/20 h-14 flex flex-col gap-1 rounded-[8px]">
            <Trophy size={18} />
            <span className="text-xs">Ranking</span>
          </Button>
          <Button variant="outline" className="bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-white/20 h-14 flex flex-col gap-1 rounded-[8px]">
            <Share2 size={18} />
            <span className="text-xs">Share</span>
          </Button>
        </motion.div>
        
        {/* Theme Selector & Account */}
        <motion.div variants={itemVariants} className="space-y-4">
          {/* Theme Selection */}
          <PremiumCard className="p-4">
            <h3 className="text-lg font-semibold mb-4">Theme</h3>
            <div className="grid grid-cols-2 gap-3">
              {themes.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => setSelectedTheme(theme.id)}
                  className={`p-3 h-12 rounded-[8px] transition-all flex items-center justify-center ${
                    selectedTheme === theme.id 
                      ? "bg-white text-black font-medium"
                      : "bg-white/5 text-white/80 border border-white/10 hover:bg-white/10"
                  }`}
                >
                  {theme.name}
                </button>
              ))}
            </div>
          </PremiumCard>
          
          {/* Account Section */}
          <PremiumCard className="p-4">
            <h3 className="text-lg font-semibold mb-4">Account</h3>
            {user ? (
              <>
                <div className="flex items-center justify-between p-3 mb-4 rounded-[8px] bg-white/5 border border-white/5">
                  <div className="flex items-center">
                    <Send size={18} className="text-white/70 mr-3" />
                    <span className="text-white/90">Email</span>
                  </div>
                  <span className="text-white/60 text-sm max-w-[180px] truncate">{user.email}</span>
                </div>
                
                <Button 
                  onClick={handleSignOut}
                  className="w-full bg-white/5 text-white hover:bg-white/10 focus:ring-white/10 border border-white/10 rounded-[8px]"
                >
                  <LogOut size={16} className="mr-2" />
                  Sign Out
                </Button>
              </>
            ) : (
              <div className="p-3 rounded-[8px] bg-white/5 border border-white/5">
                <p className="text-white/70">Currently in guest mode</p>
              </div>
            )}
          </PremiumCard>
          
          {/* Profile Reset */}
          <ProfileReset 
            onReset={handleResetProfile} 
            isLoading={isResetting} 
          />
        </motion.div>

        {showProfileUpload && (
          <CameraUpload
            onClose={() => setShowProfileUpload(false)}
            onCapture={handleProfileImageChange}
            title="Update Profile Photo"
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
      
      <TabNavigation />
    </div>
  );
};

export default Profile;
