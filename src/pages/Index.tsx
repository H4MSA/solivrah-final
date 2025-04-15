
import React from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";
import { useApp } from "@/context/AppContext";

const Index = () => {
  const navigate = useNavigate();
  const { setIsGuest } = useApp();
  
  const handleStartAsGuest = () => {
    setIsGuest(true);
    navigate("/home");
  };
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full text-center space-y-8 animate-fade-in">
        <h1 className="text-4xl font-bold text-gradient">Solivrah</h1>
        <p className="text-muted text-lg">Unlock your potential through daily quests and guided self-improvement</p>
        
        <div className="space-y-4 pt-8">
          <button 
            className="btn-primary w-full flex items-center justify-center gap-2"
            onClick={handleStartAsGuest}
          >
            Start as Guest <FiArrowRight />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Index;
