
import React from 'react';
import { Wifi, WifiOff, CloudUpload } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOfflineSupport } from '@/hooks/useOfflineSupport';
import { GlassCard } from './GlassCard';

interface NetworkStatusIndicatorProps {
  position?: 'top' | 'bottom';
  variant?: 'minimal' | 'expanded';
}

export const NetworkStatusIndicator: React.FC<NetworkStatusIndicatorProps> = ({
  position = 'top',
  variant = 'minimal',
}) => {
  const { isOnline, pendingOperationsCount, syncStatus } = useOfflineSupport();
  
  // Don't show indicator when online and no pending operations
  if (isOnline && pendingOperationsCount === 0 && variant === 'minimal') {
    return null;
  }
  
  const positionClasses = position === 'top'
    ? 'top-4 left-1/2 transform -translate-x-1/2'
    : 'bottom-20 left-1/2 transform -translate-x-1/2'; // above tab navigation
  
  const statusIcon = isOnline 
    ? <Wifi className="text-green-400" size={variant === 'minimal' ? 14 : 18} />
    : <WifiOff className="text-amber-400" size={variant === 'minimal' ? 14 : 18} />;
  
  const statusText = isOnline
    ? pendingOperationsCount > 0 
      ? `Syncing ${pendingOperationsCount} item${pendingOperationsCount > 1 ? 's' : ''}...`
      : 'Online'
    : 'Offline Mode';
  
  const statusColor = isOnline
    ? pendingOperationsCount > 0 
      ? 'text-blue-400'
      : 'text-green-400'
    : 'text-amber-400';
    
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: position === 'top' ? -20 : 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: position === 'top' ? -20 : 20 }}
        className={`fixed ${positionClasses} z-50 pointer-events-none`}
      >
        {variant === 'minimal' ? (
          <GlassCard 
            className="px-3 py-1.5 flex items-center gap-2 shadow-lg pointer-events-auto"
            variant="ultra-glass"
            depth="high"
          >
            {pendingOperationsCount > 0 && isOnline ? (
              <CloudUpload className="text-blue-400 animate-pulse" size={14} />
            ) : (
              statusIcon
            )}
            <span className={`text-xs font-medium ${statusColor}`}>
              {statusText}
            </span>
          </GlassCard>
        ) : (
          <GlassCard 
            className="px-4 py-3 flex flex-col items-center gap-2 shadow-lg max-w-[220px] pointer-events-auto"
            variant="ultra-glass"
            depth="high"
          >
            <div className="flex items-center gap-2 w-full">
              {pendingOperationsCount > 0 && isOnline ? (
                <CloudUpload className="text-blue-400 animate-pulse" size={18} />
              ) : (
                statusIcon
              )}
              <span className={`text-sm font-medium ${statusColor}`}>
                {statusText}
              </span>
            </div>
            
            {pendingOperationsCount > 0 && (
              <div className="text-xs text-white/70 text-center w-full mt-1">
                {isOnline 
                  ? "Your changes are being synchronized..."
                  : "Changes will sync when you're back online"}
              </div>
            )}
            
            {syncStatus.isSyncing && (
              <div className="w-full bg-gray-700 rounded-full h-1 mt-1">
                <div className="bg-blue-400 h-1 rounded-full animate-pulse" style={{ width: '60%' }}></div>
              </div>
            )}
          </GlassCard>
        )}
      </motion.div>
    </AnimatePresence>
  );
};
