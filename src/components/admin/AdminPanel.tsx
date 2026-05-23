'use client';

import { useState, useEffect } from 'react';
import { GAME_EVENTS } from '@/lib/pusher';
import { getRandomCards } from '@/lib/deck';
import { CardData, GameLanguage, GameType } from '@/types/game';
import { useGameContext } from '@/context/GameContext';
import { postPusher, postStart, postStop } from '@/lib/admin-api';
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
  const { gameState, revealedCards, sessionId, cardCount } = useGameContext();
  
  const [playerId, setPlayerId] = useState('');
  const [betAmount, setBetAmount] = useState('');
  const [language, setLanguage] = useState<GameLanguage>('en');
  const [localGameType, setLocalGameType] = useState<GameType>('NIU_NIU_TRIPLE');
  const [localCardCount, setLocalCardCount] = useState(5);
  const [durationMinutes, setDurationMinutes] = useState('180');
  const [fontScale, setFontScale] = useState(100);
  const [manualCards, setManualCards] = useState<(CardData | null)[]>([null, null, null, null, null]);

  const clearInput = () => { setPlayerId(''); setBetAmount(''); };

  const activeCardCount = gameState === 'GAME' ? cardCount : localCardCount;
  const allCardsSelected = manualCards.slice(0, activeCardCount).every((c) => c !== null);

  useEffect(() => {
    if (gameState === 'GAME' && currentCards && currentCards.length > 0) {
      setTimeout(() => {
        setManualCards((prev) => {
          const next = [...prev];
          currentCards.forEach((c, i) => {
            if (c && !next[i]) next[i] = c;
          });
          return next;
        });
      }, 0);
    }
  }, [gameState, currentCards]);

  const resolveCards = () => {
    const ok = manualCards.slice(0, localCardCount).every((c) => c !== null);
    return ok ? (manualCards.slice(0, localCardCount) as CardData[]) : getRandomCards(localCardCount);
  };

  const startGame = async () => {
    const cards = resolveCards();
    onCardsGenerated?.(cards);
    
    // Update local manualCards to match the generated/resolved cards so they show up in the grid
    setManualCards((prev) => {
      const next = [...prev];
      cards.forEach((c, i) => { next[i] = c; });
      return next;
    });

    const currentPid = playerId.trim();
    const currentBet = Number(betAmount) || 0;
    clearInput();
    await postStart({ 
      cards, 
      language, 
      gameType: localGameType, 
      cardCount: localCardCount, 
      durationMinutes: Number(durationMinutes) || 180,
      playerId: currentPid,
      betAmount: currentBet,
      fontScale
    });
  };

  const stopGame = async () => {
    onCardsGenerated?.([]);
    setManualCards([null, null, null, null, null]);
    await postStop(sessionId);
  };

  return (
    <div className={panel.panel}>
      <div className={grid.grid}>
        {/* Бокс А: Управление */}
        <section className={grid.block}>
          <div className={grid.boxHeader}>
            <h2 className={grid.blockTitleNoMargin}>Управление</h2>
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
            gameType={localGameType} setGameType={setLocalGameType} cardCount={localCardCount} setCardCount={setLocalCardCount}
            durationMinutes={durationMinutes} setDurationMinutes={setDurationMinutes}
            fontScale={fontScale} setFontScale={setFontScale}
          />
        </section>

        {/* Бокс Г: Карты */}
        <section className={grid.block}>
          <div className={grid.blockHead}>
            <h2 className={grid.blockTitleNoMargin}>Управление картами</h2>
            <button 
              type="button" 
              onClick={() => postPusher(GAME_EVENTS.REVEAL_ALL, {})} 
              className={grid.headBtn}
              disabled={!allCardsSelected}
            >
              ОТКРЫТЬ ВСЕ
            </button>
          </div>
          <AdminCardGrid
            cardCount={activeCardCount} selectedCards={manualCards}
            onCardChange={(idx, c) => setManualCards((p) => { const n = [...p]; n[idx] = c; return n; })}
            onRevealCard={(idx) => postPusher(GAME_EVENTS.REVEAL_CARD, { index: idx, card: manualCards[idx] })}
            revealedStates={revealedCards.slice(0, activeCardCount)}
            allCardsSelected={allCardsSelected}
          />
        </section>
      </div>
    </div>
  );
}
