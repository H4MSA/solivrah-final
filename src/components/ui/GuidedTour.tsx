import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, HelpCircle, ChevronRight } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip';

interface TourStep {
  target: string; // CSS selector for the element
  title: string;
  content: string;
  position?: 'top' | 'right' | 'bottom' | 'left';
}

interface GuidedTourProps {
  steps: TourStep[];
  onComplete: () => void;
  isOpen: boolean;
  onClose: () => void;
}

export const GuidedTour = ({ steps, onComplete, isOpen, onClose }: GuidedTourProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  
  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };
  
  useEffect(() => {
    if (!isOpen) return;
    
    const targetElement = document.querySelector(steps[currentStep].target);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [currentStep, isOpen, steps]);
  
  if (!isOpen) return null;
  
  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/50 z-50 pointer-events-none">
        <motion.div 
          className="absolute z-50 bg-black/90 border border-white/20 rounded-lg p-4 max-w-xs pointer-events-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          style={{
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)'
          }}
        >
          <button 
            className="absolute top-2 right-2 text-white/50 hover:text-white"
            onClick={onClose}
          >
            <X size={16} />
          </button>
          
          <div className="mb-1 text-white/80 text-xs">
            Step {currentStep + 1} of {steps.length}
          </div>
          
          <h3 className="text-white font-medium text-lg mb-2">
            {steps[currentStep].title}
          </h3>
          
          <p className="text-white/70 text-sm mb-4">
            {steps[currentStep].content}
          </p>
          
          <div className="flex justify-between">
            <button 
              className="text-xs text-white/50 hover:text-white"
              onClick={onClose}
            >
              Skip tour
            </button>
            
            <button 
              className="bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-md text-sm flex items-center"
              onClick={handleNext}
            >
              {currentStep < steps.length - 1 ? 'Next' : 'Finish'}
              <ChevronRight size={16} className="ml-1" />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

// Helper component for feature tips across the app
export const FeatureTip = ({ children, content }: { children: React.ReactNode, content: string }) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="inline-flex items-center">
            {children}
            <HelpCircle size={14} className="ml-1 text-white/40 hover:text-white/60" />
          </span>
        </TooltipTrigger>
        <TooltipContent className="bg-black/90 border border-white/20 text-white text-xs max-w-xs">
          {content}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}; 