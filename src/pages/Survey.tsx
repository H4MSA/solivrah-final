
import React, { useState } from "react";
import { GlassCard } from "@/components/GlassCard";
import { FiArrowRight, FiCheck, FiArrowLeft } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/context/AppContext";

type Challenge = "Procrastination" | "Distractions" | "Setbacks" | "Creative Block";

const Survey = () => {
  const navigate = useNavigate();
  const { setSelectedTheme } = useApp();
  const [formData, setFormData] = useState({
    challenge: "Procrastination" as Challenge,
    goal: "",
    timeCommitment: "30"
  });
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    try {
      // Validate form data
      if (!formData.goal.trim()) {
        throw new Error("Please fill out all fields");
      }
      
      // Map challenge to theme
      const themeMap = {
        "Procrastination": "Discipline",
        "Distractions": "Focus",
        "Setbacks": "Resilience",
        "Creative Block": "Wildcards"
      };
      
      const theme = themeMap[formData.challenge] as "Discipline" | "Focus" | "Resilience" | "Wildcards";
      
      // Save selected theme
      setSelectedTheme(theme);
      
      // Simulate API call to generate roadmap
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Navigate to quests page
      navigate("/quests");
    } catch (error) {
      console.error("Error submitting survey:", error);
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };
  
  const goToNextStep = () => {
    setStep(prev => prev + 1);
  };
  
  const goToPrevStep = () => {
    setStep(prev => prev - 1);
  };
  
  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <GlassCard className="animate-fade-in">
            <h2 className="text-xl font-semibold text-white mb-5">What's your biggest challenge?</h2>
            <div className="space-y-3">
              {["Procrastination", "Distractions", "Setbacks", "Creative Block"].map((challenge) => (
                <div 
                  key={challenge}
                  onClick={() => setFormData(prev => ({ ...prev, challenge: challenge as Challenge }))}
                  className={`flex items-center justify-between p-4 rounded-xl transition-all cursor-pointer
                    ${formData.challenge === challenge ? 
                      'bg-primary/30 border border-primary/50' : 
                      'bg-secondary/40 border border-white/5 hover:border-white/20'}
                  `}
                >
                  <span>{challenge}</span>
                  {formData.challenge === challenge && <FiCheck className="text-primary" />}
                </div>
              ))}
            </div>
            <button 
              type="button" 
              className="btn-primary w-full mt-6 flex items-center justify-center gap-2"
              onClick={goToNextStep}
            >
              Continue <FiArrowRight />
            </button>
          </GlassCard>
        );
      case 2:
        return (
          <GlassCard className="animate-fade-in">
            <h2 className="text-xl font-semibold text-white mb-2">Your Goal</h2>
            <p className="text-muted text-sm mb-4">What do you want to achieve with Solivrah?</p>
            <textarea
              name="goal"
              value={formData.goal}
              onChange={handleChange}
              placeholder="e.g., Build consistent habits, Improve focus, Overcome procrastination..."
              className="w-full p-4 rounded-xl glass text-white bg-transparent min-h-[120px] resize-none border border-white/10 focus:border-white/30 outline-none"
            />
            <div className="flex gap-2 mt-6">
              <button 
                type="button" 
                className="btn-secondary flex-1 flex items-center justify-center gap-2"
                onClick={goToPrevStep}
              >
                <FiArrowLeft /> Back
              </button>
              <button 
                type="button" 
                className="btn-primary flex-1 flex items-center justify-center gap-2"
                onClick={goToNextStep}
              >
                Continue <FiArrowRight />
              </button>
            </div>
          </GlassCard>
        );
      case 3:
        return (
          <GlassCard className="animate-fade-in">
            <h2 className="text-xl font-semibold text-white mb-2">Time Commitment</h2>
            <p className="text-muted text-sm mb-5">How much time can you dedicate daily?</p>
            
            <div className="mb-6">
              <div className="text-center mb-2">
                <span className="text-xl font-semibold">{formData.timeCommitment} minutes/day</span>
              </div>
              
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted">5 min</span>
                <span className="text-sm text-muted">60 min</span>
              </div>
              
              <input
                type="range"
                name="timeCommitment"
                min="5"
                max="60"
                step="5"
                value={formData.timeCommitment}
                onChange={handleChange}
                className="w-full accent-white"
              />
              
              <div className="flex justify-between mt-1">
                <span className="text-xs text-muted">Minimal</span>
                <span className="text-xs text-muted">Recommended</span>
                <span className="text-xs text-muted">Dedicated</span>
              </div>
            </div>
            
            <div className="flex gap-2 mt-6">
              <button 
                type="button" 
                className="btn-secondary flex-1 flex items-center justify-center gap-2"
                onClick={goToPrevStep}
              >
                <FiArrowLeft /> Back
              </button>
              <button 
                type="submit" 
                className="btn-primary flex-1 flex items-center justify-center gap-2"
                disabled={isLoading}
                onClick={handleSubmit}
              >
                {isLoading ? "Creating..." : "Generate Roadmap"} 
                {!isLoading && <FiArrowRight />}
              </button>
            </div>
          </GlassCard>
        );
      default:
        return null;
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background-end pb-6 overflow-hidden">
      {/* Background effect */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
      </div>
      
      <div className="p-6 space-y-6 z-10 relative">
        <h1 className="text-2xl font-bold text-center text-gradient">Let's Get Started</h1>
        
        <div className="space-y-4 max-w-md mx-auto">
          {renderStep()}
          
          {error && (
            <div className="text-red-500 text-center p-2 glass rounded-xl">
              {error}
            </div>
          )}
        </div>
        
        <div className="flex justify-center space-x-3 mt-6">
          {[1, 2, 3].map((i) => (
            <div 
              key={i}
              className={`w-3 h-3 rounded-full transition-all ${
                step === i ? 'bg-primary scale-110' : 'bg-secondary/50'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Survey;
