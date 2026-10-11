import React from 'react';
import { ClimateQuest, MilestoneBadge, UserProfile } from '../types';
import {
  Award,
  CheckCircle2,
  Sparkles,
  Train,
  Salad,
  Flame,
  ShieldCheck,
  Wrench,
  Users,
  Lock,
} from 'lucide-react';

interface QuestsAndBadgesProps {
  user: UserProfile;
  quests: ClimateQuest[];
  badges: MilestoneBadge[];
  onClaimQuest: (questId: string) => void;
}

export const QuestsAndBadges: React.FC<QuestsAndBadgesProps> = ({
  user,
  quests,
  badges,
  onClaimQuest,
}) => {
  const getBadgeIcon = (iconName: string, isUnlocked: boolean) => {
    const iconClass = `w-6 h-6 ${isUnlocked ? 'text-emerald-700' : 'text-stone-400'}`;
    switch (iconName) {
      case 'Train':
        return <Train className={iconClass} />;
      case 'Salad':
        return <Salad className={iconClass} />;
      case 'Flame':
        return <Flame className={iconClass} />;
      case 'ShieldCheck':
        return <ShieldCheck className={iconClass} />;
      case 'Wrench':
        return <Wrench className={iconClass} />;
      case 'Users':
      default:
        return <Users className={iconClass} />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Level Status & XP Progression */}
      <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-mono font-extrabold text-xl">
              L{user.level}
            </div>
            <div>
              <div className="text-xs font-mono text-emerald-800 uppercase font-semibold">
                Climate Action Rank
              </div>
              <h2 className="text-xl font-bold text-stone-900">
                {user.levelTitle}
              </h2>
            </div>
          </div>

          <div className="text-left sm:text-right">
            <div className="text-xs text-stone-500">Current Experience</div>
            <div className="text-sm font-mono font-bold text-stone-900 tabular-nums">
              {user.xp} / {user.nextLevelXp} XP ({Math.round((user.xp / user.nextLevelXp) * 100)}%)
            </div>
          </div>
        </div>

        <div className="mt-4 space-y-2">
          <div className="w-full bg-stone-100 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-emerald-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, (user.xp / user.nextLevelXp) * 100)}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-stone-500">
            <span>Level {user.level}: {user.levelTitle}</span>
            <span>Next: Level {user.level + 1} Biome Archon</span>
          </div>
        </div>
      </div>

      {/* Climate Quests Section */}
      <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-700" />
              Active Climate Quests & Quotas
            </h2>
            <p className="text-xs text-stone-500">
              Complete weekly targets to earn XP and level up your living canopy
            </p>
          </div>
          <span className="text-xs font-mono text-stone-600 bg-stone-100 px-2.5 py-1 rounded">
            Resets every Monday
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quests.map((q) => {
            const isReadyToClaim = q.currentCount >= q.targetCount && !q.isCompleted;

            return (
              <div
                key={q.id}
                className={`p-4 rounded-xl border flex flex-col justify-between ${
                  q.isCompleted
                    ? 'bg-emerald-50/50 border-emerald-200'
                    : isReadyToClaim
                    ? 'bg-amber-50/50 border-amber-300 ring-2 ring-amber-400/20'
                    : 'bg-stone-50/70 border-stone-200'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
                    <span className="font-mono uppercase font-semibold text-[10px]">
                      {q.period} quest
                    </span>
                    <span className="font-mono text-amber-700 font-bold">
                      +{q.xpReward} XP
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-stone-900 mb-1">
                    {q.title}
                  </h3>
                  <p className="text-xs text-stone-600 mb-3">
                    {q.description}
                  </p>
                </div>

                <div className="space-y-2 pt-2 border-t border-stone-200/60">
                  <div className="flex justify-between text-xs">
                    <span className="text-stone-500">Progress</span>
                    <span className="font-mono font-bold text-stone-800">
                      {q.currentCount} / {q.targetCount}
                    </span>
                  </div>

                  <div className="w-full bg-stone-200 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-emerald-600 h-full rounded-full transition-all"
                      style={{
                        width: `${Math.min(100, (q.currentCount / q.targetCount) * 100)}%`,
                      }}
                    />
                  </div>

                  {q.isCompleted ? (
                    <div className="text-xs font-semibold text-emerald-800 flex items-center gap-1 pt-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Completed!</span>
                    </div>
                  ) : isReadyToClaim ? (
                    <button
                      onClick={() => onClaimQuest(q.id)}
                      className="w-full py-1.5 px-3 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold shadow-xs cursor-pointer"
                    >
                      Claim +{q.xpReward} XP!
                    </button>
                  ) : (
                    <div className="text-[11px] text-stone-500 pt-1">
                      Avoids ~{q.co2eSavingEstimateKg} kg CO₂e on completion
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Milestone Badges Gallery */}
      <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-xs space-y-4">
        <div>
          <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
            <Award className="w-4 h-4 text-emerald-700" />
            Milestone Badges & Verified Achievements
          </h2>
          <p className="text-xs text-stone-500">
            Recognizing measurable lifestyle shifts in urban transit, circular consumption, and community action
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {badges.map((badge) => (
            <div
              key={badge.id}
              className={`p-4 rounded-xl border flex items-start gap-3 transition-colors ${
                badge.isUnlocked
                  ? 'bg-white border-emerald-200 shadow-xs'
                  : 'bg-stone-50 border-stone-200 opacity-60'
              }`}
            >
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                  badge.isUnlocked
                    ? 'bg-emerald-100/70 border border-emerald-200'
                    : 'bg-stone-200 border border-stone-300'
                }`}
              >
                {getBadgeIcon(badge.iconName, badge.isUnlocked)}
              </div>

              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <h4 className="text-xs font-bold text-stone-900 truncate">
                    {badge.title}
                  </h4>
                  {!badge.isUnlocked && <Lock className="w-3 h-3 text-stone-400 shrink-0" />}
                </div>

                <p className="text-[11px] text-stone-600 leading-tight">
                  {badge.description}
                </p>

                <div className="text-[10px] font-mono text-stone-400 pt-1">
                  {badge.isUnlocked
                    ? `Unlocked on ${badge.unlockedAt}`
                    : `Requirement: ${badge.requirement}`}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
