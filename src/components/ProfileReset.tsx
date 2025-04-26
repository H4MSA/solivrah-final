
import React, { useState } from 'react';
import { PremiumCard } from './PremiumCard';
import { AlertTriangle, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

interface ProfileResetProps {
  onReset: () => Promise<void>;
  isLoading: boolean;
}

export const ProfileReset: React.FC<ProfileResetProps> = ({ onReset, isLoading }) => {
  const [showConfirm, setShowConfirm] = useState(false);
  
  const handleRequestReset = () => {
    setShowConfirm(true);
  };
  
  const handleCancelReset = () => {
    setShowConfirm(false);
  };
  
  const handleConfirmReset = async () => {
    await onReset();
    setShowConfirm(false);
  };
  
  return (
    <PremiumCard className="p-5 relative overflow-hidden">
      <AnimatePresence>
        {showConfirm ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center p-5 backdrop-blur-sm"
          >
            <AlertTriangle size={32} className="text-red-400 mb-3" />
            <h4 className="text-lg font-medium mb-2 text-center">Reset All Progress?</h4>
            <p className="text-sm text-white/70 mb-6 text-center">
              This will reset all your stats, badges, and completed quests. This action cannot be undone.
            </p>
            <div className="flex gap-3 w-full">
              <Button 
                variant="outline" 
                className="flex-1 bg-white/5 border-white/10 text-white hover:bg-white/10 hover:border-white/20"
                onClick={handleCancelReset}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button 
                variant="destructive" 
                className="flex-1"
                onClick={handleConfirmReset}
                disabled={isLoading}
              >
                {isLoading ? 'Resetting...' : 'Reset All'}
              </Button>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
      
      <h3 className="text-lg font-medium text-white mb-3">Reset Progress</h3>
      <p className="text-sm text-white/70 mb-4">
        This will reset all your stats, badges, and completed quests. Use this option if you want to start fresh.
      </p>
      <Button 
        variant="outline" 
        className="bg-white/5 text-white hover:bg-white/10 w-full border-white/10 hover:border-white/20"
        onClick={handleRequestReset}
      >
        <RotateCcw size={16} className="mr-2" />
        Reset All Progress
      </Button>
    </PremiumCard>
  );
};
