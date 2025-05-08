
import React, { useState } from "react";
import { GlassCard } from "@/components/GlassCard";
import { TabNavigation } from "@/components/TabNavigation";
import { FiStar, FiUsers, FiMessageCircle, FiHeart } from "react-icons/fi";
import { useApp } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

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
            className="space-y-5"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {leaderboards.map((user, index) => (
              <motion.div key={index} variants={itemVariants}>
                <GlassCard className="p-6 flex items-center gap-5">
                  <div className="bg-white/10 backdrop-blur-sm rounded-full w-14 h-14 flex items-center justify-center font-semibold border border-white/10 text-lg">
                    #{index + 1}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold">{user.name}</h3>
                    <div className="flex items-center gap-5 mt-2 text-base text-white/70">
                      <span className="flex items-center gap-2">
                        <FiStar className="text-white/80" /> {user.streak} day streak
                      </span>
                      <span>{user.xp} XP</span>
                      <span className="bg-white/10 px-3 py-1.5 rounded-full text-sm">{user.theme}</span>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </motion.div>
        );
      case "groups":
        return (
          <motion.div 
            className="space-y-5"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {groups.map((group, index) => (
              <motion.div key={index} variants={itemVariants}>
                <GlassCard className="p-6 space-y-4">
                  <h3 className="text-lg font-semibold">{group.name}</h3>
                  <div className="flex items-center gap-5 text-base text-white/70">
                    <span className="flex items-center gap-2">
                      <FiUsers /> {group.members} members
                    </span>
                    <span className="bg-white/10 px-3 py-1.5 rounded-full text-sm">{group.theme}</span>
                  </div>
                  <Button 
                    className="w-full bg-white/10 backdrop-blur-sm text-white text-base font-medium px-6 py-4 rounded-xl mt-4 border border-white/10 hover:bg-white/15 transition-all"
                  >
                    Join Group
                  </Button>
                </GlassCard>
              </motion.div>
            ))}
          </motion.div>
        );
      case "posts":
        return (
          <motion.div 
            className="space-y-5"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {posts.map((post, index) => (
              <motion.div key={index} variants={itemVariants}>
                <GlassCard className="p-6 space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">{post.name}</h3>
                    <span className="text-sm text-white/60">{post.time}</span>
                  </div>
                  <p className="text-base leading-relaxed py-2">{post.content}</p>
                  <div className="flex items-center justify-between pt-2">
                    <div className="text-sm text-white/70 bg-white/10 px-3 py-2 rounded-full">{post.theme}</div>
                    <button className="flex items-center gap-2 text-sm text-white/70 bg-white/10 px-4 py-2 rounded-full hover:bg-white/15 transition-all">
                      <FiHeart className={post.likes > 30 ? "text-red-400" : ""} /> {post.likes}
                    </button>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
            
            <GlassCard className="p-6 space-y-5">
              <textarea
                placeholder="Share your journey..."
                className="w-full bg-black/20 border border-white/10 rounded-xl p-5 outline-none resize-none h-28 text-white placeholder:text-white/50 text-base"
              />
              <div className="flex justify-end">
                <Button 
                  className="bg-white text-black px-6 py-3 rounded-xl font-medium hover:bg-white/90 transition-all"
                >
                  Post
                </Button>
              </div>
            </GlassCard>
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
    <div className="min-h-screen pb-28">
      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-bold mb-6">Community</h1>
        
        <div className="flex gap-4 overflow-x-auto pb-4 -mx-1 px-1">
          <button 
            className={`px-6 py-4 rounded-xl text-base font-medium whitespace-nowrap ${
              activeTab === "leaderboards" 
                ? "bg-white text-black shadow-lg" 
                : "bg-white/10 backdrop-blur-sm text-white border border-white/10"
            }`}
            onClick={() => setActiveTab("leaderboards")}
          >
            <FiStar className="inline mr-2" /> Leaderboards
          </button>
          <button 
            className={`px-6 py-4 rounded-xl text-base font-medium whitespace-nowrap ${
              activeTab === "groups" 
                ? "bg-white text-black shadow-lg" 
                : "bg-white/10 backdrop-blur-sm text-white border border-white/10"
            }`}
            onClick={() => setActiveTab("groups")}
          >
            <FiUsers className="inline mr-2" /> Groups
          </button>
          <button 
            className={`px-6 py-4 rounded-xl text-base font-medium whitespace-nowrap ${
              activeTab === "posts" 
                ? "bg-white text-black shadow-lg" 
                : "bg-white/10 backdrop-blur-sm text-white border border-white/10"
            }`}
            onClick={() => setActiveTab("posts")}
          >
            <FiMessageCircle className="inline mr-2" /> Posts
          </button>
        </div>
        
        <div className="pt-2">
          {renderTabContent()}
        </div>
      </div>
      
      <TabNavigation />
    </div>
  );
};

export default Community;
