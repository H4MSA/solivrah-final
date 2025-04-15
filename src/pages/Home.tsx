
import React, { useState } from "react";
import { GlassCard } from "@/components/GlassCard";
import { TabNavigation } from "@/components/TabNavigation";
import { FiArrowRight, FiStar, FiZap, FiUser, FiCamera } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { QRScanner } from "@/components/QRScanner";
import { useApp } from "@/context/AppContext";

const Home = () => {
  const navigate = useNavigate();
  const [showScanner, setShowScanner] = useState(false);
  const { streak, xp, selectedTheme, addXP } = useApp();
  
  const handleScan = (code: string) => {
    console.log("QR code scanned:", code);
    // In a real app, this would validate the code against the backend
    setShowScanner(false);
    
    // Give some XP for scanning a code
    addXP(50);
  };
  
  return (
    <div className="min-h-screen pb-20">
      {showScanner && (
        <QRScanner 
          onClose={() => setShowScanner(false)} 
          onScan={handleScan} 
        />
      )}
      
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-medium">Good morning, Alexa</h1>
          <div className="flex items-center gap-2">
            <button 
              className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center"
              onClick={() => setShowScanner(true)}
            >
              <FiCamera className="text-white" />
            </button>
            <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
              <FiUser className="text-white" />
            </div>
          </div>
        </div>
        
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
          
          <button className="btn-primary w-full flex items-center justify-center gap-2">
            Start Quest <FiArrowRight />
          </button>
        </GlassCard>
        
        <GlassCard>
          <h2 className="text-lg font-medium mb-4">Explore More</h2>
          
          <div className="grid grid-cols-2 gap-3">
            <div 
              className="glass p-4 rounded-xl cursor-pointer hover:opacity-90 active:scale-95 transition-all"
              onClick={() => navigate("/quests")}
            >
              <h3 className="font-medium">Quests</h3>
              <p className="text-muted text-sm">View roadmap</p>
            </div>
            
            <div 
              className="glass p-4 rounded-xl cursor-pointer hover:opacity-90 active:scale-95 transition-all"
              onClick={() => navigate("/coach")}
            >
              <h3 className="font-medium">AI Coach</h3>
              <p className="text-muted text-sm">Get guidance</p>
            </div>
          </div>
          
          <button 
            className="btn-primary w-full mt-4 flex items-center justify-center"
            onClick={() => navigate("/survey")}
          >
            Start Personal Survey
          </button>
        </GlassCard>
      </div>
      
      <TabNavigation />
    </div>
  );
};

export default Home;
