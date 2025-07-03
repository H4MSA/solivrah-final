import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PremiumCard } from '../../PremiumCard';
import { Button } from '@/components/ui/button';
import { useApp } from '@/context/AppContext';
import { useToast } from '@/hooks/use-toast';
import { ProfileReset } from './ProfileReset';
import { Settings, LogOut, Send, Bell, Shield, Moon, Layout } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { useNavigate } from 'react-router-dom';

export const ProfileSettings: React.FC = () => {
  const { user, signOut, selectedTheme, resetProgress } = useApp();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isResetting, setIsResetting] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [dataPrivacy, setDataPrivacy] = useState(true);
  const [uiComplexity, setUiComplexity] = useState<'beginner' | 'intermediate' | 'advanced'>(
    () => localStorage.getItem('uiComplexity') as any || 'intermediate'
  );
  
  useEffect(() => {
    localStorage.setItem('uiComplexity', uiComplexity);
  }, [uiComplexity]);
  
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

      {/* Interface Settings */}
      <motion.div variants={itemVariants}>
        <PremiumCard className="p-4">
          <h3 className="text-lg font-semibold mb-4">Interface Complexity</h3>
          <p className="text-white/70 text-sm mb-4">Adjust how much information is displayed at once</p>
          
          <div className="space-y-3">
            <div 
              className={`p-3 rounded-lg border flex items-start cursor-pointer ${
                uiComplexity === 'beginner' 
                  ? 'bg-white/10 border-white/30' 
                  : 'bg-white/5 border-white/10'
              }`}
              onClick={() => setUiComplexity('beginner')}
            >
              <div className="mt-0.5 mr-3">
                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                  uiComplexity === 'beginner' ? 'border-white bg-white' : 'border-white/30'
                }`}>
                  {uiComplexity === 'beginner' && <div className="w-2 h-2 rounded-full bg-black" />}
                </div>
              </div>
              <div>
                <h4 className="font-medium">Simplified</h4>
                <p className="text-sm text-white/70">Focus on essential features with extra guidance</p>
              </div>
            </div>
            
            <div 
              className={`p-3 rounded-lg border flex items-start cursor-pointer ${
                uiComplexity === 'intermediate' 
                  ? 'bg-white/10 border-white/30' 
                  : 'bg-white/5 border-white/10'
              }`}
              onClick={() => setUiComplexity('intermediate')}
            >
              <div className="mt-0.5 mr-3">
                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                  uiComplexity === 'intermediate' ? 'border-white bg-white' : 'border-white/30'
                }`}>
                  {uiComplexity === 'intermediate' && <div className="w-2 h-2 rounded-full bg-black" />}
                </div>
              </div>
              <div>
                <h4 className="font-medium">Standard</h4>
                <p className="text-sm text-white/70">Balanced interface with moderate guidance</p>
              </div>
            </div>
            
            <div 
              className={`p-3 rounded-lg border flex items-start cursor-pointer ${
                uiComplexity === 'advanced' 
                  ? 'bg-white/10 border-white/30' 
                  : 'bg-white/5 border-white/10'
              }`}
              onClick={() => setUiComplexity('advanced')}
            >
              <div className="mt-0.5 mr-3">
                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                  uiComplexity === 'advanced' ? 'border-white bg-white' : 'border-white/30'
                }`}>
                  {uiComplexity === 'advanced' && <div className="w-2 h-2 rounded-full bg-black" />}
                </div>
              </div>
              <div>
                <h4 className="font-medium">Advanced</h4>
                <p className="text-sm text-white/70">Full feature access with minimal guidance</p>
              </div>
            </div>
          </div>
        </PremiumCard>
      </motion.div>

      {/* Help & Support */}
      <motion.div variants={itemVariants}>
        <PremiumCard className="p-4">
          <h3 className="text-lg font-semibold mb-4">Help & Support</h3>
          <Button 
            onClick={() => navigate('/help')}
            className="w-full bg-white/5 text-white hover:bg-white/10 focus:ring-white/10 border border-white/10 rounded-lg"
          >
            <Layout size={16} className="mr-2" />
            View Help Center
          </Button>
        </PremiumCard>
      </motion.div>

      {/* Account Settings */}
      <motion.div variants={itemVariants}>
        <PremiumCard className="p-4">
          <h3 className="text-lg font-semibold mb-4">Account</h3>
          {user ? (
            <div className="space-y-3">
              <Button
                onClick={handleSignOut}
                variant="destructive"
                className="w-full bg-red-900/40 text-red-300 hover:bg-red-900/60 border border-red-500/20"
              >
                <LogOut size={16} className="mr-2" />
                Sign Out
              </Button>
              <Button
                onClick={() => setIsResetting(true)}
                variant="outline"
                className="w-full bg-transparent text-white/70 hover:bg-white/5 border-white/10"
              >
                Reset Progress
              </Button>
            </div>
          ) : (
            <Button onClick={() => navigate('/auth')} className="w-full">
              Sign In to Manage Account
            </Button>
          )}
        </PremiumCard>
      </motion.div>
      
      {isResetting && <ProfileReset onCancel={() => setIsResetting(false)} onConfirm={handleResetProfile} />}
    </motion.div>
  );
};
