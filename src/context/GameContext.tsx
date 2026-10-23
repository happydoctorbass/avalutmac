'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState, ReactNode } from 'react';
import { getPusherClient, GAME_CHANNEL, BroadcastMessage } from '@/lib/pusher';
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
  fontScale: number;
  bets: BetRow[];
}

const GameContext = createContext<GameContextValue | null>(null);

// Защита от дублирования событий при одновременной работе Pusher и BroadcastChannel
const processedEventIds = new Map<string, number>();
const processedSignatures = new Map<string, number>();

function isDuplicateEvent(event: string, rawData: unknown): boolean {
  const now = Date.now();

  // Очистка старых записей из памяти
  if (processedEventIds.size > 200) {
    for (const [k, ts] of processedEventIds.entries()) {
      if (now - ts > 60_000) processedEventIds.delete(k);
    }
  }
  if (processedSignatures.size > 200) {
    for (const [k, ts] of processedSignatures.entries()) {
      if (now - ts > 5_000) processedSignatures.delete(k);
    }
  }

  const dataObj = (rawData && typeof rawData === 'object') ? (rawData as Record<string, unknown>) : {};
  const eventId = typeof dataObj._eventId === 'string' ? dataObj._eventId : undefined;

  if (eventId) {
    const prev = processedEventIds.get(eventId);
    if (prev && now - prev < 60_000) {
      return true;
    }
    processedEventIds.set(eventId, now);
    return false;
  }

  // Fallback-дедупликация по сигнатуре и окну времени (1500 мс), если событие пришло без _eventId
  const { _eventId: _ignored, ...rest } = dataObj;
  const signature = `${event}:${JSON.stringify(rest)}`;
  const prevSigTs = processedSignatures.get(signature);
  if (prevSigTs && now - prevSigTs < 1500) {
    return true;
  }
  processedSignatures.set(signature, now);
  return false;
}

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
  const [fontScale, setFontScale] = useState(100);
  const [bets, setBets] = useState<BetRow[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('localBets');
    if (saved) { 
      try { 
        const parsed = JSON.parse(saved);
        setTimeout(() => setBets(parsed), 0);
      } catch {} 
    }
  }, []);

  const addBet = useCallback((b: BetRow) => {
    setBets((prev) => {
      if (prev.some((item) => item.id === b.id)) return prev;
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
    setLanguage, setGameType, setCardCount, setFinishAt, setFontScale, addBet, clearBets,
  }), [addBet, clearBets]);

  useEffect(() => {
    const rawHandlers = createPusherHandlers(setters) as Record<string, (data: unknown) => void>;

    const dispatchSafely = (event: string, data: unknown) => {
      const fn = rawHandlers[event];
      if (!fn) return;
      if (isDuplicateEvent(event, data)) return;
      fn(data);
    };

    // 1. Подписка на локальный BroadcastChannel('casino-game-channel') + внутривкладочный CustomEvent
    let bc: BroadcastChannel | null = null;
    try {
      if (typeof window !== 'undefined' && typeof BroadcastChannel !== 'undefined') {
        bc = new BroadcastChannel(GAME_CHANNEL);
        bc.onmessage = (msgEvent: MessageEvent<BroadcastMessage>) => {
          const payload = msgEvent.data;
          if (payload && typeof payload.event === 'string') {
            dispatchSafely(payload.event, payload.data);
          }
        };
      }
    } catch (err) {
      console.warn('[HybridSync] Failed to subscribe to BroadcastChannel:', err);
    }

    const onLocalCustomEvent = (e: Event) => {
      const custom = e as CustomEvent<BroadcastMessage>;
      if (custom.detail && typeof custom.detail.event === 'string') {
        dispatchSafely(custom.detail.event, custom.detail.data);
      }
    };
    if (typeof window !== 'undefined') {
      window.addEventListener(GAME_CHANNEL, onLocalCustomEvent);
    }

    // 2. Штатная подписка на Pusher (для облака / продакшена)
    const client = getPusherClient();
    const channel = client ? client.subscribe(GAME_CHANNEL) : null;
    const boundFns: Array<[string, (...args: unknown[]) => void]> = [];

    if (channel) {
      Object.keys(rawHandlers).forEach((ev) => {
        const wrapped = (data: unknown) => dispatchSafely(ev, data);
        boundFns.push([ev, wrapped]);
        channel.bind(ev, wrapped);
      });
    }

    return () => {
      if (bc) {
        try { bc.close(); } catch {}
      }
      if (typeof window !== 'undefined') {
        window.removeEventListener(GAME_CHANNEL, onLocalCustomEvent);
      }
      if (channel && client) {
        boundFns.forEach(([ev, wrapped]) => channel.unbind(ev, wrapped));
      }
    };
  }, [setters]);

  return (
    <GameContext.Provider value={{ gameState, sessionId, cards, revealedCards, playerId, betAmount, language, gameType, cardCount, finishAt, fontScale, bets }}>
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
