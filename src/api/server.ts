
import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { z } from 'zod';
import { AIService } from '../services/AIService';
import { SupabaseService } from '../services/SupabaseService';

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

app.use(cors());
app.use(express.json());

const aiService = new AIService();
const supabaseService = new SupabaseService();

// Validation schemas
const assistantSchema = z.object({
  userId: z.string(),
  message: z.string(),
  mood: z.string()
});

const chatbotSchema = z.object({
  userId: z.string(),
  message: z.string(),
  personalitySettings: z.enum(['playful', 'professional'])
});

const roadmapSchema = z.object({
  userId: z.string(),
  goals: z.string(),
  struggles: z.string(),
  dailyTime: z.number().min(0)
});

const moodJournalSchema = z.object({
  userId: z.string(),
  mood: z.string(),
  notes: z.string()
});

// Error handler middleware
const errorHandler = (err: any, req: any, res: any, next: any) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
};

app.post('/assistant', async (req, res) => {
  try {
    const { userId, message, mood } = assistantSchema.parse(req.body);
    const history = await supabaseService.getConversationHistory(userId);
    const context = history?.map(h => `${h.message}: ${h.reply}`).join('\n') || '';
    
    const reply = await aiService.generateCoachingReply(message, mood, context);
    await supabaseService.saveConversation(userId, message, reply);
    
    res.json({ reply, updatedContext: context });
  } catch (error) {
    res.status(400).json({ error: 'Invalid request data' });
  }
});

app.post('/chatbot', async (req, res) => {
  try {
    const { userId, message, personalitySettings } = chatbotSchema.parse(req.body);
    const history = await supabaseService.getConversationHistory(userId);
    const historyText = history?.map(h => `${h.message}: ${h.reply}`).join('\n') || '';
    
    const reply = await aiService.generateChatbotReply(message, personalitySettings, historyText);
    await supabaseService.saveConversation(userId, message, reply);
    
    res.json({ reply });
  } catch (error) {
    res.status(400).json({ error: 'Invalid request data' });
  }
});

app.post('/roadmap', async (req, res) => {
  try {
    const { userId, goals, struggles, dailyTime } = roadmapSchema.parse(req.body);
    const roadmap = await aiService.generateRoadmap(goals, struggles, dailyTime);
    await supabaseService.saveRoadmap(userId, roadmap);
    res.json(roadmap);
  } catch (error) {
    res.status(400).json({ error: 'Invalid request data' });
  }
});

app.get('/roadmap/:userId', async (req, res) => {
  try {
    const roadmap = await supabaseService.getRoadmap(req.params.userId);
    if (!roadmap) {
      res.status(404).json({ error: 'Roadmap not found' });
      return;
    }
    res.json(roadmap);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch roadmap' });
  }
});

app.post('/mood-journal', async (req, res) => {
  try {
    const { userId, mood, notes } = moodJournalSchema.parse(req.body);
    await supabaseService.saveMoodEntry(userId, mood, notes);
    const trend = await supabaseService.getMoodTrend(userId);
    res.json({ trend });
  } catch (error) {
    res.status(400).json({ error: 'Invalid request data' });
  }
});

app.post('/verify-photo', upload.single('photo'), async (req, res) => {
  try {
    if (!req.file) {
      res.status(400).json({ error: 'No photo uploaded' });
      return;
    }

    const userId = req.body.userId;
    const questId = req.body.questId;
    
    if (!userId || !questId) {
      res.status(400).json({ error: 'Missing userId or questId' });
      return;
    }

    const imageBuffer = req.file.buffer;
    const imageUrl = `data:${req.file.mimetype};base64,${imageBuffer.toString('base64')}`;
    
    const isVerified = await aiService.verifyPhoto(imageUrl, questId);
    await supabaseService.updateVerificationStatus(userId, questId, isVerified);
    
    res.json({ status: isVerified ? 'verified' : 'invalid' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to verify photo' });
  }
});

app.use(errorHandler);

export const startServer = () => {
  const port = process.env.PORT || 5000;
  app.listen(port, '0.0.0.0', () => {
    console.log(`Server running on port ${port}`);
  });
};
