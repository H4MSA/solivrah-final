
import React from 'react';
import { GlassCard } from '@/components/GlassCard';
import { useApp } from '@/context/AppContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';

export const ProfileStats = () => {
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
  
  return (
    <div className="space-y-6">
      <GlassCard variant="dark" className="p-4">
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
              <Bar dataKey="activity" fill="rgba(255,255,255,0.6)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>

      <GlassCard variant="dark" className="p-4">
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
              <Bar dataKey="xp" fill="rgba(255,255,255,0.6)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>
      
      <GlassCard variant="dark" className="p-4">
        <h3 className="text-lg font-medium mb-3">Summary Stats</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center bg-white/5 p-3 rounded-lg">
            <span className="text-white/80">Current Streak</span>
            <span className="text-white font-medium">{streak} days</span>
          </div>
          <div className="flex justify-between items-center bg-white/5 p-3 rounded-lg">
            <span className="text-white/80">Total XP</span>
            <span className="text-white font-medium">{xp} points</span>
          </div>
          <div className="flex justify-between items-center bg-white/5 p-3 rounded-lg">
            <span className="text-white/80">Completed Quests</span>
            <span className="text-white font-medium">{completedQuests}</span>
          </div>
          <div className="flex justify-between items-center bg-white/5 p-3 rounded-lg">
            <span className="text-white/80">Badges Earned</span>
            <span className="text-white font-medium">4 of 12</span>
          </div>
        </div>
      </GlassCard>
    </div>
  );
};
