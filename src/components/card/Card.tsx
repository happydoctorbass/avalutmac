'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import styles from './Card.module.css';

interface CardProps {
  isRevealed: boolean;
  value: string;
  cardCount?: number;
}

export function Card({ isRevealed, value, cardCount = 5 }: CardProps) {
  const isRed = value.includes('♥') || value.includes('♦');
  const color = isRed ? '#e50000' : '#1a1a1a';
  const rank = value.slice(0, -1);
  const suit = value.slice(-1);
  
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
            <Image src="/logo.png" alt="Logo" fill style={{ objectFit: 'contain' }} />
          </div>
        </div>
        
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