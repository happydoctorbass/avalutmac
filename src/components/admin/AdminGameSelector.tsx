import { GameType } from '@/types/game';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import styles from './AdminGameSelector.module.css';

interface AdminGameSelectorProps {
  gameType: GameType;
  setGameType: Dispatch<SetStateAction<GameType>>;
  cardCount: number;
  setCardCount: Dispatch<SetStateAction<number>>;
  durationMinutes: string;
  setDurationMinutes: Dispatch<SetStateAction<string>>;
}

export function AdminGameSelector({
  gameType, setGameType, cardCount, setCardCount, durationMinutes, setDurationMinutes,
}: AdminGameSelectorProps) {
  const [localMin, setLocalMin] = useState(durationMinutes);

  useEffect(() => {
    const saved = localStorage.getItem('auctionMinutes');
    if (saved) { 
      setTimeout(() => {
        setLocalMin(saved);
        setDurationMinutes(saved);
      }, 0);
    }
  }, [setDurationMinutes]);

  const saveMin = (val: string) => {
    setLocalMin(val);
    setDurationMinutes(val);
    localStorage.setItem('auctionMinutes', val);
  };

  return (
    <div className={styles.selectorGrid}>
      <div className={styles.field}>
        <span className={styles.label}>Режим игры</span>
        <div className={styles.row}>
          <button type="button" className={`${styles.toggleBtn} ${gameType === 'BACCARAT_TRIPLE' ? styles.active : ''}`}
            onClick={() => setGameType('BACCARAT_TRIPLE')}>BACCARAT</button>
          <button type="button" className={`${styles.toggleBtn} ${gameType === 'NIU_NIU_TRIPLE' ? styles.active : ''}`}
            onClick={() => setGameType('NIU_NIU_TRIPLE')}>NIU NIU</button>
        </div>
      </div>
      <div className={styles.field}>
        <span className={styles.label}>Количество карт</span>
        <div className={styles.row}>
          <button type="button" className={`${styles.toggleBtn} ${cardCount === 2 ? styles.active : ''}`} onClick={() => setCardCount(2)}>2 Карты</button>
          <button type="button" className={`${styles.toggleBtn} ${cardCount === 5 ? styles.active : ''}`} onClick={() => setCardCount(5)}>5 Карт</button>
        </div>
      </div>
      <div className={styles.field}>
        <span className={styles.label}>Таймер аукциона (мин)</span>
        <div className={styles.timePicker}>
          <button
            type="button"
            className={`${styles.timeBtn} ${localMin === '180' ? styles.active : ''}`}
            onClick={() => saveMin('180')}
          >
            3 часа
          </button>
          <input 
            type="number" 
            min="1" 
            value={localMin} 
            onChange={(e) => saveMin(e.target.value)} 
            placeholder="Свой (мин)" 
            className={styles.timeInputCustom} 
          />
        </div>
      </div>
    </div>
  );
}
