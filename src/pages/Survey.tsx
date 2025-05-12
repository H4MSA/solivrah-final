import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ThemeBackground } from '@/components/ThemeBackground';
import { useApp } from '@/context/AppContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, ArrowRight, LightbulbIcon } from 'lucide-react';

const Survey = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, selectedTheme, setSelectedTheme } = useApp();
  
  // Survey state
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    goal: '',
    biggestStruggle: '',
    dailyCommitment: 15, // Default to 15 minutes
  });

  // Theme options
  const themeOptions = [
    { id: 'Discipline', label: 'Discipline', description: 'Building consistent habits and routines' },
    { id: 'Focus', label: 'Focus', description: 'Improving concentration and mental clarity' },
    { id: 'Resilience', label: 'Resilience', description: 'Developing mental strength and adaptability' },
    { id: 'Wildcards', label: 'Wildcards', description: 'Surprise challenges to break your routine' }
  ];
  
  // Theme-based suggestions for struggles
  const themeSuggestions = {
    Discipline: [
      'Procrastinating on important tasks',
      'Sticking to a consistent sleep schedule',
      'Following through on commitments',
      'Avoiding distractions during work time'
    ],
    Focus: [
      'Getting distracted by social media',
      'Trouble staying focused for long periods',
      'Mind wandering during important tasks',
      'Difficulty concentrating in noisy environments'
    ],
    Resilience: [
      'Dwelling on failures or setbacks',
      'Getting overwhelmed by stress',
      'Giving up when things get difficult',
      'Taking criticism too personally'
    ],
    Wildcards: [
      'Feeling stuck in a routine',
      'Fear of trying new things',
      'Getting bored with regular habits',
      'Resistance to stepping outside comfort zone'
    ]
  };

  // Theme-based suggestions for goals
  const themeGoalSuggestions = {
    Discipline: [
      'Establish a morning routine that I follow daily',
      'Complete my most important task before noon each day',
      'Build a consistent exercise habit',
      'Track my daily habits using a habit tracker'
    ],
    Focus: [
      'Complete 30-minute focused work sessions without distractions',
      'Reduce screen time by 50%',
      'Practice mindfulness meditation daily',
      'Eliminate multitasking during important work'
    ],
    Resilience: [
      'Practice daily reflection on challenges and victories',
      'Learn one new coping skill each week',
      'Journal about stressful events and my response',
      'Create a resilience toolkit for difficult moments'
    ],
    Wildcards: [
      'Try something completely new each week',
      'Break one routine habit each day',
      'Challenge myself with spontaneous activities',
      'Document my experience with unexpected challenges'
    ]
  };
  
  // Time commitment options in minutes
  const timeOptions = [
    { value: 5, label: '5 minutes' },
    { value: 15, label: '15 minutes' },
    { value: 30, label: '30 minutes' },
    { value: 45, label: '45 minutes' },
    { value: 60, label: '1 hour' }
  ];

  // Reset error when changing steps
  useEffect(() => {
    setError(null);
  }, [step]);

  // Handle form submission
  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    try {
      // Create personalized plan based on survey responses
      const planData = {
        theme: selectedTheme,
        goal: formData.goal,
        biggestStruggle: formData.biggestStruggle,
        dailyCommitment: formData.dailyCommitment,
        createdAt: new Date().toISOString(),
        userId: user?.id || 'guest'
      };

      // Save survey response to database
      const { error: surveyError } = await supabase.from('survey_responses').insert([
        {
          user_id: user?.id || 'guest',
          theme: selectedTheme,
          goal: formData.goal,
          biggest_struggle: formData.biggestStruggle,
          daily_commitment: formData.dailyCommitment
        }
      ]);

      if (surveyError) throw surveyError;

      // Save plan to local storage for now (as a fallback)
      localStorage.setItem('personalizedPlan', JSON.stringify(planData));
      localStorage.setItem('hasCompletedSurvey', 'true');

      // Show success notification
      toast({
        title: 'Your plan is ready!',
        description: 'Your personalized 30-day roadmap has been created.'
      });

      // Navigate to Home
      navigate('/home');
    } catch (error: any) {
      console.error('Error submitting survey:', error);
      setError('Unable to create your plan. Please try again.');
      toast({
        variant: 'destructive',
        title: 'Something went wrong',
        description: 'Unable to create your plan. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  // Animation variants for transitions
  const pageVariants = {
    initial: { opacity: 0, x: 50 },
    in: { opacity: 1, x: 0 },
    out: { opacity: 0, x: -50 }
  };

  // Handle back navigation
  const goBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  // Handle forward navigation
  const goNext = () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      // Submit on the last step
      handleSubmit();
    }
  };

  // Check if the current step is valid and can proceed
  const canProceed = () => {
    switch (step) {
      case 1: // Theme selection
        return selectedTheme !== '';
      case 2: // Goal setting
        return formData.goal.trim().length > 0;
      case 3: // Biggest struggle
        return formData.biggestStruggle.trim().length > 0;
      case 4: // Daily commitment
        return formData.dailyCommitment > 0;
      default:
        return false;
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion: string, field: 'goal' | 'biggestStruggle') => {
    setFormData({ ...formData, [field]: suggestion });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0A0A0A] text-white">
      <ThemeBackground />
      
      {/* Container */}
      <div className="flex-1 flex flex-col max-w-md mx-auto w-full relative z-10">
        {/* Header */}
        <div className="text-center mb-8 mt-8">
          <h1 className="text-2xl font-bold mb-2">Let's Create Your Plan</h1>
          <p className="text-white/70 text-sm">
            Answer a few questions to get a personalized 30-day journey
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div className="bg-red-500/20 text-red-300 p-4 rounded-lg mb-6">
            <p>{error}</p>
          </div>
        )}

        {/* Progress Bar */}
        <div className="w-full h-1 bg-white/10 rounded-full mb-8 overflow-hidden">
          <motion.div
            className="h-full bg-white/50 rounded-full"
            initial={{ width: '0%' }}
            animate={{ width: `${(step / 4) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* Step Content */}
        <div className="flex-1 flex flex-col content-with-fixed-nav">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={{ duration: 0.3 }}
              className="flex-1 px-6"
            >
              {step === 1 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold mb-4">Choose a theme</h2>
                  <p className="text-white/70 mb-6">
                    Select what you'd like to focus on during your 30-day journey
                  </p>

                  <div className="grid grid-cols-1 gap-4">
                    {themeOptions.map((theme) => (
                      <div
                        key={theme.id}
                        className={`p-4 rounded-xl border cursor-pointer transition-all ${
                          selectedTheme === theme.id
                            ? 'bg-white/10 border-white/30'
                            : 'bg-black/40 border-white/10 hover:bg-black/60'
                        }`}
                        onClick={() => setSelectedTheme(theme.id)}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-medium">{theme.label}</h3>
                            <p className="text-white/70 text-sm">{theme.description}</p>
                          </div>
                          <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                            selectedTheme === theme.id
                              ? 'border-white bg-white'
                              : 'border-white/30'
                          }`}>
                            {selectedTheme === theme.id && (
                              <div className="w-3 h-3 rounded-full bg-black" />
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold mb-4">What's your goal?</h2>
                  <p className="text-white/70 mb-6">
                    Describe what you hope to achieve in the next 30 days
                  </p>

                  <div className="space-y-2">
                    <Input
                      placeholder="e.g., Establish a morning meditation routine"
                      className="bg-black/40 border-white/10 text-white placeholder:text-white/40 focus:border-white/20"
                      value={formData.goal}
                      onChange={(e) =>
                        setFormData({ ...formData, goal: e.target.value })
                      }
                    />
                  </div>

                  {/* Suggestions based on selected theme */}
                  {selectedTheme && (
                    <div className="mt-6">
                      <div className="flex items-center gap-2 mb-2">
                        <LightbulbIcon className="w-4 h-4 text-yellow-400" />
                        <p className="text-sm text-white/70">Suggestions</p>
                      </div>
                      
                      <div className="space-y-2">
                        {themeGoalSuggestions[selectedTheme as keyof typeof themeGoalSuggestions]?.map((suggestion, index) => (
                          <div
                            key={index}
                            onClick={() => handleSuggestionClick(suggestion, 'goal')}
                            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 cursor-pointer text-sm text-white/70"
                          >
                            {suggestion}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold mb-4">
                    What's your biggest struggle?
                  </h2>
                  <p className="text-white/70 mb-6">
                    This helps us understand what challenges to address
                  </p>

                  <div className="space-y-2">
                    <Input
                      placeholder="e.g., Getting distracted by social media"
                      className="bg-black/40 border-white/10 text-white placeholder:text-white/40 focus:border-white/20"
                      value={formData.biggestStruggle}
                      onChange={(e) =>
                        setFormData({ ...formData, biggestStruggle: e.target.value })
                      }
                    />
                  </div>

                  {/* Struggle suggestions based on selected theme */}
                  {selectedTheme && (
                    <div className="mt-6">
                      <div className="flex items-center gap-2 mb-2">
                        <LightbulbIcon className="w-4 h-4 text-yellow-400" />
                        <p className="text-sm text-white/70">Common struggles with {selectedTheme}</p>
                      </div>
                      
                      <div className="space-y-2">
                        {themeSuggestions[selectedTheme as keyof typeof themeSuggestions]?.map((suggestion, index) => (
                          <div
                            key={index}
                            onClick={() => handleSuggestionClick(suggestion, 'biggestStruggle')}
                            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 cursor-pointer text-sm text-white/70"
                          >
                            {suggestion}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {step === 4 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold mb-4">
                    Daily time commitment
                  </h2>
                  <p className="text-white/70 mb-6">
                    How much time can you dedicate each day?
                  </p>

                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {timeOptions.map((option) => (
                      <div
                        key={option.value}
                        className={`p-3 rounded-xl border text-center cursor-pointer transition-all ${
                          formData.dailyCommitment === option.value
                            ? 'bg-white/10 border-white/30'
                            : 'bg-black/40 border-white/10 hover:bg-black/60'
                        }`}
                        onClick={() =>
                          setFormData({ ...formData, dailyCommitment: option.value })
                        }
                      >
                        {option.label}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation Buttons */}
        <div className="fixed-bottom-nav">
          <div className="flex justify-between max-w-md mx-auto px-6 pb-4">
            {step > 1 ? (
              <Button
                variant="outline"
                size="lg"
                className="flex-1 mr-3 bg-black/40 border-white/10 hover:bg-black/60 hover:border-white/20"
                onClick={goBack}
                disabled={loading}
              >
                <ArrowLeft className="mr-2 w-4 h-4" />
                Back
              </Button>
            ) : (
              <div className="flex-1 mr-3" />
            )}

            {step < 4 ? (
              <Button
                variant="default"
                size="lg"
                className="flex-1 bg-white text-black hover:bg-white/90"
                onClick={goNext}
                disabled={!canProceed()}
              >
                Next
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            ) : (
              <Button
                variant="default"
                size="lg"
                className="flex-1 bg-white text-black hover:bg-white/90"
                onClick={handleSubmit}
                disabled={loading || !canProceed()}
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin w-4 h-4 border-2 border-black border-t-transparent rounded-full mr-2"></div>
                    Creating...
                  </div>
                ) : (
                  "Create My Plan"
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Survey;
