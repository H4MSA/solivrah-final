
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
async function callOpenRouter(apiKey: string, messages: OpenRouterMessage[], temperature = 0.7, maxTokens = 2048): Promise<string> {
  const requestData: OpenRouterCompletionRequest = {
    model: 'mistralai/mixtral-8x7b-instruct',
    messages,
    temperature,
    max_tokens: maxTokens
  };

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': 'https://lovable.ai',
        'X-Title': 'Personal Development Coach'
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
  const { message, mood, context, userProfile } = data;
  
  const userTheme = userProfile?.theme || 'general personal development';
  const userProgress = userProfile?.xp ? `Current progress: ${userProfile.xp} XP earned, ${userProfile.streak || 0} day streak.` : '';
  
  const messages: OpenRouterMessage[] = [
    { 
      role: 'system', 
      content: `You are an empathetic personal development coach specializing in ${userTheme}. 
      The user's current mood is: ${mood || 'unknown'}. 
      ${userProgress}
      Previous conversation context: ${context || 'This is a new conversation'}
      
      Respond with empathy and practical guidance. Be concise and conversational.`
    },
    { role: 'user', content: message }
  ];

  const reply = await callOpenRouter(apiKey, messages, 0.7, 500);
  
  return new Response(
    JSON.stringify({ reply }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

// Handler for roadmap generation
async function handleRoadmapGeneration(apiKey: string, data: any, corsHeaders: HeadersInit): Promise<Response> {
  const { goals, struggles, dailyTime, userProfile } = data;
  const theme = userProfile?.theme || 'personal development';
  
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

  const response = await callOpenRouter(apiKey, messages, 0.3, 4000);
  
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
      content: 'You analyze short journal entries and categorize the writer\'s mood. Return ONLY ONE of these mood categories: happy, calm, anxious, unmotivated, focused, energetic, tired, stressed, grateful, reflective, sad, excited.' 
    },
    { 
      role: 'user', 
      content: `Journal entry: "${journalEntry}". What single mood best describes the writer's emotional state?` 
    }
  ];

  const mood = await callOpenRouter(apiKey, messages, 0.3, 50);
  
  return new Response(
    JSON.stringify({ mood }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

// Handler for daily affirmation generation
async function handleAffirmationGeneration(apiKey: string, data: any, corsHeaders: HeadersInit): Promise<Response> {
  const { theme, username } = data;
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

  const affirmation = await callOpenRouter(apiKey, messages, 0.7, 150);
  
  return new Response(
    JSON.stringify({ affirmation }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}
