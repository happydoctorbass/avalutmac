'use client';

import { GAME_EVENTS } from '@/lib/pusher';
import { getRandomCards } from '@/lib/deck';
import { CardData } from '@/types/game';

interface AdminPanelProps {
  currentCards?: CardData[];
  onCardsGenerated?: (cards: CardData[]) => void;
}

export function AdminPanel({ currentCards = [], onCardsGenerated }: AdminPanelProps) {
  const sendCommand = async (event: string, data: any) => {
    try {
      await fetch('/api/pusher', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event, data }),
      });
    } catch (error) {
      console.error('Failed to send command:', error);
    }
  };

  return (
    <div className="p-8 text-slate-900 font-sans">
      <h1 className="text-3xl font-bold mb-8 border-b pb-4">Pitboss Control Panel</h1>
      
      <section className="mb-12">
        <h2 className="text-sm uppercase tracking-wider text-slate-500 mb-4 font-bold">Main Controls</h2>
        <div className="flex gap-4">
          <button 
            onClick={() => {
              const randomCards = getRandomCards(5);
              onCardsGenerated?.(randomCards);
              sendCommand(GAME_EVENTS.TOGGLE_STATE, { state: 'GAME', cards: randomCards });
            }}
            className="px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-lg transition-all active:scale-95"
          >
            ACTIVATE GAME MODE
          </button>

          <button 
            onClick={() => {
              const randomCards = getRandomCards(5);
              onCardsGenerated?.(randomCards);
              sendCommand(GAME_EVENTS.TOGGLE_STATE, { state: 'GAME', cards: randomCards });
            }}
            className="px-8 py-4 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold shadow-lg transition-all active:scale-95"
          >
            NEW SHUFFLE
          </button>

          <button 
            onClick={() => {
              onCardsGenerated?.([]);
              sendCommand(GAME_EVENTS.TOGGLE_STATE, { state: 'IDLE' });
            }}
            className="px-8 py-4 bg-slate-700 hover:bg-slate-800 text-white rounded-xl font-bold shadow-lg transition-all active:scale-95"
          >
            RETURN TO SCREENSAVER
          </button>
        </div>
      </section>

      <section>
        <h2 className="text-sm uppercase tracking-wider text-slate-500 mb-4 font-bold">Individual Card Reveal</h2>
        <div className="grid grid-cols-5 gap-4 max-w-4xl">
          {[0, 1, 2, 3, 4].map((idx) => (
            <button 
              key={idx}
              onClick={() => sendCommand(GAME_EVENTS.REVEAL_CARD, { index: idx, card: currentCards[idx] })}
              className="px-4 py-8 bg-white border-2 border-slate-200 hover:border-amber-500 rounded-xl font-bold transition-colors shadow-sm text-slate-700 hover:text-amber-600"
            >
              CARD {idx + 1}
              <span className="block text-[10px] text-slate-400 mt-2 font-normal">CLICK TO OPEN</span>
              {currentCards[idx] && (
                <span className={`block text-xl mt-2 font-bold ${currentCards[idx].color === 'red' ? 'text-red-500' : 'text-slate-900'}`}>
                  {currentCards[idx].rank}{currentCards[idx].suit}
                </span>
              )}
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}