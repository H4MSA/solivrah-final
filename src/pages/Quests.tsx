
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Check, X, Clock, ChevronRight, Loader2, Star, Lock, Trophy, Flame, Award } from "lucide-react";
import { useApp } from "@/context/AppContext";

interface Quest {
  id: string;
  title: string;
  description: string;
  xp: number;
  difficulty: "Easy" | "Medium" | "Hard";
  status: "current" | "upcoming" | "completed" | "missed";
  theme: string;
  deadline?: string;
  locked?: boolean;
  lockedReason?: string;
  completed?: boolean;
  tags?: string[];
}

interface QuestCardProps {
  title: string;
  description: string;
  xpAmount: number;
  status: Quest["status"];
  theme?: string;
  locked?: boolean;
  lockedReason?: string;
  tags?: string[];
  onClick?: () => void;
  difficulty: "Easy" | "Medium" | "Hard";
}

// QuestCard component to display quest information
const QuestCard: React.FC<QuestCardProps> = ({
  title,
  description,
  xpAmount,
  status,
  theme,
  locked = false,
  lockedReason,
  tags = [],
  onClick,
  difficulty
}) => {
  const isCompleted = status === "completed";
  const isCurrent = status === "current";
  const isMissed = status === "missed";
  
  // Get difficulty color
  const getDifficultyColor = () => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-500";
      case "Medium":
        return "bg-yellow-500";
      case "Hard":
        return "bg-red-500";
      default:
        return "bg-blue-500";
    }
  };
  
  // Get status icon
  const getStatusIcon = () => {
    if (locked) return <Lock className="w-4 h-4 text-white/60" />;
    if (isCompleted) return <Check className="w-4 h-4 text-green-500" />;
    if (isMissed) return <X className="w-4 h-4 text-red-500" />;
    if (isCurrent) return <Clock className="w-4 h-4 text-white" />;
    return <ChevronRight className="w-4 h-4 text-white/60" />;
  };
  
  return (
    <div 
      className={`glassmorphism-card transition-all duration-300 transform-gpu relative ${
        locked ? 'opacity-60 hover:opacity-70' : 'hover:translate-y-[-2px] hover:shadow-xl'
      } ${isCurrent ? 'border-l-2 border-l-[#C084FC]' : ''}`}
      onClick={() => !locked && onClick && onClick()}
    >
      <div className="space-y-3">
        {/* Header with difficulty badge and theme */}
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className={`${getDifficultyColor()} text-white text-xs px-2 py-0.5 rounded-full`}>
                {difficulty}
              </span>
              {theme && (
                <span className="bg-white/10 text-white/80 text-xs px-2 py-0.5 rounded-full">
                  {theme}
                </span>
              )}
            </div>
            <h3 className="text-lg font-semibold text-white">{title}</h3>
          </div>
          
          {/* XP Amount */}
          <div className="flex items-center gap-1 bg-white/10 px-2 py-1 rounded-full text-white/90">
            <Star className="w-3 h-3 text-yellow-400" />
            <span className="text-sm font-medium">{xpAmount} XP</span>
          </div>
        </div>
        
        {/* Description */}
        <p className="text-sm text-white/70">{description}</p>
        
        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag, i) => (
              <span key={i} className="text-xs bg-white/5 text-white/60 px-2 py-0.5 rounded-full">
                {tag}
              </span>
            ))}
          </div>
        )}
        
        {/* Locked reason */}
        {locked && lockedReason && (
          <div className="flex items-center gap-2 text-xs text-white/60 bg-white/5 p-2 rounded-lg">
            <Lock className="w-3 h-3" />
            <span>{lockedReason}</span>
          </div>
        )}
        
        {/* Bottom action area */}
        <div className="flex justify-between items-center pt-2 border-t border-white/5 mt-2">
          <span className={`text-xs ${
            isCompleted ? "text-green-400" : 
            isMissed ? "text-red-400" : 
            isCurrent ? "text-[#C084FC]" : 
            "text-white/60"
          }`}>
            {locked ? "Locked" : 
             isCompleted ? "Completed" : 
             isMissed ? "Missed" : 
             isCurrent ? "Current" : 
             "Upcoming"}
          </span>
          
          <button 
            className={`w-6 h-6 rounded-full flex items-center justify-center ${
              locked ? "bg-black/40" : 
              isCompleted ? "bg-green-500/20" : 
              isMissed ? "bg-red-500/20" : 
              isCurrent ? "bg-[#C084FC]/20" : 
              "bg-white/10"
            }`}
            disabled={locked}
          >
            {getStatusIcon()}
          </button>
        </div>
      </div>
      
      {/* Lock overlay */}
      {locked && (
        <div className="absolute inset-0 flex items-center justify-center rounded-xl backdrop-blur-sm bg-black/20">
          <Lock className="w-6 h-6 text-white/40" />
        </div>
      )}
    </div>
  );
};

// Filter button component
const FilterButton: React.FC<{
  label: string;
  isActive: boolean;
  onClick: () => void;
}> = ({ label, isActive, onClick }) => (
  <button
    className={`px-3 py-1.5 rounded-lg text-sm transition-all duration-200 ${
      isActive 
        ? "bg-[#C084FC] text-white shadow-md" 
        : "bg-black/40 text-white/70 hover:bg-black/60"
    }`}
    onClick={onClick}
  >
    {label}
  </button>
);

// Stats card component
const StatCard: React.FC<{
  icon: React.ReactNode;
  value: string | number;
  label: string;
  accentColor?: string;
}> = ({ icon, value, label, accentColor = "bg-[#C084FC]" }) => (
  <div className="glassmorphism-card">
    <div className="flex items-center gap-3">
      <div className={`w-10 h-10 rounded-full ${accentColor} bg-opacity-10 flex items-center justify-center`}>
        {icon}
      </div>
      <div>
        <p className="text-lg font-bold text-white">{value}</p>
        <p className="text-xs text-white/60">{label}</p>
      </div>
    </div>
  </div>
);

// Main Quests component
const Quests: React.FC = () => {
  const { selectedTheme } = useApp();
  const [filter, setFilter] = useState<"all" | "current" | "upcoming" | "completed">("all");
  const [isLoading, setIsLoading] = useState(true);
  const [showQuestComplete, setShowQuestComplete] = useState(false);
  const [currentQuest, setCurrentQuest] = useState<Quest | null>(null);
  const [upcomingQuests, setUpcomingQuests] = useState<Quest[]>([]);
  const [completedQuests, setCompletedQuests] = useState<Quest[]>([]);
  
  // Sample data loading
  useEffect(() => {
    // Simulating API call
    const loadData = async () => {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Sample quests data
      const quest: Quest = {
        id: "q1",
        title: "Complete a 10-minute meditation",
        description: "Focus on your breath and clear your mind for 10 minutes.",
        xp: 100,
        difficulty: "Easy",
        status: "current",
        theme: selectedTheme || "Focus",
        tags: ["Mindfulness", "Morning"]
      };
      
      const upcoming: Quest[] = [
        {
          id: "q2",
          title: "Read for 20 minutes",
          description: "Choose a book that interests you and read for at least 20 minutes.",
          xp: 150,
          difficulty: "Medium",
          status: "upcoming",
          theme: selectedTheme || "Focus",
          tags: ["Learning", "Growth"]
        },
        {
          id: "q3",
          title: "Exercise for 30 minutes",
          description: "Complete any physical activity for 30 minutes.",
          xp: 200,
          difficulty: "Medium",
          status: "upcoming",
          theme: selectedTheme || "Discipline",
          locked: true,
          lockedReason: "Complete meditation quest first"
        },
        {
          id: "q4",
          title: "Journal your thoughts",
          description: "Write down your thoughts and reflections from the day.",
          xp: 100,
          difficulty: "Easy", 
          status: "upcoming",
          theme: selectedTheme || "Resilience"
        }
      ];
      
      const completed: Quest[] = [
        {
          id: "q5",
          title: "Drink 8 glasses of water",
          description: "Stay hydrated throughout the day.",
          xp: 50,
          difficulty: "Easy",
          status: "completed",
          theme: selectedTheme || "Discipline",
          completed: true
        },
        {
          id: "q6",
          title: "Plan your day",
          description: "Create a schedule for your day's tasks and priorities.",
          xp: 75,
          difficulty: "Easy",
          status: "completed",
          theme: selectedTheme || "Focus",
          completed: true
        }
      ];
      
      setCurrentQuest(quest);
      setUpcomingQuests(upcoming);
      setCompletedQuests(completed);
      setIsLoading(false);
    };
    
    loadData();
  }, [selectedTheme]);
  
  const handleQuestComplete = (questId: string) => {
    setShowQuestComplete(true);
  };
  
  const handleCloseQuestComplete = () => {
    setShowQuestComplete(false);
  };
  
  // Animation variants
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
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    }
  };

  return (
    <div className="min-h-screen pb-32 bg-gradient-to-b from-[#0A0A0A] to-[#121212]">
      <div className="px-5 pt-6 pb-24">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="space-y-6"
        >
          {/* Header Section */}
          <motion.div variants={itemVariants} className="mb-6">
            <h1 className="text-2xl font-bold bg-gradient-to-b from-white to-white/80 bg-clip-text text-transparent">
              Quests
            </h1>
            <p className="text-white/70 mt-1">
              Complete quests to level up and track your progress
            </p>
          </motion.div>
          
          {/* Stats Section */}
          <motion.div variants={itemVariants}>
            <div className="grid grid-cols-3 gap-3 mb-6">
              <StatCard 
                icon={<Flame className="w-5 h-5 text-orange-500" />}
                value="7"
                label="Day Streak"
                accentColor="bg-orange-500"
              />
              <StatCard 
                icon={<Award className="w-5 h-5 text-yellow-500" />}
                value="680"
                label="Total XP"
                accentColor="bg-yellow-500"
              />
              <StatCard 
                icon={<Trophy className="w-5 h-5 text-[#C084FC]" />}
                value="6"
                label="Completed"
                accentColor="bg-[#C084FC]"
              />
            </div>
          </motion.div>
          
          {/* Filter Section */}
          <motion.div variants={itemVariants} className="mb-6">
            <div className="flex space-x-2 overflow-x-auto pb-2 hide-scrollbar">
              <FilterButton 
                label="All"
                isActive={filter === "all"}
                onClick={() => setFilter("all")}
              />
              <FilterButton 
                label="Current"
                isActive={filter === "current"}
                onClick={() => setFilter("current")}
              />
              <FilterButton 
                label="Upcoming"
                isActive={filter === "upcoming"}
                onClick={() => setFilter("upcoming")}
              />
              <FilterButton 
                label="Completed"
                isActive={filter === "completed"}
                onClick={() => setFilter("completed")}
              />
            </div>
          </motion.div>
          
          {/* Quests Section */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            {isLoading ? (
              <motion.div variants={itemVariants} className="flex justify-center py-12">
                <div className="flex flex-col items-center">
                  <Loader2 className="animate-spin w-8 h-8 text-white/60 mb-4" />
                  <p className="text-white/60">Loading your quests...</p>
                </div>
              </motion.div>
            ) : (
              <>
                {filter === 'all' && currentQuest && (
                  <motion.div variants={itemVariants}>
                    <div className="mb-2 flex justify-between items-center">
                      <h2 className="text-lg font-medium">Current Quest</h2>
                      <span className="text-xs text-white/60">Today</span>
                    </div>
                    
                    <QuestCard 
                      key={currentQuest.id}
                      title={currentQuest.title}
                      description={currentQuest.description}
                      xpAmount={currentQuest.xp}
                      status={currentQuest.status}
                      theme={currentQuest.theme}
                      locked={currentQuest.locked}
                      lockedReason={currentQuest.lockedReason}
                      tags={currentQuest.tags}
                      onClick={() => handleQuestComplete(currentQuest.id)}
                      difficulty={currentQuest.difficulty}
                    />
                  </motion.div>
                )}

                {(filter === 'all' || filter === 'upcoming') && upcomingQuests.length > 0 && (
                  <motion.div variants={itemVariants} className="space-y-3">
                    <div className="mb-2 flex justify-between items-center">
                      <h2 className="text-lg font-medium">Upcoming Quests</h2>
                      <span className="text-xs text-white/60">Next 3 days</span>
                    </div>
                    
                    <div className="space-y-4">
                      {upcomingQuests.map(quest => (
                        <QuestCard 
                          key={quest.id}
                          title={quest.title}
                          description={quest.description}
                          xpAmount={quest.xp}
                          status={quest.status}
                          theme={quest.theme}
                          locked={quest.locked}
                          lockedReason={quest.lockedReason}
                          tags={quest.tags}
                          onClick={() => handleQuestComplete(quest.id)}
                          difficulty={quest.difficulty}
                        />
                      ))}
                    </div>
                  </motion.div>
                )}
                
                {(filter === 'all' || filter === 'completed') && completedQuests.length > 0 && (
                  <motion.div variants={itemVariants} className="space-y-3">
                    <div className="mb-2 flex justify-between items-center">
                      <h2 className="text-lg font-medium">Completed Quests</h2>
                      <span className="text-xs text-white/60">Previous 7 days</span>
                    </div>
                    
                    <div className="space-y-4">
                      {completedQuests.map(quest => (
                        <QuestCard 
                          key={quest.id}
                          title={quest.title}
                          description={quest.description}
                          xpAmount={quest.xp}
                          status={quest.status}
                          theme={quest.theme}
                          tags={quest.tags}
                          difficulty={quest.difficulty}
                        />
                      ))}
                    </div>
                  </motion.div>
                )}
              </>
            )}
          </motion.div>
        </motion.div>
      </div>
      
      {/* Quest Complete Modal */}
      {showQuestComplete && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="glassmorphism-card w-full max-w-md animate-pop-in">
            <div className="space-y-4 text-center">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
                <Check className="w-8 h-8 text-green-500" />
              </div>
              
              <h2 className="text-xl font-bold text-white">Quest Completed!</h2>
              <p className="text-white/70">You've earned 100 XP for completing your meditation.</p>
              
              <div className="bg-black/30 rounded-lg p-3 flex items-center justify-between">
                <span className="text-white/80">Quest rewards:</span>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-400" />
                  <span className="text-white font-medium">+100 XP</span>
                </div>
              </div>
              
              <button
                className="w-full bg-gradient-to-r from-[#C084FC] to-[#A855F7] text-white py-3 rounded-lg font-medium mt-4"
                onClick={handleCloseQuestComplete}
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Quests;
