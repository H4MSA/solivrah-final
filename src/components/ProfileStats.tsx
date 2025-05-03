import React from 'react';
import { PremiumCard } from '@/components/PremiumCard';
import { useApp } from '@/context/AppContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import { Calendar, Trophy, Award, Target } from 'lucide-react';

export const ProfileStats: React.FC = () => {
  const { streak, xp, completedQuests } = useApp();
  
  // Sample data - in a real app, we would load this from the database
  const weeklyActivity = [
    { day: 'Mon', activity: Math.floor(Math.random() * 100) },
    { day: 'Tue', activity: Math.floor(Math.random() * 100) },
    { day: 'Wed', activity: Math.floor(Math.random() * 100) },
    { day: 'Thu', activity: Math.floor(Math.random() * 100) },
    { day: 'Fri', activity: Math.floor(Math.random() * 100) },
    { day: 'Sat', activity: Math.floor(Math.random() * 100) },
    { day: 'Sun', activity: Math.floor(Math.random() * 100) },
  ];
  
  const monthlyProgress = [
    { month: 'Jan', xp: Math.floor(Math.random() * 1000) },
    { month: 'Feb', xp: Math.floor(Math.random() * 1000) },
    { month: 'Mar', xp: Math.floor(Math.random() * 1000) },
    { month: 'Apr', xp: Math.floor(Math.random() * 1000) },
    { month: 'May', xp: xp },
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-black/90 border border-white/10 px-3 py-2 rounded-lg backdrop-blur-md">
          <p className="text-white/90 text-xs">{`${label} : ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };

  const statItems = [
    { label: "Current Streak", value: `${streak} days`, icon: <Calendar size={18} className="text-white/60" /> },
    { label: "Total XP", value: `${xp} points`, icon: <Trophy size={18} className="text-white/60" /> },
    { label: "Completed Quests", value: completedQuests.toString(), icon: <Target size={18} className="text-white/60" /> },
    { label: "Badges Earned", value: "4 of 12", icon: <Award size={18} className="text-white/60" /> },
  ];
  
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
    <motion.div 
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants}>
        <PremiumCard className="p-5">
          <h3 className="text-lg font-medium mb-4">Weekly Activity</h3>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={weeklyActivity}
                margin={{ top: 10, right: 5, left: -10, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 12 }} />
                <YAxis hide={true} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
                <Bar dataKey="activity" fill="rgba(255,255,255,0.5)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </PremiumCard>
      </motion.div>

      <motion.div variants={itemVariants}>
        <PremiumCard className="p-5">
          <h3 className="text-lg font-medium mb-4">XP Progress</h3>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={monthlyProgress}
                margin={{ top: 10, right: 5, left: -10, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 12 }} />
                <YAxis hide={true} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
                <Bar dataKey="xp" fill="rgba(255,255,255,0.5)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </PremiumCard>
      </motion.div>
      
      <motion.div variants={itemVariants}>
        <PremiumCard className="p-5">
          <h3 className="text-lg font-medium mb-4">Summary Stats</h3>
          <div className="space-y-3">
            {statItems.map((item, index) => (
              <div key={index} className="flex items-center gap-3 bg-white/5 p-3 rounded-lg border border-white/5">
                <div className="bg-white/5 w-8 h-8 rounded-full flex items-center justify-center border border-white/10">
                  {item.icon}
                </div>
                <div className="flex-1">
                  <span className="text-white/80">{item.label}</span>
                </div>
                <span className="text-white font-medium">{item.value}</span>
              </div>
            ))}
          </div>
        </PremiumCard>
      </motion.div>
    </motion.div>
  );
};
