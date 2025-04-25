
import React, { useState, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { ArrowRight, ArrowLeft, CheckCircle, FileQuestion, Target, Clock, HelpCircle, PenLine, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "@/components/GlassCard";
import { useToast } from "@/hooks/use-toast";

type Challenge = string;
type Theme = "Discipline" | "Focus" | "Resilience" | "Wildcards";

const themes = [
  { value: "Discipline", label: "Discipline", 
    description: "Master self-control and build lasting habits" },
  { value: "Focus", label: "Focus", 
    description: "Enhance concentration and mental clarity" },
  { value: "Resilience", label: "Resilience", 
    description: "Develop mental toughness and adaptability" },
  { value: "Wildcards", label: "Wildcards", 
    description: "Embrace unexpected challenges that expand your comfort zone" }
];

const COMMON_CHALLENGES = [
  "Procrastination",
  "Lack of motivation",
  "Inconsistent habits",
  "Poor time management",
  "Difficulty focusing",
  "Perfectionism",
  "Negative self-talk",
  "Indecisiveness",
  "Overthinking",
  "Burnout",
  "Fear of failure",
  "Social media addiction"
];

const Survey = () => {
  const { user, selectedTheme, setSelectedTheme, addXP } = useApp();
  const [theme, setTheme] = useState<Theme>(selectedTheme as Theme);
  const [goal, setGoal] = useState("");
  const [biggestStruggle, setBiggestStruggle] = useState<Challenge>("");
  const [customStruggle, setCustomStruggle] = useState("");
  const [dailyCommitment, setDailyCommitment] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [showSuggestedGoals, setShowSuggestedGoals] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Update the context theme when theme state changes
    setSelectedTheme(theme);
  }, [theme, setSelectedTheme]);

  const getSuggestedGoals = (selectedTheme: string) => {
    switch (selectedTheme) {
      case 'Discipline':
        return [
          "Build a morning ritual that sets me up for success",
          "Complete a 30-day fitness challenge without missing a day",
          "Establish a consistent meditation practice"
        ];
      case 'Focus':
        return [
          "Master deep work sessions without digital distractions",
          "Reduce screen time by 50% and redirect to meaningful activities",
          "Improve my ability to stay present during conversations"
        ];
      case 'Resilience':
        return [
          "Learn to handle criticism constructively without emotional reactions",
          "Develop a daily gratitude practice to shift my perspective",
          "Build confidence by tackling one fear each week"
        ];
      case 'Wildcards':
        return [
          "Try something completely new every week for a month",
          "Connect meaningfully with one new person each week",
          "Document a 30-day personal transformation challenge"
        ];
      default:
        return [];
    }
  };

  const handleSubmit = async () => {
    if (!user) return;

    setLoading(true);
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
      
      // Navigate to home page immediately - this was likely the issue
      navigate("/home");
    } catch (error) {
      console.error("Error saving survey response:", error);
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
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 }
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
                  variant={theme === t.value ? "primary" : "dark"}
                  className={`p-5 transition-all cursor-pointer ${
                    theme === t.value 
                    ? "border-white scale-[1.02]" 
                    : "border-white/10 hover:border-white/30"
                  }`}
                  onClick={() => setTheme(t.value as Theme)}
                >
                  <div className="flex items-center">
                    <div className={`
                      w-6 h-6 rounded-full border-2 flex items-center justify-center
                      ${theme === t.value ? "border-black bg-white" : "border-white/50"}
                    `}>
                      {theme === t.value && (
                        <CheckCircle className={`w-4 h-4 ${theme === t.value ? "text-black" : "text-white"}`} />
                      )}
                    </div>
                    <div className="ml-3">
                      <h3 className={`${theme === t.value ? "text-black" : "text-white"} font-medium text-lg`}>{t.label}</h3>
                      <p className={`${theme === t.value ? "text-black/70" : "text-white/60"} text-sm`}>{t.description}</p>
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>

            <button
              onClick={nextStep}
              className="w-full py-4 rounded-xl bg-white text-black flex items-center justify-center gap-2 transition-all hover:bg-white/90 active:scale-[0.98] font-medium text-lg"
            >
              Continue <ArrowRight size={20} />
            </button>
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
                Define what success looks like on your {theme} journey
              </p>
            </div>

            <div className="space-y-4">
              <textarea
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                className="w-full h-32 bg-[#1A1A1A] border border-white/20 rounded-xl p-4 text-white resize-none focus:outline-none focus:border-white/30 text-lg"
                placeholder="My goal is to..."
              />

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
                  <div className="mt-3 space-y-2">
                    {getSuggestedGoals(theme).map((suggestion, idx) => (
                      <div 
                        key={idx}
                        onClick={() => setGoal(suggestion)}
                        className="p-3.5 bg-white/5 border border-white/10 rounded-lg cursor-pointer hover:bg-white/10 transition-colors"
                      >
                        <p className="text-white text-md">{suggestion}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={prevStep}
                className="flex-1 py-3.5 rounded-xl bg-[#1A1A1A] border border-white/10 text-white flex items-center justify-center gap-2 hover:bg-[#222222] active:scale-[0.98] transition-all font-medium"
              >
                <ArrowLeft size={18} /> Back
              </button>
              <button
                onClick={nextStep}
                disabled={!goal.trim()}
                className={`flex-1 py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all font-medium ${
                  goal.trim()
                    ? "bg-white text-black hover:bg-white/90 active:scale-[0.98]"
                    : "bg-white/20 text-white/50 cursor-not-allowed"
                }`}
              >
                Next <ArrowRight size={18} />
              </button>
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
              {COMMON_CHALLENGES.map(challenge => (
                <div
                  key={challenge}
                  onClick={() => setBiggestStruggle(challenge)}
                  className={`p-3.5 rounded-lg transition-all cursor-pointer ${
                    biggestStruggle === challenge
                      ? "bg-white text-black border border-white"
                      : "bg-[#1A1A1A] border border-white/20 hover:bg-[#222222] text-white"
                  }`}
                >
                  <span className="text-sm font-medium">{challenge}</span>
                </div>
              ))}
              <div
                onClick={() => setBiggestStruggle("Other")}
                className={`p-3.5 rounded-lg transition-all cursor-pointer ${
                  biggestStruggle === "Other"
                    ? "bg-white text-black border border-white"
                    : "bg-[#1A1A1A] border border-white/20 hover:bg-[#222222] text-white"
                }`}
              >
                <span className="text-sm font-medium">Other</span>
              </div>
            </div>

            {biggestStruggle === "Other" && (
              <div className="mt-4">
                <input
                  type="text"
                  value={customStruggle}
                  onChange={(e) => setCustomStruggle(e.target.value)}
                  placeholder="Describe your challenge..."
                  className="w-full bg-[#1A1A1A] border border-white/20 rounded-lg p-3.5 text-white focus:outline-none focus:border-white/30 text-md"
                />
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={prevStep}
                className="flex-1 py-3.5 rounded-xl bg-[#1A1A1A] border border-white/20 text-white flex items-center justify-center gap-2 hover:bg-[#222222] active:scale-[0.98] transition-all font-medium"
              >
                <ArrowLeft size={18} /> Back
              </button>
              <button
                onClick={nextStep}
                disabled={!biggestStruggle || (biggestStruggle === "Other" && !customStruggle.trim())}
                className={`flex-1 py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all font-medium ${
                  (biggestStruggle && biggestStruggle !== "Other") || (biggestStruggle === "Other" && customStruggle.trim())
                    ? "bg-white text-black hover:bg-white/90 active:scale-[0.98]"
                    : "bg-white/20 text-white/50 cursor-not-allowed"
                }`}
              >
                Next <ArrowRight size={18} />
              </button>
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
                <button
                  key={minutes}
                  onClick={() => setDailyCommitment(minutes)}
                  className={`py-4 rounded-xl transition-all ${
                    dailyCommitment === minutes
                      ? "bg-white text-black border border-white font-bold"
                      : "bg-[#1A1A1A] border-white/20 border text-white hover:bg-[#222222]"
                  }`}
                >
                  {minutes} min
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={prevStep}
                className="flex-1 py-3.5 rounded-xl bg-[#1A1A1A] border border-white/20 text-white flex items-center justify-center gap-2 hover:bg-[#222222] active:scale-[0.98] transition-all font-medium"
              >
                <ArrowLeft size={18} /> Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={!dailyCommitment || loading}
                className={`flex-1 py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all font-medium ${
                  dailyCommitment && !loading
                    ? "bg-white text-black hover:bg-white/90 active:scale-[0.98]"
                    : "bg-white/20 text-white/50 cursor-not-allowed"
                }`}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="animate-spin h-4 w-4 border-2 border-black/20 border-t-black rounded-full"></span>
                    Creating Plan...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Complete <ArrowRight size={18} />
                  </span>
                )}
              </button>
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
            <h1 className="text-xl font-bold">{theme} Journey</h1>
            <div className="text-sm text-white/60 font-medium">Step {step} of 4</div>
          </div>
          <div className="w-full h-2 bg-[#1A1A1A] rounded-full overflow-hidden">
            <div
              className="h-full bg-white transition-all duration-300"
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
