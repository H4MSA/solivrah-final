
import React, { useState } from "react";
import { TabNavigation } from "@/components/TabNavigation";
import { ThemeBackground } from "@/components/ThemeBackground";
import { useApp } from "@/context/AppContext";
import { PremiumCard } from "@/components/PremiumCard";
import { motion } from "framer-motion";
import { MessageSquare, Heart, Share, Users, User, Star, Search, Bell, ChevronRight } from "lucide-react";

const Social = () => {
  const { selectedTheme } = useApp();
  const [activeTab, setActiveTab] = useState("feed");
  
  // Sample data
  const posts = [
    {
      id: 1, 
      author: "FocusMaster", 
      content: "Just completed Day 15! The 'Focus Mode' technique has completely changed how I work.", 
      likes: 24, 
      theme: "Focus", 
      time: "2h ago",
      comments: 5
    },
    {
      id: 2, 
      author: "DisciplineDaily", 
      content: "My 30-day streak has helped me establish a morning routine that sticks. So grateful for this community!", 
      likes: 42, 
      theme: "Discipline", 
      time: "5h ago",
      comments: 12
    },
    {
      id: 3, 
      author: "ResilienceBuilder", 
      content: "Failed yesterday but got back up today. That's what resilience is all about! Don't give up on your journey.", 
      likes: 56, 
      theme: "Resilience", 
      time: "1d ago",
      comments: 8
    },
    {
      id: 4, 
      author: "FocusedMind", 
      content: "Has anyone tried the deep work technique from day 4? The results are incredible for my productivity.", 
      likes: 19, 
      theme: "Focus", 
      time: "1d ago",
      comments: 15
    },
  ];
  
  const trendingTopics = ["Morning Routine", "Deep Focus", "Habit Stacking", "Time Blocking"];
  
  const suggestedUsers = [
    { name: "ProductivityPro", theme: "Discipline", streak: 45 },
    { name: "MindfulMotivator", theme: "Resilience", streak: 30 },
    { name: "FocusFinder", theme: "Focus", streak: 22 }
  ];
  
  const groups = [
    { name: "Focus Masters", members: 230, theme: "Focus" },
    { name: "Discipline Circle", members: 187, theme: "Discipline" },
    { name: "Resilience Community", members: 156, theme: "Resilience" },
    { name: "Habit Builders", members: 128, theme: "Discipline" },
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
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    }
  };
  
  const renderTabContent = () => {
    switch (activeTab) {
      case "feed":
        return (
          <div className="space-y-6">
            {/* New post input */}
            <PremiumCard className="p-5 backdrop-blur-xl">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/5 flex items-center justify-center">
                  <User size={18} />
                </div>
                <div className="flex-1">
                  <textarea 
                    className="w-full bg-transparent resize-none border-none outline-none text-white placeholder:text-white/50"
                    placeholder="Share your journey with the community..."
                    rows={2}
                  />
                  <div className="flex justify-end mt-2">
                    <button className="px-4 py-2 bg-white/10 hover:bg-white/15 rounded-lg text-sm backdrop-blur-sm border border-white/10 transition-all active:scale-95">
                      Share
                    </button>
                  </div>
                </div>
              </div>
            </PremiumCard>
            
            {/* Feed posts */}
            {posts.map((post) => (
              <PremiumCard key={post.id} className="p-5 backdrop-blur-xl">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 flex items-center justify-center">
                      {post.author.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-medium text-white">{post.author}</h3>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-white/60">{post.time}</span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-white/5 border border-white/10">
                          {post.theme}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <p className="text-white/80 text-sm mb-4">{post.content}</p>
                
                <div className="flex items-center justify-between border-t border-white/5 pt-3 mt-2">
                  <button className="flex items-center gap-1.5 text-white/70 hover:text-white text-sm transition-all">
                    <Heart size={16} className={post.likes > 30 ? "text-pink-400" : ""} />
                    <span>{post.likes}</span>
                  </button>
                  <button className="flex items-center gap-1.5 text-white/70 hover:text-white text-sm transition-all">
                    <MessageSquare size={16} />
                    <span>{post.comments}</span>
                  </button>
                  <button className="flex items-center gap-1.5 text-white/70 hover:text-white text-sm transition-all">
                    <Share size={16} />
                    <span>Share</span>
                  </button>
                </div>
              </PremiumCard>
            ))}
          </div>
        );
      case "groups":
        return (
          <div className="space-y-4">
            <div className="relative mb-4">
              <div className="absolute inset-y-0 left-3 flex items-center text-white/40">
                <Search size={18} />
              </div>
              <input 
                type="text" 
                placeholder="Search groups..." 
                className="w-full h-11 pl-10 pr-4 rounded-xl bg-white/5 backdrop-blur-xl border border-white/10 text-white placeholder:text-white/50 focus:outline-none"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {groups.map((group, index) => (
                <PremiumCard key={index} className="p-5 backdrop-blur-xl">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium text-white">{group.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-white/60 flex items-center gap-1">
                          <Users size={12} /> {group.members} members
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-white/5 border border-white/10">
                          {group.theme}
                        </span>
                      </div>
                    </div>
                    <button className="p-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/5">
                      <ChevronRight size={16} />
                    </button>
                  </div>
                  
                  <button className="w-full mt-3 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-sm backdrop-blur-sm border border-white/10 transition-all">
                    Join Group
                  </button>
                </PremiumCard>
              ))}
            </div>
            
            <PremiumCard className="p-5 backdrop-blur-xl">
              <div className="text-center">
                <h3 className="font-medium">Create Your Own Group</h3>
                <p className="text-sm text-white/70 mt-1 mb-3">Connect with like-minded people on your journey</p>
                <button className="py-2.5 px-4 bg-white text-black rounded-lg font-medium hover:bg-white/90 transition-all active:scale-95">
                  Start a Group
                </button>
              </div>
            </PremiumCard>
          </div>
        );
      case "discover":
        return (
          <div className="space-y-5">
            <div className="relative mb-4">
              <div className="absolute inset-y-0 left-3 flex items-center text-white/40">
                <Search size={18} />
              </div>
              <input 
                type="text" 
                placeholder="Discover people and content..." 
                className="w-full h-11 pl-10 pr-4 rounded-xl bg-white/5 backdrop-blur-xl border border-white/10 text-white placeholder:text-white/50 focus:outline-none"
              />
            </div>
            
            <div>
              <h3 className="font-medium mb-3">Trending Topics</h3>
              <div className="flex flex-wrap gap-2 mb-5">
                {trendingTopics.map((topic, index) => (
                  <span 
                    key={index} 
                    className="px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 backdrop-blur-sm border border-white/10 text-sm cursor-pointer transition-all"
                  >
                    #{topic}
                  </span>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="font-medium mb-3">Suggested Users</h3>
              <div className="space-y-3">
                {suggestedUsers.map((user, index) => (
                  <PremiumCard key={index} className="p-4 backdrop-blur-xl">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 flex items-center justify-center">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <h4 className="font-medium">{user.name}</h4>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-white/60">{user.theme}</span>
                            <span className="text-xs flex items-center gap-1 text-white/60">
                              <Star size={12} /> {user.streak} streak
                            </span>
                          </div>
                        </div>
                      </div>
                      <button className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/15 text-xs backdrop-blur-sm border border-white/10 transition-all">
                        Follow
                      </button>
                    </div>
                  </PremiumCard>
                ))}
              </div>
            </div>
          </div>
        );
      case "notifications":
        return (
          <div className="space-y-3">
            <PremiumCard className="p-4 backdrop-blur-xl">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-full bg-blue-500/20 backdrop-blur-sm">
                  <Star size={16} className="text-blue-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm"><span className="font-medium">DisciplineDaily</span> achieved a 30-day streak!</p>
                  <span className="text-xs text-white/60 mt-1 block">2 hours ago</span>
                </div>
              </div>
            </PremiumCard>
            
            <PremiumCard className="p-4 backdrop-blur-xl">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-full bg-pink-500/20 backdrop-blur-sm">
                  <Heart size={16} className="text-pink-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm"><span className="font-medium">FocusMaster</span> liked your post about meditation.</p>
                  <span className="text-xs text-white/60 mt-1 block">5 hours ago</span>
                </div>
              </div>
            </PremiumCard>
            
            <PremiumCard className="p-4 backdrop-blur-xl">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-full bg-violet-500/20 backdrop-blur-sm">
                  <MessageSquare size={16} className="text-violet-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm"><span className="font-medium">ResilienceBuilder</span> commented on your progress.</p>
                  <span className="text-xs text-white/60 mt-1 block">1 day ago</span>
                </div>
              </div>
            </PremiumCard>
            
            <PremiumCard className="p-4 backdrop-blur-xl">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-full bg-green-500/20 backdrop-blur-sm">
                  <Users size={16} className="text-green-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm"><span className="font-medium">Focus Masters</span> group invited you to join.</p>
                  <span className="text-xs text-white/60 mt-1 block">2 days ago</span>
                </div>
              </div>
            </PremiumCard>
          </div>
        );
      default:
        return <div className="text-center py-10">Select a tab to view content</div>;
    }
  };
  
  return (
    <div className="min-h-screen text-white pb-24">
      <ThemeBackground />
      
      <motion.div 
        className="px-5 pt-6 pb-24"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-medium">Social</h1>
          <div className="flex items-center gap-2">
            <button className="w-10 h-10 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 flex items-center justify-center hover:bg-white/10 active:scale-95 transition-all">
              <Bell size={18} />
            </button>
            <button className="w-10 h-10 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 flex items-center justify-center hover:bg-white/10 active:scale-95 transition-all">
              <User size={18} />
            </button>
          </div>
        </motion.div>
        
        <motion.div variants={itemVariants} className="overflow-x-auto mb-6 no-scrollbar">
          <div className="flex space-x-2 min-w-full">
            <button
              onClick={() => setActiveTab("feed")}
              className={`px-4 py-2.5 rounded-xl text-sm whitespace-nowrap transition-all ${
                activeTab === "feed"
                  ? "bg-white/10 text-white border border-white/20 backdrop-blur-xl"
                  : "bg-black/40 text-white/70 hover:text-white hover:bg-black/50 border border-white/5 backdrop-blur-sm"
              }`}
            >
              <MessageSquare className="inline mr-2 h-4 w-4" /> Feed
            </button>
            <button
              onClick={() => setActiveTab("groups")}
              className={`px-4 py-2.5 rounded-xl text-sm whitespace-nowrap transition-all ${
                activeTab === "groups"
                  ? "bg-white/10 text-white border border-white/20 backdrop-blur-xl"
                  : "bg-black/40 text-white/70 hover:text-white hover:bg-black/50 border border-white/5 backdrop-blur-sm"
              }`}
            >
              <Users className="inline mr-2 h-4 w-4" /> Groups
            </button>
            <button
              onClick={() => setActiveTab("discover")}
              className={`px-4 py-2.5 rounded-xl text-sm whitespace-nowrap transition-all ${
                activeTab === "discover"
                  ? "bg-white/10 text-white border border-white/20 backdrop-blur-xl"
                  : "bg-black/40 text-white/70 hover:text-white hover:bg-black/50 border border-white/5 backdrop-blur-sm"
              }`}
            >
              <Search className="inline mr-2 h-4 w-4" /> Discover
            </button>
            <button
              onClick={() => setActiveTab("notifications")}
              className={`px-4 py-2.5 rounded-xl text-sm whitespace-nowrap transition-all ${
                activeTab === "notifications"
                  ? "bg-white/10 text-white border border-white/20 backdrop-blur-xl"
                  : "bg-black/40 text-white/70 hover:text-white hover:bg-black/50 border border-white/5 backdrop-blur-sm"
              }`}
            >
              <Bell className="inline mr-2 h-4 w-4" /> Notifications
            </button>
          </div>
        </motion.div>
        
        <motion.div variants={itemVariants}>
          {renderTabContent()}
        </motion.div>
      </motion.div>
      
      <TabNavigation />
    </div>
  );
};

export default Social;
