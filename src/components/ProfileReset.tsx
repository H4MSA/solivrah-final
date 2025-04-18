
import React, { useState } from "react";
import { GlassCard } from "./GlassCard";
import { RefreshCw, AlertTriangle, Check, X } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { useToast } from "@/hooks/use-toast";

export const ProfileReset = () => {
  const [showConfirm, setShowConfirm] = useState(false);
  const { resetProgress } = useApp();
  const { toast } = useToast();

  const handleReset = () => {
    resetProgress();
    setShowConfirm(false);
    
    toast({
      title: "Progress Reset",
      description: "All your progress and stats have been reset.",
      variant: "default",
    });
  };

  return (
    <div className="mt-4">
      {!showConfirm ? (
        <button
          onClick={() => setShowConfirm(true)}
          className="w-full py-3 rounded-xl bg-[#1A1A1A]/80 border border-white/10 text-white flex items-center justify-center gap-2 hover:bg-[#222222]/80 active:scale-[0.98] transition-all duration-300 shadow-md"
        >
          <RefreshCw size={18} />
          <span>Reset All Progress</span>
        </button>
      ) : (
        <GlassCard variant="dark" className="p-4 animate-pop-in">
          <div className="text-center space-y-3">
            <div className="flex justify-center">
              <div className="p-2 rounded-full bg-red-500/20 mb-2">
                <AlertTriangle size={24} className="text-red-400" />
              </div>
            </div>
            <h3 className="text-lg font-semibold">Reset Progress?</h3>
            <p className="text-sm text-white/70">
              This will reset all your XP, streaks, badges, and completed quests. This action cannot be undone.
            </p>
            
            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={() => setShowConfirm(false)}
                className="py-2 px-4 rounded-xl border border-white/10 text-white hover:bg-white/5 active:scale-95 transition-all flex items-center gap-2"
              >
                <X size={16} />
                <span>Cancel</span>
              </button>
              <button
                onClick={handleReset}
                className="py-2 px-4 rounded-xl bg-red-500/80 text-white hover:bg-red-600/80 active:scale-95 transition-all flex items-center gap-2"
              >
                <Check size={16} />
                <span>Confirm Reset</span>
              </button>
            </div>
          </div>
        </GlassCard>
      )}
    </div>
  );
};
