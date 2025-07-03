
import React, { useState, useEffect } from "react";
import { GlassCard } from "@/components/GlassCard";
import { TabNavigation } from "@/components/TabNavigation";
import { FiArrowRight, FiStar, FiZap, FiUser, FiCamera, FiMessageCircle, FiUsers, FiChevronRight, FiSearch, FiLock } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { QRScanner } from "@/components/QRScanner";
import { useApp } from "@/context/AppContext";
import { DailyAffirmation } from "@/components/DailyAffirmation";
import { Progress } from "@/components/ui/progress";
import { SearchBar } from "@/components/home/SearchBar";
import { QuestCard } from "@/components/home/QuestCard";
import { MoodButton } from "@/components/home/MoodButton";
import { ActionCard } from "@/components/home/ActionCard";
import { ProgressCard } from "@/components/home/ProgressCard";
import { CollapsibleSection } from "@/components/home/CollapsibleSection";
import { QuickActionSection } from "@/components/home/QuickActionSection";

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
  
  // Get user's display name from user metadata or fallback to "Friend"
  const displayName = user?.user_metadata?.username || user?.email?.split('@')[0] || "Friend";
  
  return (
    <div className="min-h-screen pb-28 bg-black text-white">
      {showScanner && (
        <QRScanner 
          onClose={() => setShowScanner(false)} 
          onScan={handleScan} 
        />
      )}
      
      <div className="p-5 space-y-6">
        <div className="flex justify-between items-center py-2 animate-fade-in">
          <div>
            <h1 className="text-2xl text-white font-semibold">
              {greeting}, <span className="font-bold">{displayName}</span>
            </h1>
            <p className="text-base text-white/70">Let's make progress today</p>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-xl border border-white/10 flex items-center justify-center transition-all duration-300 hover:bg-white/15 active:scale-[0.95] shadow-lg"
              onClick={() => setShowScanner(true)}
            >
              <FiCamera className="text-white w-5 h-5" />
            </button>
            <button 
              className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-xl border border-white/10 flex items-center justify-center transition-all duration-300 hover:bg-white/15 active:scale-[0.95] shadow-lg"
              onClick={() => navigate("/profile")}
            >
              <FiUser className="text-white w-5 h-5" />
            </button>
          </div>
        </div>
        
        <div className="animate-fade-in" style={{ animationDelay: "0.1s" }}>
          <SearchBar />
        </div>
        
        <div className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
          <DailyAffirmation />
        </div>
        
        <div className="animate-fade-in" style={{ animationDelay: "0.3s" }}>
          <CollapsibleSection title="Today's Quest">
            <QuestCard 
              title="Track your time for 24 hours" 
              description="Document how you spend your day to identify time-wasting activities and opportunities for improvement."
              onClick={() => navigate("/quests")}
            />
          </CollapsibleSection>
        </div>
        
        <div className="animate-fade-in" style={{ animationDelay: "0.4s" }}>
          <ProgressCard 
            streak={streak}
            xp={xp}
            level={level}
            progress={progress}
          />
        </div>
        
        <div className="animate-fade-in" style={{ animationDelay: "0.5s" }}>
          <CollapsibleSection title="How do you feel today?">
            <div className="grid grid-cols-3 gap-4">
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
        </div>
        
        <div className="animate-fade-in" style={{ animationDelay: "0.6s" }}>
          <QuickActionSection onScannerClick={() => setShowScanner(true)} />
        </div>
        
        <div className="animate-fade-in" style={{ animationDelay: "0.7s" }}>
          <CollapsibleSection title="Coming Up">
            <QuestCard 
              title="Day 2: Morning Routine" 
              description="Establish a productive morning routine to set the tone for your day."
              locked={true}
              onClick={() => {}}
            />
          </CollapsibleSection>
        </div>
      </div>
      
      <TabNavigation />
    </div>
  );
};

export default Home;
