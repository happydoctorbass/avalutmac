import { GAME_EVENTS } from '@/lib/pusher';
import { CardData, GameLanguage, GameType } from '@/types/game';

export const postPusher = (event: string, data: object) =>
  fetch('/api/pusher', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ event, data }) });

export const postBid = (playerId: string, amount: number, sessionId: string) =>
  fetch('/api/bets', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ playerId, amount, sessionId }) });

export const postStart = (payload: {
  cards: CardData[]; language: GameLanguage; gameType: GameType; cardCount: number;
  durationMinutes: number; playerId?: string; betAmount?: number; fontScale?: number;
}) => fetch('/api/game/start', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });

export const postStop = (sessionId: string | null) =>
  fetch('/api/game/stop', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ sessionId }) });

export const sendLang = (language: GameLanguage) => postPusher(GAME_EVENTS.UPDATE_LANG, { language });
export const sendFontScale = (scale: number) => postPusher(GAME_EVENTS.UPDATE_FONT_SCALE, { scale });
