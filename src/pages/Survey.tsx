import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { useNavigate } from "react-router-dom";
import { ArrowRight, ArrowLeft } from "lucide-react";

type Challenge = string; // Replace this if you use enums
type Theme = "Discipline" | "Focus" | "Resilience" | "Wildcards";

const Survey = () => {
  const { user, selectedTheme, addXP } = useApp();
  const [goal, setGoal] = useState("");
  const [biggestStruggle, setBiggestStruggle] = useState<Challenge>("");
  const [dailyCommitment, setDailyCommitment] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const insertData: Database["public"]["Tables"]["survey_responses"]["Insert"] = {
        user_id: user.id,
        theme: selectedTheme as Theme,
        goal,
        biggest_struggle: biggestStruggle,
        daily_commitment: dailyCommitment,
      };

      const { error } = await supabase
        .from("survey_responses")
        .insert([insertData]);

      if (error) throw error;

      // Add XP for completing the survey
      addXP(50);
      
      // Navigate to home page
      navigate("/home");
    } catch (error) {
      console.error("Error saving survey response:", error);
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

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">What's your main goal?</h2>
            <p className="text-white/70">
              Tell us what you want to achieve with {selectedTheme}.
            </p>
            <textarea
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              className="w-full h-32 bg-[#1A1A1A] border border-white/10 rounded-xl p-4 text-white resize-none focus:outline-none focus:border-white/30"
              placeholder="I want to..."
            />
            <button
              onClick={nextStep}
              disabled={!goal.trim()}
              className={`w-full py-3 rounded-xl flex items-center justify-center gap-2 transition-all ${
                goal.trim()
                  ? "bg-white text-black hover:bg-white/90 active:scale-[0.98]"
                  : "bg-white/20 text-white/50 cursor-not-allowed"
              }`}
            >
              Next <ArrowRight size={18} />
            </button>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">What's your biggest struggle?</h2>
            <p className="text-white/70">
              Understanding your challenges helps us create a better plan for you.
            </p>
            <textarea
              value={biggestStruggle}
              onChange={(e) => setBiggestStruggle(e.target.value)}
              className="w-full h-32 bg-[#1A1A1A] border border-white/10 rounded-xl p-4 text-white resize-none focus:outline-none focus:border-white/30"
              placeholder="My biggest challenge is..."
            />
            <div className="flex gap-3">
              <button
                onClick={prevStep}
                className="flex-1 py-3 rounded-xl bg-[#1A1A1A] border border-white/10 text-white flex items-center justify-center gap-2 hover:bg-[#222222] active:scale-[0.98] transition-all"
              >
                <ArrowLeft size={18} /> Back
              </button>
              <button
                onClick={nextStep}
                disabled={!biggestStruggle.trim()}
                className={`flex-1 py-3 rounded-xl flex items-center justify-center gap-2 transition-all ${
                  biggestStruggle.trim()
                    ? "bg-white text-black hover:bg-white/90 active:scale-[0.98]"
                    : "bg-white/20 text-white/50 cursor-not-allowed"
                }`}
              >
                Next <ArrowRight size={18} />
              </button>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Daily commitment</h2>
            <p className="text-white/70">
              How many minutes can you commit each day to {selectedTheme}?
            </p>
            <div className="grid grid-cols-3 gap-3">
              {[15, 30, 45, 60, 90, 120].map((minutes) => (
                <button
                  key={minutes}
                  onClick={() => setDailyCommitment(minutes)}
                  className={`py-3 rounded-xl border transition-all ${
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
                    <span className="animate-spin h-4 w-4 border-2 border-white/20 border-t-white rounded-full"></span>
                    Saving...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Finish <ArrowRight size={18} />
                  </span>
                )}
              </button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-white">
      <div className="w-full max-w-md">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <h1 className="text-xl font-bold">{selectedTheme} Survey</h1>
            <div className="text-sm text-white/50">Step {step} of 3</div>
          </div>
          <div className="w-full h-1.5 bg-[#1A1A1A] rounded-full overflow-hidden">
            <div
              className="h-full bg-white transition-all duration-300"
              style={{ width: `${(step / 3) * 100}%` }}
            ></div>
          </div>
        </div>

        {renderStep()}
      </div>
    </div>
  );
};

export default Survey;
