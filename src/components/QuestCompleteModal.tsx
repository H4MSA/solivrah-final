
import React from "react";
import { FiCheck, FiCamera, FiX } from "react-icons/fi";
import { GlassCard } from "./GlassCard";

interface QuestCompleteModalProps {
  questTitle: string;
  xpEarned: number;
  requiresPhoto: boolean;
  onClose: () => void;
  onComplete: (photoUrl?: string) => void;
}

export const QuestCompleteModal: React.FC<QuestCompleteModalProps> = ({
  questTitle,
  xpEarned,
  requiresPhoto,
  onClose,
  onComplete,
}) => {
  const [photoUploaded, setPhotoUploaded] = React.useState(false);
  
  const handleUploadPhoto = () => {
    // In a real app, this would trigger the camera/upload functionality
    setTimeout(() => {
      setPhotoUploaded(true);
    }, 1000);
  };
  
  const handleComplete = () => {
    if (requiresPhoto && !photoUploaded) {
      // If photo is required but not uploaded, show error or prompt
      return;
    }
    
    onComplete(photoUploaded ? "mock-photo-url.jpg" : undefined);
  };
  
  return (
    <div className="fixed inset-0 bg-background/90 backdrop-blur-md flex items-center justify-center z-50 p-6">
      <GlassCard className="w-full max-w-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-medium">Complete Quest</h2>
          <button 
            onClick={onClose}
            className="bg-secondary/40 p-2 rounded-full"
          >
            <FiX />
          </button>
        </div>
        
        <p className="mb-6">{questTitle}</p>
        
        {requiresPhoto && (
          <div className="mb-6">
            <p className="text-sm text-muted mb-2">Photo verification required:</p>
            
            {photoUploaded ? (
              <div className="bg-primary/20 rounded-xl p-4 flex items-center justify-center">
                <div className="flex items-center gap-2 text-primary">
                  <FiCheck /> Photo uploaded
                </div>
              </div>
            ) : (
              <button 
                className="bg-secondary/40 w-full rounded-xl p-4 flex items-center justify-center gap-2"
                onClick={handleUploadPhoto}
              >
                <FiCamera /> Upload Photo
              </button>
            )}
          </div>
        )}
        
        <div className="text-center mb-6">
          <p className="text-muted text-sm">You will earn</p>
          <p className="text-2xl font-bold">{xpEarned} XP</p>
        </div>
        
        <button 
          className={`btn-primary w-full ${
            requiresPhoto && !photoUploaded ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onClick={handleComplete}
          disabled={requiresPhoto && !photoUploaded}
        >
          Complete Quest
        </button>
      </GlassCard>
    </div>
  );
};
