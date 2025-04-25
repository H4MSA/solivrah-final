
import React, { useState, useRef, useEffect } from 'react';
import { Camera, ImageIcon, X, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CameraUploadProps {
  onCapture: (file: File) => void;
  onClose?: () => void;
  title?: string;
  type?: 'banner' | 'profile';
  currentImage?: string;
}

export const CameraUpload = ({ 
  onCapture, 
  onClose, 
  title = "Take a photo", 
  type = 'profile', 
  currentImage 
}: CameraUploadProps) => {
  const [error, setError] = useState<string>('');
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(currentImage);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    return () => {
      // Clean up stream when component unmounts
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  const checkCameraPermission = async () => {
    try {
      // First check if media devices are supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setError('Camera access is not supported in your browser');
        setHasPermission(false);
        return;
      }
      
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: {
          facingMode: 'environment', // Prefer back camera on mobile devices
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });
      
      setHasPermission(true);
      setStream(mediaStream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        setIsCameraActive(true);
      }
      
      setError('');
    } catch (err: any) {
      console.error('Camera permission error:', err);
      
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setError('Camera permission denied. Please enable camera access in your browser settings.');
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setError('No camera found. Please make sure your device has a camera.');
      } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
        setError('Camera is already in use by another application.');
      } else if (err.name === 'OverconstrainedError' || err.name === 'ConstraintNotSatisfiedError') {
        setError('Camera constraints not satisfied. Please try again with different settings.');
      } else {
        setError(`Camera error: ${err.message || 'Unknown error'}`);
      }
      
      setHasPermission(false);
    }
  };

  const takePicture = () => {
    if (!canvasRef.current || !videoRef.current || !stream) return;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    // Set canvas size to match video dimensions
    const { videoWidth, videoHeight } = video;
    canvas.width = videoWidth;
    canvas.height = videoHeight;
    
    // Draw video frame to canvas and convert to file
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.drawImage(video, 0, 0, videoWidth, videoHeight);
    
    // Convert canvas to blob
    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], `photo_${Date.now()}.jpg`, { type: 'image/jpeg' });
        setPreviewUrl(URL.createObjectURL(blob));
        onCapture(file);
        
        // Stop camera
        stopCamera();
      }
    }, 'image/jpeg', 0.8);
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
      setIsCameraActive(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setError('');
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    setPreviewUrl(URL.createObjectURL(file));
    onCapture(file);
  };

  const handleCameraClick = () => {
    if (isCameraActive) {
      takePicture();
    } else if (hasPermission === true) {
      checkCameraPermission(); // Re-initialize camera
    } else if (hasPermission === false) {
      // If permission was previously denied, suggest file upload instead
      toast({
        title: "Camera access denied",
        description: "Using file upload instead. Please allow camera access in your settings for direct capture.",
      });
      fileInputRef.current?.click();
    } else {
      checkCameraPermission();
    }
  };

  const handleFileUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-[#121212] border border-white/10 rounded-2xl p-4 w-full max-w-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-white">{title}</h3>
          {onClose && (
            <button onClick={onClose} className="p-1 rounded-full bg-[#222] hover:bg-[#333] transition-colors">
              <X size={20} />
            </button>
          )}
        </div>
        
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          ref={fileInputRef}
        />
        
        {isCameraActive ? (
          <div className="relative w-full aspect-square rounded-xl overflow-hidden mb-4">
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              className="w-full h-full object-cover"
            />
            <canvas ref={canvasRef} className="hidden" />
            <div className="absolute bottom-4 left-0 right-0 flex justify-center">
              <button 
                onClick={takePicture} 
                className="bg-white rounded-full p-3 shadow-lg"
              >
                <div className="w-12 h-12 rounded-full border-4 border-white" />
              </button>
            </div>
          </div>
        ) : previewUrl ? (
          <div className="relative w-full aspect-square rounded-xl overflow-hidden mb-4">
            <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
              <button 
                onClick={handleCameraClick} 
                className="bg-white/20 backdrop-blur-sm p-3 rounded-full"
              >
                <Camera className="w-6 h-6 text-white" />
              </button>
            </div>
          </div>
        ) : (
          <div className="mb-4 space-y-4">
            <button 
              onClick={handleCameraClick}
              className="w-full aspect-square rounded-xl border-2 border-dashed border-white/20 flex flex-col items-center justify-center gap-3 hover:border-white/40 transition-all"
            >
              <Camera className="w-10 h-10 text-white/60" />
              <span className="text-white/60">Tap to take a photo</span>
            </button>
            
            <div className="relative flex items-center">
              <div className="flex-grow h-px bg-white/20"></div>
              <span className="mx-4 text-white/60 text-sm">OR</span>
              <div className="flex-grow h-px bg-white/20"></div>
            </div>
            
            <button 
              onClick={handleFileUploadClick}
              className="w-full py-4 rounded-xl border-2 border-dashed border-white/20 flex flex-col items-center justify-center gap-2 hover:border-white/40 transition-all"
            >
              <Upload className="w-6 h-6 text-white/60" />
              <span className="text-white/60 text-sm">Upload from device</span>
            </button>
          </div>
        )}
        
        {error && (
          <p className="text-red-500 text-sm mb-4">{error}</p>
        )}
        
        <div className="flex gap-3">
          {onClose && (
            <button 
              onClick={() => {
                stopCamera();
                onClose();
              }}
              className="flex-1 py-2.5 bg-[#222] text-white rounded-xl border border-white/10 hover:bg-[#333] transition-colors"
            >
              Cancel
            </button>
          )}
          {previewUrl && (
            <button 
              onClick={() => {
                stopCamera();
                if (onClose) onClose();
              }}
              className="flex-1 py-2.5 bg-white text-black rounded-xl font-medium"
            >
              Use Photo
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
