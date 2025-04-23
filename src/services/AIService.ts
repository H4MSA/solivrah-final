
import { z } from 'zod';

interface OpenRouterMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface OpenRouterCompletionRequest {
  model: string;
  messages: OpenRouterMessage[];
  temperature?: number;
  max_tokens?: number;
}

export class AIService {
  private apiKey: string;
  private model: string;

  constructor() {
    this.apiKey = process.env.OPENROUTER_API_KEY || process.env.AI_API_KEY || '';
    this.model = process.env.AI_MODEL || 'deepseek/deepseek-coder';
  }

  async generateCompletionWithOpenRouter(messages: OpenRouterMessage[], temperature = 0.7, maxTokens = 2048): Promise<string> {
    const requestData: OpenRouterCompletionRequest = {
      model: this.model,
      messages,
      temperature,
      max_tokens: maxTokens
    };

    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
          'HTTP-Referer': 'https://lovable.ai',
          'X-Title': 'Personal Development Coach'
        },
        body: JSON.stringify(requestData)
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`OpenRouter API error: ${error}`);
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error('Error calling OpenRouter API:', error);
      throw error;
    }
  }

  async generateDailyAffirmation(theme: string, username: string = ''): Promise<string> {
    const userContext = username ? `for ${username}` : '';
    const messages: OpenRouterMessage[] = [
      { 
        role: 'system', 
        content: 'You are an inspiring personal development coach. Generate a short, powerful daily affirmation that is motivating and positive. Keep it concise (1-2 sentences maximum) and directly applicable.' 
      },
      { 
        role: 'user', 
        content: `Create a daily affirmation ${userContext} focused on the theme: ${theme}. Make it personal, uplifting, and actionable.` 
      }
    ];

    return this.generateCompletionWithOpenRouter(messages, 0.7, 150);
  }

  async generateCoachingReply(message: string, mood: string, context: string, userProfile: any = {}) {
    const userTheme = userProfile.theme || 'general personal development';
    const userProgress = userProfile.xp ? `Current progress: ${userProfile.xp} XP earned, ${userProfile.streak || 0} day streak.` : '';
    
    const messages: OpenRouterMessage[] = [
      { 
        role: 'system', 
        content: `You are an empathetic personal development coach specializing in ${userTheme}. 
        The user's current mood is: ${mood}. 
        ${userProgress}
        Previous conversation context: ${context}
        
        Respond with empathy and practical guidance. Be concise and conversational.`
      },
      { role: 'user', content: message }
    ];

    return this.generateCompletionWithOpenRouter(messages, 0.7, 500);
  }

  async generateChatbotReply(message: string, personality: 'playful' | 'professional', history: string, userProfile: any = {}) {
    const tone = personality === 'playful' ? 
      'Be friendly, witty and casual in your responses' : 
      'Maintain a professional, structured and supportive tone';
    
    const messages: OpenRouterMessage[] = [
      { 
        role: 'system', 
        content: `You are a personal development chatbot. ${tone}. Chat history: ${history}` 
      },
      { role: 'user', content: message }
    ];

    return this.generateCompletionWithOpenRouter(messages, 0.7, 500);
  }

  async generateRoadmap(goals: string, struggles: string, dailyTime: number, userProfile: any = {}) {
    const theme = userProfile.theme || 'personal development';
    const prompt = `Create a 30-day SMART goal roadmap based on:
      Theme: ${theme}
      Goals: ${goals}
      Struggles: ${struggles}
      Available daily time: ${dailyTime} minutes
      
      Return a JSON array of objects with the following strict format:
      [
        { 
          "day": number, 
          "title": string, 
          "description": string, 
          "xp": number,
          "requires_photo": boolean
        },
        ...
      ]
      
      Make sure each day has a unique, specific task that builds toward the goals while addressing the struggles.
      Ensure the tasks respect the available daily time.
      Include photo verification for important milestones (about 30% of tasks).
      The XP rewards should range from 10-50 based on task difficulty.
      Format ONLY as valid JSON with no additional text or explanation.`;

    const messages: OpenRouterMessage[] = [
      { 
        role: 'system', 
        content: "You are a goal-setting expert specialized in creating personalized roadmaps. Return only valid JSON with no additional text." 
      },
      { role: 'user', content: prompt }
    ];

    const response = await this.generateCompletionWithOpenRouter(messages, 0.3, 4000);
    try {
      return JSON.parse(response);
    } catch (error) {
      console.error("Failed to parse roadmap JSON:", response);
      throw new Error("Invalid roadmap format received from AI service");
    }
  }

  async analyzeMood(journalEntry: string): Promise<string> {
    const messages: OpenRouterMessage[] = [
      { 
        role: 'system', 
        content: 'You analyze short journal entries and categorize the writer\'s mood. Return ONLY ONE of these mood categories: happy, calm, anxious, unmotivated, focused, energetic, tired, stressed, grateful, reflective, sad, excited.' 
      },
      { 
        role: 'user', 
        content: `Journal entry: "${journalEntry}". What single mood best describes the writer's emotional state?` 
      }
    ];

    return this.generateCompletionWithOpenRouter(messages, 0.3, 50);
  }

  async verifyPhoto(imageUrl: string, questId: string, questTitle: string, questDescription: string): Promise<boolean> {
    // For image verification, we need to use a vision-capable model
    // Since we're using OpenRouter, we'd need to route to a vision model
    
    const messages: OpenRouterMessage[] = [
      {
        role: 'user',
        content: `I need to verify if this image shows completion of the following quest:
        Quest ID: ${questId}
        Title: ${questTitle}
        Description: ${questDescription}
        
        The user should have uploaded an image showing they completed this task.
        Analyze the image and respond with only "verified" if the image reasonably shows completion of the task or "invalid" if it doesn't.`
      }
    ];
    
    // Since OpenRouter doesn't support direct image binaries, we'll assume imageUrl is accessible
    // For a complete implementation, you would need to ensure the image is publicly accessible
    // or use a model that accepts base64 encoded images
    
    // This is a mock implementation since we can't send images to the text-only DeepSeek model
    console.log("Image verification requested for quest:", questTitle);
    console.log("Image URL:", imageUrl);
    
    // Always return true for now, as this is just a placeholder
    // In a real implementation, you would analyze the image with a vision model
    return true;
  }
}
