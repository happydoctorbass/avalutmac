'use client';

import styles from './Screensaver.module.css';

export function Screensaver() {
  return (
    <div className={styles.container}>
      <div className={styles.pulseCircle} />
      <h1 className={styles.logo}>ADMIRAL CASINO</h1>
      <p className={styles.status}>Ожидание следующего раунда...</p>
    </div>
  );
}