'use client';

import { useState } from 'react';
import { AdminPanel } from '@/components/admin/AdminPanel';
import { CardData } from '@/types/game';

export default function AdminPage() {
  const [currentCards, setCurrentCards] = useState<CardData[]>([]);

  return (
    <div className="min-h-screen bg-slate-100">
      <AdminPanel currentCards={currentCards} onCardsGenerated={setCurrentCards} />
      
      {currentCards.length > 0 && (
        <div className="p-8 pt-0 text-slate-900">
          <h2 className="text-sm uppercase tracking-wider text-slate-500 mb-4 font-bold">
            Current Deal Summary
          </h2>
          <div className="flex gap-4">
            {currentCards.map((card, idx) => (
              <div key={idx} className="px-6 py-4 bg-white border-2 border-slate-200 rounded-xl font-bold text-lg shadow-sm">
                <span className="text-slate-400 text-sm block mb-1">CARD {idx + 1}</span>
                <span className={card.color === 'red' ? 'text-red-500' : 'text-slate-900'}>
                  {card.rank}{card.suit}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
