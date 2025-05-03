
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, Settings, Award, Trophy, Star, Calendar, 
  Medal, Clock, LogOut, Edit, Shield, Check, Lock
} from 'lucide-react'; // Add the missing Check and Lock icons
import { CardGlass, CardGlassHeader, CardGlassTitle, CardGlassContent } from '@/components/ui/card-glass';
import { ButtonGlass } from '@/components/ui/button-glass';
import { useApp } from '@/context/AppContext';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { xp, streak, selectedTheme, resetProgress } = useApp();
  const { toast } = useToast();
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  
  // Calculate level based on XP
  const level = Math.floor(xp / 1000) + 1;
  const progress = ((xp % 1000) / 1000) * 100;
  
  // Mock data for achievements
  const achievements = [
    { 
      id: 1, 
      name: "Early Starter", 
      description: "Created your account and started your journey",
      icon: <Star className="text-amber-400" size={20} />,
      earned: true
    },
    { 
      id: 2, 
      name: "First Quest", 
      description: "Completed your first quest",
      icon: <Trophy className="text-lime-400" size={20} />,
      earned: true
    },
    { 
      id: 3, 
      name: "Consistent", 
      description: "Maintained a 7-day streak",
      icon: <Calendar className="text-blue-400" size={20} />,
      earned: streak >= 7
    },
    { 
      id: 4, 
      name: "Milestone", 
      description: "Reached level 5",
      icon: <Medal className="text-purple-400" size={20} />,
      earned: level >= 5
    },
    { 
      id: 5, 
      name: "Focus Master", 
      description: "Completed all Focus-themed quests",
      icon: <Clock className="text-teal-400" size={20} />,
      earned: false
    }
  ];
  
  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/welcome');
      toast({
        title: 'Signed out successfully',
        description: 'Hope to see you back soon!',
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: 'Error signing out',
        description: 'Please try again',
      });
    }
  };
  
  const handleResetProfile = () => {
    resetProgress();
    setShowResetConfirm(false);
    toast({
      title: 'Profile reset',
      description: 'Your progress has been reset successfully',
    });
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
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    }
  };

  // Get display name from user
  const displayName = user?.user_metadata?.username || 
                     user?.email?.split('@')[0] || 
                     "User";
  
  return (
    <div className="min-h-screen pb-24">
      <div className="px-5 pt-6">
        <motion.div
          className="flex justify-between items-center mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-2xl font-bold bg-gradient-to-b from-white to-white/80 bg-clip-text text-transparent">Profile</h1>
          
          <ButtonGlass
            variant="secondary"
            size="sm"
            className="w-10 h-10 p-0 rounded-full flex items-center justify-center"
            onClick={() => navigate('/settings')}
          >
            <Settings size={18} />
          </ButtonGlass>
        </motion.div>
        
        {/* User Profile Card */}
        <motion.div
          className="mb-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <CardGlass className="p-6">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-neon-green to-soft-lime flex items-center justify-center">
                <User className="text-black" size={28} />
              </div>
              <div>
                <h2 className="text-xl font-bold">{displayName}</h2>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="bg-white/10 text-white/90 text-xs px-2 py-0.5 rounded-full">
                    Level {level}
                  </span>
                  <span className="bg-white/10 text-white/90 text-xs px-2 py-0.5 rounded-full flex items-center">
                    <Trophy size={12} className="mr-1" /> {xp} XP
                  </span>
                </div>
              </div>
            </div>
            
            {/* Theme */}
            <div className="mb-4 p-3 bg-black/30 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-sm text-white/70">Active Theme</span>
                <span className="text-sm font-medium bg-white/10 px-2 py-0.5 rounded-full">
                  {selectedTheme || "Focus"}
                </span>
              </div>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="bg-black/30 rounded-lg p-3 text-center">
                <p className="text-xl font-bold">{level}</p>
                <p className="text-xs text-white/70">Level</p>
              </div>
              <div className="bg-black/30 rounded-lg p-3 text-center">
                <p className="text-xl font-bold">{streak}</p>
                <p className="text-xs text-white/70">Day Streak</p>
              </div>
              <div className="bg-black/30 rounded-lg p-3 text-center">
                <p className="text-xl font-bold">{xp}</p>
                <p className="text-xs text-white/70">Total XP</p>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex justify-between text-xs text-white/70 mb-2">
                <span>Level Progress</span>
                <span>{Math.floor(progress)}%</span>
              </div>
              <div className="h-2 bg-black/30 rounded-full">
                <div 
                  className="h-full bg-gradient-to-r from-neon-green to-soft-lime rounded-full"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <div className="text-xs text-white/70 mt-1 text-right">
                {1000 - (xp % 1000)} XP to Level {level + 1}
              </div>
            </div>
          </CardGlass>
        </motion.div>
        
        {/* Achievements */}
        <motion.div
          className="mb-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h2 variants={itemVariants} className="text-lg font-semibold mb-3">Achievements</motion.h2>
          
          {achievements.map((achievement, idx) => (
            <motion.div key={achievement.id} variants={itemVariants}>
              <CardGlass 
                className={`mb-3 p-4 ${!achievement.earned ? 'opacity-60' : ''}`} 
                variant={achievement.earned ? "secondary" : "secondary"}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${achievement.earned ? 'bg-black/40' : 'bg-black/20'}`}>
                      {achievement.icon}
                    </div>
                    <div>
                      <h3 className="font-medium">{achievement.name}</h3>
                      <p className="text-xs text-white/70">{achievement.description}</p>
                    </div>
                  </div>
                  
                  {achievement.earned ? (
                    <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center">
                      <Check className="w-4 h-4 text-green-500" />
                    </div>
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center">
                      <Lock className="w-4 h-4 text-white/40" />
                    </div>
                  )}
                </div>
              </CardGlass>
            </motion.div>
          ))}
        </motion.div>
        
        {/* Account Actions */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mb-20"
        >
          <motion.h2 variants={itemVariants} className="text-lg font-semibold mb-3">Account</motion.h2>
          
          <motion.div variants={itemVariants}>
            <CardGlass className="mb-3 p-4">
              <div className="space-y-4">
                <ButtonGlass
                  variant="secondary"
                  fullWidth
                  icon={<Edit size={16} />}
                  onClick={() => navigate('/edit-profile')}
                >
                  Edit Profile
                </ButtonGlass>
                
                <ButtonGlass
                  variant="secondary"
                  fullWidth
                  icon={<Shield size={16} />}
                  onClick={() => navigate('/privacy')}
                >
                  Privacy Settings
                </ButtonGlass>
                
                {!showResetConfirm ? (
                  <ButtonGlass
                    variant="outline"
                    fullWidth
                    onClick={() => setShowResetConfirm(true)}
                  >
                    Reset Progress
                  </ButtonGlass>
                ) : (
                  <div className="space-y-2">
                    <p className="text-sm text-white/80 mb-2">Are you sure? This will reset all your progress.</p>
                    <div className="flex gap-2">
                      <ButtonGlass
                        variant="destructive"
                        className="flex-1"
                        onClick={handleResetProfile}
                      >
                        Yes, Reset
                      </ButtonGlass>
                      <ButtonGlass
                        variant="secondary"
                        className="flex-1"
                        onClick={() => setShowResetConfirm(false)}
                      >
                        Cancel
                      </ButtonGlass>
                    </div>
                  </div>
                )}
                
                <ButtonGlass
                  variant="ghost"
                  fullWidth
                  icon={<LogOut size={16} />}
                  onClick={handleSignOut}
                >
                  Sign Out
                </ButtonGlass>
              </div>
            </CardGlass>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
