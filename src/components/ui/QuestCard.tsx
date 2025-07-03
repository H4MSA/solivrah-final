import React from 'react';
import { motion } from 'framer-motion';
import { Lock, Star, Play } from 'lucide-react';

interface QuestCardProps {
  title: string;
  description: string;
  progress?: number;
  xp: number;
  icon: React.ElementType;
  difficulty?: "Easy" | "Medium" | "Hard";
  isLocked?: boolean;
  onClick?: () => void;
}

const QuestCard: React.FC<QuestCardProps> = ({
  title,
  description,
  progress = 0,
  xp,
  icon: Icon,
  difficulty = "Easy",
  isLocked = false,
  onClick
}) => {
  return (
    <motion.div 
      className={`bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-sm rounded-3xl p-6 border transition-all duration-300 hover:scale-[1.02] ${
        isLocked 
          ? 'border-gray-800/50 opacity-60' 
          : 'border-gray-700/50 hover:border-gray-600/50 hover:bg-gradient-to-br hover:from-gray-800/95 hover:to-gray-700/95'
      }`}
      whileHover={!isLocked ? { y: -5 } : undefined}
    >
      <div className="flex items-start gap-5">
        <div className={`p-4 rounded-2xl transition-all duration-300 ${
          isLocked 
            ? 'bg-gray-800/50' 
            : 'bg-white/10 backdrop-blur-sm border border-white/20'
        }`}>
          {isLocked ? (
            <Lock size={28} className="text-gray-500" strokeWidth={2} />
          ) : (
            <Icon size={28} className="text-white" strokeWidth={2} />
          )}
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-white font-bold text-xl mb-1">{title}</h3>
              <div className="flex items-center gap-3">
                <span className="text-gray-400 text-sm font-medium">{difficulty}</span>
                <div className="flex items-center gap-1 bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full border border-white/20">
                  <Star size={14} className="text-white" strokeWidth={2} />
                  <span className="text-white text-sm font-bold">{xp}</span>
                </div>
              </div>
            </div>
          </div>
          <p className="text-gray-300 text-base mb-5 leading-relaxed">{description}</p>
          {!isLocked && (
            <>
              <div className="flex items-center justify-between text-sm mb-3">
                <span className="text-gray-400 font-medium">Progress</span>
                <span className="text-white font-bold">{progress}%</span>
              </div>
              <div className="w-full bg-gray-800/60 rounded-full h-3 mb-5 overflow-hidden">
                <motion.div 
                  className="bg-gradient-to-r from-white to-gray-300 h-3 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.7, ease: "easeOut" }}
                />
              </div>
            </>
          )}
        </div>
      </div>
      {!isLocked && (
        <button 
          onClick={onClick}
          className="w-full mt-4 bg-white text-black font-bold py-4 px-6 rounded-2xl transition-all duration-300 hover:bg-gray-100 hover:scale-[1.02] flex items-center justify-center gap-3 text-lg"
        >
          <Play size={20} className="text-black" strokeWidth={2} />
          Continue Quest
        </button>
      )}
    </motion.div>
  );
};

export default QuestCard;