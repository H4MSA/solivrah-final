
import { supabase } from "@/integrations/supabase/client";

// Chat and messaging services
export const createConversation = async (participant1Id: string, participant2Id: string) => {
  const { data, error } = await supabase
    .from('conversations')
    .insert({
      participant1_id: participant1Id,
      participant2_id: participant2Id,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const sendMessage = async (conversationId: string, senderId: string, content: string) => {
  const { data, error } = await supabase
    .from('messages')
    .insert({
      conversation_id: conversationId,
      sender_id: senderId,
      content,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getConversations = async (userId: string) => {
  const { data, error } = await supabase
    .from('conversations')
    .select(`
      *,
      messages (
        *
      )
    `)
    .or(`participant1_id.eq.${userId},participant2_id.eq.${userId}`)
    .order('last_message_at', { ascending: false });

  if (error) throw error;
  return data;
};

// Community services
export const createPost = async (userId: string, content: string, imageUrl?: string) => {
  const { data, error } = await supabase
    .from('community_posts')
    .insert({
      user_id: userId,
      content,
      image_url: imageUrl,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getPosts = async () => {
  const { data, error } = await supabase
    .from('community_posts')
    .select(`
      *,
      post_likes (count),
      post_comments (count)
    `)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

export const likePost = async (userId: string, postId: string) => {
  const { data, error } = await supabase
    .from('post_likes')
    .insert({
      user_id: userId,
      post_id: postId,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Quest services
export const getQuests = async (userId: string) => {
  const { data, error } = await supabase
    .from('quests')
    .select('*')
    .eq('user_id', userId)
    .order('day', { ascending: true });

  if (error) throw error;
  return data;
};

export const completeQuest = async (questId: string, photoUrl?: string) => {
  const { data, error } = await supabase
    .from('quests')
    .update({
      completed: true,
      completed_at: new Date().toISOString(),
      verification_status: photoUrl ? 'pending' : 'completed'
    })
    .eq('id', questId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Profile services
export const getProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) throw error;
  return data;
};

export const updateProfile = async (userId: string, updates: any) => {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Mood journal services
export const saveMoodEntry = async (userId: string, mood: string, notes?: string) => {
  const { data, error } = await supabase
    .from('mood_journal')
    .insert({
      user_id: userId,
      mood,
      notes,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getMoodEntries = async (userId: string) => {
  const { data, error } = await supabase
    .from('mood_journal')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};
