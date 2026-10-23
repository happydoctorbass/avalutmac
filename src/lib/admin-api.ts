import { GAME_EVENTS, createEventId, emitLocalBroadcast } from '@/lib/pusher';
import { finishAtFromMinutes } from '@/lib/format-clock';
import { CardData, GameLanguage, GameType } from '@/types/game';

const fallbackOkResponse = () =>
  new Response(JSON.stringify({ success: true, localOnly: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });

export const postPusher = async (event: string, data: Record<string, unknown> = {}) => {
  const _eventId = createEventId();
  const payload = { ...data, _eventId };

  // 1. Локальная отправка между вкладками через BroadcastChannel('casino-game-channel')
  emitLocalBroadcast(event, payload);

  // 2. Штатная отправка в Pusher API (облако / продакшен)
  try {
    return await fetch('/api/pusher', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event, data: payload }),
    });
  } catch (err) {
    console.warn(`[HybridSync] Pusher API unreachable for "${event}", using local BroadcastChannel:`, err);
    return fallbackOkResponse();
  }
};

export const postBid = async (playerId: string, amount: number, sessionId: string) => {
  const cleanPlayerId = playerId.trim();
  const numericAmount = Number(amount);
  const id = Math.random().toString(36).substring(2, 9);
  const createdAt = new Date().toISOString();
  const _eventId = createEventId();

  emitLocalBroadcast(GAME_EVENTS.NEW_BID, {
    id,
    playerId: cleanPlayerId,
    amount: numericAmount,
    createdAt,
    _eventId,
  });

  try {
    return await fetch('/api/bets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, playerId: cleanPlayerId, amount: numericAmount, sessionId, createdAt, _eventId }),
    });
  } catch (err) {
    console.warn('[HybridSync] /api/bets unreachable, handled via BroadcastChannel:', err);
    return fallbackOkResponse();
  }
};

export const postClearBets = async () => {
  const _eventId = createEventId();
  emitLocalBroadcast(GAME_EVENTS.CLEAR_BETS, { _eventId });

  try {
    return await fetch('/api/bets/clear', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ _eventId }),
    });
  } catch (err) {
    console.warn('[HybridSync] /api/bets/clear unreachable, handled via BroadcastChannel:', err);
    return fallbackOkResponse();
  }
};

export const postStart = async (payload: {
  cards: CardData[];
  language: GameLanguage;
  gameType: GameType;
  cardCount: number;
  durationMinutes: number;
  playerId?: string;
  betAmount?: number;
  fontScale?: number;
  cardScale?: number;
}) => {
  const minutes = Number(payload.durationMinutes) || 180;
  const finishAt = finishAtFromMinutes(minutes);
  const sessionId = Date.now().toString();
  const _eventId = createEventId();

  emitLocalBroadcast(GAME_EVENTS.TOGGLE_STATE, {
    state: 'GAME',
    cards: payload.cards,
    playerId: payload.playerId || '',
    betAmount: payload.betAmount || 0,
    language: payload.language,
    gameType: payload.gameType,
    cardCount: payload.cardCount,
    finishAt,
    sessionId,
    fontScale: payload.fontScale || 100,
    cardScale: payload.cardScale || 100,
    _eventId,
  });

  let bidId: string | undefined;
  let createdAt: string | undefined;
  let _bidEventId: string | undefined;

  if (payload.playerId && payload.betAmount) {
    bidId = Math.random().toString(36).substring(2, 9);
    createdAt = new Date().toISOString();
    _bidEventId = createEventId();

    emitLocalBroadcast(GAME_EVENTS.NEW_BID, {
      id: bidId,
      playerId: payload.playerId,
      amount: Number(payload.betAmount),
      createdAt,
      _eventId: _bidEventId,
    });
  }

  try {
    return await fetch('/api/game/start', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...payload,
        finishAt,
        sessionId,
        _eventId,
        bidId,
        createdAt,
        _bidEventId,
      }),
    });
  } catch (err) {
    console.warn('[HybridSync] /api/game/start unreachable, handled via BroadcastChannel:', err);
    return fallbackOkResponse();
  }
};

export const postStop = async (sessionId: string | null) => {
  const _eventId = createEventId();

  emitLocalBroadcast(GAME_EVENTS.TOGGLE_STATE, {
    state: 'IDLE',
    sessionId,
    _eventId,
  });

  try {
    return await fetch('/api/game/stop', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId, _eventId }),
    });
  } catch (err) {
    console.warn('[HybridSync] /api/game/stop unreachable, handled via BroadcastChannel:', err);
    return fallbackOkResponse();
  }
};

export const postAutoFinish = async () => {
  const revealEventId = createEventId();
  const celebrateEventId = createEventId();

  emitLocalBroadcast(GAME_EVENTS.REVEAL_ALL, { _eventId: revealEventId });
  emitLocalBroadcast(GAME_EVENTS.CELEBRATE, { _eventId: celebrateEventId });

  try {
    return await fetch('/api/game/autofinish', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ revealEventId, celebrateEventId }),
    });
  } catch (err) {
    console.warn('[HybridSync] /api/game/autofinish unreachable, handled via BroadcastChannel:', err);
    return fallbackOkResponse();
  }
};

export const sendLang = (language: GameLanguage) => postPusher(GAME_EVENTS.UPDATE_LANG, { language });
export const sendFontScale = (scale: number) => postPusher(GAME_EVENTS.UPDATE_FONT_SCALE, { scale });

export async function sendCardScale(scale: number): Promise<void> {
  await postPusher(GAME_EVENTS.UPDATE_CARD_SCALE, { scale });
}
