
import React, { useState, useRef, useEffect } from 'react';
import { Camera, ImageIcon } from 'lucide-react';

interface CameraUploadProps {
  onImageCapture: (file: File) => void;
  type?: 'banner' | 'profile';
  currentImage?: string;
}

export const CameraUpload = ({ onImageCapture, type = 'profile', currentImage }: CameraUploadProps) => {
  const [error, setError] = useState<string>('');
  const [hasPermission, setHasPermission] = useState<boolean>(false);
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(currentImage);
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

    setPreviewUrl(URL.createObjectURL(file));
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
    <div className="relative w-full h-full">
      <input
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
        className="hidden"
        ref={fileInputRef}
      />
      
      {type === 'banner' ? (
        <div className="relative w-full h-48 group">
          {previewUrl ? (
            <div className="absolute inset-0 rounded-xl overflow-hidden">
              <img src={previewUrl} alt="Banner" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button onClick={handleCameraClick} className="text-white">
                  <Camera className="w-6 h-6" />
                </button>
              </div>
            </div>
          ) : (
            <button 
              onClick={handleCameraClick}
              className="w-full h-full rounded-xl border-2 border-dashed border-white/20 flex items-center justify-center gap-2 group-hover:border-white/40 transition-all"
            >
              <ImageIcon className="w-6 h-6 text-white/60" />
              <span className="text-white/60">Add Banner Image</span>
            </button>
          )}
        </div>
      ) : (
        <div className="relative group">
          {previewUrl ? (
            <div className="relative w-24 h-24">
              <img 
                src={previewUrl} 
                alt="Profile" 
                className="w-24 h-24 rounded-full object-cover border-4 border-black"
              />
              <button 
                onClick={handleCameraClick}
                className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-[#333333] border-2 border-black shadow-xl flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-[#444444] transition-all"
              >
                <Camera className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button 
              onClick={handleCameraClick}
              className="w-24 h-24 rounded-full bg-[#222222] border-4 border-black shadow-2xl flex items-center justify-center text-3xl font-bold group-hover:bg-[#333333] transition-all"
            >
              <Camera className="w-8 h-8 text-white/70" />
            </button>
          )}
        </div>
      )}
      
      {error && (
        <p className="text-red-500 text-xs mt-2">{error}</p>
      )}
    </div>
  );
};
