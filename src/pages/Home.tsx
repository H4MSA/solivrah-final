
import React, { useState, useEffect } from "react";
import { GlassCard } from "@/components/GlassCard";
import { TabNavigation } from "@/components/TabNavigation";
import { FiArrowRight, FiStar, FiZap, FiUser, FiCamera, FiMessageCircle, FiUsers, FiChevronRight } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { QRScanner } from "@/components/QRScanner";
import { useApp } from "@/context/AppContext";
import { DailyAffirmation } from "@/components/DailyAffirmation";
import { Progress } from "@/components/ui/progress";

const Home = () => {
  const navigate = useNavigate();
  const [showScanner, setShowScanner] = useState(false);
  const { streak, xp, selectedTheme, addXP } = useApp();
  const [greeting, setGreeting] = useState("Good morning");
  
  useEffect(() => {
    // Set appropriate greeting based on time of day
    const hour = new Date().getHours();
    if (hour >= 12 && hour < 17) {
      setGreeting("Good afternoon");
    } else if (hour >= 17) {
      setGreeting("Good evening");
    }
  }, []);
  
  const handleScan = (code: string) => {
    console.log("QR code scanned:", code);
    // In a real app, this would validate the code against the backend
    setShowScanner(false);
    
    // Give some XP for scanning a code
    addXP(50);
  };
  
  // Calculate level based on XP (1000 XP per level)
  const level = Math.floor(xp / 1000) + 1;
  
  // Calculate progress to next level (percentage)
  const progress = ((xp % 1000) / 1000) * 100;
  
  const moods = [
    { emoji: "😊", label: "Happy" },
    { emoji: "😐", label: "Neutral" },
    { emoji: "😔", label: "Sad" }
  ];
  
  return (
    <div className="min-h-screen pb-20 bg-gradient-to-b from-background to-background-end">
      {showScanner && (
        <QRScanner 
          onClose={() => setShowScanner(false)} 
          onScan={handleScan} 
        />
      )}
      
      {/* Background effect */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-40 right-10 w-40 h-40 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-40 left-10 w-40 h-40 bg-white/5 rounded-full blur-3xl"></div>
      </div>
      
      <div className="p-6 space-y-6 relative z-10">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-medium">{greeting}, Alexa</h1>
          <div className="flex items-center gap-2">
            <button 
              className="w-10 h-10 rounded-full glass flex items-center justify-center"
              onClick={() => setShowScanner(true)}
            >
              <FiCamera className="text-white" />
            </button>
            <div 
              className="w-10 h-10 rounded-full glass flex items-center justify-center cursor-pointer"
              onClick={() => navigate("/profile")}
            >
              <FiUser className="text-white" />
            </div>
          </div>
        </div>
        
        <DailyAffirmation />
        
        <GlassCard className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-medium">Today's Quest</h2>
            <span className="badge">Day 1</span>
          </div>
          <p className="text-muted text-sm">Track your time for 24 hours</p>
          
          <div className="flex flex-wrap items-center gap-3 text-sm text-muted">
            <div className="flex items-center gap-1 bg-secondary/30 px-3 py-1 rounded-full">
              <FiStar className="text-primary" /> {streak} day streak
            </div>
            <div className="flex items-center gap-1 bg-secondary/30 px-3 py-1 rounded-full">
              <FiZap className="text-primary" /> {xp} XP
            </div>
          </div>
          
          {/* Progress bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-muted">Level {level}</span>
              <span className="text-muted">{Math.floor(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2 bg-secondary/30" />
            <div className="text-xs text-muted text-right">{1000 - (xp % 1000)} XP to Level {level + 1}</div>
          </div>
          
          <button className="btn-primary w-full flex items-center justify-center gap-2">
            Start Quest <FiArrowRight />
          </button>
        </GlassCard>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-medium">How do you feel today?</h2>
            <span className="text-xs text-muted">Daily check-in</span>
          </div>
          
          <div className="grid grid-cols-3 gap-3">
            {moods.map((mood) => (
              <button key={mood.label} className="card-action py-5">
                <span className="text-3xl">{mood.emoji}</span>
                <span className="text-sm">{mood.label}</span>
              </button>
            ))}
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-medium">Quick Actions</h2>
            <button className="text-primary text-sm flex items-center">
              View all <FiChevronRight className="ml-1" />
            </button>
          </div>
          
          <div className="grid grid-cols-3 gap-3">
            <div 
              className="card-action"
              onClick={() => navigate("/coach")}
            >
              <FiMessageCircle className="text-white text-xl mb-2" />
              <h3 className="font-medium text-sm text-center">AI Coach</h3>
            </div>
            
            <div 
              className="card-action"
              onClick={() => navigate("/community")}
            >
              <FiUsers className="text-white text-xl mb-2" />
              <h3 className="font-medium text-sm text-center">Community</h3>
            </div>
            
            <div 
              className="card-action"
              onClick={() => setShowScanner(true)}
            >
              <FiCamera className="text-white text-xl mb-2" />
              <h3 className="font-medium text-sm text-center">Scan QR</h3>
            </div>
          </div>
        </div>
        
        <GlassCard variant="subtle">
          <h2 className="text-lg font-medium mb-4">Continue Your Journey</h2>
          
          <div className="space-y-3">
            <div 
              className="glass p-4 rounded-xl cursor-pointer hover:opacity-90 active:scale-95 transition-all flex justify-between items-center"
              onClick={() => navigate("/quests")}
            >
              <div>
                <h3 className="font-medium">View All Quests</h3>
                <p className="text-muted text-sm">See your 30-day roadmap</p>
              </div>
              <FiChevronRight className="text-muted" />
            </div>
            
            <div 
              className="glass p-4 rounded-xl cursor-pointer hover:opacity-90 active:scale-95 transition-all flex justify-between items-center"
              onClick={() => navigate("/survey")}
            >
              <div>
                <h3 className="font-medium">Change Theme</h3>
                <p className="text-muted text-sm">Try a different roadmap</p>
              </div>
              <FiChevronRight className="text-muted" />
            </div>
          </div>
        </GlassCard>
      </div>
      
      <TabNavigation />
    </div>
  );
};

export default Home;
