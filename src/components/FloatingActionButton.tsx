import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useApp } from '@/context/AppContext';

interface FABAction {
  id: string;
  label: string;
  icon: string;
  color: string;
  onClick: () => void;
}

interface FloatingActionButtonProps {
  actions?: FABAction[];
  position?: 'bottom-right' | 'bottom-left' | 'bottom-center';
  size?: 'small' | 'medium' | 'large';
  primaryAction?: () => void;
  primaryIcon?: string;
  primaryLabel?: string;
}

const defaultActions: FABAction[] = [
  {
    id: 'add-quest',
    label: 'Add Quest',
    icon: '🎯',
    color: 'from-calm-400 to-calm-600',
    onClick: () => console.log('Add quest')
  },
  {
    id: 'mood-check',
    label: 'Mood Check',
    icon: '😊',
    color: 'from-purple-400 to-pink-500',
    onClick: () => console.log('Mood check')
  },
  {
    id: 'quick-note',
    label: 'Quick Note',
    icon: '📝',
    color: 'from-blue-400 to-indigo-500',
    onClick: () => console.log('Quick note')
  },
  {
    id: 'meditation',
    label: 'Meditate',
    icon: '🧘',
    color: 'from-green-400 to-emerald-500',
    onClick: () => console.log('Start meditation')
  }
];

const positionClasses = {
  'bottom-right': 'bottom-6 right-6',
  'bottom-left': 'bottom-6 left-6',
  'bottom-center': 'bottom-6 left-1/2 transform -translate-x-1/2'
};

const sizeClasses = {
  small: 'w-12 h-12',
  medium: 'w-14 h-14',
  large: 'w-16 h-16'
};

export const FloatingActionButton = ({
  actions = defaultActions,
  position = 'bottom-right',
  size = 'medium',
  primaryAction,
  primaryIcon = '✨',
  primaryLabel = 'Quick Actions'
}: FloatingActionButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const { premiumFeatures } = useApp();

  const handlePrimaryClick = () => {
    if (primaryAction) {
      primaryAction();
    } else {
      setIsOpen(!isOpen);
    }
  };

  const handleActionClick = (action: FABAction) => {
    action.onClick();
    setIsOpen(false);
    
    // Haptic feedback simulation
    if (premiumFeatures.hapticFeedback) {
      // In a real app, this would trigger actual haptic feedback
      console.log('Haptic feedback triggered');
    }
  };

  return (
    <div className={`fixed ${positionClasses[position]} z-50`}>
      {/* Action menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute bottom-full mb-4 space-y-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
          >
            {actions.map((action, index) => (
              <motion.div
                key={action.id}
                className="flex items-center space-x-3"
                initial={{ opacity: 0, x: position.includes('right') ? 20 : -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: position.includes('right') ? 20 : -20 }}
                transition={{ delay: index * 0.05, duration: 0.2 }}
              >
                {/* Action label */}
                <motion.div
                  className="glass-card px-3 py-2 rounded-lg whitespace-nowrap"
                  whileHover={{ scale: 1.05 }}
                >
                  <span className="text-sm font-medium text-white">
                    {action.label}
                  </span>
                </motion.div>

                {/* Action button */}
                <motion.button
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-xl shadow-floating-action-button relative overflow-hidden`}
                  style={{
                    background: `linear-gradient(135deg, var(--tw-gradient-stops))`,
                  }}
                  onClick={() => handleActionClick(action)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${action.color}`} />
                  <span className="relative z-10">{action.icon}</span>
                </motion.button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main FAB */}
      <motion.button
        className={`
          ${sizeClasses[size]} 
          floating-action-button 
          flex items-center justify-center 
          text-xl font-medium text-white
          relative overflow-hidden
        `}
        onClick={handlePrimaryClick}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        animate={{
          rotate: isOpen ? 45 : 0,
        }}
        transition={{ duration: 0.2 }}
      >
        {/* Background gradient */}
        <div className="absolute inset-0 bg-wellness-gradient" />
        
        {/* Pulse effect */}
        <motion.div
          className="absolute inset-0 bg-white/20 rounded-full"
          animate={{
            scale: isHovered ? [1, 1.2, 1] : 1,
            opacity: isHovered ? [0.3, 0.1, 0.3] : 0,
          }}
          transition={{ duration: 1.5, repeat: isHovered ? Infinity : 0 }}
        />

        {/* Icon */}
        <motion.span
          className="relative z-10"
          animate={{
            rotate: isOpen ? -45 : 0,
          }}
          transition={{ duration: 0.2 }}
        >
          {isOpen ? '✕' : primaryIcon}
        </motion.span>

        {/* Ripple effect on click */}
        <motion.div
          className="absolute inset-0 bg-white/30 rounded-full"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 0, opacity: 0 }}
          whileTap={{ scale: 2, opacity: [0, 0.3, 0] }}
          transition={{ duration: 0.4 }}
        />
      </motion.button>

      {/* Tooltip */}
      <AnimatePresence>
        {isHovered && !isOpen && (
          <motion.div
            className={`
              absolute ${position.includes('right') ? 'right-full mr-4' : 'left-full ml-4'} 
              top-1/2 transform -translate-y-1/2
              glass-card px-3 py-2 rounded-lg whitespace-nowrap
            `}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
          >
            <span className="text-sm font-medium text-white">
              {primaryLabel}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Background overlay when open */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-black/20 backdrop-blur-sm -z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// Preset FAB configurations
export const QuickActionFAB = () => (
  <FloatingActionButton
    actions={[
      {
        id: 'add-quest',
        label: 'New Quest',
        icon: '🎯',
        color: 'from-calm-400 to-calm-600',
        onClick: () => console.log('Add quest')
      },
      {
        id: 'mood-check',
        label: 'Log Mood',
        icon: '😊',
        color: 'from-purple-400 to-pink-500',
        onClick: () => console.log('Mood check')
      },
      {
        id: 'meditation',
        label: 'Meditate',
        icon: '🧘',
        color: 'from-green-400 to-emerald-500',
        onClick: () => console.log('Start meditation')
      }
    ]}
    primaryIcon="✨"
    primaryLabel="Quick Actions"
  />
);

export const WellnessFAB = () => (
  <FloatingActionButton
    actions={[
      {
        id: 'breathing',
        label: 'Breathing Exercise',
        icon: '🫁',
        color: 'from-blue-400 to-cyan-500',
        onClick: () => console.log('Breathing exercise')
      },
      {
        id: 'gratitude',
        label: 'Gratitude Journal',
        icon: '🙏',
        color: 'from-yellow-400 to-orange-500',
        onClick: () => console.log('Gratitude journal')
      },
      {
        id: 'affirmation',
        label: 'Daily Affirmation',
        icon: '💫',
        color: 'from-pink-400 to-purple-500',
        onClick: () => console.log('Daily affirmation')
      }
    ]}
    primaryIcon="🌱"
    primaryLabel="Wellness Tools"
  />
);

export default FloatingActionButton;
