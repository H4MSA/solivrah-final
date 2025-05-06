
import { z } from 'zod';
import { supabase } from '@/integrations/supabase/client';

export class AIService {
  private apiKey: string;
  private model: string;

  constructor() {
    this.apiKey = process.env.OPENROUTER_API_KEY || process.env.AI_API_KEY || '';
    this.model = process.env.AI_MODEL || 'deepseek/deepseek-coder';
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
      return `Today I am focused on my ${theme} journey, taking one step at a time toward my goals.`;
    }
  }

  async generateCoachingReply(message: string, mood: string, context: string, userProfile: any = {}) {
    try {
      const { data, error } = await supabase.functions.invoke('ai-services', {
        body: {
          endpoint: 'coaching',
          data: { message, mood, context, userProfile }
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
      const tone = personality === 'playful' ? 
        'Be friendly, witty and casual in your responses' : 
        'Maintain a professional, structured and supportive tone';
      
      const { data, error } = await supabase.functions.invoke('ai-services', {
        body: {
          endpoint: 'coaching',
          data: { 
            message, 
            context: `Tone: ${tone}. History: ${history}`, 
            userProfile 
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
      console.log("Generating roadmap with parameters:", { goals, struggles, dailyTime });
      const { data, error } = await supabase.functions.invoke('ai-services', {
        body: {
          endpoint: 'roadmap',
          data: { goals, struggles, dailyTime, userProfile }
        }
      });
      
      if (error) {
        console.error('Error generating roadmap:', error);
        throw error;
      }
      
      return data.roadmap;
    } catch (error) {
      console.error('Error in generateRoadmap:', error);
      throw new Error("Failed to generate roadmap");
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
