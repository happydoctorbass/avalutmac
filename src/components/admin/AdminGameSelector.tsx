import { GameType } from '@/types/game';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import styles from './AdminGameSelector.module.css';

interface AdminGameSelectorProps {
  gameType: GameType;
  setGameType: Dispatch<SetStateAction<GameType>>;
  cardCount: number;
  setCardCount: Dispatch<SetStateAction<number>>;
  timerDuration: string;
  setTimerDuration: Dispatch<SetStateAction<string>>;
}

export function AdminGameSelector({
  gameType,
  setGameType,
  cardCount,
  setCardCount,
  timerDuration,
  setTimerDuration,
}: AdminGameSelectorProps) {
  const [localTimer, setLocalTimer] = useState(timerDuration);

  useEffect(() => {
    const saved = localStorage.getItem('timerDuration');
    if (saved) {
      setLocalTimer(saved);
      setTimerDuration(saved);
    }
  }, [setTimerDuration]);

  const handleTimerChange = (val: string) => {
    setLocalTimer(val);
    setTimerDuration(val);
    localStorage.setItem('timerDuration', val);
  };

  const isBaccarat = gameType === 'BACCARAT_TRIPLE';

  return (
    <div className={styles.selectorGrid}>
      <div className={styles.field}>
        <span className={styles.label}>Режим игры</span>
        <div className="flex gap-2">
          <button
            type="button"
            className={`${styles.toggleBtn} ${isBaccarat ? styles.active : ''}`}
            onClick={() => { setGameType('BACCARAT_TRIPLE'); setCardCount(5); }}
          >
            BACCARAT
          </button>
          <button
            type="button"
            className={`${styles.toggleBtn} ${!isBaccarat ? styles.active : ''}`}
            onClick={() => setGameType('NIU_NIU_TRIPLE')}
          >
            NIU NIU
          </button>
        </div>
      </div>

      <div className={styles.field}>
        <span className={styles.label}>Количество карт</span>
        <div className="flex gap-2">
          {!isBaccarat && (
            <button type="button" className={`${styles.toggleBtn} ${cardCount === 2 ? styles.active : ''}`} onClick={() => setCardCount(2)}>2 Карты</button>
          )}
          <button type="button" className={`${styles.toggleBtn} ${cardCount === 5 ? styles.active : ''}`} onClick={() => setCardCount(5)}>5 Карт</button>
        </div>
      </div>

      <div className={styles.field}>
        <span className={styles.label}>Таймер (MM:SS)</span>
        <input type="text" value={localTimer} onChange={(e) => handleTimerChange(e.target.value)} placeholder="01:30" className={styles.input} />
      </div>
    </div>
  );
}
