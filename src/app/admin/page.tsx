'use client';

import { useState } from 'react';
import { AdminPanel } from '@/components/admin/AdminPanel';
import { CardData } from '@/types/game';
import pageStyles from './AdminPage.module.css';
import dealStyles from '@/components/admin/AdminDealSummary.module.css';

export default function AdminPage() {
  const [currentCards, setCurrentCards] = useState<CardData[]>([]);

  return (
    <div className={pageStyles.page}>
      <AdminPanel currentCards={currentCards} onCardsGenerated={setCurrentCards} />

      {currentCards.length > 0 && (
        <div className={dealStyles.wrap}>
          <h2 className={dealStyles.title}>Расклад в этой раздаче</h2>
          <div className={dealStyles.grid}>
            {currentCards.map((card, idx) => (
              <div key={idx} className={dealStyles.dealCard}>
                <span className={dealStyles.dealLabel}>Карта {idx + 1}</span>
                <span className={card.color === 'red' ? dealStyles.dealRed : ''}>
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
