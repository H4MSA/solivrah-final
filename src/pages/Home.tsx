
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
  const [bubbles, setBubbles] = useState<Array<{id: number, size: number, left: string, top: string, delay: number}>>([]);
  
  useEffect(() => {
    // Set appropriate greeting based on time of day
    const hour = new Date().getHours();
    if (hour >= 12 && hour < 17) {
      setGreeting("Good afternoon");
    } else if (hour >= 17) {
      setGreeting("Good evening");
    }
    
    // Create dynamic background bubbles
    const newBubbles = Array.from({ length: 5 }, (_, i) => ({
      id: i,
      size: Math.floor(Math.random() * 120) + 40,
      left: `${Math.floor(Math.random() * 100)}%`,
      top: `${Math.floor(Math.random() * 100)}%`,
      delay: Math.random() * 5
    }));
    setBubbles(newBubbles);
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
    <div className="min-h-screen pb-24 bg-gradient-to-b from-background to-background-end">
      {showScanner && (
        <QRScanner 
          onClose={() => setShowScanner(false)} 
          onScan={handleScan} 
        />
      )}
      
      {/* Background effects */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {bubbles.map(bubble => (
          <div 
            key={bubble.id} 
            className="bubble" 
            style={{ 
              width: `${bubble.size}px`, 
              height: `${bubble.size}px`, 
              left: bubble.left, 
              top: bubble.top,
              animationDelay: `${bubble.delay}s`,
              background: bubble.id % 2 === 0 ? 'rgba(197, 114, 255, 0.05)' : 'rgba(96, 150, 255, 0.05)'
            }}
          />
        ))}
        <div className="absolute top-40 right-0 w-[300px] h-[300px] bg-primary/10 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-40 left-0 w-[300px] h-[300px] bg-secondary/10 rounded-full blur-[100px]"></div>
      </div>
      
      <div className="p-6 space-y-6 relative z-10">
        <div className="flex justify-between items-center animate-fade-in">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
            {greeting}, Alexa
          </h1>
          <div className="flex items-center gap-3">
            <button 
              className="w-10 h-10 rounded-full glass flex items-center justify-center interactive shadow-lg"
              onClick={() => setShowScanner(true)}
            >
              <FiCamera className="text-white" />
            </button>
            <div 
              className="w-10 h-10 rounded-full glass flex items-center justify-center cursor-pointer interactive shadow-lg"
              onClick={() => navigate("/profile")}
            >
              <FiUser className="text-white" />
            </div>
          </div>
        </div>
        
        <DailyAffirmation />
        
        <GlassCard className="space-y-5" variant="primary" animate="pop">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-white">Today's Quest</h2>
            <span className="badge bg-primary/30 text-white font-medium px-3 py-1.5">Day 1</span>
          </div>
          <p className="text-muted-foreground text-sm">Track your time for 24 hours</p>
          
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <div className="flex items-center gap-1.5 bg-card/30 px-3 py-1.5 rounded-full shadow-sm">
              <FiStar className="text-primary" /> {streak} day streak
            </div>
            <div className="flex items-center gap-1.5 bg-card/30 px-3 py-1.5 rounded-full shadow-sm">
              <FiZap className="text-secondary" /> {xp} XP
            </div>
          </div>
          
          {/* Progress bar with animation */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Level {level}</span>
              <span className="text-muted-foreground">{Math.floor(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2.5 bg-card/30" 
                    indicatorClassName="bg-gradient-to-r from-primary to-secondary" />
            <div className="text-xs text-muted-foreground text-right">{1000 - (xp % 1000)} XP to Level {level + 1}</div>
          </div>
          
          <button className="btn-primary w-full flex items-center justify-center gap-2 py-3.5 mt-2 shadow-lg">
            Start Quest <FiArrowRight />
          </button>
        </GlassCard>
        
        <div className="space-y-4 animate-fade-in" style={{ animationDelay: "0.2s" }}>
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-white">How do you feel today?</h2>
            <span className="text-xs text-muted-foreground">Daily check-in</span>
          </div>
          
          <div className="grid grid-cols-3 gap-3">
            {moods.map((mood, index) => (
              <button key={mood.label} className="card-action py-5 animate-pop-in" style={{ animationDelay: `${0.1 + index * 0.1}s` }}>
                <span className="text-3xl">{mood.emoji}</span>
                <span className="text-sm font-medium mt-1">{mood.label}</span>
              </button>
            ))}
          </div>
        </div>
        
        <div className="space-y-4 animate-fade-in" style={{ animationDelay: "0.3s" }}>
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-white">Quick Actions</h2>
            <button className="text-primary text-sm flex items-center gap-1 interactive">
              View all <FiChevronRight />
            </button>
          </div>
          
          <div className="grid grid-cols-3 gap-3">
            <div 
              className="card-action animate-pop-in"
              style={{ animationDelay: "0.4s" }}
              onClick={() => navigate("/coach")}
            >
              <FiMessageCircle className="text-secondary text-2xl mb-2" />
              <h3 className="font-medium text-sm text-center">AI Coach</h3>
            </div>
            
            <div 
              className="card-action animate-pop-in"
              style={{ animationDelay: "0.5s" }}
              onClick={() => navigate("/community")}
            >
              <FiUsers className="text-accent text-2xl mb-2" />
              <h3 className="font-medium text-sm text-center">Community</h3>
            </div>
            
            <div 
              className="card-action animate-pop-in"
              style={{ animationDelay: "0.6s" }}
              onClick={() => setShowScanner(true)}
            >
              <FiCamera className="text-primary text-2xl mb-2" />
              <h3 className="font-medium text-sm text-center">Scan QR</h3>
            </div>
          </div>
        </div>
        
        <GlassCard variant="subtle" animate="fade" className="animate-fade-in" style={{ animationDelay: "0.7s" }}>
          <h2 className="text-xl font-bold text-white mb-4">Continue Your Journey</h2>
          
          <div className="space-y-3">
            <div 
              className="glass p-4 rounded-xl cursor-pointer hover:opacity-95 active:scale-95 transition-all flex justify-between items-center bg-card/20 backdrop-blur-md hover:bg-card/30"
              onClick={() => navigate("/quests")}
            >
              <div>
                <h3 className="font-medium text-white">View All Quests</h3>
                <p className="text-muted-foreground text-sm">See your 30-day roadmap</p>
              </div>
              <FiChevronRight className="text-muted-foreground" />
            </div>
            
            <div 
              className="glass p-4 rounded-xl cursor-pointer hover:opacity-95 active:scale-95 transition-all flex justify-between items-center bg-card/20 backdrop-blur-md hover:bg-card/30"
              onClick={() => navigate("/survey")}
            >
              <div>
                <h3 className="font-medium text-white">Change Theme</h3>
                <p className="text-muted-foreground text-sm">Try a different roadmap</p>
              </div>
              <FiChevronRight className="text-muted-foreground" />
            </div>
          </div>
        </GlassCard>
      </div>
      
      <TabNavigation />
    </div>
  );
};

export default Home;
