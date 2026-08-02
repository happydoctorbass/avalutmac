import Pusher from 'pusher-js';

let instance: Pusher | null = null;
let warnedMissingKeys = false;

export function getPusherClient(warnIfMissing = false): Pusher | null {
  if (typeof window === 'undefined') return null;

  const key = process.env.NEXT_PUBLIC_PUSHER_KEY;
  const cluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER;

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
    instance = new Pusher(key, {
      cluster,
      forceTLS: true,
    });
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
} as const;
