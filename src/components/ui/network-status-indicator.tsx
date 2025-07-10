import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wifi, WifiOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppSound } from "@/context/SoundContext";

interface NetworkStatusIndicatorProps {
  className?: string;
  variant?: "default" | "minimal" | "toast";
}

export function NetworkStatusIndicator({
  className,
  variant = "default",
}: NetworkStatusIndicatorProps) {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showIndicator, setShowIndicator] = useState(false);
  const { playWithHaptics } = useAppSound();
  
  // Handle online/offline status changes
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      playWithHaptics("success");
      setShowIndicator(true);
      setTimeout(() => setShowIndicator(false), 3000);
    };
    
    const handleOffline = () => {
      setIsOnline(false);
      playWithHaptics("error");
      setShowIndicator(true);
    };
    
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    
    // Initial check (show only if offline)
    setShowIndicator(!navigator.onLine);
    
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [playWithHaptics]);
  
  // If minimal variant, only show a small indicator
  if (variant === "minimal") {
    return (
      <div 
        className={cn(
          "relative w-2 h-2 rounded-full",
          isOnline ? "bg-green-500" : "bg-red-500",
          className
        )}
      >
        <AnimatePresence>
          {!isOnline && (
            <motion.span
              className="absolute inset-0 rounded-full bg-red-500"
              initial={{ opacity: 0.5, scale: 1 }}
              animate={{ opacity: 0, scale: 2 }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          )}
        </AnimatePresence>
      </div>
    );
  }
  
  // Toast variant (for notifications)
  if (variant === "toast") {
    return (
      <AnimatePresence>
        {showIndicator && (
          <motion.div
            className={cn(
              "fixed bottom-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full backdrop-blur-md shadow-lg flex items-center gap-2",
              isOnline ? "bg-green-500/20 text-green-500" : "bg-red-500/20 text-red-500",
              className
            )}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            {isOnline ? (
              <>
                <Wifi size={16} />
                <span className="text-sm font-medium">Back online</span>
              </>
            ) : (
              <>
                <WifiOff size={16} />
                <span className="text-sm font-medium">No internet connection</span>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    );
  }
  
  // Default variant (full indicator)
  return (
    <AnimatePresence>
      {showIndicator && (
        <motion.div
          className={cn(
            "fixed top-0 inset-x-0 z-50 p-2 flex items-center justify-center text-center",
            isOnline ? "bg-green-500 text-white" : "bg-red-500 text-white",
            className
          )}
          initial={{ opacity: 0, y: -100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -100 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center gap-2">
            {isOnline ? (
              <>
                <Wifi size={16} />
                <span className="text-sm font-medium">Connected to the internet</span>
              </>
            ) : (
              <>
                <WifiOff size={16} />
                <span className="text-sm font-medium">No internet connection</span>
              </>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 