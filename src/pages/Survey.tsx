
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useApp } from "@/context/AppContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { AIService } from "@/services/AIService";

const themes = [
  { id: "Focus", label: "Focus & Productivity" },
  { id: "Fitness", label: "Fitness & Health" },
  { id: "Mindfulness", label: "Mindfulness & Meditation" },
  { id: "Learning", label: "Learning & Growth" },
  { id: "Discipline", label: "Discipline & Habits" }
];

const Survey = () => {
  const navigate = useNavigate();
  const { setSelectedTheme, user } = useApp();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  
  // Form fields
  const [selectedThemeId, setSelectedThemeId] = useState<string>("Discipline");
  const [goal, setGoal] = useState<string>("");
  const [struggle, setStruggle] = useState<string>("");
  const [dailyTime, setDailyTime] = useState<number>(30);
  
  const aiService = new AIService();
  
  const handleNextStep = () => {
    if (currentStep === 1 && !selectedThemeId) {
      toast({
        title: "Please select a theme",
        description: "Choose a theme to continue",
        variant: "destructive"
      });
      return;
    }
    
    if (currentStep === 2 && !goal) {
      toast({
        title: "Goal required",
        description: "Please enter your goal to continue",
        variant: "destructive"
      });
      return;
    }
    
    if (currentStep === 3 && !struggle) {
      toast({
        title: "Struggle required",
        description: "Please share your struggle to continue",
        variant: "destructive"
      });
      return;
    }
    
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };
  
  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const handleSubmit = async () => {
    if (!user && !user?.id) {
      toast({
        title: "Authentication required",
        description: "Please log in to create your personalized plan",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Save survey responses
      const { error: surveyError } = await supabase
        .from("survey_responses")
        .insert({
          user_id: user.id,
          theme: selectedThemeId,
          goal: goal,
          biggest_struggle: struggle,
          daily_commitment: dailyTime
        });
      
      if (surveyError) throw surveyError;
      
      // Update user profile with selected theme
      const { error: profileError } = await supabase
        .from("profiles")
        .update({ theme: selectedThemeId })
        .eq("id", user.id);
      
      if (profileError) throw profileError;
      
      // Set theme in context
      setSelectedTheme(selectedThemeId);
      
      // Generate AI roadmap
      toast({
        title: "Generating your roadmap",
        description: "This may take a moment...",
      });
      
      // Get user profile for context
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
      
      // Generate roadmap using AI
      const roadmap = await aiService.generateRoadmap(
        goal,
        struggle,
        dailyTime,
        { ...profileData, theme: selectedThemeId }
      );
      
      // Navigate to home when done
      toast({
        title: "Your journey awaits!",
        description: "We've created a personalized roadmap for you",
      });
      
      navigate("/home");
    } catch (error) {
      console.error("Error submitting survey:", error);
      toast({
        title: "Something went wrong",
        description: "Please try again later",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    },
    exit: { opacity: 0 }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };
  
  return (
    <div className="min-h-screen bg-black pt-10 px-6 pb-20">
      <motion.div
        className="max-w-md mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <motion.div variants={itemVariants}>
          <h1 className="text-2xl font-bold text-white mb-2">Personalize Your Journey</h1>
          <p className="text-white/70 mb-8">
            Answer these questions to create your custom roadmap.
          </p>
        </motion.div>
        
        {/* Progress indicator */}
        <motion.div variants={itemVariants} className="mb-8">
          <div className="flex gap-1">
            {[1, 2, 3, 4].map((step) => (
              <div
                key={step}
                className={`h-1 flex-1 rounded-full ${
                  step <= currentStep
                    ? "bg-white"
                    : "bg-white/20"
                }`}
              ></div>
            ))}
          </div>
          <div className="text-white/50 text-xs mt-2">
            Step {currentStep} of 4
          </div>
        </motion.div>
        
        {/* Step 1: Select Theme */}
        {currentStep === 1 && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            <motion.div variants={itemVariants}>
              <h2 className="text-xl font-semibold text-white mb-4">
                Choose Your Focus Area
              </h2>
              
              <div className="space-y-3">
                {themes.map((theme) => (
                  <motion.div
                    key={theme.id}
                    variants={itemVariants}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedThemeId(theme.id)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      selectedThemeId === theme.id
                        ? "border-white bg-white/10"
                        : "border-white/10 bg-white/5 hover:bg-white/10"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          selectedThemeId === theme.id
                            ? "border-white"
                            : "border-white/30"
                        }`}
                      >
                        {selectedThemeId === theme.id && (
                          <div className="w-2.5 h-2.5 bg-white rounded-full" />
                        )}
                      </div>
                      <span className="text-white font-medium">
                        {theme.label}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
        
        {/* Step 2: Goal setting */}
        {currentStep === 2 && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            <motion.div variants={itemVariants}>
              <h2 className="text-xl font-semibold text-white mb-4">
                What's your main goal?
              </h2>
              <p className="text-white/70 mb-4">
                Be specific about what you want to achieve in the next 30 days.
              </p>
              
              <textarea
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                placeholder="e.g., Establish a consistent morning routine that includes exercise and reflection"
                className="w-full h-32 p-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-white/30"
              />
            </motion.div>
          </motion.div>
        )}
        
        {/* Step 3: Struggles */}
        {currentStep === 3 && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            <motion.div variants={itemVariants}>
              <h2 className="text-xl font-semibold text-white mb-4">
                What's your biggest struggle?
              </h2>
              <p className="text-white/70 mb-4">
                Understanding your challenges helps us create a more effective plan.
              </p>
              
              <textarea
                value={struggle}
                onChange={(e) => setStruggle(e.target.value)}
                placeholder="e.g., I have trouble staying consistent with new habits and often give up after a few days"
                className="w-full h-32 p-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-white/30"
              />
            </motion.div>
          </motion.div>
        )}
        
        {/* Step 4: Time commitment */}
        {currentStep === 4 && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            <motion.div variants={itemVariants}>
              <h2 className="text-xl font-semibold text-white mb-4">
                How much time can you commit daily?
              </h2>
              <p className="text-white/70 mb-4">
                This helps us create tasks that fit into your schedule.
              </p>
              
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-white/70 text-sm">Minutes per day</span>
                    <span className="text-white font-bold">{dailyTime} min</span>
                  </div>
                  
                  <input
                    type="range"
                    min={5}
                    max={120}
                    step={5}
                    value={dailyTime}
                    onChange={(e) => setDailyTime(Number(e.target.value))}
                    className="w-full accent-white"
                  />
                  
                  <div className="flex justify-between text-xs text-white/50 mt-1">
                    <span>5 min</span>
                    <span>60 min</span>
                    <span>120 min</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
        
        {/* Navigation buttons */}
        <motion.div variants={itemVariants} className="flex gap-3 mt-10">
          {currentStep > 1 && (
            <button
              onClick={handlePreviousStep}
              className="flex-1 py-3 bg-white/5 border border-white/10 rounded-xl text-white font-medium hover:bg-white/10 transition-colors"
            >
              Back
            </button>
          )}
          
          {currentStep < 4 ? (
            <button
              onClick={handleNextStep}
              className="flex-1 py-3 bg-white text-black rounded-xl font-medium hover:bg-white/90 transition-colors"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="flex-1 py-3 bg-white text-black rounded-xl font-medium hover:bg-white/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                  <span>Processing...</span>
                </div>
              ) : (
                "Create My Plan"
              )}
            </button>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Survey;
