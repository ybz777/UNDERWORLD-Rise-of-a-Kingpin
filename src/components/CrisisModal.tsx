import React, { useState } from 'react';
import {
  CrisisResolutionResult,
  CrisisState,
  GameState,
  StrategicCrisisOption
} from '../game/types';
import { resolveCrisisDecision } from '../game/crisisEngine';
import { sounds } from '../game/audio';
import { getCharacterPortrait } from '../game/visuals';
import {
  AlertTriangle,
  ShieldAlert,
  Crosshair,
  UserCheck,
  Zap,
  CheckCircle2,
  XCircle,
  Skull,
  Radio,
  Activity
} from 'lucide-react';

interface CrisisModalProps {
  crisis: CrisisState;
  state: GameState;
  onResolve: (result: CrisisResolutionResult) => void;
}

export const CrisisModal: React.FC<CrisisModalProps> = ({
  crisis,
  state,
  onResolve
}) => {
  const [selectedOption, setSelectedOption] = useState<StrategicCrisisOption | null>(null);
  const [resolution, setResolution] = useState<CrisisResolutionResult | null>(null);

  const teamMembers = state.members.filter(m => crisis.crewMemberIds.includes(m.id));

  const handleExecuteOption = (opt: StrategicCrisisOption) => {
    sounds.playGunRack();
    const result = resolveCrisisDecision(crisis, opt, state);
    setResolution(result);
  };

  const handleFinish = () => {
    if (resolution) {
      onResolve(resolution);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="w-full max-w-4xl bg-neutral-900 border border-neutral-700 rounded-lg shadow-2xl overflow-hidden flex flex-col my-auto max-h-[92vh]">
        {/* Cinematic Crisis Standoff Banner */}
        <div className="w-full h-44 sm:h-52 overflow-hidden border-b border-neutral-800 relative bg-neutral-950 shrink-0">
          <img
            src={crisis.sceneImage || "/src/assets/images/underworld_crisis_standoff_1791441248561.jpg"}
            alt={crisis.situationTitle}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent" />
          <div className="absolute bottom-3 left-4 sm:left-6 flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-mono uppercase px-2.5 py-1 rounded bg-rose-950/90 text-rose-300 border border-rose-800/80 font-bold flex items-center gap-1.5 shadow-md">
              <ShieldAlert size={13} className="animate-pulse text-rose-400" />
              <span>CRITICAL CRISIS ALERT · {crisis.severity}</span>
            </span>
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-black/80 text-neutral-300 border border-neutral-800">
              {crisis.terrain}
            </span>
          </div>
        </div>

        {/* Header Banner */}
        <div className="relative bg-neutral-950 border-b border-neutral-800 p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded bg-rose-950/80 border border-rose-700/60 text-rose-400">
              <ShieldAlert size={28} className="animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-rose-400 font-semibold uppercase tracking-wider">
                <span>TACTICAL CRISIS IMMINENT</span>
                <span aria-hidden="true">·</span>
                <span>SEVERITY: {crisis.severity}</span>
                <span aria-hidden="true">·</span>
                <span>STAGE {crisis.stageNumber}/{crisis.maxStages}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-display font-bold text-neutral-100 tracking-wide mt-0.5">
                {crisis.situationTitle}
              </h2>
              <div className="text-xs text-neutral-400 font-mono mt-0.5">
                Operation: <span className="text-neutral-200">{crisis.operationTitle}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono bg-neutral-900 border border-neutral-800 px-3 py-1.5 rounded">
            <div>
              <span className="text-neutral-500">ENEMY THREAT:</span>{' '}
              <span className="text-rose-400 font-bold">{crisis.enemyStrength}</span>
            </div>
            <span className="text-neutral-700">|</span>
            <div>
              <span className="text-neutral-500">POLICE HEAT:</span>{' '}
              <span className="text-amber-400 font-bold">{crisis.policePressure}%</span>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1">
          {/* Situation Briefing */}
          <div className="bg-neutral-950/70 border border-neutral-800 p-4 rounded text-sm text-neutral-300 leading-relaxed font-sans">
            <p className="text-neutral-200 font-medium mb-1">Intelligence Situation Report:</p>
            <p>{crisis.situationDescription}</p>
            <div className="mt-2.5 pt-2.5 border-t border-neutral-800/80 flex flex-wrap gap-4 text-xs font-mono text-neutral-400">
              <div>Terrain: <span className="text-neutral-200">{crisis.terrain}</span></div>
              <div>Leader Planning Buffer: <span className="text-amber-400">+{crisis.preparationLevel}%</span></div>
              <div>Target Haul: <span className="text-emerald-400">${crisis.initialReward.toLocaleString()}</span></div>
            </div>
          </div>

          {/* Deployed Operatives Roster */}
          <div>
            <h3 className="text-xs font-mono uppercase text-neutral-400 tracking-wider mb-2 flex items-center gap-1.5">
              <UserCheck size={14} className="text-amber-500" />
              Engaged Strike Team ({teamMembers.length} Operatives)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {teamMembers.map(member => {
                const weapon = state.weapons.find(w => w.id === member.assignedWeaponId);
                const portrait = member.portrait || getCharacterPortrait(member.role, member.level, member.name);
                return (
                  <div
                    key={member.id}
                    className="bg-neutral-950/60 border border-neutral-800 p-2.5 rounded flex items-center gap-3 text-xs"
                  >
                    <div className="w-10 h-10 rounded overflow-hidden border border-neutral-800 shrink-0 bg-neutral-950">
                      <img
                        src={portrait}
                        alt={member.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-neutral-200 flex items-center justify-between gap-1">
                        <span className="truncate">{member.name}</span>
                        <span className="text-emerald-400 font-mono text-[10px]">HP {member.health}%</span>
                      </div>
                      <div className="text-[11px] text-neutral-400 font-mono truncate">
                        {weapon ? weapon.model : 'Sidearm'}
                      </div>
                      <div className="text-[10px] text-neutral-500 font-mono">
                        COMBAT {member.combat} · NERVES {member.nerves}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Crisis Decision Mode vs Resolution Mode */}
          {!resolution ? (
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-mono uppercase text-neutral-400 tracking-wider flex items-center gap-1.5">
                  <Crosshair size={14} className="text-rose-500" />
                  Select Strategic Crisis Response
                </h3>
                <span className="text-[11px] font-mono text-amber-500">
                  Atom RPG Check: Stats + Gear + Situation = Probability
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {crisis.availableOptions.map(opt => {
                  const isSelected = selectedOption?.id === opt.id;
                  const successRateColor =
                    opt.estimatedSuccessRate >= 70
                      ? 'text-emerald-400'
                      : opt.estimatedSuccessRate >= 45
                      ? 'text-amber-400'
                      : 'text-rose-400';

                  return (
                    <div
                      key={opt.id}
                      onClick={() => setSelectedOption(opt)}
                      className={`cursor-pointer p-4 rounded border transition-all flex flex-col justify-between ${
                        isSelected
                          ? 'bg-neutral-800/90 border-amber-500 shadow-md ring-1 ring-amber-500/50'
                          : 'bg-neutral-950/80 border-neutral-800 hover:border-neutral-700 hover:bg-neutral-900/60'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-display font-bold text-sm tracking-wide text-neutral-100">
                            {opt.name}
                          </span>
                          <span className={`text-xs font-mono font-bold ${successRateColor}`}>
                            EST. SUCCESS: {opt.estimatedSuccessRate}%
                          </span>
                        </div>
                        <p className="text-xs text-neutral-400 leading-relaxed mb-3">
                          {opt.description}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-neutral-800/80 flex items-center justify-between text-[11px] font-mono">
                        <div>
                          <span className="text-neutral-500">KEY STAT:</span>{' '}
                          <span className="text-neutral-300 font-semibold">{opt.primaryStatTested}</span>
                        </div>
                        <div>
                          <span className="text-neutral-500">REWARD:</span>{' '}
                          <span className="text-emerald-400">{opt.potentialReward}</span>
                          <span className="text-neutral-600 mx-1">/</span>
                          <span className="text-neutral-500">LOSS:</span>{' '}
                          <span className="text-rose-400">{opt.potentialLoss}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Execution Action Footer */}
              <div className="mt-4 pt-4 border-t border-neutral-800 flex items-center justify-between">
                <div className="text-xs font-mono text-neutral-400">
                  {selectedOption ? (
                    <span>
                      Strategy Chosen:{' '}
                      <strong className="text-neutral-100">{selectedOption.name}</strong> ({selectedOption.estimatedSuccessRate}% odds)
                    </span>
                  ) : (
                    <span>Select a strategic response above to commit the strike team.</span>
                  )}
                </div>
                <button
                  disabled={!selectedOption}
                  onClick={() => selectedOption && handleExecuteOption(selectedOption)}
                  className={`px-5 py-2.5 rounded font-display font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 ${
                    selectedOption
                      ? 'bg-amber-600 hover:bg-amber-500 text-neutral-950 cursor-pointer shadow-lg'
                      : 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
                  }`}
                >
                  <Zap size={14} fill="currentColor" />
                  Execute Strategic Order
                </button>
              </div>
            </div>
          ) : (
            /* Resolution Outcome View */
            <div className="space-y-4">
              <div className="bg-neutral-950 border border-neutral-800 p-5 rounded">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {resolution.tier === 'Critical Success' || resolution.tier === 'Major Success' || resolution.tier === 'Success' ? (
                      <CheckCircle2 size={22} className="text-emerald-400" />
                    ) : resolution.tier === 'Partial Success' ? (
                      <AlertTriangle size={22} className="text-amber-400" />
                    ) : (
                      <XCircle size={22} className="text-rose-500" />
                    )}
                    <span className="font-display font-bold text-lg text-neutral-100 uppercase tracking-wide">
                      OUTCOME: {resolution.tier}
                    </span>
                  </div>
                  <div className="text-xs font-mono text-neutral-400">
                    Calculated Roll: <span className="font-bold text-neutral-200">{resolution.rollScore}</span> vs Threshold
                  </div>
                </div>

                <p className="text-sm text-neutral-200 leading-relaxed font-sans mb-4">
                  {resolution.narrativeSummary}
                </p>

                {/* Atom RPG Breakdown Box */}
                <div className="bg-neutral-900/90 border border-neutral-800 p-3 rounded font-mono text-xs space-y-1 text-neutral-400">
                  <div className="text-neutral-300 font-semibold text-[11px] uppercase tracking-wider mb-1">
                    Systemic Character-Check Calculation Breakdown:
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                    <div>Team Combat: <span className="text-neutral-200">{resolution.calculationsBreakdown.teamCombat}</span></div>
                    <div>Team Stealth: <span className="text-neutral-200">{resolution.calculationsBreakdown.teamStealth}</span></div>
                    <div>Leader Charisma: <span className="text-neutral-200">{resolution.calculationsBreakdown.teamCharisma}</span></div>
                    <div>Equipment Rating: <span className="text-neutral-200">{resolution.calculationsBreakdown.equipmentScore}</span></div>
                    <div>Police Penalty: <span className="text-rose-400">-{resolution.calculationsBreakdown.policePressurePenalty}</span></div>
                    <div>Terrain Modifier: <span className="text-neutral-200">{resolution.calculationsBreakdown.terrainModifier > 0 ? `+${resolution.calculationsBreakdown.terrainModifier}` : resolution.calculationsBreakdown.terrainModifier}</span></div>
                    <div>Controlled Random: <span className="text-amber-400">d100 ({resolution.calculationsBreakdown.controlledRandomness})</span></div>
                    <div>Final Score: <span className="text-neutral-100 font-bold">{resolution.calculationsBreakdown.finalRating}</span></div>
                  </div>
                </div>

                {/* Concrete Consequences Grid */}
                <div className="mt-4 pt-3 border-t border-neutral-800 grid grid-cols-2 sm:grid-cols-5 gap-3 font-mono text-xs">
                  <div>
                    <span className="text-neutral-500 block text-[10px]">CASH SECURED</span>
                    <span className={`font-bold ${resolution.consequences.cashGained > 0 ? 'text-emerald-400' : 'text-neutral-400'}`}>
                      +${resolution.consequences.cashGained.toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-neutral-500 block text-[10px]">REPUTATION</span>
                    <span className={`font-bold ${resolution.consequences.repDelta >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {resolution.consequences.repDelta >= 0 ? `+${resolution.consequences.repDelta}` : resolution.consequences.repDelta}
                    </span>
                  </div>
                  <div>
                    <span className="text-neutral-500 block text-[10px]">PRESTIGE</span>
                    <span className={`font-bold ${resolution.consequences.prestigeDelta >= 0 ? 'text-purple-400' : 'text-rose-400'}`}>
                      {resolution.consequences.prestigeDelta >= 0 ? `+${resolution.consequences.prestigeDelta}` : resolution.consequences.prestigeDelta}
                    </span>
                  </div>
                  <div>
                    <span className="text-neutral-500 block text-[10px]">WANTED IMPACT</span>
                    <span className={`font-bold ${resolution.consequences.wantedDelta > 0 ? 'text-rose-400' : 'text-neutral-400'}`}>
                      {resolution.consequences.wantedDelta > 0 ? `+${resolution.consequences.wantedDelta}%` : `${resolution.consequences.wantedDelta}%`}
                    </span>
                  </div>
                  <div>
                    <span className="text-neutral-500 block text-[10px]">POLICE PRESSURE</span>
                    <span className={`font-bold ${resolution.consequences.policePressureDelta > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                      {resolution.consequences.policePressureDelta > 0 ? `+${resolution.consequences.policePressureDelta}%` : `${resolution.consequences.policePressureDelta}%`}
                    </span>
                  </div>
                </div>

                {/* Crew Damage Log */}
                <div className="mt-3 text-xs font-mono text-neutral-400 space-y-1">
                  {resolution.consequences.memberUpdates.map(u => {
                    const mem = state.members.find(m => m.id === u.memberId);
                    if (!mem) return null;
                    return (
                      <div key={u.memberId} className="flex items-center gap-2">
                        <span className="text-neutral-300 font-semibold">{mem.name}:</span>
                        <span>-{u.healthDamage} HP</span>
                        {u.newStatus !== 'Healthy' && (
                          <span className="text-rose-400 font-bold uppercase">[{u.newStatus}]</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={handleFinish}
                  className="px-6 py-2.5 rounded font-display font-bold text-xs uppercase tracking-wider bg-amber-600 hover:bg-amber-500 text-neutral-950 transition-colors shadow-lg cursor-pointer"
                >
                  Confirm & Apply After-Action Report
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
