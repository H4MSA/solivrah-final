import React, { useState } from "react";
import { motion } from "framer-motion";
import { useAppSound } from "@/context/SoundContext";
import { HeaderSection } from "@/components/composite/HeaderSection";
import { DailyAffirmation } from "@/components/composite/DailyAffirmation";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Sparkles, TrendingUp, Award, ChevronRight, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Sample quest data
const SAMPLE_QUESTS = [
  {
    id: "1",
    title: "Morning Meditation",
    description: "Start your day with 5 minutes of mindful breathing",
    category: "mindfulness",
    progress: 0.7,
    dueDate: "Today",
    isNew: false,
  },
  {
    id: "2",
    title: "Gratitude Journal",
    description: "Write down 3 things you're grateful for today",
    category: "wellbeing",
    progress: 0.3,
    dueDate: "Today",
    isNew: true,
  },
  {
    id: "3",
    title: "Hydration Check",
    description: "Drink 8 glasses of water throughout the day",
    category: "health",
    progress: 0.5,
    dueDate: "Today",
    isNew: false,
  },
];

// Sample mood options
const MOOD_OPTIONS = [
  { emoji: "😊", label: "Happy", value: "happy" },
  { emoji: "😌", label: "Calm", value: "calm" },
  { emoji: "😐", label: "Neutral", value: "neutral" },
  { emoji: "😔", label: "Sad", value: "sad" },
  { emoji: "😤", label: "Stressed", value: "stressed" },
];

export function HomePage() {
  const { playWithHaptics } = useAppSound();
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  
  // Handle mood selection
  const handleMoodSelect = (mood: string) => {
    playWithHaptics("button-tap");
    setSelectedMood(mood);
  };
  
  // Handle quest click
  const handleQuestClick = (questId: string) => {
    playWithHaptics("button-tap");
    console.log("Quest clicked:", questId);
    // Navigate to quest details or start quest
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <HeaderSection 
        title="Home" 
        showSearch={true}
      />
      
      <div className="flex-1 px-4 py-4 space-y-6 overflow-y-auto pb-safe">
        {/* Welcome message */}
        <div className="mb-2">
          <h1 className="text-2xl font-bold">Good Morning, Alex</h1>
          <p className="text-muted-foreground">Let's make today amazing!</p>
        </div>
        
        {/* Daily Affirmation */}
        <DailyAffirmation />
        
        {/* Mood Tracker */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">How are you feeling?</h2>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs text-muted-foreground"
              onClick={() => playWithHaptics("button-tap")}
            >
              View History
            </Button>
          </div>
          
          <div className="flex justify-between">
            {MOOD_OPTIONS.map((mood) => (
              <motion.button
                key={mood.value}
                className={`flex flex-col items-center gap-1 p-2 rounded-lg ${selectedMood === mood.value ? 'bg-primary/10' : ''}`}
                onClick={() => handleMoodSelect(mood.value)}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  className="text-3xl"
                  animate={selectedMood === mood.value ? {
                    scale: [1, 1.2, 1],
                    rotate: [0, 10, -10, 0],
                  } : {}}
                  transition={{ duration: 0.5 }}
                >
                  {mood.emoji}
                </motion.div>
                <span className="text-xs text-muted-foreground">{mood.label}</span>
              </motion.button>
            ))}
          </div>
        </section>
        
        {/* Today's Quests */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Today's Quests</h2>
            <Button 
              variant="ghost" 
              size="sm" 
              className="flex items-center gap-1 text-xs"
              onClick={() => playWithHaptics("button-tap")}
            >
              View All
              <ChevronRight size={14} />
            </Button>
          </div>
          
          <div className="space-y-3">
            {SAMPLE_QUESTS.map((quest) => (
              <GlassCard
                key={quest.id}
                className="p-4"
                tilt="subtle"
                interactive={true}
                onClick={() => handleQuestClick(quest.id)}
              >
                <div className="flex items-start gap-3">
                  <div className="bg-primary/10 p-2 rounded-full">
                    {quest.category === "mindfulness" && <Sparkles size={20} className="text-primary" />}
                    {quest.category === "wellbeing" && <TrendingUp size={20} className="text-primary" />}
                    {quest.category === "health" && <Award size={20} className="text-primary" />}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">{quest.title}</h3>
                      {quest.isNew && (
                        <Badge variant="default" className="text-xs">New</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{quest.description}</p>
                    
                    <div className="mt-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-muted-foreground">Progress</span>
                        <span className="text-xs">{Math.round(quest.progress * 100)}%</span>
                      </div>
                      <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary rounded-full"
                          style={{ width: `${quest.progress * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </GlassCard>
            ))}
            
            <Button 
              variant="outline" 
              className="w-full flex items-center justify-center gap-2 border-dashed"
              onClick={() => playWithHaptics("button-tap")}
            >
              <Plus size={16} />
              <span>Add Custom Quest</span>
            </Button>
          </div>
        </section>
        
        {/* Quick Stats */}
        <section>
          <h2 className="text-lg font-semibold mb-4">Your Progress</h2>
          
          <div className="grid grid-cols-2 gap-3">
            <GlassCard className="p-4">
              <h3 className="text-sm text-muted-foreground mb-1">Streak</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold">7</span>
                <span className="text-xs text-muted-foreground">days</span>
              </div>
            </GlassCard>
            
            <GlassCard className="p-4">
              <h3 className="text-sm text-muted-foreground mb-1">Quests Completed</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold">42</span>
                <span className="text-xs text-muted-foreground">total</span>
              </div>
            </GlassCard>
            
            <GlassCard className="p-4">
              <h3 className="text-sm text-muted-foreground mb-1">Weekly Goal</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold">5/7</span>
                <span className="text-xs text-muted-foreground">days</span>
              </div>
            </GlassCard>
            
            <GlassCard className="p-4">
              <h3 className="text-sm text-muted-foreground mb-1">Points</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold">350</span>
                <span className="text-xs text-muted-foreground">pts</span>
              </div>
            </GlassCard>
          </div>
        </section>
      </div>
    </div>
  );
} 