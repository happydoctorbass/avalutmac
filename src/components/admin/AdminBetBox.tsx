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
  const { gameState, dbSessionId, finishAt } = useGameContext();
  const { isExpired } = useFinishClock(finishAt, gameState === 'GAME');
  const [loading, setLoading] = useState(false);
  const disabled = !inputValid || gameState !== 'GAME' || !dbSessionId || isExpired || loading;

  const addBid = async () => {
    if (disabled || !dbSessionId) return;
    setLoading(true);
    try {
      const res = await postBid(playerId.trim(), Number(betAmount), dbSessionId);
      if (res.ok) onClear();
    } finally {
      setLoading(false);
    }
  };

  const cls = [styles.bidBtn, isExpired && styles.bidExpired, disabled && styles.bidDisabled].filter(Boolean).join(' ');

  return (
    <button type="button" className={cls} onClick={addBid} disabled={disabled}>
      {loading ? 'Сохранение…' : isExpired ? 'АУКЦИОН ЗАВЕРШЁН' : 'ДОБАВИТЬ ИГРОКА / СДЕЛАТЬ СТАВКУ'}
    </button>
  );
}
