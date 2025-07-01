
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PerformanceMonitorProps {
  showInDev?: boolean;
}

export const PerformanceMonitor: React.FC<PerformanceMonitorProps> = ({
  showInDev = true
}) => {
  const [metrics, setMetrics] = useState({
    fps: 0,
    memory: 0,
    renderTime: 0
  });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!showInDev || process.env.NODE_ENV !== 'development') return;

    let frameCount = 0;
    let lastTime = performance.now();
    let animationId: number;

    const updateMetrics = () => {
      const currentTime = performance.now();
      frameCount++;

      if (currentTime - lastTime >= 1000) {
        const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
        const memory = (performance as any).memory 
          ? Math.round((performance as any).memory.usedJSHeapSize / 1048576) 
          : 0;

        setMetrics(prev => ({
          ...prev,
          fps,
          memory
        }));

        frameCount = 0;
        lastTime = currentTime;
      }

      animationId = requestAnimationFrame(updateMetrics);
    };

    updateMetrics();

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [showInDev]);

  if (process.env.NODE_ENV !== 'development' || !showInDev) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="bg-black/80 text-white px-2 py-1 rounded text-xs"
      >
        🔧
      </button>
      
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute bottom-8 right-0 bg-black/90 text-white p-3 rounded-lg text-xs space-y-1 min-w-[120px]"
          >
            <div>FPS: {metrics.fps}</div>
            <div>Memory: {metrics.memory}MB</div>
            <div className="text-xs text-white/70">Dev Mode</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
