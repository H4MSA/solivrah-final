
import React, { useState } from "react";
import { PremiumCard } from "./PremiumCard";
import { Check, AlertCircle, Info, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type FeedbackType = "success" | "error" | "info" | "warning";

interface FeedbackProps {
  type: FeedbackType;
  message: string;
  description?: string;
  duration?: number; // in ms, default is 5000ms (5s)
  onClose?: () => void;
  position?: "top" | "bottom";
}

export const Feedback: React.FC<FeedbackProps> = ({ 
  type, 
  message, 
  description, 
  duration = 5000,
  onClose,
  position = "bottom"
}) => {
  const [isVisible, setIsVisible] = useState(true);
  
  // Auto-hide after duration
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, duration);
    
    return () => clearTimeout(timer);
  }, [duration, onClose]);
  
  const handleClose = () => {
    setIsVisible(false);
    onClose?.();
  };
  
  // Styles based on type
  const getIcon = () => {
    switch(type) {
      case "success": return <Check className="text-green-500" size={18} />;
      case "error": return <AlertCircle className="text-red-500" size={18} />;
      case "warning": return <AlertCircle className="text-amber-500" size={18} />;
      case "info": default: return <Info className="text-blue-500" size={18} />;
    }
  };
  
  const getBackgroundColor = () => {
    switch(type) {
      case "success": return "bg-green-500/10 border-green-500/30";
      case "error": return "bg-red-500/10 border-red-500/30";
      case "warning": return "bg-amber-500/10 border-amber-500/30";
      case "info": default: return "bg-blue-500/10 border-blue-500/30";
    }
  };
  
  const positionClass = position === "top" 
    ? "top-4 left-4 right-4"
    : "bottom-20 left-4 right-4"; // Above tab navigation
  
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className={`fixed ${positionClass} z-50 pointer-events-auto max-w-md mx-auto`}
          initial={{ opacity: 0, y: position === "top" ? -20 : 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: position === "top" ? -20 : 20 }}
          transition={{ duration: 0.3 }}
        >
          <div className={`rounded-lg p-3 ${getBackgroundColor()} backdrop-blur-md shadow-lg`}>
            <div className="flex items-start">
              <div className="flex-shrink-0 mr-2 mt-0.5">
                {getIcon()}
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-sm text-white">{message}</h4>
                {description && (
                  <p className="text-xs text-white/70 mt-1">{description}</p>
                )}
              </div>
              <button 
                className="p-1 rounded-full hover:bg-white/10 transition-colors"
                onClick={handleClose}
              >
                <X size={16} className="text-white/70" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Helper function to quickly show feedback
type ShowFeedbackOptions = Omit<FeedbackProps, "message" | "type"> & {
  container?: HTMLElement;
};

let feedbackContainer: HTMLDivElement | null = null;

export const showFeedback = (
  type: FeedbackType,
  message: string,
  options?: ShowFeedbackOptions
) => {
  if (!feedbackContainer) {
    feedbackContainer = document.createElement("div");
    feedbackContainer.id = "feedback-container";
    document.body.appendChild(feedbackContainer);
  }
  
  const feedbackId = `feedback-${Date.now()}`;
  const feedbackElement = document.createElement("div");
  feedbackElement.id = feedbackId;
  feedbackContainer.appendChild(feedbackElement);
  
  // Render feedback
  const cleanup = () => {
    const element = document.getElementById(feedbackId);
    if (element) {
      feedbackContainer?.removeChild(element);
    }
  };
  
  // Create React element
  const FeedbackElement = (
    <Feedback
      type={type}
      message={message}
      description={options?.description}
      duration={options?.duration}
      position={options?.position}
      onClose={() => {
        options?.onClose?.();
        cleanup();
      }}
    />
  );
  
  // Render it
  // Note: In a real implementation, you would use ReactDOM.render or createRoot
  // but for this example, we'll just simulate it
  
  return {
    close: cleanup
  };
};
