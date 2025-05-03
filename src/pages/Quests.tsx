
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Check, X, Clock, ChevronRight, Loader2, Star, Lock, Trophy, Flame, Award } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { CardGlass, CardGlassTitle, CardGlassDescription, CardGlassContent } from "@/components/ui/card-glass";
import { ButtonGlass } from "@/components/ui/button-glass";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

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
    <CardGlass 
      className="mb-4 overflow-hidden"
      interactive={!locked}
      variant={isCurrent ? "accent" : "secondary"}
      onClick={() => !locked && onClick && onClick()}
    >
      <div className="space-y-3 p-1">
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
          
          <div 
            className={`w-6 h-6 rounded-full flex items-center justify-center ${
              locked ? "bg-black/40" : 
              isCompleted ? "bg-green-500/20" : 
              isMissed ? "bg-red-500/20" : 
              isCurrent ? "bg-[#C084FC]/20" : 
              "bg-white/10"
            }`}
          >
            {getStatusIcon()}
          </div>
        </div>
      </div>
      
      {/* Lock overlay */}
      {locked && (
        <div className="absolute inset-0 flex items-center justify-center rounded-xl backdrop-blur-sm bg-black/20">
          <Lock className="w-6 h-6 text-white/40" />
        </div>
      )}
    </CardGlass>
  );
};

// Filter button component
const FilterButton: React.FC<{
  label: string;
  isActive: boolean;
  onClick: () => void;
}> = ({ label, isActive, onClick }) => (
  <ButtonGlass
    variant={isActive ? "primary" : "secondary"}
    size="sm"
    onClick={onClick}
    className={isActive ? "" : "opacity-70"}
  >
    {label}
  </ButtonGlass>
);

// Stats card component
const StatCard: React.FC<{
  icon: React.ReactNode;
  value: string | number;
  label: string;
}> = ({ icon, value, label }) => (
  <CardGlass variant="secondary" className="p-4">
    <div className="flex flex-col items-center justify-center text-center">
      <div className="w-12 h-12 rounded-full bg-black/40 border border-white/10 flex items-center justify-center mb-2">
        {icon}
      </div>
      <p className="text-xl font-bold">{value}</p>
      <p className="text-xs text-white/70">{label}</p>
    </div>
  </CardGlass>
);

const Quests = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { selectedTheme, addXP } = useApp();
  const [activeFilter, setActiveFilter] = useState<"all" | "current" | "completed" | "upcoming">("all");
  const [isLoading, setIsLoading] = useState(true);
  const [quests, setQuests] = useState<Quest[]>([]);
  
  // Mock quest data - in a real app, this would come from an API or database
  useEffect(() => {
    // Simulate API loading delay
    const timer = setTimeout(() => {
      const mockQuests: Quest[] = [
        {
          id: "1",
          title: "Track your time for 24 hours",
          description: "Document how you spend your day to identify time-wasting activities and opportunities for improvement.",
          xp: 150,
          difficulty: "Medium",
          status: "current",
          theme: selectedTheme || "Focus",
          tags: ["Time Management", "Self-awareness"]
        },
        {
          id: "2",
          title: "Complete a focused work session",
          description: "Work for 45 minutes with no distractions, then take a 15-minute break.",
          xp: 100,
          difficulty: "Easy",
          status: "completed",
          theme: selectedTheme || "Focus",
          completed: true,
          tags: ["Deep Work", "Productivity"]
        },
        {
          id: "3",
          title: "Morning Routine Builder",
          description: "Establish a productive morning routine to set the tone for your day.",
          xp: 200,
          difficulty: "Hard",
          status: "upcoming",
          locked: true,
          lockedReason: "Complete current quest first",
          theme: selectedTheme || "Discipline",
          tags: ["Routine", "Morning"]
        },
        {
          id: "4",
          title: "Digital Detox Challenge",
          description: "Spend 4 hours without checking your phone or social media.",
          xp: 180,
          difficulty: "Medium",
          status: "upcoming",
          theme: selectedTheme || "Focus",
          tags: ["Digital Wellbeing", "Focus"]
        },
        {
          id: "5",
          title: "Reflection Journal",
          description: "Write a reflection on your progress and insights gained so far.",
          xp: 120,
          difficulty: "Easy",
          status: "missed",
          theme: selectedTheme || "Resilience",
          tags: ["Reflection", "Mindfulness"]
        },
      ];
      
      setQuests(mockQuests);
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [selectedTheme]);
  
  // Filter quests based on active filter
  const filteredQuests = quests.filter(quest => {
    if (activeFilter === "all") return true;
    return quest.status === activeFilter;
  });
  
  const handleQuestClick = (quest: Quest) => {
    if (quest.status === "current") {
      navigate(`/quests/${quest.id}`);
    } else if (quest.status === "completed") {
      toast({
        title: "Quest already completed",
        description: "You've already completed this quest!",
      });
    } else if (quest.status === "upcoming" && !quest.locked) {
      toast({
        title: "Quest not yet available",
        description: "This quest will be available soon.",
      });
    }
  };
  
  const markCurrentQuestAsComplete = () => {
    // Find the current quest
    const currentQuest = quests.find(q => q.status === "current");
    if (!currentQuest) return;
    
    // Update the quests
    setQuests(quests.map(q => 
      q.id === currentQuest.id ? {...q, status: "completed", completed: true} : q
    ));
    
    // Add XP
    addXP(currentQuest.xp);
    
    // Show success message
    toast({
      title: "Quest Completed!",
      description: `You've earned ${currentQuest.xp} XP.`,
    });
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
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    }
  };

  return (
    <div className="min-h-screen pb-24">
      <div className="px-5 pt-6">
        <motion.div
          className="flex justify-between items-center mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-2xl font-bold bg-gradient-to-b from-white to-white/80 bg-clip-text text-transparent">Quests</h1>
          
          <ButtonGlass
            variant="secondary"
            size="sm"
            className="w-10 h-10 p-0 rounded-full flex items-center justify-center"
          >
            <Trophy size={18} />
          </ButtonGlass>
        </motion.div>
        
        {/* Stats Section */}
        <motion.div 
          className="grid grid-cols-3 gap-3 mb-6" 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants}>
            <StatCard 
              icon={<Trophy size={20} className="text-soft-lime" />}
              value={2}
              label="Completed"
            />
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <StatCard 
              icon={<Flame size={20} className="text-soft-purple" />}
              value={7}
              label="Day Streak"
            />
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <StatCard 
              icon={<Award size={20} className="text-amber-400" />}
              value={450}
              label="XP Earned"
            />
          </motion.div>
        </motion.div>
        
        {/* Filters Section */}
        <motion.div 
          className="flex space-x-2 mb-6 overflow-x-auto pb-2"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants}>
            <FilterButton 
              label="All"
              isActive={activeFilter === "all"}
              onClick={() => setActiveFilter("all")}
            />
          </motion.div>
          <motion.div variants={itemVariants}>
            <FilterButton 
              label="Current"
              isActive={activeFilter === "current"}
              onClick={() => setActiveFilter("current")}
            />
          </motion.div>
          <motion.div variants={itemVariants}>
            <FilterButton 
              label="Completed"
              isActive={activeFilter === "completed"}
              onClick={() => setActiveFilter("completed")}
            />
          </motion.div>
          <motion.div variants={itemVariants}>
            <FilterButton 
              label="Upcoming"
              isActive={activeFilter === "upcoming"}
              onClick={() => setActiveFilter("upcoming")}
            />
          </motion.div>
        </motion.div>
        
        {/* Current Quest with Complete Button */}
        {filteredQuests.some(q => q.status === "current") && activeFilter !== "completed" && (
          <motion.div 
            className="mb-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants}>
              <CardGlass 
                className="mb-4 p-4" 
                variant="accent" 
                withGlow
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-neon-green to-soft-lime flex items-center justify-center flex-shrink-0">
                    <Trophy size={24} className="text-black" />
                  </div>
                  <div>
                    <CardGlassTitle className="mb-1">Current Quest</CardGlassTitle>
                    <CardGlassDescription className="mb-3">
                      Complete your active quest to unlock the next challenge.
                    </CardGlassDescription>
                    <ButtonGlass 
                      variant="primary" 
                      size="sm"
                      onClick={markCurrentQuestAsComplete}
                    >
                      Mark as Complete
                    </ButtonGlass>
                  </div>
                </div>
              </CardGlass>
            </motion.div>
          </motion.div>
        )}
        
        {/* Quests List */}
        <motion.div
          className="pb-20"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="animate-spin text-white/50 mb-3" size={32} />
              <p className="text-white/70">Loading quests...</p>
            </div>
          ) : filteredQuests.length > 0 ? (
            filteredQuests.map((quest, index) => (
              <motion.div key={quest.id} variants={itemVariants}>
                <QuestCard 
                  title={quest.title}
                  description={quest.description}
                  xpAmount={quest.xp}
                  status={quest.status}
                  theme={quest.theme}
                  locked={quest.locked}
                  lockedReason={quest.lockedReason}
                  tags={quest.tags}
                  difficulty={quest.difficulty}
                  onClick={() => handleQuestClick(quest)}
                />
              </motion.div>
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-white/70">No quests found in this category.</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Quests;
