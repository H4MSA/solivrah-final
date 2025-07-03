import React, { useState } from "react";
import { GlassCard } from "@/components/common/GlassCard";
import { CheckCircle, Camera, Award, ArrowRight, Wifi, WifiOff, Loader } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { useToast } from "@/hooks/use-toast";
import { QuestCompletePhotoUpload } from "./QuestCompletePhotoUpload";
import { useOfflineSupport } from "@/hooks/useOfflineSupport";
import { Progress } from "@/components/ui/progress";

interface QuestCompleteModalProps {
  questId: string;
  title: string;
  xp: number;
  requiresPhoto?: boolean;
  onClose: () => void;
  onComplete?: (photoUrl?: string) => void;
}

export const QuestCompleteModal: React.FC<QuestCompleteModalProps> = ({
  questId,
  title,
  xp,
  requiresPhoto = false,
  onClose,
  onComplete
}) => {
  const { addXP, incrementStreak } = useApp();
  const [stage, setStage] = useState<'initial' | 'photo' | 'complete'>(requiresPhoto ? 'photo' : 'initial');
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const { isOnline, saveOfflineOperation } = useOfflineSupport();

  const handleComplete = async () => {
    try {
      setIsUploading(true);
      
      // Add XP and increment streak in both cases
      addXP(xp);
      incrementStreak();
      
      // Show different behavior based on connectivity
      if (!isOnline) {
        // Save for offline processing
        await saveOfflineOperation('quest-completion', {
          questId: questId,
          photoUrl,
          completedAt: new Date().toISOString()
        });
        
        toast({
          title: "Quest completed offline",
          description: "Your quest will be synced when you're back online.",
          duration: 3000
        });
        
        // Close modal after completion
        setTimeout(() => {
          setIsUploading(false);
          if (onComplete) {
            onComplete(photoUrl || undefined);
          }
          onClose();
        }, 1500);
      } else {
        // If we're online, complete normally
        // Simulate upload progress (in a real app, this would track actual upload)
        const interval = setInterval(() => {
          setUploadProgress(prev => {
            if (prev >= 95) {
              clearInterval(interval);
              return 100;
            }
            return prev + 5;
          });
        }, 100);
        
        // Allow component to render 100% progress before completing
        setTimeout(() => {
          clearInterval(interval);
          setIsUploading(false);
          setUploadProgress(0);
          
          if (onComplete) {
            onComplete(photoUrl || undefined);
          }
          
          toast({
            title: "Quest completed!",
            description: "You've earned XP and increased your streak.",
            duration: 3000
          });
          
          // Close modal after success
          onClose();
        }, 2000);
      }
    } catch (error) {
      console.error("Error completing quest:", error);
      setIsUploading(false);
      
      toast({
        title: "Couldn't complete quest",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
        duration: 5000
      });
    }
  };

  const handlePhotoUpload = (url: string) => {
    setPhotoUrl(url);
    if (stage === 'photo') {
      setStage('complete');
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-lg z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Network status indicator */}
        <div className="flex items-center justify-center mb-2 text-sm">
          {isOnline ? (
            <div className="flex items-center gap-1 text-green-400">
              <Wifi size={14} />
              <span>Online</span>
            </div>
          ) : (
            <div className="flex items-center gap-1 text-yellow-400">
              <WifiOff size={14} />
              <span>Offline Mode</span>
            </div>
          )}
        </div>
        
        {stage === 'initial' && (
          <GlassCard variant="dark" className="relative p-4 rounded-2xl">
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
                  className="w-full py-3 rounded-xl bg-white text-black flex items-center justify-center gap-2 mt-4 font-medium"
                  disabled={isUploading}
                >
                  <Camera size={18} />
                  <span>Continue with Photo</span>
                </button>
              ) : (
                <button
                  onClick={handleComplete}
                  className="w-full py-3 rounded-xl bg-white text-black flex items-center justify-center gap-2 mt-4 font-medium"
                  disabled={isUploading}
                >
                  {isUploading ? (
                    <>
                      <Loader size={18} className="animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <span>Claim Reward</span>
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>
              )}
              
              {isUploading && (
                <div className="mt-2">
                  <Progress value={uploadProgress} className="h-2" />
                  <p className="text-xs text-white/60 mt-1">
                    {isOnline ? 'Submitting quest...' : 'Saving for later sync...'}
                  </p>
                </div>
              )}
            </div>
          </GlassCard>
        )}
        
        {stage === 'photo' && (
          <QuestCompletePhotoUpload 
            questId={questId}
            onSuccess={handlePhotoUpload}
            onCancel={() => setStage('initial')}
            isOffline={!isOnline}
          />
        )}
        
        {stage === 'complete' && (
          <GlassCard variant="dark" className="relative p-4 rounded-2xl">
            <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 w-24 h-24 rounded-full bg-black flex items-center justify-center border-4 border-background">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                <CheckCircle className="w-10 h-10 text-primary" />
              </div>
            </div>
            
            <div className="mt-14 text-center space-y-3">
              <h2 className="text-xl font-medium">Photo Received!</h2>
              <p className="text-white/70">
                {isOnline 
                  ? "Your photo has been submitted for verification. You'll be notified once it's approved."
                  : "Your photo will be verified when you're back online."}
              </p>
              
              <div className="bg-secondary/30 p-3 rounded-lg flex items-center justify-center gap-2 mt-4">
                <Award className="text-yellow-300" />
                <span className="text-lg font-medium">{xp} XP Earned</span>
              </div>
              
              <button
                onClick={handleComplete}
                className="w-full py-3 rounded-xl bg-white text-black flex items-center justify-center gap-2 mt-4 font-medium"
                disabled={isUploading}
              >
                {isUploading ? (
                  <>
                    <Loader size={18} className="animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <span>Complete Quest</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
              
              {isUploading && (
                <div className="mt-2">
                  <Progress value={uploadProgress} className="h-2" />
                  <p className="text-xs text-white/60 mt-1">
                    {isOnline ? 'Submitting quest...' : 'Saving for later sync...'}
                  </p>
                </div>
              )}
            </div>
          </GlassCard>
        )}
      </div>
    </div>
  );
};
