
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
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-xl text-white font-medium">
          {greeting}, <span className="font-semibold">{displayName}</span>
        </h1>
        <p className="text-sm text-white/80">Let's make progress today</p>
      </div>
      
      <div className="flex items-center gap-3">
        <button 
          className="w-10 h-10 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 flex items-center justify-center transition-all duration-300 hover:bg-white/10 hover:border-white/15 active:scale-[0.95]"
          onClick={onCameraClick}
        >
          <Camera size={20} className="text-white" />
        </button>
        <button 
          className="w-10 h-10 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 flex items-center justify-center transition-all duration-300 hover:bg-white/10 hover:border-white/15 active:scale-[0.95]"
          onClick={() => navigate("/profile")}
        >
          <User size={20} className="text-white" />
        </button>
      </div>
    </div>
  );
};
