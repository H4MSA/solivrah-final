
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
import { PremiumButton } from "@/components/ui/premium-button";
import { EnhancedProgressCircle } from "@/components/ui/enhanced-progress-circle";
import { StreakDisplay } from "@/components/ui/streak-display";
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
      {/* Premium Monochromatic Background with Sophisticated Depth */}
      <div className="fixed inset-0 bg-gradient-to-br from-black via-gray-950 to-black">
        {/* Subtle texture overlay */}
        <div className="absolute inset-0 bg-grid-white opacity-[0.02]" />
        
        {/* Elegant depth gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/30" />
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/[0.01] to-transparent" />
        
        {/* Dynamic ambient lighting */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/[0.02] rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-white/[0.015] rounded-full blur-2xl animate-float" />
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
        
        {/* Hero Quest Card - Premium Duolingo-inspired Design */}
        <motion.div variants={itemVariants}>
          <motion.div 
            className="glass p-6 hover:shadow-3xl transition-all duration-500"
            whileHover={{ scale: 1.02, y: -4 }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <motion.h2 
                  className="text-xl font-bold text-white mb-2"
                  animate={{ opacity: [0.9, 1, 0.9] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  Today's Challenge
                </motion.h2>
                <p className="text-white/70 text-sm leading-relaxed mb-4">
                  Track your time for 24 hours to identify patterns and optimize your daily routine.
                </p>
              </div>
              
              <motion.div 
                className="flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full ml-4"
                whileHover={{ scale: 1.05 }}
              >
                <Star size={14} className="text-white" />
                <span className="text-sm font-bold text-white">100 XP</span>
              </motion.div>
            </div>
            
            {/* Progress Section */}
            <div className="space-y-3 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-white/80">Progress</span>
                <span className="text-sm text-white/60">25%</span>
              </div>
              
              <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-white/80 to-white/60 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: '25%' }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                />
              </div>
            </div>
            
            {/* Action Button */}
            <PremiumButton
              variant="primary"
              size="md"
              showArrow={true}
              celebrateOnClick={true}
              onClick={() => navigate("/quests")}
              className="w-full font-semibold"
            >
              Continue Quest
            </PremiumButton>
          </motion.div>
        </motion.div>
        
        {/* Premium Progress Hub - Duolingo-inspired with sophisticated monochromatic design */}
        <motion.div variants={itemVariants}>
          <div className="glass p-6 shadow-2xl hover:shadow-3xl transition-all duration-500">
            <motion.h3 
              className="text-xl font-bold text-white mb-6 text-center"
              animate={{ opacity: [0.8, 1, 0.8] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              Your Journey
            </motion.h3>
            
            {/* Level & Streak Display */}
            <div className="flex items-center justify-center gap-8 mb-8">
              <motion.div 
                className="flex flex-col items-center"
                whileHover={{ scale: 1.05 }}
              >
                <EnhancedProgressCircle
                  progress={progress}
                  size="lg"
                  variant="premium"
                  animated={true}
                  showPercentage={false}
                >
                  <div className="text-center">
                    <Crown size={20} className="text-white mb-1 mx-auto" />
                    <div className="text-2xl font-bold text-white">{level}</div>
                    <div className="text-xs text-white/70">Level</div>
                  </div>
                </EnhancedProgressCircle>
              </motion.div>
              
              <StreakDisplay 
                days={streak}
                size="lg"
                variant="fire"
                glowing={streak > 0}
                onClick={() => triggerCelebration('streak', streak)}
              />
            </div>
            
            {/* XP Progress */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-white/80">
                  {xp % 1000} / 1000 XP
                </span>
                <span className="text-xs text-white/60">
                  {1000 - (xp % 1000)} XP to Level {level + 1}
                </span>
              </div>
              
              <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden backdrop-blur-sm border border-white/20">
                <motion.div
                  className="h-full bg-gradient-to-r from-white/80 to-white/60 rounded-full relative overflow-hidden"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                >
                  {/* Animated shine effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                    animate={{ x: [-100, 300] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                  />
                </motion.div>
              </div>
            </div>
            
            {/* Quick Stats Grid */}
            <div className="grid grid-cols-3 gap-4 mt-6">
              <motion.div 
                className="text-center p-3 bg-white/5 rounded-xl border border-white/10"
                whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.08)" }}
              >
                <div className="text-xl font-bold text-white">{streak}</div>
                <div className="text-xs text-white/60">Day Streak</div>
              </motion.div>
              
              <motion.div 
                className="text-center p-3 bg-white/5 rounded-xl border border-white/10"
                whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.08)" }}
              >
                <div className="text-xl font-bold text-white">{xp}</div>
                <div className="text-xs text-white/60">Total XP</div>
              </motion.div>
              
              <motion.div 
                className="text-center p-3 bg-white/5 rounded-xl border border-white/10"
                whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.08)" }}
              >
                <div className="text-xl font-bold text-white">3</div>
                <div className="text-xs text-white/60">Completed</div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Premium Achievement Gallery - Sophisticated Showcase */}
        <motion.div variants={itemVariants}>
          <div className="glass p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-white">Achievements</h3>
              <motion.div 
                className="text-xs text-white/60 px-3 py-1 bg-white/10 rounded-full border border-white/20"
                animate={{ opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {[true, streak >= 7, false, level >= 5].filter(Boolean).length}/4 Unlocked
              </motion.div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => triggerCelebration('achievement', 0)}
              >
                <AchievementBadge 
                  icon={<Star size={24} />}
                  title="First Quest"
                  description="Complete your first quest"
                  earned={true}
                  size="lg"
                />
              </motion.div>
              
              <motion.div
                whileHover={{ scale: streak >= 7 ? 1.05 : 1.02 }}
                whileTap={{ scale: 0.95 }}
              >
                <AchievementBadge 
                  icon={<Trophy size={24} />}
                  title="Week Warrior"
                  description="7-day streak"
                  earned={streak >= 7}
                  size="lg"
                />
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="opacity-60"
              >
                <AchievementBadge 
                  icon={<Target size={24} />}
                  title="Goal Getter"
                  description="Complete 10 quests"
                  earned={false}
                  size="lg"
                />
              </motion.div>
              
              <motion.div
                whileHover={{ scale: level >= 5 ? 1.05 : 1.02 }}
                whileTap={{ scale: 0.95 }}
              >
                <AchievementBadge 
                  icon={<Medal size={24} />}
                  title="Champion"
                  description="Reach level 5"
                  earned={level >= 5}
                  size="lg"
                />
              </motion.div>
            </div>
            
            {/* Progress towards next achievement */}
            <motion.div 
              className="mt-6 p-4 bg-white/5 rounded-xl border border-white/10"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="text-sm font-medium text-white/80 mb-2">Next Achievement</div>
              <div className="text-xs text-white/60 mb-3">
                {level < 5 ? `${5 - level} more levels to Champion` : 'Complete 7 more quests for Goal Getter'}
              </div>
              <div className="w-full bg-white/10 rounded-full h-2">
                <motion.div
                  className="h-full bg-white/60 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: level < 5 ? `${(level / 5) * 100}%` : '30%' }}
                  transition={{ duration: 1, delay: 0.5 }}
                />
              </div>
            </motion.div>
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
