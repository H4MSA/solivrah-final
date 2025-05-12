import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Save, RefreshCw, Settings, MessageCircle, Map, Quote, Image } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { ThemeBackground } from '@/components/ThemeBackground';
import { GlassCard } from '@/components/GlassCard';
import { useApp } from '@/context/AppContext';
import { supabase } from '@/integrations/supabase/client';

interface AdminSettings {
  affirmation: string;
  coaching: string;
  roadmap: string;
}

// Extended profile type to include the role field
interface ExtendedProfile {
  id: string;
  role: string | null;
  streak?: number | null;
  xp?: number | null;
  theme?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

const Admin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useApp();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('affirmation');
  const [settings, setSettings] = useState<AdminSettings>({
    affirmation: '',
    coaching: '',
    roadmap: '',
  });
  
  // Check for admin access
  useEffect(() => {
    const checkAdminAccess = async () => {
      if (!user) {
        navigate('/auth');
        return;
      }
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        // Cast the data to our extended profile type
        const profileData = data as unknown as ExtendedProfile;
        
        // If role column exists and user is an admin, allow access
        // Otherwise, redirect to home page
        if (error || !profileData || profileData.role !== 'admin') {
          toast({
            title: "Access Denied",
            description: "You don't have permission to access this page",
            variant: "destructive",
          });
          navigate('/home');
        }
      } catch (error) {
        console.error("Error checking admin access:", error);
        navigate('/home');
      }
    };
    
    checkAdminAccess();
  }, [user, navigate, toast]);

  useEffect(() => {
    // Load AI settings when component mounts
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setIsLoading(true);
    
    try {
      // Fetch all settings
      const [affirmationResp, coachingResp, roadmapResp] = await Promise.all([
        fetchSetting('affirmation'),
        fetchSetting('coaching'),
        fetchSetting('roadmap')
      ]);
      
      setSettings({
        affirmation: affirmationResp || defaultInstructions.affirmation,
        coaching: coachingResp || defaultInstructions.coaching,
        roadmap: roadmapResp || defaultInstructions.roadmap
      });
    } catch (error) {
      console.error("Error fetching settings:", error);
      toast({
        title: "Error",
        description: "Failed to load settings",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSetting = async (type: string): Promise<string | null> => {
    try {
      const { data, error } = await supabase.functions.invoke('ai-services', {
        body: {
          endpoint: 'admin',
          data: { 
            action: 'getInstructions',
            type
          }
        }
      });
      
      if (error) throw error;
      return data.instructions || null;
    } catch (error) {
      console.error(`Error fetching ${type} instructions:`, error);
      return null;
    }
  };

  const saveSetting = async (type: string) => {
    setIsLoading(true);
    
    try {
      const content = settings[type as keyof AdminSettings];
      
      const { data, error } = await supabase.functions.invoke('ai-services', {
        body: {
          endpoint: 'admin',
          data: {
            action: 'setInstructions',
            type,
            content
          }
        }
      });
      
      if (error) throw error;
      
      toast({
        title: "Settings Saved",
        description: `${type.charAt(0).toUpperCase() + type.slice(1)} settings updated successfully`,
      });
    } catch (error) {
      console.error(`Error saving ${type} settings:`, error);
      toast({
        title: "Error",
        description: `Failed to save ${type} settings`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof AdminSettings, value: string) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const resetToDefault = (field: keyof AdminSettings) => {
    setSettings(prev => ({
      ...prev,
      [field]: defaultInstructions[field]
    }));
  };

  // Default instruction templates
  const defaultInstructions = {
    affirmation: 
`You create motivational daily affirmations for personal development.
Instructions:
1. Keep affirmations extremely concise (under 80 characters)
2. Make them positive, present tense, and personal
3. Focus on growth mindset and empowerment
4. Avoid cliches and generic platitudes
5. Match the tone to the user's current theme and mood
6. Never use quotes or attribution - speak directly to the user`,

    coaching: 
`You are an empathetic AI coach specializing in personal development.
Coaching guidelines:
1. Listen actively and validate the user's experiences
2. Ask powerful questions that promote self-discovery
3. Provide actionable, specific guidance (not generic advice)
4. Maintain a warm, supportive tone while being direct when needed
5. Keep responses concise and focused on the user's immediate concerns
6. Balance encouragement with practical strategies
7. Tailor advice to the user's specific theme focus and current mood`,

    roadmap: 
`Create personalized 30-day roadmaps for habit building and goal achievement.
Roadmap requirements:
1. Design progressive steps that build on previous accomplishments
2. Ensure each daily task is specific, measurable, and achievable
3. Match task difficulty to the user's available daily time commitment
4. Include rest days and reflection activities to prevent burnout
5. Create tasks that directly address the user's stated struggles
6. Balance quick wins with long-term growth opportunities
7. Structure tasks to increase in challenge and reward over time
8. Include photo verification for milestone achievements (about 30% of tasks)`
  };

  const animationConfig = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
    transition: { duration: 0.3 }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      <ThemeBackground />
      
      <div className="px-4 pt-8 pb-32 max-w-4xl mx-auto">
        <motion.div 
          className="flex items-center mb-6"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <button 
            onClick={() => navigate(-1)} 
            className="mr-3 hover:bg-white/10 p-2 rounded-lg transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-bold">AI Admin Settings</h1>
        </motion.div>
        
        <motion.p 
          className="text-white/70 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          Customize how the AI components behave throughout the app
        </motion.p>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full grid grid-cols-3 mb-6 bg-[#1A1A1A]/50 backdrop-blur-md">
            <TabsTrigger value="affirmation" className="data-[state=active]:bg-white/10">
              <div className="flex items-center">
                <Quote className="w-4 h-4 mr-2" />
                <span>Affirmations</span>
              </div>
            </TabsTrigger>
            <TabsTrigger value="coaching" className="data-[state=active]:bg-white/10">
              <div className="flex items-center">
                <MessageCircle className="w-4 h-4 mr-2" />
                <span>Coaching</span>
              </div>
            </TabsTrigger>
            <TabsTrigger value="roadmap" className="data-[state=active]:bg-white/10">
              <div className="flex items-center">
                <Map className="w-4 h-4 mr-2" />
                <span>Roadmaps</span>
              </div>
            </TabsTrigger>
          </TabsList>
          
          <GlassCard variant="dark" className="mb-6">
            <TabsContent value="affirmation">
              <SettingPanel
                title="Affirmation Settings"
                description="Configure how daily affirmations are generated"
                value={settings.affirmation}
                onChange={(value) => handleInputChange('affirmation', value)}
                onSave={() => saveSetting('affirmation')}
                onReset={() => resetToDefault('affirmation')}
                isLoading={isLoading}
                icon={<Quote className="w-5 h-5 text-purple-400" />}
              />
            </TabsContent>
            
            <TabsContent value="coaching">
              <SettingPanel
                title="Coaching Settings"
                description="Configure how the AI coach responds to users"
                value={settings.coaching}
                onChange={(value) => handleInputChange('coaching', value)}
                onSave={() => saveSetting('coaching')}
                onReset={() => resetToDefault('coaching')}
                isLoading={isLoading}
                icon={<MessageCircle className="w-5 h-5 text-blue-400" />}
              />
            </TabsContent>
            
            <TabsContent value="roadmap">
              <SettingPanel
                title="Roadmap Settings"
                description="Configure how 30-day roadmaps are generated"
                value={settings.roadmap}
                onChange={(value) => handleInputChange('roadmap', value)}
                onSave={() => saveSetting('roadmap')}
                onReset={() => resetToDefault('roadmap')}
                isLoading={isLoading}
                icon={<Map className="w-5 h-5 text-green-400" />}
              />
            </TabsContent>
          </GlassCard>
        </Tabs>
      </div>
    </div>
  );
};

interface SettingPanelProps {
  title: string;
  description: string;
  value: string;
  onChange: (value: string) => void;
  onSave: () => void;
  onReset: () => void;
  isLoading: boolean;
  icon: React.ReactNode;
}

const SettingPanel: React.FC<SettingPanelProps> = ({ 
  title, 
  description, 
  value, 
  onChange, 
  onSave, 
  onReset, 
  isLoading,
  icon
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
    >
      <div className="flex items-start gap-3 mb-4">
        <div className="mt-1">{icon}</div>
        <div>
          <h2 className="text-lg font-medium">{title}</h2>
          <p className="text-white/70 text-sm">{description}</p>
        </div>
      </div>
      
      <div className="mb-4">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full h-72 bg-black/30 border border-white/10 rounded-lg p-3 text-white resize-none font-mono text-sm focus:outline-none focus:border-white/30"
          placeholder="Enter instructions for the AI..."
          disabled={isLoading}
        />
      </div>
      
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={onReset}
          disabled={isLoading}
          className="bg-transparent hover:bg-white/5"
        >
          Reset to Default
        </Button>
        
        <Button
          onClick={onSave}
          disabled={isLoading}
          className="bg-white text-black hover:bg-white/90"
        >
          {isLoading ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </>
          )}
        </Button>
      </div>
    </motion.div>
  );
};

export default Admin;
