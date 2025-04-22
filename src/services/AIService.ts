
import OpenAI from 'openai';
import { z } from 'zod';

export class AIService {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.AI_API_KEY,
    });
  }

  async generateCoachingReply(message: string, mood: string, context: string) {
    const response = await this.openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: `You are an empathetic coach. The user's current mood is: ${mood}. Previous context: ${context}` },
        { role: "user", content: message }
      ]
    });
    return response.choices[0].message.content;
  }

  async generateChatbotReply(message: string, personality: 'playful' | 'professional', history: string) {
    const tone = personality === 'playful' ? 
      'Be friendly and witty in your responses' : 
      'Maintain a professional and supportive tone';
    
    const response = await this.openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: `${tone}. Chat history: ${history}` },
        { role: "user", content: message }
      ]
    });
    return response.choices[0].message.content;
  }

  async generateRoadmap(goals: string, struggles: string, dailyTime: number) {
    const prompt = `Create a 30-day SMART goal roadmap based on:
      Goals: ${goals}
      Struggles: ${struggles}
      Available daily time: ${dailyTime} minutes
      
      Return a JSON array of objects with format:
      { day: number, title: string, description: string, xp: number }`;

    const response = await this.openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: "You are a goal-setting expert. Respond only with valid JSON." },
        { role: "user", content: prompt }
      ]
    });
    return JSON.parse(response.choices[0].message.content || '[]');
  }

  async verifyPhoto(imageUrl: string, questId: string) {
    const response = await this.openai.chat.completions.create({
      model: "gpt-4-vision-preview",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: `Verify if this image shows completion of quest ${questId}. Respond with only "verified" or "invalid".` },
            { type: "image_url", image_url: imageUrl }
          ],
        },
      ],
    });
    return response.choices[0].message.content?.toLowerCase() === 'verified';
  }
}
