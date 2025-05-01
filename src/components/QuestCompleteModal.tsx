
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Upload, Camera, CheckCircle } from 'lucide-react';
import { GlassButton } from '@/components/ui/glass';
import { QuestCompletePhotoUpload } from '@/components/QuestCompletePhotoUpload';
import { QuestCompleteModalProps } from '@/types/quest';

export const QuestCompleteModal: React.FC<QuestCompleteModalProps> = ({ 
  onClose, 
  onComplete, 
  questId, 
  requiresPhoto 
}) => {
  const [showPhotoUpload, setShowPhotoUpload] = useState(false);
  const [uploadedPhotoUrl, setUploadedPhotoUrl] = useState<string | undefined>();
  const [isUploading, setIsUploading] = useState(false);
  
  const handleComplete = async () => {
    await onComplete(uploadedPhotoUrl);
  };
  
  const handlePhotoUpload = (url: string) => {
    setUploadedPhotoUrl(url);
    setShowPhotoUpload(false);
  };

  const modalVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20
      }
    },
    exit: {
      opacity: 0,
      y: 20,
      transition: {
        duration: 0.2
      }
    }
  };
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div 
        className="relative bg-black/80 backdrop-blur-xl w-full max-w-md rounded-3xl p-6 border border-white/10 text-white shadow-2xl"
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <button 
          className="absolute top-3 right-3 text-white/60 hover:text-white transition-colors"
          onClick={onClose}
        >
          <X size={20} />
        </button>
        
        <h2 className="text-2xl font-semibold mb-4">Complete Quest</h2>
        <p className="text-white/80 mb-6">
          {requiresPhoto ? 
            "This quest requires photo verification. Upload a photo to complete it." :
            "Are you sure you want to complete this quest?"
          }
        </p>
        
        {requiresPhoto && !showPhotoUpload && !uploadedPhotoUrl && (
          <div className="flex flex-col items-center justify-center space-y-4">
            <GlassButton
              variant="secondary"
              className="w-full"
              onClick={() => setShowPhotoUpload(true)}
            >
              <Camera size={18} className="mr-2" />
              Take Photo
            </GlassButton>
            
            <GlassButton
              variant="secondary"
              className="w-full"
              onClick={() => setShowPhotoUpload(true)}
            >
              <Upload size={18} className="mr-2" />
              Upload Photo
            </GlassButton>
          </div>
        )}
        
        {showPhotoUpload && (
          <QuestCompletePhotoUpload 
            onPhotoUploaded={handlePhotoUpload}
            onCancel={() => setShowPhotoUpload(false)}
            isUploading={isUploading}
            questId={questId}
          />
        )}
        
        {uploadedPhotoUrl && (
          <div className="mt-4">
            <img 
              src={uploadedPhotoUrl} 
              alt="Uploaded quest proof" 
              className="w-full rounded-xl shadow-md border border-white/10" 
            />
          </div>
        )}
        
        <div className="mt-6 flex gap-3">
          <GlassButton
            variant="primary"
            fullWidth
            onClick={handleComplete}
            disabled={requiresPhoto && !uploadedPhotoUrl}
          >
            <CheckCircle size={18} className="mr-2" />
            Complete Quest
          </GlassButton>
        </div>
      </motion.div>
    </div>
  );
};
