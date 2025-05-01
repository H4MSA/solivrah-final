
// Custom type definitions for Quest-related functionality
// These types extend/complement the Supabase generated types, not replace them

export type QuestDifficulty = 'Easy' | 'Medium' | 'Hard';

export interface Quest {
  id: string;
  title: string;
  description: string;
  day: number;
  theme: string;
  completed: boolean;
  difficulty?: QuestDifficulty;
  xp: number;
  requires_photo: boolean;
  verification_status?: string;
  completed_at?: string;
  created_at?: string;
  user_id?: string;
}

export interface QuestCompleteModalProps {
  onClose: () => void;
  onComplete: (photoUrl?: string) => Promise<void>;
  questId: string;
  requiresPhoto: boolean;
}
