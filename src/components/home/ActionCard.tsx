
import React from "react";
import { PremiumCard } from "@/components/PremiumCard";

interface ActionCardProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}

export const ActionCard: React.FC<ActionCardProps> = ({ icon, label, onClick }) => (
  <PremiumCard
    variant="default"
    className="p-4 flex flex-col items-center justify-center gap-2"
    interactive={true}
    onClick={onClick}
    hoverEffect={true}
  >
    <div className="text-xl text-white">{icon}</div>
    <span className="text-xs font-medium text-white">{label}</span>
  </PremiumCard>
);
