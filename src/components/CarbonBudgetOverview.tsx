import React from 'react';
import { UserProfile, ActivityEntry } from '../types';
import {
  TrendingDown,
  Globe2,
  Bike,
  Utensils,
  Home,
  ShoppingBag,
  Info,
  Calendar,
  Trash2,
} from 'lucide-react';

interface CarbonBudgetOverviewProps {
  user: UserProfile;
  activities: ActivityEntry[];
  onDeleteActivity: (id: string) => void;
  onOpenLogger: () => void;
}

export const CarbonBudgetOverview: React.FC<CarbonBudgetOverviewProps> = ({
  user,
  activities,
  onDeleteActivity,
  onOpenLogger,
}) => {
  const budgetMax = user.dailyBudgetCappedKg; // 5.0 kg
  const used = user.todayEmittedKg;
  const remaining = Math.max(0, budgetMax - used);
  const budgetPercent = Math.min(100, Math.round((used / budgetMax) * 100));

  // Category totals for today
  const categoryStats = {
    transit: activities
      .filter((a) => a.category === 'transit')
      .reduce((acc, curr) => acc + curr.savedKg, 0),
    diet: activities
      .filter((a) => a.category === 'diet')
      .reduce((acc, curr) => acc + curr.savedKg, 0),
    home: activities
      .filter((a) => a.category === 'home')
      .reduce((acc, curr) => acc + curr.savedKg, 0),
    consumption: activities
      .filter((a) => a.category === 'consumption')
      .reduce((acc, curr) => acc + curr.savedKg, 0),
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'transit':
        return <Bike className="w-4 h-4 text-emerald-700" />;
      case 'diet':
        return <Utensils className="w-4 h-4 text-amber-700" />;
      case 'home':
        return <Home className="w-4 h-4 text-blue-700" />;
      case 'consumption':
      default:
        return <ShoppingBag className="w-4 h-4 text-purple-700" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* SDG Alignment Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-stone-900 text-white rounded-xl p-6 shadow-sm border border-emerald-950">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-300">
              <Globe2 className="w-4 h-4" />
              <span>UN SUSTAINABLE DEVELOPMENT GOALS FRAMEWORK</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Individual Carbon Tracking & Local Action
            </h1>
            <p className="text-stone-300 text-sm leading-relaxed">
              Tracking personal emissions against the Paris Agreement 1.5°C threshold (<span className="text-white font-medium">5.0 kg CO₂e / day</span>). Every electrified transit trip, circular repair, and plant-based choice directly reduces atmospheric carbon while supporting municipal resilience.
            </p>
          </div>

          <div className="flex flex-wrap lg:flex-nowrap items-center gap-3 shrink-0">
            <div className="bg-white/10 backdrop-blur-sm px-3 py-2 rounded-lg border border-white/15 text-left">
              <div className="text-[11px] text-emerald-200 uppercase font-mono">SDG 13</div>
              <div className="text-xs font-bold text-white">Climate Action</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm px-3 py-2 rounded-lg border border-white/15 text-left">
              <div className="text-[11px] text-teal-200 uppercase font-mono">SDG 11</div>
              <div className="text-xs font-bold text-white">Sustainable Cities</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm px-3 py-2 rounded-lg border border-white/15 text-left">
              <div className="text-[11px] text-amber-200 uppercase font-mono">SDG 12</div>
              <div className="text-xs font-bold text-white">Responsible Habits</div>
            </div>
          </div>
        </div>
      </div>

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Daily Carbon Budget */}
        <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-stone-500 mb-2">
            <span>Daily Carbon Budget (1.5°C)</span>
            <span className="font-mono text-stone-700">Max 5.0 kg</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-stone-900 font-mono tabular-nums">
              {used.toFixed(1)}
            </span>
            <span className="text-xs text-stone-500">kg CO₂e emitted</span>
          </div>

          <div className="mt-3">
            <div className="w-full bg-stone-100 rounded-full h-2 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  budgetPercent > 90
                    ? 'bg-rose-500'
                    : budgetPercent > 70
                    ? 'bg-amber-500'
                    : 'bg-emerald-500'
                }`}
                style={{ width: `${budgetPercent}%` }}
              />
            </div>
            <div className="flex justify-between items-center mt-1.5 text-xs">
              <span className="text-stone-500">Remaining</span>
              <span className="font-mono font-semibold text-emerald-800 tabular-nums">
                {remaining.toFixed(1)} kg allowance
              </span>
            </div>
          </div>
        </div>

        {/* Metric 2: Net CO2e Saved Today */}
        <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-stone-500 mb-2">
            <span>Carbon Avoided Today</span>
            <TrendingDown className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-emerald-700 font-mono tabular-nums">
              +{user.todaySavedKg.toFixed(1)}
            </span>
            <span className="text-xs text-stone-500">kg CO₂e avoided</span>
          </div>
          <p className="mt-3 text-xs text-stone-600">
            vs baseline single-occupancy driving and standard meat diet.
          </p>
        </div>

        {/* Metric 3: All-Time Net Savings */}
        <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-stone-500 mb-2">
            <span>Cumulative Climate Impact</span>
            <span className="text-xs font-mono text-stone-400">All-Time</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-stone-900 font-mono tabular-nums">
              {user.totalSavedKg.toFixed(1)}
            </span>
            <span className="text-xs text-stone-500">kg total avoided</span>
          </div>
          <p className="mt-3 text-xs text-emerald-800 font-medium">
            ≈ {Math.round(user.totalSavedKg * 4.2)} km avoided gasoline driving
          </p>
        </div>

        {/* Metric 4: Climate Streak & Rank */}
        <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-stone-500 mb-2">
            <span>Active Low-Carbon Streak</span>
            <span className="font-mono text-amber-600 font-semibold">{user.streakDays} Days</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-stone-900 font-mono tabular-nums">
              Level {user.level}
            </span>
            <span className="text-xs text-stone-500">{user.levelTitle}</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-stone-600">
            <span>XP: {user.xp} / {user.nextLevelXp}</span>
            <span className="font-medium text-emerald-700">
              {Math.round((user.xp / user.nextLevelXp) * 100)}%
            </span>
          </div>
        </div>
      </div>

      {/* Category Contribution Strip */}
      <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h2 className="text-base font-bold text-stone-900">
              Your Avoided Carbon Breakdown by Category
            </h2>
            <p className="text-xs text-stone-500">
              Where your sustainable decisions created the greatest emission reductions
            </p>
          </div>
          <button
            onClick={onOpenLogger}
            className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 underline self-start sm:self-auto cursor-pointer"
          >
            + Add New Activity
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-stone-50 rounded-lg p-3 border border-stone-200/70">
            <div className="flex items-center gap-2 mb-1">
              <Bike className="w-4 h-4 text-emerald-700" />
              <span className="text-xs font-semibold text-stone-700">Transit</span>
            </div>
            <div className="text-lg font-bold text-stone-900 font-mono tabular-nums">
              +{categoryStats.transit.toFixed(1)} <span className="text-xs font-normal text-stone-500">kg saved</span>
            </div>
            <div className="text-[11px] text-stone-500 mt-1">Light rail & bikeshare</div>
          </div>

          <div className="bg-stone-50 rounded-lg p-3 border border-stone-200/70">
            <div className="flex items-center gap-2 mb-1">
              <Utensils className="w-4 h-4 text-amber-700" />
              <span className="text-xs font-semibold text-stone-700">Diet</span>
            </div>
            <div className="text-lg font-bold text-stone-900 font-mono tabular-nums">
              +{categoryStats.diet.toFixed(1)} <span className="text-xs font-normal text-stone-500">kg saved</span>
            </div>
            <div className="text-[11px] text-stone-500 mt-1">Plant-based & local farm</div>
          </div>

          <div className="bg-stone-50 rounded-lg p-3 border border-stone-200/70">
            <div className="flex items-center gap-2 mb-1">
              <ShoppingBag className="w-4 h-4 text-purple-700" />
              <span className="text-xs font-semibold text-stone-700">Consumption</span>
            </div>
            <div className="text-lg font-bold text-stone-900 font-mono tabular-nums">
              +{categoryStats.consumption.toFixed(1)} <span className="text-xs font-normal text-stone-500">kg saved</span>
            </div>
            <div className="text-[11px] text-stone-500 mt-1">Refill & repair hubs</div>
          </div>

          <div className="bg-stone-50 rounded-lg p-3 border border-stone-200/70">
            <div className="flex items-center gap-2 mb-1">
              <Home className="w-4 h-4 text-blue-700" />
              <span className="text-xs font-semibold text-stone-700">Home Energy</span>
            </div>
            <div className="text-lg font-bold text-stone-900 font-mono tabular-nums">
              +{categoryStats.home.toFixed(1)} <span className="text-xs font-normal text-stone-500">kg saved</span>
            </div>
            <div className="text-[11px] text-stone-500 mt-1">Line-drying & grid cuts</div>
          </div>
        </div>
      </div>

      {/* Activity Log History Table */}
      <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-xs">
        <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-stone-900">
              Recent Carbon Activity Log
            </h2>
            <p className="text-xs text-stone-500">
              Verified individual emissions calculated using DEFRA/IPCC factors
            </p>
          </div>
          <span className="text-xs font-mono text-stone-500">
            {activities.length} Entries
          </span>
        </div>

        {activities.length === 0 ? (
          <div className="p-12 text-center">
            <Info className="w-8 h-8 text-stone-400 mx-auto mb-2" />
            <p className="text-sm font-medium text-stone-700">No activities logged yet.</p>
            <p className="text-xs text-stone-500 mt-1">
              Log your morning commute or lunch to start calculating your carbon savings.
            </p>
            <button
              onClick={onOpenLogger}
              className="mt-4 px-4 py-2 text-xs font-semibold text-white bg-emerald-700 rounded-lg hover:bg-emerald-800"
            >
              Log First Activity
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-stone-50 text-stone-600 text-xs font-semibold border-b border-stone-200 uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Activity & Scope</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4 text-right">Emitted (kg)</th>
                  <th className="py-3 px-4 text-right">Avoided (kg)</th>
                  <th className="py-3 px-4 text-right">XP</th>
                  <th className="py-3 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-stone-800">
                {activities.map((act) => (
                  <tr key={act.id} className="hover:bg-stone-50/80 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-stone-900">{act.title}</div>
                      <div className="text-xs text-stone-500">{act.description}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="inline-flex items-center gap-1.5 text-xs text-stone-700">
                        {getCategoryIcon(act.category)}
                        <span className="capitalize">{act.category}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-xs text-stone-500 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-stone-400" />
                        <span>{act.date}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-medium tabular-nums text-stone-700">
                      {act.emittedKg.toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold tabular-nums text-emerald-700">
                      +{act.savedKg.toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-semibold tabular-nums text-amber-700">
                      +{act.xpEarned}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => onDeleteActivity(act.id)}
                        className="text-stone-400 hover:text-rose-600 p-1 rounded transition-colors cursor-pointer"
                        title="Delete entry"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
