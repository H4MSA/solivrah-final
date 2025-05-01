import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ArrowRight, CheckCircle } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { GlassPane, GlassInput, GlassButton } from '@/components/ui/glass';

interface SurveyOption {
  id: string;
  label: string;
  description?: string;
}

const Survey = () => {
  const [step, setStep] = useState(0);
  const [goal, setGoal] = useState<string>('');
  const [struggle, setStruggle] = useState<string>('');
  const [dailyCommitment, setDailyCommitment] = useState<number>(15);
  const [theme, setTheme] = useState<string>('Focus');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, setSelectedTheme } = useApp();
  const { setHasCompletedOnboarding } = useAuth();
  
  // Option sets for the different steps
  const themes: SurveyOption[] = [
    { 
      id: 'Focus',
      label: 'Focus & Concentration', 
      description: 'Improve your ability to concentrate and stay on task'
    },
    { 
      id: 'Discipline', 
      label: 'Daily Discipline', 
      description: 'Build consistency and follow-through in your daily habits'
    },
    { 
      id: 'Resilience', 
      label: 'Mental Resilience', 
      description: 'Develop the strength to overcome challenges and setbacks'
    },
    { 
      id: 'Wildcards',
      label: 'Random Challenges',
      description: 'Mix of unpredictable challenges to keep you on your toes'
    }
  ];
  
  const goals: SurveyOption[] = [
    { id: 'productivity', label: 'Be more productive' },
    { id: 'focus', label: 'Improve my focus' },
    { id: 'consistency', label: 'Build consistent habits' },
    { id: 'confidence', label: 'Gain more confidence' },
    { id: 'anxiety', label: 'Reduce anxiety and stress' }
  ];
  
  const struggles: SurveyOption[] = [
    { id: 'procrastination', label: 'Procrastination' },
    { id: 'motivation', label: 'Lack of motivation' },
    { id: 'distraction', label: 'Easily distracted' },
    { id: 'overwhelm', label: 'Feeling overwhelmed' },
    { id: 'discipline', label: 'Poor self-discipline' }
  ];
  
  const timeOptions: SurveyOption[] = [
    { id: '5', label: '5 minutes per day' },
    { id: '15', label: '15 minutes per day' },
    { id: '30', label: '30 minutes per day' },
    { id: '60', label: '1 hour per day' }
  ];
  
  // Submit survey responses to Supabase
  const submitSurvey = async () => {
    try {
      setIsSubmitting(true);
      
      // If anonymous user, just store data in localStorage instead of database
      if (isAnonymousUser()) {
        // Store survey data in localStorage for anonymous users
        localStorage.setItem('anonymous_survey', JSON.stringify({
          theme: selectedTheme,
          goal: goal,
          biggestStruggle: struggle,
          dailyCommitment: commitment,
          timestamp: new Date().toISOString()
        }));
        
        // Set onboarding as completed
        localStorage.setItem('onboardingComplete', 'true');
        setHasCompletedOnboarding(true);
        
        // Show success message
        toast({
          title: "Survey submitted!",
          description: "Your personalized journey is ready."
        });
        
        // Navigate to main app after short delay
        setTimeout(() => {
          navigate('/', { replace: true });
        }, 1000);
        
        return;
      }
      
      // For authenticated users, use existing code to submit to database
      const { error } = await supabase
        .from('survey_responses')
        .insert({
          user_id: user.id,
          goal: goal || goals[0].id,
          biggest_struggle: struggle || struggles[0].id,
          daily_commitment: dailyCommitment,
          theme: theme
        });
      
      if (error) throw error;
      
      // Update user theme preference
      setSelectedTheme(theme);
      
      // Mark onboarding as completed
      setHasCompletedOnboarding(true);
      localStorage.setItem('onboardingComplete', 'true');
      
      toast({
        title: 'Survey Complete',
        description: 'Your personalized journey is ready!'
      });
      
      // Redirect to home
      navigate('/', { replace: true });
      
    } catch (error) {
      console.error("Error submitting survey:", error);
      toast({
        variant: "destructive",
        title: "Submission failed",
        description: "There was an error submitting your responses."
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const getStepProgress = () => {
    return ((step + 1) / 4) * 100;
  };
  
  const getStepTitle = () => {
    switch (step) {
      case 0:
        return 'Select a Theme';
      case 1:
        return 'What is your goal?';
      case 2:
        return 'What is your biggest struggle?';
      case 3:
        return 'How much time can you commit?';
      default:
        return 'Complete your profile';
    }
  };
  
  const getStepDescription = () => {
    switch (step) {
      case 0:
        return 'Choose a theme that resonates with your needs';
      case 1:
        return 'Select your primary goal for personal growth';
      case 2:
        return 'Identify what\'s holding you back the most';
      case 3:
        return 'Set a realistic daily time commitment';
      default:
        return 'Let\'s customize your experience';
    }
  };
  
  const canProceed = () => {
    switch (step) {
      case 0:
        return !!theme;
      case 1:
        return !!goal;
      case 2:
        return !!struggle;
      case 3:
        return !!dailyCommitment;
      default:
        return true;
    }
  };
  
  const nextStep = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      submitSurvey();
    }
  };
  
  const prevStep = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    },
    exit: { 
      opacity: 0,
      transition: { when: "afterChildren", duration: 0.2 }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 30 }
    },
    exit: { 
      y: -20, 
      opacity: 0,
      transition: { duration: 0.2 }
    }
  };
  
  const optionVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (custom: number) => ({
      opacity: 1,
      y: 0,
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 24, 
        delay: custom * 0.05 
      }
    }),
    hover: { 
      y: -5, 
      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
      scale: 1.02,
      transition: { type: "spring", stiffness: 300, damping: 10 }
    },
    tap: { scale: 0.98 }
  };

  const renderStepContent = () => {
    switch (step) {
      case 0:
        return (
          <div className="space-y-4">
            {themes.map((themeOption, index) => (
              <motion.div
                key={themeOption.id}
                custom={index}
                variants={optionVariants}
                whileHover="hover"
                whileTap="tap"
                onClick={() => setTheme(themeOption.id)}
                className={`relative cursor-pointer rounded-xl overflow-hidden ${
                  theme === themeOption.id ? 'ring-2 ring-white ring-offset-2 ring-offset-black/30' : ''
                }`}
              >
                <GlassPane 
                  variant={theme === themeOption.id ? "ultra" : "standard"}
                  className="p-4"
                  glowEffect={theme === themeOption.id}
                  depth={theme === themeOption.id ? "high" : "medium"}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-white font-medium mb-1">{themeOption.label}</h3>
                      {themeOption.description && (
                        <p className="text-xs text-white/70">{themeOption.description}</p>
                      )}
                    </div>
                    {theme === themeOption.id && (
                      <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="bg-white rounded-full p-1 text-black"
                      >
                        <CheckCircle size={16} />
                      </motion.div>
                    )}
                  </div>
                </GlassPane>
                
                {theme === themeOption.id && (
                  <motion.div 
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-white"
                    layoutId="activeSurveyOption"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </motion.div>
            ))}
          </div>
        );
      
      case 1:
        return (
          <div className="space-y-4">
            {goals.map((goalOption, index) => (
              <motion.div
                key={goalOption.id}
                custom={index}
                variants={optionVariants}
                whileHover="hover"
                whileTap="tap"
                onClick={() => setGoal(goalOption.id)}
                className={`relative cursor-pointer rounded-xl overflow-hidden ${
                  goal === goalOption.id ? 'ring-2 ring-white ring-offset-2 ring-offset-black/30' : ''
                }`}
              >
                <GlassPane 
                  variant={goal === goalOption.id ? "ultra" : "standard"}
                  className="p-4"
                  glowEffect={goal === goalOption.id}
                  depth={goal === goalOption.id ? "high" : "medium"}
                >
                  <div className="flex justify-between items-center">
                    <h3 className="text-white font-medium">{goalOption.label}</h3>
                    {goal === goalOption.id && (
                      <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="bg-white rounded-full p-1 text-black"
                      >
                        <CheckCircle size={16} />
                      </motion.div>
                    )}
                  </div>
                </GlassPane>
                
                {goal === goalOption.id && (
                  <motion.div 
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-white"
                    layoutId="activeSurveyOption"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </motion.div>
            ))}
          </div>
        );
      
      case 2:
        return (
          <div className="space-y-4">
            {struggles.map((struggleOption, index) => (
              <motion.div
                key={struggleOption.id}
                custom={index}
                variants={optionVariants}
                whileHover="hover"
                whileTap="tap"
                onClick={() => setStruggle(struggleOption.id)}
                className={`relative cursor-pointer rounded-xl overflow-hidden ${
                  struggle === struggleOption.id ? 'ring-2 ring-white ring-offset-2 ring-offset-black/30' : ''
                }`}
              >
                <GlassPane 
                  variant={struggle === struggleOption.id ? "ultra" : "standard"}
                  className="p-4"
                  glowEffect={struggle === struggleOption.id}
                  depth={struggle === struggleOption.id ? "high" : "medium"}
                >
                  <div className="flex justify-between items-center">
                    <h3 className="text-white font-medium">{struggleOption.label}</h3>
                    {struggle === struggleOption.id && (
                      <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="bg-white rounded-full p-1 text-black"
                      >
                        <CheckCircle size={16} />
                      </motion.div>
                    )}
                  </div>
                </GlassPane>
                
                {struggle === struggleOption.id && (
                  <motion.div 
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-white"
                    layoutId="activeSurveyOption"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </motion.div>
            ))}
          </div>
        );
      
      case 3:
        return (
          <div className="space-y-4">
            {timeOptions.map((timeOption, index) => (
              <motion.div
                key={timeOption.id}
                custom={index}
                variants={optionVariants}
                whileHover="hover"
                whileTap="tap"
                onClick={() => setDailyCommitment(parseInt(timeOption.id))}
                className={`relative cursor-pointer rounded-xl overflow-hidden ${
                  dailyCommitment === parseInt(timeOption.id) ? 'ring-2 ring-white ring-offset-2 ring-offset-black/30' : ''
                }`}
              >
                <GlassPane 
                  variant={dailyCommitment === parseInt(timeOption.id) ? "ultra" : "standard"}
                  className="p-4"
                  glowEffect={dailyCommitment === parseInt(timeOption.id)}
                  depth={dailyCommitment === parseInt(timeOption.id) ? "high" : "medium"}
                >
                  <div className="flex justify-between items-center">
                    <h3 className="text-white font-medium">{timeOption.label}</h3>
                    {dailyCommitment === parseInt(timeOption.id) && (
                      <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="bg-white rounded-full p-1 text-black"
                      >
                        <CheckCircle size={16} />
                      </motion.div>
                    )}
                  </div>
                </GlassPane>
                
                {dailyCommitment === parseInt(timeOption.id) && (
                  <motion.div 
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-white"
                    layoutId="activeSurveyOption"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </motion.div>
            ))}
          </div>
        );
      
      default:
        return null;
    }
  };

  // Check if user is anonymous
  const isAnonymousUser = () => localStorage.getItem('skipAuthentication') === 'true';

  return (
    <div className="min-h-screen flex flex-col px-4 py-10">
      <div className="flex-1 flex flex-col">
        {/* Progress bar */}
        <motion.div 
          className="w-full h-1 bg-white/10 rounded-full mb-8"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <motion.div 
            className="h-full bg-white rounded-full"
            initial={{ width: '0%' }}
            animate={{ width: `${getStepProgress()}%` }}
            transition={{ duration: 0.3 }}
          />
        </motion.div>
        
        {/* Step navigation */}
        <div className="flex justify-between items-center mb-6">
          <motion.button 
            className={`p-2 rounded-full bg-black/40 border border-white/10 ${step === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-black/60'}`}
            onClick={prevStep}
            disabled={step === 0}
            whileTap={step !== 0 ? { scale: 0.95 } : {}}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <ChevronLeft size={20} />
          </motion.button>
          
          <motion.div 
            className="text-sm text-white/70"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            Step {step + 1} of 4
          </motion.div>
          
          <div className="w-10" />
        </div>
        
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={containerVariants}
            className="flex-1 flex flex-col"
          >
            {/* Step title */}
            <motion.h1 
              className="text-2xl font-bold text-white mb-2"
              variants={itemVariants}
            >
              {getStepTitle()}
            </motion.h1>
            
            <motion.p 
              className="text-white/70 mb-8"
              variants={itemVariants}
            >
              {getStepDescription()}
            </motion.p>
            
            {/* Step content */}
            <motion.div 
              className="flex-1"
              variants={itemVariants}
            >
              {renderStepContent()}
            </motion.div>
          </motion.div>
        </AnimatePresence>
        
        {/* Navigation buttons */}
        <motion.div 
          className="mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <GlassButton
            variant="primary"
            size="lg"
            fullWidth
            onClick={nextStep}
            disabled={!canProceed() || isSubmitting}
            loading={isSubmitting && step === 3}
            iconRight={step < 3 ? <ChevronRight size={18} /> : <ArrowRight size={18} />}
          >
            {step < 3 ? 'Continue' : 'Complete & Begin Journey'}
          </GlassButton>
        </motion.div>
      </div>
    </div>
  );
};

export default Survey;
