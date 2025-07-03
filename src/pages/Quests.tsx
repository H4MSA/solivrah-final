import React, { useState, useEffect } from "react";
import { GlassCard } from "@/components/GlassCard";
import { FiCheck, FiLock, FiChevronDown, FiChevronUp } from "react-icons/fi";
import { QuestCompleteModal } from "@/components/QuestCompleteModal";
import { useApp } from "@/context/AppContext";
import { supabase } from "@/integrations/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Brain, Heart, Trophy, Focus } from "lucide-react";
import { ThemeBackground } from "@/components/ThemeBackground";
import QuestCard from "@/components/ui/QuestCard";

interface Quest {
  id: number;
  day: number;
  title: string;
  description: string;
  status: "completed" | "active" | "locked";
  xp: number;
  requiresPhoto: boolean;
  theme: string;
}

const Quests = () => {
  const { addXP, incrementStreak, selectedTheme } = useApp();
  const [activeQuest, setActiveQuest] = useState<Quest | null>(null);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [quests, setQuests] = useState<Quest[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAllQuests, setShowAllQuests] = useState(false);
  const disciplineQuests = [
    { day: 1, title: "Track Time", description: "Track your time for 24 hours using a time-tracking app.", requiresPhoto: false, xp: 50 },
    { day: 2, title: "Block Distractions", description: "Block 1 distracting app (e.g., Instagram) for 3 hours.", requiresPhoto: true, xp: 75 },
    { day: 3, title: "Visible Goal", description: "Write your #1 goal on paper and place it somewhere visible.", requiresPhoto: true, xp: 60 },
    { day: 4, title: "2-Minute Rule", description: "Do any small task immediately.", requiresPhoto: false, xp: 40 },
    { day: 5, title: "Plan Tomorrow", description: "Schedule your tasks for tomorrow tonight.", requiresPhoto: true, xp: 60 },
    { day: 6, title: "Morning Stretch", description: "Do 10 minutes of morning stretching to start your day.", requiresPhoto: true, xp: 65 },
    { day: 7, title: "Weekly Review", description: "Review progress and reward yourself (e.g., a treat or walk).", requiresPhoto: false, xp: 80 },
    { day: 8, title: "Say No", description: "Practice saying 'no' to non-essential requests.", requiresPhoto: false, xp: 70 },
    { day: 9, title: "Eat That Frog", description: "Use the 'Eat That Frog' method: Do your hardest task first.", requiresPhoto: false, xp: 90 },
    { day: 10, title: "Failure Resume", description: "Write a failure resume listing past setbacks and lessons.", requiresPhoto: true, xp: 100 },
    { day: 11, title: "Track Metrics", description: "Track 3 productivity metrics (tasks done, time wasted, energy levels).", requiresPhoto: true, xp: 85 },
    { day: 12, title: "Declutter", description: "Declutter your workspace (physical or digital).", requiresPhoto: true, xp: 80 },
    { day: 13, title: "Pomodoro", description: "Complete a 50-minute work sprint (Pomodoro Technique).", requiresPhoto: false, xp: 70 },
    { day: 14, title: "Distraction Tally", description: "Use a 'distraction tally' to log interruptions.", requiresPhoto: true, xp: 65 },
    { day: 15, title: "Share Win", description: "Share 1 win in the Community Hub.", requiresPhoto: false, xp: 60 },
    { day: 16, title: "Replace Habit", description: "Replace 1 bad habit with a positive ritual (e.g., scrolling → reading).", requiresPhoto: false, xp: 85 },
    { day: 17, title: "5-Second Rule", description: "Use the '5-Second Rule' to act on tasks instantly.", requiresPhoto: false, xp: 70 },
    { day: 18, title: "Mindfulness", description: "Practice 5 minutes of mindfulness to reset focus.", requiresPhoto: false, xp: 65 },
    { day: 19, title: "No Screens", description: "Schedule 1 'no-screen' hour daily.", requiresPhoto: true, xp: 90 },
    { day: 20, title: "Stop Doing List", description: "Create a 'stop doing' list of non-essential tasks.", requiresPhoto: true, xp: 75 },
    { day: 21, title: "Habit Stacking", description: "Use habit stacking: Attach a new habit to an existing one.", requiresPhoto: false, xp: 80 },
    { day: 22, title: "Sleep Tracking", description: "Track sleep hours and adjust bedtime routine.", requiresPhoto: true, xp: 75 },
    { day: 23, title: "Automation", description: "Use automation tools (e.g., IFTTT) to simplify tasks.", requiresPhoto: true, xp: 85 },
    { day: 24, title: "Future Letter", description: "Write a letter to your future self outlining goals.", requiresPhoto: true, xp: 80 },
    { day: 25, title: "Gratitude", description: "Practice gratitude: List 3 things you're thankful for.", requiresPhoto: true, xp: 70 },
    { day: 26, title: "Deep Work", description: "Complete a 90-minute focused work block.", requiresPhoto: false, xp: 100 },
    { day: 27, title: "Digital Declutter", description: "Declutter digital files (delete unused apps/files).", requiresPhoto: true, xp: 85 },
    { day: 28, title: "Monthly Lessons", description: "Reflect on 3 lessons learned this month.", requiresPhoto: true, xp: 90 },
    { day: 29, title: "Future Goals", description: "Plan next month's top 3 goals.", requiresPhoto: true, xp: 95 },
    { day: 30, title: "Celebrate", description: "Celebrate your progress and share results in the Community Hub.", requiresPhoto: true, xp: 120 }
  ];
  
  const focusQuests = [
    { day: 1, title: "Identify Distractions", description: "Identify your top 3 distractions (e.g., notifications, multitasking).", requiresPhoto: false, xp: 50 },
    { day: 2, title: "Notification Detox", description: "Turn off non-essential notifications.", requiresPhoto: true, xp: 70 },
    { day: 3, title: "Focus Mode", description: "Use 'Focus Mode' for 30 minutes.", requiresPhoto: false, xp: 75 },
    { day: 4, title: "Clean Workspace", description: "Declutter your workspace (physical or digital).", requiresPhoto: true, xp: 80 },
    { day: 5, title: "Deep Work Hours", description: "Schedule 2 'deep work' hours daily.", requiresPhoto: true, xp: 90 },
    { day: 6, title: "Pomodoro Technique", description: "Practice the Pomodoro Technique (25/5 splits).", requiresPhoto: false, xp: 60 },
    { day: 7, title: "Track Focus Time", description: "Track focus time vs. distractions.", requiresPhoto: true, xp: 75 },
    { day: 8, title: "Focus Playlist", description: "Create a 'focus playlist' with ambient noise.", requiresPhoto: false, xp: 85 },
    { day: 9, title: "Noise-Canceling", description: "Use noise-canceling headphones for focus sessions.", requiresPhoto: true, xp: 95 },
    { day: 10, title: "Reasons Why", description: "Write 3 reasons why your goal matters.", requiresPhoto: false, xp: 70 },
    { day: 11, title: "Batch Tasks", description: "Batch similar tasks (e.g., emails, calls).", requiresPhoto: true, xp: 80 },
    { day: 12, title: "Time Blocking", description: "Use the 'Time Blocking' method to plan your day.", requiresPhoto: false, xp: 90 },
    { day: 13, title: "Deep Work Session", description: "Complete a 50-minute deep work session.", requiresPhoto: true, xp: 100 },
    { day: 14, title: "Limit Decisions", description: "Limit decision fatigue by planning outfits/meal prep.", requiresPhoto: false, xp: 65 },
    { day: 15, title: "Focus Manifesto", description: "Write a 'focus manifesto' (e.g., 'Progress over perfection').", requiresPhoto: true, xp: 75 },
    { day: 16, title: "Single-Tasking", description: "Replace multitasking with single-tasking.", requiresPhoto: false, xp: 85 },
    { day: 17, title: "Timebox", description: "Use a 'timebox' to limit task durations.", requiresPhoto: true, xp: 95 },
    { day: 18, title: "Breathwork", description: "Practice 5 minutes of breathwork before starting work.", requiresPhoto: false, xp: 70 },
    { day: 19, title: "Focus Anchor", description: "Use a 'focus anchor' (e.g., mantra or object).", requiresPhoto: true, xp: 80 },
    { day: 20, title: "No-Meeting Wednesday", description: "Schedule 'no-meeting Wednesdays' for deep work.", requiresPhoto: false, xp: 90 },
    { day: 21, title: "Share Focus Tip", description: "Share a focus tip in the Community Hub.", requiresPhoto: true, xp: 100 },
    { day: 22, title: "5-Minute Walks", description: "Replace distractions with 5-minute walks.", requiresPhoto: false, xp: 65 },
    { day: 23, title: "5-Second Rule", description: "Use the '5-Second Rule' to start tasks instantly.", requiresPhoto: true, xp: 75 },
    { day: 24, title: "Focus Ritual", description: "Create a 'focus ritual' (e.g., tea + music).", requiresPhoto: false, xp: 85 },
    { day: 25, title: "Gratitude", description: "Practice gratitude for progress made.", requiresPhoto: true, xp: 95 },
    { day: 26, title: "Ultra-Focus", description: "Complete a 2-hour 'ultra-focus' session.", requiresPhoto: false, xp: 70 },
    { day: 27, title: "Digital Declutter", description: "Declutter digital distractions (unfollow social media).", requiresPhoto: true, xp: 80 },
    { day: 28, title: "Reflect Wins/Losses", description: "Reflect on focus wins and losses.", requiresPhoto: false, xp: 90 },
    { day: 29, title: "Plan Focus Strategy", description: "Plan next month's focus strategy.", requiresPhoto: true, xp: 100 },
    { day: 30, title: "Celebrate Mastery", description: "Celebrate your focus mastery.", requiresPhoto: true, xp: 120 }
  ];

  const resilienceQuests = [
    { day: 1, title: "Setback Journal", description: "Journal about a past setback and emotions.", requiresPhoto: false, xp: 50 },
    { day: 2, title: "Comeback Mantra", description: "Write a 'comeback mantra' (e.g., 'This too shall pass').", requiresPhoto: false, xp: 60 },
    { day: 3, title: "Mindfulness", description: "Practice 5 minutes of mindfulness.", requiresPhoto: false, xp: 65 },
    { day: 4, title: "Failure Lesson", description: "Identify 1 lesson from a past failure.", requiresPhoto: false, xp: 70 },
    { day: 5, title: "Letter to Past Self", description: "Write a letter to your past self (advice for struggles).", requiresPhoto: true, xp: 80 },
    { day: 6, title: "Reframing Thoughts", description: "Practice reframing negative thoughts (e.g., 'Challenge = growth').", requiresPhoto: false, xp: 90 },
    { day: 7, title: "Share Anonymously", description: "Share your story anonymously in the Community Hub.", requiresPhoto: true, xp: 100 },
    { day: 8, title: "Resilience Playlist", description: "Create a 'resilience playlist' (songs that empower you).", requiresPhoto: false, xp: 65 },
    { day: 9, title: "Support People", description: "Identify 3 support people in your life.", requiresPhoto: true, xp: 75 },
    { day: 10, title: "Affirmations", description: "Write 3 affirmations for tough days.", requiresPhoto: false, xp: 85 },
    { day: 11, title: "Visualize Overcoming", description: "Visualize overcoming a current challenge.", requiresPhoto: true, xp: 95 },
    { day: 12, title: "Self-Care Day", description: "Schedule a 'self-care day' for rest.", requiresPhoto: false, xp: 70 },
    { day: 13, title: "Coping Skill", description: "Learn 1 new coping skill (e.g., box breathing).", requiresPhoto: true, xp: 80 },
    { day: 14, title: "Forgive Yourself", description: "Forgive yourself for 1 past mistake.", requiresPhoto: false, xp: 90 },
    { day: 15, title: "Strengths List", description: "Write a 'strengths list' of skills that helped you overcome adversity.", requiresPhoto: true, xp: 100 },
    { day: 16, title: "Yoga/Stretching", description: "Practice 10 minutes of yoga/stretching.", requiresPhoto: false, xp: 65 },
    { day: 17, title: "Setback Survival Kit", description: "Create a 'setback survival kit' (tools for tough days).", requiresPhoto: true, xp: 75 },
    { day: 18, title: "Letter to Future Self", description: "Write a letter to your future self (30-day vision).", requiresPhoto: false, xp: 85 },
    { day: 19, title: "Self-Compassion", description: "Replace self-criticism with self-compassion.", requiresPhoto: true, xp: 95 },
    { day: 20, title: "Radical Acceptance", description: "Practice radical acceptance ('This is my reality now').", requiresPhoto: false, xp: 70 },
    { day: 21, title: "Resilience Tip", description: "Share a resilience tip in the Community Hub.", requiresPhoto: true, xp: 80 },
    { day: 22, title: "Cold Shower", description: "Take a cold shower (build mental toughness).", requiresPhoto: false, xp: 90 },
    { day: 23, title: "Growth List", description: "Write a 'growth list' of how setbacks made you stronger.", requiresPhoto: true, xp: 100 },
    { day: 24, title: "Calm Anxiety", description: "Use mindfulness to calm anxiety.", requiresPhoto: false, xp: 65 },
    { day: 25, title: "Gratitude for Challenges", description: "Practice gratitude for challenges faced.", requiresPhoto: true, xp: 75 },
    { day: 26, title: "Recovery Plan", description: "Create a 'recovery plan' for future setbacks.", requiresPhoto: false, xp: 85 },
    { day: 27, title: "Declutter Thoughts", description: "Declutter toxic relationships/thoughts.", requiresPhoto: true, xp: 95 },
    { day: 28, title: "Reflect Wins", description: "Reflect on resilience wins.", requiresPhoto: false, xp: 70 },
    { day: 29, title: "Apply Lessons", description: "Plan how to apply resilience lessons long-term.", requiresPhoto: true, xp: 80 },
    { day: 30, title: "Celebrate Growth", description: "Celebrate your growth and share results.", requiresPhoto: true, xp: 120 }
  ];

  const wildcardQuests = [
    { day: 1, title: "Free Drawing", description: "Sketch/doodle for 10 minutes (no judgment).", requiresPhoto: true, xp: 50 },
    { day: 2, title: "Idea Generation", description: "Brainstorm 5 new ideas (wild or practical).", requiresPhoto: false, xp: 60 },
    { day: 3, title: "Creative Risks", description: "Write a 'failure resume' of creative risks taken.", requiresPhoto: false, xp: 70 },
    { day: 4, title: "Vision Board", description: "Create a mood board for your vision.", requiresPhoto: true, xp: 80 },
    { day: 5, title: "Elevator Pitch", description: "Turn 1 idea into a 30-second pitch.", requiresPhoto: false, xp: 75 },
    { day: 6, title: "Research Innovator", description: "Research 1 successful innovator for inspiration.", requiresPhoto: true, xp: 85 },
    { day: 7, title: "Free Writing", description: "Practice free writing (no editing).", requiresPhoto: false, xp: 95 },
    { day: 8, title: "Idea Journal", description: "Use an 'idea journal' to log daily inspirations.", requiresPhoto: true, xp: 70 },
    { day: 9, title: "Improvisation", description: "Practice 10 minutes of improvisation (freestyle writing/acting).", requiresPhoto: false, xp: 80 },
    { day: 10, title: "Creative Ritual", description: "Create a 'creative ritual' (e.g., coffee + music).", requiresPhoto: true, xp: 90 },
    { day: 11, title: "Needed Resources", description: "Identify 3 resources needed to execute your idea.", requiresPhoto: false, xp: 100 },
    { day: 12, title: "Imperfect Action", description: "Practice 'imperfect action' (start before ready).", requiresPhoto: true, xp: 65 },
    { day: 13, title: "Free Flow", description: "Replace creative blocks with 5-minute 'free flow' sessions.", requiresPhoto: false, xp: 75 },
    { day: 14, title: "Risk List", description: "Write a 'risk list' of fears holding you back.", requiresPhoto: true, xp: 85 },
    { day: 15, title: "Pitch to Friend", description: "Pitch your idea to a friend.", requiresPhoto: false, xp: 95 },
    { day: 16, title: "MVP Draft", description: "Build a minimal viable product (MVP) draft.", requiresPhoto: true, xp: 70 },
    { day: 17, title: "AR Tools", description: "Use AR tools to visualize your idea.", requiresPhoto: false, xp: 80 },
    { day: 18, title: "Share Progress", description: "Share progress in the Community Hub.", requiresPhoto: true, xp: 90 },
    { day: 19, title: "Worst That Happens", description: "Replace self-doubt with 'what’s the worst that happens?'", requiresPhoto: false, xp: 100 },
    { day: 20, title: "Daily Brainstorming", description: "Practice 15 minutes of daily brainstorming.", requiresPhoto: true, xp: 65 },
    { day: 21, title: "Reframe Criticism", description: "Reframe 1 criticism into constructive feedback.", requiresPhoto: false, xp: 75 },
    { day: 22, title: "Creativity Playlist", description: "Create a 'creativity playlist' for inspiration.", requiresPhoto: true, xp: 85 },
    { day: 23, title: "Creative Walk", description: "Take a 'creative walk' to brainstorm on-the-go.", requiresPhoto: false, xp: 95 },
    { day: 24, title: "Success List", description: "Write a 'success list' of past creative wins.", requiresPhoto: true, xp: 70 },
    { day: 25, title: "Gratitude for Gifts", description: "Practice gratitude for your creative gifts.", requiresPhoto: false, xp: 80 },
    { day: 26, title: "Finalize MVP", description: "Finalize your MVP and plan a launch step.", requiresPhoto: true, xp: 90 },
    { day: 27, title: "Declutter Ideas", description: "Declutter old ideas to make space for new ones.", requiresPhoto: false, xp: 100 },
    { day: 28, title: "Reflect Breakthroughs", description: "Reflect on creative breakthroughs.", requiresPhoto: true, xp: 65 },
    { day: 29, title: "Plan Next Project", description: "Plan your next creative project.", requiresPhoto: false, xp: 75 },
    { day: 30, title: "Showcase Work", description: "Showcase your work and celebrate!", requiresPhoto: true, xp: 120 }
  ];
  
  useEffect(() => {
    let themeQuests = disciplineQuests;
    if (selectedTheme === "Focus") {
      themeQuests = focusQuests;
    } else if (selectedTheme === "Resilience") {
      themeQuests = resilienceQuests;
    } else if (selectedTheme === "Wildcards") {
      themeQuests = wildcardQuests;
    }
    
    const formattedQuests = themeQuests.map((quest, index) => {
      // All quests start as locked except the first one which is active
      let status: "completed" | "active" | "locked" = "locked";
      
      if (index === 0) {
        status = "active"; // First quest is active, not completed
      }
      
      return {
        id: index + 1,
        ...quest,
        status,
        theme: selectedTheme
      };
    });
    
    setQuests(formattedQuests);
    setLoading(false);
  }, [selectedTheme]);
  
  const handleOpenCompleteModal = (quest: Quest) => {
    setActiveQuest(quest);
    setShowCompleteModal(true);
  };
  
  const handleCompleteQuest = (photoUrl?: string) => {
    if (!activeQuest) return;
    
    setQuests(quests.map(q => {
      if (q.id === activeQuest.id) {
        return { ...q, status: "completed" };
      }
      
      if (q.day === activeQuest.day + 1 && q.status === "locked") {
        return { ...q, status: "active" };
      }
      
      return q;
    }));
    
    addXP(activeQuest.xp);
    incrementStreak();
    
    setShowCompleteModal(false);
    setActiveQuest(null);
  };
  
  const saveQuestCompletion = async (questId: number, photoUrl?: string) => {
    console.log("Saving quest completion", questId, photoUrl);
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-white mb-4">Loading quests...</p>
        </div>
      </div>
    );
  }
  
  // Get displayed quests - show first 5 or all based on showAllQuests state
  const displayedQuests = showAllQuests ? quests : quests.slice(0, 5);
  
  return (
    <div className="min-h-screen pb-24">
      <div className="p-6 space-y-4">
        <h1 className="text-xl font-medium">Your Quests</h1>
        
        <div className="space-y-4">
          <AnimatePresence>
            {displayedQuests.map((quest) => (
              <motion.div
                key={quest.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <GlassCard key={quest.id} className={`relative ${quest.status === "locked" ? "overflow-hidden" : ""}`}>
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
                    <button 
                      className="btn-primary w-full mt-4"
                      onClick={() => handleOpenCompleteModal(quest)}
                    >
                      Complete Quest
                    </button>
                  )}
                  
                  {quest.status === "locked" && (
                    <div className="mt-4 text-sm text-muted italic">
                      Complete previous quests to unlock
                    </div>
                  )}
                  
                  {/* Add blur overlay for locked quests */}
                  {quest.status === "locked" && (
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center">
                      <FiLock className="text-white/50 text-xl" />
                    </div>
                  )}
                </GlassCard>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {/* Show "See More" button if there are more than 5 quests */}
          {quests.length > 5 && (
            <button 
              className="w-full py-3 px-4 rounded-xl bg-[#1A1A1A]/80 backdrop-blur-xl border border-white/10 text-white flex items-center justify-center gap-2 hover:bg-[#222222]/80 hover:border-white/15 active:scale-[0.98] transition-all transform-gpu"
              onClick={() => setShowAllQuests(!showAllQuests)}
            >
              {showAllQuests ? (
                <>
                  <FiChevronUp size={18} />
                  <span>Show Less</span>
                </>
              ) : (
                <>
                  <FiChevronDown size={18} />
                  <span>See All ({quests.length - 5} More)</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
      
      {showCompleteModal && activeQuest && (
        <QuestCompleteModal
          questId={activeQuest.id.toString()}
          title={activeQuest.title}
          xp={activeQuest.xp}
          requiresPhoto={activeQuest.requiresPhoto}
          onClose={() => setShowCompleteModal(false)}
          onComplete={handleCompleteQuest}
        />
      )}
    </div>
  );
};

export default Quests;
