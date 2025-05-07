
import React from "react";
import { PremiumCard } from "@/components/PremiumCard";

interface MoodButtonProps {
  emoji: string;
  label: string;
  selected?: boolean;
  onClick: () => void;
}

export const MoodButton: React.FC<MoodButtonProps> = ({ emoji, label, selected, onClick }) => (
  <PremiumCard
    variant={selected ? "selected" : "default"}
    className="p-3 flex flex-col items-center"
    interactive={true}
    onClick={onClick}
  >
    <span className="text-2xl mb-1">{emoji}</span>
    <span className="text-xs font-medium">{label}</span>
  </PremiumCard>
);
