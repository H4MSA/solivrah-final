
import React from "react";
import { FiCamera, FiEdit, FiZap } from "react-icons/fi";
import { MotionButton } from "@/components/ui/button"; // Using MotionButton for animation support

interface QuickActionSectionProps {
  onScannerClick: () => void;
}

export const QuickActionSection: React.FC<QuickActionSectionProps> = ({ onScannerClick }) => {
  const actions = [
    { icon: <FiCamera />, label: "Scan", onClick: onScannerClick },
    { icon: <FiEdit />, label: "Journal", onClick: () => console.log("Journal clicked") },
    { icon: <FiZap />, label: "Quick", onClick: () => console.log("Quick clicked") },
  ];

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-white/80">Quick Actions</h3>
      <div className="grid grid-cols-3 gap-3">
        {actions.map((action, index) => (
          <MotionButton
            key={index}
            variant="ghost"
            size="sm"
            className="flex flex-col items-center justify-center gap-1 bg-black/50 h-20 rounded-xl border border-white/10"
            onClick={action.onClick}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <span className="text-lg">{action.icon}</span>
            <span className="text-xs font-medium">{action.label}</span>
          </MotionButton>
        ))}
      </div>
    </div>
  );
};
