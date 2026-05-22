'use client';

import { Card } from '../card/Card';
import { useGameContext } from '@/context/GameContext';
import { motion } from 'framer-motion';
import { DICTIONARY } from '@/lib/constants';
import { TimerDisplay } from './TimerDisplay';
import styles from './GameBoard.module.css';

export function GameBoard() {
  const { revealedCards, cards, playerId, betAmount, language, cardCount, timerDuration, gameState, gameType } = useGameContext();
  const dict = DICTIONARY[language];
  const isRunning = gameState === 'GAME';
  
  const title = gameType === 'BACCARAT_TRIPLE' ? dict.titleBACCARAT_TRIPLE : dict.titleNIU_NIU_TRIPLE;

  return (
    <div className={styles.board}>
      <div className={styles.topSection}>
        <TimerDisplay duration={timerDuration} isRunning={isRunning} />
        <h2 className={styles.title}>{title}</h2>
      </div>

      <div className={styles.cardsContainer}>
        {Array.from({ length: cardCount }).map((_, index) => {
          const card = cards[index];
          const value = card ? `${card.rank}${card.suit}` : '';
          const isRevealed = revealedCards[index] || false;
          
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 300, scale: 0.5 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: index * 0.15, type: 'spring', stiffness: 200, damping: 20 }}
            >
              <Card isRevealed={isRevealed} value={value} cardCount={cardCount} />
            </motion.div>
          );
        })}
      </div>

      <div className={styles.infoPanel}>
        <div className={styles.infoBlock}>
          <span className={styles.infoLabel}>👤 {dict.guest}</span>
          <span className={styles.infoValue}>{playerId || '—'}</span>
        </div>
        <div className={styles.infoBlock}>
          <span className={styles.infoLabel}>$ {dict.bet}</span>
          <span className={styles.infoValue}>{betAmount.toLocaleString('en-US')}</span>
        </div>
      </div>
    </div>
  );
}
