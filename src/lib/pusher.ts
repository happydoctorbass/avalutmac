import Pusher from 'pusher-js';

console.log('Pusher Key:', process.env.NEXT_PUBLIC_PUSHER_KEY);

// Инициализируем клиент только в браузере
export const pusherClient = typeof window !== 'undefined'
  ? new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
      forceTLS: true,
    })
  : null;

export const GAME_CHANNEL = 'casino-game-channel';

export const GAME_EVENTS = {
  TOGGLE_STATE: 'toggle-state',
  REVEAL_CARD: 'reveal-card',
  RESET: 'reset-game',
} as const;