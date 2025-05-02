
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useApp } from "@/context/AppContext";
import { QRScanner } from "@/components/QRScanner";
import { DailyAffirmation } from "@/components/DailyAffirmation";
import { PremiumCard, OptionCard } from "@/components/PremiumCard";
import { Progress } from "@/components/ui/progress";
import { CameraUpload } from "@/components/CameraUpload";
import { GlassPane, GlassCard, GlassButton, GlassInput } from "@/components/ui/glass";
import { QuestCard } from "@/components/QuestCard";
import { 
  Camera, 
  Star, 
  Zap, 
  User, 
  MessageCircle, 
  Users, 
  Lock, 
  Search, 
  ChevronDown, 
  ChevronUp, 
  ArrowRight 
} from "lucide-react";

const CollapsibleSection = ({ title, children, defaultOpen = true }: { title: string, children: React.ReactNode, defaultOpen?: boolean }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  return (
    <motion.div 
      className="space-y-3"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div 
        className="flex justify-between items-center cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h2 className="text-lg font-semibold text-white">{title}</h2>
        <button className="p-1.5 rounded-full bg-white/5 border border-white/5 active:scale-95 transition-all hover:bg-white/10">
          {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
      </div>
      
      <motion.div 
        className="space-y-3"
        initial={false}
        animate={{
          maxHeight: isOpen ? 1000 : 0,
          opacity: isOpen ? 1 : 0,
          marginTop: isOpen ? 12 : 0
        }}
        transition={{ 
          duration: 0.4, 
          ease: [0.23, 1, 0.32, 1]
        }}
      >
        {isOpen && children}
      </motion.div>
    </motion.div>
  );
};

const MoodButton = ({ emoji, label, selected, onClick }: { emoji: string, label: string, selected?: boolean, onClick: () => void }) => (
  <PremiumCard
    variant={selected ? "selected" : "frost"}
    className="p-3 flex flex-col items-center"
    interactive={true}
    onClick={onClick}
    glowEffect={selected}
  >
    <motion.span 
      className="text-2xl mb-1"
      animate={{ scale: selected ? [1, 1.2, 1] : 1 }}
      transition={{ duration: 0.5 }}
    >
      {emoji}
    </motion.span>
    <span className="text-xs font-medium">{label}</span>
  </PremiumCard>
);

const ActionCard = ({ icon, label, onClick }: { icon: React.ReactNode, label: string, onClick: () => void }) => (
  <GlassPane
    variant="frost"
    className="p-4 flex flex-col items-center justify-center gap-2"
    interactive={true}
    onClick={onClick}
    hoverEffect={true}
  >
    <div className="text-xl text-white">{icon}</div>
    <span className="text-xs font-medium text-white">{label}</span>
  </GlassPane>
);

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
    // Handle the captured photo
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
        staggerChildren: 0.05
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
    <div className="min-h-screen text-white overflow-y-auto">
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
        className="px-5 pt-6 pb-28 space-y-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="flex justify-between items-center">
          <div>
            <h1 className="text-xl text-white font-medium">
              {greeting}, <span className="font-semibold">{displayName}</span>
            </h1>
            <p className="text-sm text-white/80">Let's make progress today</p>
          </div>
          
          <div className="flex items-center gap-3">
            <GlassButton 
              variant="secondary"
              size="sm"
              className="w-10 h-10 p-0 rounded-full flex items-center justify-center"
              onClick={() => setShowCamera(true)}
            >
              <Camera size={18} className="text-white" />
            </GlassButton>
            <GlassButton 
              variant="secondary"
              size="sm"
              className="w-10 h-10 p-0 rounded-full flex items-center justify-center"
              onClick={() => navigate("/profile")}
            >
              <User size={18} className="text-white" />
            </GlassButton>
          </div>
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <GlassInput 
            icon={<Search size={18} />}
            placeholder="Search for quests or tasks..." 
            className="w-full h-11 bg-white/5"
          />
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
              current={true}
            />
          </CollapsibleSection>
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <GlassCard
            title="Progress"
            headerClassName="px-1"
            className="relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-black/40 to-transparent rounded-xl pointer-events-none" />
            
            <div className="flex justify-between items-center mb-3 relative z-10">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1 rounded-full border border-white/5">
                  <Star size={14} className="text-white/70" />
                  <span className="text-xs text-white/70 font-medium">{streak} day streak</span>
                </div>
                <div className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1 rounded-full border border-white/5">
                  <Zap size={14} className="text-white/70" />
                  <span className="text-xs text-white/70 font-medium">{xp} XP</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-2 relative z-10">
              <div className="flex justify-between text-xs">
                <span className="text-white/70 font-medium">Level {level}</span>
                <span className="text-white/70">{Math.floor(progress)}%</span>
              </div>
              <Progress 
                value={progress} 
                className="h-3" 
                indicatorClassName="bg-gradient-to-r from-white/40 via-white/30 to-white/20"
                levelIndicator
                glassMorphism
                glowEffect
              />
              <div className="text-xs text-white/70 text-right">{1000 - (xp % 1000)} XP to Level {level + 1}</div>
            </div>
          </GlassCard>
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <CollapsibleSection title="How do you feel today?" defaultOpen={true}>
            <div className="flex justify-end mb-2">
              <span className="text-xs text-white/70 bg-white/5 px-2.5 py-1 rounded-full border border-white/5">Daily check-in</span>
            </div>
            
            <div className="grid grid-cols-3 gap-3">
              {moods.map((mood) => (
                <MoodButton 
                  key={mood.label} 
                  emoji={mood.emoji} 
                  label={mood.label} 
                  selected={selectedMood === mood.label}
                  onClick={() => setSelectedMood(mood.label)}
                />
              ))}
            </div>
          </CollapsibleSection>
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <CollapsibleSection title="Quick Actions" defaultOpen={true}>
            <div className="grid grid-cols-3 gap-3">
              <ActionCard 
                icon={<MessageCircle size={20} />} 
                label="AI Coach" 
                onClick={() => navigate("/coach")} 
              />
              <ActionCard 
                icon={<Users size={20} />} 
                label="Community" 
                onClick={() => navigate("/social")} 
              />
              <ActionCard 
                icon={<Camera size={20} />} 
                label="Scan QR" 
                onClick={() => setShowScanner(true)} 
              />
            </div>
          </CollapsibleSection>
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
    </div>
  );
};

export default Home;
