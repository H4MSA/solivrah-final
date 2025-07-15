import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { useState, useRef } from 'react';
import { useApp } from '@/context/AppContext';

interface Quest {
  id: string;
  title: string;
  description: string;
  category: 'wellness' | 'mindfulness' | 'fitness' | 'creativity' | 'social';
  difficulty: 'easy' | 'medium' | 'hard';
  xpReward: number;
  estimatedTime: string;
  icon: string;
  completed: boolean;
  progress?: number;
  dueDate?: Date;
}

interface QuestCarouselProps {
  quests: Quest[];
  onQuestSelect?: (quest: Quest) => void;
  onQuestComplete?: (quest: Quest) => void;
  showProgress?: boolean;
}

const categoryColors = {
  wellness: 'from-green-400 to-emerald-500',
  mindfulness: 'from-calm-400 to-calm-600',
  fitness: 'from-red-400 to-orange-500',
  creativity: 'from-purple-400 to-pink-500',
  social: 'from-blue-400 to-indigo-500',
};

const difficultyIcons = {
  easy: '⭐',
  medium: '⭐⭐',
  hard: '⭐⭐⭐',
};

export const QuestCarousel = ({ 
  quests, 
  onQuestSelect, 
  onQuestComplete,
  showProgress = true 
}: QuestCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dragConstraints, setDragConstraints] = useState({ left: 0, right: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const { addXP, incrementStreak } = useApp();

  const handleQuestComplete = (quest: Quest) => {
    addXP(quest.xpReward);
    incrementStreak();
    onQuestComplete?.(quest);
  };

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 50;
    
    if (info.offset.x > threshold && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else if (info.offset.x < -threshold && currentIndex < quests.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const nextQuest = () => {
    setCurrentIndex((prev) => (prev + 1) % quests.length);
  };

  const prevQuest = () => {
    setCurrentIndex((prev) => (prev - 1 + quests.length) % quests.length);
  };

  if (quests.length === 0) {
    return (
      <div className="quest-card p-8 text-center">
        <div className="text-4xl mb-4">🎯</div>
        <h3 className="text-xl font-semibold text-white mb-2">No Quests Available</h3>
        <p className="text-gray-400">Check back later for new challenges!</p>
      </div>
    );
  }

  return (
    <div className="relative w-full" ref={containerRef}>
      {/* Main quest card */}
      <div className="relative h-80 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            className="absolute inset-0"
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            drag="x"
            dragConstraints={{ left: -100, right: 100 }}
            onDragEnd={handleDragEnd}
            whileDrag={{ scale: 0.95 }}
          >
            <QuestCard 
              quest={quests[currentIndex]} 
              onSelect={onQuestSelect}
              onComplete={handleQuestComplete}
              showProgress={showProgress}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation dots */}
      <div className="flex justify-center space-x-2 mt-6">
        {quests.map((_, index) => (
          <motion.button
            key={index}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentIndex 
                ? 'bg-calm-500 w-6' 
                : 'bg-white/20 hover:bg-white/40'
            }`}
            onClick={() => setCurrentIndex(index)}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
          />
        ))}
      </div>

      {/* Navigation arrows */}
      {quests.length > 1 && (
        <>
          <motion.button
            className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 glass-card rounded-full flex items-center justify-center z-10"
            onClick={prevQuest}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            disabled={currentIndex === 0}
          >
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </motion.button>

          <motion.button
            className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 glass-card rounded-full flex items-center justify-center z-10"
            onClick={nextQuest}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            disabled={currentIndex === quests.length - 1}
          >
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </motion.button>
        </>
      )}

      {/* Quest counter */}
      <div className="text-center mt-4">
        <span className="text-sm text-gray-400">
          {currentIndex + 1} of {quests.length} quests
        </span>
      </div>
    </div>
  );
};

// Individual Quest Card Component
const QuestCard = ({ 
  quest, 
  onSelect, 
  onComplete, 
  showProgress 
}: {
  quest: Quest;
  onSelect?: (quest: Quest) => void;
  onComplete?: (quest: Quest) => void;
  showProgress?: boolean;
}) => {
  const [isCompleting, setIsCompleting] = useState(false);

  const handleComplete = async () => {
    setIsCompleting(true);
    
    // Simulate completion animation
    setTimeout(() => {
      onComplete?.(quest);
      setIsCompleting(false);
    }, 1000);
  };

  const progressPercentage = quest.progress || 0;

  return (
    <motion.div
      className="quest-card h-full p-6 cursor-pointer relative overflow-hidden"
      onClick={() => onSelect?.(quest)}
      whileHover={{ y: -4 }}
      layout
    >
      {/* Background gradient based on category */}
      <div className={`absolute inset-0 bg-gradient-to-br ${categoryColors[quest.category]} opacity-10`} />
      
      {/* Completion overlay */}
      {quest.completed && (
        <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="text-6xl"
          >
            ✅
          </motion.div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="text-3xl">{quest.icon}</div>
          <div>
            <h3 className="text-xl font-semibold text-white mb-1">{quest.title}</h3>
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <span className="capitalize">{quest.category}</span>
              <span>•</span>
              <span>{difficultyIcons[quest.difficulty]}</span>
              <span>•</span>
              <span>{quest.estimatedTime}</span>
            </div>
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-gold-400 font-semibold">+{quest.xpReward} XP</div>
          {quest.dueDate && (
            <div className="text-xs text-gray-500 mt-1">
              Due {quest.dueDate.toLocaleDateString()}
            </div>
          )}
        </div>
      </div>

      {/* Description */}
      <p className="text-gray-300 mb-6 leading-relaxed">
        {quest.description}
      </p>

      {/* Progress bar */}
      {showProgress && !quest.completed && (
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-400 mb-2">
            <span>Progress</span>
            <span>{Math.round(progressPercentage)}%</span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-2">
            <motion.div
              className="bg-calm-500 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex space-x-3 mt-auto">
        {!quest.completed ? (
          <>
            <motion.button
              className="btn-primary flex-1"
              onClick={(e) => {
                e.stopPropagation();
                onSelect?.(quest);
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Start Quest
            </motion.button>
            
            {progressPercentage > 0 && (
              <motion.button
                className="btn-gold px-6"
                onClick={(e) => {
                  e.stopPropagation();
                  handleComplete();
                }}
                disabled={isCompleting}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isCompleting ? (
                  <div className="loading-spinner w-5 h-5" />
                ) : (
                  'Complete'
                )}
              </motion.button>
            )}
          </>
        ) : (
          <div className="flex-1 text-center py-3 text-green-400 font-medium">
            ✅ Completed
          </div>
        )}
      </div>

      {/* Completion celebration */}
      {isCompleting && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-gold-400 rounded-full"
              style={{
                left: '50%',
                top: '50%',
              }}
              initial={{ scale: 0, x: 0, y: 0 }}
              animate={{
                scale: [0, 1, 0],
                x: Math.cos((i / 12) * Math.PI * 2) * 100,
                y: Math.sin((i / 12) * Math.PI * 2) * 100,
              }}
              transition={{
                duration: 1,
                ease: "easeOut",
                delay: i * 0.05,
              }}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default QuestCarousel;
