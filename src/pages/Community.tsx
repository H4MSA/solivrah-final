
import React, { useState } from "react";
import { GlassCard } from "@/components/GlassCard";
import { TabNavigation } from "@/components/TabNavigation";
import { FiStar, FiUsers, FiMessageCircle } from "react-icons/fi";

const Community = () => {
  const [activeTab, setActiveTab] = useState("leaderboards");
  
  // Sample data
  const leaderboards = [
    { name: "AchieveMore", streak: 30, xp: 1500 },
    { name: "FocusMaster", streak: 25, xp: 1350 },
    { name: "DailyGrinder", streak: 21, xp: 1200 },
    { name: "Disciplined", streak: 18, xp: 950 },
    { name: "MindfulOne", streak: 15, xp: 820 },
  ];
  
  const groups = [
    { name: "Discipline Masters", members: 234, theme: "Discipline" },
    { name: "Focus Ninjas", members: 187, theme: "Focus" },
    { name: "Resilience Warriors", members: 156, theme: "Resilience" },
    { name: "Creative Wildcards", members: 128, theme: "Wildcards" },
  ];
  
  const renderTabContent = () => {
    switch (activeTab) {
      case "leaderboards":
        return (
          <div className="space-y-3">
            {leaderboards.map((user, index) => (
              <GlassCard key={index} className="flex items-center gap-3">
                <div className="bg-secondary/40 rounded-full w-10 h-10 flex items-center justify-center">
                  #{index + 1}
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">{user.name}</h3>
                  <div className="flex items-center gap-2 text-xs text-muted">
                    <span className="flex items-center gap-1">
                      <FiStar className="text-primary" /> Streak: {user.streak}
                    </span>
                    <span>XP: {user.xp}</span>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        );
      case "groups":
        return (
          <div className="space-y-3">
            {groups.map((group, index) => (
              <GlassCard key={index}>
                <h3 className="font-medium">{group.name}</h3>
                <div className="flex items-center gap-2 text-xs text-muted mt-1">
                  <span className="flex items-center gap-1">
                    <FiUsers /> {group.members} members
                  </span>
                  <span>{group.theme}</span>
                </div>
                <button className="bg-secondary/40 text-white text-sm px-4 py-2 rounded-lg mt-3 w-full">
                  Join Group
                </button>
              </GlassCard>
            ))}
          </div>
        );
      default:
        return (
          <div className="flex items-center justify-center h-40">
            <p className="text-muted">Coming soon...</p>
          </div>
        );
    }
  };
  
  return (
    <div className="min-h-screen pb-20">
      <div className="p-6 space-y-4">
        <h1 className="text-xl font-medium">Community</h1>
        
        <div className="flex space-x-2 overflow-x-auto pb-2">
          <button 
            className={`px-4 py-2 rounded-lg text-sm whitespace-nowrap ${
              activeTab === "leaderboards" 
                ? "bg-primary text-primary-foreground" 
                : "glass text-white"
            }`}
            onClick={() => setActiveTab("leaderboards")}
          >
            <FiStar className="inline mr-1" /> Leaderboards
          </button>
          <button 
            className={`px-4 py-2 rounded-lg text-sm whitespace-nowrap ${
              activeTab === "groups" 
                ? "bg-primary text-primary-foreground" 
                : "glass text-white"
            }`}
            onClick={() => setActiveTab("groups")}
          >
            <FiUsers className="inline mr-1" /> Groups
          </button>
          <button 
            className={`px-4 py-2 rounded-lg text-sm whitespace-nowrap ${
              activeTab === "posts" 
                ? "bg-primary text-primary-foreground" 
                : "glass text-white"
            }`}
            onClick={() => setActiveTab("posts")}
          >
            <FiMessageCircle className="inline mr-1" /> Posts
          </button>
        </div>
        
        {renderTabContent()}
      </div>
      
      <TabNavigation />
    </div>
  );
};

export default Community;
