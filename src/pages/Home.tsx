
import React, { useState, useEffect } from "react";
import { GlassCard } from "@/components/GlassCard";
import { TabNavigation } from "@/components/TabNavigation";
import { FiArrowRight, FiStar, FiZap, FiUser, FiCamera, FiMessageCircle, FiUsers } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { QRScanner } from "@/components/QRScanner";
import { useApp } from "@/context/AppContext";
import { DailyAffirmation } from "@/components/DailyAffirmation";

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
  
  return (
    <div className="min-h-screen pb-20 bg-gradient-to-b from-background to-background-end">
      {showScanner && (
        <QRScanner 
          onClose={() => setShowScanner(false)} 
          onScan={handleScan} 
        />
      )}
      
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-medium">{greeting}, Alexa</h1>
          <div className="flex items-center gap-2">
            <button 
              className="w-10 h-10 rounded-full bg-secondary/30 flex items-center justify-center"
              onClick={() => setShowScanner(true)}
            >
              <FiCamera className="text-white" />
            </button>
            <div 
              className="w-10 h-10 rounded-full bg-secondary/30 flex items-center justify-center cursor-pointer"
              onClick={() => navigate("/profile")}
            >
              <FiUser className="text-white" />
            </div>
          </div>
        </div>
        
        <DailyAffirmation />
        
        <GlassCard className="space-y-4">
          <h2 className="text-lg font-medium">Today's Quest</h2>
          <p className="text-muted text-sm">Track your time for 24 hours</p>
          
          <div className="flex items-center gap-3 text-sm text-muted">
            <div className="flex items-center gap-1">
              <FiStar className="text-primary" /> Streak: {streak}
            </div>
            <div className="flex items-center gap-1">
              <FiZap className="text-primary" /> XP: {xp}
            </div>
          </div>
          
          {/* Progress bar */}
          <div className="w-full bg-secondary/30 h-2 rounded-full overflow-hidden">
            <div 
              className="bg-primary h-full rounded-full" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="text-xs text-muted">Level {level} • {Math.floor(progress)}% to Level {level + 1}</div>
          
          <button className="btn-primary w-full flex items-center justify-center gap-2">
            Start Quest <FiArrowRight />
          </button>
        </GlassCard>
        
        <div className="space-y-4">
          <h2 className="text-lg font-medium">Quick Actions</h2>
          
          <div className="grid grid-cols-3 gap-3">
            <div 
              className="glass p-4 rounded-xl cursor-pointer hover:opacity-90 active:scale-95 transition-all flex flex-col items-center justify-center"
              onClick={() => navigate("/coach")}
            >
              <FiMessageCircle className="text-white text-xl mb-2" />
              <h3 className="font-medium text-sm text-center">AI Coach</h3>
            </div>
            
            <div 
              className="glass p-4 rounded-xl cursor-pointer hover:opacity-90 active:scale-95 transition-all flex flex-col items-center justify-center"
              onClick={() => navigate("/community")}
            >
              <FiUsers className="text-white text-xl mb-2" />
              <h3 className="font-medium text-sm text-center">Community</h3>
            </div>
            
            <div 
              className="glass p-4 rounded-xl cursor-pointer hover:opacity-90 active:scale-95 transition-all flex flex-col items-center justify-center"
              onClick={() => setShowScanner(true)}
            >
              <FiCamera className="text-white text-xl mb-2" />
              <h3 className="font-medium text-sm text-center">Scan QR</h3>
            </div>
          </div>
        </div>
        
        <GlassCard>
          <h2 className="text-lg font-medium mb-4">Continue Your Journey</h2>
          
          <div className="space-y-3">
            <div 
              className="glass p-4 rounded-xl cursor-pointer hover:opacity-90 active:scale-95 transition-all"
              onClick={() => navigate("/quests")}
            >
              <h3 className="font-medium">View All Quests</h3>
              <p className="text-muted text-sm">See your 30-day roadmap</p>
            </div>
            
            <div 
              className="glass p-4 rounded-xl cursor-pointer hover:opacity-90 active:scale-95 transition-all"
              onClick={() => navigate("/survey")}
            >
              <h3 className="font-medium">Change Theme</h3>
              <p className="text-muted text-sm">Try a different roadmap</p>
            </div>
          </div>
        </GlassCard>
      </div>
      
      <TabNavigation />
    </div>
  );
};

export default Home;
