
import React, { useState, useEffect, useRef } from "react";
import { GlassCard } from "@/components/GlassCard";
import { Camera, ChevronLeft, X, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface QRScannerProps {
  onClose: () => void;
  onScan: (code: string) => void;
}

export const QRScanner: React.FC<QRScannerProps> = ({ onClose, onScan }) => {
  const [hasCamera, setHasCamera] = useState<boolean | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();

  // Check for camera permission on mount
  useEffect(() => {
    const checkCameraPermission = async () => {
      try {
        await navigator.mediaDevices.getUserMedia({ video: true });
        setHasCamera(true);
      } catch (err) {
        console.error("Camera permission error:", err);
        setHasCamera(false);
        setError("Camera access is required to scan QR codes.");
      }
    };
    
    checkCameraPermission();
    
    return () => {
      // Clean up stream when component unmounts
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);
  
  const startScanning = async () => {
    try {
      setIsScanning(true);
      
      // Access the camera
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      
      // Mock QR scanning for demonstration purposes
      // In a real app, you would use a QR scanner library like jsQR
      console.info("QR code scanned: SOLIVRAH-DISC-001");
      setTimeout(() => {
        // Simulate a successful scan after 2 seconds
        toast({
          title: "QR Code Detected!",
          description: "Successfully scanned: SOLIVRAH-DISC-001",
        });
        
        onScan("SOLIVRAH-DISC-001");
      }, 2000);
    } catch (err) {
      console.error("Error accessing camera:", err);
      setError("Unable to access camera. Please check your device permissions.");
      setIsScanning(false);
    }
  };
  
  const stopScanning = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsScanning(false);
  };
  
  return (
    <div className="fixed inset-0 bg-background/90 backdrop-blur-md flex flex-col z-50">
      <div className="flex justify-between items-center p-4">
        <h2 className="text-xl font-medium">Scan QR Code</h2>
        <button 
          onClick={() => {
            stopScanning();
            onClose();
          }}
          className="bg-secondary/40 p-2 rounded-full"
        >
          <X size={20} />
        </button>
      </div>
      
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        {hasCamera === false ? (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-red-500/20 rounded-full flex items-center justify-center">
              <Camera size={32} className="text-red-500" />
            </div>
            <h3 className="text-lg font-medium">Camera Access Required</h3>
            <p className="text-white/70 text-sm">
              Please allow camera access in your browser settings to scan QR codes.
            </p>
            <button 
              onClick={onClose}
              className="mt-4 px-6 py-3 bg-secondary rounded-xl"
            >
              Close
            </button>
          </div>
        ) : isScanning ? (
          <div className="w-full max-w-sm flex flex-col items-center">
            <div className="relative w-full aspect-square overflow-hidden rounded-xl mb-6 bg-black">
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                className="w-full h-full object-cover"
              />
              
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-2/3 h-2/3 border-2 border-white/50 rounded-lg"></div>
              </div>
              
              <div className="absolute top-4 left-4 right-4 text-center">
                <p className="text-sm bg-black/50 py-2 px-4 rounded-full inline-block">
                  Position QR code within frame
                </p>
              </div>
              
              {/* Scanning animation */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-3/4 h-1 bg-white/20 relative overflow-hidden rounded-full">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent animate-shimmer"></div>
                </div>
              </div>
            </div>
            
            <button 
              onClick={stopScanning}
              className="px-6 py-3 bg-secondary rounded-xl flex items-center gap-2"
            >
              <ChevronLeft size={18} />
              <span>Cancel Scan</span>
            </button>
          </div>
        ) : (
          <>
            <div className="w-full max-w-sm aspect-square bg-secondary/20 rounded-2xl mb-6 flex items-center justify-center">
              <div className="relative w-3/4 h-3/4 border-2 border-primary/50 rounded">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Camera className="text-4xl text-primary/80" />
                </div>
              </div>
            </div>
            
            {error && (
              <GlassCard className="w-full max-w-sm mb-6 bg-destructive/20">
                <p className="text-white">{error}</p>
              </GlassCard>
            )}
            
            <p className="text-muted text-center mb-6">
              Position the QR code from your Solivrah product within the frame.
            </p>
            
            <button 
              className="btn-primary w-full max-w-sm flex items-center justify-center gap-2"
              onClick={startScanning}
            >
              <Zap size={18} />
              <span>Start Scanning</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
};
