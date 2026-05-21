'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { getPusherClient, GAME_CHANNEL, GAME_EVENTS } from '@/lib/pusher';
import { CardData, GameStatus, ToggleStatePayload, RevealCardPayload } from '@/types/game';

interface GameContextValue {
  gameState: GameStatus;
  sessionId: number;
  cards: CardData[];
  revealedCards: boolean[];
}

const GameContext = createContext<GameContextValue | null>(null);

let listenerActive = false;

export function GameProvider({ children }: { children: ReactNode }) {
  const [gameState, setGameState] = useState<GameStatus>('IDLE');
  const [revealedCards, setRevealedCards] = useState<boolean[]>([false, false, false, false, false]);
  const [cards, setCards] = useState<CardData[]>([]);
  const [sessionId, setSessionId] = useState<number>(Date.now());

  useEffect(() => {
    const client = getPusherClient();
    if (!client || listenerActive) return;
    listenerActive = true;

    console.log('🟢 Pusher Listener Active');

    client.connection.bind('state_change', (states: { current: string }) => {
      console.log('Connection status change:', states.current);
    });

    const channel = client.subscribe(GAME_CHANNEL);

    const onToggle = (data: ToggleStatePayload) => {
      console.log('Event received: TOGGLE_STATE');
      setGameState((prev) => {
        console.log('Current State before change:', prev);
        return data.state;
      });
      if (data.state === 'IDLE') {
        setRevealedCards([false, false, false, false, false]);
        setCards([]);
      } else if (data.state === 'GAME') {
        setSessionId(Date.now());
        setRevealedCards([false, false, false, false, false]);
        if (data.cards) setCards(data.cards);
      }
    };

    const onReveal = (data: RevealCardPayload) => {
      console.log('Event received: REVEAL_CARD');
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

    channel.bind(GAME_EVENTS.TOGGLE_STATE, onToggle);
    channel.bind(GAME_EVENTS.REVEAL_CARD, onReveal);

    const teardown = () => {
      channel.unbind(GAME_EVENTS.TOGGLE_STATE, onToggle);
      channel.unbind(GAME_EVENTS.REVEAL_CARD, onReveal);
      client.unsubscribe(GAME_CHANNEL);
      listenerActive = false;
    };

    window.addEventListener('beforeunload', teardown);
    return () => window.removeEventListener('beforeunload', teardown);
  }, []);

  return (
    <GameContext.Provider value={{ gameState, sessionId, cards, revealedCards }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGameContext(): GameContextValue {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGameContext must be used within GameProvider');
  return ctx;
}
