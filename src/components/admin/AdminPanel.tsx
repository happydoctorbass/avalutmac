'use client';

import { useState } from 'react';
import { GAME_EVENTS } from '@/lib/pusher';
import { getRandomCards } from '@/lib/deck';
import { CardData, GameLanguage } from '@/types/game';
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
  const [language, setLanguage] = useState<GameLanguage>('en');

  const sendCommand = async (event: string, data: object) => {
    fetch('/api/pusher', { method: 'POST', body: JSON.stringify({ event, data }) });
  };

  const isFormValid = playerId.trim() !== '' && betAmount.trim() !== '';

  const startGame = () => {
    if (!isFormValid) return;
    const cards = getRandomCards(5);
    onCardsGenerated?.(cards);
    sendCommand(GAME_EVENTS.TOGGLE_STATE, {
      state: 'GAME', cards, playerId: playerId.trim(), betAmount: Number(betAmount), language
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
            <AdminInputs playerId={playerId} betAmount={betAmount} language={language} onPlayerIdChange={setPlayerId} onBetAmountChange={setBetAmount} onLanguageChange={setLanguage} />
          </section>

          <section className={styles.block}>
            <h2 className={styles.blockTitle}>Управление</h2>
            <div className={ui.btnRow}>
              <button onClick={startGame} className={`${ui.btnPrimary} ${!isFormValid ? ui.btnDisabled : ''}`} disabled={!isFormValid}>START</button>
              <button onClick={() => { onCardsGenerated?.([]); sendCommand(GAME_EVENTS.TOGGLE_STATE, { state: 'IDLE' }); }} className={ui.btnSecondary}>STOP</button>
              <button onClick={() => sendCommand(GAME_EVENTS.CELEBRATE, {})} className={ui.btnCelebrate}>ГОСТЬ ВЫИГРАЛ 🎉</button>
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
