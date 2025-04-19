import React, { useState } from "react";
import { TabNavigation } from "@/components/TabNavigation";
import { GlassCard } from "@/components/GlassCard";
import { Star, Trophy, CheckCircle, Calendar, Download, Share2, Settings, Bell, Activity, Lock, Info, LogOut, RefreshCw, Users } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { ProfileReset } from "@/components/ProfileReset";
import { ProfileAchievements } from "@/components/ProfileAchievements";
import { ProfileStats } from "@/components/ProfileStats";
const ProfileSection = ({
  title,
  children
}: {
  title: string;
  children: React.ReactNode;
}) => <div className="mb-6">
    <h2 className="text-lg font-semibold mb-3">{title}</h2>
    {children}
  </div>;
const StatCard = ({
  icon,
  value,
  label
}: {
  icon: React.ReactNode;
  value: number;
  label: string;
}) => <div className="flex-1 bg-[#1A1A1A]/80 backdrop-blur-xl border border-white/10 rounded-xl p-3 flex flex-col items-center justify-center gap-1 transition-all hover:bg-[#222222]/80 hover:border-white/15 transform-gpu" style={{
  transform: 'translateZ(5px)'
}}>
    <div className="text-2xl text-white mb-1">{icon}</div>
    <div className="text-2xl font-semibold">{value}</div>
    <div className="text-xs text-white/70">{label}</div>
  </div>;
const Badge = ({
  icon,
  label,
  isEarned = true
}: {
  icon: React.ReactNode;
  label: string;
  isEarned?: boolean;
}) => <div className={`flex flex-col items-center gap-1 ${!isEarned ? 'opacity-40' : ''}`}>
    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isEarned ? 'bg-[#222222] border border-white/15' : 'bg-[#1A1A1A] border border-white/5'}`}>
      {icon}
    </div>
    <span className="text-xs font-medium">{label}</span>
  </div>;
const ActionButton = ({
  icon,
  label,
  onClick
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) => <button className="flex-1 bg-[#1A1A1A]/70 backdrop-blur-xl border border-white/10 rounded-xl p-3 flex flex-col items-center justify-center gap-1 hover:bg-[#222222]/80 hover:border-white/15 active:scale-[0.98] transition-all transform-gpu touch-manipulation" onClick={onClick} style={{
  transform: 'translateZ(4px)'
}}>
    <div className="text-xl text-white">{icon}</div>
    <span className="text-xs font-medium">{label}</span>
  </button>;
const SettingsItem = ({
  icon,
  label,
  value,
  onClick
}: {
  icon: React.ReactNode;
  label: string;
  value?: string;
  onClick: () => void;
}) => <div className="py-3 px-4 rounded-xl bg-[#1A1A1A]/70 backdrop-blur-xl border border-white/10 flex items-center justify-between hover:bg-[#222222]/80 hover:border-white/15 active:scale-[0.98] transition-all cursor-pointer transform-gpu mb-2 touch-manipulation" onClick={onClick} style={{
  transform: 'translateZ(4px)'
}}>
    <div className="flex items-center gap-3">
      <div className="text-white">{icon}</div>
      <span className="font-medium">{label}</span>
    </div>
    {value && <div className="text-sm text-white/70">{value}</div>}
  </div>;
const TabButton = ({
  label,
  active,
  onClick
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) => <button className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${active ? 'bg-[#222222] text-white' : 'bg-transparent text-white/60 hover:text-white/80'}`} onClick={onClick}>
    {label}
  </button>;
const Profile = () => {
  const {
    streak,
    xp,
    user,
    isGuest
  } = useApp();
  const [activeTab, setActiveTab] = useState('overview');
  const level = Math.floor(xp / 1000) + 1;
  const progress = xp % 1000 / 1000 * 100;
  const displayName = user?.name || (isGuest ? "Guest User" : "User");
  const completedQuests = 0; // This would come from your state

  return <div className="min-h-screen pb-24 text-white">
      <div className="p-4 space-y-5 animate-fade-in">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-semibold">{displayName}</h1>
            <div className="flex items-center gap-2 text-white/70 text-sm">
              <Star size={14} />
              <span>{streak} day streak • Level {level}</span>
            </div>
          </div>
          
          <div className="relative">
            <div className="w-12 h-12 rounded-full bg-[#222222] border-2 border-white/10 flex items-center justify-center text-xl">
              {displayName.charAt(0)}
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#333333] border border-black flex items-center justify-center text-xs shadow-lg">
              <Settings size={14} />
            </div>
          </div>
        </div>
        
        <div className="flex gap-2 border-b border-white/10 pb-2">
          <TabButton label="Overview" active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} />
          <TabButton label="Achievements" active={activeTab === 'achievements'} onClick={() => setActiveTab('achievements')} />
          <TabButton label="Stats" active={activeTab === 'stats'} onClick={() => setActiveTab('stats')} />
        </div>
        
        {activeTab === 'overview' && <>
            <div className="flex gap-3">
              <StatCard icon={<Star />} value={streak} label="Day Streak" />
              <StatCard icon={<Trophy />} value={xp} label="Total XP" />
              <StatCard icon={<CheckCircle />} value={completedQuests} label="Completed" />
            </div>
            
            <ProfileSection title="Level Progress">
              <GlassCard variant="subtle" className="relative p-4">
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-white/70">Level {level}</span>
                  <button className="p-1 bg-[#1A1A1A] rounded-full border border-white/10 hover:bg-[#222222] active:scale-95 transition-all">
                    <RefreshCw size={14} />
                  </button>
                </div>
                
                <div className="h-2.5 bg-[#111111] rounded-full overflow-hidden mb-2 border border-white/5">
                  <div className="h-full bg-gradient-to-r from-white/80 to-white/70" style={{
                width: `${progress}%`,
                transition: 'width 1s ease-in-out'
              }}></div>
                </div>
                
                <div className="text-xs text-white/70 text-right">
                  {1000 - xp % 1000} XP to Level {level + 1}
                </div>
              </GlassCard>
            </ProfileSection>
            
            <ProfileSection title="Badges">
              <div className="flex justify-between mb-3">
                <div className="grid grid-cols-4 gap-3">
                  <Badge icon={<Trophy size={20} />} label="Early Adopter" />
                  <Badge icon={<Star size={20} />} label="7-Day Streak" isEarned={false} />
                  <Badge icon={<CheckCircle size={20} />} label="First Quest" isEarned={false} />
                  <Badge icon={<Users size={20} />} label="Social" isEarned={false} />
                </div>
              </div>
              
              <div className="flex gap-3 py-[21px]">
                <ActionButton icon={<Calendar size={20} />} label="Calendar" onClick={() => {}} />
                <ActionButton icon={<Download size={20} />} label="Export" onClick={() => {}} />
                <ActionButton icon={<Share2 size={20} />} label="Share" onClick={() => {}} />
              </div>
            </ProfileSection>
            
            <ProfileSection title="Settings">
              <div className="space-y-2">
                <SettingsItem icon={<Settings size={18} />} label="Theme Preferences" value="Focus" onClick={() => {}} />
                
                <SettingsItem icon={<Bell size={18} />} label="Notifications" value="On" onClick={() => {}} />
                
                <SettingsItem icon={<Activity size={18} />} label="Activity Log" onClick={() => {}} />
                
                <SettingsItem icon={<Lock size={18} />} label="Privacy & Security" onClick={() => {}} />
                
                <SettingsItem icon={<Info size={18} />} label="About Solivrah" onClick={() => {}} />
                
                <button className="w-full py-3 rounded-xl bg-[#1A1A1A]/80 border border-white/10 text-white flex items-center justify-center gap-2 hover:bg-[#222222]/80 active:scale-[0.98] transition-all duration-300 mt-5">
                  <LogOut size={18} />
                  <span>Log Out</span>
                </button>
                
                <ProfileReset />
              </div>
            </ProfileSection>
          </>}
        
        {activeTab === 'achievements' && <ProfileAchievements />}
        
        {activeTab === 'stats' && <ProfileStats />}
      </div>
      
      <TabNavigation />
    </div>;
};
export default Profile;