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

  const sendCommand = (event: string, data: object) => {
    fetch('/api/pusher', { method: 'POST', body: JSON.stringify({ event, data }) });
  };

  const isFormValid = playerId.trim() !== '' && betAmount.trim() !== '';

  const parseTimer = (val: string) => {
    const p = val.split(':');
    return p.length === 2 ? (parseInt(p[0]) || 0) * 60 + (parseInt(p[1]) || 0) : parseInt(val) || 0;
  };

  const startGame = () => {
    if (!isFormValid) return;
    const isNiuNiu = gameType === 'NIU_NIU_TRIPLE';
    const validManual = isNiuNiu && manualCards.slice(0, cardCount).every(c => c !== null);
    const cards = validManual ? manualCards.slice(0, cardCount) as CardData[] : getRandomCards(cardCount);
    
    onCardsGenerated?.(cards);
    sendCommand(GAME_EVENTS.TOGGLE_STATE, {
      state: 'GAME', cards, playerId: playerId.trim(), betAmount: Number(betAmount), language, gameType, cardCount, timerDuration: parseTimer(timerDuration)
    });
  };

  return (
    <div className={styles.panel}>
      <AdminBranding />
      <h1 className={styles.header}>Панель управления питбосса</h1>

      <div className={styles.layout}>
        <div className={styles.topRow}>
          <section className={styles.block}>
            <h2 className={styles.blockTitle}>Клиентские данные</h2>
            <AdminInputs playerId={playerId} betAmount={betAmount} language={language} onPlayerIdChange={setPlayerId} onBetAmountChange={setBetAmount} onLanguageChange={setLanguage} />
          </section>
          <section className={styles.block}>
            <h2 className={styles.blockTitle}>Настройки Игры</h2>
            <AdminGameSelector gameType={gameType} setGameType={setGameType} cardCount={cardCount} setCardCount={setCardCount} timerDuration={timerDuration} setTimerDuration={setTimerDuration} language={language} setLanguage={setLanguage} sendCommand={sendCommand} />
          </section>
        </div>

        <div className={styles.bottomRow}>
          <div className={styles.bottomCol}>
            <section className={styles.block}>
              <div className={ui.btnRow}>
                <button onClick={startGame} className={`${ui.btnPrimary} ${!isFormValid ? ui.btnDisabled : ''}`} disabled={!isFormValid}>START GAME</button>
                <button onClick={() => { onCardsGenerated?.([]); sendCommand(GAME_EVENTS.TOGGLE_STATE, { state: 'IDLE' }); }} className={ui.btnSecondary}>STOP</button>
                <button onClick={() => sendCommand(GAME_EVENTS.CELEBRATE, {})} className={ui.btnCelebrate}>ГОСТЬ ВЫИГРАЛ 🎉</button>
              </div>
            </section>
          </div>
          <div className={styles.bottomCol} style={{ flex: 2 }}>
            <section className={styles.block}>
              <div className="flex justify-between items-center mb-4">
                <h2 className={styles.blockTitle} style={{ marginBottom: 0 }}>Управление картами (Только Niu Niu)</h2>
                <button onClick={() => sendCommand(GAME_EVENTS.REVEAL_ALL, {})} className={ui.btnSecondary} style={{ width: 'auto', padding: '0.25rem 0.75rem' }}>ОТКРЫТЬ ВСЕ</button>
              </div>
              <AdminCardGrid 
                cardCount={cardCount} gameType={gameType} selectedCards={manualCards} 
                onCardChange={(idx, c) => setManualCards(p => { const n=[...p]; n[idx]=c; return n; })} 
                onRevealCard={(idx) => sendCommand(GAME_EVENTS.REVEAL_CARD, { index: idx, card: currentCards[idx] || manualCards[idx] })}
                revealedStates={currentCards.length > 0 ? currentCards.map(() => false) : Array(5).fill(false)}
              />
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
