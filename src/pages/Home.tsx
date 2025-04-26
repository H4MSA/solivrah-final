
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { TabNavigation } from "@/components/TabNavigation";
import { useApp } from "@/context/AppContext";
import { QRScanner } from "@/components/QRScanner";
import { DailyAffirmation } from "@/components/DailyAffirmation";
import { PremiumCard, OptionCard } from "@/components/PremiumCard";
import { Progress } from "@/components/ui/progress";
import { CameraUpload } from "@/components/CameraUpload";
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
    <div className="space-y-3">
      <div 
        className="flex justify-between items-center cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h2 className="text-lg font-semibold text-white">{title}</h2>
        <button className="p-1 rounded-full bg-white/5 border border-white/5 active:scale-95 transition-all">
          {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
      </div>
      
      <div className={`space-y-3 transition-all duration-300 ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
        {children}
      </div>
    </div>
  );
};

const QuestCard = ({ title, description, locked = false, onClick }: { title: string, description: string, locked?: boolean, onClick: () => void }) => (
  <PremiumCard
    variant="default"
    className={`p-5 ${locked ? 'opacity-60' : ''}`}
    interactive={!locked}
    onClick={!locked ? onClick : undefined}
  >
    <div className="flex justify-between items-center mb-3">
      <h3 className="text-base font-medium">{title}</h3>
      {locked ? (
        <span className="text-xs bg-black/60 backdrop-blur-sm px-2 py-1 rounded-full text-white flex items-center gap-1 border border-white/5">
          <Lock size={12} />
          <span>Locked</span>
        </span>
      ) : (
        <span className="text-xs bg-black/50 backdrop-blur-sm px-2 py-1 rounded-full text-white border border-white/10">Active</span>
      )}
    </div>
    <p className="text-sm text-white/80">{description}</p>
    
    {!locked && (
      <button 
        className="w-full mt-4 py-2.5 rounded-xl bg-white/10 backdrop-blur-xl hover:bg-white/15 text-white font-medium flex items-center justify-center gap-2 border border-white/10 transition-all"
        onClick={onClick}
      >
        Start <ArrowRight size={16} />
      </button>
    )}
    
    {locked && (
      <div className="absolute inset-0 backdrop-blur-sm bg-black/40 rounded-xl flex items-center justify-center">
        <Lock className="text-white/30 text-4xl animate-pulse-slow" />
      </div>
    )}
  </PremiumCard>
);

const MoodButton = ({ emoji, label, selected, onClick }: { emoji: string, label: string, selected?: boolean, onClick: () => void }) => (
  <PremiumCard
    variant={selected ? "selected" : "default"}
    className="p-3 flex flex-col items-center"
    interactive={true}
    onClick={onClick}
  >
    <span className="text-2xl mb-1">{emoji}</span>
    <span className="text-xs font-medium">{label}</span>
  </PremiumCard>
);

const ActionCard = ({ icon, label, onClick }: { icon: React.ReactNode, label: string, onClick: () => void }) => (
  <PremiumCard
    variant="default"
    className="p-4 flex flex-col items-center justify-center gap-2"
    interactive={true}
    onClick={onClick}
    hoverEffect={true}
  >
    <div className="text-xl text-white">{icon}</div>
    <span className="text-xs font-medium text-white">{label}</span>
  </PremiumCard>
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
    <div className="min-h-screen pb-24 text-white">
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
        className="px-5 pt-6 pb-24 space-y-6"
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
            <button 
              className="w-10 h-10 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 flex items-center justify-center transition-all duration-300 hover:bg-white/10 hover:border-white/15 active:scale-[0.95]"
              onClick={() => setShowCamera(true)}
            >
              <Camera size={20} className="text-white" />
            </button>
            <button 
              className="w-10 h-10 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 flex items-center justify-center transition-all duration-300 hover:bg-white/10 hover:border-white/15 active:scale-[0.95]"
              onClick={() => navigate("/profile")}
            >
              <User size={20} className="text-white" />
            </button>
          </div>
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <div className="relative">
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/50">
              <Search size={18} />
            </div>
            <input 
              type="text" 
              placeholder="Search for quests or tasks..." 
              className="w-full h-11 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full pl-11 pr-4 text-white placeholder:text-white/50 focus:outline-none focus:ring-1 focus:ring-white/20 focus:border-white/20 transition-all duration-300"
            />
          </div>
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
          <PremiumCard className="p-4">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-semibold">Progress</h2>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 bg-white/5 px-2 py-1 rounded-full border border-white/5">
                  <Star size={14} className="text-white/70" />
                  <span className="text-xs text-white/70">{streak} day streak</span>
                </div>
                <div className="flex items-center gap-1 bg-white/5 px-2 py-1 rounded-full border border-white/5">
                  <Zap size={14} className="text-white/70" />
                  <span className="text-xs text-white/70">{xp} XP</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-white/70">Level {level}</span>
                <span className="text-white/70">{Math.floor(progress)}%</span>
              </div>
              <div className="h-2 bg-white/5 rounded-full overflow-hidden border border-white/5">
                <div 
                  className="h-full bg-white/30 rounded-full"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <div className="text-xs text-white/70 text-right">{1000 - (xp % 1000)} XP to Level {level + 1}</div>
            </div>
          </PremiumCard>
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <CollapsibleSection title="How do you feel today?" defaultOpen={true}>
            <div className="flex justify-end mb-2">
              <span className="text-xs text-white/70 bg-white/5 px-2 py-1 rounded-full border border-white/5">Daily check-in</span>
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
                onClick={() => navigate("/community")} 
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
      
      <TabNavigation />
    </div>
  );
};

export default Home;
