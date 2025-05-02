
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ThemeBackground } from "@/components/ThemeBackground";
import { Logo } from "@/components/Logo";
import { 
  CheckCircle, 
  ArrowRight, 
  Shield, 
  User, 
  Calendar, 
  Trophy, 
  Brain,
  Star,
  Bell,
  Sparkles
} from "lucide-react";
import { CardGlass, CardGlassTitle, CardGlassDescription, CardGlassContent } from "@/components/ui/card-glass";
import { ButtonGlass } from "@/components/ui/button-glass";

const Feature = ({
  icon,
  text
}: {
  icon: React.ReactNode;
  text: string;
}) => (
  <motion.div
    className="mb-3"
    whileHover={{ scale: 1.02, y: -2 }}
    whileTap={{ scale: 0.98 }}
    transition={{ type: "spring", stiffness: 400, damping: 17 }}
  >
    <CardGlass className="flex items-start gap-3.5 p-4" variant="secondary" interactive>
      <div className="p-2 rounded-full bg-black/60 text-white flex-shrink-0 border border-white/10 shadow-md">
        {icon}
      </div>
      <p className="text-white text-sm leading-tight">{text}</p>
    </CardGlass>
  </motion.div>
);

const Index = () => {
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    // Simulate logo animation with a delay
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    }
  };

  return (
    <motion.div 
      className="min-h-screen px-5 pt-6 pb-24"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div
        className="flex justify-between items-center mb-8"
        variants={itemVariants}
      >
        <h1 className="text-gradient h1">Good morning</h1>
        <motion.div 
          className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-xl border border-white/10 flex items-center justify-center"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Bell size={18} className="text-white/80" />
        </motion.div>
      </motion.div>

      {/* Daily affirmation */}
      <motion.div variants={itemVariants}>
        <CardGlass className="mb-6 relative overflow-hidden">
          <div className="absolute -top-6 -left-6 text-4xl opacity-10 text-white/30">"</div>
          <div className="absolute -bottom-6 -right-6 text-4xl opacity-10 text-white/30">"</div>
          
          <CardGlassTitle className="mb-2">Today's Affirmation</CardGlassTitle>
          <CardGlassDescription className="text-white/90 text-base italic">
            Every small step I take today brings me closer to my goals.
          </CardGlassDescription>
          
          <motion.div 
            className="absolute -z-10 top-0 right-0 w-20 h-20 opacity-5"
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <Sparkles size={80} />
          </motion.div>
        </CardGlass>
      </motion.div>

      {/* Progress summary */}
      <motion.div variants={itemVariants}>
        <h2 className="h3 mb-4">Your Progress</h2>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <CardGlass className="p-4" variant="secondary">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-black/40 border border-white/10 flex items-center justify-center mb-2">
                <Trophy size={24} className="text-soft-lime" />
              </div>
              <p className="text-xl font-bold">3</p>
              <p className="text-xs text-white/70">Quests Completed</p>
            </div>
          </CardGlass>
          
          <CardGlass className="p-4" variant="secondary">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-black/40 border border-white/10 flex items-center justify-center mb-2">
                <Calendar size={24} className="text-soft-purple" />
              </div>
              <p className="text-xl font-bold">7</p>
              <p className="text-xs text-white/70">Day Streak</p>
            </div>
          </CardGlass>
        </div>
      </motion.div>

      {/* Quick actions */}
      <motion.div variants={itemVariants}>
        <h2 className="h3 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 gap-4 mb-8">
          <ButtonGlass
            variant="secondary"
            fullWidth
            className="py-6 flex-col h-auto"
            icon={<Trophy size={22} />}
            onClick={() => navigate("/quests")}
          >
            <span className="mt-2">Daily Quests</span>
          </ButtonGlass>
          
          <ButtonGlass
            variant="secondary"
            fullWidth
            className="py-6 flex-col h-auto"
            icon={<Brain size={22} />}
            onClick={() => navigate("/coach")}
          >
            <span className="mt-2">Talk to Coach</span>
          </ButtonGlass>
        </div>
      </motion.div>
      
      {/* Today's focus */}
      <motion.div variants={itemVariants}>
        <CardGlass 
          className="mb-6" 
          variant="primary" 
          withGlow
        >
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-neon-green to-soft-lime flex items-center justify-center flex-shrink-0">
              <Star size={18} className="text-black" />
            </div>
            <div>
              <CardGlassTitle className="mb-1">Today's Focus</CardGlassTitle>
              <CardGlassDescription className="mb-3">
                Complete your morning meditation and plan your day.
              </CardGlassDescription>
              <ButtonGlass 
                variant="primary" 
                size="sm"
                icon={<ArrowRight size={16} />}
                iconPosition="right"
              >
                Begin Now
              </ButtonGlass>
            </div>
          </div>
        </CardGlass>
      </motion.div>
      
      {/* Next check-in */}
      <motion.div variants={itemVariants}>
        <h2 className="h3 mb-4">Your Next Check-in</h2>
        <CardGlass className="mb-6" variant="secondary">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-white/70">Tomorrow</p>
              <p className="font-medium">Weekly Progress Review</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-black/40 border border-white/10 flex items-center justify-center">
              <Calendar size={18} className="text-white/80" />
            </div>
          </div>
        </CardGlass>
      </motion.div>
    </motion.div>
  );
};

export default Index;
