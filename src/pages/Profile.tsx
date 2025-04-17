
import React, { useState } from "react";
import { FiArrowRight, FiSettings, FiUser, FiStar, FiActivity, FiMail, FiBriefcase, FiInfo, FiLogOut, FiChevronRight, FiShield, FiEdit, FiHome, FiAward, FiTrendingUp, FiClock, FiCheck, FiCalendar, FiDownload, FiShare2, FiLock } from "react-icons/fi";
import { TabNavigation } from "@/components/TabNavigation";
import { GlassCard } from "@/components/GlassCard";
import { Progress } from "@/components/ui/progress";
import { useApp } from "@/context/AppContext";
import { useNavigate } from "react-router-dom";

const MenuCard = ({ icon, title, subtitle, value, onClick, locked = false }: { icon: React.ReactNode, title: string, subtitle?: string, value?: string, onClick: () => void, locked?: boolean }) => (
  <div 
    className={`relative bg-[#121212] border border-[#333333] rounded-xl p-4 flex items-center transition-all duration-300 hover:border-[#444444] active:scale-[0.98] cursor-pointer ${locked ? 'opacity-50' : ''}`}
    onClick={locked ? () => {} : onClick}
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
    
    {locked && (
      <div className="absolute top-0 right-0 m-1 p-1 bg-[#222222] rounded-full">
        <FiLock size={12} className="text-[#AAAAAA]" />
      </div>
    )}
  </div>
);

const StatCard = ({ value, label, icon }: { value: string | number, label: string, icon?: React.ReactNode }) => (
  <div className="bg-[#121212] border border-[#333333] rounded-xl p-3 flex flex-col items-center justify-center transform transition-all duration-300 hover:scale-[1.02] hover:border-[#444444]">
    {icon && <div className="text-[#999999] mb-1">{icon}</div>}
    <span className="text-white text-lg font-bold">{value}</span>
    <span className="text-[#AAAAAA] text-xs mt-1">{label}</span>
  </div>
);

const Badge = ({ icon, name, achieved }: { icon: string, name: string, achieved: boolean }) => (
  <div className={`flex flex-col items-center ${achieved ? 'opacity-100' : 'opacity-40'}`}>
    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl mb-1 ${
      achieved 
        ? 'bg-[#222222] border border-[#444444]' 
        : 'bg-[#1A1A1A] border border-[#333333]'
    }`}>
      {icon}
    </div>
    <span className="text-xs text-center text-[#AAAAAA]">{name}</span>
  </div>
);

const AchievementCard = ({ title, description, progress, total, achieved }: { title: string, description: string, progress: number, total: number, achieved: boolean }) => (
  <div className={`bg-[#121212] border border-[#333333] rounded-xl p-4 transition-all duration-300 hover:border-[#444444] ${achieved ? '' : 'opacity-70'}`}>
    <div className="flex justify-between items-center mb-2">
      <h3 className="text-white font-medium">{title}</h3>
      {achieved ? (
        <span className="text-xs bg-[#222222] px-2 py-1 rounded-full text-white flex items-center gap-1">
          <FiCheck size={12} />
          <span>Completed</span>
        </span>
      ) : (
        <span className="text-xs bg-[#222222] px-2 py-1 rounded-full text-[#AAAAAA]">{progress}/{total}</span>
      )}
    </div>
    <p className="text-[#AAAAAA] text-xs mb-3">{description}</p>
    <Progress 
      value={(progress / total) * 100} 
      className="h-1.5" 
      indicatorClassName={achieved ? "bg-white" : "bg-[#444444]"} 
    />
  </div>
);

const Profile = () => {
  const { streak, xp, selectedTheme, addXP } = useApp();
  const navigate = useNavigate();
  const [isLoggedIn] = useState(true); // Mock state, in a real app would come from auth context
  const [activeTab, setActiveTab] = useState<'overview' | 'achievements' | 'stats'>('overview');
  
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
    theme: selectedTheme || "Focus",
    weeklyAverage: "28 min",
    totalHours: "24.5 hrs",
    highestStreak: 14
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
  
  // Mock achievements
  const achievements = [
    { id: 1, title: "Beginner's Journey", description: "Complete 5 daily quests", progress: 5, total: 5, achieved: true },
    { id: 2, title: "Consistency Master", description: "Maintain a 7-day streak", progress: 7, total: 7, achieved: true },
    { id: 3, title: "Focus Champion", description: "Complete all focus-themed quests", progress: 3, total: 10, achieved: false },
    { id: 4, title: "Morning Person", description: "Complete 5 quests before 10am", progress: 2, total: 5, achieved: false },
    { id: 5, title: "Social Butterfly", description: "Share 3 accomplishments with friends", progress: 1, total: 3, achieved: false },
  ];
  
  // Mock stats data
  const dailyActivity = [
    { day: 'Mon', value: 45 },
    { day: 'Tue', value: 30 },
    { day: 'Wed', value: 60 },
    { day: 'Thu', value: 15 },
    { day: 'Fri', value: 75 },
    { day: 'Sat', value: 45 },
    { day: 'Sun', value: 20 },
  ];

  // Handle sign out
  const handleSignOut = () => {
    // In a real app, this would handle auth signout
    navigate('/auth');
  };
  
  // Handle export data
  const handleExportData = () => {
    // Generate mock data to export
    const exportData = {
      userData,
      achievements: achievements.filter(a => a.achieved),
      stats: {
        dailyActivity,
        totalXP: userData.xp,
        completedQuests: userData.completedQuests,
      }
    };
    
    // Create downloadable JSON
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "solivrah-data.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

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
              <span className="mx-2">•</span>
              <span>Member since {userData.joinDate}</span>
            </div>
          </div>
          
          <div className="relative animate-pop-in">
            <div className="w-16 h-16 bg-gradient-to-br from-[#222222] to-[#111111] rounded-full border border-[#333333] flex items-center justify-center overflow-hidden">
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
        
        {/* Tab Navigation */}
        <div className="flex mb-6 bg-[#121212] p-1 rounded-xl animate-fade-in">
          <button 
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'overview' 
                ? 'bg-[#222222] text-white' 
                : 'text-[#888888] hover:text-white'
            }`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button 
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'achievements' 
                ? 'bg-[#222222] text-white' 
                : 'text-[#888888] hover:text-white'
            }`}
            onClick={() => setActiveTab('achievements')}
          >
            Achievements
          </button>
          <button 
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'stats' 
                ? 'bg-[#222222] text-white' 
                : 'text-[#888888] hover:text-white'
            }`}
            onClick={() => setActiveTab('stats')}
          >
            Stats
          </button>
        </div>
        
        {activeTab === 'overview' && (
          <>
            {/* Stats Overview */}
            <div className="grid grid-cols-3 gap-3 mb-6 animate-fade-in" style={{ animationDelay: "0.1s" }}>
              <StatCard value={userData.streak} label="Day Streak" icon={<FiActivity size={16} />} />
              <StatCard value={userData.xp} label="Total XP" icon={<FiAward size={16} />} />
              <StatCard value={userData.completedQuests} label="Completed" icon={<FiCheck size={16} />} />
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
          
            {/* Quick Actions */}
            <div className="grid grid-cols-3 gap-3 mb-6 animate-fade-in" style={{ animationDelay: "0.4s" }}>
              <button className="flex flex-col items-center justify-center gap-2 p-4 bg-[#121212] border border-[#333333] rounded-xl hover:border-[#444444] transition-all">
                <FiCalendar className="text-white text-xl" />
                <span className="text-xs text-[#AAAAAA]">Calendar</span>
              </button>
              <button className="flex flex-col items-center justify-center gap-2 p-4 bg-[#121212] border border-[#333333] rounded-xl hover:border-[#444444] transition-all" onClick={handleExportData}>
                <FiDownload className="text-white text-xl" />
                <span className="text-xs text-[#AAAAAA]">Export</span>
              </button>
              <button className="flex flex-col items-center justify-center gap-2 p-4 bg-[#121212] border border-[#333333] rounded-xl hover:border-[#444444] transition-all">
                <FiShare2 className="text-white text-xl" />
                <span className="text-xs text-[#AAAAAA]">Share</span>
              </button>
            </div>
        
            {/* Settings */}
            <div className="space-y-6 animate-fade-in" style={{ animationDelay: "0.5s" }}>
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
              
              <button 
                className="w-full py-3.5 bg-[#222222] text-white rounded-xl border border-[#333333] flex items-center justify-center gap-2 hover:bg-[#333333] active:scale-[0.98] transition-all duration-300"
                onClick={handleSignOut}
              >
                <FiLogOut /> {isLoggedIn ? "Log Out" : "Log In to Save Progress"}
              </button>
            </div>
          </>
        )}
        
        {activeTab === 'achievements' && (
          <div className="animate-fade-in">
            <div className="mb-4 flex justify-between items-center">
              <h2 className="text-lg font-semibold">Your Achievements</h2>
              <span className="text-sm text-[#AAAAAA]">{achievements.filter(a => a.achieved).length}/{achievements.length} completed</span>
            </div>
            
            <div className="space-y-3 mb-6">
              {achievements.map(achievement => (
                <AchievementCard
                  key={achievement.id}
                  title={achievement.title}
                  description={achievement.description}
                  progress={achievement.progress}
                  total={achievement.total}
                  achieved={achievement.achieved}
                />
              ))}
            </div>
            
            <div className="bg-[#121212] border border-[#333333] rounded-xl p-5 mt-4">
              <h3 className="text-white font-medium mb-2">Coming Soon</h3>
              <p className="text-[#AAAAAA] text-sm">Complete more quests to unlock additional achievements!</p>
              <button className="mt-3 px-4 py-2 bg-[#222222] text-white rounded-lg border border-[#333333] text-sm flex items-center gap-2 hover:bg-[#333333] transition-all">
                Explore Quests <FiArrowRight size={14} />
              </button>
            </div>
          </div>
        )}
        
        {activeTab === 'stats' && (
          <div className="animate-fade-in">
            <div className="grid grid-cols-2 gap-3 mb-6">
              <StatCard value={userData.weeklyAverage} label="Weekly Average" icon={<FiClock size={16} />} />
              <StatCard value={userData.totalHours} label="Total Time" icon={<FiActivity size={16} />} />
              <StatCard value={userData.highestStreak} label="Highest Streak" icon={<FiTrendingUp size={16} />} />
              <StatCard value="4.8/5" label="Avg. Rating" icon={<FiStar size={16} />} />
            </div>
            
            <div className="bg-[#121212] border border-[#333333] rounded-xl p-5 mb-6">
              <h2 className="text-lg font-semibold mb-4">Daily Activity (mins)</h2>
              <div className="flex items-end justify-between h-32">
                {dailyActivity.map((day, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <div 
                      className="w-6 bg-[#333333] rounded-t-sm transition-all duration-500 animate-fade-in hover:bg-white"
                      style={{ 
                        height: `${(day.value / 75) * 100}%`,
                        animationDelay: `${index * 0.1}s`,
                      }}
                    ></div>
                    <div className="text-xs text-[#888888] mt-2">{day.day}</div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="space-y-3">
              <MenuCard 
                icon={<FiDownload className="text-white" />} 
                title="Export Data" 
                subtitle="Download your stats and progress"
                onClick={handleExportData}
              />
              <MenuCard 
                icon={<FiShare2 className="text-white" />} 
                title="Share Progress" 
                subtitle="Share your achievements with friends"
                onClick={() => {}}
              />
              <MenuCard 
                icon={<FiBriefcase className="text-white" />} 
                title="Progress Insights" 
                subtitle="Get detailed analytics of your journey"
                onClick={() => {}}
                locked={true}
              />
            </div>
          </div>
        )}
      </div>
  
      <TabNavigation />
    </div>
  );
};

export default Profile;
