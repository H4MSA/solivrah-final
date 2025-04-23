
import React, { useState, useRef, useEffect } from 'react';
import { Camera, ImageIcon, X } from 'lucide-react';

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
    onCapture(file);
  };

  const handleCameraClick = () => {
    if (!hasPermission) {
      checkCameraPermission();
    } else {
      fileInputRef.current?.click();
    }
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
          capture="environment"
          onChange={handleFileChange}
          className="hidden"
          ref={fileInputRef}
        />
        
        {previewUrl ? (
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
          <button 
            onClick={handleCameraClick}
            className="w-full aspect-square rounded-xl border-2 border-dashed border-white/20 flex flex-col items-center justify-center gap-3 hover:border-white/40 transition-all mb-4"
          >
            <Camera className="w-10 h-10 text-white/60" />
            <span className="text-white/60">Tap to take a photo</span>
          </button>
        )}
        
        {error && (
          <p className="text-red-500 text-sm mb-4">{error}</p>
        )}
        
        <div className="flex gap-3">
          {onClose && (
            <button 
              onClick={onClose}
              className="flex-1 py-2.5 bg-[#222] text-white rounded-xl border border-white/10 hover:bg-[#333] transition-colors"
            >
              Cancel
            </button>
          )}
          {previewUrl && (
            <button 
              onClick={onClose || (() => {})}
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
