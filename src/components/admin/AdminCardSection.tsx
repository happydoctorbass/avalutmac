'use client';

import { CardData } from '@/types/game';
import ui from './AdminUi.module.css';
import styles from './AdminCardSection.module.css';

interface AdminCardSectionProps {
  currentCards: CardData[];
  onRevealAll: () => void;
  onRevealCard: (index: number) => void;
}

export function AdminCardSection({ currentCards, onRevealAll, onRevealCard }: AdminCardSectionProps) {
  return (
    <div className={styles.wrap}>
      <button type="button" onClick={onRevealAll} className={ui.btnSecondary}>
        ОТКРЫТЬ ВСЕ КАРТЫ
      </button>
      <div className={styles.cardGrid}>
        {[0, 1, 2, 3, 4].map((idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => onRevealCard(idx)}
            className={styles.cardBtn}
          >
            Карта {idx + 1}
            <span className={styles.cardHint}>Открыть на ТВ</span>
            {currentCards[idx] && (
              <span className={`${styles.cardValue} ${currentCards[idx].color === 'red' ? styles.cardRed : ''}`}>
                {currentCards[idx].rank}{currentCards[idx].suit}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
