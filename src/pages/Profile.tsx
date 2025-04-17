
import React, { useState } from "react";
import { FiArrowRight, FiSettings, FiUser, FiStar, FiActivity, FiMail, FiBriefcase, FiInfo, FiLogOut, FiChevronRight, FiShield, FiEdit, FiHome } from "react-icons/fi";
import { TabNavigation } from "@/components/TabNavigation";
import { GlassCard } from "@/components/GlassCard";
import { Progress } from "@/components/ui/progress";
import { useApp } from "@/context/AppContext";
import { useNavigate } from "react-router-dom";

const MenuCard = ({ icon, title, subtitle, value, onClick }: { icon: React.ReactNode, title: string, subtitle?: string, value?: string, onClick: () => void }) => (
  <div 
    className="bg-[#121212] border border-[#333333] rounded-xl p-4 flex items-center transition-all duration-300 hover:border-[#444444] active:scale-[0.98] cursor-pointer"
    onClick={onClick}
  >
    <div className="w-10 h-10 rounded-xl bg-[#222222] flex items-center justify-center mr-4 flex-shrink-0">
      {icon}
    </div>
    <div className="flex-1">
      <h3 className="text-white font-medium">{title}</h3>
      {subtitle && <p className="text-[#AAAAAA] text-xs mt-0.5">{subtitle}</p>}
    </div>
    {value ? (
      <span className="text-[#AAAAAA] text-sm font-medium bg-[#222222] px-3 py-1 rounded-full">{value}</span>
    ) : (
      <FiChevronRight className="text-[#AAAAAA]" />
    )}
  </div>
);

const StatCard = ({ value, label }: { value: string | number, label: string }) => (
  <div className="bg-[#121212] border border-[#333333] rounded-xl p-3 flex flex-col items-center justify-center">
    <span className="text-white text-lg font-bold">{value}</span>
    <span className="text-[#AAAAAA] text-xs mt-1">{label}</span>
  </div>
);

const Badge = ({ icon, name, achieved }: { icon: string, name: string, achieved: boolean }) => (
  <div className={`flex flex-col items-center ${achieved ? 'opacity-100' : 'opacity-40'}`}>
    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl mb-1 ${achieved ? 'bg-[#222222]' : 'bg-[#1A1A1A]'}`}>
      {icon}
    </div>
    <span className="text-xs text-center text-[#AAAAAA]">{name}</span>
  </div>
);

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
    { id: 4, name: "Social", icon: "🦋", achieved: false },
    { id: 5, name: "Night Owl", icon: "🦉", achieved: false },
    { id: 6, name: "Perfect", icon: "✨", achieved: false },
  ];

  return (
    <div className="min-h-screen pb-24 bg-black text-white">
      {/* Header */}
      <div className="p-4 pt-8">
        <div className="flex items-center justify-between mb-6 animate-fade-in">
          <div>
            <h1 className="text-2xl font-bold">{userData.name}</h1>
            <div className="flex items-center mt-1 text-sm text-[#AAAAAA]">
              <FiStar className="text-white mr-1" />
              <span>{userData.rating}</span>
            </div>
          </div>
          
          <div className="relative animate-pop-in">
            <div className="w-16 h-16 bg-[#222222] rounded-full border border-[#333333] flex items-center justify-center overflow-hidden">
              <FiUser className="text-3xl text-white" />
            </div>
            <div className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-[#222222] border border-[#333333] flex items-center justify-center text-xs">
              {level}
            </div>
            <button className="absolute -right-1 -bottom-1 bg-white text-black rounded-full p-1 w-6 h-6 flex items-center justify-center shadow-lg">
              <FiEdit size={12} />
            </button>
          </div>
        </div>
  
        {/* Stats Overview */}
        <div className="grid grid-cols-3 gap-3 mb-6 animate-fade-in" style={{ animationDelay: "0.1s" }}>
          <StatCard value={userData.streak} label="Day Streak" />
          <StatCard value={userData.xp} label="Total XP" />
          <StatCard value={userData.completedQuests} label="Completed" />
        </div>
  
        {/* Progress */}
        <div className="bg-[#121212] border border-[#333333] rounded-xl p-5 mb-6 animate-fade-in" style={{ animationDelay: "0.2s" }}>
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-semibold">Level Progress</h2>
            <span className="text-sm text-[#AAAAAA]">Level {level}</span>
          </div>
          
          <div className="space-y-2">
            <Progress 
              value={progress} 
              className="mb-2" 
              indicatorClassName="bg-white"
              showValue
            />
            <div className="text-xs text-[#AAAAAA]">
              {1000 - (xp % 1000)} XP to Level {level + 1}
            </div>
          </div>
        </div>
  
        {/* Badges */}
        <div className="mb-6 animate-fade-in" style={{ animationDelay: "0.3s" }}>
          <h2 className="text-lg font-semibold mb-4">Badges</h2>
          <div className="grid grid-cols-6 gap-2">
            {badges.map((badge) => (
              <Badge 
                key={badge.id} 
                icon={badge.icon} 
                name={badge.name} 
                achieved={badge.achieved} 
              />
            ))}
          </div>
        </div>
  
        {/* Settings */}
        <div className="space-y-6 animate-fade-in" style={{ animationDelay: "0.4s" }}>
          <div>
            <h2 className="text-lg font-semibold mb-3">Settings</h2>
            <div className="space-y-3">
              <MenuCard 
                icon={<FiSettings className="text-white" />} 
                title="Theme Preferences" 
                value={userData.theme}
                onClick={() => navigate("/survey")}
              />
              <MenuCard 
                icon={<FiMail className="text-white" />} 
                title="Notifications" 
                subtitle="Manage your notification settings"
                onClick={() => {}}
              />
              <MenuCard 
                icon={<FiActivity className="text-white" />} 
                title="Activity Log" 
                subtitle="View your recent activity"
                onClick={() => {}}
              />
              <MenuCard 
                icon={<FiShield className="text-white" />} 
                title="Privacy & Security" 
                subtitle="Manage your account security"
                onClick={() => {}}
              />
              <MenuCard 
                icon={<FiInfo className="text-white" />} 
                title="About Solivrah" 
                subtitle="Learn more about the app"
                onClick={() => {}}
              />
            </div>
          </div>
          
          <button className="w-full py-3.5 bg-[#222222] text-white rounded-xl border border-[#333333] flex items-center justify-center gap-2 hover:bg-[#333333] active:scale-[0.98] transition-all duration-300">
            <FiLogOut /> {isLoggedIn ? "Log Out" : "Log In to Save Progress"}
          </button>
        </div>
      </div>
  
      <TabNavigation />
    </div>
  );
};

export default Profile;
