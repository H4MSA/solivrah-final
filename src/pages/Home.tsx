
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, Camera, User, Heart, Target, Clock, Flame, Trophy, Brain, Shield, ChevronRight } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { ThemeBackground } from "@/components/ThemeBackground";
import QuestCard from "@/components/ui/QuestCard";
import StatCard from "@/components/ui/StatCard";

const Home = () => {
  const navigate = useNavigate();
  const { streak, xp, user } = useApp();
  const [greeting, setGreeting] = useState("Good morning");
  
  useEffect(() => {    
    const hour = new Date().getHours();
    if (hour >= 12 && hour < 17) {
      setGreeting("Good afternoon");
    } else if (hour >= 17) {
      setGreeting("Good evening");
    }
  }, []);
  
  const displayName = user?.user_metadata?.username || user?.email?.split('@')[0] || "Friend";
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
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
    <div className="min-h-screen text-white pb-24 px-6 py-8 max-w-md mx-auto">
      <ThemeBackground />
      
      <motion.div 
        className="space-y-8"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-black text-white mb-2">Welcome back, {displayName}</h1>
            <p className="text-gray-400 text-lg font-medium">Let's build something amazing today</p>
          </div>
          <div className="flex gap-3">
            <button className="p-4 bg-gray-900/60 backdrop-blur-sm rounded-2xl border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300">
              <Camera size={22} className="text-gray-400" strokeWidth={2} />
            </button>
            <button className="p-4 bg-gray-900/60 backdrop-blur-sm rounded-2xl border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300">
              <User size={22} className="text-gray-400" strokeWidth={2} />
            </button>
          </div>
        </motion.div>

        {/* Search */}
        <motion.div variants={itemVariants} className="relative">
          <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400" size={22} strokeWidth={2} />
          <input
            type="text"
            placeholder="Search your quests and goals..."
            className="w-full bg-gray-900/60 backdrop-blur-sm border border-gray-700/50 rounded-2xl pl-14 pr-6 py-5 text-white placeholder-gray-400 focus:outline-none focus:border-white/30 focus:bg-gray-900/80 transition-all duration-300 text-lg"
          />
        </motion.div>

        {/* Daily Inspiration */}
        <motion.div variants={itemVariants} className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-sm rounded-3xl p-8 border border-gray-700/50">
          <div className="flex items-start gap-5">
            <div className="p-4 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
              <Heart size={28} className="text-white" strokeWidth={2} />
            </div>
            <div>
              <h3 className="text-white/80 font-bold text-sm uppercase tracking-wider mb-3">Daily Inspiration</h3>
              <p className="text-white text-2xl font-bold leading-relaxed">
                "Every small step forward is a victory worth celebrating."
              </p>
            </div>
          </div>
        </motion.div>

        {/* Current Quest */}
        <motion.div variants={itemVariants}>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
              <Target size={20} className="text-white" strokeWidth={2} />
            </div>
            <h2 className="text-white font-black text-2xl">Today's Quest</h2>
          </div>
          <QuestCard
            title="Time Awareness Challenge"
            description="Document your daily activities to identify patterns and optimize your productivity for peak performance."
            progress={25}
            xp={100}
            icon={Clock}
            difficulty="Easy"
            onClick={() => navigate('/quests')}
          />
        </motion.div>

        {/* Stats Row */}
        <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4">
          <StatCard
            icon={Flame}
            value={streak.toString()}
            label="Day Streak"
            gradient={true}
          />
          <StatCard
            icon={Trophy}
            value={xp.toString()}
            label="Total XP"
          />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Home;
