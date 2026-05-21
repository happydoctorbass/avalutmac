'use client';

import styles from './AdminInputs.module.css';
import { GameLanguage } from '@/types/game';

interface AdminInputsProps {
  playerId: string;
  betAmount: string;
  language: GameLanguage;
  onPlayerIdChange: (value: string) => void;
  onBetAmountChange: (value: string) => void;
  onLanguageChange: (lang: GameLanguage) => void;
}

export function AdminInputs({
  playerId,
  betAmount,
  language,
  onPlayerIdChange,
  onBetAmountChange,
  onLanguageChange,
}: AdminInputsProps) {
  return (
    <div className={styles.row}>
      <label className={styles.field}>
        <span className={styles.label}>ID Игрока</span>
        <input
          type="text"
          value={playerId}
          onChange={(e) => onPlayerIdChange(e.target.value)}
          placeholder=""
          className={`${styles.input} ${!playerId.trim() ? styles.inputError : ''}`}
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
          className={`${styles.input} ${!betAmount.trim() ? styles.inputError : ''}`}
        />
      </label>
      <label className={styles.field}>
        <span className={styles.label}>Язык экрана (ТВ)</span>
        <div className="flex gap-2">
          <button
            type="button"
            className={`${styles.langBtn} ${language === 'en' ? styles.langActive : ''}`}
            onClick={() => onLanguageChange('en')}
          >
            EN
          </button>
          <button
            type="button"
            className={`${styles.langBtn} ${language === 'zh' ? styles.langActive : ''}`}
            onClick={() => onLanguageChange('zh')}
          >
            ZH
          </button>
        </div>
      </label>
    </div>
  );
}
