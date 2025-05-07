
import React from "react";
import { motion } from "framer-motion";
import { PremiumCard } from "@/components/PremiumCard";

interface ActionCardProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}

export const ActionCard: React.FC<ActionCardProps> = ({ icon, label, onClick }) => (
  <motion.div
    whileHover={{ 
      y: -4,
      boxShadow: "0 15px 30px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1)" 
    }}
    whileTap={{ scale: 0.95 }}
    className="transform-gpu will-change-transform"
  >
    <PremiumCard
      variant="premium"
      className="p-4 flex flex-col items-center justify-center gap-3"
      interactive={true}
      onClick={onClick}
    >
      <div className="w-12 h-12 flex items-center justify-center rounded-full bg-white/10 shadow-inner">
        <div className="text-xl text-white">{icon}</div>
      </div>
      <span className="text-sm font-medium text-white">{label}</span>
    </PremiumCard>
  </motion.div>
);
