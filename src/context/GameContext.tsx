'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { getPusherClient, GAME_CHANNEL, GAME_EVENTS } from '@/lib/pusher';
import { CardData, GameStatus, ToggleStatePayload, RevealCardPayload, GameLanguage } from '@/types/game';
import { triggerWinConfetti } from '@/lib/confetti-helper';

interface GameContextValue {
  gameState: GameStatus;
  sessionId: number;
  cards: CardData[];
  revealedCards: boolean[];
  playerId: string;
  betAmount: number;
  language: GameLanguage;
}

const GameContext = createContext<GameContextValue | null>(null);
const ALL_REVEALED = [true, true, true, true, true] as const;
let listenerActive = false;

export function GameProvider({ children }: { children: ReactNode }) {
  const [gameState, setGameState] = useState<GameStatus>('IDLE');
  const [revealedCards, setRevealedCards] = useState<boolean[]>([false, false, false, false, false]);
  const [cards, setCards] = useState<CardData[]>([]);
  const [sessionId, setSessionId] = useState<number>(Date.now());
  const [playerId, setPlayerId] = useState('');
  const [betAmount, setBetAmount] = useState(0);
  const [language, setLanguage] = useState<GameLanguage>('en');

  useEffect(() => {
    const client = getPusherClient();
    if (!client || listenerActive) return;
    listenerActive = true;

    const channel = client.subscribe(GAME_CHANNEL);

    const onToggle = (d: ToggleStatePayload) => {
      setGameState(d.state);
      setRevealedCards([false, false, false, false, false]);
      if (d.state === 'IDLE') {
        setCards([]); setPlayerId(''); setBetAmount(0);
      } else {
        setSessionId(Date.now());
        if (d.cards) setCards(d.cards);
        if (d.playerId) setPlayerId(d.playerId);
        if (d.betAmount !== undefined) setBetAmount(d.betAmount);
        if (d.language) setLanguage(d.language);
      }
    };

    const onReveal = (d: RevealCardPayload) => {
      setRevealedCards(p => { const n = [...p]; n[d.index] = true; return n; });
      if (d.card) setCards(p => { const n = [...p]; n[d.index] = d.card!; return n; });
    };

    const onRevealAll = () => setRevealedCards([...ALL_REVEALED]);
    const onCelebrate = () => triggerWinConfetti();

    channel.bind(GAME_EVENTS.TOGGLE_STATE, onToggle);
    channel.bind(GAME_EVENTS.REVEAL_CARD, onReveal);
    channel.bind(GAME_EVENTS.REVEAL_ALL, onRevealAll);
    channel.bind(GAME_EVENTS.CELEBRATE, onCelebrate);

    const teardown = () => {
      channel.unbind(GAME_EVENTS.TOGGLE_STATE, onToggle);
      channel.unbind(GAME_EVENTS.REVEAL_CARD, onReveal);
      channel.unbind(GAME_EVENTS.REVEAL_ALL, onRevealAll);
      channel.unbind(GAME_EVENTS.CELEBRATE, onCelebrate);
      client.unsubscribe(GAME_CHANNEL);
      listenerActive = false;
    };

    window.addEventListener('beforeunload', teardown);
    return () => window.removeEventListener('beforeunload', teardown);
  }, []);

  return (
    <GameContext.Provider
      value={{ gameState, sessionId, cards, revealedCards, playerId, betAmount, language }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGameContext(): GameContextValue {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGameContext must be used within GameProvider');
  return ctx;
}
