import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, Check } from 'lucide-react';

const steps = [
  {
    title: "Welcome to Solivrah!",
    description: "Your personal development coach to help you build better habits and achieve your goals.",
    image: "/onboarding/welcome.svg"
  },
  {
    title: "Daily Quests",
    description: "Complete daily challenges to build consistency and track your progress over time.",
    image: "/onboarding/quests.svg"
  },
  {
    title: "AI Coach",
    description: "Get personalized guidance from our AI coach to help you overcome challenges.",
    image: "/onboarding/coach.svg"
  },
  {
    title: "Community Support",
    description: "Join our community of like-minded individuals for support and inspiration.",
    image: "src/assets/community.svg"
  }
];

export const OnboardingFlow = ({ onComplete }: { onComplete: () => void }) => {
  const [currentStep, setCurrentStep] = useState(0);
  
  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Mark as completed in localStorage
      localStorage.setItem('onboardingCompleted', 'true');
      onComplete();
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-6">
      <AnimatePresence mode="wait">
        <motion.div 
          key={currentStep}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="bg-[#111] rounded-2xl border border-white/10 max-w-sm w-full overflow-hidden"
        >
          <div className="p-6">
            <div className="flex justify-center mb-6">
              <div className="h-40 w-40 rounded-2xl bg-white/5 flex items-center justify-center">
                {/* We'll replace this with actual images when available */}
                <div className="text-white/30 text-xs">Image placeholder</div>
              </div>
            </div>
            
            <h2 className="text-xl font-semibold text-white mb-2">{steps[currentStep].title}</h2>
            <p className="text-white/70 mb-6">{steps[currentStep].description}</p>
            
            <div className="flex justify-between items-center">
              <div className="flex space-x-1">
                {steps.map((_, index) => (
                  <span 
                    key={index} 
                    className={`block w-2 h-2 rounded-full ${
                      index === currentStep ? 'bg-white' : 'bg-white/30'
                    }`}
                  />
                ))}
              </div>
              
              <Button onClick={handleNext} className="bg-white text-black hover:bg-white/90">
                {currentStep < steps.length - 1 ? (
                  <>
                    Next
                    <ArrowRight size={16} className="ml-2" />
                  </>
                ) : (
                  <>
                    Get Started
                    <Check size={16} className="ml-2" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}; 