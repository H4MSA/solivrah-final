
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
import { GlassCard } from "@/components/GlassCard";

// Import the enhanced components
import { HeaderSection } from "@/components/home/HeaderSection";
import { SearchBar } from "@/components/home/SearchBar";
import { MoodSection } from "@/components/home/MoodSection";
import { CollapsibleSection } from "@/components/home/CollapsibleSection";
import { QuickActionGrid } from "@/components/ui/quick-action-grid";
import { EnhancedQuestCard } from "@/components/ui/enhanced-quest-card";
import { StreakCounter, LevelIndicator, AchievementBadge, CelebrationAnimation } from "@/components/ui/gamification-elements";
import { PremiumButton } from "@/components/ui/premium-button";
import { EnhancedProgressCircle } from "@/components/ui/enhanced-progress-circle";
import { StreakDisplay } from "@/components/ui/streak-display";
import { Trophy, Star, Target, Zap, Crown, Medal, Camera, User, MessageCircle, Users, Search, Calendar } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();
  const [showScanner, setShowScanner] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const { streak, xp, selectedTheme, addXP, user } = useApp();
  const [greeting, setGreeting] = useState("");
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
    
    // Improved personalized greeting logic
    const hour = new Date().getHours();
    const day = new Date().getDay();
    const isWeekend = day === 0 || day === 6;
    
    if (hour >= 5 && hour < 12) {
      setGreeting(isWeekend ? "Good morning! Ready for a productive weekend?" : "Good morning! Let's make today count");
    } else if (hour >= 12 && hour < 17) {
      setGreeting("Good afternoon! Keep that momentum going");
    } else if (hour >= 17 && hour < 22) {
      setGreeting("Good evening! Time to reflect and grow");
    } else {
      setGreeting("Still up? Every moment is a chance to improve");
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
    { emoji: "😊", label: "Energized", description: "Ready to tackle challenges" },
    { emoji: "😐", label: "Focused", description: "Steady and determined" },
    { emoji: "😔", label: "Reflective", description: "Thoughtful and contemplative" }
  ];
  
  // Improved display name with better fallbacks
  const getDisplayName = () => {
    if (user?.user_metadata?.username) return user.user_metadata.username;
    if (user?.user_metadata?.full_name) return user.user_metadata.full_name.split(' ')[0];
    if (user?.email) return user.email.split('@')[0];
    return "Champion"; // More empowering than "Friend"
  };
  
  const displayName = getDisplayName();
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
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
      {/* Enhanced Premium Background with Better Contrast */}
      <div className="fixed inset-0 bg-gradient-to-br from-black via-gray-950 to-black">
        <div className="absolute inset-0 bg-grid-white opacity-[0.015]" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-transparent to-black/20" />
        <div className="absolute top-1/3 left-1/3 w-80 h-80 bg-white/[0.01] rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/3 right-1/3 w-60 h-60 bg-white/[0.008] rounded-full blur-2xl animate-float" />
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
          title="Capture Your Progress"
        />
      )}
      
      {/* Feature highlight for the help system */}
      <FeatureHighlight 
        id="context-help-system"
        title="New Help System Available"
        description="We've added a context-aware help button! Look for the ? icon at the bottom of the screen for guidance specific to each page."
      />
      
      <motion.div 
        className="px-6 pt-8 pb-20 space-y-8 max-w-[400px] mx-auto"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Enhanced Header with Better Typography Hierarchy */}
        <motion.div variants={itemVariants} className="space-y-4">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-white leading-tight mb-2">
                {greeting}
              </h1>
              <p className="text-lg text-white/80 font-medium">
                Welcome back, <span className="text-white font-semibold">{displayName}</span>
              </p>
              <p className="text-sm text-white/60 mt-1">
                {streak > 0 ? `You're on a ${streak}-day streak! 🔥` : "Start your journey today"}
              </p>
            </div>
            
            {/* Enhanced Action Buttons with Better Contrast */}
            <div className="flex items-center gap-3">
              <motion.button 
                className="w-12 h-12 rounded-xl bg-white/15 backdrop-blur-xl border border-white/20 flex items-center justify-center transition-all duration-300 hover:bg-white/25 active:scale-[0.95] shadow-xl"
                onClick={() => setShowCamera(true)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Capture moment"
              >
                <Camera className="text-white w-5 h-5" />
              </motion.button>
              <motion.button 
                className="w-12 h-12 rounded-xl bg-white/15 backdrop-blur-xl border border-white/20 flex items-center justify-center transition-all duration-300 hover:bg-white/25 active:scale-[0.95] shadow-xl"
                onClick={() => navigate("/profile")}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label="View profile"
              >
                <User className="text-white w-5 h-5" />
              </motion.button>
            </div>
          </div>
        </motion.div>
        
        {/* Enhanced Search with Better Spacing */}
        <motion.div variants={itemVariants}>
          <SearchBar />
        </motion.div>
        
        {/* Enhanced Daily Affirmation with Improved Copy */}
        <motion.div variants={itemVariants}>
          <DailyAffirmation />
        </motion.div>
        
        {/* Hero Quest Card with Improved Typography and Contrast */}
        <motion.div variants={itemVariants}>
          <GlassCard variant="duolingo" className="p-8">
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                    <Target size={16} className="text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-white">
                    Today's Challenge
                  </h2>
                </div>
                <p className="text-base text-white/85 leading-relaxed mb-4">
                  Master your time by tracking every hour for 24 hours. Discover hidden time drains and unlock your productivity potential.
                </p>
                <div className="flex items-center gap-4 text-sm text-white/70">
                  <span className="flex items-center gap-1">
                    <Zap size={14} />
                    15 min setup
                  </span>
                  <span className="flex items-center gap-1">
                    <Trophy size={14} />
                    High impact
                  </span>
                </div>
              </div>
              
              <motion.div 
                className="flex items-center gap-2 bg-white/25 px-4 py-2 rounded-full ml-6 border border-white/30"
                whileHover={{ scale: 1.05 }}
              >
                <Star size={16} className="text-white" />
                <span className="text-base font-bold text-white">+100 XP</span>
              </motion.div>
            </div>
            
            {/* Enhanced Progress Section */}
            <div className="space-y-4 mb-8">
              <div className="flex justify-between items-center">
                <span className="text-base font-semibold text-white">Quest Progress</span>
                <span className="text-sm text-white/70">1 of 4 steps complete</span>
              </div>
              
              <div className="w-full bg-white/15 rounded-full h-3 overflow-hidden border border-white/20">
                <motion.div
                  className="h-full bg-gradient-to-r from-white via-white/90 to-white/80 rounded-full relative overflow-hidden"
                  initial={{ width: 0 }}
                  animate={{ width: '25%' }}
                  transition={{ duration: 2, ease: "easeOut" }}
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                    animate={{ x: [-100, 300] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 4 }}
                  />
                </motion.div>
              </div>
            </div>
            
            {/* Enhanced Action Button */}
            <PremiumButton
              variant="primary"
              size="lg"
              showArrow={true}
              celebrateOnClick={true}
              onClick={() => navigate("/quests")}
              className="w-full font-semibold text-lg"
            >
              Continue Your Quest
            </PremiumButton>
          </GlassCard>
        </motion.div>
        
        {/* Enhanced Progress Hub with Better Information Architecture */}
        <motion.div variants={itemVariants}>
          <GlassCard variant="premium" className="p-8">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-white mb-2">Your Progress Journey</h3>
              <p className="text-sm text-white/70">Every small step leads to big transformations</p>
            </div>
            
            {/* Level & Streak Display with Better Spacing */}
            <div className="flex items-center justify-center gap-12 mb-10">
              <motion.div 
                className="flex flex-col items-center space-y-3"
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
                    <Crown size={24} className="text-white mb-2 mx-auto" />
                    <div className="text-3xl font-bold text-white">{level}</div>
                    <div className="text-sm text-white/80 font-medium">Level</div>
                  </div>
                </EnhancedProgressCircle>
                <p className="text-xs text-white/60 text-center max-w-[80px]">
                  {1000 - (xp % 1000)} XP to next level
                </p>
              </motion.div>
              
              <StreakDisplay 
                days={streak}
                size="lg"
                variant="fire"
                glowing={streak > 0}
                onClick={() => triggerCelebration('streak', streak)}
              />
            </div>
            
            {/* Enhanced XP Progress with Better Visual Hierarchy */}
            <div className="space-y-4 mb-8">
              <div className="flex justify-between items-center">
                <span className="text-base font-semibold text-white">
                  Experience Points
                </span>
                <span className="text-sm text-white/70">
                  {xp % 1000} / 1000 XP
                </span>
              </div>
              
              <div className="w-full bg-white/15 rounded-full h-4 overflow-hidden backdrop-blur-sm border border-white/25">
                <motion.div
                  className="h-full bg-gradient-to-r from-white via-white/90 to-white/80 rounded-full relative overflow-hidden"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 2, ease: "easeOut" }}
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                    animate={{ x: [-100, 300] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                  />
                </motion.div>
              </div>
            </div>
            
            {/* Enhanced Stats Grid with Better Information Design */}
            <div className="grid grid-cols-3 gap-4">
              <motion.div 
                className="text-center p-4 bg-white/10 rounded-xl border border-white/15 backdrop-blur-sm"
                whileHover={{ scale: 1.02, backgroundColor: "rgba(255, 255, 255, 0.12)" }}
              >
                <div className="text-2xl font-bold text-white mb-1">{streak}</div>
                <div className="text-xs text-white/70 font-medium">Day Streak</div>
                <div className="text-xs text-white/50 mt-1">Keep it up!</div>
              </motion.div>
              
              <motion.div 
                className="text-center p-4 bg-white/10 rounded-xl border border-white/15 backdrop-blur-sm"
                whileHover={{ scale: 1.02, backgroundColor: "rgba(255, 255, 255, 0.12)" }}
              >
                <div className="text-2xl font-bold text-white mb-1">{xp.toLocaleString()}</div>
                <div className="text-xs text-white/70 font-medium">Total XP</div>
                <div className="text-xs text-white/50 mt-1">Well earned</div>
              </motion.div>
              
              <motion.div 
                className="text-center p-4 bg-white/10 rounded-xl border border-white/15 backdrop-blur-sm"
                whileHover={{ scale: 1.02, backgroundColor: "rgba(255, 255, 255, 0.12)" }}
              >
                <div className="text-2xl font-bold text-white mb-1">3</div>
                <div className="text-xs text-white/70 font-medium">Completed</div>
                <div className="text-xs text-white/50 mt-1">This week</div>
              </motion.div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Enhanced Achievement Gallery */}
        <motion.div variants={itemVariants}>
          <GlassCard variant="premium" className="p-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-xl font-bold text-white mb-1">Achievement Gallery</h3>
                <p className="text-sm text-white/60">Celebrate your milestones</p>
              </div>
              <motion.div 
                className="text-xs text-white/70 px-4 py-2 bg-white/15 rounded-full border border-white/25 font-medium"
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {[true, streak >= 7, false, level >= 5].filter(Boolean).length}/4 Unlocked
              </motion.div>
            </div>
            
            <div className="grid grid-cols-2 gap-5">
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
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
                whileHover={{ scale: streak >= 7 ? 1.03 : 1.01 }}
                whileTap={{ scale: 0.97 }}
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
                whileHover={{ scale: 1.01 }}
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
                whileHover={{ scale: level >= 5 ? 1.03 : 1.01 }}
                whileTap={{ scale: 0.97 }}
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
            
            {/* Enhanced Next Achievement Preview */}
            <motion.div 
              className="mt-8 p-5 bg-white/8 rounded-xl border border-white/15 backdrop-blur-sm"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="text-base font-semibold text-white/90 mb-2">Next Achievement</div>
              <div className="text-sm text-white/70 mb-4">
                {level < 5 ? `Reach level ${5} to unlock Champion status` : 'Complete 7 more quests to become a Goal Getter'}
              </div>
              <div className="w-full bg-white/15 rounded-full h-2.5 overflow-hidden">
                <motion.div
                  className="h-full bg-white/70 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: level < 5 ? `${(level / 5) * 100}%` : '30%' }}
                  transition={{ duration: 1.5, delay: 0.5 }}
                />
              </div>
            </motion.div>
          </GlassCard>
        </motion.div>
        
        {/* Enhanced Mood Section with Better Context */}
        <motion.div variants={itemVariants}>
          <MoodSection 
            moods={moods} 
            selectedMood={selectedMood} 
            setSelectedMood={setSelectedMood} 
          />
        </motion.div>
        
        {/* Enhanced Quick Actions with Better Organization */}
        <motion.div variants={itemVariants}>
          <CollapsibleSection title="Quick Actions">
            <div className="grid grid-cols-3 gap-4">
              <motion.button
                className="flex flex-col items-center p-6 bg-white/10 rounded-xl border border-white/15 hover:bg-white/15 transition-all duration-300 backdrop-blur-sm"
                onClick={() => setShowCamera(true)}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <Camera size={24} className="text-white mb-3" />
                <span className="text-sm font-medium text-white">Capture</span>
                <span className="text-xs text-white/60 mt-1">Moment</span>
              </motion.button>
              
              <motion.button
                className="flex flex-col items-center p-6 bg-white/10 rounded-xl border border-white/15 hover:bg-white/15 transition-all duration-300 backdrop-blur-sm"
                onClick={() => navigate("/coach")}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <MessageCircle size={24} className="text-white mb-3" />
                <span className="text-sm font-medium text-white">Chat</span>
                <span className="text-xs text-white/60 mt-1">AI Coach</span>
              </motion.button>
              
              <motion.button
                className="flex flex-col items-center p-6 bg-white/10 rounded-xl border border-white/15 hover:bg-white/15 transition-all duration-300 backdrop-blur-sm"
                onClick={() => navigate("/community")}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <Users size={24} className="text-white mb-3" />
                <span className="text-sm font-medium text-white">Connect</span>
                <span className="text-xs text-white/60 mt-1">Community</span>
              </motion.button>
            </div>
          </CollapsibleSection>
        </motion.div>
        
        {/* Enhanced Coming Up Section with Better Quest Descriptions */}
        <motion.div variants={itemVariants}>
          <CollapsibleSection title="Coming Up Next">
            <div className="space-y-5">
              <EnhancedQuestCard 
                title="Morning Mastery Routine" 
                description="Design and execute a powerful 30-minute morning routine that sets you up for daily success and sustained energy."
                xp={75}
                difficulty="Medium"
                timeEstimate="30 min daily"
                locked={true}
                onClick={() => {}}
              />
              
              <EnhancedQuestCard 
                title="Digital Detox Challenge" 
                description="Disconnect from all devices for 60 minutes and reconnect with yourself through mindful activities or deep work."
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
