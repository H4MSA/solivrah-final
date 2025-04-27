
import React from "react";
import { Lock } from "lucide-react";
import { motion } from "framer-motion";
import { PremiumCard } from "./PremiumCard";

interface QuestCardProps {
  title: string;
  description: string;
  locked?: boolean;
  onClick: () => void;
  completed?: boolean;
  current?: boolean;
}

export const QuestCard: React.FC<QuestCardProps> = ({
  title,
  description,
  locked = false,
  onClick,
  completed = false,
  current = false
}) => {
  return (
    <PremiumCard
      variant={locked ? "subtle" : current ? "selected" : "default"}
      className={`relative overflow-hidden transition-all duration-300 backdrop-blur-xl`}
      interactive={!locked}
      onClick={!locked ? onClick : undefined}
    >
      <div className="p-5 space-y-3">
        <div className="flex justify-between items-center">
          <h3 className="font-medium text-base">{title}</h3>
          {locked ? (
            <span className="text-xs bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded-full text-white/70 flex items-center gap-1.5 border border-white/10">
              <Lock size={12} />
              <span>Locked</span>
            </span>
          ) : (
            <span className={`text-xs px-2.5 py-1 rounded-full border backdrop-blur-md ${
              completed ? 'bg-white/10 text-white border-white/20' : 
              current ? 'bg-white/5 text-white border-white/10' : 
              'bg-black/50 text-white/70 border-white/5'
            }`}>
              {completed ? 'Completed' : current ? 'Current' : 'Upcoming'}
            </span>
          )}
        </div>
        
        <p className="text-sm text-white/70">{description}</p>
        
        {!locked && !completed && (
          <button 
            className="w-full mt-2 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-medium flex items-center justify-center gap-2 border border-white/10 backdrop-blur-lg transition-all"
          >
            {current ? 'Continue Quest' : 'Start Quest'}
          </button>
        )}
        
        {locked && (
          <div className="absolute inset-0 backdrop-blur-[8px] bg-black/50 flex items-center justify-center rounded-xl border border-white/5">
            <motion.div
              initial={{ opacity: 0.6 }}
              animate={{ opacity: [0.6, 0.8, 0.6] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Lock className="text-white/40 w-8 h-8" />
            </motion.div>
          </div>
        )}
      </div>
    </PremiumCard>
  );
};
