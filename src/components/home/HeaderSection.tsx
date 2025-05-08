
import React from "react";
import { useNavigate } from "react-router-dom";
import { Camera, User } from "lucide-react";

interface HeaderSectionProps {
  greeting: string;
  displayName: string;
  onCameraClick: () => void;
}

export const HeaderSection: React.FC<HeaderSectionProps> = ({ greeting, displayName, onCameraClick }) => {
  const navigate = useNavigate();
  
  return (
    <div className="flex justify-between items-center mb-4">
      <div>
        <h1 className="text-sm text-white font-medium">
          {greeting},
        </h1>
        <h2 className="text-base text-white font-semibold">{displayName}</h2>
      </div>
      
      <div className="flex items-center gap-2">
        <button 
          className="w-8 h-8 rounded-full bg-black/60 border border-[#333333] flex items-center justify-center transition-all hover:bg-black/70 active:scale-95"
          onClick={onCameraClick}
        >
          <Camera size={16} className="text-white" />
        </button>
        <button 
          className="w-8 h-8 rounded-full bg-black/60 border border-[#333333] flex items-center justify-center transition-all hover:bg-black/70 active:scale-95"
          onClick={() => navigate("/profile")}
        >
          <User size={16} className="text-white" />
        </button>
      </div>
    </div>
  );
};
