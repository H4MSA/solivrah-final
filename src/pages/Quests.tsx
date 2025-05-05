import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { QuestCard } from "@/components/QuestCard";
import { GlassPane, GlassButton } from "@/components/ui/glass";
import { useApp } from "@/context/AppContext";
import { QuestCompleteModal } from "@/components/QuestCompleteModal";
import { Filter, CheckCircle2, CalendarDays, Target, ArrowRightLeft, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Quest, QuestDifficulty } from "@/types/quest"; 

// Sample quest data for 30 days to ensure we always have quests to display
const defaultQuests: Partial<Quest>[] = [
  {
    id: "day-1",
    title: "Day 1: Start Your Journey",
    description: "Begin your personal development journey by meditating for just 5 minutes today.",
    day: 1,
    theme: "Focus",
    xp: 50,
    difficulty: "Easy",
    requires_photo: false
  },
  {
    id: "day-2",
    title: "Day 2: Morning Ritual",
    description: "Wake up 30 minutes earlier than usual and use that time for yourself.",
    day: 2,
    theme: "Discipline",
    xp: 75,
    difficulty: "Medium",
    requires_photo: false
  },
  {
    id: "day-3",
    title: "Day 3: Hydration Challenge",
    description: "Drink 8 glasses of water throughout the day and track your intake.",
    day: 3,
    theme: "Resilience",
    xp: 60,
    difficulty: "Easy",
    requires_photo: false
  },
  {
    id: "day-4",
    title: "Day 4: Digital Detox",
    description: "Spend 4 hours completely free from all screens and digital devices.",
    day: 4,
    theme: "Focus",
    xp: 100,
    difficulty: "Hard",
    requires_photo: true
  },
  {
    id: "day-5",
    title: "Day 5: Gratitude Practice",
    description: "Write down 5 things you're grateful for in your life right now.",
    day: 5,
    theme: "Discipline",
    xp: 50,
    difficulty: "Easy",
    requires_photo: true
  },
  {
    id: "day-6",
    title: "Day 6: Physical Challenge",
    description: "Do 25 pushups, 25 squats, and a 1-minute plank. Break it into sets if needed.",
    day: 6,
    theme: "Resilience",
    xp: 80,
    difficulty: "Medium",
    requires_photo: false
  },
  {
    id: "day-7",
    title: "Day 7: Reflection Day",
    description: "Review your past week. What went well? What could improve? Set intentions for next week.",
    day: 7,
    theme: "Focus",
    xp: 70,
    difficulty: "Medium",
    requires_photo: false
  },
  {
    id: "day-8",
    title: "Day 8: Skill Building",
    description: "Spend 30 minutes learning something new related to a skill you want to develop.",
    day: 8,
    theme: "Discipline",
    xp: 75,
    difficulty: "Medium",
    requires_photo: false
  },
  {
    id: "day-9",
    title: "Day 9: Nature Connection",
    description: "Go for a 20-minute walk in nature without your phone. Notice 5 beautiful things.",
    day: 9,
    theme: "Focus",
    xp: 60,
    difficulty: "Easy",
    requires_photo: true
  },
  {
    id: "day-10",
    title: "Day 10: Mindful Eating",
    description: "Eat one meal today with no distractions. Focus completely on the taste and experience.",
    day: 10,
    theme: "Discipline",
    xp: 60,
    difficulty: "Medium",
    requires_photo: false
  },
  {
    id: "day-11",
    title: "Day 11: Courage Challenge",
    description: "Do something today that scares you a little bit. Step outside your comfort zone.",
    day: 11,
    theme: "Resilience",
    xp: 100,
    difficulty: "Hard",
    requires_photo: false
  },
  {
    id: "day-12",
    title: "Day 12: Random Act of Kindness",
    description: "Perform a generous act for someone without expecting anything in return.",
    day: 12,
    theme: "Wildcards",
    xp: 70,
    difficulty: "Easy",
    requires_photo: false
  },
  {
    id: "day-13",
    title: "Day 13: Deep Work Session",
    description: "Complete a 90-minute deep work session with no interruptions or distractions.",
    day: 13,
    theme: "Focus",
    xp: 90,
    difficulty: "Hard",
    requires_photo: false
  },
  {
    id: "day-14",
    title: "Day 14: Halfway Milestone",
    description: "Celebrate reaching the halfway point! Treat yourself to something special.",
    day: 14,
    theme: "Wildcards",
    xp: 100,
    difficulty: "Easy",
    requires_photo: true
  },
  {
    id: "day-15",
    title: "Day 15: Creative Expression",
    description: "Spend 30 minutes doing something creative - draw, write, cook, or craft something.",
    day: 15,
    theme: "Focus",
    xp: 75,
    difficulty: "Medium",
    requires_photo: true
  },
  {
    id: "day-16",
    title: "Day 16: Environment Upgrade",
    description: "Clean and organize your primary workspace or an area of your home.",
    day: 16,
    theme: "Discipline",
    xp: 80,
    difficulty: "Medium",
    requires_photo: true
  },
  {
    id: "day-17",
    title: "Day 17: Mind Expansion",
    description: "Read or listen to content that challenges your existing beliefs or perspective.",
    day: 17,
    theme: "Focus",
    xp: 70,
    difficulty: "Medium",
    requires_photo: false
  },
  {
    id: "day-18",
    title: "Day 18: Physical Endurance",
    description: "Go for a run, bike ride, or swim that pushes your current fitness level.",
    day: 18,
    theme: "Resilience",
    xp: 90,
    difficulty: "Hard",
    requires_photo: false
  },
  {
    id: "day-19",
    title: "Day 19: Digital Minimalism",
    description: "Delete 3 apps from your phone that don't add significant value to your life.",
    day: 19,
    theme: "Discipline",
    xp: 65,
    difficulty: "Medium",
    requires_photo: true
  },
  {
    id: "day-20",
    title: "Day 20: Connection Focus",
    description: "Have a meaningful conversation with someone you care about. Be fully present.",
    day: 20,
    theme: "Focus",
    xp: 60,
    difficulty: "Easy",
    requires_photo: false
  },
  {
    id: "day-21",
    title: "Day 21: Three-Week Milestone",
    description: "You've built a habit! Reflect on your progress and challenges so far.",
    day: 21,
    theme: "Wildcards",
    xp: 100,
    difficulty: "Medium",
    requires_photo: false
  },
  {
    id: "day-22",
    title: "Day 22: Mindfulness Challenge",
    description: "Practice mindfulness meditation for 15 minutes today. Notice your thoughts.",
    day: 22,
    theme: "Focus",
    xp: 75,
    difficulty: "Medium",
    requires_photo: false
  },
  {
    id: "day-23",
    title: "Day 23: Knowledge Expansion",
    description: "Learn about a topic completely outside your usual areas of interest.",
    day: 23,
    theme: "Discipline",
    xp: 70,
    difficulty: "Medium",
    requires_photo: false
  },
  {
    id: "day-24",
    title: "Day 24: Financial Check-In",
    description: "Review your spending for the past week. Identify one area to improve.",
    day: 24,
    theme: "Discipline",
    xp: 70,
    difficulty: "Medium",
    requires_photo: false
  },
  {
    id: "day-25",
    title: "Day 25: Skill Mastery",
    description: "Practice a skill you're developing for at least 1 hour today.",
    day: 25,
    theme: "Resilience",
    xp: 85,
    difficulty: "Hard",
    requires_photo: false
  },
  {
    id: "day-26",
    title: "Day 26: Compassion Practice",
    description: "Practice self-compassion today. Treat yourself with the kindness you'd show a friend.",
    day: 26,
    theme: "Focus",
    xp: 60,
    difficulty: "Easy",
    requires_photo: false
  },
  {
    id: "day-27",
    title: "Day 27: Physical Reset",
    description: "Get at least 8 hours of sleep tonight. Prepare by establishing a wind-down routine.",
    day: 27,
    theme: "Discipline",
    xp: 70,
    difficulty: "Medium",
    requires_photo: false
  },
  {
    id: "day-28",
    title: "Day 28: Challenge Your Limits",
    description: "Do something physically challenging that tests your endurance or strength.",
    day: 28,
    theme: "Resilience",
    xp: 95,
    difficulty: "Hard",
    requires_photo: true
  },
  {
    id: "day-29",
    title: "Day 29: Goal Setting",
    description: "Set 3 specific goals for the next month based on what you've learned about yourself.",
    day: 29,
    theme: "Focus",
    xp: 80,
    difficulty: "Medium",
    requires_photo: false
  },
  {
    id: "day-30",
    title: "Day 30: Celebration & Reflection",
    description: "Congratulations! Celebrate completing 30 days and reflect on your transformation.",
    day: 30,
    theme: "Wildcards",
    xp: 150,
    difficulty: "Easy",
    requires_photo: true
  }
];

const Quests = () => {
  const [currentQuest, setCurrentQuest] = useState<Quest | null>(null);
  const [upcomingQuests, setUpcomingQuests] = useState<Quest[]>([]);
  const [completedQuests, setCompletedQuests] = useState<Quest[]>([]);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [selectedQuest, setSelectedQuest] = useState<Quest | null>(null);
  const [filter, setFilter] = useState<'all' | 'current' | 'upcoming' | 'completed'>('all');
  const [isLoading, setIsLoading] = useState(true);
  const { user, addXP, incrementStreak } = useApp();
  
  useEffect(() => {
    let isMounted = true;
    
    const fetchQuests = async () => {
      setIsLoading(true);
      try {
        // If user is authenticated, try to fetch from Supabase first
        if (user) {
          const { data, error } = await supabase
            .from('quests')
            .select('*')
            .eq('user_id', user.id)
            .order('day', { ascending: true });
            
          if (error) throw error;
          
          // If user has quests in Supabase, use those
          if (data && data.length > 0) {
            // Make sure each quest has the correct difficulty type
            const typedData = data.map(q => ({
              ...q,
              difficulty: (q.difficulty as QuestDifficulty) || 'Medium'
            }));
            processQuestsData(typedData as Quest[]);
            return;
          }
        }
        
        // If there are no quests in Supabase or user is not authenticated,
        // use the default quests with a slight delay to simulate loading
        setTimeout(() => {
          if (isMounted) {
            const filledQuests = defaultQuests.map(q => ({
              id: q.id || `default-${q.day}`,
              title: q.title || "Unnamed Quest",
              description: q.description || "",
              day: q.day || 1,
              theme: q.theme || "Focus",
              xp: q.xp || 50,
              difficulty: (q.difficulty || "Medium") as QuestDifficulty,
              completed: false,
              requires_photo: q.requires_photo || false,
              user_id: user?.id || "anonymous",
              created_at: new Date().toISOString(),
              verification_status: "not_required"
            }));
            
            processQuestsData(filledQuests as Quest[]);
          }
        }, 800); // Artificial delay for loading simulation
      } catch (error) {
        console.error("Error fetching quests:", error);
        // Fall back to default quests in case of error
        if (isMounted) {
          const filledQuests = defaultQuests.map(q => ({
            id: q.id || `default-${q.day}`,
            title: q.title || "Unnamed Quest",
            description: q.description || "",
            day: q.day || 1,
            theme: q.theme || "Focus",
            xp: q.xp || 50,
            difficulty: (q.difficulty || "Medium") as QuestDifficulty,
            completed: false,
            requires_photo: q.requires_photo || false,
            user_id: user?.id || "anonymous",
            created_at: new Date().toISOString(),
            verification_status: "not_required"
          }));
          
          processQuestsData(filledQuests as Quest[]);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };
    
    fetchQuests();
    
    return () => {
      isMounted = false;
    };
  }, [user]);
  
  const processQuestsData = (data: Quest[]) => {
    // Find current quest (first incomplete quest)
    const current = data.find(quest => !quest.completed);
    if (current) {
      setCurrentQuest(current);
    }
    
    // Get upcoming quests (incomplete quests except current)
    const upcoming = data
      .filter(quest => !quest.completed && quest.id !== current?.id);
    setUpcomingQuests(upcoming);
    
    // Get completed quests
    const completed = data
      .filter(quest => quest.completed);
    setCompletedQuests(completed);
  };
  
  const handleQuestClick = (quest: Quest) => {
    if (quest.completed) return;
    
    setSelectedQuest(quest);
    setShowCompletionModal(true);
  };
  
  const handleQuestComplete = async (photoUrl?: string) => {
    if (!selectedQuest) return;
    
    try {
      if (user) {
        // Update the quest in the database if user is authenticated
        const { error } = await supabase
          .from('quests')
          .update({
            completed: true,
            completed_at: new Date().toISOString(),
            verification_status: selectedQuest.requires_photo ? 'pending' : 'not_required'
          })
          .eq('id', selectedQuest.id);
          
        if (error) throw error;
      }
      
      // Add XP to the user
      addXP(selectedQuest.xp);
      
      // Increment streak
      incrementStreak();
      
      // Update local state
      if (selectedQuest.id === currentQuest?.id) {
        // Move current to completed
        setCompletedQuests([{ ...selectedQuest, completed: true }, ...completedQuests]);
        setCurrentQuest(upcomingQuests.length > 0 ? upcomingQuests[0] : null);
        setUpcomingQuests(upcomingQuests.slice(1));
      } else {
        // Move from upcoming to completed
        setCompletedQuests([{ ...selectedQuest, completed: true }, ...completedQuests]);
        setUpcomingQuests(upcomingQuests.filter(q => q.id !== selectedQuest.id));
      }
      
      // Close the modal
      setShowCompletionModal(false);
      setSelectedQuest(null);
      
    } catch (error) {
      console.error("Error completing quest:", error);
    }
  };
  
  const getFilteredQuests = () => {
    switch (filter) {
      case 'current':
        return currentQuest ? [currentQuest] : [];
      case 'upcoming':
        return upcomingQuests;
      case 'completed':
        return completedQuests;
      default:
        return [
          ...(currentQuest ? [currentQuest] : []), 
          ...upcomingQuests,
          ...completedQuests
        ];
    }
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
    <div className="min-h-screen pb-24 pt-6 px-4 text-white">
      <motion.div
        className="space-y-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold">Quests</h1>
            <p className="text-sm text-white/70">Complete quests to earn XP and build habits</p>
          </div>
          
          <GlassPane variant="frost" className="p-1 rounded-lg">
            <div className="flex space-x-1">
              <GlassButton 
                variant={filter === 'all' ? "primary" : "secondary"} 
                size="sm"
                onClick={() => setFilter('all')}
                className="px-3 py-1 text-xs h-8"
              >
                All
              </GlassButton>
              
              <GlassButton 
                variant={filter === 'current' ? "primary" : "secondary"} 
                size="sm"
                onClick={() => setFilter('current')}
                className="px-3 py-1 text-xs h-8"
              >
                <Target size={14} className="mr-1" />
                Current
              </GlassButton>
              
              <GlassButton 
                variant={filter === 'upcoming' ? "primary" : "secondary"} 
                size="sm"
                onClick={() => setFilter('upcoming')}
                className="px-3 py-1 text-xs h-8"
              >
                <CalendarDays size={14} className="mr-1" />
                Upcoming
              </GlassButton>
              
              <GlassButton 
                variant={filter === 'completed' ? "primary" : "secondary"} 
                size="sm"
                onClick={() => setFilter('completed')}
                className="px-3 py-1 text-xs h-8"
              >
                <CheckCircle2 size={14} className="mr-1" />
                Done
              </GlassButton>
            </div>
          </GlassPane>
        </motion.div>
        
        {isLoading ? (
          
          <motion.div variants={itemVariants} className="flex justify-center py-12">
            <div className="flex flex-col items-center">
              <Loader2 className="animate-spin w-8 h-8 text-white/60 mb-4" />
              <p className="text-white/60">Loading your quest journey...</p>
            </div>
          </motion.div>
        ) : (
          <>
            {
 filter === 'all' && currentQuest && (
              <motion.div variants={itemVariants}>
                <div className="mb-2 flex justify-between items-center">
                  <h2 className="text-lg font-medium">Current Quest</h2>
                  <span className="text-xs text-white/60 bg-white/5 px-2.5 py-1 rounded-full border border-white/5">
                    Active
                  </span>
                </div>
                <QuestCard 
                  key={currentQuest.id}
                  title={currentQuest.title}
                  description={currentQuest.description}
                  current={true}
                  onClick={() => handleQuestClick(currentQuest)}
                  day={currentQuest.day}
                  theme={currentQuest.theme}
                  xp={currentQuest.xp}
                  difficulty={currentQuest.difficulty as 'Easy' | 'Medium' | 'Hard'}
                />
              </motion.div>
            )
}

            {(filter === 'all' || filter === 'upcoming') && upcomingQuests.length > 0 && (
              <motion.div variants={itemVariants} className="space-y-3">
                <div className="mb-2 flex justify-between items-center">
                  <h2 className="text-lg font-medium">Upcoming Quests</h2>
                  <span className="text-xs text-white/60 bg-white/5 px-2.5 py-1 rounded-full border border-white/5">
                    {upcomingQuests.length} remaining
                  </span>
                </div>
                <div className="space-y-4">
                  {upcomingQuests.map((quest) => (
                    <QuestCard 
                      key={quest.id}
                      title={quest.title}
                      description={quest.description}
                      locked={filter !== 'upcoming'}
                      onClick={() => handleQuestClick(quest)}
                      day={quest.day}
                      theme={quest.theme}
                      xp={quest.xp}
                      difficulty={quest.difficulty as 'Easy' | 'Medium' | 'Hard'}
                    />
                  ))}
                </div>
              </motion.div>
            )}
            
            {(filter === 'all' || filter === 'completed') && completedQuests.length > 0 && (
              <motion.div variants={itemVariants} className="space-y-3">
                <div className="mb-2 flex justify-between items-center">
                  <h2 className="text-lg font-medium">Completed Quests</h2>
                  <span className="text-xs text-white/60 bg-white/5 px-2.5 py-1 rounded-full border border-white/5">
                    {completedQuests.length} completed
                  </span>
                </div>
                <div className="space-y-4">
                  {completedQuests.map((quest) => (
                    <QuestCard 
                      key={quest.id}
                      title={quest.title}
                      description={quest.description}
                      completed={true}
                      onClick={() => {}}
                      day={quest.day}
                      theme={quest.theme}
                      xp={quest.xp}
                      difficulty={quest.difficulty as 'Easy' | 'Medium' | 'Hard'}
                    />
                  ))}
                </div>
              </motion.div>
            )}

            {getFilteredQuests().length === 0 && (
              <motion.div 
                variants={itemVariants}
                className="flex flex-col items-center justify-center h-64 text-center"
              >
                <ArrowRightLeft size={48} className="text-white/30 mb-4" />
                <h3 className="text-xl font-medium mb-2">No quests found</h3>
                <p className="text-white/60 max-w-xs">
                  {filter === 'current' ? "You don't have any current quests." : 
                   filter === 'upcoming' ? "You don't have any upcoming quests." : 
                   filter === 'completed' ? "You haven't completed any quests yet." : 
                   "You don't have any quests. Start your journey!"}
                </p>
                <GlassButton 
                  variant="secondary"
                  className="mt-6"
                  onClick={() => setFilter('all')}
                >
                  View All Quests
                </GlassButton>
              </motion.div>
            )}
          </>
        )}
      </motion.div>
      
      {showCompletionModal && selectedQuest && (
        <QuestCompleteModal 
          onClose={() => {
            setShowCompletionModal(false);
            setSelectedQuest(null);
          }}
          onComplete={handleQuestComplete}
          questId={selectedQuest.id}
          requiresPhoto={selectedQuest.requires_photo}
        />
      )}
      
    </div>
  );
};

export default Quests;
