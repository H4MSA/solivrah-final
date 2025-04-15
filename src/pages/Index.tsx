
import React from "react";
import { useNavigate } from "react-router-dom";
import { Logo } from "@/components/Logo";
import { FiArrowRight } from "react-icons/fi";

const Index = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex flex-col justify-between p-6">
      <div className="flex-1 flex flex-col justify-center items-center text-center space-y-6">
        <Logo className="text-5xl mb-4" />
        
        <h1 className="text-3xl font-bold text-gradient">
          Build better habits,<br />one day at a time
        </h1>
        
        <p className="text-muted text-lg max-w-md">
          Track your progress, unlock achievements, and join a community of like-minded individuals.
        </p>
        
        <div className="flex flex-col w-full max-w-xs gap-3 mt-8">
          <button
            className="btn-primary py-4 flex items-center justify-center gap-2"
            onClick={() => navigate("/home")}
          >
            Start as Guest <FiArrowRight />
          </button>
          
          <button
            className="bg-secondary/40 text-white rounded-xl px-4 py-4 font-medium transition-all"
            onClick={() => navigate("/survey")}
          >
            Take the Survey
          </button>
        </div>
      </div>
      
      <div className="text-muted text-sm text-center mt-8">
        © 2025 Solivrah. All rights reserved.
      </div>
    </div>
  );
};

export default Index;
