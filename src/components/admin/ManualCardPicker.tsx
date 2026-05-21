'use client';

import { useState } from 'react';
import { CardData } from '@/types/game';
import { FULL_DECK } from '@/lib/deck';
import styles from './ManualCardPicker.module.css';

interface ManualCardPickerProps {
  selectedCards: (CardData | null)[];
  onChange: (index: number, card: CardData | null) => void;
}

export function ManualCardPicker({ selectedCards, onChange }: ManualCardPickerProps) {
  const handleSelect = (index: number, cardValue: string) => {
    if (!cardValue) {
      onChange(index, null);
      return;
    }
    const [rank, suit] = cardValue.split('-');
    const card = FULL_DECK.find(c => c.rank === rank && c.suit === suit) || null;
    onChange(index, card);
  };

  const isCardUsed = (card: CardData, currentIndex: number) => {
    return selectedCards.some((sc, i) => sc && i !== currentIndex && sc.rank === card.rank && sc.suit === card.suit);
  };

  return (
    <div className={styles.grid}>
      {[0, 1, 2, 3, 4].map((idx) => {
        const current = selectedCards[idx];
        const val = current ? `${current.rank}-${current.suit}` : '';
        return (
          <div key={idx} className={styles.slot}>
            <label className={styles.label}>Слот {idx + 1}</label>
            <select
              value={val}
              onChange={(e) => handleSelect(idx, e.target.value)}
              className={styles.select}
            >
              <option value="">- Выберите -</option>
              {FULL_DECK.map((c) => {
                const disabled = isCardUsed(c, idx);
                return (
                  <option key={`${c.rank}-${c.suit}`} value={`${c.rank}-${c.suit}`} disabled={disabled}>
                    {c.rank} {c.suit}
                  </option>
                );
              })}
            </select>
          </div>
        );
      })}
    </div>
  );
}
