import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Logo } from "@/components/Logo";
import { CheckCircle, ArrowRight, Shield, User } from "lucide-react";

const Feature = ({
  icon,
  text
}: {
  icon: React.ReactNode;
  text: string;
}) => (
  <div className="flex items-start gap-3.5 p-4 bg-[#1A1A1A]/90 backdrop-blur-md rounded-xl animate-pop-in border border-white/10 hover:border-white/15 transition-all duration-300 transform-gpu hover:scale-[1.02] shadow-lg active:scale-[0.98] touch-manipulation mb-3" style={{ transform: 'translateZ(4px)' }}>
    <div className="p-2 rounded-full bg-black/60 text-white flex-shrink-0 border border-white/10 shadow-md">
      {icon}
    </div>
    <p className="text-white text-sm leading-tight">{text}</p>
  </div>
);

const Index = () => {
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex flex-col justify-between px-6 py-10 overflow-hidden bg-[#111827]"> {/* Added background color */}
      <div className={`flex-1 flex flex-col justify-center items-center text-center space-y-7 transition-all duration-1000 z-10 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <Logo className="mb-5 animate-float drop-shadow-lg" style={{ maxWidth: '150px' }} /> {/* Added max-width to logo */}

        <div className="space-y-3">
          <h1 className="text-white animate-fade-in font-medium text-2xl">A QUICK START FOR A LIFE YOU WANT</h1> {/* Increased font size */}
        </div>

        <div className="space-y-6 w-full max-w-md mx-auto"> {/* Increased max-width for better mobile responsiveness */}
          <div className="space-y-3.5">
            <Feature icon={<CheckCircle size={24} />} text="Overcome challenges with personalized quests" />
            <Feature icon={<CheckCircle size={24} />} text="Build lasting habits through gamification" />
            <Feature icon={<CheckCircle size={24} />} text="Unlock your potential with AI guidance" />
          </div>

          <div className="flex flex-col w-full gap-4 mt-6">
            <button
              onClick={() => navigate("/auth")}
              className="w-full bg-white text-black font-medium rounded-full px-6 py-3.5 button-animation"
            >
              Create Account <ArrowRight size={20} />
            </button>

            <button
              onClick={() => navigate("/auth?mode=sign_in")}
              className="w-full bg-[#111111] text-white font-medium rounded-full px-6 py-3.5 border border-white/10 button-animation"
            >
              <User size={20} /> Sign In
            </button>
          </div>
        </div>

        <div className="text-[#E0E0E0] text-sm mt-3 max-w-md animate-fade-in"> {/* Increased font size */}
          <p className="flex items-center justify-center gap-2 text-center">
            <Shield size={18} className="text-[#E0E0E0]" />
            Your data is safe with us. We only use it to personalize your experience.
          </p>
          <div className="mt-3 flex justify-center gap-6">
            <a href="#" className="text-white hover:underline transition-all">Privacy Policy</a>
            <a href="#" className="text-white hover:underline transition-all">Terms of Service</a>
          </div>
        </div>
      </div>

      <div className="text-[#999999] text-sm text-center mt-6 z-10 animate-fade-in pb-8"> {/* Added padding bottom for navbar */} {/* Increased font size */}
        © 2025 Solivrah. All rights reserved.
      </div>
    </div>
  );
};

export default Index;