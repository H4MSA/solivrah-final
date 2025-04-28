
import React, { useState } from "react";
import { TabNavigation } from "@/components/TabNavigation";
import { ThemeBackground } from "@/components/ThemeBackground";
import { useApp } from "@/context/AppContext";
import { GlassPane, GlassCard, GlassButton, GlassBadge } from "@/components/ui/glass";
import { motion } from "framer-motion";
import { 
  MessageSquare, 
  Heart, 
  Share, 
  Users, 
  User, 
  Star, 
  Search, 
  Bell, 
  ChevronRight, 
  Globe, 
  UserPlus, 
  Sparkles,
  Flame,
  UserCheck,
  Flag,
  MessageCircle
} from "lucide-react";

const Social = () => {
  const { selectedTheme } = useApp();
  const [activeTab, setActiveTab] = useState<"feed" | "groups" | "discover">("feed");
  
  // Sample data
  const posts = [
    {
      id: 1, 
      author: "FocusMaster", 
      content: "Just completed Day 15! The 'Focus Mode' technique has completely changed how I work. Anyone else having success with this?", 
      likes: 24, 
      theme: "Focus", 
      time: "2h ago",
      comments: 5,
      avatar: null
    },
    {
      id: 2, 
      author: "DisciplineDaily", 
      content: "My 30-day streak has helped me establish a morning routine that sticks. So grateful for this community!", 
      likes: 42, 
      theme: "Discipline", 
      time: "5h ago",
      comments: 12,
      avatar: null
    },
    {
      id: 3, 
      author: "ResilienceBuilder", 
      content: "Failed yesterday but got back up today. That's what resilience is all about! Don't give up on your journey.", 
      likes: 56, 
      theme: "Resilience", 
      time: "1d ago",
      comments: 8,
      avatar: null
    },
    {
      id: 4, 
      author: "FocusedMind", 
      content: "Has anyone tried the deep work technique from day 4? The results are incredible for my productivity.", 
      likes: 19, 
      theme: "Focus", 
      time: "1d ago",
      comments: 15,
      avatar: null
    },
  ];
  
  const communities = [
    { 
      id: 1,
      name: "Focus Masters", 
      members: 230, 
      theme: "Focus",
      description: "A community for sharing focus techniques and deep work strategies.",
      active: true
    },
    { 
      id: 2,
      name: "Discipline Circle", 
      members: 187, 
      theme: "Discipline",
      description: "Building habits together with accountability and support.",
      active: true
    },
    { 
      id: 3,
      name: "Resilience Community", 
      members: 156, 
      theme: "Resilience",
      description: "Learn to bounce back from setbacks and build mental toughness.",
      active: false
    },
    { 
      id: 4,
      name: "Habit Builders", 
      members: 128, 
      theme: "Discipline",
      description: "Structured approach to building lasting habits that change your life.",
      active: false
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
  
  const renderTabContent = () => {
    switch (activeTab) {
      case "groups":
        return (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-5"
          >
            <motion.div variants={itemVariants} className="space-y-2">
              <h2 className="text-lg font-medium text-white">Your Communities</h2>
              <div className="space-y-3">
                {communities.filter(c => c.active).map(community => (
                  <GlassCard
                    key={community.id}
                    variant="frost"
                    className="p-4"
                    interactive
                    hoverEffect
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center">
                          <Users size={16} className="text-white/80" />
                        </div>
                        <div>
                          <h3 className="font-medium">{community.name}</h3>
                          <p className="text-xs text-white/70 mt-1">{community.members} members</p>
                          <p className="text-sm text-white/70 mt-1">{community.description}</p>
                        </div>
                      </div>
                      <GlassBadge variant="subtle" className="h-6">
                        {community.theme}
                      </GlassBadge>
                    </div>
                    
                    <div className="flex justify-end mt-3">
                      <GlassButton variant="secondary" size="sm" iconLeft={<MessageCircle size={14} />}>
                        Join Chat
                      </GlassButton>
                    </div>
                  </GlassCard>
                ))}
              </div>
            </motion.div>
            
            <motion.div variants={itemVariants} className="space-y-2">
              <h2 className="text-lg font-medium text-white">Discover Communities</h2>
              <div className="space-y-3">
                {communities.filter(c => !c.active).map(community => (
                  <GlassCard
                    key={community.id}
                    variant="standard"
                    className="p-4"
                    interactive
                    hoverEffect
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center">
                          <Users size={16} className="text-white/80" />
                        </div>
                        <div>
                          <h3 className="font-medium">{community.name}</h3>
                          <p className="text-xs text-white/70 mt-1">{community.members} members</p>
                          <p className="text-sm text-white/70 mt-1">{community.description}</p>
                        </div>
                      </div>
                      <GlassBadge variant="subtle" className="h-6">
                        {community.theme}
                      </GlassBadge>
                    </div>
                    
                    <div className="flex justify-end mt-3">
                      <GlassButton variant="secondary" size="sm" iconLeft={<UserPlus size={14} />}>
                        Join
                      </GlassButton>
                    </div>
                  </GlassCard>
                ))}
              </div>
            </motion.div>
          </motion.div>
        );
      
      case "discover":
        return (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-5"
          >
            <motion.div variants={itemVariants} className="relative">
              <GlassInput 
                icon={<Search size={16} />} 
                placeholder="Search for users or communities..."
                className="mb-4"
              />
            </motion.div>
            
            <motion.div variants={itemVariants} className="space-y-2">
              <h2 className="text-lg font-medium text-white">Trending Topics</h2>
              <GlassPane variant="frost" className="p-3">
                <div className="flex flex-wrap gap-2">
                  {trendingTopics.map((topic, index) => (
                    <GlassBadge key={index} className="px-3 py-1.5 text-sm">
                      {topic}
                    </GlassBadge>
                  ))}
                </div>
              </GlassPane>
            </motion.div>
            
            <motion.div variants={itemVariants} className="space-y-2">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium text-white">Suggested People</h2>
                <GlassButton variant="ghost" size="sm" iconRight={<ChevronRight size={14} />}>
                  View All
                </GlassButton>
              </div>
              <div className="space-y-3">
                {suggestedUsers.map((user, index) => (
                  <GlassPane
                    key={index}
                    variant="frost"
                    className="p-3"
                    interactive
                    hoverEffect
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-center">
                          {user.name[0]}
                        </div>
                        <div>
                          <h3 className="font-medium">{user.name}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-white/70">{user.theme}</span>
                            <div className="flex items-center gap-1">
                              <Flame size={12} className="text-white/70" />
                              <span className="text-xs text-white/70">{user.streak} streak</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <GlassButton variant="secondary" size="sm" iconLeft={<UserPlus size={14} />}>
                        Follow
                      </GlassButton>
                    </div>
                  </GlassPane>
                ))}
              </div>
            </motion.div>
          </motion.div>
        );
      
      default: // feed tab
        return (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-5"
          >
            {/* New post input */}
            <motion.div variants={itemVariants} className="mb-6">
              <GlassCard className="p-4 backdrop-blur-xl">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-xl border border-white/10 flex items-center justify-center">
                    <User size={16} className="text-white/80" />
                  </div>
                  <div className="flex-1">
                    <textarea 
                      className="w-full bg-transparent resize-none border-none outline-none text-white placeholder:text-white/50 h-16"
                      placeholder="Share your journey with the community..."
                    />
                    <div className="flex justify-end mt-2">
                      <GlassButton variant="secondary" size="sm">
                        Share
                      </GlassButton>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
            
            {/* Feed posts */}
            {posts.map((post, index) => (
              <motion.div key={post.id} variants={itemVariants}>
                <GlassCard 
                  variant="frost" 
                  className="p-0 overflow-hidden"
                >
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-xl border border-white/10 flex items-center justify-center">
                          {post.author.charAt(0)}
                        </div>
                        <div>
                          <h3 className="font-medium text-white">{post.author}</h3>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-white/60">{post.time}</span>
                            <GlassBadge variant="subtle" className="h-5">
                              {post.theme}
                            </GlassBadge>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-white/90 text-sm mb-4 leading-relaxed">{post.content}</p>
                    
                    <div className="border-t border-white/5 mt-3 pt-3 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <button className="flex items-center gap-1.5 text-white/70 hover:text-white/90 transition-colors">
                          <Heart size={16} />
                          <span className="text-xs">{post.likes}</span>
                        </button>
                        <button className="flex items-center gap-1.5 text-white/70 hover:text-white/90 transition-colors">
                          <MessageSquare size={16} />
                          <span className="text-xs">{post.comments}</span>
                        </button>
                      </div>
                      <button className="flex items-center gap-1.5 text-white/70 hover:text-white/90 transition-colors">
                        <Share size={16} />
                      </button>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </motion.div>
        );
    }
  };
  
  return (
    <div className="min-h-screen pb-32 text-white">
      <div className="px-5 pt-6 pb-24">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold bg-gradient-to-b from-white to-white/80 bg-clip-text text-transparent">Community</h1>
          <div className="flex items-center gap-2">
            <GlassButton 
              variant="secondary" 
              size="sm"
              className="w-10 h-10 p-0 rounded-full flex items-center justify-center"
            >
              <Bell size={18} />
            </GlassButton>
            <GlassButton 
              variant="secondary" 
              size="sm"
              className="w-10 h-10 p-0 rounded-full flex items-center justify-center"
            >
              <Globe size={18} />
            </GlassButton>
          </div>
        </div>
        
        {/* Tab Navigation */}
        <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-1">
          <div className="flex items-center gap-1">
            <GlassButton
              variant={activeTab === "feed" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("feed")}
            >
              Feed
            </GlassButton>
            <GlassButton
              variant={activeTab === "groups" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("groups")}
            >
              Communities
            </GlassButton>
            <GlassButton
              variant={activeTab === "discover" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("discover")}
            >
              Discover
            </GlassButton>
          </div>
        </div>
        
        {/* Content Area */}
        <div className="pb-20">
          {renderTabContent()}
        </div>
      </div>
      
      <TabNavigation />
    </div>
  );
};

export default Social;
