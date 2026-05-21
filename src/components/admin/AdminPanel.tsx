'use client';

import { useState } from 'react';
import { GAME_EVENTS } from '@/lib/pusher';
import { getRandomCards } from '@/lib/deck';
import { CardData } from '@/types/game';
import { AdminInputs } from './AdminInputs';
import { AdminBranding } from './AdminBranding';
import styles from './AdminPanel.module.css';

interface AdminPanelProps {
  currentCards?: CardData[];
  onCardsGenerated?: (cards: CardData[]) => void;
}

export function AdminPanel({ currentCards = [], onCardsGenerated }: AdminPanelProps) {
  const [playerId, setPlayerId] = useState('');
  const [betAmount, setBetAmount] = useState('');

  const sendCommand = async (event: string, data: object) => {
    try {
      await fetch('/api/pusher', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event, data }),
      });
    } catch (error) {
      console.error('Ошибка отправки команды:', error);
    }
  };

  const startGame = () => {
    const randomCards = getRandomCards(5);
    onCardsGenerated?.(randomCards);
    sendCommand(GAME_EVENTS.TOGGLE_STATE, {
      state: 'GAME',
      cards: randomCards,
      playerId: playerId.trim() || '—',
      betAmount: Number(betAmount) || 0,
    });
  };

  return (
    <div className={styles.panel}>
      <AdminBranding />
      <h1 className={styles.header}>Панель управления питбосса</h1>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Основное управление</h2>
        <AdminInputs
          playerId={playerId}
          betAmount={betAmount}
          onPlayerIdChange={setPlayerId}
          onBetAmountChange={setBetAmount}
        />
        <div className={styles.btnRow}>
          <button type="button" onClick={startGame} className={styles.btnPrimary}>Начать игру</button>
          <button type="button" onClick={startGame} className={styles.btnPrimary}>Новая раздача</button>
          <button
            type="button"
            onClick={() => { onCardsGenerated?.([]); sendCommand(GAME_EVENTS.TOGGLE_STATE, { state: 'IDLE' }); }}
            className={styles.btnIdle}
          >
            Сбросить в заставку
          </button>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Управление картами</h2>
        <button type="button" onClick={() => sendCommand(GAME_EVENTS.REVEAL_ALL, {})} className={styles.btnRevealAll}>
          РАСКРЫТЬ ВСЕ
        </button>
        <div className={styles.cardGrid}>
          {[0, 1, 2, 3, 4].map((idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => sendCommand(GAME_EVENTS.REVEAL_CARD, { index: idx, card: currentCards[idx] })}
              className={styles.cardBtn}
            >
              Карта {idx + 1}
              <span className={styles.cardHint}>Нажмите, чтобы открыть</span>
              {currentCards[idx] && (
                <span className={`${styles.cardValue} ${currentCards[idx].color === 'red' ? styles.cardRed : styles.cardBlack}`}>
                  {currentCards[idx].rank}{currentCards[idx].suit}
                </span>
              )}
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
