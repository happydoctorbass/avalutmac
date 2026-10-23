'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import styles from './Card.module.css';

interface CardProps {
  isRevealed: boolean;
  value: string;
  cardCount?: number;
}

const SUIT_FILE_MAP: Record<string, string> = {
  '♠': 'Spades',
  '♣': 'Clubs',
  '♥': 'Hearts',
  '♦': 'Diamonds',
};

export function Card({ isRevealed, value, cardCount = 5 }: CardProps) {
  const rank = value.slice(0, -1);
  const suit = value.slice(-1);
  const imageSrc = SUIT_FILE_MAP[suit] && rank ? `/cards/${SUIT_FILE_MAP[suit]}-${rank}.png` : null;
  
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
        
        <div className={`${styles.face} ${styles.front}`}>
          {imageSrc ? (
            <img 
              src={imageSrc} 
              alt={value} 
              draggable={false}
              className={styles.cardImage} 
            />
          ) : null}
        </div>
      </motion.div>
    </div>
  );
}