
import React from 'react';
import { motion } from 'framer-motion';
import { QrCode, Zap, Trophy, Edit } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface QuickActionSectionProps {
  onScannerClick: () => void;
}

export const QuickActionSection: React.FC<QuickActionSectionProps> = ({
  onScannerClick
}) => {
  const navigate = useNavigate();
  
  const actionItems = [
    { icon: <QrCode size={18} />, label: 'Scan', onClick: onScannerClick },
    { icon: <Zap size={18} />, label: 'Quest', onClick: () => navigate('/quests') },
    { icon: <Trophy size={18} />, label: 'Stats', onClick: () => navigate('/profile') },
    { icon: <Edit size={18} />, label: 'Journal', onClick: () => console.log('Journal clicked') }
  ];
  
  return (
    <motion.div 
      className="mb-4 bg-[#1A1A1A] rounded-xl p-4 border border-[#333333]"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.3 }}
    >
      <h3 className="text-sm font-semibold mb-3">Quick Actions</h3>
      
      <div className="grid grid-cols-4 gap-3">
        {actionItems.map((item, index) => (
          <button
            key={index}
            onClick={item.onClick}
            className="flex flex-col items-center justify-center p-2 bg-[#222222] hover:bg-[#2A2A2A] rounded-lg border border-[#333333] transition-all"
          >
            <div className="w-8 h-8 rounded-full bg-black/20 flex items-center justify-center mb-1">
              {item.icon}
            </div>
            <span className="text-xs">{item.label}</span>
          </button>
        ))}
      </div>
    </motion.div>
  );
};
