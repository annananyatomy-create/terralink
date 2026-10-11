import React, { useState } from 'react';
import {
  TransitStop,
  TransitRouteOption,
} from '../types';
import {
  TRANSIT_NODES,
  SAMPLE_ROUTES,
  HERO_IMAGE,
} from '../data/initialData';
import {
  Train,
  Bus,
  Bike,
  Car,
  Clock,
  DollarSign,
  Leaf,
  Navigation,
  ArrowRight,
  Flame,
  Check,
  RefreshCw,
  Zap,
} from 'lucide-react';

interface TransitIntegrationProps {
  transitStops: TransitStop[];
  onLogTransitTrip: (route: TransitRouteOption) => void;
}

export const TransitIntegration: React.FC<TransitIntegrationProps> = ({
  transitStops,
  onLogTransitTrip,
}) => {
  const [origin, setOrigin] = useState(TRANSIT_NODES[0]);
  const [destination, setDestination] = useState(TRANSIT_NODES[1]);
  const [selectedRouteId, setSelectedRouteId] = useState<string>('rt-metro');
  const [loggedRouteId, setLoggedRouteId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'planner' | 'live-board' | 'bikeshare'>('planner');

  const routes: TransitRouteOption[] = SAMPLE_ROUTES.default;
  const currentRoute = routes.find((r) => r.id === selectedRouteId) || routes[0];

  const handleLog = (route: TransitRouteOption) => {
    setLoggedRouteId(route.id);
    onLogTransitTrip(route);
    setTimeout(() => {
      setLoggedRouteId(null);
    }, 3000);
  };

  const handleSwapNodes = () => {
    const temp = origin;
    setOrigin(destination);
    setDestination(temp);
  };

  return (
    <div className="space-y-6">
      {/* Header with Hero Banner */}
      <div className="relative rounded-xl overflow-hidden border border-stone-200 bg-stone-900 text-white shadow-xs">
        <div className="absolute inset-0">
          <img
            src={HERO_IMAGE}
            alt="Sustainable urban transit eco-district"
            className="w-full h-full object-cover opacity-35"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-stone-950 via-stone-900/90 to-transparent" />
        </div>

        <div className="relative p-6 sm:p-8 max-w-2xl space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
            <Train className="w-4 h-4" />
            <span>MUNICIPAL LOW-CARBON MOBILITY NETWORK · SDG 11.2</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Local Transit Integration & Route Carbon Comparison
          </h1>
          <p className="text-stone-300 text-sm leading-relaxed">
            Directly connected to the regional electric light rail, rapid bus corridors, and municipal bikeshare. Compare travel time, financial cost, and emissions against driving before logging your trip.
          </p>

          {/* Interactive sub-tabs */}
          <div className="pt-2 flex items-center gap-2">
            <button
              onClick={() => setActiveTab('planner')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                activeTab === 'planner'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white/10 text-stone-200 hover:bg-white/20'
              }`}
            >
              Route Carbon Planner
            </button>
            <button
              onClick={() => setActiveTab('live-board')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                activeTab === 'live-board'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white/10 text-stone-200 hover:bg-white/20'
              }`}
            >
              Live Departures Board
            </button>
            <button
              onClick={() => setActiveTab('bikeshare')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                activeTab === 'bikeshare'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white/10 text-stone-200 hover:bg-white/20'
              }`}
            >
              City Bikeshare Docks
            </button>
          </div>
        </div>
      </div>

      {/* Tab 1: Route Carbon Planner */}
      {activeTab === 'planner' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Planner Controls & Origin/Destination */}
          <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h2 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                <Navigation className="w-4 h-4 text-emerald-700" />
                Select Trip Corridor
              </h2>
              <button
                onClick={handleSwapNodes}
                className="text-xs text-stone-500 hover:text-stone-900 flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reverse</span>
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-1">
                  Origin (Starting Hub)
                </label>
                <select
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                  className="w-full text-xs font-medium bg-stone-50 border border-stone-200 rounded-lg p-2.5 text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                >
                  {TRANSIT_NODES.map((node) => (
                    <option key={node} value={node} disabled={node === destination}>
                      {node}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-1">
                  Destination
                </label>
                <select
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full text-xs font-medium bg-stone-50 border border-stone-200 rounded-lg p-2.5 text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                >
                  {TRANSIT_NODES.map((node) => (
                    <option key={node} value={node} disabled={node === origin}>
                      {node}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="bg-emerald-50 rounded-lg p-3.5 border border-emerald-200/60 text-xs space-y-2">
              <div className="flex items-center gap-1.5 font-bold text-emerald-950">
                <Zap className="w-4 h-4 text-emerald-700" />
                <span>Zero-Emission Grid Powered</span>
              </div>
              <p className="text-emerald-900 leading-relaxed text-[11px]">
                The Blue Line light rail runs 100% on certified regional solar and hydro power, generating only 28g CO₂e per passenger-km compared to 171g/km for a solo gasoline vehicle.
              </p>
            </div>

            <div className="border-t border-stone-100 pt-3 text-xs text-stone-500">
              <div className="flex justify-between py-1">
                <span>Corridor Distance:</span>
                <span className="font-mono text-stone-800 font-semibold">8.4 km</span>
              </div>
              <div className="flex justify-between py-1">
                <span>Peak Frequency:</span>
                <span className="font-mono text-stone-800 font-semibold">Every 6 mins</span>
              </div>
              <div className="flex justify-between py-1">
                <span>Regional Transit Fare:</span>
                <span className="font-mono text-stone-800 font-semibold">$2.25 flat tap</span>
              </div>
            </div>
          </div>

          {/* Mode Comparison Columns */}
          <div className="lg:col-span-2 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-stone-900">
                Available Travel Modes & Emissions Analysis
              </h2>
              <span className="text-xs text-stone-500">Click a mode to inspect or log</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {routes.map((rt) => {
                const isSelected = rt.id === selectedRouteId;
                const isCar = rt.mode === 'car';

                return (
                  <div
                    key={rt.id}
                    onClick={() => setSelectedRouteId(rt.id)}
                    className={`rounded-xl border p-4.5 transition-all cursor-pointer text-left relative ${
                      isSelected
                        ? 'border-emerald-600 ring-2 ring-emerald-600/20 bg-white shadow-xs'
                        : 'border-stone-200 bg-white hover:border-stone-300'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                            rt.mode === 'transit'
                              ? 'bg-blue-100 text-blue-700'
                              : rt.mode === 'bike'
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-stone-100 text-stone-700'
                          }`}
                        >
                          {rt.mode === 'transit' ? (
                            <Train className="w-4 h-4" />
                          ) : rt.mode === 'bike' ? (
                            <Bike className="w-4 h-4" />
                          ) : (
                            <Car className="w-4 h-4" />
                          )}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-stone-900">{rt.title}</div>
                          <div className="text-[11px] text-stone-500">{rt.durationMinutes} mins · {rt.distanceKm} km</div>
                        </div>
                      </div>

                      <span
                        className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                          rt.ecoScore === 'A+'
                            ? 'bg-emerald-100 text-emerald-900'
                            : rt.ecoScore === 'A'
                            ? 'bg-teal-100 text-teal-900'
                            : 'bg-rose-100 text-rose-900'
                        }`}
                      >
                        Grade {rt.ecoScore}
                      </span>
                    </div>

                    <p className="text-xs text-stone-600 mb-3 min-h-[32px]">
                      {rt.routeSummary}
                    </p>

                    <div className="grid grid-cols-3 gap-2 pt-2 border-t border-stone-100 text-xs">
                      <div>
                        <div className="text-[10px] text-stone-400">Emissions</div>
                        <div className="font-mono font-bold text-stone-900 tabular-nums">
                          {rt.co2eKg} kg
                        </div>
                      </div>

                      <div>
                        <div className="text-[10px] text-stone-400">Cost</div>
                        <div className="font-mono font-bold text-stone-900 tabular-nums">
                          ${rt.costUsd.toFixed(2)}
                        </div>
                      </div>

                      <div>
                        <div className="text-[10px] text-stone-400">CO₂ Avoided</div>
                        <div
                          className={`font-mono font-bold tabular-nums ${
                            rt.savedCo2eKg > 0 ? 'text-emerald-700' : 'text-stone-400'
                          }`}
                        >
                          {rt.savedCo2eKg > 0 ? `+${rt.savedCo2eKg} kg` : '0 kg'}
                        </div>
                      </div>
                    </div>

                    {!isCar && (
                      <div className="mt-3 pt-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleLog(rt);
                          }}
                          className={`w-full py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                            loggedRouteId === rt.id
                              ? 'bg-emerald-800 text-white'
                              : 'bg-emerald-700 hover:bg-emerald-800 text-white'
                          }`}
                        >
                          {loggedRouteId === rt.id ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              <span>Trip Logged! (+{rt.savedCo2eKg} kg CO₂e)</span>
                            </>
                          ) : (
                            <>
                              <Leaf className="w-3.5 h-3.5" />
                              <span>Log This Transit Trip</span>
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Live Departures Board */}
      {activeTab === 'live-board' && (
        <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-xs">
          <div className="p-5 border-b border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-700" />
                Live Municipal Transit Departures
              </h2>
              <p className="text-xs text-stone-500">
                Connected to Regional GTFS live transit feeds with real-time crowding estimates
              </p>
            </div>
            <span className="text-xs font-mono text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
              Auto-refreshing every 30s
            </span>
          </div>

          <div className="divide-y divide-stone-200">
            {transitStops.map((stop) => (
              <div key={stop.id} className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono bg-stone-100 text-stone-700 px-2 py-0.5 rounded font-semibold">
                      {stop.code}
                    </span>
                    <span className="text-sm font-bold text-stone-900">{stop.name}</span>
                    <span className="text-xs text-stone-400">· {stop.distanceMeters}m away</span>
                  </div>
                  <div className="hidden sm:flex items-center gap-1.5 text-xs text-stone-500">
                    <span>Lines:</span>
                    {stop.lines.map((l) => (
                      <span key={l} className="font-mono text-stone-700 font-medium">
                        {l}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {stop.nextDepartures.map((dep, idx) => (
                    <div
                      key={idx}
                      className="bg-stone-50 rounded-lg p-3 border border-stone-200/80 flex items-center justify-between"
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5">
                          {dep.vehicleType === 'metro' ? (
                            <Train className="w-3.5 h-3.5 text-blue-700" />
                          ) : (
                            <Bus className="w-3.5 h-3.5 text-emerald-700" />
                          )}
                          <span className="text-xs font-bold text-stone-900">{dep.line}</span>
                        </div>
                        <div className="text-[11px] text-stone-500 truncate max-w-[150px]">
                          To: {dep.destination}
                        </div>
                        <div className="text-[10px] text-stone-400">
                          Crowding: <span className="text-stone-700 font-medium">{dep.crowding}</span>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-lg font-mono font-extrabold text-emerald-800">
                          {dep.timeMinutes} <span className="text-xs font-normal text-stone-500">min</span>
                        </div>
                        <span className="text-[10px] font-mono text-stone-400 uppercase">On time</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: City Bikeshare Network */}
      {activeTab === 'bikeshare' && (
        <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-3">
            <div>
              <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
                <Bike className="w-4 h-4 text-emerald-700" />
                City Bikeshare & E-Bike Dock Availability
              </h2>
              <p className="text-xs text-stone-500">
                100% zero-tailpipe transport. 64 docking hubs across the district.
              </p>
            </div>
            <span className="text-xs font-mono text-stone-700 bg-stone-100 px-2.5 py-1 rounded">
              342 Total Fleet Active
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-stone-50 rounded-xl p-4 border border-stone-200">
              <div className="text-xs font-bold text-stone-900 mb-1">
                Dock #12 · Central Terminal Plaza
              </div>
              <div className="text-xs text-stone-500 mb-3">180 meters walking distance</div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-white p-2 rounded-lg border border-stone-200">
                  <div className="text-lg font-mono font-bold text-emerald-700">8</div>
                  <div className="text-[10px] text-stone-500">E-Bikes</div>
                </div>
                <div className="bg-white p-2 rounded-lg border border-stone-200">
                  <div className="text-lg font-mono font-bold text-stone-800">12</div>
                  <div className="text-[10px] text-stone-500">Classic</div>
                </div>
                <div className="bg-white p-2 rounded-lg border border-stone-200">
                  <div className="text-lg font-mono font-bold text-stone-400">6</div>
                  <div className="text-[10px] text-stone-500">Docks Open</div>
                </div>
              </div>
            </div>

            <div className="bg-stone-50 rounded-xl p-4 border border-stone-200">
              <div className="text-xs font-bold text-stone-900 mb-1">
                Dock #24 · Riverside Eco-Quarter Hub
              </div>
              <div className="text-xs text-stone-500 mb-3">350 meters walking distance</div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-white p-2 rounded-lg border border-stone-200">
                  <div className="text-lg font-mono font-bold text-emerald-700">5</div>
                  <div className="text-[10px] text-stone-500">E-Bikes</div>
                </div>
                <div className="bg-white p-2 rounded-lg border border-stone-200">
                  <div className="text-lg font-mono font-bold text-stone-800">9</div>
                  <div className="text-[10px] text-stone-500">Classic</div>
                </div>
                <div className="bg-white p-2 rounded-lg border border-stone-200">
                  <div className="text-lg font-mono font-bold text-stone-400">10</div>
                  <div className="text-[10px] text-stone-500">Docks Open</div>
                </div>
              </div>
            </div>

            <div className="bg-stone-50 rounded-xl p-4 border border-stone-200">
              <div className="text-xs font-bold text-stone-900 mb-1">
                Dock #05 · Civic Commons & University
              </div>
              <div className="text-xs text-stone-500 mb-3">540 meters walking distance</div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-white p-2 rounded-lg border border-stone-200">
                  <div className="text-lg font-mono font-bold text-emerald-700">11</div>
                  <div className="text-[10px] text-stone-500">E-Bikes</div>
                </div>
                <div className="bg-white p-2 rounded-lg border border-stone-200">
                  <div className="text-lg font-mono font-bold text-stone-800">4</div>
                  <div className="text-[10px] text-stone-500">Classic</div>
                </div>
                <div className="bg-white p-2 rounded-lg border border-stone-200">
                  <div className="text-lg font-mono font-bold text-stone-400">5</div>
                  <div className="text-[10px] text-stone-500">Docks Open</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
