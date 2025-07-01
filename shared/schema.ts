import { pgTable, text, serial, integer, boolean, timestamp, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Profiles table to match Supabase structure
export const profiles = pgTable("profiles", {
  id: uuid("id").primaryKey(),
  username: text("username"),
  avatarUrl: text("avatar_url"),
  theme: text("theme"),
  streak: integer("streak").default(0),
  xp: integer("xp").default(0),
  role: text("role"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Survey responses table
export const surveyResponses = pgTable("survey_responses", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull(),
  goal: text("goal").notNull(),
  biggestStruggle: text("biggest_struggle").notNull(),
  theme: text("theme").notNull(),
  dailyCommitment: integer("daily_commitment").default(15),
  createdAt: timestamp("created_at").defaultNow(),
});

// Quests table
export const quests = pgTable("quests", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull(),
  day: integer("day").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  theme: text("theme").notNull(),
  xp: integer("xp").default(50),
  difficulty: text("difficulty").default("medium"),
  requiresPhoto: boolean("requires_photo").default(false),
  completed: boolean("completed").default(false),
  verificationStatus: text("verification_status"),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Chat history table
export const chatHistory = pgTable("chat_history", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull(),
  message: text("message").notNull(),
  response: text("response").notNull(),
  theme: text("theme"),
  timestamp: timestamp("timestamp").defaultNow(),
});

// Mood journal table
export const moodJournal = pgTable("mood_journal", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull(),
  mood: text("mood").notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Community posts table
export const communityPosts = pgTable("community_posts", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull(),
  content: text("content").notNull(),
  imageUrl: text("image_url"),
  likesCount: integer("likes_count").default(0),
  commentsCount: integer("comments_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Insert schemas
export const insertProfileSchema = createInsertSchema(profiles).pick({
  id: true,
  username: true,
  avatarUrl: true,
  theme: true,
  streak: true,
  xp: true,
  role: true,
});

export const insertSurveyResponseSchema = createInsertSchema(surveyResponses).pick({
  userId: true,
  goal: true,
  biggestStruggle: true,
  theme: true,
  dailyCommitment: true,
});

export const insertQuestSchema = createInsertSchema(quests).pick({
  userId: true,
  day: true,
  title: true,
  description: true,
  theme: true,
  xp: true,
  difficulty: true,
  requiresPhoto: true,
});

export const insertChatHistorySchema = createInsertSchema(chatHistory).pick({
  userId: true,
  message: true,
  response: true,
  theme: true,
});

export const insertMoodJournalSchema = createInsertSchema(moodJournal).pick({
  userId: true,
  mood: true,
  notes: true,
});

export const insertCommunityPostSchema = createInsertSchema(communityPosts).pick({
  userId: true,
  content: true,
  imageUrl: true,
});

// Types
export type Profile = typeof profiles.$inferSelect;
export type InsertProfile = z.infer<typeof insertProfileSchema>;
export type SurveyResponse = typeof surveyResponses.$inferSelect;
export type InsertSurveyResponse = z.infer<typeof insertSurveyResponseSchema>;
export type Quest = typeof quests.$inferSelect;
export type InsertQuest = z.infer<typeof insertQuestSchema>;
export type ChatHistory = typeof chatHistory.$inferSelect;
export type InsertChatHistory = z.infer<typeof insertChatHistorySchema>;
export type MoodJournal = typeof moodJournal.$inferSelect;
export type InsertMoodJournal = z.infer<typeof insertMoodJournalSchema>;
export type CommunityPost = typeof communityPosts.$inferSelect;
export type InsertCommunityPost = z.infer<typeof insertCommunityPostSchema>;

// Legacy users table (for compatibility)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
