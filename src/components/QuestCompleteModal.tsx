
import React, { useState } from "react";
import { GlassCard } from "@/components/GlassCard";
import { TabNavigation } from "@/components/TabNavigation";
import { CheckCircle, Camera, Award, ArrowRight } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { useToast } from "@/hooks/use-toast";
import { QuestCompletePhotoUpload } from "./QuestCompletePhotoUpload";

interface QuestCompleteModalProps {
  questId: string;
  title: string;
  xp: number;
  requiresPhoto?: boolean;
  onClose: () => void;
}

export const QuestCompleteModal: React.FC<QuestCompleteModalProps> = ({
  questId,
  title,
  xp,
  requiresPhoto = false,
  onClose,
}) => {
  const { addXP, incrementStreak } = useApp();
  const [stage, setStage] = useState<'initial' | 'photo' | 'complete'>(requiresPhoto ? 'photo' : 'initial');
  const { toast } = useToast();

  const handleComplete = () => {
    // Add XP and increment streak
    addXP(xp);
    incrementStreak();
    
    // Show success message
    toast({
      title: "Quest Completed!",
      description: `You earned ${xp} XP for completing "${title}"`,
    });
    
    // If we were in the photo stage, update to complete
    if (stage === 'photo') {
      setStage('complete');
    } else {
      onClose();
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-lg z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {stage === 'initial' && (
          <GlassCard variant="dark" className="relative p-4">
            <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 w-24 h-24 rounded-full bg-black flex items-center justify-center border-4 border-background">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                <CheckCircle className="w-10 h-10 text-primary" />
              </div>
            </div>
            
            <div className="mt-14 text-center space-y-3">
              <h2 className="text-xl font-medium">Quest Complete!</h2>
              <p className="text-white/70">{title}</p>
              
              <div className="bg-secondary/30 p-3 rounded-lg flex items-center justify-center gap-2 mt-4">
                <Award className="text-yellow-300" />
                <span className="text-lg font-medium">{xp} XP Earned</span>
              </div>
              
              {requiresPhoto ? (
                <button
                  onClick={() => setStage('photo')}
                  className="w-full py-3 rounded-xl bg-primary text-primary-foreground flex items-center justify-center gap-2 mt-4"
                >
                  <Camera size={18} />
                  <span>Continue with Photo Verification</span>
                </button>
              ) : (
                <button
                  onClick={handleComplete}
                  className="w-full py-3 rounded-xl bg-primary text-primary-foreground flex items-center justify-center gap-2 mt-4"
                >
                  <ArrowRight size={18} />
                  <span>Claim Reward</span>
                </button>
              )}
            </div>
          </GlassCard>
        )}
        
        {stage === 'photo' && (
          <QuestCompletePhotoUpload 
            questId={questId}
            onSuccess={handleComplete}
            onCancel={() => setStage('initial')}
          />
        )}
        
        {stage === 'complete' && (
          <GlassCard variant="dark" className="relative p-4">
            <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 w-24 h-24 rounded-full bg-black flex items-center justify-center border-4 border-background">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                <CheckCircle className="w-10 h-10 text-primary" />
              </div>
            </div>
            
            <div className="mt-14 text-center space-y-3">
              <h2 className="text-xl font-medium">Verification Submitted!</h2>
              <p className="text-white/70">
                Your photo has been submitted for verification. You'll be notified once it's approved.
              </p>
              
              <div className="bg-secondary/30 p-3 rounded-lg flex items-center justify-center gap-2 mt-4">
                <Award className="text-yellow-300" />
                <span className="text-lg font-medium">{xp} XP Earned</span>
              </div>
              
              <button
                onClick={onClose}
                className="w-full py-3 rounded-xl bg-primary text-primary-foreground flex items-center justify-center gap-2 mt-4"
              >
                <ArrowRight size={18} />
                <span>Continue</span>
              </button>
            </div>
          </GlassCard>
        )}
      </div>
    </div>
  );
};
