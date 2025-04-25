
import React, { useState, useRef } from 'react';
import { X, Camera, Upload, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GlassCard } from '@/components/GlassCard';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';

interface CameraUploadProps {
  onClose: () => void;
  onCapture: (file: File | null) => void;
  title?: string;
  aspectRatio?: string; // e.g. "1:1" or "16:9"
}

export const CameraUpload: React.FC<CameraUploadProps> = ({
  onClose,
  onCapture,
  title = "Take Photo",
  aspectRatio = "1:1"
}) => {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  
  const aspectRatioValue = aspectRatio === "16:9" ? 9/16 : 1;
  
  const startCamera = async () => {
    setIsCapturing(true);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Camera access not supported by your browser");
      }
      
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: "environment",
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      toast({
        variant: "destructive",
        title: "Camera Error",
        description: "Unable to access your camera. Check permissions or try uploading a file instead."
      });
      setIsCapturing(false);
    }
  };
  
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCapturing(false);
  };
  
  const takePicture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      // Set canvas dimensions to match video
      const videoAspectRatio = video.videoWidth / video.videoHeight;
      let width = video.videoWidth;
      let height = video.videoHeight;
      
      // Adjust canvas size based on desired aspect ratio
      if (aspectRatio === "1:1") {
        // For square, use the smaller dimension
        const size = Math.min(width, height);
        width = size;
        height = size;
      }
      // For 16:9, we'll use the video's native ratio if it's close enough
      
      canvas.width = width;
      canvas.height = height;
      
      // Calculate centering for crop
      const sx = (video.videoWidth - width) / 2;
      const sy = (video.videoHeight - height) / 2;
      
      const context = canvas.getContext('2d');
      if (context) {
        // Draw the current video frame onto the canvas with cropping
        context.drawImage(
          video, 
          sx, sy, width, height, // Source crop
          0, 0, width, height // Destination (no crop)
        );
        
        // Convert to data URL
        const imageDataUrl = canvas.toDataURL('image/jpeg', 0.8);
        setCapturedImage(imageDataUrl);
        stopCamera();
      }
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
    
    // Convert data URL to File object
    fetch(capturedImage)
      .then(res => res.blob())
      .then(blob => {
        const file = new File([blob], "captured-image.jpg", { type: "image/jpeg" });
        onCapture(file);
      })
      .catch(err => {
        console.error("Error converting image:", err);
        toast({
          variant: "destructive",
          title: "Error",
          description: "There was a problem processing your image."
        });
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
        
        <div className={`aspect-${aspectRatio} bg-black relative overflow-hidden`}>
          {/* Canvas for taking snapshot (hidden) */}
          <canvas ref={canvasRef} className="hidden"></canvas>
          
          {capturedImage ? (
            // Captured image preview
            <img 
              src={capturedImage} 
              alt="Captured" 
              className="w-full h-full object-cover"
            />
          ) : isCapturing ? (
            // Live camera preview
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
          ) : (
            // Placeholder when not capturing
            <div className="w-full h-full flex items-center justify-center bg-[#121212]">
              <Camera size={64} className="text-white/30" />
            </div>
          )}
          
          {/* Camera grid overlay */}
          {isCapturing && !capturedImage && (
            <div className="absolute inset-0 pointer-events-none">
              <div className="w-full h-full grid grid-cols-3 grid-rows-3">
                {[...Array(9)].map((_, i) => (
                  <div key={i} className="border border-white/20"></div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div className="p-5 space-y-4">
          {capturedImage ? (
            // Controls for captured image
            <div className="flex gap-3">
              <Button 
                onClick={() => {
                  setCapturedImage(null);
                  startCamera();
                }}
                variant="outline"
                className="flex-1 bg-white/5 hover:bg-white/10 border-white/10 text-white"
              >
                Retake
              </Button>
              <Button 
                onClick={handleConfirm}
                className="flex-1 bg-white text-black hover:bg-white/90"
              >
                <Check size={18} className="mr-2" />
                Confirm
              </Button>
            </div>
          ) : (
            // Controls for camera/upload
            <div className="flex gap-3">
              <Button
                onClick={() => fileInputRef.current?.click()}
                variant="outline"
                className="flex-1 bg-white/5 hover:bg-white/10 border-white/10 text-white"
              >
                <Upload size={18} className="mr-2" />
                Upload
              </Button>
              
              {!isCapturing ? (
                <Button 
                  onClick={startCamera}
                  className="flex-1 bg-white text-black hover:bg-white/90"
                >
                  <Camera size={18} className="mr-2" />
                  Use Camera
                </Button>
              ) : (
                <Button 
                  onClick={takePicture}
                  className="flex-1 bg-white text-black hover:bg-white/90"
                >
                  <Camera size={18} className="mr-2" />
                  Capture
                </Button>
              )}
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          )}
          
          <p className="text-white/50 text-xs text-center">
            {capturedImage 
              ? "You can confirm or retake the photo"
              : "Take a photo or upload from your device"}
          </p>
        </div>
      </GlassCard>
    </motion.div>
  );
};
