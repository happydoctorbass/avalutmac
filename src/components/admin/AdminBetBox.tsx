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
  const { gameState, sessionId, finishAt, bets } = useGameContext();
  const { isExpired } = useFinishClock(finishAt, gameState === 'GAME');
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
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

  const cancelLastBid = async () => {
    if (!sessionId || bets.length === 0) return;
    setLoading(true);
    try {
      const lastBet = bets[0]; // assuming bets are sorted newest first or we just take the first one
      await fetch('/api/bets/cancel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ betId: lastBet.id, sessionId })
      });
    } finally {
      setLoading(false);
      setShowConfirm(false);
    }
  };

  const cls = [styles.bidBtn, isExpired && styles.bidExpired, disabled && styles.bidDisabled].filter(Boolean).join(' ');
  const cancelCls = [styles.cancelBtn, (bets.length === 0 || isExpired || loading) && styles.bidDisabled].filter(Boolean).join(' ');

  return (
    <div className={styles.boxWrap}>
      <button type="button" className={cls} onClick={addBid} disabled={disabled}>
        <span className={styles.btnText}>
          {loading ? 'Сохранение…' : isExpired ? 'АУКЦИОН ЗАВЕРШЁН' : 'ДОБАВИТЬ ИГРОКА'}
        </span>
      </button>
      
      <button 
        type="button" 
        className={cancelCls} 
        onClick={() => setShowConfirm(true)} 
        disabled={bets.length === 0 || isExpired || loading}
      >
        <span className={styles.btnText}>ОТМЕНИТЬ ПОСЛЕДНЕГО</span>
      </button>

      {showConfirm && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3 className={styles.modalTitle}>Отмена действия</h3>
            <p className={styles.modalText}>Вы уверены, что хотите отменить последнего добавленного игрока?</p>
            <div className={styles.modalActions}>
              <button className={styles.modalCancel} onClick={() => setShowConfirm(false)}>Нет, закрыть</button>
              <button className={styles.modalConfirm} onClick={cancelLastBid}>Да, отменить</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
