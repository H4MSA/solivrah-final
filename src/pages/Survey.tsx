
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useApp } from "@/context/AppContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { AIService } from "@/services/AIService";
import { Check, ArrowRight, Star, Clock } from "lucide-react";

const themes = [
  { id: "Focus", label: "Focus & Productivity" },
  { id: "Fitness", label: "Fitness & Health" },
  { id: "Mindfulness", label: "Mindfulness & Meditation" },
  { id: "Learning", label: "Learning & Growth" },
  { id: "Discipline", label: "Discipline & Habits" }
];

// Goal suggestions based on theme
const goalSuggestions = {
  Focus: [
    "Establish a morning routine to improve daily productivity",
    "Complete focused work sessions without distractions",
    "Organize my workspace and digital environment",
    "Develop a system to track and prioritize tasks effectively"
  ],
  Fitness: [
    "Exercise for 30 minutes at least 5 days a week",
    "Improve my endurance by adding 5 minutes to my cardio routine each week",
    "Learn and practice proper form for three new strength exercises",
    "Establish a consistent post-workout recovery routine"
  ],
  Mindfulness: [
    "Practice daily meditation for at least 10 minutes",
    "Create a mindful morning ritual to start each day with intention",
    "Practice mindful eating at one meal per day",
    "Develop a gratitude practice before bed each night"
  ],
  Learning: [
    "Master the fundamentals of a new skill I've been wanting to learn",
    "Read 20 pages of educational content daily",
    "Complete one online course related to my interests or career",
    "Practice applied learning by creating something with my new knowledge"
  ],
  Discipline: [
    "Establish and maintain three key daily habits consistently",
    "Build a consistent sleep schedule with fixed wake-up times",
    "Follow through on commitments I make to myself",
    "Replace one unhelpful habit with a beneficial one"
  ]
};

// Struggle suggestions based on theme
const struggleSuggestions = {
  Focus: [
    "I'm easily distracted by notifications and social media",
    "I procrastinate on important tasks until the last minute",
    "I have trouble prioritizing what to work on first",
    "My energy fluctuates throughout the day making focus inconsistent"
  ],
  Fitness: [
    "I struggle with staying motivated after the initial excitement wears off",
    "I don't know how to structure an effective workout routine",
    "I have difficulty making time for exercise in my busy schedule",
    "I get discouraged when I don't see immediate results"
  ],
  Mindfulness: [
    "My mind races constantly and I struggle to quiet my thoughts",
    "I find it difficult to be present instead of worrying about the future",
    "I react emotionally to situations instead of responding mindfully",
    "I get frustrated when trying to meditate and 'do it right'"
  ],
  Learning: [
    "I start learning many things but rarely finish mastering any of them",
    "I struggle with applying what I learn to real-world situations",
    "I get overwhelmed by how much there is to learn and don't know where to focus",
    "I have trouble retaining information after studying it"
  ],
  Discipline: [
    "I start strong but lose motivation after a few days",
    "I give in to immediate gratification at the expense of long-term goals",
    "I struggle with consistency and maintaining routines",
    "I often make excuses when facing challenges or discomfort"
  ]
};

const Survey = () => {
  const navigate = useNavigate();
  const { setSelectedTheme, user, isGuest } = useApp();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  
  // Form fields
  const [selectedThemeId, setSelectedThemeId] = useState<string>("Discipline");
  const [goal, setGoal] = useState<string>("");
  const [struggle, setStruggle] = useState<string>("");
  const [dailyTime, setDailyTime] = useState<number>(30);
  const [showGoalSuggestions, setShowGoalSuggestions] = useState<boolean>(false);
  const [showStruggleSuggestions, setShowStruggleSuggestions] = useState<boolean>(false);
  
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

  const handleSelectSuggestion = (type: 'goal' | 'struggle', suggestion: string) => {
    if (type === 'goal') {
      setGoal(suggestion);
      setShowGoalSuggestions(false);
    } else {
      setStruggle(suggestion);
      setShowStruggleSuggestions(false);
    }
    
    // Provide positive feedback for selection
    toast({
      title: "Great choice!",
      description: "You can also customize it to fit your unique needs.",
      duration: 3000,
    });
  };
  
  const handleSubmit = async () => {
    setIsLoading(true);
    
    try {
      // Generate a unique ID for guest users
      const guestId = isGuest ? `guest_${Date.now()}_${Math.random().toString(36).substring(2, 9)}` : null;
      
      if (!isGuest && !user?.id) {
        toast({
          title: "Authentication required",
          description: "Please log in to create your personalized plan",
          variant: "destructive"
        });
        setIsLoading(false);
        return;
      }
      
      // Set theme in context regardless of auth status
      setSelectedTheme(selectedThemeId);
      
      // For authenticated users, save survey responses
      if (!isGuest && user?.id) {
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
      }
      
      // For guest mode, set completed survey flag in localStorage
      if (isGuest) {
        localStorage.setItem('hasCompletedSurvey', 'true');
        localStorage.setItem('guestTheme', selectedThemeId);
        localStorage.setItem('guestGoal', goal);
        localStorage.setItem('guestStruggle', struggle);
        localStorage.setItem('guestDailyTime', dailyTime.toString());
        localStorage.setItem('guestId', guestId || '');
      }
      
      // Show creating roadmap toast
      toast({
        title: "Creating your personalized journey",
        description: "We're crafting a plan just for you...",
      });
      
      // Get user profile for context (or use guest data)
      let profileData = {};
      
      if (!isGuest && user?.id) {
        const { data: userData } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();
        
        if (userData) {
          profileData = userData;
        }
      } else {
        // For guests, create a simplified profile object
        profileData = {
          id: guestId,
          theme: selectedThemeId,
          is_guest: true
        };
      }
      
      console.log("Generating roadmap with profile:", { ...profileData, theme: selectedThemeId });
      
      // Generate roadmap using AI
      const roadmap = await aiService.generateRoadmap(
        goal,
        struggle,
        dailyTime,
        { ...profileData, theme: selectedThemeId }
      );
      
      // Store the generated roadmap for guest users
      if (isGuest) {
        localStorage.setItem('guestRoadmap', JSON.stringify(roadmap));
      }
      
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
    <div className="min-h-screen bg-gray-100 pt-12 px-6 pb-20 z-10 relative">
      <motion.div
        className="max-w-md mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <motion.div variants={itemVariants}>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Personalize Your Journey</h1>
          <p className="text-gray-600 mb-8">
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
                    ? "bg-gray-900"
                    : "bg-gray-300"
                }`}
              ></div>
            ))}
          </div>
          <div className="text-gray-500 text-xs mt-2">
            Step {currentStep} of 4
          </div>
        </motion.div>
        
        <div className="backdrop-blur-lg bg-white/70 rounded-xl p-6 border border-gray-200 shadow-lg mb-8">
          {/* Step 1: Select Theme */}
          {currentStep === 1 && (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-6"
            >
              <motion.div variants={itemVariants}>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Choose Your Focus Area
                </h2>
                
                <div className="space-y-3">
                  {themes.map((theme) => (
                    <motion.div
                      key={theme.id}
                      variants={itemVariants}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedThemeId(theme.id)}
                      className={`p-4 rounded-xl cursor-pointer transition-all shadow-sm ${
                        selectedThemeId === theme.id
                          ? "border-2 border-gray-900 bg-white"
                          : "border border-gray-300 bg-white/60 hover:bg-white"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            selectedThemeId === theme.id
                              ? "border-gray-900"
                              : "border-gray-400"
                          }`}
                        >
                          {selectedThemeId === theme.id && (
                            <div className="w-2.5 h-2.5 bg-gray-900 rounded-full" />
                          )}
                        </div>
                        <span className="text-gray-900 font-medium">
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
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  What's your main goal?
                </h2>
                <p className="text-gray-600 mb-4">
                  Be specific about what you want to achieve in the next 30 days.
                </p>
                
                <div className="space-y-4">
                  <textarea
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                    placeholder="e.g., Establish a consistent morning routine that includes exercise and reflection"
                    className="w-full h-32 p-4 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500/20"
                  />
                  
                  {/* Need inspiration button */}
                  <button 
                    onClick={() => setShowGoalSuggestions(!showGoalSuggestions)}
                    className="w-full py-2 px-3 text-sm border border-gray-300 rounded-lg bg-white/80 text-gray-700 hover:bg-white hover:text-gray-900 transition-colors"
                  >
                    {showGoalSuggestions ? "Hide suggestions" : "Need inspiration? See suggestions"}
                  </button>
                  
                  {/* Goal suggestions */}
                  {showGoalSuggestions && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="space-y-2 mt-3"
                    >
                      <p className="text-gray-500 text-sm mb-2">Select a suggestion or use as inspiration:</p>
                      {goalSuggestions[selectedThemeId as keyof typeof goalSuggestions].map((suggestion, index) => (
                        <div 
                          key={index}
                          onClick={() => handleSelectSuggestion('goal', suggestion)}
                          className="p-3 rounded-lg bg-white border border-gray-200 text-gray-800 cursor-pointer hover:bg-gray-50 transition-all text-sm flex items-start gap-2"
                        >
                          <div className="mt-0.5">
                            <Check size={14} className="text-gray-400" />
                          </div>
                          <span>{suggestion}</span>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </div>
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
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  What's your biggest struggle?
                </h2>
                <p className="text-gray-600 mb-4">
                  Understanding your challenges helps us create a more effective plan.
                </p>
                
                <div className="space-y-4">
                  <textarea
                    value={struggle}
                    onChange={(e) => setStruggle(e.target.value)}
                    placeholder="e.g., I have trouble staying consistent with new habits and often give up after a few days"
                    className="w-full h-32 p-4 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500/20"
                  />
                  
                  {/* Need inspiration button */}
                  <button 
                    onClick={() => setShowStruggleSuggestions(!showStruggleSuggestions)}
                    className="w-full py-2 px-3 text-sm border border-gray-300 rounded-lg bg-white/80 text-gray-700 hover:bg-white hover:text-gray-900 transition-colors"
                  >
                    {showStruggleSuggestions ? "Hide suggestions" : "Need inspiration? See suggestions"}
                  </button>
                  
                  {/* Struggle suggestions */}
                  {showStruggleSuggestions && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="space-y-2 mt-3"
                    >
                      <p className="text-gray-500 text-sm mb-2">Select a struggle that resonates with you:</p>
                      {struggleSuggestions[selectedThemeId as keyof typeof struggleSuggestions].map((suggestion, index) => (
                        <div 
                          key={index}
                          onClick={() => handleSelectSuggestion('struggle', suggestion)}
                          className="p-3 rounded-lg bg-white border border-gray-200 text-gray-800 cursor-pointer hover:bg-gray-50 transition-all text-sm flex items-start gap-2"
                        >
                          <div className="mt-0.5">
                            <Check size={14} className="text-gray-400" />
                          </div>
                          <span>{suggestion}</span>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </div>
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
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  How much time can you commit daily?
                </h2>
                <p className="text-gray-600 mb-4">
                  This helps us create tasks that fit into your schedule.
                </p>
                
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center text-gray-700 text-sm">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>Minutes per day</span>
                      </div>
                      <span className="text-gray-900 font-bold">{dailyTime} min</span>
                    </div>
                    
                    <input
                      type="range"
                      min={5}
                      max={120}
                      step={5}
                      value={dailyTime}
                      onChange={(e) => setDailyTime(Number(e.target.value))}
                      className="w-full accent-gray-900"
                    />
                    
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>5 min</span>
                      <span>60 min</span>
                      <span>120 min</span>
                    </div>
                  </div>

                  <div className="mt-6 p-4 border border-gray-200 rounded-xl bg-white/80">
                    <div className="flex items-center mb-2">
                      <Star className="h-4 w-4 text-gray-700 mr-1.5" />
                      <h3 className="text-gray-900 font-medium text-sm">What to expect next:</h3>
                    </div>
                    <p className="text-gray-600 text-sm">
                      We'll use your responses to create a personalized 30-day journey with 
                      achievable daily quests designed specifically for your goals and schedule.
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </div>
        
        {/* Navigation buttons */}
        <motion.div variants={itemVariants} className="flex gap-3 mt-6">
          {currentStep > 1 && (
            <button
              onClick={handlePreviousStep}
              className="flex-1 py-3 px-4 bg-white border border-gray-300 text-gray-700 rounded-xl font-medium transition-all hover:bg-gray-50 hover:text-gray-900 active:scale-[0.98]"
            >
              Back
            </button>
          )}
          
          {currentStep < 4 ? (
            <button
              onClick={handleNextStep}
              className="flex-1 py-3 px-4 flex items-center justify-center bg-gray-900 text-white rounded-xl font-medium transition-all hover:bg-gray-800 active:scale-[0.98]"
            >
              <span>Next</span>
              <ArrowRight className="ml-1.5 h-4 w-4" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="flex-1 py-3 px-4 bg-gray-900 text-white rounded-xl font-medium transition-all hover:bg-gray-800 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
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
