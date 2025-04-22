
import React, { useState, useRef, useEffect } from 'react';
import { Camera } from 'lucide-react';

export const CameraUpload = ({ onImageCapture }: { onImageCapture: (file: File) => void }) => {
  const [error, setError] = useState<string>('');
  const [hasPermission, setHasPermission] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    checkCameraPermission();
  }, []);

  const checkCameraPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setHasPermission(true);
      stream.getTracks().forEach(track => track.stop());
    } catch (err) {
      setHasPermission(false);
      setError('Camera permission denied. Please enable camera access.');
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

    onImageCapture(file);
  };

  const handleCameraClick = () => {
    if (!hasPermission) {
      checkCameraPermission();
    } else {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className="relative">
      <input
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
        className="hidden"
        ref={fileInputRef}
      />
      <button 
        onClick={handleCameraClick}
        className="group flex items-center justify-center w-full gap-2 p-4 bg-black/40 hover:bg-black/60 backdrop-blur-xl rounded-xl border border-white/10 transition-all duration-300"
      >
        <Camera className="w-5 h-5 text-white/80 group-hover:text-white" />
        <span className="text-sm text-white/80 group-hover:text-white">
          {hasPermission ? 'Take Photo' : 'Enable Camera'}
        </span>
      </button>
      {error && (
        <p className="text-red-500 text-xs mt-2">{error}</p>
      )}
    </div>
  );
};
