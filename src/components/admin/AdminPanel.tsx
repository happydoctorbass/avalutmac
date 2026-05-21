'use client';

import { useState } from 'react';
import { GAME_EVENTS } from '@/lib/pusher';
import { getRandomCards } from '@/lib/deck';
import { CardData, GameLanguage } from '@/types/game';
import { AdminInputs } from './AdminInputs';
import { AdminBranding } from './AdminBranding';
import { AdminCardSection } from './AdminCardSection';
import { ManualCardPicker } from './ManualCardPicker';
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
  const [mode, setMode] = useState<'random' | 'manual'>('random');
  const [manualCards, setManualCards] = useState<(CardData | null)[]>([null, null, null, null, null]);

  const sendCommand = async (event: string, data: object) => {
    fetch('/api/pusher', { method: 'POST', body: JSON.stringify({ event, data }) });
  };

  const isFormValid = playerId.trim() !== '' && betAmount.trim() !== '';
  const isManualValid = mode === 'random' || manualCards.every(c => c !== null);
  const canStart = isFormValid && isManualValid;

  const startGame = () => {
    if (!canStart) return;
    const cards = mode === 'random' ? getRandomCards(5) : (manualCards as CardData[]);
    onCardsGenerated?.(cards);
    sendCommand(GAME_EVENTS.TOGGLE_STATE, {
      state: 'GAME', cards, playerId: playerId.trim(), betAmount: Number(betAmount), language
    });
  };

  const handleManualChange = (idx: number, card: CardData | null) => {
    setManualCards(prev => { const n = [...prev]; n[idx] = card; return n; });
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
            <div className="flex justify-between items-center mb-4">
              <h2 className={styles.blockTitle} style={{ marginBottom: 0 }}>Запуск раунда</h2>
              <select value={mode} onChange={e => setMode(e.target.value as any)} className="bg-transparent border border-[#4f5f76] text-white p-1 rounded text-xs">
                <option value="random">Рандом</option>
                <option value="manual">Ручной выбор</option>
              </select>
            </div>
            {mode === 'manual' && <ManualCardPicker selectedCards={manualCards} onChange={handleManualChange} />}
            <div className={`${ui.btnRow} mt-4`}>
              <button onClick={startGame} className={`${ui.btnPrimary} ${!canStart ? ui.btnDisabled : ''}`} disabled={!canStart}>START</button>
              <button onClick={() => { onCardsGenerated?.([]); sendCommand(GAME_EVENTS.TOGGLE_STATE, { state: 'IDLE' }); }} className={ui.btnSecondary}>STOP</button>
              <button onClick={() => sendCommand(GAME_EVENTS.CELEBRATE, {})} className={ui.btnCelebrate}>ПОБЕДА ГОСТЯ 🎉</button>
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
