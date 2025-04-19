
import React, { useState, useRef, useEffect } from "react";
import { Camera, Upload, X, Image as ImageIcon, Check } from "lucide-react";
import { GlassCard } from "./GlassCard";
import { useToast } from "@/hooks/use-toast";

interface CameraUploadProps {
  onCapture: (file: File) => void;
  onClose: () => void;
  title?: string;
}

export const CameraUpload = ({ onCapture, onClose, title = "Take a photo" }: CameraUploadProps) => {
  const [mode, setMode] = useState<'initial' | 'camera' | 'upload' | 'preview'>('initial');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [cameraPermission, setCameraPermission] = useState<boolean | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const { toast } = useToast();

  // Start camera
  const startCamera = async () => {
    try {
      // Request camera permission only when needed
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      
      setCameraPermission(true);
      setStream(mediaStream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      
      setMode('camera');
    } catch (err) {
      console.error("Error accessing camera:", err);
      setCameraPermission(false);
      
      toast({
        title: "Camera Access Denied",
        description: "Please allow camera access to take photos",
        variant: "destructive"
      });
      
      // Fallback to upload if camera access fails
      setMode('upload');
    }
  };

  // Stop camera
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  // Take photo
  const takePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const context = canvas.getContext('2d');
      if (context) {
        // Add a scale-down animation effect
        video.classList.add('scale-95');
        setTimeout(() => video.classList.remove('scale-95'), 300);
        
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Convert to data URL
        const imageDataUrl = canvas.toDataURL('image/jpeg');
        setCapturedImage(imageDataUrl);
        
        // Convert data URL to File
        canvas.toBlob(blob => {
          if (blob) {
            const file = new File([blob], "photo.jpg", { type: "image/jpeg" });
            onCapture(file);
          }
        }, 'image/jpeg');
        
        setMode('preview');
        stopCamera();
      }
    }
  };

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      
      reader.onload = (e) => {
        if (e.target?.result) {
          setCapturedImage(e.target.result as string);
          onCapture(file);
          setMode('preview');
        }
      };
      
      reader.readAsDataURL(file);
    }
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <GlassCard 
        className="w-full max-w-[350px] p-0 overflow-hidden"
        variant="dark"
      >
        <div className="p-4 border-b border-white/10 flex justify-between items-center">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button 
            onClick={onClose}
            className="p-2 rounded-full bg-black/30 hover:bg-black/50 transition-all"
          >
            <X size={18} />
          </button>
        </div>
        
        <div className="p-5 space-y-4">
          {mode === 'initial' && (
            <div className="space-y-4">
              <button 
                onClick={startCamera}
                className="w-full py-3 rounded-xl bg-[#1E1E1E] border border-white/10 flex items-center justify-center gap-3 hover:bg-[#2A2A2A] active:scale-[0.98] transition-all duration-300"
              >
                <Camera size={20} />
                <span>Use Camera</span>
              </button>
              
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-3 rounded-xl bg-[#1E1E1E] border border-white/10 flex items-center justify-center gap-3 hover:bg-[#2A2A2A] active:scale-[0.98] transition-all duration-300"
              >
                <Upload size={20} />
                <span>Upload Photo</span>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileUpload} 
                  accept="image/*" 
                  className="hidden" 
                />
              </button>
            </div>
          )}
          
          {mode === 'camera' && (
            <div className="relative">
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                className="w-full h-[300px] object-cover rounded-lg bg-black transition-transform duration-300"
              />
              <canvas ref={canvasRef} className="hidden" />
              
              <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                <button 
                  onClick={takePhoto}
                  className="w-16 h-16 rounded-full bg-white border-4 border-[#1A1A1A] flex items-center justify-center hover:bg-gray-200 active:scale-95 transition-all duration-300"
                  aria-label="Take photo"
                >
                  <div className="w-12 h-12 rounded-full bg-white" />
                </button>
              </div>
            </div>
          )}
          
          {mode === 'preview' && capturedImage && (
            <div className="space-y-4">
              <div className="relative">
                <img 
                  src={capturedImage} 
                  alt="Captured" 
                  className="w-full h-[300px] object-cover rounded-lg"
                />
                <div className="absolute top-2 right-2">
                  <button 
                    onClick={() => {
                      setCapturedImage(null);
                      setMode('initial');
                    }}
                    className="p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-all"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>
              
              <div className="flex justify-end">
                <button 
                  onClick={onClose}
                  className="py-2 px-4 rounded-xl bg-[#2D2D2D] text-white flex items-center gap-2 hover:bg-[#3A3A3A] active:scale-[0.98] transition-all duration-300"
                >
                  <Check size={18} />
                  <span>Use Photo</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </GlassCard>
    </div>
  );
};
