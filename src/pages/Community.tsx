
import React, { useState } from "react";
import { Star, Users, MessageCircle, Heart } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { TabNavigation } from "@/components/TabNavigation";

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
    hidden: { y: 10, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    }
  };
  
  const renderTabContent = () => {
    switch (activeTab) {
      case "leaderboards":
        return (
          <motion.div 
            className="space-y-3"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {leaderboards.map((user, index) => (
              <motion.div key={index} variants={itemVariants}>
                <div className="p-4 rounded-xl bg-[#1A1A1A] border border-[#333333] flex items-center gap-4">
                  <div className="bg-white/10 rounded-full w-12 h-12 flex items-center justify-center font-semibold border border-white/5 text-lg">
                    #{index + 1}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-semibold">{user.name}</h3>
                    <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-white/70">
                      <span className="flex items-center gap-1.5">
                        <Star size={14} className="text-white/60" /> {user.streak} day streak
                      </span>
                      <span>{user.xp} XP</span>
                      <span className="bg-black/30 px-2.5 py-1 rounded-full text-xs">{user.theme}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        );
      case "groups":
        return (
          <motion.div 
            className="space-y-3"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {groups.map((group, index) => (
              <motion.div key={index} variants={itemVariants}>
                <div className="p-4 rounded-xl bg-[#1A1A1A] border border-[#333333] space-y-3">
                  <h3 className="text-base font-semibold">{group.name}</h3>
                  <div className="flex items-center gap-4 text-sm text-white/70">
                    <span className="flex items-center gap-1.5">
                      <Users size={14} /> {group.members} members
                    </span>
                    <span className="bg-black/30 px-2.5 py-1 rounded-full text-xs">{group.theme}</span>
                  </div>
                  <Button 
                    className="w-full bg-white/10 text-white text-sm font-medium px-4 py-2.5 rounded-xl border border-white/10 hover:bg-white/15 transition-all"
                  >
                    Join Group
                  </Button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        );
      case "posts":
        return (
          <motion.div 
            className="space-y-3"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {posts.map((post, index) => (
              <motion.div key={index} variants={itemVariants}>
                <div className="p-4 rounded-xl bg-[#1A1A1A] border border-[#333333] space-y-3">
                  <div className="flex justify-between items-center">
                    <h3 className="text-base font-medium">{post.name}</h3>
                    <span className="text-xs text-white/50">{post.time}</span>
                  </div>
                  <p className="text-sm leading-relaxed">{post.content}</p>
                  <div className="flex items-center justify-between pt-1">
                    <div className="text-xs text-white/70 bg-black/30 px-2.5 py-1 rounded-full">{post.theme}</div>
                    <button className="flex items-center gap-1.5 text-xs text-white/70 bg-black/30 px-3 py-1 rounded-full hover:bg-black/50 transition-all">
                      <Heart size={14} className={post.likes > 30 ? "text-red-400" : ""} /> {post.likes}
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
            
            <div className="p-4 rounded-xl bg-[#1A1A1A] border border-[#333333] space-y-3 mt-6">
              <textarea
                placeholder="Share your journey..."
                className="w-full bg-black/30 border border-white/10 rounded-xl p-3 outline-none resize-none h-24 text-sm text-white placeholder:text-white/40"
              />
              <div className="flex justify-end">
                <Button 
                  className="bg-white text-black px-4 py-2 text-sm rounded-xl font-medium hover:bg-white/90 transition-all"
                >
                  Post
                </Button>
              </div>
            </div>
          </motion.div>
        );
      default:
        return (
          <div className="flex items-center justify-center h-40">
            <p className="text-white/70">Coming soon...</p>
          </div>
        );
    }
  };
  
  return (
    <div className="min-h-screen pb-24 bg-black">
      <div className="p-4 space-y-4 max-w-[430px] mx-auto">
        <h1 className="text-xl font-bold mb-4">Community</h1>
        
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1">
          <button 
            className={`px-4 py-2.5 rounded-full text-sm font-medium whitespace-nowrap ${
              activeTab === "leaderboards" 
                ? "bg-white text-black shadow-lg" 
                : "bg-[#1A1A1A] text-white border border-[#333333]"
            }`}
            onClick={() => setActiveTab("leaderboards")}
          >
            <Star className="inline mr-1.5 h-4 w-4" /> Leaderboards
          </button>
          <button 
            className={`px-4 py-2.5 rounded-full text-sm font-medium whitespace-nowrap ${
              activeTab === "groups" 
                ? "bg-white text-black shadow-lg" 
                : "bg-[#1A1A1A] text-white border border-[#333333]"
            }`}
            onClick={() => setActiveTab("groups")}
          >
            <Users className="inline mr-1.5 h-4 w-4" /> Groups
          </button>
          <button 
            className={`px-4 py-2.5 rounded-full text-sm font-medium whitespace-nowrap ${
              activeTab === "posts" 
                ? "bg-white text-black shadow-lg" 
                : "bg-[#1A1A1A] text-white border border-[#333333]"
            }`}
            onClick={() => setActiveTab("posts")}
          >
            <MessageCircle className="inline mr-1.5 h-4 w-4" /> Posts
          </button>
        </div>
        
        <div className="pt-1">
          {renderTabContent()}
        </div>
      </div>
      
      <TabNavigation />
    </div>
  );
};

export default Community;
