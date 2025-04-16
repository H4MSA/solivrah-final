
import React, { useState } from "react";
import { GlassCard } from "@/components/GlassCard";
import { FiArrowRight, FiCheck } from "react-icons/fi";
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
            <h2 className="text-lg font-medium mb-4">What's Your Biggest Challenge?</h2>
            <div className="space-y-3">
              {["Procrastination", "Distractions", "Setbacks", "Creative Block"].map((challenge) => (
                <div 
                  key={challenge}
                  onClick={() => setFormData(prev => ({ ...prev, challenge: challenge as Challenge }))}
                  className={`flex items-center justify-between p-3 rounded-xl transition-all cursor-pointer
                    ${formData.challenge === challenge ? 'bg-primary/30 border border-primary/50' : 'glass'}
                  `}
                >
                  <span>{challenge}</span>
                  {formData.challenge === challenge && <FiCheck className="text-primary" />}
                </div>
              ))}
            </div>
            <button 
              type="button" 
              className="btn-primary w-full mt-6"
              onClick={goToNextStep}
            >
              Continue
            </button>
          </GlassCard>
        );
      case 2:
        return (
          <GlassCard className="animate-fade-in">
            <h2 className="text-lg font-medium mb-4">Your Goal</h2>
            <p className="text-muted text-sm mb-4">What do you want to achieve?</p>
            <textarea
              name="goal"
              value={formData.goal}
              onChange={handleChange}
              placeholder="e.g., Build consistent habits"
              className="w-full p-3 rounded-xl glass text-white bg-transparent min-h-[100px] resize-none"
            />
            <div className="flex gap-2 mt-6">
              <button 
                type="button" 
                className="btn-primary bg-secondary/50 flex-1"
                onClick={goToPrevStep}
              >
                Back
              </button>
              <button 
                type="button" 
                className="btn-primary flex-1"
                onClick={goToNextStep}
              >
                Continue
              </button>
            </div>
          </GlassCard>
        );
      case 3:
        return (
          <GlassCard className="animate-fade-in">
            <h2 className="text-lg font-medium mb-4">Time Commitment</h2>
            <p className="text-muted text-sm mb-4">How much time can you dedicate daily?</p>
            
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm">5 min</span>
              <span className="text-sm">60 min</span>
            </div>
            
            <input
              type="range"
              name="timeCommitment"
              min="5"
              max="60"
              step="5"
              value={formData.timeCommitment}
              onChange={handleChange}
              className="w-full"
            />
            
            <div className="text-center my-4">
              <span className="text-xl font-semibold">{formData.timeCommitment} minutes/day</span>
            </div>
            
            <div className="flex gap-2 mt-6">
              <button 
                type="button" 
                className="btn-primary bg-secondary/50 flex-1"
                onClick={goToPrevStep}
              >
                Back
              </button>
              <button 
                type="submit" 
                className="btn-primary flex-1 flex items-center justify-center gap-2"
                disabled={isLoading}
                onClick={handleSubmit}
              >
                {isLoading ? "Generating..." : "Generate Roadmap"} 
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
    <div className="min-h-screen bg-gradient-to-b from-background to-background-end pb-6">
      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-bold text-center text-gradient">Let's Get Started</h1>
        
        <div className="space-y-4 max-w-md mx-auto">
          {renderStep()}
          
          {error && (
            <div className="text-red-500 text-center p-2">
              {error}
            </div>
          )}
        </div>
        
        <div className="flex justify-center space-x-2 mt-6">
          {[1, 2, 3].map((i) => (
            <div 
              key={i}
              className={`w-2 h-2 rounded-full ${
                step === i ? 'bg-primary' : 'bg-secondary/50'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Survey;
