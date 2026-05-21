'use client';

import { Card } from '../card/Card';
import { useGameSync } from '@/hooks/useGameSync';
import { motion } from 'framer-motion';
import styles from './GameBoard.module.css';

export function GameBoard() {
  const { revealedCards, cards } = useGameSync();

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
    </div>
  );
}