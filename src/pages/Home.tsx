
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { TabNavigation } from "@/components/TabNavigation";
import { useApp } from "@/context/AppContext";
import { QRScanner } from "@/components/QRScanner";
import { CameraUpload } from "@/components/CameraUpload";
import { ThemeBackground } from "@/components/ThemeBackground";
import { DailyAffirmation } from "@/components/DailyAffirmation";

// Import the components
import { HeaderSection } from "@/components/home/HeaderSection";
import { SearchBar } from "@/components/home/SearchBar";
import { QuestCard } from "@/components/home/QuestCard";
import { ProgressCard } from "@/components/home/ProgressCard";
import { MoodSection } from "@/components/home/MoodSection";
import { QuickActionSection } from "@/components/home/QuickActionSection";
import { CollapsibleSection } from "@/components/home/CollapsibleSection";

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
  
  const displayName = user?.user_metadata?.username || user?.email?.split('@')[0] || "Friend";
  
  return (
    <div className="min-h-screen pb-20 text-white">
      <ThemeBackground />
      {showScanner && (
        <QRScanner 
          onClose={() => setShowScanner(false)} 
          onScan={handleScan} 
        />
      )}
      
      {showCamera && (
        <CameraUpload 
          onCapture={handleCameraCapture}
          onClose={() => setShowCamera(false)}
          title="Capture a Moment"
        />
      )}
      
      <div className="px-4 pt-4 pb-20 space-y-2 max-w-[340px] mx-auto">
        <HeaderSection 
          greeting={greeting} 
          displayName={displayName} 
          onCameraClick={() => setShowCamera(true)} 
        />
        
        <SearchBar />
        
        <DailyAffirmation />
        
        <CollapsibleSection title="Today's Quest">
          <QuestCard 
            title="Track your time for 24 hours" 
            description="Document how you spend your day to identify time-wasting activities and opportunities for improvement."
            onClick={() => navigate("/quests")}
            active={true}
          />
        </CollapsibleSection>
        
        <ProgressCard 
          streak={streak} 
          xp={xp} 
          level={level} 
          progress={progress} 
        />
        
        <MoodSection 
          moods={moods} 
          selectedMood={selectedMood} 
          setSelectedMood={setSelectedMood} 
        />
        
        <QuickActionSection onScannerClick={() => setShowScanner(true)} />
        
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
  );
};

export default Home;
