'use client';

import { motion } from 'framer-motion';
import styles from './Card.module.css';

interface CardProps {
  isRevealed: boolean;
  value: string;
  cardCount?: number;
}

const suitNames: Record<string, string> = {
  '♠': 'Spades',
  '♥': 'Hearts',
  '♦': 'Diamonds',
  '♣': 'Clubs',
};

export function Card({ isRevealed, value, cardCount = 5 }: CardProps) {
  const suit = value.slice(-1);
  const rank = value.slice(0, -1);
  const suitName = suitNames[suit] ?? 'Spades';
  const cardImage = `/images/${suitName}-${rank}.png`;

  const scaleClass = cardCount === 2 ? styles.largeCard : '';

  return (
    <div className={`${styles.cardScene} ${scaleClass}`}>
      <motion.div 
        className={styles.cardInner}
        initial={false}
        animate={{ rotateY: isRevealed ? 180 : 0 }}
        transition={{ duration: 0.6, type: 'spring', stiffness: 260, damping: 20 }}
      >
        <div className={`${styles.face} ${styles.back}`}>
          <div className={styles.logoContainer}>
            <img src="/logos/logo.png" alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </div>
        </div>

        <div className={`${styles.face} ${styles.front}`} style={{ padding: 0, overflow: 'hidden', background: '#fff' }}>
          <img
            src={cardImage}
            alt={`${rank} of ${suitName}`}
            style={{
              width: '100%',
              height: '100%',
              display: 'block',
              objectFit: 'cover',
              borderRadius: '12px',
            }}
          />
        </div>
      </motion.div>
    </div>
  );
}
