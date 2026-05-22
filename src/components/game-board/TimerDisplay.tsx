'use client';

import { useEffect, useState } from 'react';
import styles from './TimerDisplay.module.css';

export function TimerDisplay({ duration, isRunning }: { duration: number, isRunning: boolean }) {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    setTimeLeft(duration);
  }, [duration, isRunning]); // Reset when game starts

  useEffect(() => {
    if (!isRunning || timeLeft <= 0) return;
    const t = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(t);
  }, [isRunning, timeLeft]);

  if (duration <= 0 || !isRunning) return null;

  const m = Math.floor(timeLeft / 60).toString().padStart(2, '0');
  const s = (timeLeft % 60).toString().padStart(2, '0');

  return (
    <div className={styles.timerContainer}>
      <span className={styles.timerText}>{m}:{s}</span>
    </div>
  );
}
