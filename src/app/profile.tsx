import React from "react";
import { motion } from "framer-motion";
import { useAppSound } from "@/context/SoundContext";
import { HeaderSection } from "@/components/composite/HeaderSection";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  User, 
  Settings, 
  Award, 
  BarChart2, 
  Calendar, 
  Edit, 
  LogOut, 
  Moon,
  Sun,
  Bell
} from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

export function ProfilePage() {
  const { playWithHaptics } = useAppSound();
  const { theme, setTheme } = useTheme();
  
  const handleTabChange = () => {
    playWithHaptics("button-tap");
  };
  
  return (
    <div className="flex flex-col min-h-screen pb-20">
      <HeaderSection 
        title="Profile" 
        showSearch={false}
      />
      
      <div className="flex-1 px-4 md:px-6 space-y-6 pb-6">
        {/* Profile header */}
        <section>
          <motion.div
            className="relative h-40 w-full rounded-xl overflow-hidden mb-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {/* Cover image */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20" />
            
            {/* Profile image */}
            <div className="absolute -bottom-12 left-4 border-4 border-background rounded-full">
              <Avatar className="h-24 w-24">
                <AvatarImage src="/placeholder.svg" alt="User" />
                <AvatarFallback className="text-xl">AW</AvatarFallback>
              </Avatar>
            </div>
            
            {/* Edit button */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute top-2 right-2 bg-black/40 backdrop-blur-sm"
              onClick={() => playWithHaptics("button-tap")}
            >
              <Edit size={16} />
            </Button>
          </motion.div>
          
          <div className="ml-4">
            <h1 className="text-2xl font-bold">Alex Wong</h1>
            <p className="text-muted-foreground">Wellness Explorer</p>
          </div>
        </section>
        
        {/* Profile stats summary */}
        <section>
          <div className="grid grid-cols-3 gap-3">
            <GlassCard className="p-4 text-center">
              <h3 className="text-2xl font-bold">42</h3>
              <p className="text-xs text-muted-foreground">Quests</p>
            </GlassCard>
            
            <GlassCard className="p-4 text-center">
              <h3 className="text-2xl font-bold">15</h3>
              <p className="text-xs text-muted-foreground">Day Streak</p>
            </GlassCard>
            
            <GlassCard className="p-4 text-center">
              <h3 className="text-2xl font-bold">8</h3>
              <p className="text-xs text-muted-foreground">Badges</p>
            </GlassCard>
          </div>
        </section>
        
        {/* Profile tabs */}
        <section>
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList className="w-full grid grid-cols-4">
              <TabsTrigger value="overview" onClick={handleTabChange}>
                <User size={16} className="mr-1 md:mr-2" />
                <span className="hidden md:inline">Overview</span>
              </TabsTrigger>
              <TabsTrigger value="stats" onClick={handleTabChange}>
                <BarChart2 size={16} className="mr-1 md:mr-2" />
                <span className="hidden md:inline">Stats</span>
              </TabsTrigger>
              <TabsTrigger value="achievements" onClick={handleTabChange}>
                <Award size={16} className="mr-1 md:mr-2" />
                <span className="hidden md:inline">Achievements</span>
              </TabsTrigger>
              <TabsTrigger value="settings" onClick={handleTabChange}>
                <Settings size={16} className="mr-1 md:mr-2" />
                <span className="hidden md:inline">Settings</span>
              </TabsTrigger>
            </TabsList>
            
            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-4">
              {/* Level progress */}
              <GlassCard className="p-5">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold">Level 8</h3>
                  <span className="text-xs text-muted-foreground">1,250 / 1,500 XP</span>
                </div>
                <Progress value={83} className="h-2" />
                <p className="text-xs text-muted-foreground mt-2">250 XP until Level 9</p>
              </GlassCard>
              
              {/* Recent activity */}
              <GlassCard className="p-5">
                <h3 className="font-semibold mb-4">Recent Activity</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <Award size={16} className="text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm">Completed "Morning Meditation"</p>
                      <p className="text-xs text-muted-foreground">Today</p>
                    </div>
                    <Badge variant="outline">+50 XP</Badge>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="bg-secondary/10 p-2 rounded-full">
                      <Calendar size={16} className="text-secondary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm">7-day streak achieved</p>
                      <p className="text-xs text-muted-foreground">Yesterday</p>
                    </div>
                    <Badge variant="outline">+100 XP</Badge>
                  </div>
                </div>
              </GlassCard>
            </TabsContent>
            
            {/* Stats Tab */}
            <TabsContent value="stats" className="space-y-4">
              <GlassCard className="p-5">
                <h3 className="font-semibold mb-4">Weekly Summary</h3>
                <div className="h-40 flex items-end justify-between gap-2">
                  {[40, 65, 35, 80, 55, 70, 90].map((value, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                      <div 
                        className="w-full bg-primary/30 rounded-t-sm" 
                        style={{ height: `${value}%` }}
                      />
                      <span className="text-xs">{['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}</span>
                    </div>
                  ))}
                </div>
              </GlassCard>
              
              <div className="grid grid-cols-2 gap-3">
                <GlassCard className="p-4">
                  <h4 className="text-sm font-medium mb-1">Total XP</h4>
                  <p className="text-2xl font-bold">1,250</p>
                </GlassCard>
                
                <GlassCard className="p-4">
                  <h4 className="text-sm font-medium mb-1">Quests Completed</h4>
                  <p className="text-2xl font-bold">42</p>
                </GlassCard>
                
                <GlassCard className="p-4">
                  <h4 className="text-sm font-medium mb-1">Current Streak</h4>
                  <p className="text-2xl font-bold">15 days</p>
                </GlassCard>
                
                <GlassCard className="p-4">
                  <h4 className="text-sm font-medium mb-1">Best Streak</h4>
                  <p className="text-2xl font-bold">21 days</p>
                </GlassCard>
              </div>
            </TabsContent>
            
            {/* Achievements Tab */}
            <TabsContent value="achievements" className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <GlassCard className="p-4 flex flex-col items-center text-center">
                  <div className="bg-primary/10 p-3 rounded-full mb-2">
                    <Award size={24} className="text-primary" />
                  </div>
                  <h4 className="font-medium">Early Bird</h4>
                  <p className="text-xs text-muted-foreground">Complete 5 morning quests</p>
                </GlassCard>
                
                <GlassCard className="p-4 flex flex-col items-center text-center">
                  <div className="bg-secondary/10 p-3 rounded-full mb-2">
                    <Calendar size={24} className="text-secondary" />
                  </div>
                  <h4 className="font-medium">Consistent</h4>
                  <p className="text-xs text-muted-foreground">7-day streak</p>
                </GlassCard>
                
                <GlassCard className="p-4 flex flex-col items-center text-center opacity-50">
                  <div className="bg-muted p-3 rounded-full mb-2">
                    <Award size={24} className="text-muted-foreground" />
                  </div>
                  <h4 className="font-medium">Mindfulness Master</h4>
                  <p className="text-xs text-muted-foreground">Complete 20 mindfulness quests</p>
                </GlassCard>
                
                <GlassCard className="p-4 flex flex-col items-center text-center opacity-50">
                  <div className="bg-muted p-3 rounded-full mb-2">
                    <Award size={24} className="text-muted-foreground" />
                  </div>
                  <h4 className="font-medium">Explorer</h4>
                  <p className="text-xs text-muted-foreground">Try all quest categories</p>
                </GlassCard>
              </div>
              
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => playWithHaptics("button-tap")}
              >
                View All Achievements
              </Button>
            </TabsContent>
            
            {/* Settings Tab */}
            <TabsContent value="settings" className="space-y-4">
              <GlassCard className="divide-y divide-white/10">
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Sun size={20} className="text-amber-500" />
                    <div>
                      <h4 className="font-medium">Theme</h4>
                      <p className="text-xs text-muted-foreground">Light / Dark mode</p>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      playWithHaptics("button-tap");
                      setTheme(theme === 'dark' ? 'light' : 'dark');
                    }}
                  >
                    {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
                    <span className="ml-2">{theme === 'dark' ? 'Light' : 'Dark'}</span>
                  </Button>
                </div>
                
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Bell size={20} className="text-primary" />
                    <div>
                      <h4 className="font-medium">Notifications</h4>
                      <p className="text-xs text-muted-foreground">Manage alerts</p>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => playWithHaptics("button-tap")}
                  >
                    Configure
                  </Button>
                </div>
                
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Settings size={20} className="text-muted-foreground" />
                    <div>
                      <h4 className="font-medium">Account Settings</h4>
                      <p className="text-xs text-muted-foreground">Privacy and security</p>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => playWithHaptics("button-tap")}
                  >
                    Manage
                  </Button>
                </div>
              </GlassCard>
              
              <Button 
                variant="destructive" 
                className="w-full"
                onClick={() => playWithHaptics("button-tap")}
              >
                <LogOut size={16} className="mr-2" />
                Sign Out
              </Button>
            </TabsContent>
          </Tabs>
        </section>
      </div>
    </div>
  );
} 