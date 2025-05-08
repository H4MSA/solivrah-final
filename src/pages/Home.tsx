
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { TabNavigation } from "@/components/TabNavigation";
import { useApp } from "@/context/AppContext";
import { QRScanner } from "@/components/QRScanner";
import { DailyAffirmation } from "@/components/DailyAffirmation";
import { CameraUpload } from "@/components/CameraUpload";
import { ThemeBackground } from "@/components/ThemeBackground";

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
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.07
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 10, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    }
  };
  
  return (
    <div className="min-h-screen pb-24 text-white">
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
      
      <motion.div 
        className="px-6 pt-6 pb-24 space-y-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants}>
          <HeaderSection 
            greeting={greeting} 
            displayName={displayName} 
            onCameraClick={() => setShowCamera(true)} 
          />
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <SearchBar />
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <DailyAffirmation />
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <CollapsibleSection title="Today's Quest" defaultOpen={true}>
            <QuestCard 
              title="Track your time for 24 hours" 
              description="Document how you spend your day to identify time-wasting activities and opportunities for improvement."
              onClick={() => navigate("/quests")}
            />
          </CollapsibleSection>
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <ProgressCard 
            streak={streak} 
            xp={xp} 
            level={level} 
            progress={progress} 
          />
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <MoodSection 
            moods={moods} 
            selectedMood={selectedMood} 
            setSelectedMood={setSelectedMood} 
          />
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <QuickActionSection onScannerClick={() => setShowScanner(true)} />
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <CollapsibleSection title="Coming Up" defaultOpen={true}>
            <QuestCard 
              title="Day 2: Morning Routine" 
              description="Establish a productive morning routine to set the tone for your day."
              locked={true}
              onClick={() => {}}
            />
          </CollapsibleSection>
        </motion.div>
      </motion.div>
      
      <TabNavigation />
    </div>
  );
};

export default Home;
