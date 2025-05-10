
import React from "react";
import { GlassCard, GradientBorderCard } from "@/components/GlassCard";
import { motion } from "framer-motion";
import { fadeIn } from "@/lib/animations";

export const GlassCardShowcase: React.FC = () => {
  return (
    <motion.div 
      className="space-y-4"
      variants={fadeIn}
      initial="initial"
      animate="animate"
    >
      <h2 className="text-xl font-semibold text-white mb-4">Card Styles</h2>
      
      <GlassCard variant="default" animate="fade">
        <h3 className="text-lg font-medium text-white">Default Card</h3>
        <p className="text-white/70 mt-1">Basic glassmorphic card</p>
      </GlassCard>
      
      <GlassCard variant="elevated" animate="pop">
        <h3 className="text-lg font-medium text-white">Elevated Card</h3>
        <p className="text-white/70 mt-1">More pronounced with deeper shadows</p>
      </GlassCard>
      
      <GlassCard variant="premium" hoverEffect interactive>
        <h3 className="text-lg font-medium text-white">Interactive Card</h3>
        <p className="text-white/70 mt-1">Hover and click for effects</p>
      </GlassCard>
      
      <GlassCard variant="subtle" className="shimmer">
        <h3 className="text-lg font-medium text-white">Shimmer Effect Card</h3>
        <p className="text-white/70 mt-1">Subtle shimmer animation</p>
      </GlassCard>
      
      <GlassCard variant="primary" with3D>
        <h3 className="text-lg font-medium">3D Effect Card</h3>
        <p className="text-gray-700 mt-1">Hover for 3D rotation</p>
      </GlassCard>
      
      <GradientBorderCard 
        gradientFrom="from-white/10" 
        gradientTo="to-white/5"
      >
        <h3 className="text-lg font-medium text-white">Gradient Border Card</h3>
        <p className="text-white/70 mt-1">Card with subtle gradient border</p>
      </GradientBorderCard>
    </motion.div>
  );
};
