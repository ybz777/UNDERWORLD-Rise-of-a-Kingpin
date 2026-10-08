import React from 'react';
import { GameState } from '../game/types';
import {
  TrendingUp,
  Award,
  DollarSign,
  Crosshair,
  Shield,
  Users,
  Activity,
  Flame
} from 'lucide-react';

interface StatisticsScreenProps {
  state: GameState;
}

export const StatisticsScreen: React.FC<StatisticsScreenProps> = ({ state }) => {
  const stats = state.statistics;
  const totalOps = stats.operationsRun || 1;
  const winRate = Math.round((stats.victories / totalOps) * 100);

  // Legacy Score calculation
  const legacyScore = Math.round(
    stats.daysSurvived * 10 +
    state.reputation * 15 +
    state.prestige * 20 +
    (state.cash / 5000) +
    state.weapons.length * 25 +
    state.members.length * 30 +
    stats.underdogVictories * 150 +
    stats.crisesOvercome * 100
  );

  return (
    <div className="space-y-6">
      {/* Header & Legacy Score */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-display font-bold text-neutral-100 flex items-center gap-2">
            <Activity className="text-amber-500" size={24} />
            <span>Syndicate Dossier & Career Analytics</span>
          </h2>
          <p className="text-xs text-neutral-400 font-mono mt-0.5">
            Lifetime operational records, treasury inflows, combat efficacy, and legacy standing.
          </p>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 px-4 py-2 rounded text-right font-mono">
          <div className="text-[10px] text-neutral-500 uppercase">CALCULATED KINGPIN LEGACY SCORE</div>
          <div className="text-xl font-bold text-amber-400 tabular-nums">
            {legacyScore.toLocaleString()} PTS
          </div>
        </div>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
        <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-lg">
          <div className="text-neutral-500 text-[10px] uppercase">LIFETIME CASH INFLOW</div>
          <div className="text-lg font-bold text-emerald-400 mt-1 tabular-nums">
            ${stats.totalMoneyEarned.toLocaleString()}
          </div>
          <div className="text-[10px] text-neutral-400 mt-0.5">
            Spent: ${stats.totalMoneySpent.toLocaleString()}
          </div>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-lg">
          <div className="text-neutral-500 text-[10px] uppercase">OPERATIONS RUN</div>
          <div className="text-lg font-bold text-neutral-100 mt-1 tabular-nums">
            {stats.operationsRun} Operations
          </div>
          <div className="text-[10px] text-neutral-400 mt-0.5">
            {stats.contractsCompleted} Completed ({winRate}% Win Rate)
          </div>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-lg">
          <div className="text-neutral-500 text-[10px] uppercase">TACTICAL VICTORIES</div>
          <div className="text-lg font-bold text-amber-300 mt-1 tabular-nums">
            {stats.victories} Won / {stats.defeats} Lost
          </div>
          <div className="text-[10px] text-amber-400 mt-0.5">
            {stats.underdogVictories} Against-All-Odds
          </div>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-lg">
          <div className="text-neutral-500 text-[10px] uppercase">CRISES OVERCOME</div>
          <div className="text-lg font-bold text-purple-400 mt-1 tabular-nums">
            {stats.crisesOvercome} Standoffs
          </div>
          <div className="text-[10px] text-neutral-400 mt-0.5">
            Days Survived: {stats.daysSurvived}
          </div>
        </div>
      </div>

      {/* Detailed Statistical Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Armory & Equipment Record */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-5 space-y-3 font-mono text-xs">
          <h3 className="text-xs font-mono uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
            <Shield size={14} className="text-amber-500" />
            <span>Armory & Procurement Records</span>
          </h3>

          <div className="space-y-2 bg-neutral-950 p-4 rounded border border-neutral-800">
            <div className="flex justify-between py-1 border-b border-neutral-900">
              <span className="text-neutral-400">Total Weapons Purchased:</span>
              <span className="text-neutral-100 font-bold">{stats.weaponsPurchased}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-neutral-900">
              <span className="text-neutral-400">Weapons Liquidated / Sold:</span>
              <span className="text-neutral-100 font-bold">{stats.weaponsSold}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-neutral-900">
              <span className="text-neutral-400">Weapons Repaired & Refurbished:</span>
              <span className="text-neutral-100 font-bold">{stats.weaponsRepaired}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-neutral-900">
              <span className="text-neutral-400">Current Arsenal Active Firearms:</span>
              <span className="text-emerald-400 font-bold">{state.weapons.length}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-neutral-400">Veteran Status Firearms:</span>
              <span className="text-amber-400 font-bold">
                {state.weapons.filter(w => w.isVeteranWeapon).length}
              </span>
            </div>
          </div>
        </div>

        {/* Notoriety & Peak Records */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-5 space-y-3 font-mono text-xs">
          <h3 className="text-xs font-mono uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
            <Flame size={14} className="text-rose-500" />
            <span>Peak Career Notoriety & Records</span>
          </h3>

          <div className="space-y-2 bg-neutral-950 p-4 rounded border border-neutral-800">
            <div className="flex justify-between py-1 border-b border-neutral-900">
              <span className="text-neutral-400">Peak Underworld Reputation:</span>
              <span className="text-amber-400 font-bold">{stats.highestReputation}/100</span>
            </div>
            <div className="flex justify-between py-1 border-b border-neutral-900">
              <span className="text-neutral-400">Peak Elite Prestige:</span>
              <span className="text-purple-400 font-bold">{stats.highestPrestige}/100</span>
            </div>
            <div className="flex justify-between py-1 border-b border-neutral-900">
              <span className="text-neutral-400">Peak Municipal Wanted Level:</span>
              <span className="text-rose-400 font-bold">{stats.highestWantedLevel}%</span>
            </div>
            <div className="flex justify-between py-1 border-b border-neutral-900">
              <span className="text-neutral-400">Single Largest Operation Payout:</span>
              <span className="text-emerald-400 font-bold">
                ${stats.biggestPayout.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-neutral-400">Operatives Enlisted / Lost:</span>
              <span className="text-neutral-100 font-bold">
                {stats.membersRecruited} hired / {stats.membersLost} fallen
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
