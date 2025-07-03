import React from 'react';
import { motion } from 'framer-motion';
import { Flame } from 'lucide-react';

interface LeaderboardCardProps {
  rank: number;
  username: string;
  streak: number;
  xp: number;
  category: string;
  isUser?: boolean;
}

const LeaderboardCard: React.FC<LeaderboardCardProps> = ({ 
  rank, 
  username, 
  streak, 
  xp, 
  category, 
  isUser = false 
}) => {
  return (
    <motion.div 
      className={`flex items-center gap-4 p-5 rounded-2xl transition-all duration-300 hover:scale-[1.02] ${
        isUser 
          ? 'bg-gradient-to-r from-white/20 to-gray-200/20 border border-white/30 backdrop-blur-sm' 
          : 'bg-gray-900/50 hover:bg-gray-800/70 border border-gray-800/50'
      }`}
      whileHover={{ y: -3 }}
    >
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg ${
        rank === 1 ? 'bg-gradient-to-br from-yellow-400 to-yellow-500 text-black' :
        rank === 2 ? 'bg-gradient-to-br from-gray-300 to-gray-400 text-black' :
        rank === 3 ? 'bg-gradient-to-br from-amber-500 to-amber-600 text-black' :
        'bg-gray-800/60 text-gray-300 border border-gray-700/50'
      }`}>
        {rank}
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-1">
          <h4 className="text-white font-bold text-lg">{username}</h4>
          {isUser && <span className="text-black text-xs bg-white/90 px-2 py-1 rounded-full font-bold">YOU</span>}
        </div>
        <div className="flex items-center gap-4 text-sm text-gray-400">
          <span className="flex items-center gap-1 font-medium">
            <Flame size={14} strokeWidth={2} />
            {streak} days
          </span>
          <span className="font-medium">{xp.toLocaleString()} XP</span>
          <span className="text-gray-500">{category}</span>
        </div>
      </div>
    </motion.div>
  );
};

export default LeaderboardCard;