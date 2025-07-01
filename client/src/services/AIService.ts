
import { z } from 'zod';
import { supabase } from '@/integrations/supabase/client';

// Define error class for AI service errors
export class AIServiceError extends Error {
  constructor(message: string, public readonly context?: Record<string, any>) {
    super(message);
    this.name = 'AIServiceError';
  }
}

export class AIService {
  private apiKey: string;
  private model: string;
  private readonly maxRetries = 2;

  constructor() {
    this.apiKey = import.meta.env.VITE_OPENROUTER_API_KEY || '';
    this.model = import.meta.env.VITE_AI_MODEL || 'deepseek/deepseek-coder';
  }

  // Helper method to make API calls with retries
  private async callSupabaseFunction<T>(
    endpoint: string, 
    data: Record<string, any>,
    retryCount = 0
  ): Promise<T> {
    try {
      const { data: responseData, error } = await supabase.functions.invoke('ai-services', {
        body: {
          endpoint,
          data
        }
      });
      
      if (error) {
        console.error(`Error calling ${endpoint}:`, error);
        throw new AIServiceError(`Failed to call ${endpoint}`, { originalError: error });
      }
      
      return responseData as T;
    } catch (error) {
      // Retry logic with exponential backoff
      if (retryCount < this.maxRetries) {
        const delay = Math.pow(2, retryCount) * 1000; // Exponential backoff: 1s, 2s, 4s...
        console.log(`Retrying ${endpoint} after ${delay}ms (attempt ${retryCount + 1}/${this.maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, delay));
        return this.callSupabaseFunction(endpoint, data, retryCount + 1);
      }
      
      console.error(`All retry attempts failed for ${endpoint}:`, error);
      throw error instanceof AIServiceError 
        ? error 
        : new AIServiceError('AI service unavailable', { originalError: error });
    }
  }

  async generateDailyAffirmation(theme: string, username: string = '', mood: string = ''): Promise<string> {
    try {
      // First check if we have a cached affirmation that's suitable
      const cachedAffirmation = this.getCachedAffirmation(theme, mood);
      if (cachedAffirmation) {
        return cachedAffirmation;
      }
      
      // If not cached or cache invalid, generate new affirmation
      const response = await this.callSupabaseFunction<{ affirmation: string }>(
        'affirmation',
        { 
          theme, 
          username, 
          mood,
          style: 'concise' // Request concise style for better affirmations
        }
      );
      
      // Cache the newly generated affirmation
      this.cacheAffirmation(theme, response.affirmation, mood);
      return response.affirmation;
    } catch (error) {
      console.error('Error in generateDailyAffirmation:', error);
      // Provide a quality fallback affirmation based on theme
      return this.getFallbackAffirmation(theme);
    }
  }

  private getCachedAffirmation(theme: string, mood: string): string | null {
    try {
      const cacheKey = `affirmation_${theme}_${mood || 'any'}`;
      const cache = localStorage.getItem(cacheKey);
      if (cache) {
        const { affirmation, timestamp } = JSON.parse(cache);
        // Check if cache is still valid (24 hours)
        if (Date.now() - timestamp < 24 * 60 * 60 * 1000) {
          return affirmation;
        }
      }
    } catch (err) {
      // Silently fail and generate new affirmation
    }
    return null;
  }

  private cacheAffirmation(theme: string, affirmation: string, mood: string = ''): void {
    try {
      const cacheKey = `affirmation_${theme}_${mood || 'any'}`;
      localStorage.setItem(cacheKey, JSON.stringify({
        affirmation,
        timestamp: Date.now()
      }));
    } catch (err) {
      // Silently fail if storage fails
    }
  }

  private getFallbackAffirmation(theme: string): string {
    const fallbacks: Record<string, string[]> = {
      'Discipline': [
        "Today I choose consistent effort over sporadic intensity.",
        "Small daily disciplines compound into massive achievements.",
        "I build my discipline muscle with every mindful choice.",
        "My consistent habits are creating my future self."
      ],
      'Focus': [
        "I direct my attention with intention and purpose.",
        "My focus becomes sharper with each mindful moment.",
        "I choose where my attention goes and it serves my growth.",
        "In this moment, I am fully present and capable."
      ],
      'Resilience': [
        "Every challenge I face strengthens my resilience.",
        "I transform setbacks into stepping stones.",
        "My strength grows with each obstacle I overcome.",
        "I bend but do not break; I adapt and evolve."
      ],
      'Wildcards': [
        "Today I embrace the unexpected as an opportunity.",
        "I welcome spontaneity and new experiences into my life.",
        "Comfort zone boundaries are meant to be expanded.",
        "Growth happens outside my familiar routines."
      ],
      'default': [
        "Today I take one step forward on my journey.",
        "Progress over perfection guides my actions today.",
        "I am becoming more capable and aware with each day.",
        "My potential unfolds with each intentional action."
      ]
    };
    
    const options = fallbacks[theme] || fallbacks['default'];
    return options[Math.floor(Math.random() * options.length)];
  }

  async generateCoachingReply(message: string, mood: string, context: string, userProfile: any = {}) {
    try {
      // Check if it's a simple question to potentially optimize response
      const isSimpleQuestion = message.trim().length < 20;
      
      const response = await this.callSupabaseFunction<{ reply: string }>(
        'coaching',
        { 
          message, 
          mood, 
          context, 
          userProfile, 
          isSimpleQuestion,
          style: 'clear_concise' // Request specific style
        }
      );
      
      return response.reply;
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
      
      const response = await this.callSupabaseFunction<{ reply: string }>(
        'coaching',
        { 
          message, 
          context: `Tone: ${tone}. History: ${history}`, 
          userProfile,
          isSimpleQuestion,
          style: 'clear_concise' // Request specific style
        }
      );
      
      return response.reply;
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
      const response = await this.callSupabaseFunction<{ roadmap: any }>(
        'roadmap',
        { 
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
      );
      
      // For guest users without auth, store the roadmap in localStorage
      if (userProfile.is_guest && response.roadmap) {
        localStorage.setItem('guestRoadmap', JSON.stringify(response.roadmap));
      }
      
      return response.roadmap;
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
      const response = await this.callSupabaseFunction<{ mood: string }>(
        'mood',
        { journalEntry }
      );
      
      return response.mood;
    } catch (error) {
      console.error('Error in analyzeMood:', error);
      return "neutral"; // Safe fallback
    }
  }

  async verifyPhoto(imageUrl: string, questId: string, questTitle: string, questDescription: string): Promise<boolean> {
    try {
      console.log("Verifying photo for quest:", questTitle);
      const response = await this.callSupabaseFunction<{ verified: boolean }>(
        'verification',
        { imageUrl, questId, questTitle, questDescription }
      );
      
      return response.verified;
    } catch (error) {
      console.error('Error in verifyPhoto:', error);
      // For now, default to true if verification fails
      return true;
    }
  }
}
