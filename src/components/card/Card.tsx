'use client';

import { motion } from 'framer-motion';
import styles from './Card.module.css';

interface CardProps {
  isRevealed: boolean;
  value: string; // Например "A♠"
}

export function Card({ isRevealed, value }: CardProps) {
  const isRed = value.includes('♥') || value.includes('♦');
  const color = isRed ? '#e50000' : '#1a1a1a';
  
  // Отделяем ранг от масти (последний символ — масть)
  const rank = value.slice(0, -1);
  const suit = value.slice(-1);

  return (
    <div className={styles.cardScene}>
      <motion.div 
        className={styles.cardInner}
        initial={false}
        animate={{ rotateY: isRevealed ? 180 : 0 }}
        transition={{ duration: 0.6, type: 'spring', stiffness: 260, damping: 20 }}
      >
        <div className={`${styles.face} ${styles.back}`}>A</div>
        
        <div className={`${styles.face} ${styles.front}`} style={{ color }}>
          <div className={`${styles.indexContainer} ${styles.topLeft}`}>
            <span className={styles.rank}>{rank}</span>
            <span className={styles.suit}>{suit}</span>
          </div>
          
          <div className={styles.centerSuit}>{suit}</div>
          
          <div className={`${styles.indexContainer} ${styles.bottomRight}`}>
            <span className={styles.rank}>{rank}</span>
            <span className={styles.suit}>{suit}</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}