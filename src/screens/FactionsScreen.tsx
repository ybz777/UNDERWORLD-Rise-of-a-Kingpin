import React from 'react';
import { Faction, GameState } from '../game/types';
import { sounds } from '../game/audio';
import { getFactionEmblem } from '../game/visuals';
import { EntityImage } from '../components/EntityImage';
import {
  Users,
  Award,
  DollarSign,
  Shield,
  HeartHandshake,
  Flame,
  ChevronRight
} from 'lucide-react';

interface FactionsScreenProps {
  state: GameState;
  onUpdateState: (updater: (prev: GameState) => GameState) => void;
}

export const FactionsScreen: React.FC<FactionsScreenProps> = ({
  state,
  onUpdateState
}) => {
  // Diplomatic Gift
  const handleSendGift = (faction: Faction) => {
    if (state.cash < 5000) return;
    sounds.playCash();
    onUpdateState(s => ({
      ...s,
      cash: s.cash - 5000,
      factions: s.factions.map(f =>
        f.id === faction.id
          ? { ...f, relationWithPlayer: Math.min(100, f.relationWithPlayer + 18) }
          : f
      )
    }));
  };

  // Diplomatic Non-Aggression Truce
  const handleBrokerTruce = (faction: Faction) => {
    if (state.prestige < 15) return;
    sounds.playVictory();
    onUpdateState(s => ({
      ...s,
      prestige: s.prestige - 2,
      factions: s.factions.map(f =>
        f.id === faction.id
          ? { ...f, relationWithPlayer: Math.max(10, f.relationWithPlayer + 12) }
          : f
      )
    }));
  };

  // Demand Tribute
  const handleDemandTribute = (faction: Faction) => {
    sounds.playGunRack();
    const success = state.reputation > faction.militaryPower;
    const cashExtorted = success ? Math.round(faction.cash * 0.05) : 0;

    onUpdateState(s => ({
      ...s,
      cash: s.cash + cashExtorted,
      reputation: success ? Math.min(100, s.reputation + 4) : Math.max(0, s.reputation - 5),
      factions: s.factions.map(f =>
        f.id === faction.id
          ? {
              ...f,
              cash: Math.max(0, f.cash - cashExtorted),
              relationWithPlayer: Math.max(-100, f.relationWithPlayer - 25)
            }
          : f
      )
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-display font-bold text-neutral-100 flex items-center gap-2">
          <HeartHandshake className="text-amber-500" size={24} />
          <span>Regional Syndicates & Faction Diplomacy</span>
        </h2>
        <p className="text-xs text-neutral-400 font-mono mt-0.5">
          15 autonomous underworld organizations with distinct strategic agendas and military strength.
        </p>
      </div>

      {/* Grid of Factions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {state.factions.map(faction => {
          const relation = faction.relationWithPlayer;
          const relationColor =
            relation >= 25
              ? 'text-emerald-400'
              : relation >= -20
              ? 'text-neutral-300'
              : 'text-rose-400';

          const factionEmblem = getFactionEmblem(faction.id, faction.color);

          return (
            <div
              key={faction.id}
              className="bg-neutral-900 border border-neutral-800 p-4 rounded-lg flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg overflow-hidden border border-neutral-800 shrink-0 bg-neutral-950 p-1 flex items-center justify-center">
                      <EntityImage
                        src={factionEmblem}
                        alt={faction.name}
                        type="faction"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-sm text-neutral-100 flex items-center gap-1.5">
                        <span
                          className="w-2.5 h-2.5 rounded-full inline-block shrink-0"
                          style={{ backgroundColor: faction.color }}
                        />
                        <span>{faction.name}</span>
                      </h3>
                      <span className="text-[10px] font-mono text-neutral-400 block">
                        Leader: {faction.leader} · {faction.personality}
                      </span>
                    </div>
                  </div>

                  <div className="text-right font-mono text-xs shrink-0">
                    <span className={`font-bold block ${relationColor}`}>
                      {relation > 0 ? `+${relation}` : relation}
                    </span>
                    <span className="text-[10px] text-neutral-500 uppercase">Standing</span>
                  </div>
                </div>

                <p className="text-xs text-neutral-400 font-sans leading-relaxed mb-3">
                  {faction.ideology}
                </p>

                <div className="grid grid-cols-3 gap-2 bg-neutral-950 p-2.5 rounded border border-neutral-800 text-[11px] font-mono text-neutral-300 mb-3">
                  <div>Military: <strong className="text-rose-400">{faction.militaryPower}</strong></div>
                  <div>Economy: <strong className="text-emerald-400">{faction.economicPower}</strong></div>
                  <div>Influence: <strong className="text-blue-400">{faction.politicalInfluence}</strong></div>
                </div>
              </div>

              {/* Diplomatic Actions */}
              <div className="pt-2 border-t border-neutral-800 space-y-1.5">
                <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                  <button
                    disabled={state.cash < 5000}
                    onClick={() => handleSendGift(faction)}
                    className="p-1.5 rounded bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 hover:border-emerald-700 text-emerald-400 transition-colors cursor-pointer text-center"
                  >
                    Send Gift ($5,000)
                  </button>
                  <button
                    disabled={state.prestige < 15}
                    onClick={() => handleBrokerTruce(faction)}
                    className="p-1.5 rounded bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 hover:border-blue-700 text-blue-400 transition-colors cursor-pointer text-center"
                  >
                    Truce Pact (-2 P)
                  </button>
                </div>
                <button
                  onClick={() => handleDemandTribute(faction)}
                  className="w-full py-1.5 rounded bg-neutral-950 hover:bg-rose-950 border border-neutral-800 hover:border-rose-800 text-rose-400 font-mono text-[11px] transition-colors cursor-pointer text-center"
                >
                  Demand Protection Tribute
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
