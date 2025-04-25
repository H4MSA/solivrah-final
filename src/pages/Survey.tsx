
import React, { useState, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { ArrowRight, ArrowLeft, CheckCircle, FileQuestion, Target, Clock, HelpCircle, Sparkles, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "@/components/GlassCard";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

type Challenge = string;
type Theme = "Discipline" | "Focus" | "Resilience" | "Wildcards";

const themes = [
  { 
    value: "Discipline", 
    label: "Discipline", 
    description: "Master self-control and build lasting habits",
    icon: (
      <div className="w-10 h-10 rounded-full bg-[#7c2c2c]/15 flex items-center justify-center mb-3">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="text-white">
          <circle cx="12" cy="12" r="10"></circle>
          <polyline points="12 6 12 12 16 14"></polyline>
        </svg>
      </div>
    )
  },
  { 
    value: "Focus", 
    label: "Focus", 
    description: "Enhance concentration and mental clarity",
    icon: (
      <div className="w-10 h-10 rounded-full bg-[#3a2c7c]/15 flex items-center justify-center mb-3">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="text-white">
          <circle cx="12" cy="12" r="5"></circle>
          <line x1="12" y1="1" x2="12" y2="3"></line>
          <line x1="12" y1="21" x2="12" y2="23"></line>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
          <line x1="1" y1="12" x2="3" y2="12"></line>
          <line x1="21" y1="12" x2="23" y2="12"></line>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
        </svg>
      </div>
    )
  },
  { 
    value: "Resilience", 
    label: "Resilience", 
    description: "Develop mental toughness and adaptability",
    icon: (
      <div className="w-10 h-10 rounded-full bg-[#2c7c56]/15 flex items-center justify-center mb-3">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="text-white">
          <path d="M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3H6a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 3 3 0 0 0-3-3z"></path>
        </svg>
      </div>
    )
  },
  { 
    value: "Wildcards", 
    label: "Wildcards", 
    description: "Embrace unexpected challenges that expand your comfort zone",
    icon: (
      <div className="w-10 h-10 rounded-full bg-[#7c6c2c]/15 flex items-center justify-center mb-3">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="text-white">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
        </svg>
      </div>
    )
  }
];

// Theme-specific challenges
const THEME_CHALLENGES: Record<Theme, string[]> = {
  "Discipline": [
    "Procrastination",
    "Inconsistent habits",
    "Giving up too easily",
    "Lack of routine",
    "Poor time management",
    "Difficulty sticking to commitments",
    "Distraction from technology"
  ],
  "Focus": [
    "Mind wandering during tasks",
    "Difficulty concentrating",
    "Information overload",
    "Digital distractions",
    "Multi-tasking tendencies",
    "Inability to prioritize",
    "Mental fatigue"
  ],
  "Resilience": [
    "Negative self-talk",
    "Anxiety when facing challenges",
    "Fear of failure",
    "Difficulty bouncing back",
    "Overwhelm under pressure",
    "Sensitivity to criticism",
    "Perfectionism"
  ],
  "Wildcards": [
    "Fear of the unknown",
    "Resistance to change",
    "Social anxiety",
    "Creative blocks",
    "Analysis paralysis",
    "Comfort zone attachment",
    "Risk aversion"
  ]
};

const Survey = () => {
  const { user, selectedTheme, setSelectedTheme, addXP } = useApp();
  const [theme, setTheme] = useState<Theme>(selectedTheme as Theme || "Discipline");
  const [goal, setGoal] = useState("");
  const [biggestStruggle, setBiggestStruggle] = useState<Challenge>("");
  const [customStruggle, setCustomStruggle] = useState("");
  const [dailyCommitment, setDailyCommitment] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [showSuggestedGoals, setShowSuggestedGoals] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    // Update the context theme when theme state changes
    setSelectedTheme(theme);
  }, [theme, setSelectedTheme]);

  useEffect(() => {
    // Check if user has already completed survey
    const checkSurveyCompletion = async () => {
      if (!user && !user?.id) return;
      
      try {
        const { data: surveyData, error } = await supabase
          .from('survey_responses')
          .select('*')
          .eq('user_id', user?.id)
          .maybeSingle();
          
        if (error) throw error;
        
        if (surveyData) {
          // User has already completed survey, redirect to home
          toast({
            title: "Welcome back!",
            description: "You've already completed the survey."
          });
          navigate('/home');
        }
      } catch (error) {
        console.error("Error checking survey completion:", error);
      }
    };
    
    checkSurveyCompletion();
  }, [user, navigate, toast]);

  const getSuggestedGoals = (selectedTheme: string) => {
    switch (selectedTheme) {
      case 'Discipline':
        return [
          "Build a morning ritual that sets me up for success",
          "Complete a 30-day fitness challenge without missing a day",
          "Establish a consistent meditation practice",
          "Create and maintain a balanced digital usage schedule",
          "Develop a productivity system that works for my lifestyle"
        ];
      case 'Focus':
        return [
          "Master deep work sessions without digital distractions",
          "Reduce screen time by 50% and redirect to meaningful activities",
          "Improve my ability to stay present during conversations",
          "Practice mindfulness for 10 minutes daily",
          "Create a distraction-free workspace environment"
        ];
      case 'Resilience':
        return [
          "Learn to handle criticism constructively without emotional reactions",
          "Develop a daily gratitude practice to shift my perspective",
          "Build confidence by tackling one fear each week",
          "Create a stress management toolkit for challenging moments",
          "Practice positive self-talk and affirmations daily"
        ];
      case 'Wildcards':
        return [
          "Try something completely new every week for a month",
          "Connect meaningfully with one new person each week",
          "Document a 30-day personal transformation challenge",
          "Learn a surprising skill outside my comfort zone",
          "Create a bucket list and start tackling the first item"
        ];
      default:
        return [];
    }
  };

  const handleSubmit = async () => {
    if (!user && !user?.id) {
      // Guest mode
      navigate("/home");
      return;
    }

    setLoading(true);
    setErrorMsg("");
    
    try {
      // Get the final struggle value
      const finalStruggle = biggestStruggle === "Other" ? customStruggle : biggestStruggle;

      // Insert survey response
      const { error: surveyError } = await supabase
        .from("survey_responses")
        .insert([{
          user_id: user.id,
          theme,
          goal,
          biggest_struggle: finalStruggle,
          daily_commitment: dailyCommitment
        }]);

      if (surveyError) throw surveyError;

      // Add XP for completing the survey
      await addXP(50);
      
      toast({
        title: "Journey Started! +50 XP",
        description: "Your personalized plan is ready. Let's begin your transformation!",
        duration: 4000,
      });

      console.log("Survey submitted successfully, navigating to home");
      
      // Navigate to home page
      setTimeout(() => {
        navigate("/home", { replace: true });
      }, 500);
    } catch (error: any) {
      console.error("Error saving survey response:", error);
      setErrorMsg(error.message || "We couldn't save your responses. Please try again.");
      toast({
        title: "Something went wrong",
        description: "We couldn't save your responses. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const formVariants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, x: -20, transition: { duration: 0.2 } }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <motion.div 
            key="step1"
            variants={formVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="space-y-6"
          >
            <div className="text-center mb-6">
              <div className="inline-flex p-3 bg-white/10 rounded-full mb-4">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white">Choose Your Focus Area</h2>
              <p className="text-white/70 mt-2">
                Select what matters most to you right now in your transformation journey
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {themes.map(t => (
                <GlassCard 
                  key={t.value}
                  variant={theme === t.value ? "theme" : "elevated"}
                  className={`p-5 transition-all cursor-pointer ${
                    theme === t.value 
                    ? "border-white/20 scale-[1.02] backdrop-blur-xl" 
                    : "border-white/10 hover:border-white/20"
                  }`}
                  onClick={() => setTheme(t.value as Theme)}
                >
                  <div className="flex items-center">
                    <div className={`
                      w-6 h-6 rounded-full border-2 flex items-center justify-center
                      ${theme === t.value ? "border-white bg-white/20" : "border-white/50"}
                    `}>
                      {theme === t.value && (
                        <CheckCircle className="w-4 h-4 text-white" />
                      )}
                    </div>
                    <div className="ml-3">
                      <h3 className="text-white font-medium text-lg">{t.label}</h3>
                      <p className="text-white/60 text-sm">{t.description}</p>
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>

            <Button
              onClick={nextStep}
              className="w-full py-4 rounded-xl flex items-center justify-center gap-2 transition-all hover:bg-white/90 active:scale-[0.98] font-medium text-lg"
              size="lg"
            >
              Continue <ArrowRight size={20} />
            </Button>
          </motion.div>
        );
      case 2:
        return (
          <motion.div 
            key="step2"
            variants={formVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="space-y-6"
          >
            <div className="text-center mb-6">
              <div className="inline-flex p-3 bg-white/10 rounded-full mb-4">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white">Set Your Goal</h2>
              <p className="text-white/70 mt-2">
                Define what success looks like on your <span className="text-white">{theme}</span> journey
              </p>
            </div>

            <div className="space-y-4">
              <GlassCard variant="elevated" className="p-0 overflow-hidden">
                <textarea
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  className="w-full h-32 bg-transparent border-0 p-4 text-white resize-none focus:outline-none focus:ring-0 text-lg"
                  placeholder="My goal is to..."
                />
              </GlassCard>

              <div>
                <button
                  type="button"
                  onClick={() => setShowSuggestedGoals(!showSuggestedGoals)}
                  className="text-sm flex items-center gap-1 text-white/70 hover:text-white"
                >
                  <HelpCircle size={16} />
                  {showSuggestedGoals ? "Hide suggestions" : "Need inspiration?"}
                </button>
                
                {showSuggestedGoals && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="mt-3 space-y-2"
                  >
                    {getSuggestedGoals(theme).map((suggestion, idx) => (
                      <GlassCard 
                        key={idx}
                        variant={goal === suggestion ? "theme" : "subtle"}
                        onClick={() => setGoal(suggestion)}
                        className="p-3.5 cursor-pointer transition-colors"
                      >
                        <p className="text-white text-md">{suggestion}</p>
                      </GlassCard>
                    ))}
                  </motion.div>
                )}
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={prevStep}
                variant="outline"
                className="flex-1 py-3.5 rounded-xl border border-white/10 text-white flex items-center justify-center gap-2 hover:bg-white/5 active:scale-[0.98] transition-all font-medium"
              >
                <ArrowLeft size={18} /> Back
              </Button>
              <Button
                onClick={nextStep}
                disabled={!goal.trim()}
                className="flex-1 py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all font-medium"
                variant={goal.trim() ? "default" : "secondary"}
              >
                Next <ArrowRight size={18} />
              </Button>
            </div>
          </motion.div>
        );
      case 3:
        return (
          <motion.div 
            key="step3"
            variants={formVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="space-y-6"
          >
            <div className="text-center mb-6">
              <div className="inline-flex p-3 bg-white/10 rounded-full mb-4">
                <FileQuestion className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white">Identify Your Challenge</h2>
              <p className="text-white/70 mt-2">
                Select what's currently holding you back from achieving your goals
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 max-h-[35vh] overflow-y-auto pr-2">
              {THEME_CHALLENGES[theme].map(challenge => (
                <GlassCard
                  key={challenge}
                  variant={biggestStruggle === challenge ? "theme" : "subtle"}
                  onClick={() => setBiggestStruggle(challenge)}
                  className={`p-3.5 rounded-lg transition-all cursor-pointer ${
                    biggestStruggle === challenge
                      ? "border-white/20"
                      : "border-white/10 hover:border-white/20"
                  }`}
                >
                  <span className="text-sm font-medium text-white">{challenge}</span>
                </GlassCard>
              ))}
              <GlassCard
                onClick={() => setBiggestStruggle("Other")}
                variant={biggestStruggle === "Other" ? "theme" : "subtle"}
                className={`p-3.5 rounded-lg transition-all cursor-pointer ${
                  biggestStruggle === "Other"
                    ? "border-white/20"
                    : "border-white/10 hover:border-white/20"
                }`}
              >
                <span className="text-sm font-medium text-white">Other</span>
              </GlassCard>
            </div>

            {biggestStruggle === "Other" && (
              <div className="mt-4">
                <GlassCard variant="elevated" className="p-0 overflow-hidden">
                  <input
                    type="text"
                    value={customStruggle}
                    onChange={(e) => setCustomStruggle(e.target.value)}
                    placeholder="Describe your challenge..."
                    className="w-full bg-transparent border-0 p-4 text-white focus:outline-none focus:ring-0 text-md"
                  />
                </GlassCard>
              </div>
            )}

            <div className="flex gap-3">
              <Button
                onClick={prevStep}
                variant="outline"
                className="flex-1 py-3.5 rounded-xl border border-white/10 text-white flex items-center justify-center gap-2 hover:bg-white/5 active:scale-[0.98] transition-all font-medium"
              >
                <ArrowLeft size={18} /> Back
              </Button>
              <Button
                onClick={nextStep}
                disabled={!biggestStruggle || (biggestStruggle === "Other" && !customStruggle.trim())}
                className="flex-1 py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all font-medium"
                variant={
                  (biggestStruggle && biggestStruggle !== "Other") || 
                  (biggestStruggle === "Other" && customStruggle.trim()) 
                    ? "default" 
                    : "secondary"
                }
              >
                Next <ArrowRight size={18} />
              </Button>
            </div>
          </motion.div>
        );
      case 4:
        return (
          <motion.div 
            key="step4"
            variants={formVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="space-y-6"
          >
            <div className="text-center mb-6">
              <div className="inline-flex p-3 bg-white/10 rounded-full mb-4">
                <Clock className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white">Set Your Commitment</h2>
              <p className="text-white/70 mt-2">
                How many minutes can you dedicate to your growth each day?
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[5, 10, 15, 20, 30, 45, 60, 90, 120].map((minutes) => (
                <GlassCard
                  key={minutes}
                  variant={dailyCommitment === minutes ? "theme" : "subtle"}
                  onClick={() => setDailyCommitment(minutes)}
                  className={`py-4 rounded-xl transition-all text-center ${
                    dailyCommitment === minutes
                      ? "border-white/20 font-bold"
                      : "border-white/10 hover:border-white/20"
                  }`}
                >
                  {minutes} min
                </GlassCard>
              ))}
            </div>
            
            {errorMsg && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/20 border border-red-500/20 text-white">
                <AlertCircle size={18} className="text-red-400 flex-shrink-0" />
                <p className="text-sm">{errorMsg}</p>
              </div>
            )}

            <div className="flex gap-3">
              <Button
                onClick={prevStep}
                variant="outline"
                className="flex-1 py-3.5 rounded-xl border border-white/10 text-white flex items-center justify-center gap-2 hover:bg-white/5 active:scale-[0.98] transition-all font-medium"
              >
                <ArrowLeft size={18} /> Back
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={!dailyCommitment || loading}
                className="flex-1 py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all font-medium"
                variant={dailyCommitment && !loading ? "default" : "secondary"}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="animate-spin h-4 w-4 border-2 border-white/20 border-t-white rounded-full"></span>
                    Creating Plan...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Complete <ArrowRight size={18} />
                  </span>
                )}
              </Button>
            </div>
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-white">
      <div className="w-full max-w-md">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-3">
            <h1 className="text-xl font-bold">
              <span className="text-gradient">{theme} Journey</span>
            </h1>
            <div className="text-sm text-white/60 font-medium">Step {step} of 4</div>
          </div>
          <div className="w-full h-2 bg-[#1A1A1A] rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                theme === "Discipline" ? "bg-gradient-to-r from-red-500 to-red-400" :
                theme === "Focus" ? "bg-gradient-to-r from-purple-500 to-purple-400" :
                theme === "Resilience" ? "bg-gradient-to-r from-green-500 to-green-400" :
                "bg-gradient-to-r from-amber-500 to-amber-400"
              }`}
              style={{ width: `${(step / 4) * 100}%` }}
            ></div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {renderStep()}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Survey;
