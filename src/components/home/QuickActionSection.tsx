
import React from "react";
import { useNavigate } from "react-router-dom";
import { MessageCircle, Users, Camera } from "lucide-react";
import { CollapsibleSection } from "./CollapsibleSection";
import { ActionCard } from "./ActionCard";

interface QuickActionSectionProps {
  onScannerClick: () => void;
}

export const QuickActionSection: React.FC<QuickActionSectionProps> = ({ onScannerClick }) => {
  const navigate = useNavigate();
  
  return (
    <CollapsibleSection title="Quick Actions" defaultOpen={true}>
      <div className="grid grid-cols-3 gap-3">
        <ActionCard 
          icon={<MessageCircle size={20} />} 
          label="AI Coach" 
          onClick={() => navigate("/coach")} 
        />
        <ActionCard 
          icon={<Users size={20} />} 
          label="Community" 
          onClick={() => navigate("/community")} 
        />
        <ActionCard 
          icon={<Camera size={20} />} 
          label="Scan QR" 
          onClick={onScannerClick} 
        />
      </div>
    </CollapsibleSection>
  );
};
