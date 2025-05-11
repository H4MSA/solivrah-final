import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PremiumCard } from '@/components/PremiumCard';
import { Button } from '@/components/ui/button';
import { useApp } from '@/context/AppContext';
import { useToast } from '@/hooks/use-toast';
import { ProfileReset } from '@/components/ProfileReset';
import { Settings, LogOut, Send, Bell, Shield, Moon } from 'lucide-react';
import { Switch } from '@/components/ui/switch';

export const ProfileSettings: React.FC = () => {
  const { user, signOut, selectedTheme, resetProgress } = useApp();
  const { toast } = useToast();
  const [isResetting, setIsResetting] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [dataPrivacy, setDataPrivacy] = useState(true);
  
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
      // Call the reset progress function from the context
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

  const toggleNotifications = () => {
    setNotifications(!notifications);
    toast({
      title: notifications ? "Notifications disabled" : "Notifications enabled",
      description: notifications ? "You will no longer receive notifications." : "You will now receive notifications.",
    });
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    toast({
      title: darkMode ? "Light mode enabled" : "Dark mode enabled",
      description: "Your theme preference has been updated.",
    });
  };

  const toggleDataPrivacy = () => {
    setDataPrivacy(!dataPrivacy);
    toast({
      title: dataPrivacy ? "Data sharing disabled" : "Data sharing enabled",
      description: "Your privacy settings have been updated.",
    });
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-5"
    >
      {/* General Settings */}
      <motion.div variants={itemVariants}>
        <PremiumCard className="p-4">
          <h3 className="text-lg font-semibold mb-4">General Settings</h3>
          
          {/* Notifications Toggle */}
          <div className="flex items-center justify-between p-3 mb-3 rounded-lg bg-white/5 border border-white/5">
            <div className="flex items-center">
              <Bell size={18} className="text-white/70 mr-3" />
              <span className="text-white/90">Notifications</span>
            </div>
            <Switch 
              checked={notifications} 
              onCheckedChange={toggleNotifications}
            />
          </div>
          
          {/* Dark Mode Toggle */}
          <div className="flex items-center justify-between p-3 mb-3 rounded-lg bg-white/5 border border-white/5">
            <div className="flex items-center">
              <Moon size={18} className="text-white/70 mr-3" />
              <span className="text-white/90">Dark Mode</span>
            </div>
            <Switch 
              checked={darkMode} 
              onCheckedChange={toggleDarkMode}
            />
          </div>
          
          {/* Data Privacy Toggle */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5">
            <div className="flex items-center">
              <Shield size={18} className="text-white/70 mr-3" />
              <span className="text-white/90">Enhanced Privacy</span>
            </div>
            <Switch 
              checked={dataPrivacy} 
              onCheckedChange={toggleDataPrivacy}
            />
          </div>
        </PremiumCard>
      </motion.div>

      {/* Account Settings */}
      <motion.div variants={itemVariants}>
        <PremiumCard className="p-4">
          <h3 className="text-lg font-semibold mb-4">Account</h3>
          {user ? (
            <>
              <div className="flex items-center justify-between p-3 mb-4 rounded-lg bg-white/5 border border-white/5">
                <div className="flex items-center">
                  <Send size={18} className="text-white/70 mr-3" />
                  <span className="text-white/90">Email</span>
                </div>
                <span className="text-white/60 text-sm max-w-[180px] truncate">{user.email}</span>
              </div>
              
              <Button 
                onClick={handleSignOut}
                className="w-full bg-white/5 text-white hover:bg-white/10 focus:ring-white/10 border border-white/10 rounded-lg"
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
        </PremiumCard>
      </motion.div>
      
      {/* Profile Reset */}
      <motion.div variants={itemVariants}>
        <ProfileReset 
          onReset={handleResetProfile} 
          isLoading={isResetting} 
        />
      </motion.div>
    </motion.div>
  );
};
