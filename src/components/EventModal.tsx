import React from 'react';
import { GameEvent, GameState } from '../game/types';
import { sounds } from '../game/audio';
import { getEventVisual } from '../game/visuals';
import { EntityImage } from './EntityImage';
import { AlertCircle, HelpCircle } from 'lucide-react';

interface EventModalProps {
  event: GameEvent;
  state: GameState;
  onChoiceSelect: (choiceIndex: number) => void;
}

export const EventModal: React.FC<EventModalProps> = ({
  event,
  state,
  onChoiceSelect
}) => {
  const eventImage = getEventVisual(event.category, event.title);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="w-full max-w-xl bg-neutral-900 border border-neutral-700 rounded-lg shadow-2xl overflow-hidden flex flex-col my-auto">
        {/* Cinematic Event Artwork Header */}
        <div className="w-full h-44 overflow-hidden border-b border-neutral-800 relative bg-neutral-950">
          <EntityImage
            src={eventImage}
            alt={event.title}
            type="event"
            category={event.category}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent" />
          <div className="absolute bottom-2.5 left-4">
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-black/80 text-amber-400 border border-amber-800/50">
              {event.category} INTELLIGENCE REPORT
            </span>
          </div>
        </div>

        <div className="bg-neutral-950 border-b border-neutral-800 p-4 sm:p-5 flex items-center gap-3">
          <div className="p-2 rounded bg-amber-950/70 border border-amber-700/60 text-amber-400">
            <AlertCircle size={24} />
          </div>
          <div>
            <div className="text-[11px] font-mono uppercase text-amber-500 tracking-wider">
              PRIORITY UNDERWORLD EVENT · {event.category}
            </div>
            <h2 className="text-lg font-display font-bold text-neutral-100">
              {event.title}
            </h2>
          </div>
        </div>

        <div className="p-4 sm:p-6 space-y-4">
          <p className="text-sm text-neutral-300 leading-relaxed font-sans bg-neutral-950/60 border border-neutral-800 p-3.5 rounded">
            {event.description}
          </p>

          <div className="space-y-2 pt-2">
            <div className="text-xs font-mono text-neutral-400 uppercase tracking-wider mb-2">
              Select Strategic Directive:
            </div>
            {event.choices.map((choice, idx) => {
              const canAfford = !choice.cost || state.cash >= choice.cost;
              return (
                <button
                  key={idx}
                  disabled={!canAfford}
                  onClick={() => {
                    sounds.playClick();
                    onChoiceSelect(idx);
                  }}
                  className={`w-full text-left p-3.5 rounded border transition-all ${
                    canAfford
                      ? 'bg-neutral-950/80 border-neutral-800 hover:border-amber-600 hover:bg-neutral-900 cursor-pointer'
                      : 'bg-neutral-950/40 border-neutral-900 text-neutral-600 cursor-not-allowed opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-bold text-neutral-200">
                    <span>{choice.text}</span>
                    {choice.cost && (
                      <span className="font-mono text-amber-400">
                        -${choice.cost.toLocaleString()}
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-neutral-400 font-sans mt-1">
                    {choice.description}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
