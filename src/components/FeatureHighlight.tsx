
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Sparkles } from 'lucide-react';

interface FeatureHighlightProps {
  id: string; // Unique ID to track if user has seen this
  title: string;
  description: string;
  image?: string;
}

export const FeatureHighlight = ({ id, title, description, image }: FeatureHighlightProps) => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    // Check if user has already seen this feature
    const seenFeatures = JSON.parse(localStorage.getItem('seenFeatures') || '{}');
    
    if (!seenFeatures[id]) {
      // Show the feature highlight
      setIsVisible(true);
      
      // Mark as seen
      seenFeatures[id] = true;
      localStorage.setItem('seenFeatures', JSON.stringify(seenFeatures));
    }
  }, [id]);
  
  if (!isVisible) return null;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed bottom-20 inset-x-0 z-40 px-4 pointer-events-none flex justify-center"
    >
      <div className="bg-gradient-to-br from-[#1a1a1a] to-[#111] rounded-lg border border-white/10 shadow-lg pointer-events-auto max-w-sm w-full overflow-hidden">
        <div className="flex items-center justify-between p-3 border-b border-white/10">
          <div className="flex items-center">
            <Sparkles size={16} className="text-yellow-400 mr-2" />
            <span className="text-white font-medium">New Feature</span>
          </div>
          <button 
            onClick={() => setIsVisible(false)}
            className="text-white/50 hover:text-white"
          >
            <X size={16} />
          </button>
        </div>
        
        <div className="p-4">
          {image && (
            <div className="mb-3 flex justify-center">
              <img src={image} alt={title} className="rounded h-32 object-cover" />
            </div>
          )}
          
          <h3 className="text-white font-medium mb-1">{title}</h3>
          <p className="text-white/70 text-sm">{description}</p>
          
          <button
            onClick={() => setIsVisible(false)}
            className="mt-3 text-xs text-white/50 underline"
          >
            Got it
          </button>
        </div>
      </div>
    </motion.div>
  );
};
