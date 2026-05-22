'use client';

import { useState } from 'react';
import { GAME_EVENTS } from '@/lib/pusher';
import { getRandomCards } from '@/lib/deck';
import { CardData, GameLanguage, GameType } from '@/types/game';
import { AdminInputs } from './AdminInputs';
import { AdminBranding } from './AdminBranding';
import { AdminGameSelector } from './AdminGameSelector';
import { AdminCardGrid } from './AdminCardGrid';
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
  const [gameType, setGameType] = useState<GameType>('NIU_NIU_TRIPLE');
  const [cardCount, setCardCount] = useState(5);
  const [timerDuration, setTimerDuration] = useState('01:30');
  const [manualCards, setManualCards] = useState<(CardData | null)[]>([null, null, null, null, null]);

  const send = (event: string, data: object) => fetch('/api/pusher', { method: 'POST', body: JSON.stringify({ event, data }) });
  const valid = playerId.trim() !== '' && betAmount.trim() !== '';
  const parseTimer = (v: string) => v.includes(':') ? (parseInt(v.split(':')[0]) || 0) * 60 + (parseInt(v.split(':')[1]) || 0) : parseInt(v) || 0;

  const startGame = () => {
    if (!valid) return;
    const ok = manualCards.slice(0, cardCount).every(c => c !== null);
    const cards = ok ? (manualCards.slice(0, cardCount) as CardData[]) : getRandomCards(cardCount);
    onCardsGenerated?.(cards);
    send(GAME_EVENTS.TOGGLE_STATE, {
      state: 'GAME', cards, playerId: playerId.trim(), betAmount: Number(betAmount),
      language, gameType, cardCount, timerDuration: parseTimer(timerDuration),
    });
  };

  return (
    <div className={styles.panel}>
      <AdminBranding />
      <h1 className={styles.header}>Панель управления питбосса</h1>

      <div className={styles.topRow}>
        <section className={styles.block}>
          <h2 className={styles.blockTitle}>Клиентские данные</h2>
          <div className={styles.blockBody}>
            <AdminInputs
              playerId={playerId} betAmount={betAmount} language={language}
              onPlayerIdChange={setPlayerId} onBetAmountChange={setBetAmount} onLanguageChange={setLanguage}
            />
          </div>
        </section>

        <section className={styles.block}>
          <h2 className={styles.blockTitle}>Запуск раунда</h2>
          <div className={styles.blockBody}>
            <div className={ui.btnRow}>
              <button onClick={startGame} className={`${ui.btnPrimary} ${!valid ? ui.btnDisabled : ''}`} disabled={!valid}>START GAME</button>
              <button onClick={() => { onCardsGenerated?.([]); send(GAME_EVENTS.TOGGLE_STATE, { state: 'IDLE' }); }} className={ui.btnSecondary}>STOP</button>
              <button onClick={() => send(GAME_EVENTS.CELEBRATE, {})} className={ui.btnCelebrate}>ПОБЕДА ГОСТЯ 🎉</button>
            </div>
          </div>
        </section>
      </div>

      <div className={styles.grid}>
        <section className={styles.block}>
          <h2 className={styles.blockTitle}>Настройки игры</h2>
          <div className={styles.blockBody}>
            <AdminGameSelector
              gameType={gameType} setGameType={setGameType} cardCount={cardCount} setCardCount={setCardCount}
              timerDuration={timerDuration} setTimerDuration={setTimerDuration}
            />
          </div>
        </section>

        <section className={styles.block}>
          <div className={styles.blockHead}>
            <h2 className={`${styles.blockTitle} ${styles.blockTitleNoMargin}`}>Управление картами</h2>
            <button type="button" onClick={() => send(GAME_EVENTS.REVEAL_ALL, {})} className={styles.headBtn}>ОТКРЫТЬ ВСЕ</button>
          </div>
          <div className={styles.blockBody}>
            <AdminCardGrid
              cardCount={cardCount} selectedCards={manualCards}
              onCardChange={(idx, c) => setManualCards(p => { const n = [...p]; n[idx] = c; return n; })}
              onRevealCard={(idx) => send(GAME_EVENTS.REVEAL_CARD, { index: idx, card: currentCards[idx] || manualCards[idx] })}
              revealedStates={Array(cardCount).fill(false)}
            />
          </div>
        </section>
      </div>
    </div>
  );
}
