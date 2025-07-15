import { motion } from 'framer-motion';
import { useApp } from '@/context/AppContext';
import { useMemo } from 'react';

interface ProgressDashboardProps {
  showDetailed?: boolean;
  timeframe?: 'week' | 'month' | 'year';
}

interface StatCard {
  title: string;
  value: string | number;
  change?: number;
  icon: string;
  color: string;
  gradient: string;
}

export const ProgressDashboard = ({ 
  showDetailed = true, 
  timeframe = 'week' 
}: ProgressDashboardProps) => {
  const { streak, xp, completedQuests } = useApp();

  // Calculate level and progress to next level
  const currentLevel = Math.floor(xp / 100) + 1;
  const xpInCurrentLevel = xp % 100;
  const xpToNextLevel = 100 - xpInCurrentLevel;

  // Mock data for demonstration - in real app, this would come from API
  const weeklyData = useMemo(() => [
    { day: 'Mon', quests: 3, xp: 45 },
    { day: 'Tue', quests: 2, xp: 30 },
    { day: 'Wed', quests: 4, xp: 60 },
    { day: 'Thu', quests: 1, xp: 15 },
    { day: 'Fri', quests: 3, xp: 45 },
    { day: 'Sat', quests: 5, xp: 75 },
    { day: 'Sun', quests: 2, xp: 30 },
  ], []);

  const stats: StatCard[] = [
    {
      title: 'Current Streak',
      value: streak,
      change: streak > 0 ? 12 : 0,
      icon: '🔥',
      color: 'text-orange-400',
      gradient: 'from-orange-400 to-red-500'
    },
    {
      title: 'Total XP',
      value: xp.toLocaleString(),
      change: 15,
      icon: '⭐',
      color: 'text-gold-400',
      gradient: 'from-gold-400 to-gold-600'
    },
    {
      title: 'Quests Completed',
      value: completedQuests,
      change: 8,
      icon: '🎯',
      color: 'text-calm-400',
      gradient: 'from-calm-400 to-calm-600'
    },
    {
      title: 'Current Level',
      value: currentLevel,
      change: currentLevel > 1 ? 1 : 0,
      icon: '🏆',
      color: 'text-purple-400',
      gradient: 'from-purple-400 to-pink-500'
    }
  ];

  const maxXpInWeek = Math.max(...weeklyData.map(d => d.xp));

  return (
    <div className="space-y-6">
      {/* Level Progress */}
      <motion.div
        className="glass-card p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-semibold text-white">Level {currentLevel}</h3>
            <p className="text-gray-400">
              {xpToNextLevel} XP to level {currentLevel + 1}
            </p>
          </div>
          <div className="text-3xl">🏆</div>
        </div>
        
        <div className="relative">
          <div className="w-full bg-white/10 rounded-full h-3">
            <motion.div
              className="bg-wellness-gradient h-3 rounded-full relative overflow-hidden"
              initial={{ width: 0 }}
              animate={{ width: `${xpInCurrentLevel}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            >
              {/* Shimmer effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                animate={{ x: [-100, 200] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              />
            </motion.div>
          </div>
          <div className="flex justify-between text-sm text-gray-400 mt-2">
            <span>{xpInCurrentLevel} XP</span>
            <span>100 XP</span>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            className="glass-card p-4 relative overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ y: -2 }}
          >
            {/* Background gradient */}
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-5`} />
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">{stat.icon}</span>
                {stat.change && stat.change > 0 && (
                  <div className="flex items-center text-green-400 text-xs">
                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                    +{stat.change}%
                  </div>
                )}
              </div>
              
              <div className={`text-2xl font-bold ${stat.color} mb-1`}>
                {stat.value}
              </div>
              
              <div className="text-xs text-gray-400">
                {stat.title}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Weekly Activity Chart */}
      {showDetailed && (
        <motion.div
          className="glass-card p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h3 className="text-lg font-semibold text-white mb-6">Weekly Activity</h3>
          
          <div className="space-y-4">
            {/* XP Chart */}
            <div>
              <div className="flex justify-between text-sm text-gray-400 mb-3">
                <span>Experience Points</span>
                <span>{weeklyData.reduce((sum, day) => sum + day.xp, 0)} XP this week</span>
              </div>
              
              <div className="flex items-end space-x-2 h-24">
                {weeklyData.map((day, index) => (
                  <div key={day.day} className="flex-1 flex flex-col items-center">
                    <motion.div
                      className="w-full bg-calm-500/20 rounded-t-lg relative overflow-hidden"
                      style={{ height: `${(day.xp / maxXpInWeek) * 80}px` }}
                      initial={{ height: 0 }}
                      animate={{ height: `${(day.xp / maxXpInWeek) * 80}px` }}
                      transition={{ duration: 0.8, delay: index * 0.1 }}
                    >
                      <motion.div
                        className="absolute inset-0 bg-wellness-gradient"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
                      />
                    </motion.div>
                    <span className="text-xs text-gray-400 mt-2">{day.day}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quest Completion Chart */}
            <div>
              <div className="flex justify-between text-sm text-gray-400 mb-3">
                <span>Quests Completed</span>
                <span>{weeklyData.reduce((sum, day) => sum + day.quests, 0)} quests this week</span>
              </div>
              
              <div className="flex items-center space-x-2">
                {weeklyData.map((day, index) => (
                  <div key={`quest-${day.day}`} className="flex-1">
                    <div className="flex space-x-1">
                      {[...Array(5)].map((_, questIndex) => (
                        <motion.div
                          key={questIndex}
                          className={`w-2 h-2 rounded-full ${
                            questIndex < day.quests 
                              ? 'bg-calm-500' 
                              : 'bg-white/10'
                          }`}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ 
                            duration: 0.3, 
                            delay: index * 0.1 + questIndex * 0.05 
                          }}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-gray-400 mt-1 block text-center">
                      {day.day}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Achievements Preview */}
      <motion.div
        className="glass-card p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <h3 className="text-lg font-semibold text-white mb-4">Recent Achievements</h3>
        
        <div className="space-y-3">
          {[
            { icon: '🔥', title: 'Week Warrior', description: '7-day streak achieved', earned: true },
            { icon: '⭐', title: 'XP Master', description: 'Earned 500 XP', earned: true },
            { icon: '🎯', title: 'Quest Hunter', description: 'Complete 10 quests', earned: false, progress: 7 },
            { icon: '🧘', title: 'Mindful Moment', description: '30 days of meditation', earned: false, progress: 12 },
          ].map((achievement, index) => (
            <motion.div
              key={achievement.title}
              className={`flex items-center space-x-3 p-3 rounded-lg transition-all ${
                achievement.earned 
                  ? 'bg-green-500/10 border border-green-500/20' 
                  : 'bg-white/5 border border-white/10'
              }`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
            >
              <div className={`text-2xl ${achievement.earned ? 'grayscale-0' : 'grayscale'}`}>
                {achievement.icon}
              </div>
              
              <div className="flex-1">
                <div className={`font-medium ${
                  achievement.earned ? 'text-green-400' : 'text-white'
                }`}>
                  {achievement.title}
                </div>
                <div className="text-sm text-gray-400">
                  {achievement.description}
                </div>
                
                {!achievement.earned && achievement.progress && (
                  <div className="mt-2">
                    <div className="w-full bg-white/10 rounded-full h-1">
                      <motion.div
                        className="bg-calm-500 h-1 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${(achievement.progress / 10) * 100}%` }}
                        transition={{ duration: 1, delay: 0.8 + index * 0.1 }}
                      />
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {achievement.progress}/10
                    </div>
                  </div>
                )}
              </div>
              
              {achievement.earned && (
                <div className="text-green-400">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default ProgressDashboard;
