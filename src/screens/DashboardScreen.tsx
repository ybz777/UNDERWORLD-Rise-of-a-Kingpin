import React from 'react';
import { GameState } from '../game/types';
import { sounds } from '../game/audio';
import { PHOTO_ASSETS } from '../game/visuals';
import {
  Shield,
  TrendingUp,
  Crosshair,
  Briefcase,
  Users,
  MapPin,
  Flame,
  Radio,
  Award,
  ChevronRight,
  AlertTriangle
} from 'lucide-react';

interface DashboardScreenProps {
  state: GameState;
  onNavigate: (tab: GameState['activeTab']) => void;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({
  state,
  onNavigate
}) => {
  const netDaily = state.dailyIncome - state.dailyExpense;
  const injuredMembers = state.members.filter(m => m.status !== 'Healthy');
  const ownedBusinesses = state.businesses.filter(b => b.isOwned);
  const controlledTurf = state.territories.filter(t => t.controllingFactionId === null);

  return (
    <div className="space-y-6">
      {/* Hero Banner with Cinematic Artwork */}
      <div className="relative rounded-lg overflow-hidden border border-neutral-800 bg-neutral-900 shadow-xl">
        <img
          src={PHOTO_ASSETS.cityBanner}
          alt="Underworld Metropolis Skyline"
          referrerPolicy="no-referrer"
          className="w-full h-44 sm:h-56 object-cover opacity-45"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/70 to-transparent p-4 sm:p-6 flex flex-col justify-end">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-amber-500 uppercase tracking-wider mb-1">
                <span>HEADQUARTERS BRIEFING</span>
                <span aria-hidden="true">·</span>
                <span>DAY {state.day}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-display font-bold text-neutral-100 tracking-wide">
                {state.leader.organizationName}
              </h1>
              <p className="text-xs sm:text-sm text-neutral-300 font-sans mt-0.5">
                Commander: <span className="font-semibold text-neutral-100">{state.leader.name}</span> · Operating in{' '}
                <span className="text-amber-400 font-semibold">{state.regionId.replace('_', ' ').toUpperCase()}</span>
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  sounds.playClick();
                  onNavigate('operations');
                }}
                className="px-4 py-2 rounded font-display font-bold text-xs uppercase tracking-wider bg-amber-600 hover:bg-amber-500 text-neutral-950 transition-colors flex items-center gap-1.5 shadow-md cursor-pointer"
              >
                <Crosshair size={14} />
                <span>Launch Operation</span>
              </button>
              <button
                onClick={() => {
                  sounds.playClick();
                  onNavigate('arsenal');
                }}
                className="px-4 py-2 rounded font-display font-bold text-xs uppercase tracking-wider bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Shield size={14} />
                <span>Armory</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Live Operational Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 font-mono text-xs">
        <div className="bg-neutral-900/90 border border-neutral-800 p-3 rounded">
          <div className="text-neutral-500 text-[11px] uppercase flex items-center justify-between">
            <span>Treasury</span>
            <TrendingUp size={13} className="text-emerald-500" />
          </div>
          <div className="text-base sm:text-lg font-bold text-emerald-400 mt-1 tabular-nums">
            ${state.cash.toLocaleString()}
          </div>
          <div className="text-[10px] text-neutral-400 mt-0.5">
            Net: {netDaily >= 0 ? `+$${netDaily}` : `-$${Math.abs(netDaily)}`}/d
          </div>
        </div>

        <div className="bg-neutral-900/90 border border-neutral-800 p-3 rounded">
          <div className="text-neutral-500 text-[11px] uppercase flex items-center justify-between">
            <span>Reputation</span>
            <Award size={13} className="text-amber-500" />
          </div>
          <div className="text-base sm:text-lg font-bold text-amber-300 mt-1 tabular-nums">
            {state.reputation}/100
          </div>
          <div className="text-[10px] text-neutral-400 mt-0.5">
            Prestige: {state.prestige}/100
          </div>
        </div>

        <div className="bg-neutral-900/90 border border-neutral-800 p-3 rounded">
          <div className="text-neutral-500 text-[11px] uppercase flex items-center justify-between">
            <span>Crew Roster</span>
            <Users size={13} className="text-blue-400" />
          </div>
          <div className="text-base sm:text-lg font-bold text-neutral-100 mt-1 tabular-nums">
            {state.members.length} Operatives
          </div>
          <div className="text-[10px] text-neutral-400 mt-0.5">
            {injuredMembers.length > 0 ? (
              <span className="text-rose-400 font-semibold">{injuredMembers.length} Injured</span>
            ) : (
              <span className="text-emerald-500">100% Combat Ready</span>
            )}
          </div>
        </div>

        <div className="bg-neutral-900/90 border border-neutral-800 p-3 rounded">
          <div className="text-neutral-500 text-[11px] uppercase flex items-center justify-between">
            <span>Armory Arsenal</span>
            <Shield size={13} className="text-amber-400" />
          </div>
          <div className="text-base sm:text-lg font-bold text-neutral-100 mt-1 tabular-nums">
            {state.weapons.length} Firearms
          </div>
          <div className="text-[10px] text-neutral-400 mt-0.5">
            {state.weapons.filter(w => w.isVeteranWeapon).length} Veteran Models
          </div>
        </div>

        <div className="bg-neutral-900/90 border border-neutral-800 p-3 rounded">
          <div className="text-neutral-500 text-[11px] uppercase flex items-center justify-between">
            <span>Turf Control</span>
            <MapPin size={13} className="text-purple-400" />
          </div>
          <div className="text-base sm:text-lg font-bold text-neutral-100 mt-1 tabular-nums">
            {controlledTurf.length} Sectors
          </div>
          <div className="text-[10px] text-neutral-400 mt-0.5">
            {ownedBusinesses.length} Active Fronts
          </div>
        </div>

        <div className="bg-neutral-900/90 border border-neutral-800 p-3 rounded">
          <div className="text-neutral-500 text-[11px] uppercase flex items-center justify-between">
            <span>Law Pressure</span>
            <Flame size={13} className="text-rose-500" />
          </div>
          <div className="text-base sm:text-lg font-bold text-rose-400 mt-1 tabular-nums">
            {state.policePressure}%
          </div>
          <div className="text-[10px] text-neutral-400 mt-0.5">
            Wanted: {state.wantedLevel}%
          </div>
        </div>
      </div>

      {/* Main Grid: Leader Intelligence Dossier & News Wire */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Leader Profile & Reputation Triad */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-neutral-900/90 border border-neutral-800 rounded-lg p-5">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border border-neutral-700 shrink-0 bg-neutral-950 shadow-md">
                <img
                  src={state.leader.portrait || "/src/assets/images/underworld_syndicate_leader_1791441234072.jpg"}
                  alt={state.leader.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-xs font-mono uppercase tracking-wider text-neutral-400 flex items-center justify-between">
                  <span>Command Attributes & Character Matrix</span>
                  <span className="text-amber-500 font-semibold">{state.leader.name}</span>
                </h3>
                <div className="text-xs text-neutral-300 font-sans mt-0.5">
                  Supreme Commander · <span className="text-neutral-100 font-semibold">{state.leader.organizationName}</span>
                </div>
                <div className="text-[11px] font-mono text-neutral-400 mt-1 italic">
                  "{state.leader.motto}"
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 font-mono text-xs mb-4">
              <div className="bg-neutral-950 p-2.5 rounded border border-neutral-800/80">
                <div className="text-neutral-500 text-[11px]">CHARISMA</div>
                <div className="text-base font-bold text-amber-400 mt-0.5">{state.leader.charisma}</div>
                <div className="text-[10px] text-neutral-400">Recruitment & Standoffs</div>
              </div>
              <div className="bg-neutral-950 p-2.5 rounded border border-neutral-800/80">
                <div className="text-neutral-500 text-[11px]">LEADERSHIP</div>
                <div className="text-base font-bold text-amber-400 mt-0.5">{state.leader.leadership}</div>
                <div className="text-[10px] text-neutral-400">Team Morale & Cohesion</div>
              </div>
              <div className="bg-neutral-950 p-2.5 rounded border border-neutral-800/80">
                <div className="text-neutral-500 text-[11px]">COMBAT</div>
                <div className="text-base font-bold text-amber-400 mt-0.5">{state.leader.combat}</div>
                <div className="text-[10px] text-neutral-400">Firefight Command</div>
              </div>
              <div className="bg-neutral-950 p-2.5 rounded border border-neutral-800/80">
                <div className="text-neutral-500 text-[11px]">INTELLIGENCE</div>
                <div className="text-base font-bold text-amber-400 mt-0.5">{state.leader.intelligence}</div>
                <div className="text-[10px] text-neutral-400">Recon & Evasion</div>
              </div>
              <div className="bg-neutral-950 p-2.5 rounded border border-neutral-800/80">
                <div className="text-neutral-500 text-[11px]">NEGOTIATION</div>
                <div className="text-base font-bold text-amber-400 mt-0.5">{state.leader.negotiation}</div>
                <div className="text-[10px] text-neutral-400">Bribes & Truces</div>
              </div>
              <div className="bg-neutral-950 p-2.5 rounded border border-neutral-800/80">
                <div className="text-neutral-500 text-[11px]">PLANNING</div>
                <div className="text-base font-bold text-amber-400 mt-0.5">{state.leader.planning}</div>
                <div className="text-[10px] text-neutral-400">Crisis Contingencies</div>
              </div>
            </div>

            {/* Triad Reputation Meter */}
            <div className="pt-3 border-t border-neutral-800 space-y-2 text-xs font-mono">
              <div className="text-neutral-400 text-[11px] uppercase tracking-wider mb-2">
                Public Perception & Spheres of Influence:
              </div>
              <div className="space-y-1.5">
                <div className="flex justify-between text-neutral-400">
                  <span>Underworld Street Notoriety:</span>
                  <span className="text-amber-400 font-bold">{state.reputation}/100</span>
                </div>
                <div className="w-full bg-neutral-950 h-1.5 rounded-full overflow-hidden border border-neutral-800">
                  <div className="bg-amber-500 h-full" style={{ width: `${state.reputation}%` }} />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-neutral-400">
                  <span>Civilian Public Standing:</span>
                  <span className="text-emerald-400 font-bold">{state.publicReputation}/100</span>
                </div>
                <div className="w-full bg-neutral-950 h-1.5 rounded-full overflow-hidden border border-neutral-800">
                  <div className="bg-emerald-500 h-full" style={{ width: `${state.publicReputation}%` }} />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-neutral-400">
                  <span>Political & Institutional Influence:</span>
                  <span className="text-blue-400 font-bold">{state.politicalReputation}/100</span>
                </div>
                <div className="w-full bg-neutral-950 h-1.5 rounded-full overflow-hidden border border-neutral-800">
                  <div className="bg-blue-500 h-full" style={{ width: `${state.politicalReputation}%` }} />
                </div>
              </div>
            </div>
          </div>

          {/* Quick Available Operations Preview */}
          <div className="bg-neutral-900/90 border border-neutral-800 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-mono uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
                <Crosshair size={14} className="text-amber-500" />
                Featured Operations & Contracts
              </h3>
              <button
                onClick={() => onNavigate('operations')}
                className="text-xs font-mono text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer"
              >
                <span>View All ({state.contracts.length})</span>
                <ChevronRight size={13} />
              </button>
            </div>

            <div className="space-y-2">
              {state.contracts.slice(0, 3).map(ct => (
                <div
                  key={ct.id}
                  onClick={() => onNavigate('operations')}
                  className="p-3 rounded bg-neutral-950/80 border border-neutral-800 hover:border-neutral-700 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-display font-semibold text-xs text-neutral-200">
                        {ct.title}
                      </span>
                      {ct.isMajorOperation && (
                        <span className="text-[10px] font-mono text-rose-400 font-bold">
                          [MAJOR OP]
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-neutral-400 font-mono mt-0.5">
                      Client: {ct.client} · Difficulty: {ct.difficulty} · Risk: {ct.riskLevel}
                    </div>
                  </div>
                  <div className="font-mono text-xs text-right sm:shrink-0">
                    <span className="text-emerald-400 font-bold">
                      ${ct.rewardCash.toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Regional News Wire & Urgent Dispatches */}
        <div className="space-y-4">
          <div className="bg-neutral-900/90 border border-neutral-800 rounded-lg p-4">
            <h3 className="text-xs font-mono uppercase tracking-wider text-neutral-400 mb-3 flex items-center gap-1.5">
              <Radio size={14} className="text-cyan-400" />
              Regional Intelligence Wire
            </h3>

            <div className="space-y-2.5 max-h-80 overflow-y-auto">
              {state.newsFeed.slice(0, 6).map(news => (
                <div
                  key={news.id}
                  className="p-2.5 rounded bg-neutral-950/70 border border-neutral-800 text-xs"
                >
                  <div className="flex items-center justify-between text-[10px] font-mono text-neutral-500 mb-1">
                    <span>{news.category.toUpperCase()}</span>
                    <span>DAY {news.day}</span>
                  </div>
                  <p className="text-neutral-300 font-sans leading-relaxed">
                    {news.headline}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Management Shortcuts */}
          <div className="bg-neutral-900/90 border border-neutral-800 rounded-lg p-4 font-mono text-xs space-y-2">
            <div className="text-neutral-400 text-[11px] uppercase tracking-wider mb-2">
              Management Corridors
            </div>
            <button
              onClick={() => onNavigate('members')}
              className="w-full text-left p-2.5 rounded bg-neutral-950 border border-neutral-800 hover:border-neutral-700 flex items-center justify-between text-neutral-300 hover:text-white transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Users size={14} className="text-amber-500" />
                <span>Crew Roster & Recruitment</span>
              </div>
              <ChevronRight size={13} />
            </button>
            <button
              onClick={() => onNavigate('market')}
              className="w-full text-left p-2.5 rounded bg-neutral-950 border border-neutral-800 hover:border-neutral-700 flex items-center justify-between text-neutral-300 hover:text-white transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Shield size={14} className="text-emerald-500" />
                <span>Black Market & Ammunition</span>
              </div>
              <ChevronRight size={13} />
            </button>
            <button
              onClick={() => onNavigate('territory')}
              className="w-full text-left p-2.5 rounded bg-neutral-950 border border-neutral-800 hover:border-neutral-700 flex items-center justify-between text-neutral-300 hover:text-white transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <MapPin size={14} className="text-purple-500" />
                <span>Regional Turf & Vector Map</span>
              </div>
              <ChevronRight size={13} />
            </button>
            <button
              onClick={() => onNavigate('businesses')}
              className="w-full text-left p-2.5 rounded bg-neutral-950 border border-neutral-800 hover:border-neutral-700 flex items-center justify-between text-neutral-300 hover:text-white transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Briefcase size={14} className="text-blue-500" />
                <span>Front Businesses & Venues</span>
              </div>
              <ChevronRight size={13} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
