
import React, { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, X, RotateCcw, Check, Upload, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDropzone } from "react-dropzone";

interface CameraUploadProps {
  onCapture: (file: File | null) => void;
  onClose: () => void;
  title?: string;
}

export const CameraUpload: React.FC<CameraUploadProps> = ({
  onCapture,
  onClose,
  title = "Take a Photo"
}) => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("environment");
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const startCamera = useCallback(async () => {
    try {
      setError(null);
      
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      });
      
      setStream(mediaStream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play();
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      setError("Could not access camera. Please check permissions.");
    }
  }, [facingMode]);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  }, [stream]);

  const switchCamera = useCallback(() => {
    stopCamera();
    setFacingMode(prev => prev === "user" ? "environment" : "user");
  }, [stopCamera]);

  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;
    
    setIsCapturing(true);
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    
    if (!context) return;
    
    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Draw the video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Convert to blob
    canvas.toBlob((blob) => {
      if (blob) {
        const imageUrl = URL.createObjectURL(blob);
        setCapturedImage(imageUrl);
        stopCamera();
      }
      setIsCapturing(false);
    }, "image/jpeg", 0.8);
  }, [stopCamera]);

  const retakePhoto = useCallback(() => {
    if (capturedImage) {
      URL.revokeObjectURL(capturedImage);
      setCapturedImage(null);
    }
    startCamera();
  }, [capturedImage, startCamera]);

  const confirmPhoto = useCallback(() => {
    if (capturedImage) {
      // Convert the captured image back to a File object
      fetch(capturedImage)
        .then(res => res.blob())
        .then(blob => {
          const file = new File([blob], "photo.jpg", { type: "image/jpeg" });
          onCapture(file);
          URL.revokeObjectURL(capturedImage);
        });
    }
  }, [capturedImage, onCapture]);

  const handleFileUpload = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      onCapture(file);
    }
  }, [onCapture]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleFileUpload,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    multiple: false
  });

  React.useEffect(() => {
    if (!capturedImage && !error) {
      startCamera();
    }
    
    return () => stopCamera();
  }, [startCamera, stopCamera, capturedImage, error]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm"
    >
      <div className="relative h-full w-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-black/50">
          <h2 className="text-white font-semibold text-lg">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            <X size={20} className="text-white" />
          </button>
        </div>

        {/* Camera/Image Display */}
        <div className="flex-1 relative">
          {error ? (
            <div className="h-full flex flex-col items-center justify-center text-white p-8">
              <Camera size={48} className="mb-4 opacity-50" />
              <p className="text-center mb-6">{error}</p>
              
              {/* File upload fallback */}
              <div
                {...getRootProps()}
                className={`w-full max-w-sm p-8 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                  isDragActive 
                    ? "border-blue-400 bg-blue-400/10" 
                    : "border-white/30 hover:border-white/50"
                }`}
              >
                <input {...getInputProps()} />
                <div className="text-center">
                  <Upload size={32} className="mx-auto mb-2 opacity-70" />
                  <p className="text-sm">
                    {isDragActive
                      ? "Drop the image here..."
                      : "Tap to select an image from your device"}
                  </p>
                </div>
              </div>
            </div>
          ) : capturedImage ? (
            <div className="h-full flex items-center justify-center">
              <img
                src={capturedImage}
                alt="Captured"
                className="max-w-full max-h-full object-contain"
              />
            </div>
          ) : (
            <>
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                playsInline
                muted
              />
              <canvas ref={canvasRef} className="hidden" />
              
              {/* Camera overlay */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="h-full w-full flex items-center justify-center">
                  <div className="w-64 h-64 border-2 border-white/50 rounded-lg"></div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Controls */}
        <div className="p-6 bg-black/50">
          {capturedImage ? (
            <div className="flex gap-4 justify-center">
              <Button
                onClick={retakePhoto}
                variant="outline"
                size="lg"
                className="flex-1 bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <RotateCcw size={20} className="mr-2" />
                Retake
              </Button>
              <Button
                onClick={confirmPhoto}
                variant="default"
                size="lg"
                className="flex-1"
              >
                <Check size={20} className="mr-2" />
                Use Photo
              </Button>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              {/* File Upload Button */}
              <div {...getRootProps()}>
                <input {...getInputProps()} />
                <button className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
                  <ImageIcon size={24} className="text-white" />
                </button>
              </div>

              {/* Capture Button */}
              <button
                onClick={capturePhoto}
                disabled={isCapturing || !stream}
                className="w-16 h-16 rounded-full bg-white border-4 border-gray-300 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCapturing && (
                  <div className="w-full h-full rounded-full bg-red-500"></div>
                )}
              </button>

              {/* Switch Camera Button */}
              <button
                onClick={switchCamera}
                className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              >
                <RotateCcw size={24} className="text-white" />
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
