'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { getPusherClient, GAME_CHANNEL, GAME_EVENTS } from '@/lib/pusher';
import { CardData, GameStatus, ToggleStatePayload, RevealCardPayload } from '@/types/game';

interface GameContextValue {
  gameState: GameStatus;
  sessionId: number;
  cards: CardData[];
  revealedCards: boolean[];
  playerId: string;
  betAmount: number;
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

  useEffect(() => {
    const client = getPusherClient();
    if (!client || listenerActive) return;
    listenerActive = true;
    console.log('🟢 Pusher Listener Active');

    const channel = client.subscribe(GAME_CHANNEL);

    const onToggle = (data: ToggleStatePayload) => {
      setGameState(data.state);
      if (data.state === 'IDLE') {
        setRevealedCards([false, false, false, false, false]);
        setCards([]);
        setPlayerId('');
        setBetAmount(0);
      } else if (data.state === 'GAME') {
        setSessionId(Date.now());
        setRevealedCards([false, false, false, false, false]);
        if (data.cards) setCards(data.cards);
        if (data.playerId) setPlayerId(data.playerId);
        if (data.betAmount !== undefined) setBetAmount(data.betAmount);
      }
    };

    const onReveal = (data: RevealCardPayload) => {
      setRevealedCards((prev) => {
        const next = [...prev];
        next[data.index] = true;
        return next;
      });
      if (data.card) {
        setCards((prev) => {
          const next = [...prev];
          next[data.index] = data.card!;
          return next;
        });
      }
    };

    const onRevealAll = () => setRevealedCards([...ALL_REVEALED]);

    channel.bind(GAME_EVENTS.TOGGLE_STATE, onToggle);
    channel.bind(GAME_EVENTS.REVEAL_CARD, onReveal);
    channel.bind(GAME_EVENTS.REVEAL_ALL, onRevealAll);

    const teardown = () => {
      channel.unbind(GAME_EVENTS.TOGGLE_STATE, onToggle);
      channel.unbind(GAME_EVENTS.REVEAL_CARD, onReveal);
      channel.unbind(GAME_EVENTS.REVEAL_ALL, onRevealAll);
      client.unsubscribe(GAME_CHANNEL);
      listenerActive = false;
    };

    window.addEventListener('beforeunload', teardown);
    return () => window.removeEventListener('beforeunload', teardown);
  }, []);

  return (
    <GameContext.Provider
      value={{ gameState, sessionId, cards, revealedCards, playerId, betAmount }}
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
