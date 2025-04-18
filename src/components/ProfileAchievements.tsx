
import React from "react";
import { GlassCard } from "@/components/GlassCard";
import { 
  Medal, 
  Flame, 
  Target, 
  Calendar, 
  Award, 
  Zap, 
  Star, 
  Trophy
} from "lucide-react";
import { useApp } from "@/context/AppContext";

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

export const ProfileAchievements = () => {
  const { streak, xp } = useApp();
  
  // Calculate which achievements are unlocked based on user stats
  const achievements: Achievement[] = [
    {
      id: "streak-3",
      title: "3-Day Streak",
      description: "Maintained your habit for 3 consecutive days",
      icon: <Flame size={24} />,
      isUnlocked: streak >= 3,
      progress: streak >= 3 ? 3 : streak,
      maxProgress: 3,
      category: "streak"
    },
    {
      id: "streak-7",
      title: "7-Day Streak",
      description: "Maintained your habit for a full week",
      icon: <Flame size={24} />,
      isUnlocked: streak >= 7,
      progress: streak >= 7 ? 7 : streak,
      maxProgress: 7,
      category: "streak"
    },
    {
      id: "streak-30",
      title: "Monthly Master",
      description: "Maintained your habit for a full month",
      icon: <Calendar size={24} />,
      isUnlocked: streak >= 30,
      progress: Math.min(streak, 30),
      maxProgress: 30,
      category: "streak"
    },
    {
      id: "xp-100",
      title: "Quick Starter",
      description: "Earned your first 100 XP",
      icon: <Zap size={24} />,
      isUnlocked: xp >= 100,
      progress: xp >= 100 ? 100 : xp,
      maxProgress: 100,
      category: "xp"
    },
    {
      id: "xp-1000",
      title: "Dedication",
      description: "Reached 1000 XP",
      icon: <Star size={24} />,
      isUnlocked: xp >= 1000,
      progress: Math.min(xp, 1000),
      maxProgress: 1000,
      category: "xp"
    },
    {
      id: "early-adopter",
      title: "Early Adopter",
      description: "One of the first to join Solivrah",
      icon: <Award size={24} />,
      isUnlocked: true, // Everyone gets this one
      category: "general"
    },
    {
      id: "quest-1",
      title: "Quest Champion",
      description: "Completed your first quest",
      icon: <Trophy size={24} />,
      isUnlocked: false, // Will be updated based on quest completion
      category: "quests"
    },
    {
      id: "quest-photo",
      title: "Photo Proof",
      description: "Verified a quest with photo evidence",
      icon: <Target size={24} />,
      isUnlocked: false, // Will be updated based on quest completion with photos
      category: "quests"
    },
  ];
  
  // Group achievements by category for display
  const streakAchievements = achievements.filter(a => a.category === "streak");
  const xpAchievements = achievements.filter(a => a.category === "xp");
  const questAchievements = achievements.filter(a => a.category === "quests");
  const generalAchievements = achievements.filter(a => a.category === "general");
  
  return (
    <div className="space-y-5 animate-fade-in">
      <section>
        <h3 className="text-lg font-medium mb-3">Streak Achievements</h3>
        <div className="grid grid-cols-1 gap-3">
          {streakAchievements.map(achievement => (
            <AchievementCard key={achievement.id} achievement={achievement} />
          ))}
        </div>
      </section>
      
      <section>
        <h3 className="text-lg font-medium mb-3">XP Achievements</h3>
        <div className="grid grid-cols-1 gap-3">
          {xpAchievements.map(achievement => (
            <AchievementCard key={achievement.id} achievement={achievement} />
          ))}
        </div>
      </section>
      
      <section>
        <h3 className="text-lg font-medium mb-3">Quest Achievements</h3>
        <div className="grid grid-cols-1 gap-3">
          {questAchievements.map(achievement => (
            <AchievementCard key={achievement.id} achievement={achievement} />
          ))}
        </div>
      </section>
      
      <section>
        <h3 className="text-lg font-medium mb-3">Other Achievements</h3>
        <div className="grid grid-cols-1 gap-3">
          {generalAchievements.map(achievement => (
            <AchievementCard key={achievement.id} achievement={achievement} />
          ))}
        </div>
      </section>
    </div>
  );
};

const AchievementCard = ({ achievement }: { achievement: Achievement }) => {
  return (
    <GlassCard variant="subtle" className={`p-4 ${!achievement.isUnlocked ? 'opacity-50' : ''}`}>
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
          achievement.isUnlocked 
            ? 'bg-[#222222] text-white' 
            : 'bg-[#1A1A1A] text-gray-400'
        }`}>
          {achievement.icon}
        </div>
        
        <div className="flex-1">
          <h4 className="font-medium">{achievement.title}</h4>
          <p className="text-sm text-white/70">{achievement.description}</p>
          
          {achievement.progress !== undefined && achievement.maxProgress !== undefined && (
            <div className="mt-2">
              <div className="h-1.5 bg-[#111111] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-white/80 to-white/70"
                  style={{ 
                    width: `${(achievement.progress / achievement.maxProgress) * 100}%`,
                    transition: 'width 1s ease-in-out'
                  }}
                ></div>
              </div>
              <div className="text-xs text-white/70 mt-1 text-right">
                {achievement.progress}/{achievement.maxProgress}
              </div>
            </div>
          )}
        </div>
        
        {achievement.isUnlocked && (
          <div className="text-primary">
            <Medal size={18} />
          </div>
        )}
      </div>
    </GlassCard>
  );
};
