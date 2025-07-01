
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

// Extended Request interface
interface AuthenticatedRequest extends express.Request {
  user?: any;
  userContext?: any;
  file?: Express.Multer.File;
}

// Middleware to verify authorization token
const authMiddleware = async (req: AuthenticatedRequest, res: express.Response, next: express.NextFunction) => {
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
const contextMiddleware = async (req: AuthenticatedRequest, res: express.Response, next: express.NextFunction) => {
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

const moodJournalSchema = z.object({
  mood: z.string().optional(),
  notes: z.string()
});

const questCompletionSchema = z.object({
  questId: z.string()
});

// Error handler middleware
const errorHandler = (err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
};

// ============= API ENDPOINTS =============

// Daily Affirmation endpoint
app.get('/affirmation', authMiddleware, async (req: AuthenticatedRequest, res) => {
  try {
    const theme = req.query.theme as string || 'general';
    const userId = req.user.id;
    
    // Generate a new affirmation
    const username = req.userContext?.profile?.username;
    const affirmation = await aiService.generateDailyAffirmation(theme, username);
    
    res.json({ affirmation });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to generate affirmation' });
  }
});

// Coaching assistant endpoint
app.post('/assistant', authMiddleware, contextMiddleware, async (req: AuthenticatedRequest, res) => {
  try {
    const { message, mood } = assistantSchema.parse(req.body);
    const userId = req.user.id;
    
    const history = await supabaseService.getConversationHistory(userId);
    const context = history?.map(h => `${h.message}: ${h.response}`).join('\n') || '';
    
    const reply = await aiService.generateCoachingReply(
      message, 
      mood || 'neutral', 
      context,
      req.userContext?.profile
    );
    
    await supabaseService.saveChatHistory(userId, message, reply, mood);
    
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
app.post('/chatbot', authMiddleware, contextMiddleware, async (req: AuthenticatedRequest, res) => {
  try {
    const { message, personalitySettings } = chatbotSchema.parse(req.body);
    const userId = req.user.id;
    
    const history = await supabaseService.getConversationHistory(userId);
    const historyText = history?.map(h => `${h.message}: ${h.response}`).join('\n') || '';
    
    const reply = await aiService.generateChatbotReply(
      message, 
      personalitySettings, 
      historyText,
      req.userContext?.profile
    );
    
    await supabaseService.saveChatHistory(userId, message, reply);
    
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

// Mood journaling and analysis endpoint
app.post('/mood-journal', authMiddleware, async (req: AuthenticatedRequest, res) => {
  try {
    const { notes, mood } = moodJournalSchema.parse(req.body);
    const userId = req.user.id;
    
    // If mood is not provided, analyze the journal entry to determine mood
    let detectedMood = mood;
    if (!detectedMood && notes) {
      detectedMood = await aiService.analyzeMood(notes);
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
app.get('/mood-trend', authMiddleware, async (req: AuthenticatedRequest, res) => {
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

// Quest completion endpoint (without photo)
app.post('/complete-quest', authMiddleware, async (req: AuthenticatedRequest, res) => {
  try {
    const { questId } = questCompletionSchema.parse(req.body);
    const userId = req.user.id;
    
    // Complete the quest
    const { error } = await supabaseService.completeQuest(userId, questId);
    
    if (error) {
      res.status(400).json({ error: 'Failed to complete quest' });
      return;
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
  const port = parseInt(process.env.PORT || '5000');
  app.listen(port, '0.0.0.0', () => {
    console.log(`Server running on port ${port}`);
  });
};
