'use client';

import styles from './AdminInputs.module.css';

interface AdminInputsProps {
  playerId: string;
  betAmount: string;
  onPlayerIdChange: (value: string) => void;
  onBetAmountChange: (value: string) => void;
}

export function AdminInputs({
  playerId,
  betAmount,
  onPlayerIdChange,
  onBetAmountChange,
}: AdminInputsProps) {
  return (
    <div className={styles.row}>
      <label className={styles.field}>
        <span className={styles.label}>ID Игрока</span>
        <input
          type="text"
          value={playerId}
          onChange={(e) => onPlayerIdChange(e.target.value)}
          placeholder="Например: P-1024"
          className={styles.input}
        />
      </label>
      <label className={styles.field}>
        <span className={styles.label}>Сумма ставки</span>
        <input
          type="number"
          min="0"
          value={betAmount}
          onChange={(e) => onBetAmountChange(e.target.value)}
          placeholder="0"
          className={styles.input}
        />
      </label>
    </div>
  );
}
