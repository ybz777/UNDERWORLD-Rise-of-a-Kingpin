import React, { useState } from 'react';
import { GameState, Member } from '../game/types';
import { sounds } from '../game/audio';
import { getCharacterPortrait } from '../game/visuals';
import { EntityImage } from '../components/EntityImage';
import { RECRUIT_TEMPLATES, generateProceduralRecruit, createInitialMember, RecruitTemplate } from '../data/recruits';
import {
  Users,
  UserPlus,
  Award,
  Zap,
  TrendingUp,
  Heart,
  Skull,
  Shield,
  DollarSign,
  UserCheck,
  UserX
} from 'lucide-react';

interface MembersScreenProps {
  state: GameState;
  onUpdateState: (updater: (prev: GameState) => GameState) => void;
}

export const MembersScreen: React.FC<MembersScreenProps> = ({
  state,
  onUpdateState
}) => {
  const [activeTab, setActiveTab] = useState<'roster' | 'recruitment'>('roster');
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(
    state.members[0]?.id || null
  );

  // Available recruits for hire
  const [recruitsPool] = useState<RecruitTemplate[]>(() => {
    const list = [...RECRUIT_TEMPLATES.slice(2, 9)];
    while (list.length < 10) {
      list.push(generateProceduralRecruit(state.prestige));
    }
    return list;
  });

  const selectedMember = state.members.find(m => m.id === selectedMemberId) || state.members[0];

  // Actions on Active Member
  const handleRewardMember = (member: Member) => {
    if (state.cash < 1500) return;
    sounds.playCash();
    onUpdateState(s => ({
      ...s,
      cash: s.cash - 1500,
      members: s.members.map(m =>
        m.id === member.id
          ? {
              ...m,
              morale: Math.min(100, m.morale + 20),
              loyalty: Math.min(100, m.loyalty + 12)
            }
          : m
      )
    }));
  };

  const handlePromoteMember = (member: Member) => {
    if (state.cash < 2500) return;
    sounds.playVictory();
    onUpdateState(s => ({
      ...s,
      cash: s.cash - 2500,
      members: s.members.map(m =>
        m.id === member.id
          ? {
              ...m,
              level: m.level + 1,
              combat: Math.min(100, m.combat + 4),
              nerves: Math.min(100, m.nerves + 4),
              salary: m.salary + 50,
              loyalty: Math.min(100, m.loyalty + 15)
            }
          : m
      )
    }));
  };

  const handleTrainMember = (member: Member) => {
    if (state.cash < 2000) return;
    sounds.playGunRack();
    onUpdateState(s => ({
      ...s,
      cash: s.cash - 2000,
      members: s.members.map(m =>
        m.id === member.id
          ? {
              ...m,
              combat: Math.min(100, m.combat + 5),
              accuracy: Math.min(100, m.accuracy + 5),
              stealth: Math.min(100, m.stealth + 4)
            }
          : m
      )
    }));
  };

  const handleDismissMember = (member: Member) => {
    sounds.playClick();
    onUpdateState(s => ({
      ...s,
      members: s.members.filter(m => m.id !== member.id),
      weapons: s.weapons.map(w =>
        w.assignedMemberId === member.id ? { ...w, assignedMemberId: null } : w
      )
    }));
  };

  // Hire Recruit Action
  const handleHireRecruit = (template: RecruitTemplate) => {
    if (state.cash < template.hiringCost) return;
    sounds.playCash();

    const newMember = createInitialMember(template, null);

    onUpdateState(s => ({
      ...s,
      cash: s.cash - template.hiringCost,
      members: [...s.members, newMember],
      statistics: {
        ...s.statistics,
        membersRecruited: s.statistics.membersRecruited + 1,
        totalMoneySpent: s.statistics.totalMoneySpent + template.hiringCost
      }
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-display font-bold text-neutral-100 flex items-center gap-2">
            <Users className="text-amber-500" size={24} />
            <span>Personnel & Underworld Network</span>
          </h2>
          <p className="text-xs text-neutral-400 font-mono mt-0.5">
            Individual operatives with personal loyalties, combat proficiencies, and morale.
          </p>
        </div>

        <div className="flex items-center gap-1 bg-neutral-900 border border-neutral-800 p-1 rounded font-mono text-xs">
          <button
            onClick={() => {
              sounds.playClick();
              setActiveTab('roster');
            }}
            className={`px-3 py-1 rounded transition-colors cursor-pointer ${
              activeTab === 'roster'
                ? 'bg-amber-600 text-neutral-950 font-bold'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Active Crew ({state.members.length})
          </button>
          <button
            onClick={() => {
              sounds.playClick();
              setActiveTab('recruitment');
            }}
            className={`px-3 py-1 rounded transition-colors cursor-pointer ${
              activeTab === 'recruitment'
                ? 'bg-amber-600 text-neutral-950 font-bold'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Recruitment Hall
          </button>
        </div>
      </div>

      {/* Roster View */}
      {activeTab === 'roster' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Operatives Grid */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[700px] overflow-y-auto pr-1">
            {state.members.map(member => {
              const isSelected = selectedMember?.id === member.id;
              const weapon = state.weapons.find(w => w.id === member.assignedWeaponId);
              const portraitSrc = member.portrait || getCharacterPortrait(member.role, member.level, member.name);

              return (
                <div
                  key={member.id}
                  onClick={() => {
                    sounds.playClick();
                    setSelectedMemberId(member.id);
                  }}
                  className={`p-3.5 rounded border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-neutral-900 border-amber-500 ring-1 ring-amber-500/40 shadow-lg'
                      : 'bg-neutral-950/80 border-neutral-800 hover:border-neutral-700 hover:bg-neutral-900/60'
                  }`}
                >
                  <div>
                    <div className="flex items-start gap-3 mb-2">
                      <div className="w-12 h-12 rounded-lg overflow-hidden border border-neutral-800 shrink-0 bg-neutral-950">
                        <EntityImage
                          src={portraitSrc}
                          alt={member.name}
                          type="portrait"
                          role={member.role}
                          seed={member.level}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-1">
                          <div>
                            <span className="font-display font-bold text-sm text-neutral-100 block truncate">
                              {member.name}
                            </span>
                            <span className="text-[10px] font-mono text-neutral-400">
                              {member.role} · LVL {member.level}
                            </span>
                          </div>
                          <span className="text-emerald-400 font-mono text-xs font-bold shrink-0">
                            ${member.salary}/d
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="text-[11px] font-mono text-neutral-400 mb-2 truncate">
                      Firearm: <span className="text-neutral-200">{weapon ? weapon.model : 'None'}</span>
                    </div>

                    <div className="grid grid-cols-3 gap-1.5 text-[10px] font-mono bg-neutral-950 p-2 rounded border border-neutral-800/80 mb-2">
                      <div>HP: <strong className={member.health < 60 ? 'text-rose-400' : 'text-emerald-400'}>{member.health}%</strong></div>
                      <div>Loyalty: <strong className="text-amber-400">{member.loyalty}%</strong></div>
                      <div>Morale: <strong className="text-blue-400">{member.morale}%</strong></div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-neutral-800/80 flex items-center justify-between text-[10px] font-mono text-neutral-400">
                    <span>{member.personality}</span>
                    <span>{member.successesCount} Successes</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Member Inspection & Action Bay */}
          <div className="lg:col-span-5">
            {selectedMember ? (
              <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-5 space-y-4 sticky top-16">
                <div>
                  <div className="flex items-start gap-3.5 mb-2">
                    <div className="w-20 h-20 rounded-lg overflow-hidden border border-neutral-700 shrink-0 bg-neutral-950 shadow-md">
                      <EntityImage
                        src={selectedMember.portrait || getCharacterPortrait(selectedMember.role, selectedMember.level, selectedMember.name)}
                        alt={selectedMember.name}
                        type="portrait"
                        role={selectedMember.role}
                        seed={selectedMember.level}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between text-xs font-mono text-neutral-500 mb-0.5">
                        <span>ID: {selectedMember.id}</span>
                        <span className="text-amber-400 font-bold">{selectedMember.personality}</span>
                      </div>
                      <h3 className="text-xl font-display font-bold text-neutral-100 truncate">
                        {selectedMember.name}
                      </h3>
                      <div className="text-xs font-mono text-neutral-400 mt-0.5">
                        {selectedMember.role} · Level {selectedMember.level} · Age {selectedMember.age}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Attributes Grid */}
                <div className="bg-neutral-950 p-3.5 rounded border border-neutral-800 grid grid-cols-3 gap-2.5 text-xs font-mono">
                  <div>Combat: <strong className="text-rose-400 block text-sm">{selectedMember.combat}</strong></div>
                  <div>Accuracy: <strong className="text-blue-400 block text-sm">{selectedMember.accuracy}</strong></div>
                  <div>Stealth: <strong className="text-neutral-200 block text-sm">{selectedMember.stealth}</strong></div>
                  <div>Intelligence: <strong className="text-neutral-200 block text-sm">{selectedMember.intelligence}</strong></div>
                  <div>Nerves: <strong className="text-amber-400 block text-sm">{selectedMember.nerves}</strong></div>
                  <div>Charisma: <strong className="text-purple-400 block text-sm">{selectedMember.charisma}</strong></div>
                </div>

                {/* Status & Career Record */}
                <div className="bg-neutral-950 p-3 rounded border border-neutral-800 text-xs font-mono space-y-1 text-neutral-400">
                  <div className="flex justify-between">
                    <span>Health Status:</span>
                    <span className={selectedMember.status === 'Healthy' ? 'text-emerald-400' : 'text-rose-400'}>
                      {selectedMember.health}% ({selectedMember.status})
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Daily Compensation:</span>
                    <span className="text-neutral-200 font-bold">${selectedMember.salary}/day</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Operations Record:</span>
                    <span className="text-neutral-200">
                      {selectedMember.operationsCount} ops ({selectedMember.successesCount} win / {selectedMember.failuresCount} fail)
                    </span>
                  </div>
                </div>

                {/* Management Action Buttons */}
                <div className="space-y-2 pt-2">
                  <div className="grid grid-cols-2 gap-2 font-mono text-xs">
                    <button
                      onClick={() => handleRewardMember(selectedMember)}
                      className="p-2.5 rounded bg-neutral-950 border border-neutral-700 hover:border-amber-500 text-amber-300 transition-colors cursor-pointer text-center"
                    >
                      Give Bonus ($1,500)
                    </button>
                    <button
                      onClick={() => handleTrainMember(selectedMember)}
                      className="p-2.5 rounded bg-neutral-950 border border-neutral-700 hover:border-blue-500 text-blue-300 transition-colors cursor-pointer text-center"
                    >
                      Field Training ($2,000)
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2 font-mono text-xs">
                    <button
                      onClick={() => handlePromoteMember(selectedMember)}
                      className="p-2.5 rounded bg-neutral-950 border border-neutral-700 hover:border-emerald-500 text-emerald-300 transition-colors cursor-pointer text-center"
                    >
                      Promote ($2,500)
                    </button>
                    <button
                      onClick={() => handleDismissMember(selectedMember)}
                      className="p-2.5 rounded bg-neutral-950 border border-neutral-800 hover:border-rose-700 text-rose-400 transition-colors cursor-pointer text-center"
                    >
                      Dismiss Operative
                    </button>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}

      {/* Recruitment Hall View */}
      {activeTab === 'recruitment' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recruitsPool.map((recruit, idx) => {
            const canAfford = state.cash >= recruit.hiringCost;
            const recruitPortrait = recruit.portrait || getCharacterPortrait(recruit.role, idx + 3, recruit.name);

            return (
              <div
                key={idx}
                className="bg-neutral-900 border border-neutral-800 p-4 rounded-lg flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start gap-3 mb-2.5">
                    <div className="w-14 h-14 rounded-lg overflow-hidden border border-neutral-800 shrink-0 bg-neutral-950">
                      <EntityImage
                        src={recruitPortrait}
                        alt={recruit.name}
                        type="portrait"
                        role={recruit.role}
                        seed={idx + 1}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-1">
                        <div>
                          <h3 className="font-display font-bold text-sm text-neutral-100 truncate">
                            {recruit.name}
                          </h3>
                          <span className="text-[10px] font-mono text-neutral-400 block">
                            {recruit.role} · Age {recruit.age}
                          </span>
                        </div>

                        <div className="text-right font-mono text-xs shrink-0">
                          <span className="text-emerald-400 font-bold block">
                            ${recruit.hiringCost.toLocaleString()}
                          </span>
                          <span className="text-neutral-500 text-[10px]">${recruit.salary}/d</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-neutral-400 font-sans leading-relaxed mb-3">
                    {recruit.bio}
                  </p>

                  <div className="grid grid-cols-3 gap-2 bg-neutral-950 p-2.5 rounded border border-neutral-800 text-[11px] font-mono text-neutral-300 mb-3">
                    <div>Combat: <strong className="text-rose-400">{recruit.combat}</strong></div>
                    <div>Stealth: <strong className="text-neutral-200">{recruit.stealth}</strong></div>
                    <div>Nerves: <strong className="text-amber-400">{recruit.nerves}</strong></div>
                  </div>
                </div>

                <div className="pt-2 border-t border-neutral-800 flex items-center justify-between">
                  <span className="text-[11px] font-mono text-neutral-500">
                    Personality: {recruit.personality}
                  </span>
                  <button
                    disabled={!canAfford}
                    onClick={() => handleHireRecruit(recruit)}
                    className={`px-4 py-1.5 rounded font-display font-bold text-xs uppercase tracking-wider transition-colors flex items-center gap-1.5 ${
                      canAfford
                        ? 'bg-amber-600 hover:bg-amber-500 text-neutral-950 cursor-pointer shadow-md'
                        : 'bg-neutral-800 text-neutral-500 cursor-not-allowed opacity-60'
                    }`}
                  >
                    <UserPlus size={13} />
                    <span>Enlist</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
