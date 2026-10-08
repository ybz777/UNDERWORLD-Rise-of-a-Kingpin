import React from 'react';
import { GameState } from '../game/types';
import { Award, CheckCircle2, Lock } from 'lucide-react';

interface AchievementsScreenProps {
  state: GameState;
}

export const AchievementsScreen: React.FC<AchievementsScreenProps> = ({ state }) => {
  const unlockedCount = state.achievements.filter(a => a.unlocked).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-display font-bold text-neutral-100 flex items-center gap-2">
            <Award className="text-amber-500" size={24} />
            <span>Kingpin Milestones & Achievements</span>
          </h2>
          <p className="text-xs text-neutral-400 font-mono mt-0.5">
            {unlockedCount} of {state.achievements.length} achievements unlocked.
          </p>
        </div>

        <div className="font-mono text-xs text-neutral-400">
          Completion: <span className="text-amber-400 font-bold">{Math.round((unlockedCount / state.achievements.length) * 100)}%</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {state.achievements.map(ach => (
          <div
            key={ach.id}
            className={`p-4 rounded-lg border flex items-start gap-3 transition-all ${
              ach.unlocked
                ? 'bg-neutral-900 border-amber-500/60 shadow-lg'
                : 'bg-neutral-950/70 border-neutral-800 opacity-60'
            }`}
          >
            <div
              className={`p-2 rounded mt-0.5 ${
                ach.unlocked
                  ? 'bg-amber-950/80 text-amber-400 border border-amber-600'
                  : 'bg-neutral-900 text-neutral-600 border border-neutral-800'
              }`}
            >
              {ach.unlocked ? <CheckCircle2 size={20} /> : <Lock size={20} />}
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between gap-2">
                <span className="font-display font-bold text-xs text-neutral-100">
                  {ach.title}
                </span>
                <span className="text-[10px] font-mono text-neutral-500 uppercase">
                  {ach.category}
                </span>
              </div>
              <p className="text-xs text-neutral-400 font-sans leading-relaxed">
                {ach.description}
              </p>
              {ach.unlocked && ach.unlockedDay && (
                <div className="text-[10px] font-mono text-amber-500 pt-1">
                  Unlocked on Day {ach.unlockedDay}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
