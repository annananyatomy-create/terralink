import { relations } from 'drizzle-orm';
import { doublePrecision, integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(), // Firebase Auth UID
  name: text('name').notNull(),
  email: text('email').notNull(),
  handle: text('handle').notNull(),
  neighborhood: text('neighborhood').notNull(),
  avatarUrl: text('avatar_url').notNull(),
  level: integer('level').default(4).notNull(),
  levelTitle: text('level_title').default('Canopy Guardian').notNull(),
  xp: integer('xp').default(1480).notNull(),
  nextLevelXp: integer('next_level_xp').default(2000).notNull(),
  streakDays: integer('streak_days').default(9).notNull(),
  totalSavedKg: doublePrecision('total_saved_kg').default(84.6).notNull(),
  totalEmittedKg: doublePrecision('total_emitted_kg').default(28.2).notNull(),
  dailyBudgetCappedKg: doublePrecision('daily_budget_capped_kg').default(5.0).notNull(),
  todayEmittedKg: doublePrecision('today_emitted_kg').default(1.8).notNull(),
  todaySavedKg: doublePrecision('today_saved_kg').default(4.4).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const activities = pgTable('activities', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull(),
  category: text('category').notNull(), // transit | diet | home | consumption
  title: text('title').notNull(),
  description: text('description').notNull(),
  emittedKg: doublePrecision('emitted_kg').notNull(),
  baselineKg: doublePrecision('baseline_kg').notNull(),
  savedKg: doublePrecision('saved_kg').notNull(),
  xpEarned: integer('xp_earned').notNull(),
  mode: text('mode'),
  distanceKm: doublePrecision('distance_km'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const communityGoals = pgTable('community_goals', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  sdgGoal: text('sdg_goal').notNull(),
  targetKg: doublePrecision('target_kg').notNull(),
  currentKg: doublePrecision('current_kg').notNull(),
  daysRemaining: integer('days_remaining').notNull(),
  participantsCount: integer('participants_count').notNull(),
  description: text('description').notNull(),
});

export const localAlternatives = pgTable('local_alternatives', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  category: text('category').notNull(),
  neighborhood: text('neighborhood').notNull(),
  address: text('address').notNull(),
  distanceKm: doublePrecision('distance_km').notNull(),
  rating: doublePrecision('rating').notNull(),
  tags: text('tags').notNull(),
  description: text('description').notNull(),
  avgSavingKg: doublePrecision('avg_saving_kg').notNull(),
  actionLabel: text('action_label').notNull(),
  coordX: integer('coord_x').notNull(),
  coordY: integer('coord_y').notNull(),
});

export const communityFeed = pgTable('community_feed', {
  id: serial('id').primaryKey(),
  userName: text('user_name').notNull(),
  userAvatar: text('user_avatar').notNull(),
  neighborhood: text('neighborhood').notNull(),
  actionTitle: text('action_title').notNull(),
  savedKg: doublePrecision('saved_kg').notNull(),
  clapCount: integer('clap_count').default(0).notNull(),
  seedCount: integer('seed_count').default(0).notNull(),
  heartCount: integer('heart_count').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

// Relationships
export const usersRelations = relations(users, ({ many }) => ({
  activities: many(activities),
}));

export const activitiesRelations = relations(activities, ({ one }) => ({
  user: one(users, {
    fields: [activities.userId],
    references: [users.id],
  }),
}));
