import React, { useState } from 'react';
import { OrganizationStyle } from '../game/types';
import { REGIONS } from '../data/regions';
import { sounds } from '../game/audio';
import { EntityImage } from '../components/EntityImage';
import {
  MapPin,
  Shield,
  Zap,
  Users,
  Award,
  ChevronRight,
  Sliders,
  X
} from 'lucide-react';

interface NewGameModalProps {
  onStartGame: (params: {
    leaderName: string;
    orgName: string;
    regionId: string;
    orgStyle: OrganizationStyle;
    charisma: number;
    leadership: number;
    combat: number;
    intelligence: number;
    negotiation: number;
    planning: number;
  }) => void;
  onCancel?: () => void;
  isInitial?: boolean;
}

export const NewGameModal: React.FC<NewGameModalProps> = ({
  onStartGame,
  onCancel,
  isInitial = false
}) => {
  const [selectedRegionId, setSelectedRegionId] = useState<string>('eastern_port');
  const [leaderName, setLeaderName] = useState<string>('Vance Kovac');
  const [orgName, setOrgName] = useState<string>('The Iron Sovereign');
  const [orgStyle, setOrgStyle] = useState<OrganizationStyle>('Organized Crime Syndicate');

  // Stats point allocation: 420 total points across 6 stats
  const [charisma, setCharisma] = useState<number>(75);
  const [leadership, setLeadership] = useState<number>(70);
  const [combat, setCombat] = useState<number>(65);
  const [intelligence, setIntelligence] = useState<number>(70);
  const [negotiation, setNegotiation] = useState<number>(70);
  const [planning, setPlanning] = useState<number>(70);

  const selectedRegion = REGIONS.find(r => r.id === selectedRegionId) || REGIONS[2];

  const handleLaunch = () => {
    sounds.playGunRack();
    onStartGame({
      leaderName: leaderName.trim() || 'Commander',
      orgName: orgName.trim() || 'Underworld Syndicate',
      regionId: selectedRegionId,
      orgStyle,
      charisma,
      leadership,
      combat,
      intelligence,
      negotiation,
      planning
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md overflow-y-auto">
      <div className="w-full max-w-4xl bg-neutral-900 border border-neutral-700 rounded-lg shadow-2xl overflow-hidden flex flex-col my-auto max-h-[95vh]">
        {/* Header */}
        <div className="bg-neutral-950 border-b border-neutral-800 p-5 flex items-center justify-between">
          <div>
            <div className="text-xs font-mono text-amber-500 uppercase tracking-wider mb-0.5">
              ESTABLISH UNDERWORLD EMPIRE
            </div>
            <h2 className="text-xl sm:text-2xl font-display font-bold text-neutral-100">
              Syndicate Inception & Region Selection
            </h2>
          </div>
          {!isInitial && onCancel && (
            <button
              onClick={onCancel}
              className="p-1.5 rounded text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 space-y-6 overflow-y-auto flex-1">
          {/* Organization & Leader Identity */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-mono text-neutral-400 block mb-1.5">
                Commander Name
              </label>
              <input
                type="text"
                value={leaderName}
                onChange={e => setLeaderName(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded p-2 text-xs font-mono text-neutral-100 focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-mono text-neutral-400 block mb-1.5">
                Syndicate Organization Name
              </label>
              <input
                type="text"
                value={orgName}
                onChange={e => setOrgName(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded p-2 text-xs font-mono text-neutral-100 focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-mono text-neutral-400 block mb-1.5">
                Organization Operating Style
              </label>
              <select
                value={orgStyle}
                onChange={e => setOrgStyle(e.target.value as OrganizationStyle)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded p-2 text-xs font-mono text-neutral-100 focus:border-amber-500 focus:outline-none cursor-pointer"
              >
                <option value="Street Gang">Street Gang</option>
                <option value="Organized Crime Syndicate">Organized Crime Syndicate</option>
                <option value="Smuggling / Black Market Organization">Smuggling / Black Market Organization</option>
                <option value="Semi-Military Organization">Semi-Military Organization</option>
                <option value="Private Security / Contract Organization">Private Security / Contract Organization</option>
                <option value="Political Power Broker">Political Power Broker</option>
                <option value="Hybrid Organization">Hybrid Organization</option>
              </select>
            </div>
          </div>

          {/* Region Selection */}
          <div>
            <div className="text-xs font-mono uppercase text-neutral-400 tracking-wider mb-2 flex items-center gap-1.5">
              <MapPin size={14} className="text-amber-500" />
              <span>Choose Starting Territory Region</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {REGIONS.map(reg => {
                const isSelected = selectedRegionId === reg.id;
                return (
                  <div
                    key={reg.id}
                    onClick={() => {
                      sounds.playClick();
                      setSelectedRegionId(reg.id);
                    }}
                    className={`p-3.5 rounded border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-neutral-800 border-amber-500 ring-1 ring-amber-500/50 shadow-md'
                        : 'bg-neutral-950/80 border-neutral-800 hover:border-neutral-700 hover:bg-neutral-900/60'
                    }`}
                  >
                    <div className="w-full h-24 rounded overflow-hidden border border-neutral-800 mb-2 relative bg-neutral-950">
                      <EntityImage
                        src={reg.image}
                        alt={reg.name}
                        type="location"
                        id={reg.id}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent opacity-80" />
                    </div>

                    <div className="font-display font-bold text-sm text-neutral-100 mb-0.5">
                      {reg.name}
                    </div>
                    <div className="text-[11px] font-mono text-amber-400 mb-2">
                      {reg.title}
                    </div>
                    <p className="text-xs text-neutral-400 font-sans leading-relaxed mb-3">
                      {reg.description}
                    </p>

                    <div className="space-y-1 pt-2 border-t border-neutral-800 text-[10px] font-mono">
                      <div className="text-emerald-400">
                        {reg.advantages[0]}
                      </div>
                      <div className="text-rose-400">
                        {reg.disadvantages[0]}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Leader Attributes Allocation */}
          <div className="bg-neutral-950 border border-neutral-800 rounded p-4 space-y-3">
            <div className="text-xs font-mono text-neutral-400 uppercase tracking-wider">
              Tune Commander Starting Proficiencies
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 font-mono text-xs">
              <div>
                <label className="flex justify-between text-neutral-400 mb-1">
                  <span>Charisma</span>
                  <span className="text-amber-400 font-bold">{charisma}</span>
                </label>
                <input
                  type="range"
                  min="40"
                  max="90"
                  value={charisma}
                  onChange={e => setCharisma(Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>

              <div>
                <label className="flex justify-between text-neutral-400 mb-1">
                  <span>Leadership</span>
                  <span className="text-amber-400 font-bold">{leadership}</span>
                </label>
                <input
                  type="range"
                  min="40"
                  max="90"
                  value={leadership}
                  onChange={e => setLeadership(Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>

              <div>
                <label className="flex justify-between text-neutral-400 mb-1">
                  <span>Combat</span>
                  <span className="text-amber-400 font-bold">{combat}</span>
                </label>
                <input
                  type="range"
                  min="40"
                  max="90"
                  value={combat}
                  onChange={e => setCombat(Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>

              <div>
                <label className="flex justify-between text-neutral-400 mb-1">
                  <span>Intelligence</span>
                  <span className="text-amber-400 font-bold">{intelligence}</span>
                </label>
                <input
                  type="range"
                  min="40"
                  max="90"
                  value={intelligence}
                  onChange={e => setIntelligence(Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>

              <div>
                <label className="flex justify-between text-neutral-400 mb-1">
                  <span>Negotiation</span>
                  <span className="text-amber-400 font-bold">{negotiation}</span>
                </label>
                <input
                  type="range"
                  min="40"
                  max="90"
                  value={negotiation}
                  onChange={e => setNegotiation(Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>

              <div>
                <label className="flex justify-between text-neutral-400 mb-1">
                  <span>Planning</span>
                  <span className="text-amber-400 font-bold">{planning}</span>
                </label>
                <input
                  type="range"
                  min="40"
                  max="90"
                  value={planning}
                  onChange={e => setPlanning(Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-neutral-950 border-t border-neutral-800 p-4 sm:p-5 flex items-center justify-between">
          <div className="text-xs font-mono text-neutral-400">
            Starting Treasury: <strong className="text-emerald-400">${selectedRegion.startingCashBonus.toLocaleString()}</strong> · Starting Armory: <strong className="text-neutral-200">3 Firearms</strong>
          </div>

          <button
            onClick={handleLaunch}
            className="px-6 py-2.5 rounded font-display font-bold text-xs uppercase tracking-wider bg-amber-600 hover:bg-amber-500 text-neutral-950 transition-colors shadow-lg cursor-pointer flex items-center gap-2"
          >
            <Zap size={15} fill="currentColor" />
            <span>Found Syndicate & Enter Underworld</span>
          </button>
        </div>
      </div>
    </div>
  );
};
