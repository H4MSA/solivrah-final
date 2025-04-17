
import React, { useState, useEffect } from "react";
import { GlassCard } from "@/components/GlassCard";
import { TabNavigation } from "@/components/TabNavigation";
import { FiArrowRight, FiStar, FiZap, FiUser, FiCamera, FiMessageCircle, FiUsers, FiChevronRight, FiSearch, FiLock } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { QRScanner } from "@/components/QRScanner";
import { useApp } from "@/context/AppContext";
import { DailyAffirmation } from "@/components/DailyAffirmation";
import { Progress } from "@/components/ui/progress";
import { ThemeBackground } from "@/components/ThemeBackground";
import { BackgroundBubbles } from "@/components/BackgroundBubbles";

const QuestCard = ({ title, description, locked = false, onClick }: { title: string, description: string, locked?: boolean, onClick: () => void }) => {
  const { themeColors } = useApp();
  
  return (
    <div 
      className={`relative overflow-hidden backdrop-blur-sm border rounded-xl p-5 transition-all duration-300 ${
        locked 
          ? 'pointer-events-none opacity-40 filter grayscale blur-[2px]' 
          : 'cursor-pointer hover:border-[#444444] hover:scale-[1.01] active:scale-[0.98]'
      }`}
      style={{
        backgroundColor: locked ? 'rgba(18, 18, 18, 0.7)' : themeColors.card,
        borderColor: locked ? 'rgba(51, 51, 51, 0.5)' : themeColors.cardBorder
      }}
      onClick={!locked ? onClick : undefined}
    >
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-white font-medium">{title}</h3>
        {locked ? (
          <span className="text-xs bg-[#333333] px-2 py-1 rounded-full text-white flex items-center gap-1">
            <FiLock size={12} />
            <span>Locked</span>
          </span>
        ) : (
          <span className="text-xs bg-[#222222] px-2 py-1 rounded-full text-white">Active</span>
        )}
      </div>
      <p className="text-[#AAAAAA] text-sm">{description}</p>
      {!locked && (
        <button 
          className="mt-4 w-full py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 text-white border border-white/10"
          style={{ backgroundColor: `rgba(${parseInt(themeColors.gradientStart.slice(1, 3), 16)}, ${parseInt(themeColors.gradientStart.slice(3, 5), 16)}, ${parseInt(themeColors.gradientStart.slice(5, 7), 16)}, 0.3)` }}
        >
          Start <FiArrowRight size={14} />
        </button>
      )}
      
      {locked && (
        <div className="absolute inset-0 backdrop-blur-[4px] bg-black/50 flex items-center justify-center">
          <FiLock className="text-white/30 text-4xl animate-pulse-slow" />
        </div>
      )}
    </div>
  );
};

const MoodButton = ({ emoji, label, selected, onClick }: { emoji: string, label: string, selected?: boolean, onClick: () => void }) => {
  const { themeColors } = useApp();
  
  return (
    <button 
      onClick={onClick}
      className={`flex flex-col items-center p-4 rounded-xl transition-all duration-300 transform backdrop-blur-sm border ${
        selected 
          ? 'scale-105 border-white/20' 
          : 'border-white/10 hover:border-white/20 hover:scale-[1.02]'
      }`}
      style={{
        backgroundColor: selected ? `rgba(${parseInt(themeColors.gradientStart.slice(1, 3), 16)}, ${parseInt(themeColors.gradientStart.slice(3, 5), 16)}, ${parseInt(themeColors.gradientStart.slice(5, 7), 16)}, 0.2)` : themeColors.card
      }}
    >
      <span className="text-3xl mb-2">{emoji}</span>
      <span className="text-sm font-medium text-white">{label}</span>
    </button>
  );
};

const ActionCard = ({ icon, label, onClick }: { icon: React.ReactNode, label: string, onClick: () => void }) => {
  const { themeColors } = useApp();
  
  return (
    <div 
      className="flex flex-col items-center justify-center gap-3 p-4 rounded-xl border border-white/10 hover:border-white/20 active:scale-[0.98] transition-all duration-300 cursor-pointer transform hover:scale-[1.02] backdrop-blur-sm"
      style={{ backgroundColor: themeColors.card }}
      onClick={onClick}
    >
      <div className="text-2xl text-white">{icon}</div>
      <span className="text-sm font-medium text-white">{label}</span>
    </div>
  );
};

const Home = () => {
  const navigate = useNavigate();
  const [showScanner, setShowScanner] = useState(false);
  const { streak, xp, selectedTheme, themeColors, addXP, user } = useApp();
  const [greeting, setGreeting] = useState("Good morning");
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 12 && hour < 17) {
      setGreeting("Good afternoon");
    } else if (hour >= 17) {
      setGreeting("Good evening");
    }
  }, []);
  
  const handleScan = (code: string) => {
    console.log("QR code scanned:", code);
    setShowScanner(false);
    addXP(50);
  };
  
  const level = Math.floor(xp / 1000) + 1;
  const progress = ((xp % 1000) / 1000) * 100;
  
  const moods = [
    { emoji: "😊", label: "Happy" },
    { emoji: "😐", label: "Neutral" },
    { emoji: "😔", label: "Sad" }
  ];
  
  // Get name from user or use "Friend"
  const displayName = user?.name || "Friend";
  
  return (
    <div className="min-h-screen pb-24 text-white">
      <ThemeBackground />
      <BackgroundBubbles />
      
      {showScanner && (
        <QRScanner 
          onClose={() => setShowScanner(false)} 
          onScan={handleScan} 
        />
      )}
      
      <div className="p-4 space-y-6">
        <div className="flex justify-between items-center py-2 animate-fade-in">
          <div>
            <h1 className="text-xl text-white font-medium">
              {greeting}, <span className="font-semibold">{displayName}</span>
            </h1>
            <p className="text-sm text-[#AAAAAA]">Let's make progress today</p>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              className="w-10 h-10 rounded-full backdrop-blur-sm border border-white/10 flex items-center justify-center transition-all duration-300 hover:border-white/20 active:scale-[0.95]"
              style={{ backgroundColor: themeColors.card }}
              onClick={() => setShowScanner(true)}
            >
              <FiCamera className="text-white" />
            </button>
            <button 
              className="w-10 h-10 rounded-full backdrop-blur-sm border border-white/10 flex items-center justify-center transition-all duration-300 hover:border-white/20 active:scale-[0.95]"
              style={{ backgroundColor: themeColors.card }}
              onClick={() => navigate("/profile")}
            >
              <FiUser className="text-white" />
            </button>
          </div>
        </div>
        
        <div className="animate-fade-in" style={{ animationDelay: "0.1s" }}>
          <div className="relative">
            <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#888888]" />
            <input 
              type="text" 
              placeholder="Search for quests or tasks..." 
              className="w-full h-12 backdrop-blur-sm border border-white/10 rounded-xl pl-11 pr-4 text-white placeholder:text-[#888888] focus:outline-none focus:border-white/20 transition-all duration-300"
              style={{ backgroundColor: 'rgba(18, 18, 18, 0.5)' }}
            />
          </div>
        </div>
        
        <div className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
          <DailyAffirmation />
        </div>
        
        <div className="animate-fade-in" style={{ animationDelay: "0.3s" }}>
          <h2 className="text-xl font-semibold mb-3">Today's Quest</h2>
          <QuestCard 
            title="Track your time for 24 hours" 
            description="Document how you spend your day to identify time-wasting activities and opportunities for improvement."
            onClick={() => navigate("/quests")}
          />
        </div>
        
        <div className="backdrop-blur-sm border rounded-xl p-5 animate-fade-in"
          style={{ 
            backgroundColor: themeColors.card,
            borderColor: themeColors.cardBorder
          }}
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Progress</h2>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <FiStar className="text-[#CCCCCC]" size={14} />
                <span className="text-sm text-[#CCCCCC]">{streak} day streak</span>
              </div>
              <div className="flex items-center gap-1">
                <FiZap className="text-[#CCCCCC]" size={14} />
                <span className="text-sm text-[#CCCCCC]">{xp} XP</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-[#AAAAAA]">Level {level}</span>
              <span className="text-[#AAAAAA]">{Math.floor(progress)}%</span>
            </div>
            <Progress 
              value={progress} 
              className="h-2 bg-[#222222]" 
              indicatorClassName="bg-gradient-to-r"
              style={{
                '--tw-gradient-from': themeColors.gradientStart,
                '--tw-gradient-to': themeColors.gradientEnd,
              } as React.CSSProperties}
              levelIndicator
            />
            <div className="text-xs text-[#AAAAAA] text-right">{1000 - (xp % 1000)} XP to Level {level + 1}</div>
          </div>
        </div>
        
        <div className="animate-fade-in" style={{ animationDelay: "0.5s" }}>
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-xl font-semibold">How do you feel today?</h2>
            <span className="text-xs text-[#AAAAAA]">Daily check-in</span>
          </div>
          
          <div className="grid grid-cols-3 gap-3">
            {moods.map((mood) => (
              <MoodButton 
                key={mood.label} 
                emoji={mood.emoji} 
                label={mood.label} 
                selected={selectedMood === mood.label}
                onClick={() => setSelectedMood(mood.label)}
              />
            ))}
          </div>
        </div>
        
        <div className="animate-fade-in" style={{ animationDelay: "0.6s" }}>
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-xl font-semibold">Quick Actions</h2>
          </div>
          
          <div className="grid grid-cols-3 gap-3">
            <ActionCard 
              icon={<FiMessageCircle />} 
              label="AI Coach" 
              onClick={() => navigate("/coach")} 
            />
            <ActionCard 
              icon={<FiUsers />} 
              label="Community" 
              onClick={() => navigate("/community")} 
            />
            <ActionCard 
              icon={<FiCamera />} 
              label="Scan QR" 
              onClick={() => setShowScanner(true)} 
            />
          </div>
        </div>
        
        <div className="animate-fade-in" style={{ animationDelay: "0.7s" }}>
          <h2 className="text-xl font-semibold mb-3">Coming Up</h2>
          <QuestCard 
            title="Day 2: Morning Routine" 
            description="Establish a productive morning routine to set the tone for your day."
            locked={true}
            onClick={() => {}}
          />
        </div>
      </div>
      
      <TabNavigation />
    </div>
  );
};

export default Home;
