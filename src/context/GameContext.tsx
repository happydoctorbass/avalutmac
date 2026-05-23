'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState, ReactNode } from 'react';
import { getPusherClient, GAME_CHANNEL, GAME_EVENTS } from '@/lib/pusher';
import { CardData, GameLanguage, GameStatus, GameType } from '@/types/game';
import { createPusherHandlers, GameSetters } from './pusher-handlers';
import { useHydrateGame } from './useHydrateGame';
import { AutoFinish } from './AutoFinish';

interface GameContextValue {
  gameState: GameStatus;
  sessionId: number;
  cards: CardData[];
  revealedCards: boolean[];
  playerId: string;
  betAmount: number;
  language: GameLanguage;
  gameType: GameType;
  cardCount: number;
  finishAt: string | null;
  dbSessionId: string | null;
  betsVersion: number;
}

const GameContext = createContext<GameContextValue | null>(null);
let listenerActive = false;

export function GameProvider({ children }: { children: ReactNode }) {
  const [gameState, setGameState] = useState<GameStatus>('IDLE');
  const [revealedCards, setRevealedCards] = useState([false, false, false, false, false]);
  const [cards, setCards] = useState<CardData[]>([]);
  const [sessionId, setSessionId] = useState(Date.now());
  const [playerId, setPlayerId] = useState('');
  const [betAmount, setBetAmount] = useState(0);
  const [language, setLanguage] = useState<GameLanguage>('en');
  const [gameType, setGameType] = useState<GameType>('NIU_NIU_TRIPLE');
  const [cardCount, setCardCount] = useState(5);
  const [finishAt, setFinishAt] = useState<string | null>(null);
  const [dbSessionId, setDbSessionId] = useState<string | null>(null);
  const [betsVersion, setBetsVersion] = useState(0);
  const bumpBets = useCallback(() => setBetsVersion((n) => n + 1), []);

  const setters: GameSetters = useMemo(() => ({
    setGameState, setRevealedCards, setCards, setSessionId, setPlayerId, setBetAmount,
    setLanguage, setGameType, setCardCount, setFinishAt, setDbSessionId, bumpBets,
  }), [bumpBets]);

  useHydrateGame(setters);

  useEffect(() => {
    const client = getPusherClient();
    if (!client || listenerActive) return;
    listenerActive = true;
    const channel = client.subscribe(GAME_CHANNEL);
    const handlers = createPusherHandlers(setters);
    Object.entries(handlers).forEach(([ev, fn]) => channel.bind(ev, fn));
    const teardown = () => { channel.unbind_all(); client.unsubscribe(GAME_CHANNEL); listenerActive = false; };
    window.addEventListener('beforeunload', teardown);
    return () => window.removeEventListener('beforeunload', teardown);
  }, [setters]);

  const value: GameContextValue = {
    gameState, sessionId, cards, revealedCards, playerId, betAmount, language, gameType, cardCount,
    finishAt, dbSessionId, betsVersion,
  };

  return (
    <GameContext.Provider value={value}>
      <AutoFinish finishAt={finishAt} gameState={gameState} />
      {children}
    </GameContext.Provider>
  );
}

export function useGameContext() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGameContext must be used within GameProvider');
  return ctx;
}
