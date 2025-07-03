import React, { useState } from "react";
import { GlassCard } from "@/components/common/GlassCard";
import { CameraUpload } from "@/components/CameraUpload";
import { Camera, Check, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useApp } from "@/context/AppContext";

interface QuestCompletePhotoUploadProps {
  questId: string;
  onSuccess: (photoUrl?: string) => void;
  onCancel: () => void;
  isOffline?: boolean;
}

export const QuestCompletePhotoUpload: React.FC<QuestCompletePhotoUploadProps> = ({ 
  questId, 
  onSuccess, 
  onCancel,
  isOffline = false
}) => {
  const [showCamera, setShowCamera] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const { toast } = useToast();
  const { user, addXP } = useApp();

  const handleCapture = async (file: File) => {
    setShowCamera(false);
    setIsUploading(true);
    setPreviewUrl(URL.createObjectURL(file));
    
    try {
      // If offline, just save the photo url locally
      if (isOffline) {
        onSuccess(previewUrl || undefined);
        toast({
          title: "Photo saved",
          description: "Your photo will be verified when you're back online.",
        });
        return;
      }
      
      // Get user's auth token for API request
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      
      if (!token) {
        throw new Error("Authentication required");
      }
      
      // Create form data for file upload
      const formData = new FormData();
      formData.append('photo', file);
      formData.append('questId', questId);
      
      // Submit to our verification API
      const response = await fetch('/api/verify-photo', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Verification request failed');
      }
      
      const result = await response.json();
      
      if (result.status === 'verified') {
        toast({
          title: "Quest Complete!",
          description: "Your photo has been verified. You earned XP for this quest!",
        });
        
        // Update local XP (the backend has already updated it in the database)
        if (result.xp) {
          addXP(result.xp);
        }
        
        onSuccess(previewUrl || undefined);
      } else {
        toast({
          title: "Verification Failed",
          description: "Your photo doesn't seem to show completion of this quest. Please try again with a different photo.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error verifying photo:", error);
      toast({
        title: "Upload Failed",
        description: error instanceof Error ? error.message : "There was a problem uploading your photo. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <GlassCard variant="dark" className="p-4">
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-center">Complete Quest with Photo</h3>
        
        <p className="text-sm text-white/70 text-center">
          Take a photo to verify you've completed this quest
        </p>
        
        {previewUrl ? (
          <div className="relative">
            <img 
              src={previewUrl} 
              alt="Verification preview" 
              className="w-full h-48 object-cover rounded-lg"
            />
            {isUploading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg">
                <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full"></div>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={() => setShowCamera(true)}
            className="w-full flex flex-col items-center justify-center gap-3 py-6 border border-dashed border-white/20 rounded-lg hover:border-white/30 transition-all"
            disabled={isUploading}
          >
            <Camera size={32} className="text-white/70" />
            <span className="text-sm">Tap to open camera</span>
          </button>
        )}
        
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-3 rounded-xl bg-[#1A1A1A] border border-white/10 flex items-center justify-center gap-2"
            disabled={isUploading}
          >
            <X size={18} />
            <span>Cancel</span>
          </button>
          
          {previewUrl && !isUploading && (
            <button
              onClick={() => onSuccess(previewUrl || undefined)}
              className="flex-1 py-3 rounded-xl bg-primary text-primary-foreground flex items-center justify-center gap-2"
            >
              <Check size={18} />
              <span>Submit</span>
            </button>
          )}
        </div>
      </div>
      
      {showCamera && (
        <CameraUpload 
          onCapture={handleCapture}
          onClose={() => setShowCamera(false)}
          title="Take a Verification Photo"
        />
      )}
    </GlassCard>
  );
};
