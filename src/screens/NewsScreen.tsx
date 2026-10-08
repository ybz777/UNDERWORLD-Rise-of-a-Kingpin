import React from 'react';
import { GameState } from '../game/types';
import { Radio, History, Clock } from 'lucide-react';

interface NewsScreenProps {
  state: GameState;
}

export const NewsScreen: React.FC<NewsScreenProps> = ({ state }) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-display font-bold text-neutral-100 flex items-center gap-2">
          <Radio className="text-cyan-400" size={24} />
          <span>Regional Press Wire & Historical Ledger</span>
        </h2>
        <p className="text-xs text-neutral-400 font-mono mt-0.5">
          Archived press dispatches, police blotter bulletins, and operational event history.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* News Feed */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-5 space-y-4">
          <h3 className="text-xs font-mono uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
            <Radio size={14} className="text-cyan-400" />
            <span>Public Media Headlines ({state.newsFeed.length})</span>
          </h3>

          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
            {state.newsFeed.map(news => (
              <div
                key={news.id}
                className="p-3 bg-neutral-950 border border-neutral-800 rounded text-xs space-y-1"
              >
                <div className="flex items-center justify-between text-[10px] font-mono text-neutral-500">
                  <span className="text-cyan-400 font-semibold">{news.category.toUpperCase()}</span>
                  <span>DAY {news.day}</span>
                </div>
                <p className="text-neutral-200 font-sans leading-relaxed">
                  {news.headline}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Organization Operational History */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-5 space-y-4">
          <h3 className="text-xs font-mono uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
            <History size={14} className="text-amber-500" />
            <span>Syndicate Log & After-Action Records ({state.eventHistory.length})</span>
          </h3>

          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
            {state.eventHistory.map(item => (
              <div
                key={item.id}
                className="p-3 bg-neutral-950 border border-neutral-800 rounded text-xs space-y-1"
              >
                <div className="flex items-center justify-between text-[10px] font-mono">
                  <span className="font-bold text-neutral-300">{item.title}</span>
                  <span className="text-neutral-500">DAY {item.day}</span>
                </div>
                <p className="text-neutral-400 font-sans leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
