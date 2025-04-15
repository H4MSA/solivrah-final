
import React, { useState } from "react";
import { GlassCard } from "@/components/GlassCard";
import { FiCamera, FiX } from "react-icons/fi";

interface QRScannerProps {
  onClose: () => void;
  onScan: (code: string) => void;
}

export const QRScanner: React.FC<QRScannerProps> = ({ onClose, onScan }) => {
  const [error, setError] = useState<string | null>(null);
  
  // Mock scanning function (in a real app, this would use the device camera)
  const handleScan = () => {
    // Simulate successful scan
    setTimeout(() => {
      onScan("SOLIVRAH-DISC-001");
    }, 2000);
  };
  
  return (
    <div className="fixed inset-0 bg-background/90 backdrop-blur-md flex flex-col z-50">
      <div className="flex justify-between items-center p-4">
        <h2 className="text-xl font-medium">Scan QR Code</h2>
        <button 
          onClick={onClose}
          className="bg-secondary/40 p-2 rounded-full"
        >
          <FiX />
        </button>
      </div>
      
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-sm aspect-square bg-secondary/20 rounded-2xl mb-6 flex items-center justify-center">
          <div className="relative w-3/4 h-3/4 border-2 border-primary/50 rounded">
            <div className="absolute inset-0 flex items-center justify-center">
              <FiCamera className="text-4xl text-primary/80" />
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
          className="btn-primary w-full max-w-sm"
          onClick={handleScan}
        >
          Scan Code
        </button>
      </div>
    </div>
  );
};
