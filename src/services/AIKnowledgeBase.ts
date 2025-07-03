
/**
 * AI KNOWLEDGE BASE
 * 
 * This file serves as documentation for the AI capabilities in the application.
 * It is not directly used in the code but serves as a reference for developers.
 */

export const AIKnowledgeBase = {
  /**
   * FEATURES
   */
  features: {
    aiCoach: {
      description: "An AI-powered coach that provides personalized guidance and support",
      capabilities: [
        "Gives personalized advice based on user's theme and goals",
        "Adapts responses to user's mood",
        "Provides brief answers for simple questions",
        "Offers detailed guidance for complex questions",
        "Uses conversation history for context",
      ],
      implementation: "Uses OpenRouter API with the deepseek/deepseek-coder model",
    },
    
    roadmapGenerator: {
      description: "Creates personalized 30-day roadmaps based on user goals and challenges",
      capabilities: [
        "Generates structured daily tasks aligned with user goals",
        "Considers available time commitment",
        "Adapts to struggles identified by the user",
        "Assigns appropriate XP rewards based on difficulty",
        "Includes photo verification tasks for accountability",
      ],
      implementation: "Uses OpenRouter API to generate a structured JSON response",
    },
    
    dailyAffirmations: {
      description: "Provides short, impactful daily affirmations tailored to user's theme and mood",
      capabilities: [
        "Generates concise, one-sentence affirmations",
        "Customizes to selected theme",
        "Adapts to user's mood when available",
        "Refreshes daily or on-demand",
        "Includes fallback affirmations when offline",
      ],
      implementation: "Uses OpenRouter API with strict token limits for brevity",
    },
    
    moodDetection: {
      description: "Analyzes user journal entries to determine emotional state",
      capabilities: [
        "Categorizes mood into predefined categories",
        "Returns a single most relevant mood",
        "Supports integration with other AI features",
      ],
      implementation: "Uses OpenRouter API with specific categorization instructions",
    },
    
    photoVerification: {
      description: "Validates photo submissions for quest completion",
      capabilities: [
        "Checks if uploaded images match quest requirements",
        "Provides verification status",
        "Future: Will use vision models for improved accuracy",
      ],
      implementation: "Currently simulates verification; will integrate with vision models in future",
    },
  },
  
  /**
   * TECHNICAL IMPLEMENTATION
   */
  implementation: {
    edgeFunction: {
      description: "Supabase Edge Function that handles all AI service requests",
      file: "supabase/functions/ai-services/index.ts",
      endpoints: [
        "coaching - Handles chat interactions with the AI coach",
        "roadmap - Generates personalized 30-day roadmaps",
        "mood - Analyzes mood from journal entries",
        "affirmation - Creates personalized daily affirmations",
        "verification - Validates quest completion photos",
      ],
      security: "Uses environment variables for API keys, implements CORS headers",
    },
    
    aiService: {
      description: "Frontend service that interfaces with the AI edge function",
      file: "src/services/AIService.ts",
      methods: [
        "generateDailyAffirmation - Gets a personalized affirmation",
        "generateCoachingReply - Gets AI coach responses",
        "generateChatbotReply - Gets casual chatbot responses",
        "generateRoadmap - Creates a 30-day roadmap",
        "analyzeMood - Detects mood from text",
        "verifyPhoto - Checks if a photo meets quest requirements",
      ],
    },
    
    frontend: {
      description: "UI components that use AI services",
      components: [
        "DailyAffirmation - Displays and refreshes daily affirmations",
        "Coach - AI coaching interface with chat history",
        "Survey - Collects user data to generate personalized roadmaps",
      ],
    },
    
    database: {
      description: "Supabase tables that store AI-related data",
      tables: [
        "chat_history - Stores user-AI conversations",
        "survey_responses - Stores user goals, struggles, and time commitments",
        "profiles - Stores user theme preferences and progress",
      ],
    },
    
    optimizations: {
      description: "Performance and user experience improvements",
      details: [
        "Brief responses for simple questions to improve readability",
        "Token limits adjusted based on query complexity",
        "Locally cached affirmations to reduce API calls",
        "Fallback responses for offline scenarios",
        "Optimistic UI updates for improved perceived performance",
      ],
    },
  },
};
