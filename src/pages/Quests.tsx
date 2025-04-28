
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { QuestCard } from "@/components/QuestCard";
import { GlassPane, GlassButton } from "@/components/ui/glass";
import { TabNavigation } from "@/components/TabNavigation";
import { useApp } from "@/context/AppContext";
import { QuestCompleteModal } from "@/components/QuestCompleteModal";
import { Filter, CheckCircle2, CalendarDays, Target, ArrowRightLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Quest {
  id: string;
  title: string;
  description: string;
  day: number;
  theme: string;
  completed: boolean;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  xp: number;
  requires_photo: boolean;
}

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
    if (!user) return;
    
    const fetchQuests = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('quests')
          .select('*')
          .eq('user_id', user.id)
          .order('day', { ascending: true });
          
        if (error) throw error;
        
        if (data && data.length > 0) {
          // Find current quest (first incomplete quest)
          const current = data.find(quest => !quest.completed);
          if (current) setCurrentQuest(current);
          
          // Get upcoming quests (incomplete quests except current)
          const upcoming = data.filter(quest => !quest.completed && quest.id !== current?.id);
          setUpcomingQuests(upcoming);
          
          // Get completed quests
          const completed = data.filter(quest => quest.completed);
          setCompletedQuests(completed);
        }
      } catch (error) {
        console.error("Error fetching quests:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchQuests();
  }, [user]);
  
  const handleQuestClick = (quest: Quest) => {
    if (quest.completed) return;
    
    setSelectedQuest(quest);
    setShowCompletionModal(true);
  };
  
  const handleQuestComplete = async (photoUrl?: string) => {
    if (!selectedQuest || !user) return;
    
    try {
      // Update the quest in the database
      const { error } = await supabase
        .from('quests')
        .update({
          completed: true,
          completed_at: new Date().toISOString(),
          verification_status: selectedQuest.requires_photo ? 'pending' : 'not_required'
        })
        .eq('id', selectedQuest.id);
        
      if (error) throw error;
      
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
            <div className="animate-spin w-8 h-8 border-t-2 border-white rounded-full"></div>
          </motion.div>
        ) : (
          <>
            {filter === 'all' && currentQuest && (
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
            )}

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
          quest={selectedQuest}
          requiresPhoto={selectedQuest.requires_photo}
        />
      )}
      
      <TabNavigation />
    </div>
  );
};

export default Quests;
