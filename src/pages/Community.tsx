
import React, { useState } from "react";
import { GlassCard } from "@/components/GlassCard";
import { TabNavigation } from "@/components/TabNavigation";
import { FiStar, FiUsers, FiMessageCircle, FiHeart } from "react-icons/fi";
import { useApp } from "@/context/AppContext";
import { ThemeBackground } from "@/components/ThemeBackground";

const Community = () => {
  const [activeTab, setActiveTab] = useState("leaderboards");
  const { selectedTheme } = useApp();
  
  // Sample data
  const leaderboards = [
    { name: "AchieveMore", streak: 30, xp: 1500, theme: "Discipline" },
    { name: "FocusMaster", streak: 25, xp: 1350, theme: "Focus" },
    { name: "DailyGrinder", streak: 21, xp: 1200, theme: "Discipline" },
    { name: "Disciplined", streak: 18, xp: 950, theme: "Discipline" },
    { name: "MindfulOne", streak: 15, xp: 820, theme: "Resilience" },
  ];
  
  const groups = [
    { name: "Discipline Masters", members: 234, theme: "Discipline" },
    { name: "Focus Ninjas", members: 187, theme: "Focus" },
    { name: "Resilience Warriors", members: 156, theme: "Resilience" },
    { name: "Creative Wildcards", members: 128, theme: "Wildcards" },
  ];
  
  const posts = [
    { id: 1, name: "FocusMaster", content: "Just completed Day 15! The 'Focus Mode' technique has completely changed how I work.", likes: 24, theme: "Focus", time: "2h ago" },
    { id: 2, name: "Disciplined", content: "My 30-day streak has helped me establish a morning routine that sticks. So grateful for this community!", likes: 42, theme: "Discipline", time: "5h ago" },
    { id: 3, name: "ResilienceBuilder", content: "Failed yesterday but got back up today. That's what resilience is all about!", likes: 56, theme: "Resilience", time: "1d ago" },
  ];
  
  const renderTabContent = () => {
    switch (activeTab) {
      case "leaderboards":
        return (
          <div className="space-y-4">
            {leaderboards.map((user, index) => (
              <GlassCard key={index} className="flex items-center gap-4 p-5">
                <div className="bg-white/10 text-white rounded-full w-12 h-12 flex items-center justify-center text-lg font-medium backdrop-blur-sm">
                  #{index + 1}
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-base">{user.name}</h3>
                  <div className="flex items-center gap-3 text-sm text-white/70 mt-1">
                    <span className="flex items-center gap-1">
                      <FiStar className="text-white/80" /> {user.streak} days
                    </span>
                    <span>{user.xp} XP</span>
                    <span className="bg-white/5 px-2 py-0.5 rounded-full text-xs border border-white/10">{user.theme}</span>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        );
      case "groups":
        return (
          <div className="space-y-4">
            {groups.map((group, index) => (
              <GlassCard key={index} className="p-5">
                <h3 className="font-medium text-base">{group.name}</h3>
                <div className="flex items-center gap-3 text-sm text-white/70 mt-1 mb-4">
                  <span className="flex items-center gap-1">
                    <FiUsers /> {group.members} members
                  </span>
                  <span className="bg-white/5 px-2 py-0.5 rounded-full text-xs border border-white/10">{group.theme}</span>
                </div>
                <button className="bg-white/10 hover:bg-white/15 text-white text-sm px-4 py-2 w-full rounded-lg border border-white/10 transition-colors">
                  Join Group
                </button>
              </GlassCard>
            ))}
          </div>
        );
      case "posts":
        return (
          <div className="space-y-4">
            {posts.map((post, index) => (
              <GlassCard key={index} className="p-5">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-medium text-base">{post.name}</h3>
                  <span className="text-xs text-white/60">{post.time}</span>
                </div>
                <p className="text-sm text-white/80 mb-4">{post.content}</p>
                <div className="flex items-center justify-between pt-3 border-t border-white/10">
                  <div className="text-xs text-white/60 px-2 py-0.5 rounded-full bg-white/5 border border-white/5">{post.theme}</div>
                  <button className="flex items-center gap-1 text-sm text-white/70 hover:text-white transition-colors">
                    <FiHeart className={post.likes > 30 ? "text-pink-400" : ""} /> {post.likes}
                  </button>
                </div>
              </GlassCard>
            ))}
            
            <GlassCard className="p-5">
              <textarea
                placeholder="Share your journey..."
                className="w-full bg-transparent border-none outline-none resize-none h-24 text-white placeholder:text-white/50"
              />
              <div className="flex justify-end mt-2">
                <button className="bg-white text-black rounded-lg px-4 py-2 text-sm font-medium hover:bg-white/90 active:scale-95 transition-all">
                  Post
                </button>
              </div>
            </GlassCard>
          </div>
        );
      default:
        return (
          <div className="flex items-center justify-center h-40">
            <p className="text-white/60">Coming soon...</p>
          </div>
        );
    }
  };
  
  return (
    <div className="min-h-screen pb-28"> {/* Increased bottom padding to prevent overlap */}
      <ThemeBackground />
      
      <div className="p-6 space-y-6">
        <h1 className="text-xl font-medium text-white">Community</h1>
        
        <div className="flex space-x-3 overflow-x-auto pb-2 scrollbar-none">
          <button 
            className={`px-4 py-2.5 rounded-xl text-sm whitespace-nowrap backdrop-blur-xl ${
              activeTab === "leaderboards" 
                ? "bg-white/10 text-white border border-white/20" 
                : "bg-black/40 text-white/80 hover:text-white hover:bg-black/50 border border-white/5"
            }`}
            onClick={() => setActiveTab("leaderboards")}
          >
            <FiStar className="inline mr-2" /> Leaderboards
          </button>
          <button 
            className={`px-4 py-2.5 rounded-xl text-sm whitespace-nowrap backdrop-blur-xl ${
              activeTab === "groups" 
                ? "bg-white/10 text-white border border-white/20" 
                : "bg-black/40 text-white/80 hover:text-white hover:bg-black/50 border border-white/5"
            }`}
            onClick={() => setActiveTab("groups")}
          >
            <FiUsers className="inline mr-2" /> Groups
          </button>
          <button 
            className={`px-4 py-2.5 rounded-xl text-sm whitespace-nowrap backdrop-blur-xl ${
              activeTab === "posts" 
                ? "bg-white/10 text-white border border-white/20" 
                : "bg-black/40 text-white/80 hover:text-white hover:bg-black/50 border border-white/5"
            }`}
            onClick={() => setActiveTab("posts")}
          >
            <FiMessageCircle className="inline mr-2" /> Posts
          </button>
        </div>
        
        <div className="space-y-4">
          {renderTabContent()}
        </div>
      </div>
      
      <TabNavigation />
    </div>
  );
};

export default Community;
