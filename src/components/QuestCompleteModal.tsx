
import React, { useState } from "react";
import { Check, Camera, X, Upload, Loader } from "lucide-react";
import { GlassCard } from "./GlassCard";
import { useToast } from "@/hooks/use-toast";

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
  const [photoUploaded, setPhotoUploaded] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const { toast } = useToast();
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  
  const handleUploadPhoto = async () => {
    setUploading(true);
    
    try {
      // Simulate API call to verify photo with AI
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Verification successful",
        description: "Your submission has been verified",
        variant: "default",
      });
      
      setPhotoUploaded(true);
      setUploading(false);
    } catch (error) {
      console.error("Error uploading photo:", error);
      setUploading(false);
      
      toast({
        title: "Verification failed",
        description: "Please try again with a clearer photo",
        variant: "destructive",
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
        setUploading(true);
        
        // Simulate processing
        setTimeout(() => {
          setPhotoUploaded(true);
          setUploading(false);
          
          toast({
            title: "Photo uploaded",
            description: "Your submission has been verified",
            variant: "default",
          });
        }, 1500);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleComplete = () => {
    if (requiresPhoto && !photoUploaded) {
      toast({
        title: "Photo required",
        description: "Please upload a verification photo to complete this quest",
        variant: "destructive",
      });
      return;
    }
    
    onComplete(photoUploaded ? photoPreview || "mock-photo-url.jpg" : undefined);
    
    toast({
      title: "Quest completed",
      description: `You earned ${xpEarned} XP!`,
      variant: "default",
    });
  };
  
  const handleTriggerFileInput = () => {
    fileInputRef.current?.click();
  };
  
  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50 p-6 animate-fade-in">
      <GlassCard className="w-full max-w-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-medium">Complete Quest</h2>
          <button 
            onClick={onClose}
            className="bg-[#222222]/40 p-2 rounded-full"
          >
            <X size={18} />
          </button>
        </div>
        
        <p className="mb-6 text-white/90">{questTitle}</p>
        
        {requiresPhoto && (
          <div className="mb-6">
            <p className="text-sm text-white/70 mb-2">Photo verification required:</p>
            
            {photoUploaded && photoPreview ? (
              <div className="relative w-full h-48 rounded-xl overflow-hidden mb-2">
                <img 
                  src={photoPreview} 
                  alt="Verification" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-2 right-2 bg-green-500/80 rounded-full p-1.5">
                  <Check size={16} className="text-white" />
                </div>
              </div>
            ) : (
              <div className="flex gap-2 mt-2">
                <button 
                  className="flex-1 bg-[#222222]/70 w-full rounded-xl p-4 flex items-center justify-center gap-2 hover:bg-[#222222] active:scale-95 transition-all touch-manipulation"
                  onClick={handleTriggerFileInput}
                  disabled={uploading}
                >
                  {uploading ? <Loader className="animate-spin" size={18} /> : <Camera size={18} />}
                  {uploading ? "Verifying..." : "Take Photo"}
                </button>
                
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  capture="environment"
                  onChange={handleFileChange}
                  className="hidden"
                />
                
                <button 
                  className="flex-1 bg-[#222222]/70 w-full rounded-xl p-4 flex items-center justify-center gap-2 hover:bg-[#222222] active:scale-95 transition-all touch-manipulation"
                  onClick={handleTriggerFileInput}
                  disabled={uploading}
                >
                  {uploading ? <Loader className="animate-spin" size={18} /> : <Upload size={18} />}
                  {uploading ? "Uploading..." : "Upload"}
                </button>
              </div>
            )}
          </div>
        )}
        
        <div className="text-center mb-6">
          <p className="text-white/70 text-sm">You will earn</p>
          <p className="text-2xl font-bold text-white">{xpEarned} XP</p>
        </div>
        
        <button 
          className={`w-full py-3 bg-white text-black rounded-xl font-semibold flex items-center justify-center gap-2 transition-all ${
            requiresPhoto && !photoUploaded ? "opacity-50 cursor-not-allowed" : "hover:bg-[#EEEEEE] active:scale-95"
          } touch-manipulation`}
          onClick={handleComplete}
          disabled={requiresPhoto && !photoUploaded}
        >
          <Check size={18} />
          Complete Quest
        </button>
      </GlassCard>
    </div>
  );
};
