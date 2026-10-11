import React, { useState } from 'react';
import { FriendProfile, CommunityGoal, UserProfile } from '../types';
import {
  Users,
  Trophy,
  Flame,
  Heart,
  Share2,
  CheckCircle2,
  UserPlus,
  Shield,
  Target,
  Sparkles,
  Award,
} from 'lucide-react';

interface SocialLeaderboardProps {
  user: UserProfile;
  friends: FriendProfile[];
  communityGoal: CommunityGoal;
  onCheerFriend: (friendId: string) => void;
  onAddFriend: (name: string, handle: string) => void;
}

export const SocialLeaderboard: React.FC<SocialLeaderboardProps> = ({
  user,
  friends,
  communityGoal,
  onCheerFriend,
  onAddFriend,
}) => {
  const [timeframe, setTimeframe] = useState<'weekly' | 'all-time'>('weekly');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newFriendName, setNewFriendName] = useState('');
  const [newFriendHandle, setNewFriendHandle] = useState('');
  const [cheeredMap, setCheeredMap] = useState<Record<string, boolean>>({});

  // Merge user into leaderboard list
  const userAsFriend: FriendProfile = {
    id: user.id,
    name: user.name + ' (You)',
    handle: user.handle,
    avatarUrl: user.avatarUrl,
    neighborhood: user.neighborhood,
    weeklySavedKg: user.todaySavedKg * 4.2, // projected weekly
    totalSavedKg: user.totalSavedKg,
    streakDays: user.streakDays,
    level: user.level,
    levelTitle: user.levelTitle,
    topHabit: 'Electrified Rail & Bulk Refill',
    lastActive: 'Now',
    cheerCount: 22,
    hasCheeredToday: true,
  };

  const combinedList = [...friends, userAsFriend].sort((a, b) => {
    if (timeframe === 'weekly') {
      return b.weeklySavedKg - a.weeklySavedKg;
    }
    return b.totalSavedKg - a.totalSavedKg;
  });

  const handleCheer = (id: string) => {
    if (id === user.id) return;
    setCheeredMap((prev) => ({ ...prev, [id]: true }));
    onCheerFriend(id);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newFriendName.trim() && newFriendHandle.trim()) {
      onAddFriend(newFriendName.trim(), newFriendHandle.trim());
      setNewFriendName('');
      setNewFriendHandle('');
      setShowAddModal(false);
    }
  };

  const progressPercent = Math.min(
    100,
    Math.round((communityGoal.currentKg / communityGoal.targetKg) * 100)
  );

  const userGoalContributionPct = (
    (user.totalSavedKg / communityGoal.currentKg) *
    100
  ).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Collective Climate Challenge Banner */}
      <div className="bg-gradient-to-br from-emerald-950 via-teal-950 to-stone-900 text-white rounded-xl p-6 sm:p-8 shadow-sm border border-emerald-900">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
              <Target className="w-4 h-4" />
              <span>COLLECTIVE CLIMATE ACTION · {communityGoal.sdgGoal}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              {communityGoal.title}
            </h1>
            <p className="text-stone-300 text-sm leading-relaxed">
              {communityGoal.description} Individual actions aggregate into measurable neighborhood transformations.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/15 text-left shrink-0 min-w-[240px]">
            <div className="text-[11px] font-mono text-emerald-300 uppercase">
              Your Personal Contribution
            </div>
            <div className="text-2xl font-extrabold font-mono text-white mt-0.5">
              {user.totalSavedKg.toFixed(1)} <span className="text-xs font-normal text-stone-300">kg CO₂e</span>
            </div>
            <div className="text-xs text-emerald-200 mt-1">
              You've contributed <span className="font-bold">{userGoalContributionPct}%</span> of the entire community total!
            </div>
          </div>
        </div>

        {/* Collective Progress Bar */}
        <div className="mt-6 space-y-2">
          <div className="flex justify-between items-baseline text-xs">
            <span className="text-stone-300">
              Collective Total: <span className="text-white font-mono font-bold">{communityGoal.currentKg.toLocaleString()} kg</span>
            </span>
            <span className="font-mono text-emerald-300 font-bold">
              {progressPercent}% of {communityGoal.targetKg.toLocaleString()} kg target · {communityGoal.daysRemaining} days left
            </span>
          </div>

          <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden p-0.5">
            <div
              className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-700"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Milestone Unlocks */}
        <div className="mt-6 pt-5 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {communityGoal.unlockedMilestones.map((m, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-lg border text-xs transition-colors ${
                m.isReached
                  ? 'bg-emerald-900/40 border-emerald-500/40 text-emerald-100'
                  : 'bg-white/5 border-white/10 text-stone-300'
              }`}
            >
              <div className="flex items-center gap-1.5 font-bold mb-1">
                {m.isReached ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <span className="w-3.5 h-3.5 rounded-full border border-stone-400 inline-block" />
                )}
                <span className={m.isReached ? 'text-white' : 'text-stone-300'}>
                  {m.title}
                </span>
              </div>
              <p className="text-[11px] text-stone-400 leading-snug">
                {m.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Friends Leaderboard Header & Timeframe Switch */}
      <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-100">
          <div>
            <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-600" />
              Friends & Neighborhood Impact Leaderboard
            </h2>
            <p className="text-xs text-stone-500">
              Encouraging friendly climate accountability and shared responsibility
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center bg-stone-100 p-1 rounded-lg">
              <button
                onClick={() => setTimeframe('weekly')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                  timeframe === 'weekly'
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                This Week
              </button>
              <button
                onClick={() => setTimeframe('all-time')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                  timeframe === 'all-time'
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                All-Time
              </button>
            </div>

            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors cursor-pointer"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Add Friend</span>
            </button>
          </div>
        </div>

        {/* Ranked Friends List */}
        <div className="mt-4 divide-y divide-stone-100">
          {combinedList.map((friend, index) => {
            const isUser = friend.id === user.id;
            const rank = index + 1;
            const savedMetric =
              timeframe === 'weekly' ? friend.weeklySavedKg : friend.totalSavedKg;
            const hasCheered = cheeredMap[friend.id] || friend.hasCheeredToday;

            return (
              <div
                key={friend.id}
                className={`py-3.5 px-3 sm:px-4 rounded-xl flex items-center justify-between gap-3 transition-colors ${
                  isUser
                    ? 'bg-emerald-50/80 border border-emerald-200/70 my-1'
                    : 'hover:bg-stone-50'
                }`}
              >
                {/* Rank and Avatar */}
                <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                  <div
                    className={`w-6 text-center font-mono font-bold text-sm shrink-0 ${
                      rank === 1
                        ? 'text-amber-600'
                        : rank === 2
                        ? 'text-stone-500'
                        : rank === 3
                        ? 'text-amber-800'
                        : 'text-stone-400'
                    }`}
                  >
                    #{rank}
                  </div>

                  <div className="relative shrink-0">
                    <img
                      src={friend.avatarUrl}
                      alt={friend.name}
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 rounded-full object-cover border border-stone-200"
                    />
                    <div className="absolute -bottom-1 -right-1 bg-stone-900 text-white text-[9px] font-mono px-1 rounded-full">
                      L{friend.level}
                    </div>
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-bold text-stone-900 truncate">
                        {friend.name}
                      </span>
                      <span className="text-xs text-stone-400 font-mono hidden sm:inline">
                        {friend.handle}
                      </span>
                      {isUser && (
                        <span className="text-[10px] font-bold text-emerald-800 bg-emerald-200/80 px-1.5 py-0.5 rounded">
                          You
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-stone-500 truncate flex items-center gap-2">
                      <span>{friend.neighborhood}</span>
                      <span>·</span>
                      <span className="text-emerald-700 font-medium">
                        {friend.topHabit}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Score & Social Cheer */}
                <div className="flex items-center gap-3 sm:gap-6 shrink-0 text-right">
                  <div className="flex items-center gap-1.5 text-xs text-amber-700 bg-amber-50 px-2 py-1 rounded border border-amber-200/60 hidden sm:flex">
                    <Flame className="w-3.5 h-3.5 text-amber-600" />
                    <span className="font-mono font-bold">{friend.streakDays}d</span>
                  </div>

                  <div>
                    <div className="text-base font-extrabold font-mono tabular-nums text-stone-900">
                      +{savedMetric.toFixed(1)}{' '}
                      <span className="text-xs font-normal text-stone-500">kg</span>
                    </div>
                    <div className="text-[10px] text-stone-400">
                      {timeframe === 'weekly' ? 'Avoided this week' : 'All-time avoided'}
                    </div>
                  </div>

                  {!isUser ? (
                    <button
                      onClick={() => handleCheer(friend.id)}
                      disabled={hasCheered}
                      className={`p-2 rounded-lg text-xs font-medium transition-colors cursor-pointer flex items-center gap-1 ${
                        hasCheered
                          ? 'bg-emerald-100 text-emerald-800 cursor-default'
                          : 'bg-stone-100 hover:bg-emerald-100 hover:text-emerald-800 text-stone-600'
                      }`}
                      title={hasCheered ? 'Cheered today!' : 'Cheer this friend'}
                    >
                      <Heart
                        className={`w-4 h-4 ${
                          hasCheered ? 'fill-emerald-600 text-emerald-600' : ''
                        }`}
                      />
                      <span className="font-mono text-xs tabular-nums">
                        {friend.cheerCount + (hasCheered && !friend.hasCheeredToday ? 1 : 0)}
                      </span>
                    </button>
                  ) : (
                    <div className="w-12 text-center text-xs text-stone-400 font-mono">
                      (You)
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Friend Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-emerald-700" />
                Add a Friend to Your Climate Circle
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-stone-400 hover:text-stone-700 font-bold px-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Friend's Full Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Jordan Rivera"
                  value={newFriendName}
                  onChange={(e) => setNewFriendName(e.target.value)}
                  className="w-full text-xs bg-stone-50 border border-stone-200 rounded-lg p-2.5 text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Climate Handle or Email
                </label>
                <input
                  type="text"
                  placeholder="@jordan_climate"
                  value={newFriendHandle}
                  onChange={(e) => setNewFriendHandle(e.target.value)}
                  className="w-full text-xs bg-stone-50 border border-stone-200 rounded-lg p-2.5 text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                  required
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-2 text-xs font-medium text-stone-600 hover:bg-stone-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg"
                >
                  Send Invitation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
