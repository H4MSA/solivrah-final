
import { z } from 'zod';
import { supabase } from '@/integrations/supabase/client';

export class AIService {
  private apiKey: string;
  private model: string;

  constructor() {
    this.apiKey = import.meta.env.VITE_OPENROUTER_API_KEY || '';
    this.model = import.meta.env.VITE_AI_MODEL || 'deepseek/deepseek-coder';
  }

  async generateDailyAffirmation(theme: string, username: string = '', mood: string = ''): Promise<string> {
    try {
      const { data, error } = await supabase.functions.invoke('ai-services', {
        body: {
          endpoint: 'affirmation',
          data: { theme, username, mood }
        }
      });
      
      if (error) {
        console.error('Error generating affirmation:', error);
        throw error;
      }
      
      return data.affirmation;
    } catch (error) {
      console.error('Error in generateDailyAffirmation:', error);
      // Provide a fallback affirmation if API call fails
      return `Today I embrace growth and progress on my ${theme} journey.`;
    }
  }

  async generateCoachingReply(message: string, mood: string, context: string, userProfile: any = {}) {
    try {
      // Check if it's a simple question to potentially optimize response
      const isSimpleQuestion = message.trim().length < 20;
      
      const { data, error } = await supabase.functions.invoke('ai-services', {
        body: {
          endpoint: 'coaching',
          data: { message, mood, context, userProfile, isSimpleQuestion }
        }
      });
      
      if (error) {
        console.error('Error generating coaching reply:', error);
        throw error;
      }
      
      return data.reply;
    } catch (error) {
      console.error('Error in generateCoachingReply:', error);
      return "I'm having trouble connecting right now. Please try again in a moment.";
    }
  }

  async generateChatbotReply(message: string, personality: 'playful' | 'professional', history: string, userProfile: any = {}) {
    // This can use the coaching endpoint with slightly modified parameters
    try {
      const isSimpleQuestion = message.trim().length < 20;
      const tone = personality === 'playful' ? 
        'Be friendly, witty and casual in your responses' : 
        'Maintain a professional, structured and supportive tone';
      
      const { data, error } = await supabase.functions.invoke('ai-services', {
        body: {
          endpoint: 'coaching',
          data: { 
            message, 
            context: `Tone: ${tone}. History: ${history}`, 
            userProfile,
            isSimpleQuestion
          }
        }
      });
      
      if (error) {
        console.error('Error generating chatbot reply:', error);
        throw error;
      }
      
      return data.reply;
    } catch (error) {
      console.error('Error in generateChatbotReply:', error);
      return "I'm having trouble connecting right now. Please try again in a moment.";
    }
  }

  async generateRoadmap(goals: string, struggles: string, dailyTime: number, userProfile: any = {}) {
    try {
      // Enhanced logging to debug roadmap generation
      console.log("Generating roadmap with parameters:", { 
        goals, 
        struggles, 
        dailyTime, 
        userProfile: { 
          ...userProfile, 
          id: userProfile.id ? `${userProfile.id.substring(0, 5)}...` : 'unknown' 
        } 
      });
      
      // For guest users, check if we already have a stored roadmap
      if (userProfile.is_guest) {
        const storedRoadmap = localStorage.getItem('guestRoadmap');
        if (storedRoadmap) {
          try {
            return JSON.parse(storedRoadmap);
          } catch (e) {
            console.log("Could not parse stored roadmap, generating new one");
          }
        }
      }
      
      // Make the API request with enhanced prompting
      const { data, error } = await supabase.functions.invoke('ai-services', {
        body: {
          endpoint: 'roadmap',
          data: { 
            goals, 
            struggles, 
            dailyTime, 
            userProfile,
            enhanced: true, // Signal the API to use enhanced prompting
            requestMetadata: {
              client: 'web-app',
              timestamp: new Date().toISOString()
            }
          }
        }
      });
      
      if (error) {
        console.error('Error generating roadmap:', error);
        throw error;
      }
      
      // For guest users without auth, store the roadmap in localStorage
      if (userProfile.is_guest) {
        localStorage.setItem('guestRoadmap', JSON.stringify(data.roadmap));
      }
      
      return data.roadmap;
    } catch (error) {
      console.error('Error in generateRoadmap:', error);
      
      // Create fallback roadmap if API fails
      const fallbackRoadmap = {
        theme: userProfile.theme || 'General',
        goal: goals,
        days: Array.from({ length: 30 }, (_, i) => ({
          day: i + 1,
          title: `Day ${i+1}: Progress Step`,
          description: "Continue working on your goals with small, achievable steps.",
          tasks: [
            "Review your progress",
            "Set a small goal for today",
            "Take one action toward your main goal"
          ],
          completed: false
        }))
      };
      
      // Store fallback for guest users
      if (userProfile.is_guest) {
        localStorage.setItem('guestRoadmap', JSON.stringify(fallbackRoadmap));
      }
      
      return fallbackRoadmap;
    }
  }

  async analyzeMood(journalEntry: string): Promise<string> {
    try {
      const { data, error } = await supabase.functions.invoke('ai-services', {
        body: {
          endpoint: 'mood',
          data: { journalEntry }
        }
      });
      
      if (error) {
        console.error('Error analyzing mood:', error);
        throw error;
      }
      
      return data.mood;
    } catch (error) {
      console.error('Error in analyzeMood:', error);
      return "neutral"; // Safe fallback
    }
  }

  async verifyPhoto(imageUrl: string, questId: string, questTitle: string, questDescription: string): Promise<boolean> {
    try {
      console.log("Verifying photo for quest:", questTitle);
      const { data, error } = await supabase.functions.invoke('ai-services', {
        body: {
          endpoint: 'verification',
          data: { imageUrl, questId, questTitle, questDescription }
        }
      });
      
      if (error) {
        console.error('Error verifying photo:', error);
        throw error;
      }
      
      return data.verified;
    } catch (error) {
      console.error('Error in verifyPhoto:', error);
      // For now, default to true if verification fails
      return true;
    }
  }
}
