
import React from "react";
import { GlassCard } from "@/components/GlassCard";
import { 
  Calendar,
  Clock,
  BarChart2,
  TrendingUp,
  Target,
  CheckCircle,
  Award,
  Flame
} from "lucide-react";
import { useApp } from "@/context/AppContext";

export const ProfileStats = () => {
  const { streak, xp } = useApp();
  
  // Example stats
  const stats = [
    {
      title: "Streak",
      value: streak,
      icon: <Flame />,
      description: "Current consecutive days",
      trend: "+23% from last week"
    },
    {
      title: "Total XP",
      value: xp,
      icon: <Award />,
      description: "Experience points earned",
      trend: "+156 this week"
    },
    {
      title: "Quests Completed",
      value: 0, // Will be dynamically updated based on actual completion
      icon: <CheckCircle />,
      description: "Tasks marked as done",
      trend: "Just getting started"
    },
    {
      title: "Weekly Average",
      value: "5.2",
      icon: <TrendingUp />,
      description: "Average days active per week",
      trend: "Consistently improving"
    },
    {
      title: "Time Invested",
      value: "32h",
      icon: <Clock />,
      description: "Total time tracked in app",
      trend: "+3h from last week"
    },
    {
      title: "Goals Set",
      value: "3",
      icon: <Target />,
      description: "Personal goals defined",
      trend: "1 achieved, 2 in progress"
    }
  ];
  
  // Calculate the level based on XP
  const level = Math.floor(xp / 1000) + 1;
  const nextLevelXP = level * 1000;
  const progress = ((xp % 1000) / 1000) * 100;
  
  return (
    <div className="space-y-5 animate-fade-in">
      <section>
        <h3 className="text-lg font-medium mb-3">Progress Summary</h3>
        <GlassCard variant="subtle" className="p-4">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h4 className="font-medium text-white">Level {level}</h4>
              <p className="text-sm text-white/70">{nextLevelXP - xp} XP to Level {level+1}</p>
            </div>
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#222222] text-white">
              <BarChart2 />
            </div>
          </div>
          
          <div className="h-2 bg-[#1A1A1A] rounded-full overflow-hidden mt-4">
            <div 
              className="h-full bg-gradient-to-r from-white/80 to-white/70"
              style={{ width: `${progress}%`, transition: 'width 1s ease-in-out' }}
            ></div>
          </div>
        </GlassCard>
      </section>
      
      <section>
        <h3 className="text-lg font-medium mb-3">Activity Calendar</h3>
        <GlassCard variant="subtle" className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium">April 2025</h4>
            <div className="p-2 rounded-full bg-[#1A1A1A] cursor-pointer">
              <Calendar size={16} />
            </div>
          </div>
          
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: 30 }).map((_, index) => {
              // Simulate some active days
              const isActive = [1, 3, 4, 5, 7, 8, 10, 11, 12, 13, 15, 16, 17].includes(index + 1);
              return (
                <div 
                  key={index} 
                  className={`w-full aspect-square rounded-md flex items-center justify-center text-xs ${
                    isActive ? 'bg-[#333333]' : 'bg-[#1A1A1A]'
                  }`}
                >
                  {index + 1}
                </div>
              );
            })}
          </div>
        </GlassCard>
      </section>
      
      <section>
        <h3 className="text-lg font-medium mb-3">Key Metrics</h3>
        <div className="grid grid-cols-2 gap-3">
          {stats.map((stat, index) => (
            <GlassCard key={index} variant="subtle" className="p-3">
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between">
                  <span className="text-white/70 text-sm">{stat.title}</span>
                  <div className="text-white/70">
                    {stat.icon}
                  </div>
                </div>
                <div className="text-xl font-medium mt-2">{stat.value}</div>
                <div className="mt-auto">
                  <p className="text-xs text-white/50 mt-2">{stat.description}</p>
                  <p className="text-xs text-white/70 mt-1">{stat.trend}</p>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      </section>
    </div>
  );
};
