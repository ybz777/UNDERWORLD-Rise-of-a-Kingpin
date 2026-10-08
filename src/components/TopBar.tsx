import React from 'react';
import { GameState, AlertnessLevel } from '../game/types';
import { sounds } from '../game/audio';
import {
  ShieldAlert,
  Volume2,
  VolumeX,
  Play,
  Pause,
  FastForward,
  Save,
  DollarSign,
  TrendingUp,
  Award,
  Star,
  Users
} from 'lucide-react';

interface TopBarProps {
  state: GameState;
  onUpdateState: (updater: (prev: GameState) => GameState) => void;
  onManualSave: () => void;
  isAudioMuted: boolean;
  onToggleAudio: () => void;
  onNewGameClick: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  state,
  onUpdateState,
  onManualSave,
  isAudioMuted,
  onToggleAudio,
  onNewGameClick
}) => {
  const togglePause = () => {
    sounds.playClick();
    onUpdateState(s => ({ ...s, isPaused: !s.isPaused }));
  };

  const setSpeed = (spd: 1 | 3 | 5 | 10) => {
    sounds.playClick();
    onUpdateState(s => ({ ...s, timeSpeed: spd, isPaused: false }));
  };

  const setAlertness = (level: AlertnessLevel) => {
    sounds.playClick();
    onUpdateState(s => ({ ...s, alertness: level }));
  };

  const netDaily = state.dailyIncome - state.dailyExpense;

  return (
    <header className="sticky top-0 z-40 bg-neutral-950/95 border-b border-neutral-800 backdrop-blur-md px-3 sm:px-6 py-2.5">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Left: Organization Title & Date */}
        <div className="flex items-center gap-3">
          <div className="flex flex-col">
            <span className="font-display font-bold text-base sm:text-lg tracking-wider text-neutral-100 flex items-center gap-2">
              <span className="text-amber-500">UNDERWORLD</span>
              <span className="text-xs text-neutral-400 font-sans font-normal border-l border-neutral-700 pl-2">
                {state.leader.organizationName}
              </span>
            </span>
            <div className="flex items-center gap-2 text-xs text-neutral-400 font-mono">
              <span className="text-amber-400 font-semibold">DAY {state.day}</span>
              <span aria-hidden="true">·</span>
              <span>{state.organizationStyle}</span>
            </div>
          </div>

          {/* Time Controls */}
          <div className="flex items-center bg-neutral-900 border border-neutral-800 rounded px-1.5 py-1 gap-1 ml-1 sm:ml-3">
            <button
              onClick={togglePause}
              title={state.isPaused ? "Resume Time" : "Pause Time"}
              className={`p-1 rounded text-xs transition-colors flex items-center justify-center ${
                state.isPaused
                  ? 'bg-amber-600 text-neutral-950 font-bold'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              {state.isPaused ? <Play size={13} fill="currentColor" /> : <Pause size={13} />}
            </button>
            {([1, 3, 5, 10] as const).map(spd => (
              <button
                key={spd}
                onClick={() => setSpeed(spd)}
                title={`Speed ${spd}x`}
                className={`px-1.5 py-0.5 text-xs font-mono rounded transition-colors ${
                  !state.isPaused && state.timeSpeed === spd
                    ? 'bg-neutral-700 text-amber-300 font-bold'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                {spd}x
              </button>
            ))}
          </div>
        </div>

        {/* Center: Live Core Metrics Bar */}
        <div className="flex items-center flex-wrap gap-2 sm:gap-4 text-xs font-mono">
          {/* Cash & Daily Revenue */}
          <div className="flex items-center gap-1.5 bg-neutral-900/80 border border-neutral-800 px-2.5 py-1 rounded">
            <DollarSign size={14} className="text-emerald-400" />
            <span className="text-emerald-400 font-bold text-sm tracking-tight tabular-nums">
              ${state.cash.toLocaleString()}
            </span>
            <span className={`text-[11px] tabular-nums ${netDaily >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
              ({netDaily >= 0 ? `+${netDaily.toLocaleString()}` : netDaily.toLocaleString()}/d)
            </span>
          </div>

          {/* Reputation & Prestige */}
          <div className="hidden md:flex items-center gap-3 bg-neutral-900/80 border border-neutral-800 px-2.5 py-1 rounded">
            <div className="flex items-center gap-1 text-amber-300" title="Underworld Reputation">
              <Award size={13} />
              <span className="text-neutral-400">REP:</span>
              <span className="font-bold">{state.reputation}</span>
            </div>
            <div className="flex items-center gap-1 text-purple-300" title="Elite Prestige">
              <Star size={13} />
              <span className="text-neutral-400">PRESTIGE:</span>
              <span className="font-bold">{state.prestige}</span>
            </div>
          </div>

          {/* Wanted & Police Pressure */}
          <div className="flex items-center gap-2 bg-neutral-900/80 border border-neutral-800 px-2.5 py-1 rounded">
            <div className="flex items-center gap-1" title="Wanted Level (0-100)">
              <span className="text-neutral-400">WANTED:</span>
              <span className={`font-bold ${state.wantedLevel > 60 ? 'text-rose-500 animate-pulse' : state.wantedLevel > 30 ? 'text-amber-400' : 'text-neutral-300'}`}>
                {state.wantedLevel}%
              </span>
            </div>
            <span className="text-neutral-700">|</span>
            <div className="flex items-center gap-1" title="Police Pressure Level (0-100)">
              <span className="text-neutral-400">PRESSURE:</span>
              <span className={`font-bold ${state.policePressure > 65 ? 'text-rose-400' : 'text-neutral-300'}`}>
                {state.policePressure}%
              </span>
            </div>
          </div>

          {/* Alertness Selector */}
          <div className="hidden lg:flex items-center gap-1">
            <span className="text-[11px] text-neutral-400">ALERT:</span>
            <select
              value={state.alertness}
              onChange={(e) => setAlertness(e.target.value as AlertnessLevel)}
              className={`text-[11px] bg-neutral-900 border rounded px-1.5 py-1 font-mono cursor-pointer focus:outline-none ${
                state.alertness === 'LOCKDOWN'
                  ? 'border-rose-600 text-rose-400'
                  : state.alertness === 'HIGH ALERT'
                  ? 'border-amber-600 text-amber-300'
                  : 'border-neutral-700 text-neutral-300'
              }`}
            >
              <option value="NORMAL">NORMAL</option>
              <option value="CAUTIOUS">CAUTIOUS (-$150/d)</option>
              <option value="HIGH ALERT">HIGH ALERT (-$450/d)</option>
              <option value="LOCKDOWN">LOCKDOWN (-$900/d)</option>
            </select>
          </div>
        </div>

        {/* Right Actions: Mute, Save, New Game */}
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleAudio}
            className="p-1.5 rounded bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-neutral-200 border border-neutral-800 transition-colors"
            title={isAudioMuted ? "Unmute Audio" : "Mute Tactical Audio"}
          >
            {isAudioMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
          </button>

          <button
            onClick={onManualSave}
            className="flex items-center gap-1 px-2.5 py-1 text-xs font-mono bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-700 rounded transition-colors"
            title="Save Game to Browser Storage"
          >
            <Save size={13} className="text-amber-500" />
            <span className="hidden sm:inline">SAVE</span>
          </button>

          <button
            onClick={onNewGameClick}
            className="px-2.5 py-1 text-xs font-mono bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-neutral-200 border border-neutral-800 rounded transition-colors"
            title="Start New Syndicate Game"
          >
            NEW GAME
          </button>
        </div>
      </div>
    </header>
  );
};
