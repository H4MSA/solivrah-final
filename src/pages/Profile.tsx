import React, { useState } from "react";
import { GlassCard } from "@/components/GlassCard";
import { Star, Trophy, CheckCircle, Calendar, Download, Share2, Settings, Bell, Activity, Lock, Info, LogOut, RefreshCw, Users } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { ProfileReset } from "@/components/ProfileReset";
import { ProfileAchievements } from "@/components/ProfileAchievements";
import { ProfileStats } from "@/components/ProfileStats";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

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

const CalendarModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const { streak } = useApp();
  const currentDate = new Date();
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-[#111111] border border-white/10 text-white rounded-2xl p-6 shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-xl">Activity Calendar</DialogTitle>
          <DialogDescription className="text-white/70">
            View your daily activity and streaks
          </DialogDescription>
        </DialogHeader>
        
        <div className="mt-4">
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
              <div key={i} className="text-center text-xs text-white/50">{day}</div>
            ))}
          </div>
          
          <div className="grid grid-cols-7 gap-1">
            {days.map((day) => {
              const isToday = day === currentDate.getDate();
              const isActive = day <= currentDate.getDate();
              
              return (
                <div 
                  key={day}
                  className={`
                    aspect-square flex items-center justify-center rounded-full text-sm
                    ${isToday ? 'bg-white text-black font-bold' : 
                      isActive ? 'bg-[#333333] text-white' : 'bg-[#222222]/50 text-white/30'}
                  `}
                >
                  {day}
                </div>
              );
            })}
          </div>
          
          <div className="mt-6 flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-white"></div>
              <span>Today</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#333333]"></div>
              <span>Active Day</span>
            </div>
            <div className="flex items-center gap-2">
              <Star size={12} className="text-yellow-400" />
              <span>{streak} Day Streak</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const ThemeModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const { selectedTheme, setSelectedTheme } = useApp();
  
  const themes = [
    { id: "Discipline", name: "Discipline", description: "Focus on building daily habits and routines" },
    { id: "Focus", name: "Focus", description: "Eliminate distractions and improve concentration" },
    { id: "Resilience", name: "Resilience", description: "Bounce back from setbacks and build mental toughness" },
    { id: "Wildcards", name: "Creative", description: "Think outside the box and spark creativity" }
  ];
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-[#111111] border border-white/10 text-white rounded-2xl p-6 shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-xl">Theme Preferences</DialogTitle>
          <DialogDescription className="text-white/70">
            Choose your focus area
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-3 mt-4">
          {themes.map((theme) => (
            <div 
              key={theme.id}
              className={`p-4 rounded-xl cursor-pointer transition-all duration-300 ${
                selectedTheme === theme.id 
                  ? 'bg-[#333333] border-2 border-white/20' 
                  : 'bg-[#222222]/50 border border-white/10 hover:bg-[#222222]'
              }`}
              onClick={() => {
                setSelectedTheme(theme.id);
                onClose();
              }}
            >
              <div className="flex items-center justify-between">
                <h3 className="font-medium">{theme.name}</h3>
                {selectedTheme === theme.id && (
                  <div className="w-4 h-4 rounded-full bg-white"></div>
                )}
              </div>
              <p className="text-sm text-white/70 mt-1">{theme.description}</p>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

const ExportModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const { toast } = useToast();
  const { xp, streak, user } = useApp();
  
  const handleExport = (format: 'pdf' | 'csv' | 'json') => {
    toast({
      title: "Export Initiated",
      description: `Your data is being exported as ${format.toUpperCase()}`,
    });
    
    setTimeout(() => {
      toast({
        title: "Export Complete",
        description: "Your data has been exported successfully",
      });
      onClose();
    }, 1500);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-[#111111] border border-white/10 text-white rounded-2xl p-6 shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-xl">Export Your Data</DialogTitle>
          <DialogDescription className="text-white/70">
            Download your progress and achievements
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-3 mt-4">
          <button 
            className="w-full p-4 rounded-xl bg-[#222222]/80 border border-white/10 text-left hover:bg-[#222222] transition-all"
            onClick={() => handleExport('pdf')}
          >
            <div className="font-medium">Progress Report (PDF)</div>
            <div className="text-sm text-white/70">Complete report with statistics and achievements</div>
          </button>
          
          <button 
            className="w-full p-4 rounded-xl bg-[#222222]/80 border border-white/10 text-left hover:bg-[#222222] transition-all"
            onClick={() => handleExport('csv')}
          >
            <div className="font-medium">Raw Data (CSV)</div>
            <div className="text-sm text-white/70">Spreadsheet format for your own analysis</div>
          </button>
          
          <button 
            className="w-full p-4 rounded-xl bg-[#222222]/80 border border-white/10 text-left hover:bg-[#222222] transition-all"
            onClick={() => handleExport('json')}
          >
            <div className="font-medium">Complete Backup (JSON)</div>
            <div className="text-sm text-white/70">Full data backup for safekeeping</div>
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const ShareModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const { toast } = useToast();
  
  const handleShare = (platform: string) => {
    toast({
      title: "Shared Successfully",
      description: `Your progress has been shared on ${platform}`,
    });
    onClose();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-[#111111] border border-white/10 text-white rounded-2xl p-6 shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-xl">Share Your Progress</DialogTitle>
          <DialogDescription className="text-white/70">
            Let others know about your journey
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-2 gap-3 mt-4">
          <button 
            className="p-4 rounded-xl bg-[#1877F2] text-white flex flex-col items-center justify-center gap-2 hover:opacity-90 transition-all"
            onClick={() => handleShare('Facebook')}
          >
            <span className="text-xl">f</span>
            <span>Facebook</span>
          </button>
          
          <button 
            className="p-4 rounded-xl bg-[#1DA1F2] text-white flex flex-col items-center justify-center gap-2 hover:opacity-90 transition-all"
            onClick={() => handleShare('Twitter')}
          >
            <span className="text-xl">𝕏</span>
            <span>Twitter</span>
          </button>
          
          <button 
            className="p-4 rounded-xl bg-[#0A66C2] text-white flex flex-col items-center justify-center gap-2 hover:opacity-90 transition-all"
            onClick={() => handleShare('LinkedIn')}
          >
            <span className="text-xl">in</span>
            <span>LinkedIn</span>
          </button>
          
          <button 
            className="p-4 rounded-xl bg-[#25D366] text-white flex flex-col items-center justify-center gap-2 hover:opacity-90 transition-all"
            onClick={() => handleShare('WhatsApp')}
          >
            <span className="text-xl">W</span>
            <span>WhatsApp</span>
          </button>
        </div>
        
        <div className="mt-3">
          <button 
            className="w-full p-4 rounded-xl border border-white/10 flex items-center justify-center gap-2 hover:bg-white/5 transition-all"
            onClick={() => {
              navigator.clipboard.writeText("https://app.solivrah.com/share/" + Math.random().toString(36).substring(2, 8));
              toast({
                title: "Link Copied",
                description: "Share link has been copied to clipboard",
              });
              onClose();
            }}
          >
            <span>Copy Link</span>
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const Profile = () => {
  const {
    streak,
    xp,
    user,
    isGuest,
    signOut,
    selectedTheme
  } = useApp();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [themeOpen, setThemeOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  
  const level = Math.floor(xp / 1000) + 1;
  const progress = xp % 1000 / 1000 * 100;
  const displayName = user?.user_metadata?.username || user?.email?.split('@')[0] || (isGuest ? "Guest User" : "User");
  const completedQuests = 0; // This would come from your state

  const handleLogout = async () => {
    await signOut();
    navigate('/auth');
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out",
    });
  };
  
  const toggleNotifications = () => {
    toast({
      title: "Notifications Updated",
      description: "Your notification preferences have been updated",
    });
  };
  
  const openActivityLog = () => {
    toast({
      title: "Activity Log",
      description: "Your activity history will be displayed here",
    });
  };
  
  const openPrivacySettings = () => {
    toast({
      title: "Privacy Settings",
      description: "Privacy and security settings will be displayed here",
    });
  };
  
  const openAboutPage = () => {
    toast({
      title: "About Solivrah",
      description: "Information about Solivrah and its mission",
    });
  };

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
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#333333] border border-black flex items-center justify-center text-xs shadow-lg cursor-pointer hover:bg-[#444444] transition-all"
                onClick={() => setThemeOpen(true)}>
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
                <ActionButton icon={<Calendar size={20} />} label="Calendar" onClick={() => setCalendarOpen(true)} />
                <ActionButton icon={<Download size={20} />} label="Export" onClick={() => setExportOpen(true)} />
                <ActionButton icon={<Share2 size={20} />} label="Share" onClick={() => setShareOpen(true)} />
              </div>
            </ProfileSection>
            
            <ProfileSection title="Settings">
              <div className="space-y-2">
                <SettingsItem 
                  icon={<Settings size={18} />} 
                  label="Theme Preferences" 
                  value={selectedTheme} 
                  onClick={() => setThemeOpen(true)} 
                />
                
                <SettingsItem 
                  icon={<Bell size={18} />} 
                  label="Notifications" 
                  value="On" 
                  onClick={toggleNotifications} 
                />
                
                <SettingsItem 
                  icon={<Activity size={18} />} 
                  label="Activity Log" 
                  onClick={openActivityLog} 
                />
                
                <SettingsItem 
                  icon={<Lock size={18} />} 
                  label="Privacy & Security" 
                  onClick={openPrivacySettings} 
                />
                
                <SettingsItem 
                  icon={<Info size={18} />} 
                  label="About Solivrah" 
                  onClick={openAboutPage} 
                />
                
                <button 
                  className="w-full py-3 rounded-xl bg-[#1A1A1A]/80 border border-white/10 text-white flex items-center justify-center gap-2 hover:bg-[#222222]/80 active:scale-[0.98] transition-all duration-300 mt-5"
                  onClick={handleLogout}
                >
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
      
      <CalendarModal isOpen={calendarOpen} onClose={() => setCalendarOpen(false)} />
      <ThemeModal isOpen={themeOpen} onClose={() => setThemeOpen(false)} />
      <ExportModal isOpen={exportOpen} onClose={() => setExportOpen(false)} />
      <ShareModal isOpen={shareOpen} onClose={() => setShareOpen(false)} />
    </div>;
};

export default Profile;
