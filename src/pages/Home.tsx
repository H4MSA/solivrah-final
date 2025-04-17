
import React, { useState, useEffect } from "react";
import { GlassCard } from "@/components/GlassCard";
import { TabNavigation } from "@/components/TabNavigation";
import { FiArrowRight, FiStar, FiZap, FiUser, FiCamera, FiMessageCircle, FiUsers, FiChevronRight, FiSearch, FiLock } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { QRScanner } from "@/components/QRScanner";
import { useApp } from "@/context/AppContext";
import { DailyAffirmation } from "@/components/DailyAffirmation";
import { Progress } from "@/components/ui/progress";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";

const QuestCard = ({ title, description, locked = false, onClick }: { title: string, description: string, locked?: boolean, onClick: () => void }) => {
  const { selectedTheme } = useApp();
  
  // Theme-specific glow colors
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
      className={`relative overflow-hidden backdrop-blur-xl bg-black/40 border border-white/10 rounded-xl p-5 transition-all duration-300 transform-gpu ${
        locked 
          ? 'opacity-40 filter blur-[1px] pointer-events-none' 
          : 'cursor-pointer hover:border-white/20 hover:scale-[1.01] active:scale-[0.98]'
      }`}
      onClick={!locked ? onClick : undefined}
      style={{ 
        boxShadow: `0 10px 25px ${getThemeGlow()}`,
        transform: locked ? 'none' : 'translateZ(2px)'
      }}
    >
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-white font-medium">{title}</h3>
        {locked ? (
          <span className="text-xs bg-black/60 backdrop-blur-sm px-2 py-1 rounded-full text-white flex items-center gap-1 border border-white/5">
            <FiLock size={12} />
            <span>Locked</span>
          </span>
        ) : (
          <span className="text-xs bg-black/50 backdrop-blur-sm px-2 py-1 rounded-full text-white border border-white/10">Active</span>
        )}
      </div>
      <p className="text-white/70 text-sm">{description}</p>
      {!locked && (
        <HoverBorderGradient
          containerClassName="w-full mt-4"
          className="py-1.5 w-full flex items-center justify-center gap-2"
          onClick={onClick}
        >
          Start <FiArrowRight size={14} />
        </HoverBorderGradient>
      )}
      
      {locked && (
        <div className="absolute inset-0 backdrop-blur-[2px] bg-black/40 flex items-center justify-center">
          <FiLock className="text-white/30 text-4xl animate-pulse-slow" />
        </div>
      )}
    </div>
  );
};

const MoodButton = ({ emoji, label, selected, onClick }: { emoji: string, label: string, selected?: boolean, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center p-3 rounded-xl transition-all duration-300 transform ${
      selected 
        ? 'bg-black/60 backdrop-blur-xl border border-white/20 scale-105 shadow-lg' 
        : 'bg-black/40 backdrop-blur-xl border border-white/10 hover:border-white/20 hover:scale-[1.02]'
    }`}
    style={{ transform: selected ? 'translateZ(4px)' : 'translateZ(2px)' }}
  >
    <span className="text-2xl mb-1">{emoji}</span>
    <span className="text-xs font-medium text-white">{label}</span>
  </button>
);

const ActionCard = ({ icon, label, onClick }: { icon: React.ReactNode, label: string, onClick: () => void }) => {
  const { selectedTheme } = useApp();
  
  // Theme-specific glow colors
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
      className="flex flex-col items-center justify-center gap-2 p-3 bg-black/40 backdrop-blur-xl border border-white/10 rounded-xl hover:border-white/20 hover:bg-black/50 active:scale-[0.98] transition-all duration-300 cursor-pointer transform hover:scale-[1.02] shadow-lg"
      onClick={onClick}
      style={{ 
        boxShadow: `0 8px 20px ${getThemeGlow()}`,
        transform: 'translateZ(3px)'
      }}
    >
      <div className="text-xl text-white">{icon}</div>
      <span className="text-xs font-medium text-white">{label}</span>
    </div>
  );
};

const Home = () => {
  const navigate = useNavigate();
  const [showScanner, setShowScanner] = useState(false);
  const { streak, xp, selectedTheme, addXP, user } = useApp();
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
  
  // Theme-specific progress bar color
  const getThemeColor = () => {
    switch (selectedTheme) {
      case "Discipline": return "bg-gradient-to-r from-[#FF0000] to-[#6B0000]";
      case "Focus": return "bg-gradient-to-r from-[#008080] to-[#000046]";
      case "Resilience": return "bg-gradient-to-r from-[#FFA500] to-[#8B4513]";
      case "Wildcards": return "bg-gradient-to-r from-[#00FF00] to-[#006400]";
      default: return "bg-white";
    }
  };
  
  return (
    <div className="min-h-screen pb-24 text-white perspective-1000">
      {showScanner && (
        <QRScanner 
          onClose={() => setShowScanner(false)} 
          onScan={handleScan} 
        />
      )}
      
      <div className="p-5 space-y-5">
        <div className="flex justify-between items-center py-2 animate-fade-in">
          <div>
            <h1 className="text-xl text-white font-medium">
              {greeting}, <span className="font-semibold">{displayName}</span>
            </h1>
            <p className="text-sm text-white/70">Let's make progress today</p>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-xl border border-white/10 flex items-center justify-center transition-all duration-300 hover:bg-black/60 hover:border-white/20 active:scale-[0.95] shadow-lg transform hover:scale-105"
              onClick={() => setShowScanner(true)}
              style={{ transform: 'translateZ(5px)' }}
            >
              <FiCamera className="text-white" />
            </button>
            <button 
              className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-xl border border-white/10 flex items-center justify-center transition-all duration-300 hover:bg-black/60 hover:border-white/20 active:scale-[0.95] shadow-lg transform hover:scale-105"
              onClick={() => navigate("/profile")}
              style={{ transform: 'translateZ(5px)' }}
            >
              <FiUser className="text-white" />
            </button>
          </div>
        </div>
        
        <div className="animate-fade-in" style={{ animationDelay: "0.1s" }}>
          <div className="relative">
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/50">
              <FiSearch />
            </div>
            <input 
              type="text" 
              placeholder="Search for quests or tasks..." 
              className="w-full h-12 bg-black/40 backdrop-blur-xl border border-white/10 rounded-full pl-11 pr-4 text-white placeholder:text-white/50 focus:outline-none focus:border-white/20 transition-all duration-300 shadow-inner"
              style={{ transform: 'translateZ(1px)' }}
            />
          </div>
        </div>
        
        <div className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
          <DailyAffirmation />
        </div>
        
        <div className="animate-fade-in" style={{ animationDelay: "0.3s" }}>
          <h2 className="text-lg font-semibold mb-3">Today's Quest</h2>
          <QuestCard 
            title="Track your time for 24 hours" 
            description="Document how you spend your day to identify time-wasting activities and opportunities for improvement."
            onClick={() => navigate("/quests")}
          />
        </div>
        
        <div 
          className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-xl p-4 animate-fade-in shadow-lg"
          style={{ animationDelay: "0.4s", transform: 'translateZ(3px)' }}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Progress</h2>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 bg-black/30 px-2.5 py-1 rounded-full border border-white/5">
                <FiStar className="text-white/70" size={14} />
                <span className="text-sm text-white/70">{streak} day streak</span>
              </div>
              <div className="flex items-center gap-1 bg-black/30 px-2.5 py-1 rounded-full border border-white/5">
                <FiZap className="text-white/70" size={14} />
                <span className="text-sm text-white/70">{xp} XP</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-white/70">Level {level}</span>
              <span className="text-white/70">{Math.floor(progress)}%</span>
            </div>
            <div className="h-2 bg-black/30 rounded-full overflow-hidden border border-white/5">
              <div 
                className={`h-full ${getThemeColor()}`}
                style={{ width: `${progress}%`, transition: 'width 1s ease-in-out' }}
              ></div>
            </div>
            <div className="text-xs text-white/70 text-right">{1000 - (xp % 1000)} XP to Level {level + 1}</div>
          </div>
        </div>
        
        <div className="animate-fade-in" style={{ animationDelay: "0.5s" }}>
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-semibold">How do you feel today?</h2>
            <span className="text-xs text-white/70 bg-black/30 px-2 py-1 rounded-full border border-white/5">Daily check-in</span>
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
            <h2 className="text-lg font-semibold">Quick Actions</h2>
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
          <h2 className="text-lg font-semibold mb-3">Coming Up</h2>
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
