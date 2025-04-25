
import React, { useState, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { ArrowRight, ArrowLeft, CheckCircle, FileQuestion, Target, Clock, HelpCircle, PenLine } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "@/components/GlassCard";
import { useToast } from "@/hooks/use-toast";

type Challenge = string;
type Theme = "Discipline" | "Focus" | "Resilience" | "Wildcards";

const themes = [
  { value: "Discipline", label: "Discipline", 
    description: "Building consistent habits and self-control" },
  { value: "Focus", label: "Focus", 
    description: "Improving concentration and mental clarity" },
  { value: "Resilience", label: "Resilience", 
    description: "Developing mental toughness and adaptability" },
  { value: "Wildcards", label: "Wildcards", 
    description: "Unexpected challenges to push your boundaries" }
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
          "Build a daily morning routine",
          "Complete a 30-day fitness challenge",
          "Learn to meditate for 10 minutes daily"
        ];
      case 'Focus':
        return [
          "Complete deep work sessions without distractions",
          "Reduce screen time by 50%",
          "Master a new skill through deliberate practice"
        ];
      case 'Resilience':
        return [
          "Learn to handle criticism constructively",
          "Practice daily gratitude journaling",
          "Take on a personal challenge outside my comfort zone"
        ];
      case 'Wildcards':
        return [
          "Try something new every week for a month",
          "Connect with one new person every week",
          "Document a 30-day transformation journey"
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
      addXP(50);
      
      toast({
        title: "Journey Started! +50 XP",
        description: "Your personalized plan is ready. Let's get started!",
        duration: 4000,
      });

      // Navigate to home page with a slight delay for the toast to be seen
      setTimeout(() => {
        navigate("/home");
      }, 1000);
    } catch (error) {
      console.error("Error saving survey response:", error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
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
                <Target className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white">Choose Your Focus</h2>
              <p className="text-white/70 mt-2">
                Which area do you want to improve in your life?
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {themes.map(t => (
                <GlassCard 
                  key={t.value}
                  variant="dark"
                  className={`p-4 transition-all cursor-pointer border-2 ${
                    theme === t.value 
                    ? "border-white scale-[1.02]" 
                    : "border-white/10 hover:border-white/30"
                  }`}
                  onClick={() => setTheme(t.value as Theme)}
                >
                  <div className="flex items-center">
                    <div className={`
                      w-5 h-5 rounded-full border-2 flex items-center justify-center
                      ${theme === t.value ? "border-white bg-white" : "border-white/50"}
                    `}>
                      {theme === t.value && (
                        <CheckCircle className="w-3 h-3 text-black" />
                      )}
                    </div>
                    <div className="ml-3">
                      <h3 className="text-white font-medium">{t.label}</h3>
                      <p className="text-white/60 text-sm">{t.description}</p>
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>

            <button
              onClick={nextStep}
              className="w-full py-3 rounded-xl bg-white text-black flex items-center justify-center gap-2 transition-all hover:bg-white/90 active:scale-[0.98]"
            >
              Continue <ArrowRight size={18} />
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
              <h2 className="text-2xl font-bold text-white">What's your goal?</h2>
              <p className="text-white/70 mt-2">
                Tell us what you want to achieve with {theme}.
              </p>
            </div>

            <div className="space-y-4">
              <textarea
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                className="w-full h-32 bg-[#1A1A1A] border border-white/10 rounded-xl p-4 text-white resize-none focus:outline-none focus:border-white/30"
                placeholder="I want to..."
              />

              <div>
                <button
                  type="button"
                  onClick={() => setShowSuggestedGoals(!showSuggestedGoals)}
                  className="text-sm flex items-center gap-1 text-white/70 hover:text-white"
                >
                  <HelpCircle size={14} />
                  {showSuggestedGoals ? "Hide suggestions" : "Need inspiration?"}
                </button>
                
                {showSuggestedGoals && (
                  <div className="mt-3 space-y-2">
                    {getSuggestedGoals(theme).map((suggestion, idx) => (
                      <div 
                        key={idx}
                        onClick={() => setGoal(suggestion)}
                        className="p-3 bg-white/5 border border-white/10 rounded-lg cursor-pointer hover:bg-white/10 transition-colors"
                      >
                        <p className="text-sm text-white">{suggestion}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={prevStep}
                className="flex-1 py-3 rounded-xl bg-[#1A1A1A] border border-white/10 text-white flex items-center justify-center gap-2 hover:bg-[#222222] active:scale-[0.98] transition-all"
              >
                <ArrowLeft size={18} /> Back
              </button>
              <button
                onClick={nextStep}
                disabled={!goal.trim()}
                className={`flex-1 py-3 rounded-xl flex items-center justify-center gap-2 transition-all ${
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
              <h2 className="text-2xl font-bold text-white">What's your biggest struggle?</h2>
              <p className="text-white/70 mt-2">
                Understanding your challenges helps us create a better plan for you.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 max-h-[35vh] overflow-y-auto pr-2">
              {COMMON_CHALLENGES.map(challenge => (
                <div
                  key={challenge}
                  onClick={() => setBiggestStruggle(challenge)}
                  className={`p-3 rounded-lg transition-all cursor-pointer ${
                    biggestStruggle === challenge
                      ? "bg-white/20 border border-white"
                      : "bg-[#1A1A1A] border border-white/10 hover:bg-[#222222]"
                  }`}
                >
                  <span className="text-sm">{challenge}</span>
                </div>
              ))}
              <div
                onClick={() => setBiggestStruggle("Other")}
                className={`p-3 rounded-lg transition-all cursor-pointer ${
                  biggestStruggle === "Other"
                    ? "bg-white/20 border border-white"
                    : "bg-[#1A1A1A] border border-white/10 hover:bg-[#222222]"
                }`}
              >
                <span className="text-sm">Other</span>
              </div>
            </div>

            {biggestStruggle === "Other" && (
              <div className="mt-4">
                <input
                  type="text"
                  value={customStruggle}
                  onChange={(e) => setCustomStruggle(e.target.value)}
                  placeholder="Describe your struggle..."
                  className="w-full bg-[#1A1A1A] border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-white/30"
                />
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={prevStep}
                className="flex-1 py-3 rounded-xl bg-[#1A1A1A] border border-white/10 text-white flex items-center justify-center gap-2 hover:bg-[#222222] active:scale-[0.98] transition-all"
              >
                <ArrowLeft size={18} /> Back
              </button>
              <button
                onClick={nextStep}
                disabled={!biggestStruggle || (biggestStruggle === "Other" && !customStruggle.trim())}
                className={`flex-1 py-3 rounded-xl flex items-center justify-center gap-2 transition-all ${
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
              <h2 className="text-2xl font-bold text-white">Daily commitment</h2>
              <p className="text-white/70 mt-2">
                How many minutes can you commit to {theme} each day?
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[5, 10, 15, 20, 30, 45, 60, 90, 120].map((minutes) => (
                <button
                  key={minutes}
                  onClick={() => setDailyCommitment(minutes)}
                  className={`py-4 rounded-xl border transition-all ${
                    dailyCommitment === minutes
                      ? "bg-white text-black border-white"
                      : "bg-[#1A1A1A] border-white/10 text-white hover:bg-[#222222]"
                  }`}
                >
                  {minutes} min
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={prevStep}
                className="flex-1 py-3 rounded-xl bg-[#1A1A1A] border border-white/10 text-white flex items-center justify-center gap-2 hover:bg-[#222222] active:scale-[0.98] transition-all"
              >
                <ArrowLeft size={18} /> Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={!dailyCommitment || loading}
                className={`flex-1 py-3 rounded-xl flex items-center justify-center gap-2 transition-all ${
                  dailyCommitment && !loading
                    ? "bg-white text-black hover:bg-white/90 active:scale-[0.98]"
                    : "bg-white/20 text-white/50 cursor-not-allowed"
                }`}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="animate-spin h-4 w-4 border-2 border-black/20 border-t-black rounded-full"></span>
                    Creating...
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
            <div className="text-sm text-white/50">Step {step} of 4</div>
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
