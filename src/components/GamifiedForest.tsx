import React, { useState } from 'react';
import { UserProfile } from '../types';
import { Sparkles, Trees, Award, Droplets, Sun, Wind, CheckCircle2 } from 'lucide-react';

interface GamifiedForestProps {
  user: UserProfile;
  onTendBiome: () => void;
}

export const GamifiedForest: React.FC<GamifiedForestProps> = ({ user, onTendBiome }) => {
  const [tendedToday, setTendedToday] = useState(false);
  const [selectedHotspot, setSelectedHotspot] = useState<string | null>(null);

  const totalSaved = user.totalSavedKg;

  // Compute growth stage (1 to 5)
  let stage = 1;
  let stageName = 'Sprout & Clean Soil';
  let nextThreshold = 25;
  let prevThreshold = 0;

  if (totalSaved >= 300) {
    stage = 5;
    stageName = 'Ancient Biome Sanctuary';
    nextThreshold = 500;
    prevThreshold = 300;
  } else if (totalSaved >= 150) {
    stage = 4;
    stageName = 'Canopy Guardian Grove';
    nextThreshold = 300;
    prevThreshold = 150;
  } else if (totalSaved >= 75) {
    stage = 3;
    stageName = 'Thriving Urban Woodlands';
    nextThreshold = 150;
    prevThreshold = 75;
  } else if (totalSaved >= 25) {
    stage = 2;
    stageName = 'Sapling & Wildflower Garden';
    nextThreshold = 75;
    prevThreshold = 25;
  }

  const stageProgress = Math.min(
    100,
    Math.max(0, Math.round(((totalSaved - prevThreshold) / (nextThreshold - prevThreshold)) * 100))
  );

  const handleTend = () => {
    if (!tendedToday) {
      setTendedToday(true);
      onTendBiome();
    }
  };

  const hotspots = [
    {
      id: 'oak',
      name: 'Mature Community Oak',
      unlockedAtStage: 2,
      x: '38%',
      y: '45%',
      fact: 'A mature oak tree sequesters approximately 22 kg of atmospheric CO₂ every year and provides habitat for up to 280 insect species.',
    },
    {
      id: 'solar',
      name: 'Solar Canopy Array',
      unlockedAtStage: 3,
      x: '72%',
      y: '30%',
      fact: 'Urban rooftop solar offsets grid peak intensity during hot afternoons, cutting average grid carbon by 240g CO₂e per kWh.',
    },
    {
      id: 'wildflower',
      name: 'Pollinator Meadow Buffer',
      unlockedAtStage: 1,
      x: '24%',
      y: '68%',
      fact: 'Native clover and wildflower bioswales prevent urban stormwater runoff while capturing soil carbon 3x faster than turf grass.',
    },
    {
      id: 'river',
      name: 'Restored Greenway Stream',
      unlockedAtStage: 4,
      x: '55%',
      y: '78%',
      fact: 'Naturalized waterways cool urban heat islands by up to 2.5°C and reduce neighborhood air conditioning power spikes.',
    },
  ];

  return (
    <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-xs">
      <div className="p-5 border-b border-stone-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-800">
            <Trees className="w-4 h-4 text-emerald-600" />
            <span>GAMIFIED URBAN BIOME</span>
            <span className="text-stone-300">/</span>
            <span>STAGE {stage} OF 5</span>
          </div>
          <h2 className="text-xl font-bold text-stone-900 mt-1">
            {stageName}
          </h2>
          <p className="text-xs text-stone-500">
            Every kilogram of CO₂e you avoid enriches your virtual and municipal eco-forest.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <div className="text-xs text-stone-500">Next Evolution</div>
            <div className="text-xs font-mono font-bold text-stone-900 tabular-nums">
              {(nextThreshold - totalSaved).toFixed(1)} kg CO₂e to Stage {stage + 1}
            </div>
          </div>
          <button
            onClick={handleTend}
            disabled={tendedToday}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer ${
              tendedToday
                ? 'bg-stone-100 text-stone-500 cursor-not-allowed border border-stone-200'
                : 'bg-emerald-700 text-white hover:bg-emerald-800'
            }`}
          >
            {tendedToday ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Biome Tended Today (+25 XP)</span>
              </>
            ) : (
              <>
                <Droplets className="w-4 h-4" />
                <span>Water & Tend Biome</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Interactive Biome Canvas Illustration */}
      <div className="relative w-full h-72 sm:h-84 bg-gradient-to-b from-sky-100 via-emerald-50 to-emerald-100/90 overflow-hidden select-none border-b border-stone-200">
        {/* Sky Elements: Sun and Cloud breeze */}
        <div className="absolute top-4 right-8 flex items-center gap-2 text-amber-500/80 animate-pulse">
          <Sun className="w-10 h-10 text-amber-400" />
        </div>
        <div className="absolute top-8 left-12 flex items-center gap-1 text-sky-400/60">
          <Wind className="w-5 h-5" />
          <span className="text-[10px] font-mono tracking-widest text-sky-600 uppercase">
            Clean Air Index 12 AQI
          </span>
        </div>

        {/* Dynamic Landscape SVG */}
        <svg
          viewBox="0 0 800 350"
          className="w-full h-full object-cover pointer-events-none"
          preserveAspectRatio="xMidYMid slice"
        >
          {/* Distant Hills */}
          <path
            d="M0 240 Q180 180 380 230 T800 210 L800 350 L0 350 Z"
            fill="#a7f3d0"
            opacity="0.6"
          />
          <path
            d="M0 270 Q240 220 520 260 T800 250 L800 350 L0 350 Z"
            fill="#6ee7b7"
            opacity="0.7"
          />

          {/* Foreground Meadow Ground */}
          <path
            d="M0 290 Q200 275 400 285 T800 275 L800 350 L0 350 Z"
            fill="#34d399"
          />

          {/* Restored Stream / River */}
          <path
            d="M320 350 C380 310, 410 290, 480 270 L520 270 C470 290, 430 315, 380 350 Z"
            fill="#38bdf8"
            opacity="0.9"
          />

          {/* Plant elements based on stage */}
          {/* Main Tree (Oak) */}
          <g transform={`translate(280, ${220 - stage * 8}) scale(${0.7 + stage * 0.15})`}>
            {/* Trunk */}
            <path d="M40 90 Q45 40 38 10 Q50 35 55 90 Z" fill="#78350f" />
            {/* Foliage Canopy */}
            <circle cx="28" cy="22" r="32" fill="#047857" opacity="0.95" />
            <circle cx="58" cy="18" r="34" fill="#059669" opacity="0.95" />
            <circle cx="44" cy="-2" r="28" fill="#10b981" opacity="0.95" />
            <circle cx="42" cy="18" r="24" fill="#34d399" opacity="0.8" />
          </g>

          {/* Secondary Young Trees (unlocked stage >= 2) */}
          {stage >= 2 && (
            <g transform="translate(130, 220) scale(0.65)">
              <path d="M25 80 L30 15 L35 80 Z" fill="#92400e" />
              <polygon points="30,-5 5,45 55,45" fill="#059669" />
              <polygon points="30,-25 10,20 50,20" fill="#10b981" />
            </g>
          )}

          {stage >= 3 && (
            <g transform="translate(560, 215) scale(0.75)">
              <path d="M25 80 L30 20 L35 80 Z" fill="#92400e" />
              <circle cx="30" cy="15" r="30" fill="#047857" />
              <circle cx="30" cy="-5" r="24" fill="#10b981" />
            </g>
          )}

          {/* Solar canopy array on hill (stage >= 3) */}
          {stage >= 3 && (
            <g transform="translate(680, 160) scale(0.7)">
              <polygon points="10,30 50,20 80,35 40,48" fill="#1e3a8a" stroke="#60a5fa" strokeWidth="2" />
              <line x1="10" y1="30" x2="10" y2="55" stroke="#475569" strokeWidth="3" />
              <line x1="80" y1="35" x2="80" y2="60" stroke="#475569" strokeWidth="3" />
            </g>
          )}

          {/* Native Wildflower clusters on ground */}
          <g transform="translate(80, 295)">
            <circle cx="5" cy="5" r="3" fill="#ec4899" />
            <circle cx="15" cy="8" r="3.5" fill="#f59e0b" />
            <circle cx="25" cy="4" r="3" fill="#8b5cf6" />
            <circle cx="35" cy="10" r="3.5" fill="#ec4899" />
          </g>
          <g transform="translate(480, 310)">
            <circle cx="5" cy="5" r="3" fill="#f59e0b" />
            <circle cx="18" cy="7" r="4" fill="#ec4899" />
            <circle cx="30" cy="4" r="3" fill="#06b6d4" />
          </g>

          {/* Songbird in flight */}
          {stage >= 2 && (
            <path
              d="M210 110 Q218 102 226 110 Q234 102 242 110"
              stroke="#0f766e"
              strokeWidth="2.5"
              fill="none"
            />
          )}
        </svg>

        {/* Interactive Hotspots */}
        {hotspots.map((item) => {
          const isUnlocked = stage >= item.unlockedAtStage;
          if (!isUnlocked) return null;
          return (
            <button
              key={item.id}
              onClick={() =>
                setSelectedHotspot(selectedHotspot === item.id ? null : item.id)
              }
              style={{ left: item.x, top: item.y }}
              className="absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
              title={item.name}
            >
              <span className="relative flex h-6 w-6 items-center justify-center">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60"></span>
                <span className="relative inline-flex rounded-full h-5 w-5 bg-emerald-700 text-white text-[10px] font-bold items-center justify-center border-2 border-white shadow-md">
                  ★
                </span>
              </span>
            </button>
          );
        })}

        {/* Selected Hotspot Tooltip / Info Card */}
        {selectedHotspot && (
          <div className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-80 bg-white/95 backdrop-blur-md p-3.5 rounded-lg border border-emerald-200 shadow-lg text-xs z-10">
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-emerald-900">
                {hotspots.find((h) => h.id === selectedHotspot)?.name}
              </span>
              <button
                onClick={() => setSelectedHotspot(null)}
                className="text-stone-400 hover:text-stone-700 cursor-pointer font-bold px-1"
              >
                ✕
              </button>
            </div>
            <p className="text-stone-600 leading-relaxed">
              {hotspots.find((h) => h.id === selectedHotspot)?.fact}
            </p>
          </div>
        )}
      </div>

      {/* Biome Progress & Real Ecological Equivalents */}
      <div className="p-5 bg-stone-50/70 border-t border-stone-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-2 mb-2">
          <span className="text-stone-600 font-medium">
            Stage {stage} Maturity ({stageProgress}%)
          </span>
          <span className="font-mono text-stone-700">
            {totalSaved.toFixed(1)} / {nextThreshold} kg CO₂e
          </span>
        </div>
        <div className="w-full bg-stone-200 rounded-full h-2 overflow-hidden mb-4">
          <div
            className="bg-emerald-600 h-full rounded-full transition-all duration-500"
            style={{ width: `${stageProgress}%` }}
          />
        </div>

        {/* Real Equivalents Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          <div className="bg-white p-3 rounded-lg border border-stone-200/80">
            <div className="text-[11px] text-stone-500">Urban Trees Equivalent</div>
            <div className="text-base font-extrabold text-stone-900 font-mono mt-0.5">
              {(totalSaved / 20).toFixed(1)} Trees
            </div>
            <div className="text-[11px] text-stone-500 mt-0.5">
              Annual sequestration capacity
            </div>
          </div>

          <div className="bg-white p-3 rounded-lg border border-stone-200/80">
            <div className="text-[11px] text-stone-500">Combustion Travel Offset</div>
            <div className="text-base font-extrabold text-stone-900 font-mono mt-0.5">
              {(totalSaved * 4.2).toFixed(0)} km
            </div>
            <div className="text-[11px] text-stone-500 mt-0.5">
              Gasoline passenger car driving avoided
            </div>
          </div>

          <div className="bg-white p-3 rounded-lg border border-stone-200/80">
            <div className="text-[11px] text-stone-500">Clean Energy Equivalent</div>
            <div className="text-base font-extrabold text-stone-900 font-mono mt-0.5">
              {(totalSaved * 2.1).toFixed(0)} kWh
            </div>
            <div className="text-[11px] text-stone-500 mt-0.5">
              Renewable micro-grid generation
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
