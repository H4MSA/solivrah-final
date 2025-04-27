
import React from "react";
import { TabNavigation } from "@/components/TabNavigation";
import { ThemeBackground } from "@/components/ThemeBackground";
import { useApp } from "@/context/AppContext";
import { PremiumCard } from "@/components/PremiumCard";
import { motion } from "framer-motion";
import { MessageSquare, Heart, Share, Users, User, Star } from "lucide-react";

const SocialFeed = () => {
  const { selectedTheme } = useApp();
  
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
  
  return (
    <div className="min-h-screen text-white pb-24">
      <ThemeBackground />
      
      <motion.div 
        className="px-5 pt-6 pb-24 space-y-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="flex justify-between items-center">
          <h1 className="text-xl font-medium">Social Feed</h1>
          <div className="flex items-center gap-2">
            <button className="w-10 h-10 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 flex items-center justify-center hover:bg-white/10 active:scale-95 transition-all">
              <Users size={18} />
            </button>
            <button className="w-10 h-10 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 flex items-center justify-center hover:bg-white/10 active:scale-95 transition-all">
              <User size={18} />
            </button>
          </div>
        </motion.div>
        
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Main feed - 3 columns wide on md screens */}
          <div className="md:col-span-3 space-y-4">
            {/* New post input */}
            <PremiumCard className="p-4">
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
              <PremiumCard key={post.id} className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
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
          
          {/* Sidebar - 1 column wide */}
          <div className="space-y-4">
            {/* Trending topics */}
            <PremiumCard className="p-4">
              <h3 className="font-medium mb-3">Trending Topics</h3>
              <div className="space-y-2">
                {trendingTopics.map((topic, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm text-white/80">#{topic}</span>
                    <span className="text-xs text-white/50">Trending</span>
                  </div>
                ))}
              </div>
            </PremiumCard>
            
            {/* Suggested users */}
            <PremiumCard className="p-4">
              <h3 className="font-medium mb-3">Suggested Users</h3>
              <div className="space-y-3">
                {suggestedUsers.map((user, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-xs">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <div className="text-sm font-medium">{user.name}</div>
                        <div className="text-xs text-white/60">{user.theme}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-xs bg-white/5 px-2 py-0.5 rounded-full border border-white/10">
                      <Star size={12} />
                      <span>{user.streak}</span>
                    </div>
                  </div>
                ))}
              </div>
            </PremiumCard>
          </div>
        </motion.div>
      </motion.div>
      
      <TabNavigation />
    </div>
  );
};

export default SocialFeed;
