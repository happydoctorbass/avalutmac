'use client';

import { useState } from 'react';
import { useGameContext } from '@/context/GameContext';
import { useFinishClock } from '@/hooks/useFinishClock';
import { postBid } from '@/lib/admin-api';
import styles from './AdminBetBox.module.css';

interface AdminBetBoxProps {
  playerId: string;
  betAmount: string;
  inputValid: boolean;
  onClear: () => void;
}

export function AdminBetBox({ playerId, betAmount, inputValid, onClear }: AdminBetBoxProps) {
  const { gameState, sessionId, finishAt } = useGameContext();
  const { isExpired } = useFinishClock(finishAt, gameState === 'GAME');
  const [loading, setLoading] = useState(false);
  const disabled = !inputValid || gameState !== 'GAME' || !sessionId || isExpired || loading;

  const addBid = async () => {
    if (disabled || !sessionId) return;
    setLoading(true);
    try {
      const res = await postBid(playerId.trim(), Number(betAmount), sessionId);
      if (res.ok) onClear();
    } finally {
      setLoading(false);
    }
  };

  const clearTable = async () => {
    setLoading(true);
    try {
      await fetch('/api/bets/clear', { method: 'POST' });
    } finally {
      setLoading(false);
    }
  };

  const cls = [styles.bidBtn, isExpired && styles.bidExpired, disabled && styles.bidDisabled].filter(Boolean).join(' ');

  return (
    <div className={styles.boxWrap}>
      <button type="button" className={cls} onClick={addBid} disabled={disabled}>
        <span className={styles.btnText}>
          {loading ? 'Сохранение…' : isExpired ? 'АУКЦИОН ЗАВЕРШЁН' : 'ДОБАВИТЬ ИГРОКА'}
        </span>
      </button>
      
      <button 
        type="button" 
        className={styles.clearBtn} 
        onClick={clearTable} 
        disabled={loading}
      >
        <span className={styles.btnText}>ОЧИСТИТЬ ТАБЛИЦУ</span>
      </button>
    </div>
  );
}
