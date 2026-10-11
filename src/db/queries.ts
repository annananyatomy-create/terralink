import { db } from './index.ts';
import { users, activities, communityGoals, communityFeed } from './schema.ts';
import { eq, desc } from 'drizzle-orm';

export async function getUserProfile(uid: string) {
  try {
    const result = await db.select().from(users).where(eq(users.uid, uid));
    if (result.length > 0) return result[0];
    
    // Create if not exists
    const newUser = await db.insert(users).values({
      uid,
      name: 'Alex Chen',
      email: 'alex@terralink.eco',
      handle: '@alexc_climate',
      neighborhood: 'Riverside Eco-Quarter',
      avatarUrl: '/src/assets/images/avatar_friend_sarah_1791742546535.jpg',
      level: 4,
      levelTitle: 'Canopy Guardian',
      xp: 1480,
      nextLevelXp: 2000,
      streakDays: 9,
      totalSavedKg: 84.6,
      totalEmittedKg: 28.2,
      dailyBudgetCappedKg: 5.0,
      todayEmittedKg: 1.8,
      todaySavedKg: 4.4,
    }).returning();
    return newUser[0];
  } catch (error) {
    console.error('Database query getUserProfile failed:', error);
    throw new Error('Database query failed. Please try again later.', { cause: error });
  }
}

export async function getActivities(userId: number) {
  try {
    return await db.select().from(activities).where(eq(activities.userId, userId)).orderBy(desc(activities.createdAt));
  } catch (error) {
    console.error('Database query getActivities failed:', error);
    throw new Error('Database query failed. Please try again later.', { cause: error });
  }
}

export async function addActivity(entry: {
  userId: number;
  category: string;
  title: string;
  description: string;
  emittedKg: number;
  baselineKg: number;
  savedKg: number;
  xpEarned: number;
  mode?: string;
  distanceKm?: number;
}) {
  try {
    const result = await db.insert(activities).values(entry).returning();
    
    // Update user totals
    const user = await db.select().from(users).where(eq(users.id, entry.userId));
    if (user.length > 0) {
      const u = user[0];
      const newXp = u.xp + entry.xpEarned;
      const newTotalSaved = Number((u.totalSavedKg + entry.savedKg).toFixed(1));
      const newTodaySaved = Number((u.todaySavedKg + entry.savedKg).toFixed(1));
      const newTodayEmitted = Number((u.todayEmittedKg + entry.emittedKg).toFixed(2));
      let newLevel = u.level;
      let nextXp = u.nextLevelXp;
      let newTitle = u.levelTitle;

      if (newXp >= nextXp) {
        newLevel++;
        nextXp += 800;
        newTitle = `Level ${newLevel} Biome Ambassador`;
      }

      await db.update(users).set({
        xp: newXp,
        level: newLevel,
        nextLevelXp: nextXp,
        levelTitle: newTitle,
        totalSavedKg: newTotalSaved,
        todaySavedKg: newTodaySaved,
        todayEmittedKg: newTodayEmitted,
      }).where(eq(users.id, entry.userId));
    }

    return result[0];
  } catch (error) {
    console.error('Database query addActivity failed:', error);
    throw new Error('Database query failed. Please try again later.', { cause: error });
  }
}

export async function getCommunityGoals() {
  try {
    return await db.select().from(communityGoals);
  } catch (error) {
    console.error('Database query getCommunityGoals failed:', error);
    throw new Error('Database query failed. Please try again later.', { cause: error });
  }
}

export async function getCommunityFeed() {
  try {
    return await db.select().from(communityFeed).orderBy(desc(communityFeed.createdAt));
  } catch (error) {
    console.error('Database query getCommunityFeed failed:', error);
    throw new Error('Database query failed. Please try again later.', { cause: error });
  }
}
