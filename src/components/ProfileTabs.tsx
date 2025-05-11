
import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ProfileOverview } from './ProfileOverview';
import { ProfileAchievements } from './ProfileAchievements';
import { ProfileSettings } from './ProfileSettings';
import { motion } from 'framer-motion';

export const ProfileTabs: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('overview');
  
  const tabAnimation = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  };
  
  return (
    <Tabs defaultValue="overview" className="w-full" onValueChange={setActiveTab}>
      <TabsList className="grid grid-cols-3 mb-6 bg-transparent">
        <TabsTrigger 
          value="overview" 
          className={`rounded-lg px-4 py-2 text-sm font-medium ${
            activeTab === 'overview' 
              ? 'bg-white/10 text-white' 
              : 'text-white/60 hover:text-white/80'
          }`}
        >
          Overview
        </TabsTrigger>
        <TabsTrigger 
          value="achievements" 
          className={`rounded-lg px-4 py-2 text-sm font-medium ${
            activeTab === 'achievements' 
              ? 'bg-white/10 text-white' 
              : 'text-white/60 hover:text-white/80'
          }`}
        >
          Achievements
        </TabsTrigger>
        <TabsTrigger 
          value="settings" 
          className={`rounded-lg px-4 py-2 text-sm font-medium ${
            activeTab === 'settings' 
              ? 'bg-white/10 text-white' 
              : 'text-white/60 hover:text-white/80'
          }`}
        >
          Settings
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="overview">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={tabAnimation}
        >
          <ProfileOverview />
        </motion.div>
      </TabsContent>
      
      <TabsContent value="achievements">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={tabAnimation}
        >
          <ProfileAchievements />
        </motion.div>
      </TabsContent>
      
      <TabsContent value="settings">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={tabAnimation}
        >
          <ProfileSettings />
        </motion.div>
      </TabsContent>
    </Tabs>
  );
};
