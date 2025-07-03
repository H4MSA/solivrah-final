
import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Camera, X, Upload } from 'lucide-react';
import { GlassCard } from '@/components/common/GlassCard';
import { Button } from "@/components/ui/button";

interface CameraUploadProps {
  onClose: () => void;
  onCapture: (file: File | null) => void;
  title?: string;
}

export const CameraUpload: React.FC<CameraUploadProps> = ({
  onClose,
  onCapture,
  title = "Take Photo"
}) => {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const startCamera = async () => {
    setIsCapturing(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      setIsCapturing(false);
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      
      reader.onload = (event) => {
        if (event.target?.result) {
          setCapturedImage(event.target.result as string);
        }
      };
      
      reader.readAsDataURL(file);
    }
  };
  
  const handleConfirm = () => {
    if (!capturedImage) return;
    
    fetch(capturedImage)
      .then(res => res.blob())
      .then(blob => {
        const file = new File([blob], "captured-image.jpg", { type: "image/jpeg" });
        onCapture(file);
      })
      .catch(err => {
        console.error("Error converting image:", err);
      });
  };
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-5"
    >
      <GlassCard className="w-full max-w-md overflow-hidden">
        <div className="p-5 border-b border-white/10">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-medium text-white">{title}</h2>
            <button 
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white/10"
            >
              <X size={20} className="text-white" />
            </button>
          </div>
        </div>
        
        <div className="aspect-square bg-black relative overflow-hidden">
          {capturedImage ? (
            <img 
              src={capturedImage} 
              alt="Captured" 
              className="w-full h-full object-cover"
            />
          ) : isCapturing ? (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-[#121212]">
              <Camera size={64} className="text-white/30" />
            </div>
          )}
        </div>
        
        <div className="p-5 space-y-4">
          {capturedImage ? (
            <div className="flex gap-3">
              <Button 
                onClick={() => {
                  setCapturedImage(null);
                  startCamera();
                }}
                variant="outline"
                className="flex-1"
              >
                Retake
              </Button>
              <Button 
                onClick={handleConfirm}
                className="flex-1"
              >
                Confirm
              </Button>
            </div>
          ) : (
            <div className="flex gap-3">
              <Button
                onClick={() => fileInputRef.current?.click()}
                variant="outline"
                className="flex-1"
              >
                <Upload size={18} className="mr-2" />
                Upload
              </Button>
              
              {!isCapturing ? (
                <Button 
                  onClick={startCamera}
                  className="flex-1"
                >
                  <Camera size={18} className="mr-2" />
                  Camera
                </Button>
              ) : (
                <Button 
                  onClick={() => setIsCapturing(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Stop
                </Button>
              )}
            </div>
          )}
          
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
        </div>
      </GlassCard>
    </motion.div>
  );
};
