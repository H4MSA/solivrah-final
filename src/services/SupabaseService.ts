
import { createClient } from '@supabase/supabase-js';

export class SupabaseService {
  private supabase;

  constructor() {
    this.supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_KEY!
    );
  }

  async saveConversation(userId: string, message: string, reply: string) {
    return await this.supabase
      .from('conversations')
      .insert({ user_id: userId, message, reply });
  }

  async getConversationHistory(userId: string) {
    const { data } = await this.supabase
      .from('conversations')
      .select('message, reply')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(10);
    return data;
  }

  async saveRoadmap(userId: string, roadmap: any) {
    return await this.supabase
      .from('roadmaps')
      .insert({ user_id: userId, plan: roadmap });
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

  async getMoodTrend(userId: string) {
    const { data } = await this.supabase
      .from('mood_journal')
      .select('mood, created_at')
      .eq('user_id', userId)
      .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());
    return data;
  }

  async updateVerificationStatus(userId: string, questId: string, status: boolean) {
    return await this.supabase
      .from('quest_verifications')
      .upsert({ user_id: userId, quest_id: questId, verified: status });
  }
}
