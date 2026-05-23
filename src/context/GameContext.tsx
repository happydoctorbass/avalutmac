'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState, ReactNode } from 'react';
import { getPusherClient, GAME_CHANNEL, GAME_EVENTS } from '@/lib/pusher';
import { BetRow, CardData, GameLanguage, GameStatus, GameType } from '@/types/game';
import { createPusherHandlers, GameSetters } from './pusher-handlers';
import { AutoFinish } from './AutoFinish';

interface GameContextValue {
  gameState: GameStatus;
  sessionId: string;
  cards: CardData[];
  revealedCards: boolean[];
  playerId: string;
  betAmount: number;
  language: GameLanguage;
  gameType: GameType;
  cardCount: number;
  finishAt: string | null;
  bets: BetRow[];
}

const GameContext = createContext<GameContextValue | null>(null);
let listenerActive = false;

export function GameProvider({ children }: { children: ReactNode }) {
  const [gameState, setGameState] = useState<GameStatus>('IDLE');
  const [revealedCards, setRevealedCards] = useState([false, false, false, false, false]);
  const [cards, setCards] = useState<CardData[]>([]);
  const [sessionId, setSessionId] = useState('');
  const [playerId, setPlayerId] = useState('');
  const [betAmount, setBetAmount] = useState(0);
  const [language, setLanguage] = useState<GameLanguage>('en');
  const [gameType, setGameType] = useState<GameType>('NIU_NIU_TRIPLE');
  const [cardCount, setCardCount] = useState(5);
  const [finishAt, setFinishAt] = useState<string | null>(null);
  const [bets, setBets] = useState<BetRow[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('localBets');
    if (saved) { try { setBets(JSON.parse(saved)); } catch {} }
  }, []);

  const addBet = useCallback((b: BetRow) => {
    setBets((prev) => {
      const next = [b, ...prev].sort((x, y) => y.amount - x.amount);
      localStorage.setItem('localBets', JSON.stringify(next));
      return next;
    });
  }, []);

  const clearBets = useCallback(() => {
    setBets([]);
    localStorage.removeItem('localBets');
  }, []);

  const setters: GameSetters = useMemo(() => ({
    setGameState, setRevealedCards, setCards, setSessionId, setPlayerId, setBetAmount,
    setLanguage, setGameType, setCardCount, setFinishAt, addBet, clearBets,
  }), [addBet, clearBets]);

  useEffect(() => {
    const client = getPusherClient();
    if (!client || listenerActive) return;
    listenerActive = true;
    const channel = client.subscribe(GAME_CHANNEL);
    const handlers = createPusherHandlers(setters);
    Object.entries(handlers).forEach(([ev, fn]) => channel.bind(ev, fn as any));
    const teardown = () => { channel.unbind_all(); client.unsubscribe(GAME_CHANNEL); listenerActive = false; };
    window.addEventListener('beforeunload', teardown);
    return () => window.removeEventListener('beforeunload', teardown);
  }, [setters]);

  return (
    <GameContext.Provider value={{ gameState, sessionId, cards, revealedCards, playerId, betAmount, language, gameType, cardCount, finishAt, bets }}>
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
