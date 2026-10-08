import React, { useState } from 'react';
import { GameState, Territory } from '../game/types';
import { sounds } from '../game/audio';
import { createTacticalBattle } from '../game/combatSimulation';
import { getTerritoryVisual } from '../game/visuals';
import { EntityImage } from '../components/EntityImage';
import {
  MapPin,
  Shield,
  DollarSign,
  Users,
  Flag,
  Crosshair,
  Building,
  Flame,
  CheckCircle2
} from 'lucide-react';

interface TerritoryScreenProps {
  state: GameState;
  onUpdateState: (updater: (prev: GameState) => GameState) => void;
}

export const TerritoryScreen: React.FC<TerritoryScreenProps> = ({
  state,
  onUpdateState
}) => {
  const [selectedTerritoryId, setSelectedTerritoryId] = useState<string>(
    state.territories[0]?.id || ''
  );
  const [filterRegion, setFilterRegion] = useState<string>('all');

  const selectedTerritory =
    state.territories.find(t => t.id === selectedTerritoryId) || state.territories[0];

  const filteredTerritories = state.territories.filter(t => {
    if (filterRegion === 'all') return true;
    return t.regionId === filterRegion;
  });

  const controllingFaction = selectedTerritory?.controllingFactionId
    ? state.factions.find(f => f.id === selectedTerritory.controllingFactionId)
    : null;

  // Launch Turf Takeover
  const handleLaunchConquest = () => {
    if (!selectedTerritory || selectedTerritory.controllingFactionId === null) return;

    sounds.playGunRack();
    const readyCrew = state.members.slice(0, 4);
    const battle = createTacticalBattle(
      `Turf War: ${selectedTerritory.name}`,
      controllingFaction ? controllingFaction.name : 'Rival Enforcers',
      60 + selectedTerritory.fortificationLevel * 10,
      readyCrew.map(m => m.id),
      state,
      selectedTerritory.dailyRevenue * 15,
      25
    );

    onUpdateState(s => ({
      ...s,
      activeTacticalBattle: battle
    }));
  };

  // Fortify Turf
  const handleFortifyTurf = () => {
    if (!selectedTerritory || state.cash < 5000) return;
    sounds.playCash();

    onUpdateState(s => ({
      ...s,
      cash: s.cash - 5000,
      territories: s.territories.map(t =>
        t.id === selectedTerritory.id
          ? { ...t, fortificationLevel: Math.min(5, t.fortificationLevel + 1) }
          : t
      )
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header and Region Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-display font-bold text-neutral-100 flex items-center gap-2">
            <MapPin className="text-purple-400" size={24} />
            <span>Regional Turf & Strategic Map</span>
          </h2>
          <p className="text-xs text-neutral-400 font-mono mt-0.5">
            20+ strategic territories yielding daily tribute, front cover, and tactical leverage.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-1 bg-neutral-900 border border-neutral-800 p-1 rounded font-mono text-xs">
          {[
            { id: 'all', label: 'All Sectors' },
            { id: 'eastern_port', label: 'Eastern Port' },
            { id: 'hua_dong', label: 'Hua Dong' },
            { id: 'northern_territories', label: 'North Territories' },
            { id: 'southern_republic', label: 'South Republic' },
            { id: 'iron_ridge', label: 'Iron Ridge' },
            { id: 'silver_delta', label: 'Silver Delta' }
          ].map(r => (
            <button
              key={r.id}
              onClick={() => {
                sounds.playClick();
                setFilterRegion(r.id);
              }}
              className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                filterRegion === r.id
                  ? 'bg-purple-600 text-white font-bold'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid: Territories Cards & Sector Inspection Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Territory Cards */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[700px] overflow-y-auto pr-1">
          {filteredTerritories.map(territory => {
            const isSelected = selectedTerritory?.id === territory.id;
            const isPlayerControlled = territory.controllingFactionId === null;
            const faction = territory.controllingFactionId
              ? state.factions.find(f => f.id === territory.controllingFactionId)
              : null;

            const territoryImage = getTerritoryVisual(territory.id, territory.type, territory.regionId);

            return (
              <div
                key={territory.id}
                onClick={() => {
                  sounds.playClick();
                  setSelectedTerritoryId(territory.id);
                }}
                className={`p-3.5 rounded border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-neutral-900 border-purple-500 ring-1 ring-purple-500/40 shadow-lg'
                    : 'bg-neutral-950/80 border-neutral-800 hover:border-neutral-700 hover:bg-neutral-900/60'
                }`}
              >
                <div>
                  {/* Territory Scenic Image */}
                  <div className="w-full h-24 rounded overflow-hidden border border-neutral-800 mb-2.5 relative bg-neutral-950">
                    <EntityImage
                      src={territoryImage}
                      alt={territory.name}
                      type="location"
                      id={territory.id}
                      category={territory.type}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent opacity-80" />
                    <span className="absolute bottom-1.5 left-2 text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/70 text-purple-300 border border-purple-900/50">
                      {territory.type}
                    </span>
                  </div>

                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <div>
                      <span className="font-display font-bold text-sm text-neutral-100 block">
                        {territory.name}
                      </span>
                      <span className="text-[10px] font-mono text-neutral-500">
                        {territory.regionId.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>

                    <span className="text-emerald-400 font-mono text-xs font-bold shrink-0">
                      +${territory.dailyRevenue.toLocaleString()}/d
                    </span>
                  </div>

                  <div className="text-[11px] font-mono mb-2">
                    {isPlayerControlled ? (
                      <span className="text-emerald-400 font-bold flex items-center gap-1">
                        <CheckCircle2 size={12} /> Under Your Control
                      </span>
                    ) : (
                      <span className="text-neutral-400">
                        Controlled By:{' '}
                        <strong style={{ color: faction?.color || '#a855f7' }}>
                          {faction?.name || 'Rival Faction'}
                        </strong>
                      </span>
                    )}
                  </div>
                </div>

                <div className="pt-2 border-t border-neutral-800/80 flex items-center justify-between text-[10px] font-mono text-neutral-400">
                  <span>Pop: {territory.population.toLocaleString()}</span>
                  <span>Fortification: Lv.{territory.fortificationLevel}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Sector Inspection Bay */}
        <div className="lg:col-span-5">
          {selectedTerritory ? (
            <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-5 space-y-4 sticky top-16">
              <div>
                {/* Large Detailed Scenic Header */}
                <div className="w-full h-40 rounded-lg overflow-hidden border border-neutral-800 mb-3 relative bg-neutral-950">
                  <EntityImage
                    src={getTerritoryVisual(selectedTerritory.id, selectedTerritory.type, selectedTerritory.regionId)}
                    alt={selectedTerritory.name}
                    type="location"
                    id={selectedTerritory.id}
                    category={selectedTerritory.type}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/20 to-transparent" />
                  <div className="absolute bottom-2.5 left-3">
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-black/80 text-purple-300 border border-purple-800/50">
                      {selectedTerritory.type} · SECTOR DOSSIER
                    </span>
                  </div>
                </div>

                <h3 className="text-xl font-display font-bold text-neutral-100">
                  {selectedTerritory.name}
                </h3>
                <div className="text-xs font-mono text-neutral-400 mt-0.5">
                  Region: {selectedTerritory.regionId.replace('_', ' ').toUpperCase()}
                </div>
              </div>

              {/* Economic & Strategic Metrics */}
              <div className="bg-neutral-950 p-4 rounded border border-neutral-800 space-y-2.5 font-mono text-xs">
                <div className="flex justify-between">
                  <span className="text-neutral-400">Daily Revenue Tribute:</span>
                  <span className="text-emerald-400 font-bold">
                    +${selectedTerritory.dailyRevenue.toLocaleString()}/day
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Civilian Population:</span>
                  <span className="text-neutral-200">
                    {selectedTerritory.population.toLocaleString()} residents
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Police Patrol Presence:</span>
                  <span className="text-amber-400 font-bold">
                    {selectedTerritory.policePresence}% Heat
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Fortification Defensive Level:</span>
                  <span className="text-blue-400 font-bold">
                    Tier {selectedTerritory.fortificationLevel}/5
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Controlling Syndicate:</span>
                  <span className="font-bold text-neutral-100">
                    {selectedTerritory.controllingFactionId === null
                      ? '★ YOUR ORGANIZATION'
                      : controllingFaction?.name}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-2 pt-2">
                {selectedTerritory.controllingFactionId !== null ? (
                  <button
                    onClick={handleLaunchConquest}
                    className="w-full py-3 rounded font-display font-bold text-xs uppercase tracking-wider bg-rose-700 hover:bg-rose-600 text-white transition-colors flex items-center justify-center gap-2 shadow-lg cursor-pointer"
                  >
                    <Crosshair size={15} />
                    <span>Launch Armed Turf Conquest</span>
                  </button>
                ) : (
                  <button
                    disabled={selectedTerritory.fortificationLevel >= 5 || state.cash < 5000}
                    onClick={handleFortifyTurf}
                    className="w-full py-2.5 rounded font-mono text-xs bg-neutral-950 border border-neutral-700 hover:border-purple-500 text-purple-300 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Shield size={14} />
                    <span>Fortify Perimeter ($5,000)</span>
                  </button>
                )}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};
