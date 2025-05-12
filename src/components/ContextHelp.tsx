import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, X, ChevronRight } from 'lucide-react';
import { useLocation } from 'react-router-dom';

// Help content for each route
const helpContent: Record<string, { title: string; sections: { heading: string; content: string }[] }> = {
  '/home': {
    title: 'Home Screen Guide',
    sections: [
      { 
        heading: 'Daily Affirmation', 
        content: 'Start your day with a positive affirmation. Tap to get a new one.' 
      },
      { 
        heading: 'Today\'s Quest', 
        content: 'Your primary task for today. Complete it to earn XP and maintain your streak.' 
      },
      { 
        heading: 'Progress Tracking', 
        content: 'View your current streak and XP progress.' 
      },
      { 
        heading: 'Mood Tracking', 
        content: 'Record your daily mood to track emotional patterns over time.' 
      }
    ]
  },
  '/quests': {
    title: 'Quests Guide',
    sections: [
      { 
        heading: 'Daily Quests', 
        content: 'Complete these activities to build habits aligned with your chosen theme.' 
      },
      { 
        heading: 'Quest Completion', 
        content: 'Tap a quest to mark it complete. Some quests require photo proof.' 
      },
      { 
        heading: 'Locked Quests', 
        content: 'Future quests are unlocked as you complete the current ones.' 
      },
      { 
        heading: 'XP Rewards', 
        content: 'Each quest grants XP based on difficulty. Accumulate XP to level up.' 
      }
    ]
  },
  '/coach': {
    title: 'AI Coach Guide',
    sections: [
      { 
        heading: 'Conversation', 
        content: 'Chat with your AI coach about any challenges you\'re facing.' 
      },
      { 
        heading: 'Mood Selection', 
        content: 'Select your current mood to get more personalized advice.' 
      },
      { 
        heading: 'Chat History', 
        content: 'Access your previous conversations for reference.' 
      },
      { 
        heading: 'Clear Chat', 
        content: 'Use this option to start fresh. Your history is still saved.' 
      }
    ]
  },
  '/community': {
    title: 'Community Guide',
    sections: [
      { 
        heading: 'Posts Feed', 
        content: 'Browse posts from other users on similar journeys.' 
      },
      { 
        heading: 'Liking Posts', 
        content: 'Show appreciation for posts that inspire you.' 
      },
      { 
        heading: 'Creating Posts', 
        content: 'Share your journey, wins, and challenges with the community.' 
      },
      { 
        heading: 'Privacy', 
        content: 'Your posts are visible only to verified community members.' 
      }
    ]
  },
  '/profile': {
    title: 'Profile Guide',
    sections: [
      { 
        heading: 'Stats Overview', 
        content: 'View your progress stats and achievements.' 
      },
      { 
        heading: 'Settings', 
        content: 'Customize your experience and notification preferences.' 
      },
      { 
        heading: 'Theme', 
        content: 'Your selected theme determines your 30-day journey focus.' 
      },
      { 
        heading: 'Achievements', 
        content: 'View badges and rewards you\'ve earned on your journey.' 
      }
    ]
  }
};

export const ContextHelp = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  // Get the current path, safely handling outside of Router context
  let path = '/';
  let location;
  
  try {
    location = useLocation();
    path = '/' + location.pathname.split('/')[1];
  } catch (error) {
    console.warn("Router context not available for ContextHelp");
  }
  
  const content = helpContent[path] || {
    title: 'Help Guide',
    sections: [{ heading: 'Navigation', content: 'Use the bottom tabs to navigate between different sections of the app.' }]
  };
  
  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-20 right-4 z-40 w-10 h-10 rounded-full bg-white/10 backdrop-blur-lg border border-white/20 flex items-center justify-center hover:bg-white/20 transition-colors pb-safe pr-safe"
        aria-label="Help"
      >
        <HelpCircle size={20} className="text-white" />
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 pb-safe pl-safe pr-safe"
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
            
            <motion.div
              className="bg-[#111] border border-white/10 rounded-lg w-full max-w-md max-h-[80vh] overflow-hidden z-10"
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
            >
              <div className="flex items-center justify-between p-4 border-b border-white/10">
                <h2 className="text-lg font-medium text-white">{content.title}</h2>
                <button onClick={() => setIsOpen(false)}>
                  <X size={20} className="text-white/70 hover:text-white" />
                </button>
              </div>
              
              <div className="overflow-y-auto p-4 max-h-[calc(80vh-4rem)]">
                {content.sections.map((section, i) => (
                  <div key={i} className="mb-4 last:mb-0">
                    <h3 className="text-white font-medium mb-1 flex items-center">
                      <ChevronRight size={16} className="mr-1" />
                      {section.heading}
                    </h3>
                    <p className="text-white/70 text-sm pl-6">{section.content}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
