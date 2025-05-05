
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Logo } from "@/components/Logo";
import { useApp } from "@/context/AppContext";
import { AuthService } from "@/services/AuthService";

const FeatureIcon = ({ src, className = "" }: { src: string; className?: string }) => (
  <div className={`flex items-center justify-center rounded-2xl bg-[#333] ${className}`}>
    <img src={src} alt="Feature icon" className="w-6 h-6" />
  </div>
);

const Index = () => {
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);
  const { setIsGuest } = useApp();
  
  useEffect(() => {
    // Simulate logo animation with a delay
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const handleGuestLogin = () => {
    setIsGuest(true);
    navigate("/home");
  };

  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      <div className={`flex-1 flex flex-col items-center justify-center transition-all duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
        {/* Logo */}
        <div className="mb-12 mt-32">
          <Logo />
        </div>
        
        {/* Feature Icons Grid */}
        <div className="grid grid-cols-3 gap-2 px-4 max-w-xs mx-auto w-full">
          {/* Row 1 */}
          <FeatureIcon src="/lovable-uploads/87f1b9bb-a5aa-46c8-a061-adf74fa5f4e4.png" />
          <FeatureIcon src="/lovable-uploads/1352b4c7-5317-413b-a491-f7cec494a199.png" />
          <FeatureIcon src="/lovable-uploads/87f1b9bb-a5aa-46c8-a061-adf74fa5f4e4.png" className="col-span-1" />
          
          {/* Row 2 */}
          <FeatureIcon src="/lovable-uploads/1352b4c7-5317-413b-a491-f7cec494a199.png" />
          <FeatureIcon src="/lovable-uploads/87f1b9bb-a5aa-46c8-a061-adf74fa5f4e4.png" className="col-span-1" />
          <FeatureIcon src="/lovable-uploads/1352b4c7-5317-413b-a491-f7cec494a199.png" />
          
          {/* Row 3 */}
          <FeatureIcon src="/lovable-uploads/87f1b9bb-a5aa-46c8-a061-adf74fa5f4e4.png" className="col-span-1" />
          <FeatureIcon src="/lovable-uploads/1352b4c7-5317-413b-a491-f7cec494a199.png" />
          <FeatureIcon src="/lovable-uploads/87f1b9bb-a5aa-46c8-a061-adf74fa5f4e4.png" />
          
          {/* Row 4 */}
          <FeatureIcon src="/lovable-uploads/1352b4c7-5317-413b-a491-f7cec494a199.png" />
          <FeatureIcon src="/lovable-uploads/87f1b9bb-a5aa-46c8-a061-adf74fa5f4e4.png" />
          <FeatureIcon src="/lovable-uploads/1352b4c7-5317-413b-a491-f7cec494a199.png" />
        </div>
        
        {/* Action Buttons */}
        <div className="mt-12 px-6 w-full max-w-xs mx-auto space-y-3">
          <button 
            onClick={() => navigate("/auth")}
            className="w-full rounded-xl bg-white text-black py-4 font-medium flex items-center justify-center"
          >
            Create Account ›
          </button>
          
          <button 
            onClick={() => navigate("/auth")}
            className="w-full rounded-xl bg-[#333] text-white py-4 font-medium flex items-center justify-center"
          >
            Sign In
          </button>
          
          <button 
            onClick={handleGuestLogin}
            className="w-full rounded-xl bg-transparent text-gray-400 py-2 text-sm flex items-center justify-center underline"
          >
            Continue as Guest
          </button>
        </div>
        
        {/* Privacy Notice */}
        <div className="mt-8 px-6 text-center">
          <p className="text-xs text-gray-400 mb-4">
            Your data is safe with us. We only use it to personalize your experience.
          </p>
          
          <div className="flex justify-center space-x-6 text-xs">
            <a href="#" className="text-gray-300">Privacy Policy</a>
            <a href="#" className="text-gray-300">Terms of Service</a>
          </div>
        </div>
      </div>
      
      <div className="py-4 text-center text-gray-500 text-xs">
        © 2025 Solivrah. All rights reserved.
      </div>
    </div>
  );
};

export default Index;
