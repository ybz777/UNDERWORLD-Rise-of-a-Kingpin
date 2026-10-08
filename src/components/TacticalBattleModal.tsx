import React, { useState } from 'react';
import { GameState, TacticalBattleState } from '../game/types';
import { advanceTacticalBattle } from '../game/combatSimulation';
import { sounds } from '../game/audio';
import {
  Shield,
  Crosshair,
  Award,
  AlertOctagon,
  TrendingUp,
  Skull,
  CheckCircle2,
  XCircle,
  Zap
} from 'lucide-react';

interface TacticalBattleModalProps {
  battle: TacticalBattleState;
  state: GameState;
  onFinishBattle: (battle: TacticalBattleState) => void;
}

export const TacticalBattleModal: React.FC<TacticalBattleModalProps> = ({
  battle,
  state,
  onFinishBattle
}) => {
  const [currentBattle, setCurrentBattle] = useState<TacticalBattleState>(battle);
  const [selectedTactic, setSelectedTactic] = useState<TacticalBattleState['currentTactic']>('Aggressive Assault');

  const handleNextTurn = () => {
    const updated = advanceTacticalBattle(currentBattle, selectedTactic);
    setCurrentBattle(updated);
  };

  const handleComplete = () => {
    onFinishBattle(currentBattle);
  };

  const momentumPercent = Math.min(100, Math.max(0, (currentBattle.momentum + 100) / 2));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="w-full max-w-3xl bg-neutral-900 border border-neutral-700 rounded-lg shadow-2xl overflow-hidden flex flex-col my-auto max-h-[92vh]">
        {/* Tactical Engagement Banner */}
        <div className="w-full h-36 sm:h-44 overflow-hidden border-b border-neutral-800 relative bg-neutral-950 shrink-0">
          <img
            src="/src/assets/images/underworld_crisis_standoff_1791441248561.jpg"
            alt="Tactical Standoff Engagement"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent" />
          <div className="absolute bottom-2.5 left-4 flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-rose-950/90 text-rose-300 border border-rose-800/80 font-bold flex items-center gap-1">
              <Crosshair size={12} className="animate-pulse" />
              <span>ACTIVE COMBAT ENGAGEMENT</span>
            </span>
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-black/80 text-neutral-300 border border-neutral-800">
              VS {currentBattle.enemyName}
            </span>
          </div>
        </div>

        {/* Header */}
        <div className="bg-neutral-950 border-b border-neutral-800 p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded bg-rose-950/80 border border-rose-700 text-rose-400">
              <Crosshair size={24} />
            </div>
            <div>
              <div className="text-xs font-mono text-neutral-400">
                TACTICAL ENGAGEMENT · TURN {currentBattle.turn}/{currentBattle.maxTurns}
              </div>
              <h2 className="text-lg sm:text-xl font-display font-bold text-neutral-100">
                {currentBattle.battleName}
              </h2>
            </div>
          </div>

          <div className="text-right font-mono text-xs">
            <div className="text-neutral-400">Enemy: <span className="text-rose-400 font-bold">{currentBattle.enemyName}</span></div>
            <div className="text-neutral-400">Estimated Win Odds: <span className="text-amber-400 font-bold">{currentBattle.estimatedWinRate}%</span></div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 space-y-5 overflow-y-auto flex-1">
          {/* Combat Momentum Bar */}
          <div className="bg-neutral-950 border border-neutral-800 p-3 rounded space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-emerald-400 font-bold">YOUR FIREPOWER ({currentBattle.playerStrength})</span>
              <span className="text-neutral-400">BATTLE MOMENTUM</span>
              <span className="text-rose-400 font-bold">HOSTILE FORCE ({currentBattle.enemyStrength})</span>
            </div>
            <div className="w-full h-3 bg-neutral-900 rounded-full overflow-hidden flex border border-neutral-800">
              <div
                className="h-full bg-emerald-500 transition-all duration-300"
                style={{ width: `${momentumPercent}%` }}
              />
              <div
                className="h-full bg-rose-600 transition-all duration-300"
                style={{ width: `${100 - momentumPercent}%` }}
              />
            </div>
            <div className="flex justify-between text-[11px] font-mono text-neutral-400">
              <span>Friendly Casualties: {currentBattle.playerCasualties}</span>
              <span>Hostile Casualties: {currentBattle.enemyCasualties}</span>
            </div>
          </div>

          {/* Underdog Victory Banner if triggered */}
          {currentBattle.result === 'Underdog Victory' && (
            <div className="p-4 rounded bg-amber-950/80 border border-amber-600/80 text-amber-200 animate-pulse flex items-center gap-3">
              <Award size={28} className="text-amber-400 shrink-0" />
              <div>
                <h4 className="font-display font-bold text-sm sm:text-base tracking-wide text-amber-300">
                  AGAINST ALL ODDS VICTORY!
                </h4>
                <p className="text-xs text-amber-200/90 font-sans mt-0.5">
                  Overcame a heavily favored enemy with under 30% initial probability! Earned massive notoriety and +15 extra prestige.
                </p>
              </div>
            </div>
          )}

          {/* Tactical Event Log Timeline */}
          <div className="bg-neutral-950/80 border border-neutral-800 rounded p-3 h-48 overflow-y-auto space-y-1.5 font-mono text-xs text-neutral-300">
            {currentBattle.log.map((entry, idx) => (
              <div key={idx} className="leading-relaxed border-b border-neutral-900/60 pb-1">
                {entry}
              </div>
            ))}
          </div>

          {/* Tactics Selection or Completion */}
          {!currentBattle.isFinished ? (
            <div className="space-y-3">
              <div className="text-xs font-mono text-neutral-400 uppercase tracking-wider">
                Select Squad Command For Next Exchange:
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {(
                  [
                    'Aggressive Assault',
                    'Defensive Fortification',
                    'Flank Maneuver',
                    'Suppressing Fire',
                    'Tactical Withdrawal'
                  ] as const
                ).map(tac => (
                  <button
                    key={tac}
                    onClick={() => {
                      sounds.playClick();
                      setSelectedTactic(tac);
                    }}
                    className={`p-2.5 rounded border text-left text-xs font-mono transition-all ${
                      selectedTactic === tac
                        ? 'bg-neutral-800 border-amber-500 text-amber-300'
                        : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900'
                    }`}
                  >
                    <div className="font-bold">{tac}</div>
                  </button>
                ))}
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={handleNextTurn}
                  className="px-5 py-2.5 rounded font-display font-bold text-xs uppercase tracking-wider bg-rose-700 hover:bg-rose-600 text-white transition-colors flex items-center gap-2 cursor-pointer shadow-lg"
                >
                  <Zap size={14} fill="currentColor" />
                  Order Squad Action (Turn {currentBattle.turn})
                </button>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-neutral-950 border border-neutral-800 rounded flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <div className="font-display font-bold text-base text-neutral-100 flex items-center gap-2">
                  {currentBattle.result?.includes('Victory') ? (
                    <CheckCircle2 size={20} className="text-emerald-400" />
                  ) : (
                    <XCircle size={20} className="text-rose-500" />
                  )}
                  <span>BATTLE CONCLUDED: {currentBattle.result}</span>
                </div>
                <div className="text-xs font-mono text-neutral-400 mt-1">
                  Rewards:{' '}
                  <span className="text-emerald-400 font-bold">
                    +${currentBattle.rewardCash.toLocaleString()}
                  </span>{' '}
                  ·{' '}
                  <span className="text-amber-400 font-bold">
                    +{currentBattle.rewardRep} Rep
                  </span>
                </div>
              </div>

              <button
                onClick={handleComplete}
                className="px-6 py-2.5 rounded font-display font-bold text-xs uppercase tracking-wider bg-amber-600 hover:bg-amber-500 text-neutral-950 transition-colors cursor-pointer shadow-lg"
              >
                Return to Command
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
