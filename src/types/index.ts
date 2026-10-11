export type CategoryType = 'transit' | 'diet' | 'home' | 'consumption';

export interface ActivityEntry {
  id: string;
  category: CategoryType;
  title: string;
  description: string;
  date: string;
  emittedKg: number;
  baselineKg: number;
  savedKg: number;
  xpEarned: number;
  mode?: string;
  distanceKm?: number;
}

export interface EmissionFactor {
  mode: string;
  category: CategoryType;
  gPerKmOrUnit: number; // in grams CO2e
  baselineMode: string;
  baselineGPerKm: number;
  unitLabel: string;
}

export interface UserProfile {
  id: string;
  name: string;
  handle: string;
  neighborhood: string;
  avatarUrl: string;
  level: number;
  levelTitle: string;
  xp: number;
  nextLevelXp: number;
  streakDays: number;
  totalSavedKg: number;
  totalEmittedKg: number;
  dailyBudgetCappedKg: number; // Paris Agreement target: ~5.0 kg/day
  todayEmittedKg: number;
  todaySavedKg: number;
  unlockedBadgeIds: string[];
}

export interface FriendProfile {
  id: string;
  name: string;
  handle: string;
  avatarUrl: string;
  neighborhood: string;
  weeklySavedKg: number;
  totalSavedKg: number;
  streakDays: number;
  level: number;
  levelTitle: string;
  topHabit: string;
  lastActive: string;
  cheerCount: number;
  hasCheeredToday: boolean;
}

export interface CommunityGoal {
  id: string;
  title: string;
  sdgGoal: string;
  targetKg: number;
  currentKg: number;
  daysRemaining: number;
  participantsCount: number;
  description: string;
  unlockedMilestones: {
    thresholdKg: number;
    title: string;
    description: string;
    isReached: boolean;
  }[];
}

export interface TransitStop {
  id: string;
  name: string;
  code: string;
  lines: string[];
  distanceMeters: number;
  nextDepartures: {
    line: string;
    destination: string;
    timeMinutes: number;
    vehicleType: 'metro' | 'bus' | 'shuttle';
    crowding: 'Low' | 'Moderate' | 'High';
  }[];
}

export interface TransitRouteOption {
  id: string;
  mode: 'transit' | 'bike' | 'walk' | 'car';
  title: string;
  routeSummary: string;
  durationMinutes: number;
  distanceKm: number;
  costUsd: number;
  co2eKg: number;
  baselineCarCo2eKg: number;
  savedCo2eKg: number;
  caloriesBurned?: number;
  ecoScore: 'A+' | 'A' | 'B' | 'D';
}

export interface LocalAlternative {
  id: string;
  name: string;
  category: 'refill' | 'repair' | 'farmers_market' | 'cycling' | 'compost';
  neighborhood: string;
  address: string;
  distanceKm: number;
  rating: number;
  tags: string[];
  description: string;
  avgSavingKg: number;
  actionLabel: string;
  coords: { x: number; y: number }; // normalized 0-100 for interactive map
}

export interface EcoSwap {
  id: string;
  conventional: string;
  sustainable: string;
  co2eDifferenceKg: number;
  moneySavedUsd: number;
  category: CategoryType;
  practicalTip: string;
}

export interface ClimateQuest {
  id: string;
  title: string;
  description: string;
  category: CategoryType;
  targetCount: number;
  currentCount: number;
  xpReward: number;
  co2eSavingEstimateKg: number;
  isCompleted: boolean;
  period: 'daily' | 'weekly';
}

export interface MilestoneBadge {
  id: string;
  title: string;
  description: string;
  iconName: string;
  category: CategoryType | 'community';
  requirement: string;
  unlockedAt?: string;
  isUnlocked: boolean;
}

export interface ActivityFeedItem {
  id: string;
  userName: string;
  userAvatar: string;
  neighborhood: string;
  actionTitle: string;
  savedKg: number;
  timestamp: string;
  reactions: {
    type: 'clap' | 'seed' | 'heart';
    count: number;
    userReacted: boolean;
  }[];
}
