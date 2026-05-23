'use client';

import { useGameContext } from '@/context/GameContext';
import { useFinishClock } from '@/hooks/useFinishClock';
import styles from './TimerDisplay.module.css';

export function TimerDisplay() {
  const { finishAt, gameState } = useGameContext();
  const active = gameState === 'GAME';
  const { display } = useFinishClock(finishAt, active);

  if (!active || !finishAt) return null;

  return (
    <div className={styles.timerContainer}>
      <span className={styles.timerText}>{display}</span>
    </div>
  );
}
