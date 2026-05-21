'use client';

import { useEffect, useState } from 'react';
import { pusherClient, GAME_CHANNEL, GAME_EVENTS } from '@/lib/pusher';
import { CardData, GameStatus, ToggleStatePayload, RevealCardPayload } from '@/types/game';

export function useGameSync() {
  const [gameState, setGameState] = useState<GameStatus>('IDLE');
  const [revealedCards, setRevealedCards] = useState<boolean[]>([false, false, false, false, false]);
  const [cards, setCards] = useState<CardData[]>([]);
  const [sessionId, setSessionId] = useState<number>(Date.now());

  useEffect(() => {
    const client = pusherClient;
    if (!client) return;

    client.connection.bind('state_change', (states: any) => {
      console.log('Connection states:', states);
    });

    const channel = client.subscribe(GAME_CHANNEL);

    // Слушаем смену режима (IDLE/GAME)
    channel.bind(GAME_EVENTS.TOGGLE_STATE, (data: ToggleStatePayload) => {
      setGameState(data.state);
      if (data.state === 'IDLE') {
        setRevealedCards([false, false, false, false, false]);
        setCards([]);
      } else if (data.state === 'GAME') {
        // Ключевое изменение: новая игра -> новый ID, сброс состояний карт
        setSessionId(Date.now());
        setRevealedCards([false, false, false, false, false]);
        if (data.cards) setCards(data.cards);
      }
    });

    // Слушаем переворот конкретной карты
    channel.bind(GAME_EVENTS.REVEAL_CARD, (data: RevealCardPayload) => {
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

  return { gameState, revealedCards, cards, sessionId };
}