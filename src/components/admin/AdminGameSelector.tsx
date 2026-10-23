import { GameType } from '@/types/game';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import styles from './AdminGameSelector.module.css';

import { sendFontScale, sendCardScale } from '@/lib/admin-api';

interface AdminGameSelectorProps {
  gameType: GameType;
  setGameType: Dispatch<SetStateAction<GameType>>;
  cardCount: number;
  setCardCount: Dispatch<SetStateAction<number>>;
  durationMinutes: string;
  setDurationMinutes: Dispatch<SetStateAction<string>>;
  fontScale: number;
  setFontScale: Dispatch<SetStateAction<number>>;
  cardScale: number;
  setCardScale: Dispatch<SetStateAction<number>>;
}

export function AdminGameSelector({
  gameType, setGameType, cardCount, setCardCount, durationMinutes, setDurationMinutes, fontScale, setFontScale, cardScale, setCardScale
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
    const savedScale = localStorage.getItem('tvFontScale');
    if (savedScale) {
      setTimeout(() => setFontScale(Number(savedScale)), 0);
    }
    const savedCardScale = localStorage.getItem('tvCardScale');
    if (savedCardScale) {
      const parsed = Number(savedCardScale);
      if (!Number.isNaN(parsed) && parsed >= 50 && parsed <= 200) {
        setTimeout(() => setCardScale(parsed), 0);
      }
    }
  }, [setDurationMinutes, setFontScale, setCardScale]);

  const saveMin = (val: string) => {
    setLocalMin(val);
    setDurationMinutes(val);
    localStorage.setItem('auctionMinutes', val);
  };

  const handleFontChange = (newScale: number) => {
    setFontScale(newScale);
    localStorage.setItem('tvFontScale', newScale.toString());
    sendFontScale(newScale);
  };

  const handleCardScaleChange = (newScale: number) => {
    const clamped = Math.min(200, Math.max(50, newScale));
    setCardScale(clamped);
    localStorage.setItem('tvCardScale', String(clamped));
    sendCardScale(clamped);
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
      <div className={styles.field}>
        <span className={styles.label}>Размер текста (ID и Ставка) на ТВ</span>
        <div className={styles.row}>
          <button type="button" className={styles.toggleBtn} onClick={() => handleFontChange(Math.max(30, fontScale - 10))}>- Уменьшить</button>
          <div className={styles.scaleDisplay}>{fontScale}%</div>
          <button type="button" className={styles.toggleBtn} onClick={() => handleFontChange(Math.min(200, fontScale + 10))}>+ Увеличить</button>
        </div>
      </div>
      <div className={styles.field}>
        <div className={styles.labelRow}>
          <span className={styles.labelNoMargin}>Размер карт на ТВ</span>
          <span className={styles.scaleBadge}>{cardScale}%</span>
        </div>
        <div className={styles.sliderWrap}>
          <input
            type="range"
            min="50"
            max="200"
            step="5"
            value={cardScale}
            onChange={(e) => handleCardScaleChange(Number(e.target.value))}
            className={styles.rangeSlider}
          />
          <div className={styles.row}>
            <button
              type="button"
              className={styles.stepBtn}
              onClick={() => handleCardScaleChange(cardScale - 5)}
            >
              -5%
            </button>
            <button
              type="button"
              className={`${styles.stepBtn} ${cardScale === 100 ? styles.active : ''}`}
              onClick={() => handleCardScaleChange(100)}
            >
              100%
            </button>
            <button
              type="button"
              className={styles.stepBtn}
              onClick={() => handleCardScaleChange(cardScale + 5)}
            >
              +5%
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
