'use client';

import { useGameContext } from '@/context/GameContext';
import { useFinishClock } from '@/hooks/useFinishClock';
import styles from './AdminControlBox.module.css';

interface AdminControlBoxProps {
  onStart: () => void;
  onStop: () => void;
  onCelebrate: () => void;
}

export function AdminControlBox({ onStart, onStop, onCelebrate }: AdminControlBoxProps) {
  const { finishAt, gameState } = useGameContext();
  const { display } = useFinishClock(finishAt, gameState === 'GAME');

  return (
    <div className={styles.wrap}>
      {gameState === 'GAME' && finishAt && <span className={styles.clock}>{display}</span>}
      <button type="button" className={styles.start} onClick={onStart}>СТАРТ</button>
      <button type="button" className={styles.stop} onClick={onStop}>СТОП</button>
      <button type="button" className={styles.win} onClick={onCelebrate}>ПОБЕДА ГОСТЯ</button>
    </div>
  );
}
