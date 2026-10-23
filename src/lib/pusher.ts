import Pusher from 'pusher-js';

let instance: Pusher | null = null;
let warnedMissingKeys = false;

export function getPusherClient(warnIfMissing = false): Pusher | null {
  if (typeof window === 'undefined') return null;

  const key = process.env.NEXT_PUBLIC_PUSHER_KEY?.trim();
  const cluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER?.trim();

  if (!key || !cluster) {
    if (warnIfMissing && !warnedMissingKeys) {
      console.warn(
        '[Pusher] NEXT_PUBLIC_PUSHER_KEY / NEXT_PUBLIC_PUSHER_CLUSTER missing — client not initialized.'
      );
      warnedMissingKeys = true;
    }
    return null;
  }

  if (!instance) {
    try {
      instance = new Pusher(key, {
        cluster,
        forceTLS: true,
      });
    } catch (err) {
      console.warn('[Pusher] Failed to initialize Pusher client:', err);
      return null;
    }
  }
  return instance;
}

export const GAME_CHANNEL = 'casino-game-channel';

export const GAME_EVENTS = {
  TOGGLE_STATE: 'toggle-state',
  REVEAL_CARD: 'reveal-card',
  REVEAL_ALL: 'reveal-all',
  CELEBRATE: 'celebrate-win',
  UPDATE_LANG: 'update-lang',
  NEW_BID: 'new-bid',
  CLEAR_BETS: 'clear-bets',
  BETS_UPDATED: 'bets-updated',
  UPDATE_FONT_SCALE: 'update-font-scale',
  UPDATE_CARD_SCALE: 'update-card-scale',
} as const;

export interface BroadcastMessage {
  event: string;
  data: Record<string, unknown>;
  eventId: string;
  timestamp: number;
}

export function createEventId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

export function emitLocalBroadcast(event: string, data: Record<string, unknown> = {}): string {
  const eventId = (typeof data._eventId === 'string' && data._eventId) ? data._eventId : createEventId();
  const payloadWithId = { ...data, _eventId: eventId };
  const message: BroadcastMessage = {
    event,
    data: payloadWithId,
    eventId,
    timestamp: Date.now(),
  };

  if (typeof window !== 'undefined') {
    try {
      if (typeof BroadcastChannel !== 'undefined') {
        const bc = new BroadcastChannel(GAME_CHANNEL);
        bc.postMessage(message);
        bc.close();
      }
    } catch (err) {
      console.warn('[HybridSync] BroadcastChannel send error:', err);
    }

    try {
      window.dispatchEvent(new CustomEvent<BroadcastMessage>(GAME_CHANNEL, { detail: message }));
    } catch {
      // Ignore if CustomEvent fails
    }
  }

  return eventId;
}
