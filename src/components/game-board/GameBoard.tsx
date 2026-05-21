'use client';

import { Card } from '../card/Card';
import { useGameContext } from '@/context/GameContext';
import { motion } from 'framer-motion';
import { DICTIONARY } from '@/lib/constants';
import styles from './GameBoard.module.css';

export function GameBoard() {
  const { revealedCards, cards, playerId, betAmount, language } = useGameContext();
  const dict = DICTIONARY[language];

  return (
    <div className={styles.board}>
      <h2 className={styles.title}>Niu Niu Bonus</h2>

      <div className={styles.cardsContainer}>
        {revealedCards.map((isRevealed, index) => {
          const card = cards[index];
          const value = card ? `${card.rank}${card.suit}` : '';
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 300, scale: 0.5 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: index * 0.15, type: 'spring', stiffness: 200, damping: 20 }}
            >
              <Card isRevealed={isRevealed} value={value} />
            </motion.div>
          );
        })}
      </div>

      <div className={styles.infoPanel}>
        <div className={styles.infoBlock}>
          <span className={styles.infoLabel}>{dict.guest}</span>
          <span className={styles.infoValue}>{playerId || '—'}</span>
        </div>
        <div className={styles.infoBlock}>
          <span className={styles.infoLabel}>{dict.bet}</span>
          <span className={styles.infoValue}>{betAmount.toLocaleString('en-US')}</span>
        </div>
      </div>
    </div>
  );
}
