import React, { useState, useEffect } from 'react';
import {
  UserProfile,
  ActivityEntry,
  FriendProfile,
  CommunityGoal,
  TransitStop,
  TransitRouteOption,
  LocalAlternative,
  ClimateQuest,
  MilestoneBadge,
  ActivityFeedItem,
} from './types';
import {
  INITIAL_USER,
  INITIAL_ACTIVITIES,
  INITIAL_FRIENDS,
  INITIAL_COMMUNITY_GOAL,
  INITIAL_TRANSIT_STOPS,
  CLIMATE_QUESTS,
  MILESTONE_BADGES,
  INITIAL_FEED,
  AVATAR_SARAH,
} from './data/initialData';
import { Navigation } from './components/Navigation';
import { CarbonBudgetOverview } from './components/CarbonBudgetOverview';
import { GamifiedForest } from './components/GamifiedForest';
import { TransitIntegration } from './components/TransitIntegration';
import { LocalAlternatives } from './components/LocalAlternatives';
import { SocialLeaderboard } from './components/SocialLeaderboard';
import { QuestsAndBadges } from './components/QuestsAndBadges';
import { CommunityFeed } from './components/CommunityFeed';
import { ActivityLoggerModal } from './components/ActivityLoggerModal';
import { JavaCodeViewer } from './components/JavaCodeViewer';
import { CheckCircle2, Globe2, Sparkles } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [user, setUser] = useState<UserProfile>(INITIAL_USER);
  const [activities, setActivities] = useState<ActivityEntry[]>(INITIAL_ACTIVITIES);
  const [friends, setFriends] = useState<FriendProfile[]>(INITIAL_FRIENDS);
  const [communityGoal, setCommunityGoal] = useState<CommunityGoal>(INITIAL_COMMUNITY_GOAL);
  const [transitStops] = useState<TransitStop[]>(INITIAL_TRANSIT_STOPS);
  const [quests, setQuests] = useState<ClimateQuest[]>(CLIMATE_QUESTS);
  const [badges, setBadges] = useState<MilestoneBadge[]>(MILESTONE_BADGES);
  const [feedItems, setFeedItems] = useState<ActivityFeedItem[]>(INITIAL_FEED);
  const [isLoggerOpen, setIsLoggerOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync with SQL backend on mount
  useEffect(() => {
    fetch('/api/user')
      .then((res) => (res.ok ? res.json() : null))
      .then((sqlUser) => {
        if (sqlUser) {
          setUser((prev) => ({
            ...prev,
            id: String(sqlUser.id),
            name: sqlUser.name,
            handle: sqlUser.handle,
            neighborhood: sqlUser.neighborhood,
            level: sqlUser.level,
            levelTitle: sqlUser.levelTitle,
            xp: sqlUser.xp,
            nextLevelXp: sqlUser.nextLevelXp,
            streakDays: sqlUser.streakDays,
            totalSavedKg: sqlUser.totalSavedKg,
            totalEmittedKg: sqlUser.totalEmittedKg,
            dailyBudgetCappedKg: sqlUser.dailyBudgetCappedKg,
            todayEmittedKg: sqlUser.todayEmittedKg,
            todaySavedKg: sqlUser.todaySavedKg,
          }));
        }
      })
      .catch(() => {});

    fetch('/api/activities')
      .then((res) => (res.ok ? res.json() : null))
      .then((sqlActivities) => {
        if (Array.isArray(sqlActivities) && sqlActivities.length > 0) {
          const mapped: ActivityEntry[] = sqlActivities.map((a: any) => ({
            id: `act-${a.id}`,
            category: a.category,
            title: a.title,
            description: a.description,
            date: a.createdAt ? new Date(a.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Today',
            emittedKg: a.emittedKg,
            baselineKg: a.baselineKg,
            savedKg: a.savedKg,
            xpEarned: a.xpEarned,
            mode: a.mode,
            distanceKm: a.distanceKm,
          }));
          setActivities(mapped);
        }
      })
      .catch(() => {});
  }, []);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Check and unlock badges based on updated stats
  const checkBadgeUnlocks = (newTotalSaved: number, updatedBadges: MilestoneBadge[]) => {
    return updatedBadges.map((b) => {
      if (b.id === 'badge-century' && newTotalSaved >= 100 && !b.isUnlocked) {
        showToast('Achievement Unlocked: 100 kg Carbon Crusher Badge!');
        return { ...b, isUnlocked: true, unlockedAt: 'Just now' };
      }
      return b;
    });
  };

  // Add new activity (via modal or quick triggers)
  const handleAddActivity = (newActivityData: Omit<ActivityEntry, 'id' | 'date'>) => {
    const newEntry: ActivityEntry = {
      ...newActivityData,
      id: `act-${Date.now()}`,
      date: 'Just now',
    };

    setActivities((prev) => [newEntry, ...prev]);

    // Update user stats
    const updatedTotalSaved = Number((user.totalSavedKg + newEntry.savedKg).toFixed(1));
    const updatedTodaySaved = Number((user.todaySavedKg + newEntry.savedKg).toFixed(1));
    const updatedTodayEmitted = Number((user.todayEmittedKg + newEntry.emittedKg).toFixed(2));
    const newXp = user.xp + newEntry.xpEarned;

    let newLevel = user.level;
    let newLevelTitle = user.levelTitle;
    let nextLvlXp = user.nextLevelXp;

    if (newXp >= nextLvlXp) {
      newLevel += 1;
      nextLvlXp += 800;
      newLevelTitle =
        newLevel === 5
          ? 'Bicycle Ambassador'
          : newLevel === 6
          ? 'Urban Rewilding Leader'
          : 'Canopy Guardian';
      showToast(`Level Up! You reached Level ${newLevel}: ${newLevelTitle}!`);
    }

    setUser((prev) => ({
      ...prev,
      totalSavedKg: updatedTotalSaved,
      todaySavedKg: updatedTodaySaved,
      todayEmittedKg: updatedTodayEmitted,
      xp: newXp,
      level: newLevel,
      levelTitle: newLevelTitle,
      nextLevelXp: nextLvlXp,
    }));

    // Update Community 10-Ton Drop Goal
    setCommunityGoal((prev) => ({
      ...prev,
      currentKg: Math.min(prev.targetKg, Math.round(prev.currentKg + newEntry.savedKg)),
    }));

    // Update badges
    setBadges((prevBadges) => checkBadgeUnlocks(updatedTotalSaved, prevBadges));

    // Update quests if matching category
    setQuests((prevQuests) =>
      prevQuests.map((q) => {
        if (q.category === newEntry.category && q.currentCount < q.targetCount) {
          return { ...q, currentCount: q.currentCount + 1 };
        }
        return q;
      })
    );

    // Broadcast to community feed
    const newFeedItem: ActivityFeedItem = {
      id: `feed-${Date.now()}`,
      userName: user.name,
      userAvatar: user.avatarUrl,
      neighborhood: user.neighborhood,
      actionTitle: `${newEntry.title} (-${newEntry.savedKg.toFixed(1)} kg CO₂e)`,
      savedKg: newEntry.savedKg,
      timestamp: 'Just now',
      reactions: [
        { type: 'clap', count: 1, userReacted: true },
        { type: 'seed', count: 1, userReacted: false },
      ],
    };
    setFeedItems((prev) => [newFeedItem, ...prev]);

    // Persist to Cloud SQL backend
    fetch('/api/activities', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newEntry),
    }).catch((err) => console.error('Error saving to SQL backend:', err));

    showToast(`Logged! +${newEntry.savedKg.toFixed(1)} kg CO₂e saved (+${newEntry.xpEarned} XP)`);
  };

  // Delete activity
  const handleDeleteActivity = (id: string) => {
    const act = activities.find((a) => a.id === id);
    if (!act) return;
    setActivities((prev) => prev.filter((a) => a.id !== id));
    setUser((prev) => ({
      ...prev,
      totalSavedKg: Number(Math.max(0, prev.totalSavedKg - act.savedKg).toFixed(1)),
      todaySavedKg: Number(Math.max(0, prev.todaySavedKg - act.savedKg).toFixed(1)),
      todayEmittedKg: Number(Math.max(0, prev.todayEmittedKg - act.emittedKg).toFixed(2)),
    }));
    showToast('Activity removed.');
  };

  // Direct transit trip log
  const handleLogTransitTrip = (route: TransitRouteOption) => {
    handleAddActivity({
      category: 'transit',
      title: `${route.title} (${route.distanceKm} km)`,
      description: `Avoided solo gasoline car driving via municipal ${route.mode}`,
      emittedKg: route.co2eKg,
      baselineKg: route.baselineCarCo2eKg,
      savedKg: route.savedCo2eKg,
      xpEarned: Math.max(30, Math.round(route.savedCo2eKg * 25)),
      mode: route.title,
      distanceKm: route.distanceKm,
    });
  };

  // Direct local alternative log
  const handleLogAlternativeAction = (alt: LocalAlternative) => {
    handleAddActivity({
      category: alt.category === 'repair' ? 'consumption' : 'consumption',
      title: `${alt.actionLabel} @ ${alt.name}`,
      description: `Participated in local circular network at ${alt.address}`,
      emittedKg: 0.1,
      baselineKg: 0.1 + alt.avgSavingKg,
      savedKg: alt.avgSavingKg,
      xpEarned: Math.max(40, Math.round(alt.avgSavingKg * 15)),
      mode: alt.category,
    });
  };

  // Tend biome action
  const handleTendBiome = () => {
    setUser((prev) => ({
      ...prev,
      xp: prev.xp + 25,
      streakDays: prev.streakDays + 1,
    }));
    showToast('Micro-biome tended! +25 XP and streak extended!');
  };

  // Cheer a friend
  const handleCheerFriend = (friendId: string) => {
    setFriends((prev) =>
      prev.map((f) => {
        if (f.id === friendId) {
          return {
            ...f,
            cheerCount: f.cheerCount + 1,
            hasCheeredToday: true,
          };
        }
        return f;
      })
    );
    showToast('High-five sent! Supporting collective climate action.');
  };

  // Add friend
  const handleAddFriend = (name: string, handle: string) => {
    const newFriend: FriendProfile = {
      id: `fr-${Date.now()}`,
      name,
      handle,
      avatarUrl: AVATAR_SARAH,
      neighborhood: 'District Commuter Circle',
      weeklySavedKg: 8.5,
      totalSavedKg: 24.0,
      streakDays: 3,
      level: 2,
      levelTitle: 'Green Sprout',
      topHabit: 'Bikeshare Commuter',
      lastActive: 'Just now',
      cheerCount: 1,
      hasCheeredToday: false,
    };
    setFriends((prev) => [...prev, newFriend]);
    showToast(`Added ${name} to your climate circle!`);
  };

  // Claim quest
  const handleClaimQuest = (questId: string) => {
    setQuests((prev) =>
      prev.map((q) => {
        if (q.id === questId) {
          setUser((u) => ({ ...u, xp: u.xp + q.xpReward }));
          showToast(`Quest completed! Claimed +${q.xpReward} XP!`);
          return { ...q, isCompleted: true };
        }
        return q;
      })
    );
  };

  // React to feed item
  const handleFeedReact = (itemId: string, reactionType: 'clap' | 'seed' | 'heart') => {
    setFeedItems((prev) =>
      prev.map((item) => {
        if (item.id === itemId) {
          const updatedReactions = item.reactions.map((r) => {
            if (r.type === reactionType) {
              const nextReacted = !r.userReacted;
              return {
                ...r,
                count: nextReacted ? r.count + 1 : r.count - 1,
                userReacted: nextReacted,
              };
            }
            return r;
          });
          return { ...item, reactions: updatedReactions };
        }
        return item;
      })
    );
  };

  // Community post
  const handlePostUpdate = (message: string) => {
    const newPost: ActivityFeedItem = {
      id: `feed-post-${Date.now()}`,
      userName: user.name,
      userAvatar: user.avatarUrl,
      neighborhood: user.neighborhood,
      actionTitle: message,
      savedKg: 0,
      timestamp: 'Just now',
      reactions: [
        { type: 'heart', count: 1, userReacted: true },
        { type: 'clap', count: 0, userReacted: false },
      ],
    };
    setFeedItems((prev) => [newPost, ...prev]);
    showToast('Shared to community feed!');
  };

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col text-stone-900">
      {/* Navigation Top Bar */}
      <Navigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onOpenLogger={() => setIsLoggerOpen(true)}
        streakDays={user.streakDays}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-stone-900 text-white px-4 py-3 rounded-xl shadow-xl border border-stone-700 flex items-center gap-2 text-xs font-medium animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Container Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Tab 1: Dashboard */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {/* Gamified Living Forest Biome */}
            <GamifiedForest user={user} onTendBiome={handleTendBiome} />

            {/* Carbon Budget Overview & Activity History */}
            <CarbonBudgetOverview
              user={user}
              activities={activities}
              onDeleteActivity={handleDeleteActivity}
              onOpenLogger={() => setIsLoggerOpen(true)}
            />

            {/* Two-Column split: Community Goal summary & Community Feed */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-6">
                <SocialLeaderboard
                  user={user}
                  friends={friends}
                  communityGoal={communityGoal}
                  onCheerFriend={handleCheerFriend}
                  onAddFriend={handleAddFriend}
                />
              </div>
              <div className="lg:col-span-6">
                <CommunityFeed
                  feedItems={feedItems}
                  onReact={handleFeedReact}
                  onPostUpdate={handlePostUpdate}
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Transit Network Integration */}
        {activeTab === 'transit' && (
          <TransitIntegration
            transitStops={transitStops}
            onLogTransitTrip={handleLogTransitTrip}
          />
        )}

        {/* Tab 3: Local Alternatives & Circular Hubs */}
        {activeTab === 'alternatives' && (
          <LocalAlternatives onLogAlternativeAction={handleLogAlternativeAction} />
        )}

        {/* Tab 4: Community & Friends */}
        {activeTab === 'community' && (
          <div className="space-y-8">
            <SocialLeaderboard
              user={user}
              friends={friends}
              communityGoal={communityGoal}
              onCheerFriend={handleCheerFriend}
              onAddFriend={handleAddFriend}
            />
            <CommunityFeed
              feedItems={feedItems}
              onReact={handleFeedReact}
              onPostUpdate={handlePostUpdate}
            />
          </div>
        )}

        {/* Tab 5: Quests & Badges */}
        {activeTab === 'quests' && (
          <QuestsAndBadges
            user={user}
            quests={quests}
            badges={badges}
            onClaimQuest={handleClaimQuest}
          />
        )}

        {/* Tab 6: Java Frontend Code & Architecture */}
        {activeTab === 'java-code' && (
          <JavaCodeViewer onBackToApp={() => setActiveTab('dashboard')} />
        )}
      </main>

      {/* Activity Logger Modal */}
      <ActivityLoggerModal
        isOpen={isLoggerOpen}
        onClose={() => setIsLoggerOpen(false)}
        onAddActivity={handleAddActivity}
      />

      {/* Footer */}
      <footer className="border-t border-stone-200 bg-white py-6 text-xs text-stone-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Globe2 className="w-4 h-4 text-emerald-700" />
            <span className="font-semibold text-stone-700">Terralink</span>
            <span>·</span>
            <span>Supporting UN SDG 13 (Climate Action), SDG 11 (Sustainable Cities), SDG 12 (Responsible Consumption)</span>
          </div>
          <div className="text-stone-400 font-mono text-[11px]">
            Paris 1.5°C Carbon Budget Target: 5.0 kg CO₂e / person / day
          </div>
        </div>
      </footer>
    </div>
  );
}
