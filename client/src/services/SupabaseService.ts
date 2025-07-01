
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

  async saveChatHistory(userId: string, message: string, response: string, theme?: string) {
    return await this.supabase
      .from('chat_history')
      .insert({ user_id: userId, message, response, theme });
  }

  async getConversationHistory(userId: string, limit = 10) {
    const { data } = await this.supabase
      .from('chat_history')
      .select('message, response, theme, timestamp')
      .eq('user_id', userId)
      .order('timestamp', { ascending: false })
      .limit(limit);
    return data;
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
