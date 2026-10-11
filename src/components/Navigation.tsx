import React from 'react';
import { Leaf, Plus, Sparkles } from 'lucide-react';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onOpenLogger: () => void;
  streakDays: number;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onTabChange,
  onOpenLogger,
  streakDays,
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'transit', label: 'Transit Network' },
    { id: 'alternatives', label: 'Local Alternatives' },
    { id: 'community', label: 'Community & Friends' },
    { id: 'quests', label: 'Quests & Badges' },
    { id: 'java-code', label: 'Java Code' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Strictly compliant Top Bar Contract: Zone 1 (Wordmark) — Zone 2 (4-5 nav links) — Zone 3 (1 primary CTA) */}
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single text element wordmark */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => onTabChange('dashboard')}
              className="flex items-center gap-2 group text-left"
            >
              <div className="w-9 h-9 rounded-lg bg-emerald-600 flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-105">
                <Leaf className="w-5 h-5 text-emerald-50" />
              </div>
              <span className="text-xl font-bold tracking-tight text-stone-900 whitespace-nowrap">
                Terralink
              </span>
            </button>
            <span className="hidden sm:inline-block text-xs font-mono text-emerald-800 bg-emerald-50 border border-emerald-200/60 px-2 py-0.5 rounded ml-2">
              SDG 13 · 11 · 12
            </span>
          </div>

          {/* Zone 2: 4-5 concise single-line nav links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`relative py-1 text-sm font-medium transition-colors whitespace-nowrap shrink-0 ${
                    isActive
                      ? 'text-emerald-800 font-semibold'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600 rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: 1 primary action */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="hidden lg:flex items-center gap-1.5 text-xs text-stone-600 bg-stone-100 px-2.5 py-1.5 rounded-md border border-stone-200">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Streak</span>
              <span className="font-mono font-bold text-stone-900 tabular-nums">
                {streakDays}d
              </span>
            </div>

            <button
              onClick={onOpenLogger}
              className="flex items-center gap-1.5 px-3.5 py-2 text-sm font-semibold text-white bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 rounded-lg shadow-sm transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Log Carbon Action</span>
            </button>
          </div>
        </div>

        {/* Mobile Horizontal Navigation Strip */}
        <div className="flex md:hidden items-center gap-2 overflow-x-auto py-2.5 border-t border-stone-100 no-scrollbar">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`px-3 py-1 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-emerald-100 text-emerald-900 font-semibold'
                    : 'text-stone-600 hover:bg-stone-100'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
