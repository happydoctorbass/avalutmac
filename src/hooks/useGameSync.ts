'use client';

import { useEffect, useState } from 'react';
import { pusherClient, GAME_CHANNEL, GAME_EVENTS } from '@/lib/pusher';
import { CardData } from '@/lib/deck';

export function useGameSync() {
  const [gameState, setGameState] = useState<'IDLE' | 'GAME'>('IDLE');
  // Массив из 5 карт (false = закрыта, true = открыта)
  const [revealedCards, setRevealedCards] = useState<boolean[]>([false, false, false, false, false]);
  const [cards, setCards] = useState<CardData[]>([]);

  useEffect(() => {
    const client = pusherClient;
    if (!client) return;

    client.connection.bind('state_change', (states: any) => {
      console.log('Connection states:', states);
    });

    const channel = client.subscribe(GAME_CHANNEL);

    // Слушаем смену режима (IDLE/GAME)
    channel.bind(GAME_EVENTS.TOGGLE_STATE, (data: { state: 'IDLE' | 'GAME'; cards?: CardData[] }) => {
      setGameState(data.state);
      if (data.state === 'IDLE') {
        setRevealedCards([false, false, false, false, false]);
        setCards([]);
      } else if (data.state === 'GAME' && data.cards) {
        setCards(data.cards);
      }
    });

    // Слушаем переворот конкретной карты
    channel.bind(GAME_EVENTS.REVEAL_CARD, (data: { index: number; card?: CardData }) => {
      setRevealedCards(prev => {
        const next = [...prev];
        next[data.index] = true;
        return next;
      });
      if (data.card) {
        setCards(prev => {
          const next = [...prev];
          next[data.index] = data.card!;
          return next;
        });
      }
    });

    return () => {
      channel.unbind_all();
      client.unsubscribe(GAME_CHANNEL);
    };
  }, []);

  return { gameState, revealedCards, cards };
}