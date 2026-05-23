import Pusher from 'pusher-js';

let instance: Pusher | null = null;

export function getPusherClient(): Pusher | null {
  if (typeof window === 'undefined') return null;
  if (!instance) {
    instance = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
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
} as const;
