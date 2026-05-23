'use client';

import styles from './AdminControlBox.module.css';

interface AdminControlBoxProps {
  onStart: () => void;
  onStop: () => void;
  onCelebrate: () => void;
}

export function AdminControlBox({ onStart, onStop, onCelebrate }: AdminControlBoxProps) {
  return (
    <div className={styles.wrap}>
      <button type="button" className={styles.start} onClick={onStart}>СТАРТ</button>
      <button type="button" className={styles.stop} onClick={onStop}>СТОП</button>
      <button type="button" className={styles.win} onClick={onCelebrate}>ПОБЕДА ГОСТЯ</button>
    </div>
  );
}
