import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useApp } from "@/context/AppContext";
import { QRScanner } from "@/components/common/QRScanner";
import { CameraUpload } from "@/components/CameraUpload";
import { DailyAffirmation } from "@/components/DailyAffirmation";
import { QuickGuide } from "@/components/QuickGuide";
import { FeatureHighlight } from "@/components/FeatureHighlight";

// Import the enhanced components
import { HeaderSection } from "@/components/features/home/HeaderSection";
import { SearchBar } from "@/components/features/home/SearchBar";
import { QuestCard } from "@/components/features/home/QuestCard";
import { MoodSection } from "@/components/features/home/MoodSection";
import { CollapsibleSection } from "@/components/features/home/CollapsibleSection";
import { DailyQuestHero } from "@/components/ui/daily-quest-hero";
import { StatsDisplay } from "@/components/ui/stats-display";
import { QuickActionGrid } from "@/components/ui/quick-action-grid";

const Home = () => {
  const navigate = useNavigate();
  const [showScanner, setShowScanner] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const { streak, xp, selectedTheme, addXP, user } = useApp();
  const [greeting, setGreeting] = useState("Good morning");
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  
  // Check if it's the user's first time
  const [isFirstVisit, setIsFirstVisit] = useState(() => {
    return localStorage.getItem("hasVisitedHome") !== "true";
  });
  
  useEffect(() => {
    if (isFirstVisit) {
      localStorage.setItem("hasVisitedHome", "true");
    }
    
    const hour = new Date().getHours();
    if (hour >= 12 && hour < 17) {
      setGreeting("Good afternoon");
    } else if (hour >= 17) {
      setGreeting("Good evening");
    }
  }, [isFirstVisit]);
  
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
        staggerChildren: 0.08
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    }
  };

  // Get the current UI complexity preference
  const uiComplexity = localStorage.getItem('uiComplexity') || 'intermediate';

  return (
    <div className="min-h-screen pb-20 text-white">
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
      
      {/* Feature highlight for the help system */}
      <FeatureHighlight 
        id="context-help-system"
        title="New Help System Available"
        description="We've added a context-aware help button! Look for the ? icon at the bottom of the screen for guidance specific to each page."
      />
      
      <motion.div 
        className="px-4 pt-4 pb-20 space-y-6 max-w-[400px] mx-auto"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div variants={itemVariants}>
          <HeaderSection 
            greeting={greeting} 
            displayName={displayName} 
            onCameraClick={() => setShowCamera(true)} 
          />
        </motion.div>
        
        {/* Show beginner guide for first-time or 'beginner' UI complexity users */}
        {(isFirstVisit || uiComplexity === 'beginner') && (
          <motion.div variants={itemVariants}>
            <QuickGuide 
              title="Getting Started" 
              steps={[
                "Complete daily quests to build your streak and earn XP",
                "Track your mood to observe patterns over time",
                "Use quick actions to scan QR codes or capture moments",
                "Check your progress in the stats below"
              ]}
            />
          </motion.div>
        )}
        
        <motion.div variants={itemVariants}>
          <SearchBar />
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <DailyAffirmation />
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <DailyQuestHero
            title="Track your time for 24 hours"
            description="Document how you spend your day to identify time-wasting activities and opportunities for improvement."
            xp={100}
            progress={25}
            onStart={() => navigate("/quests")}
          />
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <StatsDisplay 
            streak={streak} 
            xp={xp} 
            level={level} 
            completedQuests={3}
            layout="grid"
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
          <CollapsibleSection title="Quick Actions">
            <QuickActionGrid 
              onCameraClick={() => setShowCamera(true)}
              onChatClick={() => navigate("/coach")}
              onCommunityClick={() => navigate("/community")}
              onSearchClick={() => {}}
              onCalendarClick={() => {}}
              onAchievementsClick={() => navigate("/profile")}
            />
          </CollapsibleSection>
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <CollapsibleSection title="Coming Up">
            <QuestCard 
              title="Day 2: Morning Routine" 
              description="Establish a productive morning routine to set the tone for your day."
              xp={75}
              locked={true}
              onClick={() => {}}
            />
          </CollapsibleSection>
        </motion.div>
      </motion.div>
      
      {/* Footer placeholder */}
      <div className="h-24" />
    </div>
  );
};

export default Home;
