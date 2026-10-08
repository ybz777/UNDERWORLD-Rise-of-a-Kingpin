import React, { useState } from 'react';
import {
  Contract,
  GameState,
  Member
} from '../game/types';
import { sounds } from '../game/audio';
import { evaluateTeam, createCrisisScenario } from '../game/crisisEngine';
import { createTacticalBattle } from '../game/combatSimulation';
import { getOperationScene } from '../game/visuals';
import { EntityImage } from '../components/EntityImage';
import {
  Crosshair,
  ShieldAlert,
  AlertTriangle,
  Users,
  DollarSign,
  Award,
  Zap,
  CheckCircle,
  Clock,
  Flame,
  ChevronRight
} from 'lucide-react';

interface OperationsScreenProps {
  state: GameState;
  onUpdateState: (updater: (prev: GameState) => GameState) => void;
}

export const OperationsScreen: React.FC<OperationsScreenProps> = ({
  state,
  onUpdateState
}) => {
  const [selectedContract, setSelectedContract] = useState<Contract | null>(state.contracts[0] || null);
  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>(
    state.members.slice(0, 3).map(m => m.id)
  );
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const filteredContracts = state.contracts.filter(c => {
    if (filterCategory === 'all') return true;
    if (filterCategory === 'major') return c.isMajorOperation;
    return c.category === filterCategory;
  });

  const toggleMemberSelection = (id: string) => {
    sounds.playClick();
    if (selectedMemberIds.includes(id)) {
      setSelectedMemberIds(selectedMemberIds.filter(mId => mId !== id));
    } else {
      if (selectedContract && selectedMemberIds.length >= selectedContract.maxCrew) return;
      setSelectedMemberIds([...selectedMemberIds, id]);
    }
  };

  const selectedMembers = state.members.filter(m => selectedMemberIds.includes(m.id));
  const teamEval = evaluateTeam(selectedMembers, state.weapons);

  // Check ammunition sufficiency
  const ammoStock = selectedContract
    ? state.ammunition[selectedContract.ammoRequired.type]?.count || 0
    : 0;
  const hasEnoughAmmo = selectedContract
    ? ammoStock >= selectedContract.ammoRequired.amount
    : false;

  const canLaunch =
    selectedContract &&
    selectedMemberIds.length >= selectedContract.minCrew &&
    selectedMemberIds.length <= selectedContract.maxCrew &&
    hasEnoughAmmo;

  // Execute operation launch
  const handleLaunchOperation = () => {
    if (!selectedContract || !canLaunch) return;

    sounds.playGunRack();

    // Deduct ammunition
    const reqAmmo = selectedContract.ammoRequired;
    const updatedAmmo = {
      ...state.ammunition,
      [reqAmmo.type]: {
        ...state.ammunition[reqAmmo.type],
        count: Math.max(0, state.ammunition[reqAmmo.type].count - reqAmmo.amount)
      }
    };

    // If it's a Major Operation: 75% chance to hit a Crisis Situation or skirmish
    if (selectedContract.isMajorOperation) {
      // Chance of Crisis or Tactical Battle
      const roll = Math.random();
      if (roll < 0.65) {
        // Trigger Major Operation Crisis Standoff!
        const crisis = createCrisisScenario(selectedContract, selectedMemberIds, state);
        sounds.playCrisisAlert();
        onUpdateState(s => ({
          ...s,
          ammunition: updatedAmmo,
          activeCrisis: crisis,
          contracts: s.contracts.filter(c => c.id !== selectedContract.id)
        }));
        return;
      } else if (roll < 0.90) {
        // Trigger Tactical Battle Encounter!
        const battle = createTacticalBattle(
          selectedContract.title,
          'Hostile Enforcer Defense Detachment',
          55 + (selectedContract.difficulty === 'Extreme' ? 30 : 15),
          selectedMemberIds,
          state,
          selectedContract.rewardCash,
          selectedContract.repReward
        );
        onUpdateState(s => ({
          ...s,
          ammunition: updatedAmmo,
          activeTacticalBattle: battle,
          contracts: s.contracts.filter(c => c.id !== selectedContract.id)
        }));
        return;
      }
    }

    // Clean execution for regular contracts or clean roll
    sounds.playVictory();
    const updatedMembers = state.members.map(m => {
      if (selectedMemberIds.includes(m.id)) {
        return {
          ...m,
          experience: m.experience + 35,
          operationsCount: m.operationsCount + 1,
          successesCount: m.successesCount + 1,
          morale: Math.min(100, m.morale + 6)
        };
      }
      return m;
    });

    onUpdateState(s => ({
      ...s,
      cash: s.cash + selectedContract.rewardCash,
      reputation: Math.min(100, s.reputation + selectedContract.repReward),
      wantedLevel: Math.min(100, s.wantedLevel + selectedContract.wantedGain),
      ammunition: updatedAmmo,
      members: updatedMembers,
      contracts: s.contracts.filter(c => c.id !== selectedContract.id),
      eventHistory: [
        {
          id: `hist_${Date.now()}`,
          day: s.day,
          title: `Operation Succeeded: ${selectedContract.title}`,
          description: `Contract completed cleanly. Secured $${selectedContract.rewardCash.toLocaleString()} and +${selectedContract.repReward} Reputation.`,
          type: 'positive'
        },
        ...s.eventHistory
      ],
      statistics: {
        ...s.statistics,
        totalMoneyEarned: s.statistics.totalMoneyEarned + selectedContract.rewardCash,
        contractsCompleted: s.statistics.contractsCompleted + 1,
        operationsRun: s.statistics.operationsRun + 1,
        biggestPayout: Math.max(s.statistics.biggestPayout, selectedContract.rewardCash)
      }
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header and Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-display font-bold text-neutral-100 flex items-center gap-2">
            <Crosshair className="text-amber-500" size={24} />
            <span>Underworld Operations & Heist Board</span>
          </h2>
          <p className="text-xs text-neutral-400 font-mono mt-0.5">
            Major operations feature multi-stage execution and tactical crisis branching.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1 bg-neutral-900 border border-neutral-800 p-1 rounded font-mono text-xs">
          {[
            { id: 'all', label: 'All Jobs' },
            { id: 'major', label: 'Major Ops / Heists' },
            { id: 'Security', label: 'Security' },
            { id: 'Armed Conflict', label: 'Armed Conflict' },
            { id: 'Recovery', label: 'Recovery' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                sounds.playClick();
                setFilterCategory(tab.id);
              }}
              className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                filterCategory === tab.id
                  ? 'bg-amber-600 text-neutral-950 font-bold'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Contracts List & Staging Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Contracts Roster */}
        <div className="lg:col-span-7 space-y-3">
          {filteredContracts.map(ct => {
            const isSelected = selectedContract?.id === ct.id;
            const sceneImg = ct.sceneImage || getOperationScene(ct.locationType, false, false);

            return (
              <div
                key={ct.id}
                onClick={() => {
                  sounds.playClick();
                  setSelectedContract(ct);
                }}
                className={`p-4 rounded border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-neutral-900 border-amber-500 ring-1 ring-amber-500/40 shadow-lg'
                    : 'bg-neutral-950/80 border-neutral-800 hover:border-neutral-700 hover:bg-neutral-900/60'
                }`}
              >
                {/* Contract Scene Thumbnail */}
                <div className="w-full h-24 rounded overflow-hidden border border-neutral-800 mb-2.5 relative bg-neutral-950">
                  <img
                    src={sceneImg}
                    alt={ct.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/90 via-transparent to-transparent" />
                  <div className="absolute bottom-1.5 left-2 flex items-center gap-1.5">
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/80 text-amber-300 border border-amber-800/50">
                      {ct.category}
                    </span>
                    {ct.locationType && (
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/80 text-neutral-300 border border-neutral-800">
                        {ct.locationType}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-display font-bold text-sm text-neutral-100">
                        {ct.title}
                      </span>
                      {ct.isMajorOperation && (
                        <span className="text-[10px] font-mono uppercase bg-rose-950/80 text-rose-400 border border-rose-800 px-1.5 py-0.5 rounded font-bold">
                          MAJOR CRISIS OP
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] font-mono text-neutral-400 mt-0.5">
                      Client: <span className="text-neutral-300">{ct.client}</span> · Category:{' '}
                      <span className="text-neutral-300">{ct.category}</span>
                    </div>
                  </div>

                  <div className="text-right font-mono text-xs shrink-0">
                    <span className="text-emerald-400 font-bold text-sm block">
                      ${ct.rewardCash.toLocaleString()}
                    </span>
                    <span className="text-amber-400 text-[11px]">+{ct.repReward} Rep</span>
                  </div>
                </div>

                <p className="text-xs text-neutral-300 font-sans leading-relaxed line-clamp-2 mb-3">
                  {ct.description}
                </p>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-neutral-800/80 text-[11px] font-mono text-neutral-400">
                  <div className="flex items-center gap-3">
                    <span>
                      Difficulty:{' '}
                      <strong
                        className={
                          ct.difficulty === 'Extreme'
                            ? 'text-rose-400'
                            : ct.difficulty === 'High'
                            ? 'text-amber-400'
                            : 'text-neutral-300'
                        }
                      >
                        {ct.difficulty}
                      </strong>
                    </span>
                    <span>
                      Risk:{' '}
                      <strong
                        className={
                          ct.riskLevel === 'Severe' || ct.riskLevel === 'Lethal'
                            ? 'text-rose-400'
                            : 'text-neutral-300'
                        }
                      >
                        {ct.riskLevel}
                      </strong>
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span>Crew: {ct.minCrew}–{ct.maxCrew}</span>
                    <span className="flex items-center gap-1 text-neutral-500">
                      <Clock size={11} /> {ct.daysRemaining}d left
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Mission Staging & Strike Team Selection */}
        <div className="lg:col-span-5 space-y-4">
          {selectedContract ? (
            <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-5 space-y-4">
              <div>
                {/* Cinematic Operation Staging Scene Header */}
                <div className="w-full h-40 rounded-lg overflow-hidden border border-neutral-800 mb-3 relative bg-neutral-950">
                  <EntityImage
                    src={selectedContract.sceneImage || getOperationScene(selectedContract.locationType, false, false)}
                    alt={selectedContract.title}
                    type="location"
                    category={selectedContract.locationType}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/30 to-transparent" />
                  <div className="absolute bottom-2.5 left-3">
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-black/80 text-amber-400 border border-amber-800/50 flex items-center gap-1">
                      <ShieldAlert size={12} />
                      <span>{selectedContract.locationType || 'TACTICAL FACILITY'} · BRIEFING AREA</span>
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-xs font-mono text-amber-500 uppercase tracking-wider mb-1">
                  <ShieldAlert size={14} />
                  <span>Operation Staging Bay</span>
                </div>
                <h3 className="text-lg font-display font-bold text-neutral-100">
                  {selectedContract.title}
                </h3>
                <p className="text-xs text-neutral-300 font-sans mt-1 leading-relaxed">
                  {selectedContract.description}
                </p>
              </div>

              {/* Required Ammunition Check */}
              <div className="bg-neutral-950 p-3 rounded border border-neutral-800 text-xs font-mono flex items-center justify-between">
                <div>
                  <span className="text-neutral-400 block text-[10px]">REQUIRED AMMUNITION</span>
                  <span className="text-neutral-200 font-bold">
                    {selectedContract.ammoRequired.amount}x {selectedContract.ammoRequired.type.replace('_', ' ')}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-neutral-400 block text-[10px]">CURRENT STOCK</span>
                  <span
                    className={`font-bold ${
                      hasEnoughAmmo ? 'text-emerald-400' : 'text-rose-400 animate-pulse'
                    }`}
                  >
                    {ammoStock} rounds available
                  </span>
                </div>
              </div>

              {/* Team Evaluator Stats */}
              <div className="bg-neutral-950 p-3 rounded border border-neutral-800 space-y-2 font-mono text-xs">
                <div className="flex justify-between text-[11px] text-neutral-400 uppercase">
                  <span>Assigned Squad Combat Rating</span>
                  <span className="text-amber-400 font-bold">{teamEval.totalTeamPower} PWR</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-[11px] text-neutral-300">
                  <div>Combat: <strong className="text-neutral-100">{teamEval.avgCombat}</strong></div>
                  <div>Stealth: <strong className="text-neutral-100">{teamEval.avgStealth}</strong></div>
                  <div>Nerves: <strong className="text-neutral-100">{teamEval.avgNerves}</strong></div>
                </div>
              </div>

              {/* Operative Selection Grid */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono text-neutral-400">
                  <span>Deploy Operatives ({selectedMemberIds.length}/{selectedContract.maxCrew})</span>
                  <span>Min: {selectedContract.minCrew}</span>
                </div>

                <div className="max-h-56 overflow-y-auto space-y-1.5">
                  {state.members.map(member => {
                    const isSelected = selectedMemberIds.includes(member.id);
                    const weapon = state.weapons.find(w => w.id === member.assignedWeaponId);
                    const isInjured = member.status !== 'Healthy';

                    return (
                      <div
                        key={member.id}
                        onClick={() => toggleMemberSelection(member.id)}
                        className={`p-2 rounded border cursor-pointer flex items-center justify-between text-xs font-mono transition-all ${
                          isSelected
                            ? 'bg-neutral-800 border-amber-500 text-neutral-100'
                            : 'bg-neutral-950/60 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                        } ${isInjured ? 'opacity-60' : ''}`}
                      >
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            readOnly
                            className="rounded accent-amber-500 cursor-pointer"
                          />
                          <div>
                            <span className="font-semibold text-neutral-200">{member.name}</span>
                            <span className="text-[10px] text-neutral-500 ml-1.5">({member.role})</span>
                            <div className="text-[10px] text-neutral-400 font-mono">
                              {weapon ? weapon.model : 'No Weapon'}
                            </div>
                          </div>
                        </div>

                        <div className="text-right text-[11px]">
                          <div className={member.health < 60 ? 'text-rose-400' : 'text-emerald-400'}>
                            {member.health}% HP
                          </div>
                          <div className="text-neutral-500">C:{member.combat} S:{member.stealth}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Launch Action Button */}
              <div className="pt-2">
                <button
                  disabled={!canLaunch}
                  onClick={handleLaunchOperation}
                  className={`w-full py-3 rounded font-display font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                    canLaunch
                      ? 'bg-amber-600 hover:bg-amber-500 text-neutral-950 shadow-lg cursor-pointer'
                      : 'bg-neutral-800 text-neutral-500 cursor-not-allowed opacity-60'
                  }`}
                >
                  <Zap size={15} fill="currentColor" />
                  <span>
                    {selectedContract.isMajorOperation
                      ? 'Commit Team to Major Operation'
                      : 'Execute Contract Mission'}
                  </span>
                </button>
                {!hasEnoughAmmo && (
                  <p className="text-[11px] font-mono text-rose-400 text-center mt-1.5">
                    Insufficient ammunition. Purchase {selectedContract.ammoRequired.type.replace('_', ' ')} in Black Market.
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6 text-center text-xs font-mono text-neutral-500">
              Select an operation from the contract board to review operational requirements.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
