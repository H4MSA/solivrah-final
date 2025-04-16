
import React, { useState, useEffect } from "react";
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
  const [bubbles, setBubbles] = useState<Array<{id: number, size: number, left: string, top: string, delay: number}>>([]);
  
  useEffect(() => {
    // Create dynamic background bubbles
    const newBubbles = Array.from({ length: 5 }, (_, i) => ({
      id: i,
      size: Math.floor(Math.random() * 100) + 50,
      left: `${Math.floor(Math.random() * 100)}%`,
      top: `${Math.floor(Math.random() * 100)}%`,
      delay: Math.random() * 5
    }));
    setBubbles(newBubbles);
  }, []);
  
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
      
      // Simulate API call to generate roadmap with a loading animation
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
          <GlassCard className="animate-pop-in" variant="elevated">
            <h2 className="text-2xl font-bold text-white mb-5 text-center">What's your biggest challenge?</h2>
            <div className="space-y-4">
              {["Procrastination", "Distractions", "Setbacks", "Creative Block"].map((challenge) => (
                <div 
                  key={challenge}
                  onClick={() => setFormData(prev => ({ ...prev, challenge: challenge as Challenge }))}
                  className={`flex items-center justify-between p-4 rounded-xl transition-all duration-300 cursor-pointer
                    ${formData.challenge === challenge ? 
                      'bg-primary/30 border border-primary/50 shadow-lg shadow-primary/20' : 
                      'bg-card/40 backdrop-blur-md border border-white/5 hover:border-white/20'}
                    interactive
                  `}
                >
                  <span className="font-medium">{challenge}</span>
                  {formData.challenge === challenge && <FiCheck className="text-primary" />}
                </div>
              ))}
            </div>
            <button 
              type="button" 
              className="btn-primary w-full mt-8 flex items-center justify-center gap-2 text-lg py-4"
              onClick={goToNextStep}
            >
              Continue <FiArrowRight />
            </button>
          </GlassCard>
        );
      case 2:
        return (
          <GlassCard className="animate-pop-in" variant="primary">
            <h2 className="text-2xl font-bold text-white mb-2 text-center">Your Goal</h2>
            <p className="text-muted-foreground text-center text-sm mb-6">What do you want to achieve with Solivrah?</p>
            <textarea
              name="goal"
              value={formData.goal}
              onChange={handleChange}
              placeholder="e.g., Build consistent habits, Improve focus, Overcome procrastination..."
              className="w-full p-4 rounded-xl glass text-white bg-card/30 backdrop-blur-md min-h-[150px] resize-none border border-white/10 focus:border-primary/50 outline-none transition-all duration-300 shadow-inner"
            />
            <div className="flex gap-3 mt-8">
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
          <GlassCard className="animate-pop-in" variant="accent">
            <h2 className="text-2xl font-bold text-white mb-2 text-center">Time Commitment</h2>
            <p className="text-muted-foreground text-center text-sm mb-6">How much time can you dedicate daily?</p>
            
            <div className="mb-8">
              <div className="text-center mb-3">
                <span className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">{formData.timeCommitment} minutes/day</span>
              </div>
              
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">5 min</span>
                <span className="text-sm text-muted-foreground">60 min</span>
              </div>
              
              <input
                type="range"
                name="timeCommitment"
                min="5"
                max="60"
                step="5"
                value={formData.timeCommitment}
                onChange={handleChange}
                className="w-full accent-primary"
              />
              
              <div className="flex justify-between mt-2">
                <span className="text-xs text-muted-foreground">Minimal</span>
                <span className="text-xs text-muted-foreground">Recommended</span>
                <span className="text-xs text-muted-foreground">Dedicated</span>
              </div>
            </div>
            
            <div className="flex gap-3 mt-8">
              <button 
                type="button" 
                className="btn-secondary flex-1 flex items-center justify-center gap-2"
                onClick={goToPrevStep}
              >
                <FiArrowLeft /> Back
              </button>
              <button 
                type="submit" 
                className="btn-primary flex-1 flex items-center justify-center gap-2 py-4"
                disabled={isLoading}
                onClick={handleSubmit}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Creating...</span>
                  </div>
                ) : (
                  <>Generate Roadmap <FiArrowRight /></>
                )}
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
      {/* Dynamic background bubbles */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {bubbles.map(bubble => (
          <div 
            key={bubble.id} 
            className="bubble" 
            style={{ 
              width: `${bubble.size}px`, 
              height: `${bubble.size}px`, 
              left: bubble.left, 
              top: bubble.top,
              animationDelay: `${bubble.delay}s`,
              background: bubble.id % 2 === 0 ? 'rgba(197, 114, 255, 0.05)' : 'rgba(96, 150, 255, 0.05)'
            }}
          />
        ))}
        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-primary/5 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-secondary/5 rounded-full blur-[100px]"></div>
      </div>
      
      <div className="p-6 space-y-8 z-10 relative">
        <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-primary to-white bg-clip-text text-transparent animate-fade-in mt-6">Let's Get Started</h1>
        
        <div className="space-y-6 max-w-md mx-auto">
          {renderStep()}
          
          {error && (
            <div className="text-red-500 text-center p-3 glass rounded-xl animate-shake">
              {error}
            </div>
          )}
        </div>
        
        <div className="flex justify-center space-x-3 mt-8">
          {[1, 2, 3].map((i) => (
            <div 
              key={i}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                step === i ? 'bg-primary scale-125' : 'bg-muted/50'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Survey;
