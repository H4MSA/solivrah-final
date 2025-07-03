import React, { useState } from 'react';
import { PremiumCard } from '../../PremiumCard';
import { AlertTriangle, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

interface ProfileResetProps {
  onCancel: () => void;
  onConfirm: () => void;
}

export const ProfileReset: React.FC<ProfileResetProps> = ({ onCancel, onConfirm }) => {
  const [isLoading, setIsLoading] = useState(false);
  
  const handleConfirm = async () => {
    setIsLoading(true);
    await onConfirm();
    setIsLoading(false);
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    >
      <PremiumCard className="p-6 max-w-sm w-full">
        <div className="flex flex-col items-center text-center">
          <AlertTriangle size={32} className="text-red-400 mb-4" />
          <h2 className="text-xl font-bold mb-2">Are you absolutely sure?</h2>
          <p className="text-white/70 mb-6">
            This will reset all your stats, badges, and completed quests. This action cannot be undone.
          </p>
          <div className="grid grid-cols-2 gap-4 w-full">
            <Button
              variant="outline"
              onClick={onCancel}
              className="bg-white/5 border-white/10 hover:bg-white/10"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirm}
              disabled={isLoading}
              className="bg-red-900/40 text-red-300 hover:bg-red-900/60 border border-red-500/20"
            >
              {isLoading ? 'Resetting...' : 'Yes, Reset Everything'}
            </Button>
          </div>
        </div>
      </PremiumCard>
    </motion.div>
  );
}; 