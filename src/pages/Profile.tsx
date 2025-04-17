
import React, { useState, useEffect } from "react";
import { FiArrowRight, FiSettings, FiUser, FiStar, FiActivity, FiMail, FiBriefcase, FiInfo, FiLogOut, FiChevronRight, FiShield, FiEdit, FiHome, FiAward, FiTrendingUp, FiClock, FiCheck, FiCalendar, FiDownload, FiShare2, FiLock, FiRotateCcw } from "react-icons/fi";
import { TabNavigation } from "@/components/TabNavigation";
import { GlassCard } from "@/components/GlassCard";
import { Progress } from "@/components/ui/progress";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import { useApp } from "@/context/AppContext";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";

const MenuCard = ({ icon, title, subtitle, value, onClick, locked = false }: { icon: React.ReactNode, title: string, subtitle?: string, value?: string, onClick: () => void, locked?: boolean }) => {
  const { selectedTheme } = useApp();
  
  // Get theme-specific glow colors
  const getThemeGlow = () => {
    if (locked) return "transparent";
    
    switch (selectedTheme) {
      case "Discipline": return "rgba(255, 0, 0, 0.05)";
      case "Focus": return "rgba(0, 128, 128, 0.05)";
      case "Resilience": return "rgba(255, 165, 0, 0.05)";
      case "Wildcards": return "rgba(0, 255, 0, 0.05)";
      default: return "rgba(255, 255, 255, 0.05)";
    }
  };
  
  return (
    <div 
      className={`relative bg-black/40 backdrop-blur-xl border border-white/10 rounded-xl p-4 flex items-center transition-all duration-300 hover:border-white/20 shadow-lg active:scale-[0.98] cursor-pointer transform hover:scale-[1.01] ${locked ? 'opacity-50' : ''}`}
      onClick={locked ? () => {} : onClick}
      style={{ boxShadow: `0 5px 15px ${getThemeGlow()}` }}
    >
      <div className="w-10 h-10 rounded-xl bg-black/60 border border-white/5 flex items-center justify-center mr-4 flex-shrink-0 shadow-inner">
        {icon}
      </div>
      <div className="flex-1">
        <h3 className="text-white font-medium">{title}</h3>
        {subtitle && <p className="text-white/70 text-xs mt-0.5">{subtitle}</p>}
      </div>
      {value ? (
        <span className="text-white/80 text-sm font-medium bg-black/40 backdrop-blur-sm border border-white/10 px-3 py-1 rounded-full shadow-inner">{value}</span>
      ) : (
        <FiChevronRight className="text-white/70" />
      )}
      
      {locked && (
        <div className="absolute top-0 right-0 m-1 p-1 bg-black/50 rounded-full">
          <FiLock size={12} className="text-white/70" />
        </div>
      )}
    </div>
  );
};

const StatCard = ({ value, label, icon }: { value: string | number, label: string, icon?: React.ReactNode }) => {
  const { selectedTheme } = useApp();
  
  // Get theme-specific glow colors
  const getThemeGlow = () => {
    switch (selectedTheme) {
      case "Discipline": return "rgba(255, 0, 0, 0.05)";
      case "Focus": return "rgba(0, 128, 128, 0.05)";
      case "Resilience": return "rgba(255, 165, 0, 0.05)";
      case "Wildcards": return "rgba(0, 255, 0, 0.05)";
      default: return "rgba(255, 255, 255, 0.05)";
    }
  };
  
  return (
    <div 
      className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-xl p-3 flex flex-col items-center justify-center transform transition-all duration-300 hover:scale-[1.02] hover:border-white/20 shadow-lg"
      style={{ boxShadow: `0 5px 15px ${getThemeGlow()}` }}
    >
      {icon && <div className="text-white/80 mb-1">{icon}</div>}
      <span className="text-white text-lg font-bold">{value}</span>
      <span className="text-white/70 text-xs mt-1">{label}</span>
    </div>
  );
};

const Badge = ({ icon, name, achieved }: { icon: string, name: string, achieved: boolean }) => (
  <div className={`flex flex-col items-center ${achieved ? 'opacity-100' : 'opacity-40'}`}>
    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl mb-1 backdrop-blur-md shadow-lg ${
      achieved 
        ? 'bg-black/50 border border-white/20' 
        : 'bg-black/30 border border-white/5'
    }`}>
      {icon}
    </div>
    <span className="text-xs text-center text-white/80">{name}</span>
  </div>
);

const AchievementCard = ({ title, description, progress, total, achieved }: { title: string, description: string, progress: number, total: number, achieved: boolean }) => {
  const { selectedTheme } = useApp();
  
  // Get theme-specific glow colors
  const getThemeGlow = () => {
    if (achieved) return "rgba(255, 255, 255, 0.1)";
    
    switch (selectedTheme) {
      case "Discipline": return "rgba(255, 0, 0, 0.05)";
      case "Focus": return "rgba(0, 128, 128, 0.05)";
      case "Resilience": return "rgba(255, 165, 0, 0.05)";
      case "Wildcards": return "rgba(0, 255, 0, 0.05)";
      default: return "rgba(255, 255, 255, 0.05)";
    }
  };
  
  return (
    <div 
      className={`bg-black/40 backdrop-blur-xl border border-white/10 rounded-xl p-4 transition-all duration-300 hover:border-white/20 shadow-lg ${achieved ? '' : 'opacity-70'}`}
      style={{ boxShadow: `0 5px 15px ${getThemeGlow()}` }}
    >
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-white font-medium">{title}</h3>
        {achieved ? (
          <span className="text-xs bg-black/60 border border-white/10 px-2 py-1 rounded-full text-white flex items-center gap-1 shadow-inner">
            <FiCheck size={12} />
            <span>Completed</span>
          </span>
        ) : (
          <span className="text-xs bg-black/50 border border-white/5 px-2 py-1 rounded-full text-white/70 shadow-inner">{progress}/{total}</span>
        )}
      </div>
      <p className="text-white/70 text-xs mb-3">{description}</p>
      <Progress 
        value={(progress / total) * 100} 
        className="h-1.5 overflow-hidden rounded-full bg-black/40 border border-white/5" 
        indicatorClassName={achieved ? "bg-white" : "bg-white/40"} 
      />
    </div>
  );
};

const Profile = () => {
  const { streak, xp, selectedTheme, user, addXP, resetProgress } = useApp();
  const navigate = useNavigate();
  const [isLoggedIn] = useState(true); // Mock state, in a real app would come from auth context
  const [activeTab, setActiveTab] = useState<'overview' | 'achievements' | 'stats'>('overview');
  const [resetConfirm, setResetConfirm] = useState(false);
  
  // Calculate level based on XP (1000 XP per level)
  const level = Math.floor(xp / 1000) + 1;
  
  // Calculate progress to next level (percentage)
  const progress = ((xp % 1000) / 1000) * 100;

  // Get user name from context or use "Friend" as default
  const userName = user?.name || "Friend";

  // User data
  const userData = {
    name: userName,
    rating: "5.00",
    joinDate: "Oct 2024",
    streak: streak || 0,
    xp: xp || 0,
    completedQuests: Math.floor(xp / 50) || 0, // 50 XP per quest
    theme: selectedTheme || "Focus",
    weeklyAverage: "28 min",
    totalHours: "24.5 hrs",
    highestStreak: Math.max(streak, 14)
  };

  // Badges array
  const badges = [
    { id: 1, name: "Early Adopter", icon: "🏆", achieved: true },
    { id: 2, name: "7-Day Streak", icon: "🔥", achieved: streak >= 7 },
    { id: 3, name: "First Quest", icon: "🚀", achieved: userData.completedQuests > 0 },
    { id: 4, name: "Social", icon: "🦋", achieved: false },
    { id: 5, name: "Night Owl", icon: "🦉", achieved: false },
    { id: 6, name: "Perfect", icon: "✨", achieved: false },
  ];
  
  // Mock achievements
  const achievements = [
    { id: 1, title: "Beginner's Journey", description: "Complete 5 daily quests", progress: Math.min(userData.completedQuests, 5), total: 5, achieved: userData.completedQuests >= 5 },
    { id: 2, title: "Consistency Master", description: "Maintain a 7-day streak", progress: Math.min(streak, 7), total: 7, achieved: streak >= 7 },
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
  
  // Handle progress reset
  const handleResetProgress = () => {
    if (resetConfirm) {
      resetProgress();
      setResetConfirm(false);
      toast({
        title: "Progress Reset",
        description: "All your progress has been reset to zero.",
        variant: "default",
      });
    } else {
      setResetConfirm(true);
      setTimeout(() => setResetConfirm(false), 3000); // Reset after 3 seconds if not confirmed
    }
  };

  // Get theme-specific colors for UI elements
  const getThemeColor = () => {
    switch (selectedTheme) {
      case "Discipline": return "from-[#FF0000] to-[#6B0000]";
      case "Focus": return "from-[#008080] to-[#000046]";
      case "Resilience": return "from-[#FFA500] to-[#8B4513]";
      case "Wildcards": return "from-[#00FF00] to-[#006400]";
      default: return "from-white to-white/80";
    }
  };

  return (
    <div className="min-h-screen pb-24 text-white">
      {/* Header */}
      <div className="p-4 pt-8">
        <div className="flex items-center justify-between mb-6 animate-fade-in">
          <div>
            <h1 className="text-2xl font-bold">{userData.name}</h1>
            <div className="flex items-center mt-1 text-sm text-white/70">
              <FiStar className="text-white mr-1" />
              <span>{userData.rating}</span>
              <span className="mx-2">•</span>
              <span>Member since {userData.joinDate}</span>
            </div>
          </div>
          
          <div className="relative animate-pop-in">
            <div className="w-16 h-16 bg-gradient-to-br from-black/60 to-black/30 backdrop-blur-xl rounded-full border border-white/10 flex items-center justify-center overflow-hidden shadow-lg">
              <FiUser className="text-3xl text-white" />
            </div>
            <div className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center text-xs shadow-lg">
              {level}
            </div>
            <button className="absolute -right-1 -bottom-1 bg-white text-black rounded-full p-1 w-6 h-6 flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all">
              <FiEdit size={12} />
            </button>
          </div>
        </div>
        
        {/* Tab Navigation */}
        <div className="flex mb-6 bg-black/40 backdrop-blur-xl border border-white/5 p-1 rounded-xl animate-fade-in shadow-lg">
          <button 
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'overview' 
                ? 'bg-black/60 text-white shadow-inner' 
                : 'text-white/70 hover:text-white'
            }`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button 
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'achievements' 
                ? 'bg-black/60 text-white shadow-inner' 
                : 'text-white/70 hover:text-white'
            }`}
            onClick={() => setActiveTab('achievements')}
          >
            Achievements
          </button>
          <button 
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'stats' 
                ? 'bg-black/60 text-white shadow-inner' 
                : 'text-white/70 hover:text-white'
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
            <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-xl p-5 mb-6 animate-fade-in shadow-lg" style={{ animationDelay: "0.2s" }}>
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-lg font-semibold">Level Progress</h2>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-white/80">Level {level}</span>
                  <HoverBorderGradient
                    containerClassName="h-8 w-8 p-0"
                    className="!bg-black/80 !p-0 flex items-center justify-center h-full w-full"
                    onClick={handleResetProgress}
                  >
                    <FiRotateCcw size={14} />
                  </HoverBorderGradient>
                </div>
              </div>
              
              <div className="space-y-2">
                <Progress 
                  value={progress} 
                  className="mb-2 h-2 overflow-hidden rounded-full bg-black/40 border border-white/5" 
                  indicatorClassName={`bg-gradient-to-r ${getThemeColor()}`}
                  showValue
                />
                <div className="text-xs text-white/70">
                  {1000 - (xp % 1000)} XP to Level {level + 1}
                </div>
              </div>
              
              {resetConfirm && (
                <div className="mt-3 p-2 bg-red-500/20 backdrop-blur-md border border-red-500/30 rounded-lg text-sm text-white">
                  Confirm reset all progress? <button className="font-bold underline" onClick={handleResetProgress}>Yes</button>
                </div>
              )}
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
              <button className="flex flex-col items-center justify-center gap-2 p-4 bg-black/40 backdrop-blur-xl border border-white/10 rounded-xl hover:border-white/20 transition-all hover:scale-105 active:scale-95 shadow-lg">
                <FiCalendar className="text-white text-xl" />
                <span className="text-xs text-white/80">Calendar</span>
              </button>
              <button className="flex flex-col items-center justify-center gap-2 p-4 bg-black/40 backdrop-blur-xl border border-white/10 rounded-xl hover:border-white/20 transition-all hover:scale-105 active:scale-95 shadow-lg" onClick={handleExportData}>
                <FiDownload className="text-white text-xl" />
                <span className="text-xs text-white/80">Export</span>
              </button>
              <button className="flex flex-col items-center justify-center gap-2 p-4 bg-black/40 backdrop-blur-xl border border-white/10 rounded-xl hover:border-white/20 transition-all hover:scale-105 active:scale-95 shadow-lg">
                <FiShare2 className="text-white text-xl" />
                <span className="text-xs text-white/80">Share</span>
              </button>
            </div>
        
            {/* Settings */}
            <div className="space-y-3 animate-fade-in" style={{ animationDelay: "0.5s" }}>
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
              
              <HoverBorderGradient
                containerClassName="w-full mt-4"
                className="w-full py-2 font-medium flex items-center justify-center gap-2"
                onClick={handleSignOut}
              >
                <FiLogOut /> {isLoggedIn ? "Log Out" : "Log In to Save Progress"}
              </HoverBorderGradient>
            </div>
          </>
        )}
        
        {activeTab === 'achievements' && (
          <div className="animate-fade-in">
            <div className="mb-4 flex justify-between items-center">
              <h2 className="text-lg font-semibold">Your Achievements</h2>
              <span className="text-sm text-white/70">{achievements.filter(a => a.achieved).length}/{achievements.length} completed</span>
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
            
            <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-xl p-5 mt-4 shadow-lg">
              <h3 className="text-white font-medium mb-2">Coming Soon</h3>
              <p className="text-white/70 text-sm">Complete more quests to unlock additional achievements!</p>
              <HoverBorderGradient 
                containerClassName="mt-4"
                onClick={() => navigate("/quests")}
                className="flex items-center gap-2 py-1"
              >
                Explore Quests <FiArrowRight size={14} />
              </HoverBorderGradient>
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
            
            <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-xl p-5 mb-6 shadow-lg">
              <h2 className="text-lg font-semibold mb-4">Daily Activity (mins)</h2>
              <div className="flex items-end justify-between h-32">
                {dailyActivity.map((day, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <div 
                      className="w-6 rounded-t-sm transition-all duration-500 animate-fade-in hover:bg-white"
                      style={{ 
                        height: `${(day.value / 75) * 100}%`,
                        animationDelay: `${index * 0.1}s`,
                        background: `linear-gradient(to top, hsl(var(--primary)), hsl(var(--primary))/40%)`,
                      }}
                    ></div>
                    <div className="text-xs text-white/70 mt-2">{day.day}</div>
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
