
import React, { useState } from "react";
import { GlassCard } from "@/components/GlassCard";
import { CameraUpload } from "@/components/CameraUpload";
import { Camera, Check, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface QuestCompletePhotoUploadProps {
  questId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export const QuestCompletePhotoUpload: React.FC<QuestCompletePhotoUploadProps> = ({ 
  questId, 
  onSuccess, 
  onCancel 
}) => {
  const [showCamera, setShowCamera] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const { toast } = useToast();

  const handleCapture = async (file: File) => {
    setShowCamera(false);
    setIsUploading(true);
    setPreviewUrl(URL.createObjectURL(file));
    
    try {
      // Generate a unique filename
      const timestamp = Date.now();
      const fileExt = file.name.split('.').pop();
      const fileName = `quest-${questId}-${timestamp}.${fileExt}`;
      
      // Create a storage bucket if it doesn't exist (first time only)
      const { data: bucketData, error: bucketError } = await supabase.storage.getBucket('quest-photos');
      
      if (bucketError && bucketError.message.includes('does not exist')) {
        await supabase.storage.createBucket('quest-photos', {
          public: false,
          fileSizeLimit: 5242880 // 5MB
        });
      }
      
      // Upload the file
      const { data, error } = await supabase.storage
        .from('quest-photos')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });
        
      if (error) throw error;
      
      // Get URL for the uploaded file
      const { data: urlData } = await supabase.storage
        .from('quest-photos')
        .createSignedUrl(fileName, 60 * 60 * 24); // 24 hour expiry
      
      // Update the quest verification status and add photo URL
      const { error: updateError } = await supabase
        .from('quests')
        .update({ 
          verification_status: 'submitted',
          verification_photo_url: urlData?.signedUrl
        })
        .eq('id', questId);
      
      if (updateError) throw updateError;
      
      toast({
        title: "Photo submitted!",
        description: "Your quest verification photo has been uploaded.",
      });
      
      onSuccess();
    } catch (error) {
      console.error("Error uploading photo:", error);
      toast({
        title: "Upload Failed",
        description: "There was a problem uploading your photo. Please try again.",
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
              onClick={onSuccess}
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
