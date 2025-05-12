
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts";

// Set up CORS headers for cross-origin requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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

// Main serve function to handle all requests
serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get OpenRouter API key from environment variables
    const apiKey = Deno.env.get('OPENROUTER_API_KEY');
    if (!apiKey) {
      throw new Error('OPENROUTER_API_KEY not found in environment variables');
    }

    // Parse request body
    const { endpoint, data } = await req.json();
    
    // Route to different handlers based on endpoint
    switch (endpoint) {
      case 'coaching':
        return await handleCoaching(apiKey, data, corsHeaders);
      case 'roadmap':
        return await handleRoadmapGeneration(apiKey, data, corsHeaders);
      case 'mood':
        return await handleMoodAnalysis(apiKey, data, corsHeaders);
      case 'affirmation':
        return await handleAffirmationGeneration(apiKey, data, corsHeaders);
      case 'verification':
        return await handlePhotoVerification(apiKey, data, corsHeaders);
      case 'admin':
        return await handleAdminRequest(apiKey, data, corsHeaders);
      default:
        return new Response(
          JSON.stringify({ error: 'Invalid endpoint' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }
  } catch (error) {
    console.error('Error processing request:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

// Helper function to make OpenRouter API calls
async function callOpenRouter(apiKey: string, messages: OpenRouterMessage[], model: string = 'deepseek/deepseek-coder', temperature = 0.7, maxTokens = 2048): Promise<string> {
  const requestData: OpenRouterCompletionRequest = {
    model,
    messages,
    temperature,
    max_tokens: maxTokens
  };

  try {
    console.log(`Making OpenRouter API call to model: ${model}`);
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': 'https://lovable.ai',
        'X-Title': 'Solivrah Personal Development Coach'
      },
      body: JSON.stringify(requestData)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`OpenRouter API error: ${errorText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error calling OpenRouter API:', error);
    throw error;
  }
}

// Handler for coaching conversations
async function handleCoaching(apiKey: string, data: any, corsHeaders: HeadersInit): Promise<Response> {
  const { message, mood, context, userProfile, style = 'standard', isSimpleQuestion = false } = data;
  
  // Get coaching instructions from KV store or use defaults
  const coachingInstructions = await getCoachingInstructions() || 
    "You are an empathetic personal development coach. Provide concise, actionable guidance.";
  
  const userTheme = userProfile?.theme || 'general personal development';
  const userProgress = userProfile?.xp ? `Current progress: ${userProfile.xp} XP earned, ${userProfile.streak || 0} day streak.` : '';
  
  const styleGuide = style === 'clear_concise' 
    ? "Keep responses brief and actionable. Avoid excessive explanations. Use simple language." 
    : "";
  
  const messages: OpenRouterMessage[] = [
    { 
      role: 'system', 
      content: `${coachingInstructions}
      The user's current mood is: ${mood || 'unknown'}. 
      Their focus theme is: ${userTheme}.
      ${userProgress}
      Previous conversation context: ${context || 'This is a new conversation'}
      
      ${styleGuide}
      
      RESPONSE LENGTH INSTRUCTIONS:
      - For simple questions, provide very brief 1-2 sentence answers.
      - For deeper questions about personal development, provide focused guidance.
      - Always prioritize quality advice over length.
      
      Your tone should be friendly, motivational, and supportive.`
    },
    { role: 'user', content: message }
  ];

  // Adjust token limit based on question complexity
  const maxTokens = isSimpleQuestion ? 150 : 600;
  const reply = await callOpenRouter(apiKey, messages, 'deepseek/deepseek-coder', 0.7, maxTokens);
  
  return new Response(
    JSON.stringify({ reply }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

// Handler for roadmap generation
async function handleRoadmapGeneration(apiKey: string, data: any, corsHeaders: HeadersInit): Promise<Response> {
  const { goals, struggles, dailyTime, userProfile } = data;
  const theme = userProfile?.theme || 'personal development';
  
  // Get roadmap instructions from KV store or use defaults
  const roadmapInstructions = await getRoadmapInstructions() || 
    "Create practical, achievable daily tasks that build toward the user's goals.";
  
  const prompt = `${roadmapInstructions}
  
    Create a 30-day personalized SMART goal roadmap based on:
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
    Ensure the tasks respect the available daily time commitment (${dailyTime} minutes).
    Include photo verification for important milestone tasks (about 30% of tasks).
    The XP rewards should range from 10-50 based on task difficulty.
    Tasks should build progressively in complexity and impact.
    Format ONLY as valid JSON with no additional text or explanation.
    Make sure each task title is concise (under 60 characters) and description provides clear instructions.`;

  const messages: OpenRouterMessage[] = [
    { 
      role: 'system', 
      content: "You are a goal-setting expert specialized in creating personalized roadmaps. Return only valid JSON with no additional text." 
    },
    { role: 'user', content: prompt }
  ];

  // Using deepseek-coder since it's good at generating structured JSON responses
  const response = await callOpenRouter(apiKey, messages, 'deepseek/deepseek-coder', 0.3, 6000);
  
  try {
    // Validate the JSON response
    const roadmap = JSON.parse(response);
    return new Response(
      JSON.stringify({ roadmap }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error("Failed to parse roadmap JSON:", response);
    throw new Error("Invalid roadmap format received from AI service");
  }
}

// Handler for mood analysis
async function handleMoodAnalysis(apiKey: string, data: any, corsHeaders: HeadersInit): Promise<Response> {
  const { journalEntry } = data;
  
  const messages: OpenRouterMessage[] = [
    { 
      role: 'system', 
      content: 'You analyze journal entries and categorize the writer\'s mood. Return ONLY ONE of these mood categories: happy, calm, anxious, unmotivated, focused, energetic, tired, stressed, grateful, reflective, sad, excited, neutral.' 
    },
    { 
      role: 'user', 
      content: `Journal entry: "${journalEntry}". What single mood best describes the writer's emotional state? Return just one word from the categories.` 
    }
  ];

  const mood = await callOpenRouter(apiKey, messages, 'deepseek/deepseek-coder', 0.3, 100);
  
  return new Response(
    JSON.stringify({ mood: mood.trim().toLowerCase() }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

// Handler for daily affirmation generation
async function handleAffirmationGeneration(apiKey: string, data: any, corsHeaders: HeadersInit): Promise<Response> {
  const { theme, username, mood, style = 'standard' } = data;
  const userContext = username ? `for ${username}` : '';
  const moodContext = mood ? `considering their current mood is ${mood}` : '';
  
  // Get affirmation instructions from KV store or use defaults
  const affirmationInstructions = await getAffirmationInstructions() || 
    "Create short, powerful daily affirmations that are motivating and positive.";
  
  const styleGuide = style === 'concise' 
    ? "The affirmation MUST BE EXTREMELY CONCISE - UNDER 80 CHARACTERS TOTAL. Focus on brevity and impact." 
    : "Keep the affirmation brief and impactful.";
  
  const messages: OpenRouterMessage[] = [
    { 
      role: 'system', 
      content: `${affirmationInstructions}
      ${styleGuide}
      Generate a short, powerful daily affirmation that is motivating and positive.
      IMPORTANT: The affirmation should be ONE SHORT SENTENCE ONLY.
      Make it impactful and memorable.
      Do not include any introductions, explanations, or additional text.` 
    },
    { 
      role: 'user', 
      content: `Create a daily affirmation ${userContext} focused on the theme: ${theme} ${moodContext}. Make it personal, uplifting, and actionable. IMPORTANT: Keep it to one short sentence only.` 
    }
  ];

  // Limit to a very short response for punchier affirmations
  const affirmation = await callOpenRouter(apiKey, messages, 'deepseek/deepseek-coder', 0.7, 80);
  
  // Clean up affirmation - remove any quotes or extra formatting
  const cleanedAffirmation = affirmation
    .replace(/^['"]|['"]$/g, '') // Remove surrounding quotes
    .trim();
  
  return new Response(
    JSON.stringify({ affirmation: cleanedAffirmation }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

// Handler for photo verification
async function handlePhotoVerification(apiKey: string, data: any, corsHeaders: HeadersInit): Promise<Response> {
  const { imageUrl, questTitle, questDescription } = data;
  
  // Since we can't directly process image data with the text-based model,
  // We'll create a simple verification that just checks if the image exists
  // In a real app, you might want to integrate with a vision model API
  
  console.log("Photo verification requested for quest:", questTitle);
  
  // For now, we'll simulate a verification process
  // In a real app with vision models, you would analyze the image
  const messages: OpenRouterMessage[] = [
    { 
      role: 'system', 
      content: 'You are a verification system that validates images based on quest requirements.' 
    },
    { 
      role: 'user', 
      content: `An image has been uploaded as proof for the quest: "${questTitle}" with description "${questDescription}". For now, assume the image is valid and return "verified" as the response.` 
    }
  ];

  const verificationResult = await callOpenRouter(apiKey, messages, 'deepseek/deepseek-coder', 0.1, 100);
  const isVerified = verificationResult.toLowerCase().includes('verified');
  
  return new Response(
    JSON.stringify({ verified: isVerified }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

// New handler for admin-related requests
async function handleAdminRequest(apiKey: string, data: any, corsHeaders: HeadersInit): Promise<Response> {
  const { action, content, type } = data;
  
  switch (action) {
    case 'setInstructions':
      await setInstructions(type, content);
      return new Response(
        JSON.stringify({ success: true, message: `${type} instructions updated successfully` }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    
    case 'getInstructions':
      const instructions = await getInstructions(type);
      return new Response(
        JSON.stringify({ instructions }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    
    default:
      return new Response(
        JSON.stringify({ error: 'Invalid admin action' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
  }
}

// Helper functions for storing and retrieving AI instructions
// In a real implementation, these would use Deno KV or another storage mechanism
// For this example, we'll use simple localStorage simulation with global variables

let aiInstructions: Record<string, string> = {};

async function setInstructions(type: string, instructions: string): Promise<void> {
  aiInstructions[type] = instructions;
  // In a real implementation, we would persist this data
  console.log(`Updated ${type} instructions`);
}

async function getInstructions(type: string): Promise<string | null> {
  return aiInstructions[type] || null;
}

// Specific helpers for different instruction types
async function getCoachingInstructions(): Promise<string | null> {
  return getInstructions('coaching');
}

async function getRoadmapInstructions(): Promise<string | null> {
  return getInstructions('roadmap');
}

async function getAffirmationInstructions(): Promise<string | null> {
  return getInstructions('affirmation');
}
