import React, { useState } from 'react';
import { LocalAlternative, EcoSwap } from '../types';
import { LOCAL_ALTERNATIVES, ECO_SWAPS } from '../data/initialData';
import {
  Store,
  Wrench,
  Carrot,
  Bike,
  Sparkles,
  MapPin,
  Star,
  ArrowRight,
  CheckCircle,
  HelpCircle,
  TrendingDown,
  DollarSign,
  Recycle,
} from 'lucide-react';

interface LocalAlternativesProps {
  onLogAlternativeAction: (alt: LocalAlternative) => void;
}

export const LocalAlternatives: React.FC<LocalAlternativesProps> = ({
  onLogAlternativeAction,
}) => {
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [selectedAltId, setSelectedAltId] = useState<string>(LOCAL_ALTERNATIVES[0].id);
  const [loggedAltId, setLoggedAltId] = useState<string | null>(null);

  const filteredAlternatives = LOCAL_ALTERNATIVES.filter((alt) => {
    if (filterCategory === 'all') return true;
    return alt.category === filterCategory;
  });

  const selectedAlt =
    LOCAL_ALTERNATIVES.find((alt) => alt.id === selectedAltId) || LOCAL_ALTERNATIVES[0];

  const handleLog = (alt: LocalAlternative) => {
    setLoggedAltId(alt.id);
    onLogAlternativeAction(alt);
    setTimeout(() => {
      setLoggedAltId(null);
    }, 2800);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'refill':
        return <Store className="w-4 h-4 text-emerald-700" />;
      case 'repair':
        return <Wrench className="w-4 h-4 text-amber-700" />;
      case 'farmers_market':
        return <Carrot className="w-4 h-4 text-orange-700" />;
      case 'cycling':
        return <Bike className="w-4 h-4 text-blue-700" />;
      case 'compost':
      default:
        return <Recycle className="w-4 h-4 text-teal-700" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-800">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>CIRCULAR ECONOMY & LOCAL RESILIENCE · SDG 12 & 11</span>
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-stone-900">
              Sustainable Local Alternatives & Circular Hubs
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 max-w-2xl">
              Replace high-carbon supermarket packaging, single-use purchases, and disposable electronics with neighborhood refill pantries, community repair cafes, and farm-to-table co-ops.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-stone-500 bg-stone-100 px-3 py-1.5 rounded-lg border border-stone-200">
              5 Verified Community Hubs Nearby
            </span>
          </div>
        </div>

        {/* Filter Segmented Controls (Button tabs) */}
        <div className="mt-5 flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {[
            { id: 'all', label: 'All Hubs' },
            { id: 'refill', label: 'Bulk Refill & Zero-Waste' },
            { id: 'repair', label: 'Repair Cafes & Tools' },
            { id: 'farmers_market', label: 'Urban Farms & CSA' },
            { id: 'cycling', label: 'Bike Co-ops' },
            { id: 'compost', label: 'Community Compost' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilterCategory(cat.id)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                filterCategory === cat.id
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200 hover:text-stone-900'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Directory & Map Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Hub List */}
        <div className="lg:col-span-7 space-y-3">
          {filteredAlternatives.map((alt) => {
            const isSelected = alt.id === selectedAltId;

            return (
              <div
                key={alt.id}
                onClick={() => setSelectedAltId(alt.id)}
                className={`p-4 rounded-xl border transition-all cursor-pointer bg-white ${
                  isSelected
                    ? 'border-emerald-600 ring-2 ring-emerald-600/20 shadow-xs'
                    : 'border-stone-200 hover:border-stone-300'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-stone-100 flex items-center justify-center shrink-0 mt-0.5">
                      {getCategoryIcon(alt.category)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-stone-900">{alt.name}</h3>
                        <div className="flex items-center gap-1 text-[11px] font-mono text-amber-600">
                          <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                          <span>{alt.rating}</span>
                        </div>
                      </div>
                      <div className="text-xs text-stone-500 mt-0.5 flex items-center gap-2">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-stone-400" />
                          {alt.neighborhood}
                        </span>
                        <span>·</span>
                        <span className="font-mono text-emerald-800 font-medium">
                          {alt.distanceKm} km away
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-xs font-mono font-bold text-emerald-700 tabular-nums">
                      ~{alt.avgSavingKg} kg CO₂e
                    </div>
                    <div className="text-[10px] text-stone-400">Avg saving/visit</div>
                  </div>
                </div>

                <p className="text-xs text-stone-600 mt-2.5 leading-relaxed">
                  {alt.description}
                </p>

                {/* Clean unboxed tag list with subtle separators */}
                <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-stone-500">
                  {alt.tags.map((tag, idx) => (
                    <React.Fragment key={tag}>
                      {idx > 0 && <span aria-hidden="true" className="text-stone-300">·</span>}
                      <span>{tag}</span>
                    </React.Fragment>
                  ))}
                </div>

                <div className="mt-3.5 pt-3 border-t border-stone-100 flex items-center justify-between">
                  <span className="text-xs text-stone-400 font-mono">
                    {alt.address}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLog(alt);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                      loggedAltId === alt.id
                        ? 'bg-emerald-800 text-white'
                        : 'bg-emerald-700 hover:bg-emerald-800 text-white'
                    }`}
                  >
                    {loggedAltId === alt.id ? (
                      <>
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Action Logged! (+{alt.avgSavingKg} kg)</span>
                      </>
                    ) : (
                      <>
                        <span>{alt.actionLabel}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Interactive Map Preview Canvas & Featured Hub Spotlight */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-xs">
            <div className="p-4 border-b border-stone-200 flex items-center justify-between">
              <div className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-emerald-700" />
                <span>Interactive District Eco-Map</span>
              </div>
              <span className="text-[11px] font-mono text-stone-500">
                Scale: 5km radius
              </span>
            </div>

            {/* Stylized Urban District SVG Map */}
            <div className="relative w-full h-64 bg-stone-100 border-b border-stone-200 overflow-hidden">
              <svg viewBox="0 0 100 100" className="w-full h-full object-cover">
                {/* River grid */}
                <path
                  d="M0 65 Q40 50 70 70 T100 60"
                  stroke="#93c5fd"
                  strokeWidth="8"
                  fill="none"
                  strokeLinecap="round"
                />
                {/* Green park zones */}
                <rect x="15" y="15" width="25" height="30" rx="3" fill="#d1fae5" opacity="0.8" />
                <rect x="60" y="10" width="30" height="25" rx="3" fill="#d1fae5" opacity="0.8" />
                {/* City arterial grid lines */}
                <line x1="10" y1="50" x2="90" y2="50" stroke="#e7e5e4" strokeWidth="2" />
                <line x1="50" y1="10" x2="50" y2="90" stroke="#e7e5e4" strokeWidth="2" />
                <line x1="30" y1="10" x2="30" y2="90" stroke="#e7e5e4" strokeWidth="1.5" />
                <line x1="70" y1="10" x2="70" y2="90" stroke="#e7e5e4" strokeWidth="1.5" />

                {/* You are here marker */}
                <circle cx="35" cy="45" r="3.5" fill="#0284c7" stroke="#ffffff" strokeWidth="1" />
                <circle cx="35" cy="45" r="7" fill="#0284c7" opacity="0.2" />
              </svg>

              <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-xs px-2 py-1 rounded text-[10px] font-mono text-stone-600 border border-stone-200">
                You (Riverside Eco-Quarter)
              </div>

              {/* Hub pins */}
              {LOCAL_ALTERNATIVES.map((alt) => {
                const isSelected = alt.id === selectedAltId;
                return (
                  <button
                    key={alt.id}
                    onClick={() => setSelectedAltId(alt.id)}
                    style={{ left: `${alt.coords.x}%`, top: `${alt.coords.y}%` }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
                    title={alt.name}
                  >
                    <div
                      className={`flex items-center justify-center rounded-full transition-transform ${
                        isSelected
                          ? 'w-7 h-7 bg-emerald-700 text-white ring-4 ring-emerald-500/30 scale-110 shadow-md'
                          : 'w-5 h-5 bg-stone-800 text-white hover:scale-110'
                      }`}
                    >
                      <MapPin className="w-3 h-3" />
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Selected Spotlight card */}
            <div className="p-4 space-y-2">
              <div className="text-xs font-mono text-emerald-800 uppercase font-semibold">
                Spotlighted Destination
              </div>
              <h4 className="text-sm font-bold text-stone-900">{selectedAlt.name}</h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                {selectedAlt.description}
              </p>
              <div className="pt-2 text-xs flex items-center justify-between text-stone-500 border-t border-stone-100">
                <span>Distance: {selectedAlt.distanceKm} km</span>
                <span className="font-semibold text-emerald-700">
                  Avoids ~{selectedAlt.avgSavingKg} kg CO₂e
                </span>
              </div>
            </div>
          </div>

          {/* Environmental Insight Card */}
          <div className="bg-emerald-950 text-emerald-100 rounded-xl p-5 space-y-2 border border-emerald-900">
            <div className="text-xs font-mono text-emerald-400 font-semibold">
              CIRCULAR ECONOMY IMPACT
            </div>
            <h4 className="text-sm font-bold text-white">
              Why repairing beats recycling
            </h4>
            <p className="text-xs text-stone-300 leading-relaxed">
              Manufacturing new household electronics generates 70–80% of their lifetime greenhouse emissions upfront. Repairing a blender or winter coat through community repair cafes saves over 10 kg of embodied emissions instantly.
            </p>
          </div>
        </div>
      </div>

      {/* Smart Eco-Swap Comparison Tool */}
      <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-xs space-y-4">
        <div>
          <h2 className="text-base font-bold text-stone-900">
            Smart Everyday Eco-Swaps
          </h2>
          <p className="text-xs text-stone-500">
            See the concrete carbon reduction and annual financial savings of simple local switches
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ECO_SWAPS.map((swap) => (
            <div
              key={swap.id}
              className="rounded-xl border border-stone-200 p-4 bg-stone-50/60 hover:bg-stone-50 transition-colors"
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="text-xs font-mono uppercase text-stone-500 font-semibold">
                  {swap.category} Switch
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded">
                    -{swap.co2eDifferenceKg} kg CO₂e
                  </span>
                  <span className="text-xs font-mono font-bold text-stone-800 bg-stone-200/70 px-2 py-0.5 rounded">
                    +${swap.moneySavedUsd} saved
                  </span>
                </div>
              </div>

              <div className="space-y-1.5 my-3">
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-rose-600 font-semibold w-24 shrink-0">Standard:</span>
                  <span className="text-stone-700 line-through">{swap.conventional}</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-emerald-700 font-semibold w-24 shrink-0">Eco-Alternative:</span>
                  <span className="text-stone-900 font-bold">{swap.sustainable}</span>
                </div>
              </div>

              <p className="text-xs text-stone-600 italic bg-white p-2.5 rounded-lg border border-stone-200/80">
                💡 {swap.practicalTip}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
