import React, { useState } from 'react';
import { Business, GameState } from '../game/types';
import { sounds } from '../game/audio';
import { getBusinessVisual } from '../game/visuals';
import { EntityImage } from '../components/EntityImage';
import {
  Briefcase,
  TrendingUp,
  DollarSign,
  Shield,
  Users,
  CheckCircle2,
  Lock,
  ArrowUpCircle
} from 'lucide-react';

interface BusinessesScreenProps {
  state: GameState;
  onUpdateState: (updater: (prev: GameState) => GameState) => void;
}

export const BusinessesScreen: React.FC<BusinessesScreenProps> = ({
  state,
  onUpdateState
}) => {
  const [filterMode, setFilterMode] = useState<'owned' | 'all'>('all');

  const ownedBusinesses = state.businesses.filter(b => b.isOwned);
  const totalBusinessIncome = ownedBusinesses.reduce((acc, b) => acc + b.dailyIncome, 0);
  const totalBusinessExpense = ownedBusinesses.reduce((acc, b) => acc + b.dailyExpense, 0);
  const netBusinessIncome = totalBusinessIncome - totalBusinessExpense;

  // Buy Business
  const handleBuyBusiness = (business: Business) => {
    if (state.cash < business.purchaseCost || state.reputation < business.reputationRequired) return;

    sounds.playCash();
    onUpdateState(s => ({
      ...s,
      cash: s.cash - business.purchaseCost,
      businesses: s.businesses.map(b =>
        b.id === business.id ? { ...b, isOwned: true } : b
      ),
      statistics: {
        ...s.statistics,
        totalMoneySpent: s.statistics.totalMoneySpent + business.purchaseCost
      }
    }));
  };

  // Upgrade Business Tier
  const handleUpgradeBusiness = (business: Business) => {
    const upgradeCost = Math.round(business.purchaseCost * 0.7);
    if (state.cash < upgradeCost) return;

    sounds.playCash();
    onUpdateState(s => ({
      ...s,
      cash: s.cash - upgradeCost,
      businesses: s.businesses.map(b =>
        b.id === business.id
          ? {
              ...b,
              tier: b.tier + 1,
              dailyIncome: Math.round(b.dailyIncome * 1.45),
              dailyExpense: Math.round(b.dailyExpense * 1.25),
              heatReduction: b.heatReduction + 4
            }
          : b
      )
    }));
  };

  // Assign Manager
  const handleAssignManager = (businessId: string, memberId: string | null) => {
    sounds.playClick();
    onUpdateState(s => ({
      ...s,
      businesses: s.businesses.map(b =>
        b.id === businessId ? { ...b, managerMemberId: memberId } : b
      )
    }));
  };

  const displayedBusinesses = state.businesses.filter(b => {
    if (filterMode === 'owned') return b.isOwned;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header and Aggregate Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-display font-bold text-neutral-100 flex items-center gap-2">
            <Briefcase className="text-blue-400" size={24} />
            <span>Commercial Fronts & Legitimate Enterprises</span>
          </h2>
          <p className="text-xs text-neutral-400 font-mono mt-0.5">
            Launder capital, generate steady cash flow, and reduce municipal police heat.
          </p>
        </div>

        <div className="flex items-center gap-1 bg-neutral-900 border border-neutral-800 p-1 rounded font-mono text-xs">
          <button
            onClick={() => {
              sounds.playClick();
              setFilterMode('all');
            }}
            className={`px-3 py-1 rounded transition-colors cursor-pointer ${
              filterMode === 'all'
                ? 'bg-blue-600 text-white font-bold'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            All Commercial Opportunities
          </button>
          <button
            onClick={() => {
              sounds.playClick();
              setFilterMode('owned');
            }}
            className={`px-3 py-1 rounded transition-colors cursor-pointer ${
              filterMode === 'owned'
                ? 'bg-blue-600 text-white font-bold'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Portfolio ({ownedBusinesses.length})
          </button>
        </div>
      </div>

      {/* Financial Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-neutral-950 border border-neutral-800 p-3.5 rounded font-mono text-xs">
        <div>
          <span className="text-neutral-500 text-[10px] uppercase block">Gross Daily Income</span>
          <span className="text-emerald-400 font-bold text-base">
            +${totalBusinessIncome.toLocaleString()}/day
          </span>
        </div>
        <div>
          <span className="text-neutral-500 text-[10px] uppercase block">Operating Expenses</span>
          <span className="text-rose-400 font-bold text-base">
            -${totalBusinessExpense.toLocaleString()}/day
          </span>
        </div>
        <div>
          <span className="text-neutral-500 text-[10px] uppercase block">Net Commercial Yield</span>
          <span className="text-blue-400 font-bold text-base">
            +${netBusinessIncome.toLocaleString()}/day
          </span>
        </div>
      </div>

      {/* Grid of Business Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {displayedBusinesses.map(biz => {
          const canAfford = state.cash >= biz.purchaseCost;
          const meetsRep = state.reputation >= biz.reputationRequired;
          const manager = state.members.find(m => m.id === biz.managerMemberId);
          const netYield = biz.dailyIncome - biz.dailyExpense;
          const bizImage = getBusinessVisual(biz.id, biz.type);

          return (
            <div
              key={biz.id}
              className={`p-4 rounded-lg border flex flex-col justify-between transition-all ${
                biz.isOwned
                  ? 'bg-neutral-900 border-blue-500/60 shadow-lg'
                  : 'bg-neutral-950/80 border-neutral-800'
              }`}
            >
              <div>
                {/* Business Facade / Interior Asset */}
                <div className="w-full h-28 rounded overflow-hidden border border-neutral-800 mb-3 relative bg-neutral-950">
                  <EntityImage
                    src={bizImage}
                    alt={biz.name}
                    type="business"
                    id={biz.id}
                    category={biz.type}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/90 via-transparent to-transparent" />
                  <span className="absolute bottom-1.5 left-2 text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/80 text-blue-300 border border-blue-900/50">
                    {biz.type} · Tier {biz.tier}
                  </span>
                </div>

                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <h3 className="font-display font-bold text-sm text-neutral-100">
                      {biz.name}
                    </h3>
                  </div>

                  {biz.isOwned ? (
                    <span className="text-[10px] font-mono text-emerald-400 font-bold flex items-center gap-1 shrink-0">
                      <CheckCircle2 size={12} /> OWNED
                    </span>
                  ) : (
                    <span className="font-mono text-xs font-bold text-neutral-300 shrink-0">
                      ${biz.purchaseCost.toLocaleString()}
                    </span>
                  )}
                </div>

                <div className="bg-neutral-950 p-2.5 rounded border border-neutral-800 text-[11px] font-mono space-y-1 text-neutral-300 mb-3">
                  <div className="flex justify-between">
                    <span>Daily Revenue:</span>
                    <span className="text-emerald-400">+${biz.dailyIncome}/d</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Operating Cost:</span>
                    <span className="text-rose-400">-${biz.dailyExpense}/d</span>
                  </div>
                  <div className="flex justify-between font-bold pt-1 border-t border-neutral-800/80">
                    <span>Net Profit:</span>
                    <span className="text-blue-400">+${netYield}/d</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] font-mono text-neutral-400 mb-3">
                  <span>Police Heat Dampener: -{biz.heatReduction}%</span>
                  <span>Employees: {biz.employeeCount}</span>
                </div>
              </div>

              {/* Actions / Management */}
              <div className="pt-2 border-t border-neutral-800">
                {biz.isOwned ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <label className="text-neutral-400 text-[10px]">Assigned Manager:</label>
                      <select
                        value={biz.managerMemberId || ''}
                        onChange={e => handleAssignManager(biz.id, e.target.value || null)}
                        className="bg-neutral-950 border border-neutral-700 text-neutral-200 rounded px-1.5 py-0.5 text-[11px] focus:outline-none"
                      >
                        <option value="">-- None --</option>
                        {state.members.map(m => (
                          <option key={m.id} value={m.id}>
                            {m.name} ({m.role})
                          </option>
                        ))}
                      </select>
                    </div>

                    <button
                      disabled={state.cash < Math.round(biz.purchaseCost * 0.7)}
                      onClick={() => handleUpgradeBusiness(biz)}
                      className="w-full py-1.5 rounded font-mono text-xs bg-neutral-950 hover:bg-neutral-800 border border-neutral-700 text-blue-300 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <ArrowUpCircle size={13} />
                      <span>Upgrade Tier (+${Math.round(biz.dailyIncome * 0.45)}/d) · ${Math.round(biz.purchaseCost * 0.7).toLocaleString()}</span>
                    </button>
                  </div>
                ) : (
                  <div>
                    {!meetsRep ? (
                      <div className="text-[11px] font-mono text-rose-400 flex items-center gap-1">
                        <Lock size={12} /> Requires Reputation {biz.reputationRequired}
                      </div>
                    ) : (
                      <button
                        disabled={!canAfford}
                        onClick={() => handleBuyBusiness(biz)}
                        className={`w-full py-2 rounded font-display font-bold text-xs uppercase tracking-wider transition-colors ${
                          canAfford
                            ? 'bg-blue-600 hover:bg-blue-500 text-white cursor-pointer shadow-md'
                            : 'bg-neutral-800 text-neutral-500 cursor-not-allowed opacity-60'
                        }`}
                      >
                        Acquire Business Entity
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
