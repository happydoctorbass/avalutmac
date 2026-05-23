'use client';

import { useEffect, useRef } from 'react';
import { useFinishClock } from '@/hooks/useFinishClock';
import { GameStatus } from '@/types/game';

export function AutoFinish({ finishAt, gameState }: { finishAt: string | null; gameState: GameStatus }) {
  const sent = useRef(false);
  const { isExpired } = useFinishClock(finishAt, gameState === 'GAME');
  useEffect(() => { sent.current = false; }, [finishAt, gameState]);
  useEffect(() => {
    if (gameState !== 'GAME' || !isExpired || sent.current) return;
    sent.current = true;
    fetch('/api/game/autofinish', { method: 'POST' });
  }, [gameState, isExpired]);
  return null;
}
