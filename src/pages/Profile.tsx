
import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { PremiumCard } from '@/components/PremiumCard';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { motion } from 'framer-motion';
import { Camera, Edit, LogOut, UserCircle, Send } from 'lucide-react';
import { ProfileReset } from '@/components/ProfileReset';
import { ProfileStats } from '@/components/ProfileStats';
import { ProfileAchievements } from '@/components/ProfileAchievements';
import { ProfileOverview } from '@/components/ProfileOverview';
import { useToast } from '@/hooks/use-toast';
import { CameraUpload } from '@/components/CameraUpload';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TabNavigation } from '@/components/TabNavigation';

const Profile = () => {
  const { user, xp, streak, signOut, selectedTheme, setSelectedTheme, resetProgress } = useApp();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  const [showProfileUpload, setShowProfileUpload] = useState(false);
  const [showBannerUpload, setShowBannerUpload] = useState(false);
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const [bannerImageUrl, setBannerImageUrl] = useState<string | null>(null);
  const [isResetting, setIsResetting] = useState(false);
  
  const themes = [
    { id: "Discipline", name: "Discipline", color: "from-red-400/20 to-red-700/10" },
    { id: "Focus", name: "Focus", color: "from-purple-400/20 to-purple-700/10" },
    { id: "Resilience", name: "Resilience", color: "from-green-400/20 to-green-700/10" },
    { id: "Wildcards", name: "Wildcards", color: "from-amber-400/20 to-amber-700/10" }
  ];
  
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
      const fileExt = file.name.split('.').pop();
      const filePath = `profile-images/${user.id}-${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('profile-images')
        .upload(filePath, file);
        
      if (uploadError) throw uploadError;
      
      const { data: urlData } = supabase.storage
        .from('profile-images')
        .getPublicUrl(filePath);
        
      setProfileImageUrl(urlData.publicUrl);
      
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
      const fileExt = file.name.split('.').pop();
      const filePath = `banner-images/${user.id}-${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('profile-images')
        .upload(filePath, file);
        
      if (uploadError) throw uploadError;
      
      const { data: urlData } = supabase.storage
        .from('profile-images')
        .getPublicUrl(filePath);
        
      setBannerImageUrl(urlData.publicUrl);
      
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
  
  return (
    <div className="min-h-screen pb-24 text-white">
      <motion.div 
        className="px-5 pt-6 pb-24"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div variants={itemVariants} className="mb-6">
          <PremiumCard className="relative h-48 overflow-hidden rounded-xl">
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
            
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
            
            <button
              onClick={() => setShowBannerUpload(true)}
              className="absolute top-4 right-4 bg-black/40 p-2 rounded-full backdrop-blur-sm border border-white/10 hover:bg-black/60 transition-all"
            >
              <Edit size={16} className="text-white" />
            </button>
            
            <div className="absolute -bottom-12 left-4 h-24 w-24 rounded-full border-4 border-[#030303] shadow-xl">
              <Avatar className="h-full w-full">
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
          </PremiumCard>
        </motion.div>
        
        <motion.div variants={itemVariants} className="mt-16 mb-6">
          <h2 className="text-xl font-bold text-white">
            {user?.email?.split('@')[0] || "Guest User"}
          </h2>
          <p className="text-white/70 text-sm">
            {selectedTheme} Journey • {xp} XP • {streak} day streak
          </p>
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <Tabs defaultValue="overview" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-4 mb-6 bg-black/30 backdrop-blur-md border border-white/10 rounded-lg">
              <TabsTrigger value="overview" className="data-[state=active]:bg-white/10">Overview</TabsTrigger>
              <TabsTrigger value="achievements" className="data-[state=active]:bg-white/10">Badges</TabsTrigger>
              <TabsTrigger value="stats" className="data-[state=active]:bg-white/10">Stats</TabsTrigger>
              <TabsTrigger value="settings" className="data-[state=active]:bg-white/10">Settings</TabsTrigger>
            </TabsList>
            
            <div className="px-0">
              <TabsContent value="overview" className="mt-0">
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate={activeTab === "overview" ? "visible" : "hidden"}
                >
                  <ProfileOverview />
                </motion.div>
              </TabsContent>
              
              <TabsContent value="stats" className="mt-0">
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate={activeTab === "stats" ? "visible" : "hidden"}
                >
                  <ProfileStats />
                </motion.div>
              </TabsContent>
              
              <TabsContent value="achievements" className="mt-0">
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate={activeTab === "achievements" ? "visible" : "hidden"}
                >
                  <ProfileAchievements />
                </motion.div>
              </TabsContent>
              
              <TabsContent value="settings" className="mt-0">
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate={activeTab === "settings" ? "visible" : "hidden"}
                  className="space-y-4"
                >
                  <PremiumCard className="p-5">
                    <h3 className="text-lg font-medium text-white mb-4">Theme Preference</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {themes.map((theme) => (
                        <button
                          key={theme.id}
                          onClick={() => setSelectedTheme(theme.id)}
                          className={`p-4 rounded-xl transition-all flex items-center justify-center ${
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
  
                  <PremiumCard className="p-5">
                    <h3 className="text-lg font-medium text-white mb-4">Account</h3>
                    <div className="space-y-3">
                      {user ? (
                        <>
                          <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/5">
                            <div className="flex items-center">
                              <Send size={18} className="text-white/70 mr-3" />
                              <span className="text-white/90">Email</span>
                            </div>
                            <span className="text-white/60 text-sm max-w-[180px] truncate">{user.email}</span>
                          </div>
                          
                          <Button 
                            onClick={handleSignOut}
                            className="w-full bg-white/5 text-white hover:bg-white/10 focus:ring-white/10 border border-white/10"
                          >
                            <LogOut size={16} className="mr-2" />
                            Sign Out
                          </Button>
                        </>
                      ) : (
                        <div className="p-3 rounded-lg bg-white/5 border border-white/5">
                          <p className="text-white/70">Currently in guest mode</p>
                        </div>
                      )}
                    </div>
                  </PremiumCard>
              
                  <ProfileReset 
                    onReset={handleResetProfile} 
                    isLoading={isResetting} 
                  />
                </motion.div>
              </TabsContent>
            </div>
          </Tabs>
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
