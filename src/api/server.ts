
import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { z } from 'zod';
import rateLimit from 'express-rate-limit';
import { AIService } from '../services/AIService';
import { SupabaseService } from '../services/SupabaseService';
import { createClient } from '@supabase/supabase-js';

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

app.use(cors());
app.use(express.json());

// Create rate limiter
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many requests, please try again later.'
});

// Apply rate limiting to all requests
app.use(apiLimiter);

const aiService = new AIService();
const supabaseService = new SupabaseService();

// Supabase admin client for auth verification
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_KEY!
);

// Middleware to verify authorization token
const authMiddleware = async (req: any, res: any, next: any) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'Authorization header is required' });
    }

    const token = authHeader.replace('Bearer ', '');
    const { data, error } = await supabase.auth.getUser(token);
    
    if (error || !data.user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    req.user = data.user;
    next();
  } catch (error) {
    console.error('Auth error:', error);
    res.status(401).json({ error: 'Authentication failed' });
  }
};

// Context enrichment middleware - adds user context for AI personalization
const contextMiddleware = async (req: any, res: any, next: any) => {
  try {
    if (req.user?.id) {
      req.userContext = await supabaseService.getUserContext(req.user.id);
    }
    next();
  } catch (error) {
    console.error('Context error:', error);
    next(); // Continue even if context loading fails
  }
};

// Validation schemas
const assistantSchema = z.object({
  message: z.string(),
  mood: z.string().optional()
});

const chatbotSchema = z.object({
  message: z.string(),
  personalitySettings: z.enum(['playful', 'professional'])
});

const roadmapSchema = z.object({
  goals: z.string(),
  struggles: z.string(),
  dailyTime: z.number().min(0)
});

const moodJournalSchema = z.object({
  mood: z.string().optional(),
  notes: z.string()
});

const questCompletionSchema = z.object({
  questId: z.string()
});

// Error handler middleware
const errorHandler = (err: any, req: any, res: any, next: any) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
};

// ============= API ENDPOINTS =============

// Daily Affirmation endpoint
app.get('/affirmation', authMiddleware, async (req, res) => {
  try {
    const theme = req.query.theme as string || 'general';
    const userId = req.user.id;
    
    // Check if we already have a recent affirmation for this theme
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const latestAffirmation = await supabaseService.getLatestAffirmation(userId, theme);
    
    if (latestAffirmation && new Date(latestAffirmation.created_at) >= today) {
      return res.json({ affirmation: latestAffirmation.content });
    }
    
    // Generate a new affirmation
    const username = req.userContext?.profile?.username;
    const affirmation = await aiService.generateDailyAffirmation(theme, username);
    
    // Save to database
    await supabaseService.saveAffirmation(userId, affirmation, theme);
    
    // Log AI usage
    await supabaseService.logAiUsage(
      userId, 
      '/affirmation', 
      `Generate affirmation for theme: ${theme}`, 
      affirmation
    );
    
    res.json({ affirmation });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to generate affirmation' });
  }
});

// Coaching assistant endpoint
app.post('/assistant', authMiddleware, contextMiddleware, async (req, res) => {
  try {
    const { message, mood } = assistantSchema.parse(req.body);
    const userId = req.user.id;
    
    const history = await supabaseService.getConversationHistory(userId);
    const context = history?.map(h => `${h.message}: ${h.reply}`).join('\n') || '';
    
    // Use the user's last logged mood if not provided in the request
    let userMood = mood;
    if (!userMood && req.userContext?.moodEntries?.[0]) {
      userMood = req.userContext.moodEntries[0].mood;
    }
    
    const reply = await aiService.generateCoachingReply(
      message, 
      userMood || 'neutral', 
      context,
      req.userContext?.profile
    );
    
    await supabaseService.saveConversation(userId, message, reply, userMood);
    
    // Log AI usage
    await supabaseService.logAiUsage(
      userId, 
      '/assistant', 
      `Message: ${message}, Mood: ${userMood || 'neutral'}`, 
      reply
    );
    
    res.json({ reply, updatedContext: context });
  } catch (error) {
    console.error(error);
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Invalid request data', details: error.errors });
    } else {
      res.status(500).json({ error: 'Failed to process coaching request' });
    }
  }
});

// Chatbot endpoint
app.post('/chatbot', authMiddleware, contextMiddleware, async (req, res) => {
  try {
    const { message, personalitySettings } = chatbotSchema.parse(req.body);
    const userId = req.user.id;
    
    const history = await supabaseService.getConversationHistory(userId);
    const historyText = history?.map(h => `${h.message}: ${h.reply}`).join('\n') || '';
    
    const reply = await aiService.generateChatbotReply(
      message, 
      personalitySettings, 
      historyText,
      req.userContext?.profile
    );
    
    await supabaseService.saveConversation(userId, message, reply);
    
    // Log AI usage
    await supabaseService.logAiUsage(
      userId, 
      '/chatbot', 
      `Message: ${message}, Personality: ${personalitySettings}`, 
      reply
    );
    
    res.json({ reply });
  } catch (error) {
    console.error(error);
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Invalid request data', details: error.errors });
    } else {
      res.status(500).json({ error: 'Failed to process chatbot request' });
    }
  }
});

// Roadmap generator endpoint
app.post('/roadmap', authMiddleware, contextMiddleware, async (req, res) => {
  try {
    const { goals, struggles, dailyTime } = roadmapSchema.parse(req.body);
    const userId = req.user.id;
    
    const roadmap = await aiService.generateRoadmap(
      goals, 
      struggles, 
      dailyTime,
      req.userContext?.profile
    );
    
    await supabaseService.saveRoadmap(userId, roadmap);
    
    // Log AI usage
    await supabaseService.logAiUsage(
      userId, 
      '/roadmap', 
      `Goals: ${goals}, Struggles: ${struggles}, Daily Time: ${dailyTime}`, 
      JSON.stringify(roadmap)
    );
    
    res.json(roadmap);
  } catch (error) {
    console.error(error);
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Invalid request data', details: error.errors });
    } else {
      res.status(500).json({ error: 'Failed to generate roadmap' });
    }
  }
});

// Get roadmap endpoint
app.get('/roadmap', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const roadmap = await supabaseService.getRoadmap(userId);
    
    if (!roadmap) {
      res.status(404).json({ error: 'Roadmap not found' });
      return;
    }
    
    res.json(roadmap);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch roadmap' });
  }
});

// Mood journaling and analysis endpoint
app.post('/mood-journal', authMiddleware, async (req, res) => {
  try {
    const { notes, mood } = moodJournalSchema.parse(req.body);
    const userId = req.user.id;
    
    // If mood is not provided, analyze the journal entry to determine mood
    let detectedMood = mood;
    if (!detectedMood && notes) {
      detectedMood = await aiService.analyzeMood(notes);
      
      // Log AI usage
      await supabaseService.logAiUsage(
        userId, 
        '/mood-journal/analyze', 
        `Journal: ${notes}`, 
        `Detected mood: ${detectedMood}`
      );
    }
    
    await supabaseService.saveMoodEntry(userId, detectedMood || 'neutral', notes);
    const trend = await supabaseService.getMoodTrend(userId);
    
    res.json({ mood: detectedMood, trend });
  } catch (error) {
    console.error(error);
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Invalid request data', details: error.errors });
    } else {
      res.status(500).json({ error: 'Failed to process mood journal entry' });
    }
  }
});

// Get mood trend endpoint
app.get('/mood-trend', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const days = parseInt(req.query.days as string) || 7;
    const trend = await supabaseService.getMoodTrend(userId, days);
    res.json(trend);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch mood trend' });
  }
});

// Photo verification endpoint
app.post('/verify-photo', authMiddleware, upload.single('photo'), async (req, res) => {
  try {
    if (!req.file) {
      res.status(400).json({ error: 'No photo uploaded' });
      return;
    }

    const userId = req.user.id;
    const questId = req.body.questId;
    
    if (!userId || !questId) {
      res.status(400).json({ error: 'Missing userId or questId' });
      return;
    }

    // For image verification, we need access to quest details
    const questData = await supabaseService.getActiveQuests(userId);
    const quest = questData?.find(q => q.id === questId);
    
    if (!quest) {
      res.status(404).json({ error: 'Quest not found' });
      return;
    }

    const imageBuffer = req.file.buffer;
    const imageUrl = `data:${req.file.mimetype};base64,${imageBuffer.toString('base64')}`;
    
    // In a real implementation, you might want to store the image first, then get a URL
    const isVerified = await aiService.verifyPhoto(imageUrl, questId, quest.title, quest.description);
    
    // Update the quest status based on verification result
    await supabaseService.updateVerificationStatus(userId, questId, isVerified);
    
    // If verified, update user XP (in a real app, this might be a transaction)
    if (isVerified && req.userContext?.profile) {
      const currentXp = req.userContext.profile.xp || 0;
      await supabase
        .from('profiles')
        .update({ xp: currentXp + (quest.xp || 10) })
        .eq('id', userId);
    }
    
    res.json({ status: isVerified ? 'verified' : 'invalid' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to verify photo' });
  }
});

// Get user context for AI personalization
app.get('/coach/context', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const context = await supabaseService.getUserContext(userId);
    res.json(context);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch user context' });
  }
});

// Quest completion endpoint (without photo)
app.post('/complete-quest', authMiddleware, async (req, res) => {
  try {
    const { questId } = questCompletionSchema.parse(req.body);
    const userId = req.user.id;
    
    // Complete the quest
    const { error } = await supabaseService.completeQuest(userId, questId);
    
    if (error) {
      res.status(400).json({ error: 'Failed to complete quest' });
      return;
    }
    
    // Get the quest details to award XP
    const questData = await supabaseService.getCompletedQuests(userId);
    const quest = questData?.find(q => q.id === questId);
    
    if (quest && req.userContext?.profile) {
      const currentXp = req.userContext.profile.xp || 0;
      await supabase
        .from('profiles')
        .update({ xp: currentXp + (quest.xp || 10) })
        .eq('id', userId);
    }
    
    res.json({ success: true, message: 'Quest completed successfully' });
  } catch (error) {
    console.error(error);
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Invalid request data', details: error.errors });
    } else {
      res.status(500).json({ error: 'Failed to complete quest' });
    }
  }
});

app.use(errorHandler);

export const startServer = () => {
  const port = process.env.PORT || 5000;
  app.listen(port, '0.0.0.0', () => {
    console.log(`Server running on port ${port}`);
  });
};
