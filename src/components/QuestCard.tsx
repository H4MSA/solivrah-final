
import React from "react";
import { ArrowRight, Lock, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { GlassPane } from "./ui/glass";

interface QuestCardProps {
  title: string;
  description: string;
  locked?: boolean;
  onClick: () => void;
  completed?: boolean;
  current?: boolean;
  day?: number;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  theme?: string;
  xp?: number;
}

export const QuestCard: React.FC<QuestCardProps> = ({
  title,
  description,
  locked = false,
  onClick,
  completed = false,
  current = false,
  day,
  difficulty = 'Medium',
  theme,
  xp = 50
}) => {
  const getStatusLabel = () => {
    if (completed) return 'Completed';
    if (current) return 'Current';
    if (locked) return 'Locked';
    return 'Upcoming';
  };

  const getVariant = () => {
    if (completed) return "standard";
    if (current) return "ultra";
    if (locked) return "frost";
    return "light";
  };

  // Get background gradient based on theme
  const getThemeGradient = () => {
    switch (theme) {
      case "Focus":
        return "from-purple-400/20 to-purple-700/5";
      case "Discipline":
        return "from-red-400/20 to-red-700/5";
      case "Resilience":
        return "from-green-400/20 to-green-700/5";
      case "Wildcards":
        return "from-amber-400/20 to-amber-700/5";
      default:
        return "from-purple-400/20 to-purple-700/5";
    }
  };

  // Get difficulty color
  const getDifficultyColor = () => {
    switch (difficulty) {
      case 'Easy':
        return 'text-green-500';
      case 'Medium':
        return 'text-yellow-500';
      case 'Hard':
        return 'text-red-500';
      default:
        return 'text-yellow-500';
    }
  };

  return (
    <motion.div
      whileHover={!locked ? { y: -4, scale: 1.01 } : {}}
      whileTap={!locked ? { scale: 0.98 } : {}}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="relative"
    >
      <GlassPane
        variant={getVariant()}
        className={cn(
          "relative overflow-hidden transition-all duration-300",
          locked ? "opacity-90" : "opacity-100",
          current && "ring-2 ring-white/20 ring-offset-1 ring-offset-black/50"
        )}
        interactive={!locked}
        onClick={!locked ? onClick : undefined}
        glowEffect={current}
        hoverEffect={!locked}
        depth={current ? "high" : locked ? "low" : "medium"}
      >
        <div className={`absolute inset-0 bg-gradient-to-tr ${getThemeGradient()} opacity-30`}></div>
        
        <div className="relative z-10 p-5 space-y-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              {day && (
                <span className="bg-black/40 text-white/90 text-xs font-medium px-2 py-1 rounded-full">
                  Day {day}
                </span>
              )}
              <h3 className="font-medium text-base text-white">{title}</h3>
            </div>
            
            <motion.span 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "text-xs px-2.5 py-1 rounded-full border backdrop-blur-xl",
                completed ? 'bg-white/10 text-white border-white/20' : 
                current ? 'bg-white/5 text-white border-white/10' : 
                locked ? 'bg-black/70 text-white/70 border-white/5' :
                'bg-black/60 text-white/70 border-white/5'
              )}
            >
              {getStatusLabel()}
            </motion.span>
          </div>
          
          <p className="text-sm text-white/80">{description}</p>
          
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center space-x-3">
              <span className="text-xs bg-black/40 px-2 py-1 rounded-full border border-white/5">
                <span className="text-white/70">{xp} XP</span>
              </span>
              
              {difficulty && (
                <span className="text-xs bg-black/40 px-2 py-1 rounded-full border border-white/5">
                  <span className={getDifficultyColor()}>{difficulty}</span>
                </span>
              )}
            </div>

            {theme && (
              <span className="text-xs bg-black/40 px-2 py-1 rounded-full border border-white/5">
                <span className="text-white/70">{theme}</span>
              </span>
            )}
          </div>
          
          {!locked && !completed && (
            <motion.button 
              className="w-full mt-2 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-medium flex items-center justify-center gap-2 border border-white/10 backdrop-blur-lg transition-all"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              {current ? 'Continue Quest' : 'Start Quest'} <ArrowRight size={16} />
            </motion.button>
          )}
          
          {completed && (
            <div className="w-full mt-2 py-2.5 rounded-xl bg-white/5 text-white/80 font-medium flex items-center justify-center gap-2 border border-white/10">
              <CheckCircle size={16} className="text-green-500" /> Completed
            </div>
          )}
        </div>
        
        {locked && (
          <div className="absolute inset-0 backdrop-blur-xl bg-black/60 flex items-center justify-center rounded-xl border border-white/5 z-20">
            <motion.div
              initial={{ opacity: 0.6 }}
              animate={{ opacity: [0.6, 0.8, 0.6] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-12 h-12 flex items-center justify-center rounded-full bg-black/40 border border-white/10"
            >
              <Lock className="text-white/40 w-6 h-6" />
            </motion.div>
          </div>
        )}
      </GlassPane>
    </motion.div>
  );
};
