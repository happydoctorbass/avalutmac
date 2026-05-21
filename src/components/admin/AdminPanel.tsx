'use client';

import { useState } from 'react';
import { GAME_EVENTS } from '@/lib/pusher';
import { getRandomCards } from '@/lib/deck';
import { CardData } from '@/types/game';
import { AdminInputs } from './AdminInputs';
import { AdminBranding } from './AdminBranding';
import { AdminCardSection } from './AdminCardSection';
import styles from './AdminPanel.module.css';
import ui from './AdminUi.module.css';

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

      <div className={styles.layout}>
        <div className={styles.leftCol}>
          <section className={styles.block}>
            <h2 className={styles.blockTitle}>Клиентские данные</h2>
            <AdminInputs
              playerId={playerId}
              betAmount={betAmount}
              onPlayerIdChange={setPlayerId}
              onBetAmountChange={setBetAmount}
            />
          </section>

          <section className={styles.block}>
            <h2 className={styles.blockTitle}>Запуск раунда</h2>
            <div className={ui.btnRow}>
              <button type="button" onClick={startGame} className={ui.btnPrimary}>START</button>
              <button
                type="button"
                onClick={() => { onCardsGenerated?.([]); sendCommand(GAME_EVENTS.TOGGLE_STATE, { state: 'IDLE' }); }}
                className={ui.btnSecondary}
              >
                STOP
              </button>
            </div>
          </section>
        </div>

        <div className={styles.rightCol}>
          <section className={styles.block}>
            <h2 className={styles.blockTitle}>Управление картами</h2>
            <AdminCardSection
              currentCards={currentCards}
              onRevealAll={() => sendCommand(GAME_EVENTS.REVEAL_ALL, {})}
              onRevealCard={(idx) => sendCommand(GAME_EVENTS.REVEAL_CARD, { index: idx, card: currentCards[idx] })}
            />
          </section>
        </div>
      </div>
    </div>
  );
}
