
import React from "react";
import { 
  Medal, 
  Flame, 
  Target, 
  Calendar, 
  Award, 
  Zap, 
  Star, 
  Trophy,
  Users
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import { motion } from "framer-motion";
import { PremiumCard } from "./PremiumCard";

// Define achievement types and data
interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  isUnlocked: boolean;
  progress?: number;
  maxProgress?: number;
  category: "streak" | "xp" | "quests" | "general";
}

export const ProfileAchievements: React.FC = () => {
  const { streak, xp, completedQuests } = useApp();
  
  // Calculate which achievements are unlocked based on user stats
  const achievements: Achievement[] = [
    {
      id: "early-adopter",
      title: "Early Adopter",
      description: "One of the first to join Solivrah",
      icon: <Award size={24} />,
      isUnlocked: true, // Everyone gets this one
      category: "general"
    },
    {
      id: "streak-7",
      title: "7-Day Streak",
      description: "Maintained your habit for a full week",
      icon: <Star size={24} />,
      isUnlocked: streak >= 7,
      progress: Math.min(streak, 7),
      maxProgress: 7,
      category: "streak"
    },
    {
      id: "quest-1",
      title: "First Quest",
      description: "Completed your first quest",
      icon: <Target size={24} />,
      isUnlocked: completedQuests > 0,
      category: "quests"
    },
    {
      id: "social",
      title: "Social",
      description: "Connected with the community",
      icon: <Users size={24} />,
      isUnlocked: false,
      category: "general"
    },
    {
      id: "flame-30",
      title: "Burning Hot",
      description: "Maintained a 30-day streak",
      icon: <Flame size={24} />,
      isUnlocked: streak >= 30,
      progress: Math.min(streak, 30),
      maxProgress: 30,
      category: "streak"
    },
    {
      id: "xp-5000",
      title: "XP Master",
      description: "Earned 5000 XP",
      icon: <Zap size={24} />,
      isUnlocked: xp >= 5000,
      progress: Math.min(xp, 5000),
      maxProgress: 5000,
      category: "xp"
    },
    {
      id: "quest-master",
      title: "Quest Master",
      description: "Completed 10 quests",
      icon: <Trophy size={24} />,
      isUnlocked: completedQuests >= 10,
      progress: Math.min(completedQuests, 10),
      maxProgress: 10,
      category: "quests"
    },
    {
      id: "scheduler",
      title: "Scheduler",
      description: "Used the calendar feature",
      icon: <Calendar size={24} />,
      isUnlocked: false,
      category: "general"
    }
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 30 } }
  };
  
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-2 gap-4"
    >
      {achievements.map(achievement => (
        <motion.div key={achievement.id} variants={item}>
          <AchievementCard achievement={achievement} />
        </motion.div>
      ))}
    </motion.div>
  );
};

const AchievementCard = ({ achievement }: { achievement: Achievement }) => {
  return (
    <PremiumCard 
      variant={achievement.isUnlocked ? "default" : "subtle"} 
      className={`p-4 flex flex-col items-center justify-center aspect-square ${!achievement.isUnlocked ? 'opacity-40' : ''}`}
    >
      <div className={`w-12 h-12 rounded-full mb-3 flex items-center justify-center ${
        achievement.isUnlocked 
          ? 'bg-white/10 text-white border border-white/20' 
          : 'bg-white/5 text-white/60 border border-white/10'
      }`}>
        {achievement.icon}
      </div>
      
      <h4 className="font-medium text-center">{achievement.title}</h4>
      <p className="text-xs text-white/70 text-center mt-1">{achievement.description}</p>
      
      {achievement.progress !== undefined && achievement.maxProgress !== undefined && (
        <div className="mt-3 w-full">
          <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
            <div 
              className="h-full bg-white/30"
              style={{ 
                width: `${(achievement.progress / achievement.maxProgress) * 100}%`,
                transition: 'width 1s ease-in-out'
              }}
            ></div>
          </div>
          <div className="text-xs text-white/70 mt-1 text-center">
            {achievement.progress}/{achievement.maxProgress}
          </div>
        </div>
      )}
      
      {achievement.isUnlocked && (
        <div className="absolute top-3 right-3 text-white/80">
          <Medal size={16} />
        </div>
      )}
    </PremiumCard>
  );
};
