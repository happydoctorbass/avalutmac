import { GameType, CardData, GameLanguage } from '@/types/game';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import styles from './AdminGameSelector.module.css';
import { GAME_EVENTS } from '@/lib/pusher';

interface AdminGameSelectorProps {
  gameType: GameType;
  setGameType: Dispatch<SetStateAction<GameType>>;
  cardCount: number;
  setCardCount: Dispatch<SetStateAction<number>>;
  timerDuration: string;
  setTimerDuration: Dispatch<SetStateAction<string>>;
  language: GameLanguage;
  setLanguage: Dispatch<SetStateAction<GameLanguage>>;
  sendCommand: (event: string, data: any) => void;
}

export function AdminGameSelector({
  gameType,
  setGameType,
  cardCount,
  setCardCount,
  timerDuration,
  setTimerDuration,
  language,
  setLanguage,
  sendCommand,
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

  const handleLanguageChange = (lang: GameLanguage) => {
    setLanguage(lang);
    sendCommand(GAME_EVENTS.UPDATE_LANG, { language: lang });
  };

  const isBaccarat = gameType === 'BACCARAT_TRIPLE';

  return (
    <div className={styles.selectorGrid}>
      <div className={styles.field}>
        <span className={styles.label}>Режим игры</span>
        <div className="flex gap-2">
          <button
            type="button"
            className={`${styles.toggleBtn} ${styles.fixedWidthBtn} ${isBaccarat ? styles.active : ''}`}
            onClick={() => { setGameType('BACCARAT_TRIPLE'); setCardCount(2); }}
          >
            BACCARAT
          </button>
          <button
            type="button"
            className={`${styles.toggleBtn} ${styles.fixedWidthBtn} ${!isBaccarat ? styles.active : ''}`}
            onClick={() => setGameType('NIU_NIU_TRIPLE')}
          >
            NIU NIU
          </button>
        </div>
      </div>

      {!isBaccarat && (
        <div className={styles.field}>
          <span className={styles.label}>Количество карт</span>
          <div className="flex gap-2">
            <button type="button" className={`${styles.toggleBtn} ${cardCount === 2 ? styles.active : ''}`} onClick={() => setCardCount(2)}>2 Карты</button>
            <button type="button" className={`${styles.toggleBtn} ${cardCount === 5 ? styles.active : ''}`} onClick={() => setCardCount(5)}>5 Карт</button>
          </div>
        </div>
      )}

      <div className={styles.field}>
        <span className={styles.label}>Таймер (MM:SS)</span>
        <input type="text" value={localTimer} onChange={(e) => handleTimerChange(e.target.value)} placeholder="01:30" className={styles.input} />
      </div>

      <div className={styles.field}>
        <span className={styles.label}>Язык ТВ</span>
        <div className="flex gap-2">
          <button type="button" className={`${styles.toggleBtn} ${language === 'en' ? styles.active : ''}`} onClick={() => handleLanguageChange('en')}>EN</button>
          <button type="button" className={`${styles.toggleBtn} ${language === 'zh' ? styles.active : ''}`} onClick={() => handleLanguageChange('zh')}>ZH</button>
        </div>
      </div>
    </div>
  );
}
