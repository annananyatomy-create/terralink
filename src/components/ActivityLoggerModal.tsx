import React, { useState } from 'react';
import { CategoryType, ActivityEntry } from '../types';
import { EMISSION_FACTORS } from '../data/initialData';
import {
  X,
  Plus,
  Bike,
  Utensils,
  Home,
  ShoppingBag,
  Zap,
  CheckCircle,
  HelpCircle,
  ArrowRight,
} from 'lucide-react';

interface ActivityLoggerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddActivity: (activity: Omit<ActivityEntry, 'id' | 'date'>) => void;
}

export const ActivityLoggerModal: React.FC<ActivityLoggerModalProps> = ({
  isOpen,
  onClose,
  onAddActivity,
}) => {
  const [modeType, setModeType] = useState<'quick' | 'custom'>('quick');

  // Custom form state
  const [category, setCategory] = useState<CategoryType>('transit');
  const [selectedFactorIndex, setSelectedFactorIndex] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(10);
  const [customTitle, setCustomTitle] = useState<string>('');
  const [customDescription, setCustomDescription] = useState<string>('');

  if (!isOpen) return null;

  // Filter factors matching current category
  const availableFactors = EMISSION_FACTORS.filter((f) => f.category === category);
  const currentFactor = availableFactors[selectedFactorIndex] || availableFactors[0] || EMISSION_FACTORS[0];

  // Dynamic calculations
  const emittedKg = Number(((currentFactor.gPerKmOrUnit * quantity) / 1000).toFixed(2));
  const baselineKg = Number(((currentFactor.baselineGPerKm * quantity) / 1000).toFixed(2));
  const savedKg = Number(Math.max(0, baselineKg - emittedKg).toFixed(2));
  const xpEarned = Math.max(15, Math.round(savedKg * 20));

  const quickPresets = [
    {
      title: 'Metro / Light Rail Commute',
      description: '12 km round-trip commute by electric train',
      category: 'transit' as CategoryType,
      emittedKg: 0.34,
      baselineKg: 2.05,
      savedKg: 1.71,
      xpEarned: 40,
      mode: 'Metro / Light Rail',
      distanceKm: 12,
    },
    {
      title: 'City Bikeshare Errand',
      description: '6 km errand on protected green cycleway',
      category: 'transit' as CategoryType,
      emittedKg: 0.0,
      baselineKg: 1.02,
      savedKg: 1.02,
      xpEarned: 35,
      mode: 'Bikeshare / Bicycle',
      distanceKm: 6,
    },
    {
      title: 'Plant-Based / Vegan Lunch',
      description: 'Legume and whole grain bowl replacing beef/pork',
      category: 'diet' as CategoryType,
      emittedKg: 0.42,
      baselineKg: 2.2,
      savedKg: 1.78,
      xpEarned: 45,
      mode: 'Plant-Based / Vegan Meal',
    },
    {
      title: 'Package-Free Pantry Refill',
      description: 'Stocked grains & oils using reusable glass containers',
      category: 'consumption' as CategoryType,
      emittedKg: 0.15,
      baselineKg: 1.65,
      savedKg: 1.5,
      xpEarned: 35,
      mode: 'Package-Free Pantry Refill',
    },
    {
      title: 'Repaired Clothing or Appliance',
      description: 'Fixed zipper or rewound small motor at Repair Cafe',
      category: 'consumption' as CategoryType,
      emittedKg: 0.5,
      baselineKg: 14.2,
      savedKg: 13.7,
      xpEarned: 120,
      mode: 'Appliance / Garment Repair',
    },
    {
      title: 'Line-Dry Laundry',
      description: 'Avoided tumble dryer during peak power grid hours',
      category: 'home' as CategoryType,
      emittedKg: 0.0,
      baselineKg: 1.8,
      savedKg: 1.8,
      xpEarned: 30,
      mode: 'Line-Dry Laundry',
    },
  ];

  const handleQuickSelect = (preset: (typeof quickPresets)[0]) => {
    onAddActivity(preset);
    onClose();
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const title = customTitle.trim() || `${currentFactor.mode} (${quantity} ${currentFactor.unitLabel})`;
    const description =
      customDescription.trim() ||
      `Chose ${currentFactor.mode} over ${currentFactor.baselineMode}`;

    onAddActivity({
      category,
      title,
      description,
      emittedKg,
      baselineKg,
      savedKg,
      xpEarned,
      mode: currentFactor.mode,
      distanceKm: currentFactor.unitLabel === 'km' ? quantity : undefined,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-stone-200 overflow-hidden my-8">
        {/* Header */}
        <div className="p-5 border-b border-stone-200 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
              <Zap className="w-5 h-5 text-emerald-700" />
              Log Individual Carbon Action
            </h2>
            <p className="text-xs text-stone-500">
              Calculate verified emission reductions and earn community impact XP
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-700 p-1 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Toggle */}
        <div className="px-5 pt-4">
          <div className="flex bg-stone-100 p-1 rounded-lg text-xs font-semibold">
            <button
              onClick={() => setModeType('quick')}
              className={`flex-1 py-1.5 rounded-md transition-colors cursor-pointer ${
                modeType === 'quick'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Quick Presets
            </button>
            <button
              onClick={() => setModeType('custom')}
              className={`flex-1 py-1.5 rounded-md transition-colors cursor-pointer ${
                modeType === 'custom'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Custom Calculator
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          {modeType === 'quick' ? (
            <div className="space-y-2.5 max-h-[420px] overflow-y-auto pr-1">
              {quickPresets.map((preset, idx) => (
                <div
                  key={idx}
                  onClick={() => handleQuickSelect(preset)}
                  className="p-3.5 rounded-xl border border-stone-200 hover:border-emerald-600 hover:bg-emerald-50/40 transition-all cursor-pointer flex items-center justify-between group"
                >
                  <div className="space-y-0.5 min-w-0 pr-3">
                    <div className="text-xs font-bold text-stone-900 group-hover:text-emerald-900">
                      {preset.title}
                    </div>
                    <div className="text-[11px] text-stone-500 truncate">
                      {preset.description}
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-xs font-mono font-bold text-emerald-700 tabular-nums">
                      +{preset.savedKg.toFixed(2)} kg
                    </div>
                    <div className="text-[10px] font-mono text-amber-700">
                      +{preset.xpEarned} XP
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <form onSubmit={handleCustomSubmit} className="space-y-4">
              {/* Category selector */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  Category
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { id: 'transit', label: 'Transit', icon: Bike },
                    { id: 'diet', label: 'Diet', icon: Utensils },
                    { id: 'consumption', label: 'Goods', icon: ShoppingBag },
                    { id: 'home', label: 'Home', icon: Home },
                  ].map((cat) => {
                    const Icon = cat.icon;
                    const isSelected = category === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => {
                          setCategory(cat.id as CategoryType);
                          setSelectedFactorIndex(0);
                        }}
                        className={`p-2 rounded-lg border text-center transition-all cursor-pointer ${
                          isSelected
                            ? 'border-emerald-700 bg-emerald-50 text-emerald-950 font-bold'
                            : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                        }`}
                      >
                        <Icon className="w-4 h-4 mx-auto mb-1" />
                        <span className="text-[11px]">{cat.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Mode / Type within category */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Sustainable Option
                </label>
                <select
                  value={selectedFactorIndex}
                  onChange={(e) => setSelectedFactorIndex(Number(e.target.value))}
                  className="w-full text-xs bg-stone-50 border border-stone-200 rounded-lg p-2.5 text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                >
                  {availableFactors.map((f, i) => (
                    <option key={f.mode} value={i}>
                      {f.mode} (vs {f.baselineMode})
                    </option>
                  ))}
                </select>
              </div>

              {/* Quantity / Distance */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Quantity / Distance ({currentFactor.unitLabel})
                </label>
                <input
                  type="number"
                  min="0.1"
                  step="0.1"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(0.1, Number(e.target.value)))}
                  className="w-full text-xs font-mono bg-stone-50 border border-stone-200 rounded-lg p-2.5 text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                  required
                />
              </div>

              {/* Live Emission Calculation Box */}
              <div className="bg-stone-50 rounded-xl p-3.5 border border-stone-200 space-y-2">
                <div className="text-xs font-bold text-stone-800">
                  Calculated Environmental Impact
                </div>
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="bg-white p-2 rounded-lg border border-stone-200">
                    <div className="text-[10px] text-stone-500">Emitted</div>
                    <div className="font-mono font-bold text-stone-800 tabular-nums">
                      {emittedKg} kg
                    </div>
                  </div>
                  <div className="bg-white p-2 rounded-lg border border-stone-200">
                    <div className="text-[10px] text-stone-500">Standard Base</div>
                    <div className="font-mono font-bold text-stone-500 tabular-nums">
                      {baselineKg} kg
                    </div>
                  </div>
                  <div className="bg-emerald-50 p-2 rounded-lg border border-emerald-200">
                    <div className="text-[10px] text-emerald-800 font-semibold">Net Avoided</div>
                    <div className="font-mono font-extrabold text-emerald-700 tabular-nums">
                      +{savedKg} kg
                    </div>
                  </div>
                </div>
              </div>

              {/* Custom Title (Optional) */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Optional Activity Title / Note
                </label>
                <input
                  type="text"
                  placeholder="e.g. Commute to university / Lunch at green market"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  className="w-full text-xs bg-stone-50 border border-stone-200 rounded-lg p-2 text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-3.5 py-2 text-xs font-medium text-stone-600 hover:bg-stone-100 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <span>Record & Save (+{savedKg} kg)</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
