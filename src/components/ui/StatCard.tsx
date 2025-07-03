import React from 'react';
import { motion } from 'framer-motion';

interface StatCardProps {
  icon: React.ElementType;
  value: string;
  label: string;
  gradient?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ icon: Icon, value, label, gradient = false }) => {
  return (
    <motion.div 
      className={`p-6 rounded-2xl border transition-all duration-300 hover:scale-[1.02] ${
        gradient 
          ? 'bg-gradient-to-br from-white/20 to-gray-200/20 border-white/30 backdrop-blur-sm' 
          : 'bg-gray-900/50 border-gray-800/50'
      }`}
      whileHover={{ y: -5 }}
    >
      <div className="text-center">
        <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 w-fit mx-auto mb-4">
          <Icon size={24} className="text-white" strokeWidth={2} />
        </div>
        <div className="text-3xl font-black text-white mb-1">{value}</div>
        <div className="text-sm text-gray-400 font-medium">{label}</div>
      </div>
    </motion.div>
  );
};

export default StatCard;