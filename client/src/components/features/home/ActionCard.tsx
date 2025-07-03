import React from "react";
import { motion } from "framer-motion";

interface ActionCardProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}

export const ActionCard: React.FC<ActionCardProps> = ({ icon, label, onClick }) => (
  <motion.div
    whileHover={{ scale: 1.03 }}
    whileTap={{ scale: 0.95 }}
    className="transform-gpu will-change-transform"
  >
    <div
      className="p-3 flex flex-col items-center justify-center gap-3 bg-black/90 border border-[#333333] rounded-xl shadow-sm"
      onClick={onClick}
    >
      <div className="w-12 h-12 flex items-center justify-center rounded-full bg-black/60">
        <div className="text-white">{icon}</div>
      </div>
      <span className="text-xs font-medium text-white">{label}</span>
    </div>
  </motion.div>
);