
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { TabNavigation } from "@/components/TabNavigation";
import { useApp } from "@/context/AppContext";
import { QRScanner } from "@/components/QRScanner";
import { CameraUpload } from "@/components/CameraUpload";
import { ThemeBackground } from "@/components/ThemeBackground";
import { DailyAffirmation } from "@/components/DailyAffirmation";
import { QuickGuide } from "@/components/QuickGuide";
import { FeatureHighlight } from "@/components/FeatureHighlight";

// Import the enhanced components
import { HeaderSection } from "@/components/home/HeaderSection";
import { SearchBar } from "@/components/home/SearchBar";
import { QuestCard } from "@/components/home/QuestCard";
import { MoodSection } from "@/components/home/MoodSection";
import { CollapsibleSection } from "@/components/home/CollapsibleSection";
import { DailyQuestHero } from "@/components/ui/daily-quest-hero";
import { StatsDisplay } from "@/components/ui/stats-display";
import { QuickActionGrid } from "@/components/ui/quick-action-grid";
import { EnhancedQuestCard } from "@/components/ui/enhanced-quest-card";
import { StreakCounter, LevelIndicator, AchievementBadge, CelebrationAnimation } from "@/components/ui/gamification-elements";
import { Trophy, Star, Target, Zap, Crown, Medal } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();
  const [showScanner, setShowScanner] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const { streak, xp, selectedTheme, addXP, user } = useApp();
  const [greeting, setGreeting] = useState("Good morning");
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationType, setCelebrationType] = useState<'xp' | 'level' | 'achievement' | 'streak'>('xp');
  const [celebrationValue, setCelebrationValue] = useState(0);
  
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
    triggerCelebration('xp', 50);
  };
  
  const handleCameraCapture = (file: File | null) => {
    if (!file) return;
    console.log("Photo captured:", file);
    setTimeout(() => {
      addXP(30);
      setShowCamera(false);
      triggerCelebration('xp', 30);
    }, 500);
  };

  const triggerCelebration = (type: 'xp' | 'level' | 'achievement' | 'streak', value: number) => {
    setCelebrationType(type);
    setCelebrationValue(value);
    setShowCelebration(true);
    setTimeout(() => setShowCelebration(false), 3000);
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
    <div className="min-h-screen pb-20 text-white relative overflow-hidden">
      {/* Sophisticated monochromatic background */}
      <div className="fixed inset-0 bg-gradient-to-br from-black via-gray-900/50 to-black">
        <div className="absolute inset-0 bg-grid-white opacity-5" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />
      </div>
      
      <ThemeBackground />
      
      {/* Celebration Animation */}
      <CelebrationAnimation 
        show={showCelebration}
        type={celebrationType}
        value={celebrationValue}
      />

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
        
        {/* Gamification Hub - Enhanced with monochromatic design */}
        <motion.div variants={itemVariants}>
          <div className="bg-gradient-to-br from-white/8 to-white/3 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-4">Your Progress</h3>
            
            <div className="flex items-center justify-between mb-6">
              <LevelIndicator 
                currentLevel={level}
                currentXP={xp}
                xpToNext={1000 - (xp % 1000)}
                size="lg"
              />
              
              <StreakCounter 
                days={streak}
                size="lg"
                glowing={streak > 0}
              />
            </div>
            
            <StatsDisplay 
              streak={streak} 
              xp={xp} 
              level={level} 
              completedQuests={3}
              layout="grid"
            />
          </div>
        </motion.div>

        {/* Achievement Gallery */}
        <motion.div variants={itemVariants}>
          <div className="bg-gradient-to-br from-white/6 to-white/2 backdrop-blur-xl border border-white/15 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-4">Achievements</h3>
            
            <div className="grid grid-cols-4 gap-3">
              <AchievementBadge 
                icon={<Star size={20} />}
                title="First Quest"
                description="Complete your first quest"
                earned={true}
                onClick={() => triggerCelebration('achievement', 0)}
              />
              <AchievementBadge 
                icon={<Trophy size={20} />}
                title="Week Warrior"
                description="7-day streak"
                earned={streak >= 7}
              />
              <AchievementBadge 
                icon={<Target size={20} />}
                title="Goal Getter"
                description="Complete 10 quests"
                earned={false}
              />
              <AchievementBadge 
                icon={<Medal size={20} />}
                title="Champion"
                description="Reach level 5"
                earned={level >= 5}
              />
            </div>
          </div>
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
            <div className="space-y-4">
              <EnhancedQuestCard 
                title="Day 2: Morning Routine" 
                description="Establish a productive morning routine to set the tone for your day."
                xp={75}
                difficulty="Medium"
                timeEstimate="15 min"
                locked={true}
                onClick={() => {}}
              />
              
              <EnhancedQuestCard 
                title="Day 3: Digital Detox Hour" 
                description="Spend one hour completely disconnected from digital devices."
                xp={100}
                difficulty="Hard"
                timeEstimate="60 min"
                locked={true}
                onClick={() => {}}
              />
            </div>
          </CollapsibleSection>
        </motion.div>
      </motion.div>
      
      <TabNavigation />
    </div>
  );
};

export default Home;
