
import React from "react";
import { GlassCard } from "@/components/GlassCard";
import { TabNavigation } from "@/components/TabNavigation";
import { FiStar, FiZap, FiAward, FiLogIn } from "react-icons/fi";
import { useApp } from "@/context/AppContext";

const Profile = () => {
  const { isGuest, streak, xp, selectedTheme } = useApp();
  
  // Sample user data
  const user = {
    name: isGuest ? "Guest User" : "Solivrah User",
    streak: streak,
    xp: xp,
    theme: selectedTheme,
    badges: ["7-Day Streak", "First Quest", "Focus Master", "Photo Verified"],
  };
  
  return (
    <div className="min-h-screen pb-20">
      <div className="p-6 space-y-6">
        <div className="flex flex-col items-center justify-center">
          <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mb-3">
            <span className="text-3xl">👤</span>
          </div>
          <h1 className="text-xl font-medium">{user.name}</h1>
        </div>
        
        <GlassCard>
          <h2 className="text-lg font-medium mb-4">Stats</h2>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="glass p-4 rounded-xl">
              <div className="flex items-center gap-2">
                <FiStar className="text-primary" />
                <span className="font-medium">Streak</span>
              </div>
              <p className="text-2xl font-bold mt-2">{user.streak} days</p>
            </div>
            
            <div className="glass p-4 rounded-xl">
              <div className="flex items-center gap-2">
                <FiZap className="text-primary" />
                <span className="font-medium">Experience</span>
              </div>
              <p className="text-2xl font-bold mt-2">{user.xp} XP</p>
            </div>
          </div>
        </GlassCard>
        
        <GlassCard>
          <h2 className="text-lg font-medium mb-4">Badges</h2>
          
          <div className="grid grid-cols-2 gap-3">
            {user.badges.map((badge, index) => (
              <div key={index} className="glass p-3 rounded-xl flex items-center gap-2">
                <FiAward className="text-primary text-lg" />
                <span className="text-sm">{badge}</span>
              </div>
            ))}
          </div>
        </GlassCard>
        
        <button className="btn-primary w-full flex items-center justify-center gap-2">
          <FiLogIn /> Log in to Save Progress
        </button>
      </div>
      
      <TabNavigation />
    </div>
  );
};

export default Profile;
