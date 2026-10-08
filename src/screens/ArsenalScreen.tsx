import React, { useState } from 'react';
import { GameState, WeaponCategory, WeaponItem, WeaponRarity } from '../game/types';
import { sounds } from '../game/audio';
import { PHOTO_ASSETS } from '../game/visuals';
import { EntityImage } from '../components/EntityImage';
import {
  Shield,
  Wrench,
  Award,
  Crosshair,
  User,
  Activity,
  DollarSign,
  Flame,
  Check,
  ChevronRight,
  Sword
} from 'lucide-react';

interface ArsenalScreenProps {
  state: GameState;
  onUpdateState: (updater: (prev: GameState) => GameState) => void;
}

export const ArsenalScreen: React.FC<ArsenalScreenProps> = ({
  state,
  onUpdateState
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedWeaponId, setSelectedWeaponId] = useState<string | null>(
    state.weapons[0]?.id || null
  );
  const [sortBy, setSortBy] = useState<'value' | 'condition' | 'kills' | 'deployments'>('value');

  const selectedWeapon = state.weapons.find(w => w.id === selectedWeaponId) || state.weapons[0];

  // Filtering & Sorting
  const filteredWeapons = state.weapons
    .filter(w => {
      if (selectedCategory === 'ALL') return true;
      if (selectedCategory === 'MELEE') return w.category === 'Melee Weapons';
      return w.category.toUpperCase().includes(selectedCategory);
    })
    .sort((a, b) => {
      if (sortBy === 'condition') return b.condition - a.condition;
      if (sortBy === 'kills') return b.kills - a.kills;
      if (sortBy === 'deployments') return b.deployments - a.deployments;
      return b.value - a.value;
    });

  // Repair action
  const handleRepairWeapon = (weapon: WeaponItem) => {
    if (weapon.condition >= 98) return;
    const repairCost = Math.round((100 - weapon.condition) * (weapon.value * 0.003) + 120);
    if (state.cash < repairCost) return;

    sounds.playGunRack();
    onUpdateState(s => ({
      ...s,
      cash: s.cash - repairCost,
      weapons: s.weapons.map(w =>
        w.id === weapon.id
          ? {
              ...w,
              condition: 98,
              reliability: Math.min(100, w.reliability + 4),
              repairs: w.repairs + 1
            }
          : w
      ),
      statistics: {
        ...s.statistics,
        weaponsRepaired: s.statistics.weaponsRepaired + 1,
        totalMoneySpent: s.statistics.totalMoneySpent + repairCost
      }
    }));
  };

  // Reassign owner action
  const handleAssignOwner = (weaponId: string, memberId: string | null) => {
    sounds.playClick();
    onUpdateState(s => {
      const updatedMembers = s.members.map(m => {
        if (m.id === memberId) {
          return { ...m, assignedWeaponId: weaponId };
        }
        if (m.assignedWeaponId === weaponId && m.id !== memberId) {
          return { ...m, assignedWeaponId: null };
        }
        return m;
      });

      const updatedWeapons = s.weapons.map(w => {
        if (w.id === weaponId) {
          return { ...w, assignedMemberId: memberId };
        }
        if (memberId && w.assignedMemberId === memberId && w.id !== weaponId) {
          return { ...w, assignedMemberId: null };
        }
        return w;
      });

      return {
        ...s,
        members: updatedMembers,
        weapons: updatedWeapons
      };
    });
  };

  const getRarityBadge = (rarity: WeaponRarity) => {
    switch (rarity) {
      case 'Legendary':
        return 'text-amber-300 border-amber-500 bg-amber-950/70 font-bold';
      case 'Elite':
        return 'text-rose-400 border-rose-500 bg-rose-950/70';
      case 'Very Rare':
        return 'text-purple-400 border-purple-500 bg-purple-950/70';
      case 'Rare':
        return 'text-blue-400 border-blue-500 bg-blue-950/70';
      case 'Uncommon':
        return 'text-emerald-400 border-emerald-500 bg-emerald-950/70';
      default:
        return 'text-neutral-400 border-neutral-700 bg-neutral-900';
    }
  };

  return (
    <div className="space-y-6">
      {/* Visual Header */}
      <div className="relative rounded-lg overflow-hidden border border-neutral-800 bg-neutral-900 shadow-xl">
        <img
          src={PHOTO_ASSETS.tacticalArmory}
          alt="Syndicate Tactical Armory"
          referrerPolicy="no-referrer"
          className="w-full h-36 sm:h-44 object-cover opacity-45"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/70 to-transparent p-4 sm:p-6 flex flex-col justify-end">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-amber-500 uppercase tracking-wider mb-1">
                <span>TACTICAL ARSENAL & WEAPON REPOSITORY</span>
                <span aria-hidden="true">·</span>
                <span>{state.weapons.length} REGISTERED WEAPONS</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-display font-bold text-neutral-100">
                Syndicate Firearms & Munitions Bay
              </h2>
            </div>
            <div className="font-mono text-xs text-neutral-400">
              Total Armory Valuation:{' '}
              <span className="text-emerald-400 font-bold">
                ${state.weapons.reduce((acc, w) => acc + w.value, 0).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Sorting */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-neutral-950 border border-neutral-800 p-2 rounded">
        {/* Category Tabs */}
        <div className="flex flex-wrap items-center gap-1 font-mono text-xs">
          {['ALL', 'MELEE', 'PISTOLS', 'SMGS', 'ASSAULT', 'BATTLE', 'SNIPER', 'SHOTGUN', 'MACHINE', 'SPECIAL'].map(
            cat => (
              <button
                key={cat}
                onClick={() => {
                  sounds.playClick();
                  setSelectedCategory(cat);
                }}
                className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-amber-600 text-neutral-950 font-bold'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                {cat}
              </button>
            )
          )}
        </div>

        {/* Sort Selector */}
        <div className="flex items-center gap-2 font-mono text-xs text-neutral-400">
          <span>SORT BY:</span>
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as any)}
            className="bg-neutral-900 border border-neutral-700 text-neutral-200 rounded px-2 py-1 focus:outline-none cursor-pointer"
          >
            <option value="value">Highest Value</option>
            <option value="condition">Best Condition</option>
            <option value="kills">Most Kills</option>
            <option value="deployments">Deployments</option>
          </select>
        </div>
      </div>

      {/* Grid: Arsenal Cards & Inspection Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left List of Weapons */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[720px] overflow-y-auto pr-1">
          {filteredWeapons.map(weapon => {
            const isSelected = selectedWeapon?.id === weapon.id;
            const assignedMember = state.members.find(m => m.id === weapon.assignedMemberId);

            return (
              <div
                key={weapon.id}
                onClick={() => {
                  sounds.playClick();
                  setSelectedWeaponId(weapon.id);
                }}
                className={`p-3 rounded border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-neutral-900 border-amber-500 ring-1 ring-amber-500/40 shadow-lg'
                    : 'bg-neutral-950/80 border-neutral-800 hover:border-neutral-700 hover:bg-neutral-900/60'
                }`}
              >
                <div>
                  {/* Weapon Graphic Banner */}
                  <div className="w-full h-24 bg-neutral-950 rounded overflow-hidden border border-neutral-800 mb-2 flex items-center justify-center p-1">
                    <EntityImage
                      src={weapon.image}
                      alt={weapon.model}
                      type="weapon"
                      category={weapon.category}
                      model={weapon.model}
                      className="w-full h-full object-contain"
                    />
                  </div>

                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-display font-bold text-xs text-neutral-100">
                          {weapon.model}
                        </span>
                        <span className={`text-[9px] font-mono px-1 py-0.2 rounded border ${getRarityBadge(weapon.rarity)}`}>
                          {weapon.rarity}
                        </span>
                        {weapon.isVeteranWeapon && (
                          <span title="Veteran Weapon">
                            <Award size={12} className="text-amber-400 shrink-0" />
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] font-mono text-neutral-500 mt-0.5">
                        {weapon.id} · {weapon.category}
                      </div>
                    </div>
                    <span className="font-mono text-xs font-bold text-emerald-400 shrink-0">
                      ${weapon.value.toLocaleString()}
                    </span>
                  </div>

                  {/* Condition Progress Bar */}
                  <div className="space-y-1 mb-2">
                    <div className="flex justify-between text-[10px] font-mono">
                      <span className="text-neutral-400">Condition</span>
                      <span
                        className={
                          weapon.condition > 75
                            ? 'text-emerald-400 font-bold'
                            : weapon.condition > 40
                            ? 'text-amber-400 font-bold'
                            : 'text-rose-500 font-bold animate-pulse'
                        }
                      >
                        {weapon.condition}%
                      </span>
                    </div>
                    <div className="w-full bg-neutral-900 h-1.5 rounded-full overflow-hidden border border-neutral-800">
                      <div
                        className={`h-full ${
                          weapon.condition > 75
                            ? 'bg-emerald-500'
                            : weapon.condition > 40
                            ? 'bg-amber-500'
                            : 'bg-rose-500'
                        }`}
                        style={{ width: `${weapon.condition}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-neutral-800/80 flex items-center justify-between text-[10px] font-mono text-neutral-400">
                  <div className="flex items-center gap-1">
                    <User size={11} />
                    <span className="text-neutral-300">
                      {assignedMember ? assignedMember.name : 'Unassigned'}
                    </span>
                  </div>
                  <div>
                    <span>{weapon.kills} Kills · {weapon.deployments} Ops</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Inspection Bay */}
        <div className="lg:col-span-5">
          {selectedWeapon ? (
            <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-5 space-y-4 sticky top-16">
              <div>
                {/* Large Weapon Graphic */}
                <div className="w-full h-44 bg-neutral-950 rounded-lg overflow-hidden border border-neutral-800 mb-3 p-2 flex items-center justify-center">
                  <EntityImage
                    src={selectedWeapon.image}
                    alt={selectedWeapon.model}
                    type="weapon"
                    category={selectedWeapon.category}
                    model={selectedWeapon.model}
                    className="w-full h-full object-contain"
                  />
                </div>

                <div className="flex items-center justify-between text-xs font-mono text-neutral-500 mb-1">
                  <span>SERIAL: {selectedWeapon.id}</span>
                  <span className={`px-1.5 py-0.5 rounded border text-[10px] ${getRarityBadge(selectedWeapon.rarity)}`}>
                    {selectedWeapon.rarity}
                  </span>
                </div>
                <h3 className="text-xl font-display font-bold text-neutral-100 flex items-center gap-2">
                  <span>{selectedWeapon.model}</span>
                  {selectedWeapon.isVeteranWeapon && (
                    <span className="text-[10px] font-mono uppercase bg-amber-950 text-amber-300 border border-amber-600 px-1.5 py-0.5 rounded font-bold">
                      VETERAN WEAPON
                    </span>
                  )}
                </h3>
                <div className="text-xs font-mono text-neutral-400 mt-0.5">
                  Category: {selectedWeapon.category} · Caliber: {selectedWeapon.ammoType.replace('_', ' ')}
                </div>
              </div>

              {/* Stat Meters */}
              <div className="space-y-2.5 font-mono text-xs bg-neutral-950 p-4 rounded border border-neutral-800">
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] text-neutral-400">
                    <span>Damage Output</span>
                    <span className="text-rose-400 font-bold">{selectedWeapon.damage}/100</span>
                  </div>
                  <div className="w-full bg-neutral-900 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-rose-500 h-full" style={{ width: `${selectedWeapon.damage}%` }} />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] text-neutral-400">
                    <span>Accuracy Index</span>
                    <span className="text-blue-400 font-bold">{selectedWeapon.accuracy}/100</span>
                  </div>
                  <div className="w-full bg-neutral-900 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-blue-500 h-full" style={{ width: `${selectedWeapon.accuracy}%` }} />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] text-neutral-400">
                    <span>Mechanical Reliability</span>
                    <span className="text-emerald-400 font-bold">{selectedWeapon.reliability}/100</span>
                  </div>
                  <div className="w-full bg-neutral-900 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full" style={{ width: `${selectedWeapon.reliability}%` }} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-neutral-800/80 text-[11px]">
                  <div>Effective Range: <strong className="text-neutral-200">{selectedWeapon.range}m</strong></div>
                  <div>Magazine: <strong className="text-neutral-200">{selectedWeapon.magCapacity > 0 ? `${selectedWeapon.magCapacity} rds` : 'N/A'}</strong></div>
                  <div>Rounds Fired: <strong className="text-neutral-200">{selectedWeapon.roundsFired}</strong></div>
                  <div>Weight: <strong className="text-neutral-200">{selectedWeapon.weight} kg</strong></div>
                </div>
              </div>

              {/* Maintenance & Repair Bay */}
              <div className="bg-neutral-950 p-3.5 rounded border border-neutral-800 flex items-center justify-between">
                <div>
                  <span className="text-xs font-mono text-neutral-400 block">Current Wear & Condition</span>
                  <span
                    className={`text-sm font-mono font-bold ${
                      selectedWeapon.condition > 80 ? 'text-emerald-400' : 'text-amber-400'
                    }`}
                  >
                    {selectedWeapon.condition}% Serviceable ({selectedWeapon.repairs} repairs)
                  </span>
                </div>

                {selectedWeapon.condition < 98 ? (
                  <button
                    onClick={() => handleRepairWeapon(selectedWeapon)}
                    className="px-3 py-1.5 rounded font-mono text-xs bg-neutral-800 hover:bg-neutral-700 text-amber-300 border border-neutral-700 transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Wrench size={13} />
                    <span>
                      Repair ($
                      {Math.round((100 - selectedWeapon.condition) * (selectedWeapon.value * 0.003) + 120)})
                    </span>
                  </button>
                ) : (
                  <span className="text-xs font-mono text-emerald-500 flex items-center gap-1">
                    <Check size={13} /> Pristine
                  </span>
                )}
              </div>

              {/* Assignment to Operative */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-neutral-400 block">
                  Assign Weapon to Operative:
                </label>
                <select
                  value={selectedWeapon.assignedMemberId || ''}
                  onChange={e => handleAssignOwner(selectedWeapon.id, e.target.value || null)}
                  className="w-full bg-neutral-950 border border-neutral-700 text-neutral-200 rounded p-2 text-xs font-mono cursor-pointer focus:outline-none"
                >
                  <option value="">-- In Armory Storage (Unassigned) --</option>
                  {state.members.map(member => (
                    <option key={member.id} value={member.id}>
                      {member.name} ({member.role}) {member.assignedWeaponId === selectedWeapon.id ? '★ Current' : ''}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};
