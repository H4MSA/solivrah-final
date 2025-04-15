
import React, { useState } from "react";
import { GlassCard } from "@/components/GlassCard";
import { FiArrowRight, FiCheck } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { supabase } from "@/integrations/supabase/client";

type Theme = "Discipline" | "Focus" | "Resilience" | "Wildcards";

const Survey = () => {
  const navigate = useNavigate();
  const { setSelectedTheme } = useApp();
  const [formData, setFormData] = useState({
    theme: "Discipline" as Theme,
    goal: "",
    struggle: "",
    timeCommitment: "30"
  });
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    try {
      // Validate form data
      if (!formData.goal.trim() || !formData.struggle.trim()) {
        throw new Error("Please fill out all fields");
      }
      
      // Save selected theme
      setSelectedTheme(formData.theme);
      
      // In a real app, submit to Supabase
      // const { error } = await supabase.from('survey_responses').insert([{
      //   theme: formData.theme,
      //   goal: formData.goal,
      //   biggest_struggle: formData.struggle,
      //   daily_commitment: parseInt(formData.timeCommitment)
      // }]);
      
      // if (error) throw error;
      
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
            <h2 className="text-lg font-medium mb-4">Choose Your Theme</h2>
            <div className="space-y-3">
              {["Discipline", "Focus", "Resilience", "Wildcards"].map((theme) => (
                <div 
                  key={theme}
                  onClick={() => setFormData(prev => ({ ...prev, theme: theme as Theme }))}
                  className={`flex items-center justify-between p-3 rounded-xl transition-all cursor-pointer
                    ${formData.theme === theme ? 'bg-primary/30 border border-primary/50' : 'glass'}
                  `}
                >
                  <span>{theme}</span>
                  {formData.theme === theme && <FiCheck className="text-primary" />}
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
            <p className="text-muted text-sm mb-4">What do you want to achieve with {formData.theme}?</p>
            <textarea
              name="goal"
              value={formData.goal}
              onChange={(e) => setFormData(prev => ({ ...prev, goal: e.target.value }))}
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
            <h2 className="text-lg font-medium mb-4">Your Struggle</h2>
            <p className="text-muted text-sm mb-4">What's holding you back?</p>
            <textarea
              name="struggle"
              value={formData.struggle}
              onChange={(e) => setFormData(prev => ({ ...prev, struggle: e.target.value }))}
              placeholder="e.g., Procrastination"
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
      case 4:
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
    <div className="min-h-screen pb-6">
      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-bold text-center text-gradient">Let's Get Started</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {renderStep()}
          
          {error && (
            <div className="text-red-500 text-center p-2">
              {error}
            </div>
          )}
        </form>
        
        <div className="flex justify-center space-x-2 mt-6">
          {[1, 2, 3, 4].map((i) => (
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
