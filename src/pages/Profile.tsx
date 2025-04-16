
import React, { useState } from "react";
import { FiArrowRight, FiSettings, FiUser, FiStar, FiActivity, FiMail, FiBriefcase, FiInfo, FiLogOut } from "react-icons/fi";
import { TabNavigation } from "@/components/TabNavigation";
import { GlassCard } from "@/components/GlassCard";
import { Progress } from "@/components/ui/progress";
import { useApp } from "@/context/AppContext";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { streak, xp, selectedTheme, addXP } = useApp();
  const navigate = useNavigate();
  const [isLoggedIn] = useState(true); // Mock state, in a real app would come from auth context
  
  // Calculate level based on XP (1000 XP per level)
  const level = Math.floor(xp / 1000) + 1;
  
  // Calculate progress to next level (percentage)
  const progress = ((xp % 1000) / 1000) * 100;

  // Mock user data
  const userData = {
    name: "David Saito",
    rating: "5.00",
    joinDate: "Oct 2024",
    streak: streak || 12,
    xp: xp || 2450,
    completedQuests: 42,
    theme: selectedTheme || "Focus"
  };

  // Mock badges array
  const badges = [
    { id: 1, name: "Early Adopter", icon: "🏆", achieved: true },
    { id: 2, name: "7-Day Streak", icon: "🔥", achieved: true },
    { id: 3, name: "First Quest", icon: "🚀", achieved: true },
    { id: 4, name: "Social Butterfly", icon: "🦋", achieved: false },
    { id: 5, name: "Night Owl", icon: "🦉", achieved: false },
    { id: 6, name: "Perfectionist", icon: "✨", achieved: false },
  ];

  // Animation delay utility function
  const getAnimationDelay = (index: number) => {
    return { animationDelay: `${0.1 + index * 0.05}s` };
  };

  return (
    <div className="min-h-screen pb-24 bg-black text-white">
      {/* Header */}
      <div className="relative">
        <div className="absolute top-0 left-0 w-full h-56 bg-gradient-to-b from-primary/20 to-transparent rounded-b-3xl z-0 opacity-30"></div>
        
        <div className="relative z-10 pt-10 px-6 pb-4">
          <div className="flex items-center justify-between">
            <div className="animate-fade-in">
              <h1 className="text-2xl font-bold">{userData.name}</h1>
              <div className="flex items-center mt-1 text-sm text-white/70">
                <FiStar className="text-accent mr-1" />
                <span>{userData.rating}</span>
              </div>
            </div>
            
            <div className="relative w-16 h-16 animate-pop-in">
              <div className="w-16 h-16 bg-black/40 backdrop-blur-md rounded-full border border-white/10 flex items-center justify-center overflow-hidden">
                {/* Placeholder avatar */}
                <FiUser className="text-3xl text-white/70" />
              </div>
              <div className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-primary flex items-center justify-center text-xs animate-pulse-slow">
                {level}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-3 gap-3 px-6 -mt-2 animate-fade-in">
        <div className="card-action py-4 animate-pop-in" style={getAnimationDelay(0)}>
          <div className="w-10 h-10 rounded-xl bg-black/80 flex items-center justify-center mb-1">
            <FiActivity className="text-primary" />
          </div>
          <span className="text-xs font-medium">Activity</span>
        </div>
        
        <div className="card-action py-4 animate-pop-in" style={getAnimationDelay(1)}>
          <div className="w-10 h-10 rounded-xl bg-black/80 flex items-center justify-center mb-1">
            <svg className="w-5 h-5 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <span className="text-xs font-medium">Wallet</span>
        </div>
        
        <div className="card-action py-4 animate-pop-in" style={getAnimationDelay(2)}>
          <div className="w-10 h-10 rounded-xl bg-black/80 flex items-center justify-center mb-1">
            <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span className="text-xs font-medium">Help</span>
        </div>
      </div>

      {/* Progress section */}
      <div className="px-6 mt-6">
        <GlassCard variant="dark" className="animate-pop-in" animate="none">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-semibold">Progress Overview</h2>
            <span className="text-sm text-white/70">Level {level}</span>
          </div>
          
          <div className="mb-6">
            <Progress 
              value={progress} 
              className="mb-2" 
              indicatorClassName="bg-gradient-to-r from-primary to-secondary"
              showValue
            />
            <div className="text-xs text-white/70">
              {1000 - (xp % 1000)} XP to Level {level + 1}
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-black/30 backdrop-blur-md rounded-xl p-3 border border-white/5">
              <div className="text-lg font-bold mb-1">{userData.streak}</div>
              <div className="text-xs text-white/70">Day Streak</div>
            </div>
            
            <div className="bg-black/30 backdrop-blur-md rounded-xl p-3 border border-white/5">
              <div className="text-lg font-bold mb-1">{userData.xp}</div>
              <div className="text-xs text-white/70">Total XP</div>
            </div>
            
            <div className="bg-black/30 backdrop-blur-md rounded-xl p-3 border border-white/5">
              <div className="text-lg font-bold mb-1">{userData.completedQuests}</div>
              <div className="text-xs text-white/70">Completed</div>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Privacy checkup */}
      <div className="px-6 mt-4">
        <GlassCard 
          variant="dark" 
          className="flex gap-4 items-center animate-fade-in cursor-pointer active:scale-[0.98] transition-all"
          animate="none"
          onClick={() => navigate("/privacy-checkup")}
        >
          <div className="flex-1">
            <h3 className="text-md font-medium mb-1">Privacy checkup</h3>
            <p className="text-xs text-white/70">Take an interactive tour of your privacy settings</p>
          </div>
          <div className="w-12 h-12 flex-shrink-0">
            <svg viewBox="0 0 24 24" fill="none" className="w-full h-full text-primary/70">
              <path d="M12 15v2m0-6v.01M12 12l-7-1V7a4 4 0 017.796-1.27M15 7c0-.236-.01-.47-.03-.7M21 15a9 9 0 01-9 9v-1a3 3 0 013-3h6z" 
                stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </GlassCard>
      </div>

      {/* Settings sections */}
      <div className="px-6 mt-4 space-y-4 animate-fade-in" style={{ animationDelay: "0.2s" }}>
        <div>
          <h2 className="flex items-center text-md font-medium px-2 mb-2">
            <FiSettings className="mr-2 opacity-70" /> Settings
          </h2>
          <div className="menu-item">
            <div className="flex items-center justify-between w-full">
              <span>Theme Preferences</span>
              <div className="text-white/50 text-xs font-medium px-2 py-1 rounded-full bg-white/5">{userData.theme}</div>
            </div>
          </div>
        </div>

        <div>
          <h2 className="flex items-center text-md font-medium px-2 mb-2">
            <FiMail className="mr-2 opacity-70" /> Messages
          </h2>
          <div className="menu-item">
            <div className="flex justify-between items-center w-full">
              <span>Notification Settings</span>
              <FiArrowRight className="text-white/50" />
            </div>
          </div>
        </div>

        <div>
          <h2 className="flex items-center text-md font-medium px-2 mb-2">
            <FiBriefcase className="mr-2 opacity-70" /> Setup profile
          </h2>
          <div className="menu-item">
            <div className="flex flex-col w-full">
              <span>Complete your profile</span>
              <span className="text-xs text-white/50 mt-1">Customize your experience & rewards</span>
            </div>
          </div>
        </div>

        <div>
          <h2 className="flex items-center text-md font-medium px-2 mb-2">
            <FiInfo className="mr-2 opacity-70" /> Legal
          </h2>
          <div className="menu-item">
            <div className="flex justify-between items-center w-full">
              <span>Privacy Policy & Terms</span>
              <FiArrowRight className="text-white/50" />
            </div>
          </div>
        </div>
        
        <button className="flex items-center justify-center gap-2 w-full mt-6 btn-dark">
          <FiLogOut /> {isLoggedIn ? "Log Out" : "Log In to Save Progress"}
        </button>
      </div>

      <TabNavigation />
    </div>
  );
};

export default Profile;
