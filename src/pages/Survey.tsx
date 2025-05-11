
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ThemeBackground } from '@/components/ThemeBackground';
import { useApp } from '@/context/AppContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, ArrowRight } from 'lucide-react';

const Survey = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, selectedTheme, setSelectedTheme } = useApp();
  
  // Survey state
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
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
  
  // Time commitment options in minutes
  const timeOptions = [
    { value: 5, label: '5 minutes' },
    { value: 15, label: '15 minutes' },
    { value: 30, label: '30 minutes' },
    { value: 45, label: '45 minutes' },
    { value: 60, label: '1 hour' }
  ];

  // Handle form submission
  const handleSubmit = async () => {
    setLoading(true);

    try {
      // Save survey response to database
      const { error } = await supabase.from('survey_responses').insert([
        {
          user_id: user?.id || 'guest',
          theme: selectedTheme,
          goal: formData.goal,
          biggest_struggle: formData.biggestStruggle,
          daily_commitment: formData.dailyCommitment
        }
      ]);

      if (error) throw error;

      // Show success notification
      toast({
        title: 'Your plan is ready!',
        description: 'Your personalized 30-day roadmap has been created.'
      });

      // Navigate to Home
      navigate('/home');
    } catch (error) {
      console.error('Error submitting survey:', error);
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

  return (
    <div className="min-h-screen flex flex-col bg-[#0A0A0A] text-white">
      <ThemeBackground />
      
      {/* Container */}
      <div className="flex-1 flex flex-col p-6 max-w-md mx-auto w-full relative z-10">
        {/* Header */}
        <div className="text-center mb-8 mt-8">
          <h1 className="text-2xl font-bold mb-2">Let's Create Your Plan</h1>
          <p className="text-white/70 text-sm">
            Answer a few questions to get a personalized 30-day journey
          </p>
        </div>

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
        <div className="flex-1 flex flex-col">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={{ duration: 0.3 }}
              className="flex-1"
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
                        className={`p-3 rounded-xl flex items-center justify-center cursor-pointer transition-all ${
                          formData.dailyCommitment === option.value
                            ? 'bg-white text-black font-medium'
                            : 'bg-black/40 border border-white/10 hover:bg-black/60'
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
        <div className="flex items-center justify-between mt-10">
          <Button
            variant="ghost"
            onClick={goBack}
            disabled={step === 1}
            className="px-4 py-2 flex items-center gap-1"
          >
            <ArrowLeft size={16} />
            Back
          </Button>
          
          <Button
            onClick={goNext}
            disabled={!canProceed() || loading}
            className="px-6 py-3 bg-white text-black hover:bg-white/90 flex items-center gap-2"
          >
            {loading ? (
              <span>Loading...</span>
            ) : step < 4 ? (
              <>
                Next
                <ArrowRight size={16} />
              </>
            ) : (
              'Create My Plan'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Survey;
