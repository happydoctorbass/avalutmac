'use client';

import { useState } from 'react';
import { GAME_EVENTS } from '@/lib/pusher';
import { getRandomCards } from '@/lib/deck';
import { CardData, GameLanguage, GameType } from '@/types/game';
import { useGameContext } from '@/context/GameContext';
import { postPusher, postStart, postStop } from '@/lib/admin-api';
import { useFinishClock } from '@/hooks/useFinishClock';
import { AdminBranding } from './AdminBranding';
import { AdminTopRow } from './AdminTopRow';
import { AdminGameSelector } from './AdminGameSelector';
import { AdminCardGrid } from './AdminCardGrid';
import { AdminStatsBlock } from './AdminStatsBlock';
import panel from './AdminPanel.module.css';
import grid from './AdminGrid.module.css';

interface AdminPanelProps {
  currentCards?: CardData[];
  onCardsGenerated?: (cards: CardData[]) => void;
}

export function AdminPanel({ currentCards = [], onCardsGenerated }: AdminPanelProps) {
  const { gameState, finishAt, revealedCards, dbSessionId } = useGameContext();
  const { display } = useFinishClock(finishAt, gameState === 'GAME');
  
  const [playerId, setPlayerId] = useState('');
  const [betAmount, setBetAmount] = useState('');
  const [language, setLanguage] = useState<GameLanguage>('en');
  const [gameType, setGameType] = useState<GameType>('NIU_NIU_TRIPLE');
  const [cardCount, setCardCount] = useState(5);
  const [durationMinutes, setDurationMinutes] = useState('180');
  const [manualCards, setManualCards] = useState<(CardData | null)[]>([null, null, null, null, null]);

  const clearInput = () => { setPlayerId(''); setBetAmount(''); };

  const resolveCards = () => {
    const ok = manualCards.slice(0, cardCount).every((c) => c !== null);
    return ok ? (manualCards.slice(0, cardCount) as CardData[]) : getRandomCards(cardCount);
  };

  const startGame = async () => {
    const cards = resolveCards();
    onCardsGenerated?.(cards);
    clearInput();
    await postStart({ cards, language, gameType, cardCount, durationMinutes: Number(durationMinutes) || 180 });
  };

  const stopGame = async () => {
    onCardsGenerated?.([]);
    await postStop(dbSessionId);
  };

  return (
    <div className={panel.panel}>
      <AdminBranding />
      
      <div className={grid.grid}>
        {/* Бокс А: Управление */}
        <section className={grid.block}>
          <div className={grid.boxHeader}>
            <h2 className={grid.blockTitleNoMargin}>Управление</h2>
            {gameState === 'GAME' && finishAt && <span className={grid.largeTimer}>{display}</span>}
          </div>
          <AdminTopRow
            playerId={playerId} betAmount={betAmount} language={language}
            onPlayerIdChange={setPlayerId} onBetAmountChange={setBetAmount} onLanguageChange={setLanguage}
            onClearInput={clearInput} onStart={startGame}
            onStop={stopGame} onCelebrate={() => postPusher(GAME_EVENTS.CELEBRATE, {})}
          />
        </section>

        {/* Бокс Б: Статистика */}
        <AdminStatsBlock />

        {/* Бокс В: Настройки */}
        <section className={grid.block}>
          <h2 className={grid.blockTitle}>Настройки игры</h2>
          <AdminGameSelector
            gameType={gameType} setGameType={setGameType} cardCount={cardCount} setCardCount={setCardCount}
            durationMinutes={durationMinutes} setDurationMinutes={setDurationMinutes}
          />
        </section>

        {/* Бокс Г: Карты */}
        <section className={grid.block}>
          <div className={grid.blockHead}>
            <h2 className={grid.blockTitleNoMargin}>Управление картами</h2>
            <button type="button" onClick={() => postPusher(GAME_EVENTS.REVEAL_ALL, {})} className={grid.headBtn}>ОТКРЫТЬ ВСЕ</button>
          </div>
          <AdminCardGrid
            cardCount={cardCount} selectedCards={manualCards}
            onCardChange={(idx, c) => setManualCards((p) => { const n = [...p]; n[idx] = c; return n; })}
            onRevealCard={(idx) => postPusher(GAME_EVENTS.REVEAL_CARD, { index: idx, card: currentCards[idx] || manualCards[idx] })}
            revealedStates={revealedCards.slice(0, cardCount)}
          />
        </section>
      </div>
    </div>
  );
}
