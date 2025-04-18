
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TabNavigation } from "@/components/TabNavigation";
import { useApp } from "@/context/AppContext";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { GlassCard } from "@/components/GlassCard";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import { 
  Settings, LogOut, Star, Zap, Award, Bell, Moon, Sun, 
  ChevronRight, User, Shield, RefreshCw, AlertTriangle 
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { 
    user, 
    setUser, 
    streak, 
    xp, 
    selectedTheme, 
    setSelectedTheme, 
    resetProgress, 
    isGuest,
    setIsGuest 
  } = useApp();
  
  const [darkMode, setDarkMode] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  
  // Calculate level
  const level = Math.floor(xp / 1000) + 1;
  
  // Handle logout
  const handleLogout = () => {
    setUser(null);
    setIsGuest(true);
    navigate("/");
    
    toast({
      title: "Logged out",
      description: "You have been logged out successfully.",
    });
  };
  
  // Handle reset progress
  const handleResetProgress = () => {
    resetProgress();
    
    toast({
      title: "Progress Reset",
      description: "Your progress has been reset.",
    });
  };
  
  return (
    <div className="min-h-screen pb-24 text-white">
      <div className="p-5 space-y-5">
      
        {/* Profile header */}
        <div className="flex items-center space-x-4 p-1">
          <div className="h-20 w-20 rounded-full bg-[#2D2D2D] border border-white/10 flex items-center justify-center shadow-lg transform-gpu" style={{ transform: 'translateZ(10px)' }}>
            <User size={36} className="text-white/70" />
          </div>
          <div>
            <h1 className="text-xl font-semibold">{user?.name || "Guest User"}</h1>
            <p className="text-sm text-[#E0E0E0]">Level {level} • {streak} day streak</p>
            <div className="flex items-center gap-2 mt-1 text-[#E0E0E0]">
              <span className="flex items-center gap-1">
                <Zap size={14} /> {xp} XP
              </span>
              •
              <span className="flex items-center gap-1">
                <Star size={14} /> {streak} streak
              </span>
            </div>
          </div>
        </div>
        
        {/* Stats */}
        <GlassCard className="p-4" variant="subtle">
          <h2 className="text-lg font-medium mb-3">Your Progress</h2>
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-[#1A1A1A]/70 backdrop-blur-sm rounded-lg p-3 border border-white/5">
              <h3 className="text-sm text-[#E0E0E0]">Level</h3>
              <p className="text-xl font-medium">{level}</p>
            </div>
            <div className="bg-[#1A1A1A]/70 backdrop-blur-sm rounded-lg p-3 border border-white/5">
              <h3 className="text-sm text-[#E0E0E0]">XP</h3>
              <p className="text-xl font-medium">{xp}</p>
            </div>
            <div className="bg-[#1A1A1A]/70 backdrop-blur-sm rounded-lg p-3 border border-white/5">
              <h3 className="text-sm text-[#E0E0E0]">Streak</h3>
              <p className="text-xl font-medium">{streak}</p>
            </div>
          </div>
        </GlassCard>
        
        {/* Settings */}
        <GlassCard className="p-4" variant="subtle">
          <h2 className="text-lg font-medium mb-3">Settings</h2>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-[#1A1A1A] border border-white/5">
                  <Bell size={18} className="text-white/70" />
                </div>
                <span>Notifications</span>
              </div>
              <Switch 
                checked={notificationsEnabled} 
                onCheckedChange={setNotificationsEnabled} 
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-[#1A1A1A] border border-white/5">
                  {darkMode ? <Moon size={18} className="text-white/70" /> : <Sun size={18} className="text-white/70" />}
                </div>
                <span>Dark Mode</span>
              </div>
              <Switch 
                checked={darkMode} 
                onCheckedChange={setDarkMode} 
              />
            </div>
            
            <Separator className="my-2 bg-white/10" />
            
            <div className="flex items-center justify-between py-1">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-[#1A1A1A] border border-white/5">
                  <Shield size={18} className="text-white/70" />
                </div>
                <span>Privacy Settings</span>
              </div>
              <ChevronRight size={18} className="text-white/50" />
            </div>
            
            <div className="flex items-center justify-between py-1">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-[#1A1A1A] border border-white/5">
                  <Settings size={18} className="text-white/70" />
                </div>
                <span>App Settings</span>
              </div>
              <ChevronRight size={18} className="text-white/50" />
            </div>
            
            <Separator className="my-2 bg-white/10" />
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button className="flex items-center justify-between w-full py-2 px-1 hover:bg-white/5 rounded-lg transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-[#1A1A1A] border border-white/5">
                      <RefreshCw size={18} className="text-white/70" />
                    </div>
                    <span>Reset Progress</span>
                  </div>
                  <ChevronRight size={18} className="text-white/50" />
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Reset your progress?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will reset your XP, streak, and all progress. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleResetProgress}>
                    Reset Progress
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            
            <Separator className="my-2 bg-white/10" />
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button className="flex items-center gap-3 text-[#E77] w-full py-2 px-1 hover:bg-white/5 rounded-lg transition-colors">
                  <div className="p-2 rounded-full bg-[#331A1A] border border-white/5">
                    <LogOut size={18} className="text-[#E77]" />
                  </div>
                  <span>Log Out</span>
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure you want to log out?</AlertDialogTitle>
                  <AlertDialogDescription>
                    You will need to sign in again to access your account.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleLogout}>
                    Log Out
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </GlassCard>
        
        {/* App info */}
        <div className="mt-6 text-center text-xs text-[#999999]">
          <p>Solivrah v1.0.0</p>
          <p className="mt-1">© 2025 All rights reserved</p>
        </div>
      </div>
      
      <TabNavigation />
    </div>
  );
};

export default Profile;
