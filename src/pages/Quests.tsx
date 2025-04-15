
import React, { useState } from "react";
import { GlassCard } from "@/components/GlassCard";
import { TabNavigation } from "@/components/TabNavigation";
import { FiCheck, FiLock } from "react-icons/fi";
import { QuestCompleteModal } from "@/components/QuestCompleteModal";
import { useApp } from "@/context/AppContext";

const Quests = () => {
  const { addXP, incrementStreak } = useApp();
  const [activeQuest, setActiveQuest] = useState(null);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  
  // Sample quest data
  const [quests, setQuests] = useState([
    { 
      id: 1,
      day: 1, 
      title: "Track Time", 
      description: "Track your time for 24 hours.", 
      status: "completed",
      xp: 50,
      requiresPhoto: false
    },
    { 
      id: 2,
      day: 2, 
      title: "Identify Distractions", 
      description: "List your top 3 daily distractions.", 
      status: "active",
      xp: 75,
      requiresPhoto: false
    },
    { 
      id: 3,
      day: 3, 
      title: "Dopamine Detox", 
      description: "Avoid social media for 3 hours.", 
      status: "locked",
      xp: 100,
      requiresPhoto: true
    },
    { 
      id: 4,
      day: 4, 
      title: "Focus Session", 
      description: "Complete a 25-minute focused work session.", 
      status: "locked",
      xp: 125,
      requiresPhoto: true
    }
  ]);
  
  const handleOpenCompleteModal = (quest) => {
    setActiveQuest(quest);
    setShowCompleteModal(true);
  };
  
  const handleCompleteQuest = (photoUrl) => {
    if (!activeQuest) return;
    
    // Update quest status
    setQuests(quests.map(q => {
      if (q.id === activeQuest.id) {
        return { ...q, status: "completed" };
      }
      
      // Unlock next quest if it's locked
      if (q.day === activeQuest.day + 1 && q.status === "locked") {
        return { ...q, status: "active" };
      }
      
      return q;
    }));
    
    // Add XP and increment streak
    addXP(activeQuest.xp);
    incrementStreak();
    
    // Close modal
    setShowCompleteModal(false);
    setActiveQuest(null);
  };
  
  return (
    <div className="min-h-screen pb-20">
      <div className="p-6 space-y-4">
        <h1 className="text-xl font-medium">Your Quests</h1>
        
        <div className="space-y-4">
          {quests.map((quest, index) => (
            <GlassCard key={index} className="relative">
              <div className="absolute top-4 right-4">
                {quest.status === "completed" ? (
                  <div className="bg-primary rounded-full p-1">
                    <FiCheck className="text-background" />
                  </div>
                ) : quest.status === "locked" ? (
                  <FiLock className="text-muted" />
                ) : null}
              </div>
              
              <h2 className="text-lg font-medium">Day {quest.day}: {quest.title}</h2>
              <p className="text-muted text-sm mt-1">{quest.description}</p>
              
              {quest.status === "active" && (
                <button className="btn-primary w-full mt-4">
                  Complete Quest
                </button>
              )}
              
              {quest.status === "locked" && (
                <div className="mt-4 text-sm text-muted italic">
                  Complete previous quests to unlock
                </div>
              )}
            </GlassCard>
          ))}
        </div>
      </div>
      
      {showCompleteModal && activeQuest && (
        <QuestCompleteModal
          questTitle={activeQuest.title}
          xpEarned={activeQuest.xp}
          requiresPhoto={activeQuest.requiresPhoto}
          onClose={() => setShowCompleteModal(false)}
          onComplete={handleCompleteQuest}
        />
      )}
      
      <TabNavigation />
    </div>
  );
};

export default Quests;
