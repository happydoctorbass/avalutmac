import { CardData } from '@/types/game';
import { FULL_DECK } from '@/lib/deck';
import styles from './AdminCardGrid.module.css';

interface AdminCardGridProps {
  cardCount: number;
  selectedCards: (CardData | null)[];
  onCardChange: (index: number, card: CardData | null) => void;
  onRevealCard: (index: number) => void;
  revealedStates: boolean[];
}

export function AdminCardGrid({ cardCount, selectedCards, onCardChange, onRevealCard, revealedStates }: AdminCardGridProps) {
  const slots = Array.from({ length: cardCount }, (_, i) => i);

  const handleSelect = (idx: number, val: string) => {
    if (!val) return onCardChange(idx, null);
    const [rank, suit] = val.split('-');
    const c = FULL_DECK.find(card => card.rank === rank && card.suit === suit) || null;
    onCardChange(idx, c);
  };

  const isCardUsed = (card: CardData, currentIndex: number) => {
    return selectedCards.some((sc, i) => sc && i !== currentIndex && sc.rank === card.rank && sc.suit === card.suit);
  };

  return (
    <div className={styles.grid}>
      {slots.map((idx) => {
        const card = selectedCards[idx];
        const val = card ? `${card.rank}-${card.suit}` : '';
        const isRevealed = revealedStates[idx];

        return (
          <div key={idx} className={styles.cardContainer}>
            <button
              type="button"
              className={`${styles.cardBtn} ${isRevealed ? styles.revealed : ''}`}
              onClick={() => onRevealCard(idx)}
              disabled={isRevealed || !card}
            >
              <span className={styles.cardLabel}>Карта {idx + 1}</span>
              {card ? (
                <span className={`${styles.cardValue} ${card.color === 'red' ? styles.red : ''}`}>
                  {card.rank}{card.suit}
                </span>
              ) : (
                <span className={styles.cardEmpty}>?</span>
              )}
            </button>
            <select value={val} onChange={e => handleSelect(idx, e.target.value)} className={styles.select}>
              <option value="">- Выбрать -</option>
              {FULL_DECK.map((c) => (
                <option key={`${c.rank}-${c.suit}`} value={`${c.rank}-${c.suit}`} disabled={isCardUsed(c, idx)}>
                  {c.rank} {c.suit}
                </option>
              ))}
            </select>
          </div>
        );
      })}
    </div>
  );
}
