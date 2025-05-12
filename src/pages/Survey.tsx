import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ThemeBackground } from '@/components/ThemeBackground';
import { useApp } from '@/context/AppContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, ArrowRight, LightbulbIcon, CheckIcon } from 'lucide-react';
import { GlassCard } from '@/components/GlassCard';
import { SafeAreaLayout } from '../App';

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

      // For guest users, just store in local storage
      if (!user?.id) {
        localStorage.setItem('personalizedPlan', JSON.stringify(planData));
        localStorage.setItem('hasCompletedSurvey', 'true');
      } else {
        // Save survey response to database for authenticated users
        const { error: surveyError } = await supabase.from('survey_responses').insert([
          {
            user_id: user.id,
            theme: selectedTheme,
            goal: formData.goal,
            biggest_struggle: formData.biggestStruggle,
            daily_commitment: formData.dailyCommitment
          }
        ]);

        if (surveyError) throw surveyError;
        
        // Still save to localStorage for immediate access
        localStorage.setItem('personalizedPlan', JSON.stringify(planData));
        localStorage.setItem('hasCompletedSurvey', 'true');
      }

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
    in: { opacity: 1, x: 0, transition: { duration: 0.4, ease: "easeOut" } },
    out: { opacity: 0, x: -50, transition: { duration: 0.2 } }
  };
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
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
    <SafeAreaLayout>
      <div className="min-h-screen flex flex-col bg-[#0A0A0A] text-white overflow-x-hidden">
        <ThemeBackground />
        
        {/* Animated background elements */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <motion.div 
            className="bubble w-64 h-64 top-[5%] left-[80%]"
            animate={{ 
              x: [0, -40, 0], 
              y: [0, 30, 0],
              opacity: [0.03, 0.06, 0.03]
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 20,
              ease: "easeInOut" 
            }}
          />
          <motion.div 
            className="bubble w-48 h-48 bottom-[20%] left-[5%]"
            animate={{ 
              x: [0, 30, 0], 
              y: [0, -30, 0],
              opacity: [0.04, 0.07, 0.04]
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 15,
              ease: "easeInOut",
              delay: 3
            }}
          />
        </div>
        
        {/* Container */}
        <div className="flex-1 flex flex-col max-w-md mx-auto w-full relative z-10 px-6 pt-8 pb-32">
          {/* Header */}
          <motion.div 
            className="text-center mb-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.h1 
              variants={itemVariants}
              className="text-2xl font-bold mb-2"
            >
              Let's Create Your Plan
            </motion.h1>
            <motion.p 
              variants={itemVariants}
              className="text-white/70 text-sm"
            >
              Answer a few questions to get a personalized 30-day journey
            </motion.p>
          </motion.div>

          {/* Error message */}
          <AnimatePresence>
            {error && (
              <motion.div 
                className="bg-red-500/20 text-red-300 p-4 rounded-lg mb-6"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <p>{error}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Progress Bar */}
          <div className="w-full h-1.5 bg-white/5 rounded-full mb-8 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-white/40 to-white/60 rounded-full"
              initial={{ width: '0%' }}
              animate={{ width: `${(step / 4) * 100}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
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
                className="flex-1"
              >
                {step === 1 && (
                  <motion.div 
                    className="space-y-6"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <motion.h2 variants={itemVariants} className="text-xl font-semibold mb-4">Choose a theme</motion.h2>
                    <motion.p variants={itemVariants} className="text-white/70 mb-6">
                      Select what you'd like to focus on during your 30-day journey
                    </motion.p>

                    <div className="grid grid-cols-1 gap-4">
                      {themeOptions.map((theme, index) => (
                        <motion.div
                          key={theme.id}
                          variants={itemVariants}
                          custom={index}
                          className={`p-4 rounded-xl border cursor-pointer transition-all ${
                            selectedTheme === theme.id
                              ? 'bg-white/10 border-white/30'
                              : 'bg-black/40 border-white/10 hover:bg-white/5'
                          }`}
                          onClick={() => setSelectedTheme(theme.id)}
                          whileHover={{ y: -3, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.3)" }}
                          whileTap={{ scale: 0.98 }}
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
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div 
                    className="space-y-6"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <motion.h2 variants={itemVariants} className="text-xl font-semibold mb-4">What's your goal?</motion.h2>
                    <motion.p variants={itemVariants} className="text-white/70 mb-6">
                      Describe what you hope to achieve in the next 30 days
                    </motion.p>

                    <motion.div variants={itemVariants} className="space-y-2">
                      <Input
                        placeholder="e.g., Establish a morning meditation routine"
                        className="bg-black/40 border-white/10 text-white placeholder:text-white/40 focus:border-white/20"
                        value={formData.goal}
                        onChange={(e) =>
                          setFormData({ ...formData, goal: e.target.value })
                        }
                      />
                    </motion.div>

                    {/* Suggestions based on selected theme */}
                    {selectedTheme && (
                      <motion.div 
                        variants={itemVariants}
                        className="mt-6"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <LightbulbIcon className="w-4 h-4 text-yellow-400" />
                          <p className="text-sm text-white/70">Suggestions</p>
                        </div>
                        
                        <div className="space-y-2">
                          {themeGoalSuggestions[selectedTheme as keyof typeof themeGoalSuggestions]?.map((suggestion, index) => (
                            <motion.div
                              key={index}
                              whileHover={{ 
                                backgroundColor: "rgba(255,255,255,0.1)", 
                                x: 3,
                                transition: { duration: 0.2 } 
                              }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => handleSuggestionClick(suggestion, 'goal')}
                              className="p-3 rounded-lg bg-white/5 hover:bg-white/10 cursor-pointer text-sm text-white/70 transition-colors"
                            >
                              {suggestion}
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div 
                    className="space-y-6"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <motion.h2 variants={itemVariants} className="text-xl font-semibold mb-4">
                      What's your biggest struggle?
                    </motion.h2>
                    <motion.p variants={itemVariants} className="text-white/70 mb-6">
                      This helps us understand what challenges to address
                    </motion.p>

                    <motion.div variants={itemVariants} className="space-y-2">
                      <Input
                        placeholder="e.g., Getting distracted by social media"
                        className="bg-black/40 border-white/10 text-white placeholder:text-white/40 focus:border-white/20"
                        value={formData.biggestStruggle}
                        onChange={(e) =>
                          setFormData({ ...formData, biggestStruggle: e.target.value })
                        }
                      />
                    </motion.div>

                    {/* Struggle suggestions based on selected theme */}
                    {selectedTheme && (
                      <motion.div 
                        variants={itemVariants}
                        className="mt-6"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <LightbulbIcon className="w-4 h-4 text-yellow-400" />
                          <p className="text-sm text-white/70">Common struggles with {selectedTheme}</p>
                        </div>
                        
                        <div className="space-y-2">
                          {themeSuggestions[selectedTheme as keyof typeof themeSuggestions]?.map((suggestion, index) => (
                            <motion.div
                              key={index}
                              whileHover={{ 
                                backgroundColor: "rgba(255,255,255,0.1)", 
                                x: 3,
                                transition: { duration: 0.2 } 
                              }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => handleSuggestionClick(suggestion, 'biggestStruggle')}
                              className="p-3 rounded-lg bg-white/5 hover:bg-white/10 cursor-pointer text-sm text-white/70 transition-colors"
                            >
                              {suggestion}
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                )}

                {step === 4 && (
                  <motion.div 
                    className="space-y-6"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <motion.h2 
                      variants={itemVariants}
                      className="text-xl font-semibold mb-4"
                    >
                      Daily time commitment
                    </motion.h2>
                    <motion.p 
                      variants={itemVariants}
                      className="text-white/70 mb-6"
                    >
                      How much time can you dedicate each day?
                    </motion.p>

                    <motion.div 
                      variants={itemVariants}
                      className="grid grid-cols-2 gap-3 sm:grid-cols-3"
                    >
                      {timeOptions.map((option, index) => (
                        <motion.div
                          key={option.value}
                          whileHover={{ y: -3, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.3)" }}
                          whileTap={{ scale: 0.98 }}
                          variants={itemVariants}
                          custom={index}
                          className={`p-3 rounded-xl border text-center cursor-pointer transition-all ${
                            formData.dailyCommitment === option.value
                              ? 'bg-white/10 border-white/30'
                              : 'bg-black/40 border-white/10 hover:bg-white/5'
                          }`}
                          onClick={() =>
                            setFormData({ ...formData, dailyCommitment: option.value })
                          }
                        >
                          {option.label}
                        </motion.div>
                      ))}
                    </motion.div>
                    
                    <motion.div variants={itemVariants} className="mt-8">
                      <GlassCard variant="subtle" className="p-4">
                        <div className="flex flex-row items-start">
                          <div className="mr-3 mt-1">
                            <CheckIcon size={16} className="text-green-400" />
                          </div>
                          <div>
                            <h3 className="font-medium text-white/90 mb-1">Your 30-day plan is about to be created</h3>
                            <p className="text-sm text-white/70">
                              Based on your selections, we'll generate a personalized roadmap to help you
                              achieve your {selectedTheme?.toLowerCase() || "personal development"} goals.
                            </p>
                          </div>
                        </div>
                      </GlassCard>
                    </motion.div>
                  </motion.div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Buttons */}
          <div className="fixed inset-x-0 bottom-0 z-10">
            <div className="bg-gradient-to-t from-black via-black/95 to-transparent pt-20 pb-8 px-6">
              <div className="flex justify-between max-w-md mx-auto">
                {step > 1 ? (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="flex-1 mr-3"
                  >
                    <Button
                      variant="outline"
                      size="lg"
                      className="flex-1 w-full bg-black/40 border-white/10 hover:bg-black/60 hover:border-white/20"
                      onClick={goBack}
                      disabled={loading}
                    >
                      <ArrowLeft className="mr-2 w-4 h-4" />
                      Back
                    </Button>
                  </motion.div>
                ) : (
                  <div className="flex-1 mr-3" />
                )}

                {step < 4 ? (
                  <motion.div 
                    className="flex-1"
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      variant="default"
                      size="lg"
                      className="flex-1 w-full bg-white text-black hover:bg-white/90"
                      onClick={goNext}
                      disabled={!canProceed()}
                    >
                      Next
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </motion.div>
                ) : (
                  <motion.div 
                    className="flex-1"
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      variant="default"
                      size="lg"
                      className="flex-1 w-full bg-white text-black hover:bg-white/90"
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
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </SafeAreaLayout>
  );
};

export default Survey;
