
import React from "react";
import { PremiumCard } from "@/components/PremiumCard";
import { Lock, ArrowRight } from "lucide-react";

interface QuestCardProps {
  title: string;
  description: string;
  locked?: boolean;
  onClick: () => void;
}

export const QuestCard: React.FC<QuestCardProps> = ({ title, description, locked = false, onClick }) => (
  <PremiumCard
    variant="default"
    className={`p-5 ${locked ? 'opacity-60' : ''}`}
    interactive={!locked}
    onClick={!locked ? onClick : undefined}
  >
    <div className="flex justify-between items-center mb-3">
      <h3 className="text-base font-medium">{title}</h3>
      {locked ? (
        <span className="text-xs bg-black/60 backdrop-blur-sm px-2 py-1 rounded-full text-white flex items-center gap-1 border border-white/5">
          <Lock size={12} />
          <span>Locked</span>
        </span>
      ) : (
        <span className="text-xs bg-black/50 backdrop-blur-sm px-2 py-1 rounded-full text-white border border-white/10">Active</span>
      )}
    </div>
    <p className="text-sm text-white/80">{description}</p>
    
    {!locked && (
      <button 
        className="w-full mt-4 py-2.5 rounded-xl bg-white/10 backdrop-blur-xl hover:bg-white/15 text-white font-medium flex items-center justify-center gap-2 border border-white/10 transition-all"
        onClick={onClick}
      >
        Start <ArrowRight size={16} />
      </button>
    )}
    
    {locked && (
      <div className="absolute inset-0 backdrop-blur-sm bg-black/40 rounded-xl flex items-center justify-center">
        <Lock className="text-white/30 text-4xl animate-pulse-slow" />
      </div>
    )}
  </PremiumCard>
);
