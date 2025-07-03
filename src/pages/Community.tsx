
import React from "react";
import { motion } from "framer-motion";
import { Search, TrendingUp, Users, MessageCircle } from "lucide-react";
import { ThemeBackground } from "@/components/ThemeBackground";
import LeaderboardCard from "@/components/ui/LeaderboardCard";

const Community = () => {
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
        <motion.div variants={itemVariants} className="flex items-center justify-between">
          <h1 className="text-4xl font-black text-white">Community</h1>
        </motion.div>

        <motion.div variants={itemVariants} className="relative">
          <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400" size={22} strokeWidth={2} />
          <input
            type="text"
            placeholder="Find inspiring people..."
            className="w-full bg-gray-900/60 backdrop-blur-sm border border-gray-700/50 rounded-2xl pl-14 pr-6 py-5 text-white placeholder-gray-400 focus:outline-none focus:border-white/30 focus:bg-gray-900/80 transition-all duration-300 text-lg"
          />
        </motion.div>

        <motion.div variants={itemVariants} className="flex gap-4 overflow-x-auto pb-2">
          <button className="bg-white text-black px-8 py-4 rounded-2xl font-bold transition-all duration-300 hover:bg-gray-100 whitespace-nowrap">
            <TrendingUp size={18} className="inline mr-3" strokeWidth={2} />
            Leaderboard
          </button>
          <button className="bg-gray-900/60 backdrop-blur-sm border border-gray-700/50 text-white px-8 py-4 rounded-2xl font-bold transition-all duration-300 hover:bg-gray-800/70 whitespace-nowrap">
            <Users size={18} className="inline mr-3" strokeWidth={2} />
            Groups
          </button>
          <button className="bg-gray-900/60 backdrop-blur-sm border border-gray-700/50 text-white px-8 py-4 rounded-2xl font-bold transition-all duration-300 hover:bg-gray-800/70 whitespace-nowrap">
            <MessageCircle size={18} className="inline mr-3" strokeWidth={2} />
            Discussion
          </button>
        </motion.div>

        <motion.div variants={itemVariants} className="space-y-4">
          <LeaderboardCard rank={1} username="AchieveMore" streak={30} xp={1500} category="Discipline" />
          <LeaderboardCard rank={2} username="FocusMaster" streak={25} xp={1350} category="Focus" />
          <LeaderboardCard rank={3} username="DailyGrinder" streak={21} xp={1200} category="Consistency" />
          <LeaderboardCard rank={4} username="Alex Johnson" streak={0} xp={0} category="Just Started" isUser={true} />
          <LeaderboardCard rank={5} username="MindfulWarrior" streak={15} xp={820} category="Resilience" />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Community;
