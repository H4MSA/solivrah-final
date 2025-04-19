import React, { useState, useEffect } from "react";
import { GlassCard } from "@/components/GlassCard";
import { ArrowRight, Star, Zap, User, Camera, MessageCircle, Users, Lock, Search, ChevronDown, ChevronUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { QRScanner } from "@/components/QRScanner";
import { CameraUpload } from "@/components/CameraUpload";
import { useApp } from "@/context/AppContext";
import { DailyAffirmation } from "@/components/DailyAffirmation";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";

const QuestCard = ({ title, description, locked = false, onClick }: { title: string, description: string, locked?: boolean, onClick: () => void }) => (
  <div 
    className={`relative overflow-hidden backdrop-blur-xl border rounded-xl p-4 transition-all duration-300 transform-gpu shadow-lg ${
      locked 
        ? 'bg-[#1A1A1A]/60 border-white/5 opacity-50 pointer-events-none' 
        : 'bg-[#1A1A1A]/80 border-white/10 cursor-pointer hover:border-white/15 hover:scale-[1.01] active:scale-[0.98]'
    }`}
    onClick={!locked ? onClick : undefined}
    style={{ transform: locked ? 'translateZ(2px)' : 'translateZ(5px)' }}
  >
    <div className="flex justify-between items-center mb-2">
      <h3 className="text-white font-medium text-base">{title}</h3>
      {locked ? (
        <span className="text-xs bg-black/60 backdrop-blur-sm px-2 py-1 rounded-full text-white flex items-center gap-1 border border-white/5">
          <Lock size={12} />
          <span>Locked</span>
        </span>
      ) : (
        <span className="text-xs bg-black/50 backdrop-blur-sm px-2 py-1 rounded-full text-white border border-white/10">Active</span>
      )}
    </div>
    <p className="text-[#E0E0E0] text-sm">{description}</p>
    {!locked && (
      <button 
        className="w-full mt-3 py-2.5 rounded-xl bg-white text-black font-medium flex items-center justify-center gap-2"
        onClick={onClick}
      >
        Start <ArrowRight size={16} />
      </button>
    )}
    
    {locked && (
      <div className="absolute inset-0 backdrop-blur-sm bg-black/40 flex items-center justify-center">
        <Lock className="text-white/30 text-4xl animate-pulse-slow" />
      </div>
    )}
  </div>
);

const MoodButton = ({ emoji, label, selected, onClick }: { emoji: string, label: string, selected?: boolean, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center p-3 rounded-xl transition-all duration-300 transform-gpu active:scale-95 ${
      selected 
        ? 'bg-[#222222]/90 backdrop-blur-xl border border-white/15 scale-105 shadow-lg' 
        : 'bg-[#1A1A1A]/70 backdrop-blur-xl border border-white/5 hover:border-white/10 hover:scale-[1.02]'
    }`}
    style={{ transform: selected ? 'translateZ(8px)' : 'translateZ(4px)' }}
  >
    <span className="text-2xl mb-1">{emoji}</span>
    <span className="text-xs font-medium text-white">{label}</span>
  </button>
);

const ActionCard = ({ icon, label, onClick }: { icon: React.ReactNode, label: string, onClick: () => void }) => {
  return (
    <div 
      className="flex flex-col items-center justify-center gap-2 p-3 bg-[#1A1A1A]/80 backdrop-blur-xl border border-white/10 rounded-xl hover:border-white/15 hover:bg-[#222222]/70 active:scale-[0.95] transition-all duration-300 cursor-pointer transform-gpu hover:scale-[1.02] shadow-lg"
      onClick={onClick}
      style={{ transform: 'translateZ(6px)' }}
    >
      <div className="text-xl text-white">{icon}</div>
      <span className="text-xs font-medium text-white">{label}</span>
    </div>
  );
};

const CollapsibleSection = ({ title, children, defaultOpen = true }: { title: string, children: React.ReactNode, defaultOpen?: boolean }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  return (
    <div className="space-y-3">
      <div 
        className="flex justify-between items-center cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h2 className="text-lg font-semibold">{title}</h2>
        <button className="p-1 rounded-full bg-[#1A1A1A]/70 border border-white/5 active:scale-95 transition-all">
          {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
      </div>
      
      <div className={`space-y-3 transition-all duration-300 ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
        {children}
      </div>
    </div>
  );
};

const Home = () => {
  const navigate = useNavigate();
  const [showScanner, setShowScanner] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
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
  
  const handleCameraCapture = (file: File) => {
    console.log("Photo captured:", file);
    // Handle the captured photo
    setTimeout(() => {
      addXP(30);
      setShowCamera(false);
    }, 500);
  };
  
  const level = Math.floor(xp / 1000) + 1;
  const progress = ((xp % 1000) / 1000) * 100;
  
  const moods = [
    { emoji: "😊", label: "Happy" },
    { emoji: "😐", label: "Neutral" },
    { emoji: "😔", label: "Sad" }
  ];
  
  const displayName = user?.name || "Friend";
  
  return (
    <div className="min-h-screen pb-24 text-white">
      {showScanner && (
        <QRScanner 
          onClose={() => setShowScanner(false)} 
          onScan={handleScan} 
        />
      )}
      
      {showCamera && (
        <CameraUpload 
          onClose={() => setShowCamera(false)} 
          onCapture={handleCameraCapture}
          title="Capture a Moment"
        />
      )}
      
      <div className="p-4 space-y-4">
        <div className="flex justify-between items-center py-2 animate-fade-in">
          <div>
            <h1 className="text-xl text-white font-medium">
              {greeting}, <span className="font-semibold">{displayName}</span>
            </h1>
            <p className="text-sm text-[#E0E0E0]">Let's make progress today</p>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              className="w-10 h-10 rounded-full bg-[#1A1A1A]/70 backdrop-blur-xl border border-white/10 flex items-center justify-center transition-all duration-300 hover:bg-[#222222]/80 hover:border-white/15 active:scale-[0.95] shadow-lg transform-gpu hover:scale-105"
              onClick={() => setShowCamera(true)}
              style={{ transform: 'translateZ(10px)' }}
            >
              <Camera size={20} className="text-white" />
            </button>
            <button 
              className="w-10 h-10 rounded-full bg-[#1A1A1A]/70 backdrop-blur-xl border border-white/10 flex items-center justify-center transition-all duration-300 hover:bg-[#222222]/80 hover:border-white/15 active:scale-[0.95] shadow-lg transform-gpu hover:scale-105"
              onClick={() => navigate("/profile")}
              style={{ transform: 'translateZ(10px)' }}
            >
              <User size={20} className="text-white" />
            </button>
          </div>
        </div>
        
        <div className="animate-fade-in" style={{ animationDelay: "0.1s" }}>
          <div className="relative">
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/50">
              <Search size={18} />
            </div>
            <input 
              type="text" 
              placeholder="Search for quests or tasks..." 
              className="w-full h-11 bg-[#121212]/70 backdrop-blur-xl border border-white/10 rounded-full pl-11 pr-4 text-white placeholder:text-white/50 focus:outline-none focus:border-white/15 transition-all duration-300 shadow-inner transform-gpu"
              style={{ transform: 'translateZ(3px)' }}
            />
          </div>
        </div>
        
        <div className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
          <DailyAffirmation />
        </div>
        
        <CollapsibleSection title="Today's Quest" defaultOpen={true}>
          <QuestCard 
            title="Track your time for 24 hours" 
            description="Document how you spend your day to identify time-wasting activities and opportunities for improvement."
            onClick={() => navigate("/quests")}
          />
        </CollapsibleSection>
        
        <div 
          className="bg-[#1A1A1A]/80 backdrop-blur-xl border border-white/10 rounded-xl p-4 animate-fade-in shadow-lg transform-gpu"
          style={{ animationDelay: "0.4s", transform: 'translateZ(7px)' }}
        >
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-semibold">Progress</h2>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 bg-black/30 px-2 py-1 rounded-full border border-white/5">
                <Star size={14} className="text-white/70" />
                <span className="text-xs text-white/70">{streak} day streak</span>
              </div>
              <div className="flex items-center gap-1 bg-black/30 px-2 py-1 rounded-full border border-white/5">
                <Zap size={14} className="text-white/70" />
                <span className="text-xs text-white/70">{xp} XP</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-white/70">Level {level}</span>
              <span className="text-white/70">{Math.floor(progress)}%</span>
            </div>
            <div className="h-2.5 bg-[#111111] rounded-full overflow-hidden border border-white/5">
              <div 
                className="h-full bg-gradient-to-r from-white/80 to-white/70"
                style={{ width: `${progress}%`, transition: 'width 1s ease-in-out' }}
              ></div>
            </div>
            <div className="text-xs text-white/70 text-right">{1000 - (xp % 1000)} XP to Level {level + 1}</div>
          </div>
        </div>
        
        <CollapsibleSection title="How do you feel today?" defaultOpen={true}>
          <div className="flex justify-end mb-2">
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
        </CollapsibleSection>
        
        <CollapsibleSection title="Quick Actions" defaultOpen={true}>
          <div className="grid grid-cols-3 gap-3">
            <ActionCard 
              icon={<MessageCircle size={20} />} 
              label="AI Coach" 
              onClick={() => navigate("/coach")} 
            />
            <ActionCard 
              icon={<Users size={20} />} 
              label="Community" 
              onClick={() => navigate("/community")} 
            />
            <ActionCard 
              icon={<Camera size={20} />} 
              label="Scan QR" 
              onClick={() => setShowScanner(true)} 
            />
          </div>
        </CollapsibleSection>
        
        <CollapsibleSection title="Coming Up" defaultOpen={true}>
          <QuestCard 
            title="Day 2: Morning Routine" 
            description="Establish a productive morning routine to set the tone for your day."
            locked={true}
            onClick={() => {}}
          />
        </CollapsibleSection>
      </div>
    </div>
  );
};

export default Home;
