
import React from "react";
import { motion } from "framer-motion";
import { User, Flame, Trophy, Target, Play, Award, Users } from "lucide-react";
import { ThemeBackground } from "@/components/ThemeBackground";
import StatCard from "@/components/ui/StatCard";
import { useApp } from "@/context/AppContext";

const Profile = () => {
  const { streak, xp } = useApp();
  
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

  const completedQuests = 0;

  return (
    <div className="min-h-screen text-white pb-24 px-6 py-8 max-w-md mx-auto">
      <ThemeBackground />
      
      <motion.div 
        className="space-y-8"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div variants={itemVariants} className="text-center">
          <div className="w-24 h-24 bg-gradient-to-br from-white/20 to-gray-200/20 backdrop-blur-sm rounded-3xl mx-auto mb-6 flex items-center justify-center border border-white/30">
            <User size={48} className="text-white" strokeWidth={2} />
          </div>
          <h2 className="text-3xl font-black text-white mb-2">Alex Johnson</h2>
          <p className="text-gray-400 text-lg font-medium">Resilience Explorer</p>
        </motion.div>

        <motion.div variants={itemVariants} className="grid grid-cols-3 gap-4">
          <StatCard icon={Flame} value={streak.toString()} label="Current Streak" />
          <StatCard icon={Trophy} value={xp.toString()} label="Total XP" />
          <StatCard icon={Target} value={completedQuests.toString()} label="Completed" />
        </motion.div>

        <motion.div variants={itemVariants} className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-sm rounded-3xl p-8 border border-gray-700/50">
          <h3 className="text-white font-black text-2xl mb-6">Level Progress</h3>
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-400 font-bold">Level 1</span>
            <span className="text-white font-black">{xp} / 1,000 XP</span>
          </div>
          <div className="w-full bg-gray-800/60 rounded-full h-4 mb-4 overflow-hidden">
            <motion.div 
              className="bg-gradient-to-r from-white to-gray-300 h-4 rounded-full transition-all duration-700"
              initial={{ width: 0 }}
              animate={{ width: `${(xp % 1000) / 10}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
          <p className="text-gray-400 font-medium">Complete quests to unlock new challenges and rewards!</p>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-sm rounded-3xl p-8 border border-gray-700/50">
          <h3 className="text-white font-black text-2xl mb-6">Achievements</h3>
          <div className="grid grid-cols-4 gap-6">
            <div className="text-center opacity-40">
              <div className="w-16 h-16 bg-gray-800/60 rounded-2xl flex items-center justify-center mx-auto mb-3 border border-gray-700/50">
                <Play size={24} className="text-gray-500" strokeWidth={2} />
              </div>
              <p className="text-xs text-gray-500 font-medium">First Quest</p>
            </div>
            <div className="text-center opacity-40">
              <div className="w-16 h-16 bg-gray-800/60 rounded-2xl flex items-center justify-center mx-auto mb-3 border border-gray-700/50">
                <Flame size={24} className="text-gray-500" strokeWidth={2} />
              </div>
              <p className="text-xs text-gray-500 font-medium">Week Warrior</p>
            </div>
            <div className="text-center opacity-40">
              <div className="w-16 h-16 bg-gray-800/60 rounded-2xl flex items-center justify-center mx-auto mb-3 border border-gray-700/50">
                <Award size={24} className="text-gray-500" strokeWidth={2} />
              </div>
              <p className="text-xs text-gray-500 font-medium">Goal Crusher</p>
            </div>
            <div className="text-center opacity-40">
              <div className="w-16 h-16 bg-gray-800/60 rounded-2xl flex items-center justify-center mx-auto mb-3 border border-gray-700/50">
                <Users size={24} className="text-gray-500" strokeWidth={2} />
              </div>
              <p className="text-xs text-gray-500 font-medium">Community</p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Profile;
