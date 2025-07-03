
import { createClient } from '@supabase/supabase-js';
import { Database } from '../integrations/supabase/types';

export class SupabaseService {
  private supabase;

  constructor() {
    this.supabase = createClient<Database>(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_KEY!
    );
  }

  async saveConversation(userId: string, message: string, reply: string, mood?: string) {
    return await this.supabase
      .from('conversations')
      .insert({ user_id: userId, message, reply, mood });
  }

  async getConversationHistory(userId: string, limit = 10) {
    const { data } = await this.supabase
      .from('conversations')
      .select('message, reply, mood, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);
    return data;
  }

  async saveRoadmap(userId: string, roadmap: any) {
    const { data, error } = await this.supabase
      .from('roadmaps')
      .insert({ user_id: userId, plan: roadmap })
      .select();
    
    if (error) throw error;
    
    // After saving the roadmap, create quest entries for each day
    if (Array.isArray(roadmap)) {
      const questsToInsert = roadmap.map(item => ({
        user_id: userId,
        day: item.day,
        title: item.title,
        description: item.description,
        xp: item.xp,
        requires_photo: item.requires_photo || false,
        theme: 'roadmap',
        difficulty: item.xp <= 20 ? 'easy' : item.xp <= 35 ? 'medium' : 'hard',
        completed: false
      }));
      
      await this.supabase
        .from('quests')
        .insert(questsToInsert);
    }
    
    return data;
  }

  async getRoadmap(userId: string) {
    const { data } = await this.supabase
      .from('roadmaps')
      .select('plan')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
    return data?.plan;
  }

  async saveMoodEntry(userId: string, mood: string, notes: string) {
    return await this.supabase
      .from('mood_journal')
      .insert({ user_id: userId, mood, notes });
  }

  async getMoodTrend(userId: string, days = 7) {
    const { data } = await this.supabase
      .from('mood_journal')
      .select('mood, created_at')
      .eq('user_id', userId)
      .gte('created_at', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString());
    return data;
  }

  async updateVerificationStatus(userId: string, questId: string, status: boolean) {
    return await this.supabase
      .from('quests')
      .update({ 
        verification_status: status ? 'verified' : 'rejected',
        completed: status
      })
      .eq('id', questId)
      .eq('user_id', userId);
  }

  async getUserProfile(userId: string) {
    const { data } = await this.supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    return data;
  }

  async getUserContext(userId: string) {
    // Get all the context data needed for AI personalization
    const [profile, activeQuests, completedQuests, moodEntries, conversations] = await Promise.all([
      this.getUserProfile(userId),
      this.getActiveQuests(userId),
      this.getCompletedQuests(userId),
      this.getMoodTrend(userId, 7),
      this.getConversationHistory(userId, 5)
    ]);
    
    return {
      profile,
      activeQuests,
      completedQuests,
      moodEntries,
      conversations
    };
  }

  async getActiveQuests(userId: string) {
    const { data } = await this.supabase
      .from('quests')
      .select('*')
      .eq('user_id', userId)
      .eq('completed', false)
      .order('day', { ascending: true });
    return data;
  }

  async getCompletedQuests(userId: string) {
    const { data } = await this.supabase
      .from('quests')
      .select('*')
      .eq('user_id', userId)
      .eq('completed', true)
      .order('completed_at', { ascending: false })
      .limit(10);
    return data;
  }
  
  async saveAffirmation(userId: string, affirmation: string, theme: string) {
    return await this.supabase
      .from('affirmations')
      .insert({ user_id: userId, content: affirmation, theme });
  }

  async getLatestAffirmation(userId: string, theme?: string) {
    let query = this.supabase
      .from('affirmations')
      .select('content, theme, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1);
      
    if (theme) {
      query = query.eq('theme', theme);
    }
    
    const { data } = await query;
    return data?.[0];
  }
  
  async logAiUsage(userId: string, endpoint: string, prompt: string, response: string, error?: string) {
    return await this.supabase
      .from('ai_logs')
      .insert({ 
        user_id: userId, 
        prompt, 
        response,
        error,
        timestamp: new Date().toISOString()
      });
  }

  // Method to update quest completion status
  async completeQuest(userId: string, questId: string, completedWithPhoto: boolean = false) {
    return await this.supabase
      .from('quests')
      .update({ 
        completed: true,
        completed_at: new Date().toISOString(),
        verification_status: completedWithPhoto ? 'submitted' : 'not_required'
      })
      .eq('id', questId)
      .eq('user_id', userId);
  }
}
